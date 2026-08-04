#!/usr/bin/env python3
"""Validate, reconcile, and load a versioned Canada Renewal Watch dataset.

The loader is deliberately fail-closed. It will not activate a product version
unless the source file passes validation, the database row count reconciles,
and optional expected count/hash assertions pass.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any, Iterable

import pandas as pd
from supabase import Client, create_client

PRODUCT_ID = "ca-renewal-watch"
TARGET_TABLE = "fedpulse_ca_renewal_candidates"
VERSIONS_TABLE = "fedpulse_product_versions"

REQUIRED_COLUMNS = {
    "contract_number",
    "buyer_department",
    "clean_contract_end_date",
    "clean_contract_value",
}

OUTPUT_COLUMNS = [
    "product_id",
    "product_version",
    "record_id",
    "contract_number",
    "supplier_master_id",
    "supplier_master_name",
    "supplier_master_match_status",
    "reference_number",
    "title",
    "buyer_department",
    "procurement_category",
    "award_date",
    "contract_start_date",
    "clean_contract_end_date",
    "days_until_end",
    "clean_contract_value",
    "quality_tier",
    "renewal_score",
    "source_record_id",
    "source_url",
    "row_sha256",
]

DATE_COLUMNS = ["award_date", "contract_start_date", "clean_contract_end_date"]
NUMERIC_COLUMNS = ["days_until_end", "clean_contract_value", "renewal_score"]


class ReconciliationError(RuntimeError):
    """Raised when the source dataset cannot be admitted as a product version."""


@dataclass(frozen=True)
class LoadResult:
    manifest: dict[str, Any]
    rows: list[dict[str, Any]]


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def canonical_json(value: dict[str, Any]) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), default=str)


def normalized_scalar(value: Any) -> Any:
    if pd.isna(value):
        return None
    if isinstance(value, pd.Timestamp):
        return value.date().isoformat()
    if hasattr(value, "item"):
        value = value.item()
    if isinstance(value, float) and value.is_integer():
        return int(value)
    return value


def stable_record_id(row: dict[str, Any]) -> str:
    identity = {
        "contract_number": row.get("contract_number"),
        "supplier": row.get("supplier_master_id") or row.get("supplier_master_name"),
        "reference_number": row.get("reference_number"),
        "clean_contract_end_date": row.get("clean_contract_end_date"),
    }
    return hashlib.sha256(canonical_json(identity).encode("utf-8")).hexdigest()


def row_hash(row: dict[str, Any]) -> str:
    excluded = {"product_id", "product_version", "record_id", "row_sha256"}
    payload = {key: value for key, value in row.items() if key not in excluded}
    return hashlib.sha256(canonical_json(payload).encode("utf-8")).hexdigest()


def prepare_dataset(
    source_path: Path,
    *,
    product_version: str,
    coverage_through: str | None,
    expected_count: int | None,
    expected_sha256: str | None,
) -> LoadResult:
    if not source_path.exists():
        raise ReconciliationError(f"Source file does not exist: {source_path}")

    dataset_sha256 = sha256_file(source_path)
    if expected_sha256 and dataset_sha256 != expected_sha256.lower():
        raise ReconciliationError(
            f"Dataset SHA mismatch: expected {expected_sha256}, got {dataset_sha256}"
        )

    frame = pd.read_csv(source_path, low_memory=False)
    missing = sorted(REQUIRED_COLUMNS - set(frame.columns))
    if missing:
        raise ReconciliationError(f"Missing required columns: {', '.join(missing)}")

    if expected_count is not None and len(frame) != expected_count:
        raise ReconciliationError(
            f"Source row-count mismatch: expected {expected_count}, got {len(frame)}"
        )

    for column in DATE_COLUMNS:
        if column in frame.columns:
            frame[column] = pd.to_datetime(frame[column], errors="coerce", utc=False)

    for column in NUMERIC_COLUMNS:
        if column in frame.columns:
            frame[column] = pd.to_numeric(frame[column], errors="coerce")

    if frame["contract_number"].isna().any():
        raise ReconciliationError("contract_number contains null values")

    rows: list[dict[str, Any]] = []
    for raw_row in frame.to_dict(orient="records"):
        row = {
            column: normalized_scalar(raw_row.get(column))
            for column in OUTPUT_COLUMNS
            if column not in {"product_id", "product_version", "record_id", "row_sha256"}
        }
        row["contract_number"] = str(row["contract_number"]).strip()
        if not row["contract_number"]:
            raise ReconciliationError("contract_number contains blank values")

        row["product_id"] = PRODUCT_ID
        row["product_version"] = product_version
        row["record_id"] = stable_record_id(row)
        row["row_sha256"] = row_hash(row)
        rows.append({column: row.get(column) for column in OUTPUT_COLUMNS})

    record_ids = [row["record_id"] for row in rows]
    duplicate_count = len(record_ids) - len(set(record_ids))
    if duplicate_count:
        raise ReconciliationError(
            f"Stable identity produced {duplicate_count} duplicate records; "
            "the dataset must be reconciled before activation"
        )

    values = pd.to_numeric(frame["clean_contract_value"], errors="coerce")
    end_dates = pd.to_datetime(frame["clean_contract_end_date"], errors="coerce")
    quality_counts = (
        frame["quality_tier"].fillna("missing").value_counts().to_dict()
        if "quality_tier" in frame.columns
        else {}
    )

    manifest: dict[str, Any] = {
        "product_id": PRODUCT_ID,
        "product_version": product_version,
        "country_code": "CA",
        "source_system": "CanadaBuys",
        "source_file": str(source_path.resolve()),
        "dataset_sha256": dataset_sha256,
        "source_row_count": int(len(frame)),
        "prepared_row_count": int(len(rows)),
        "unique_record_count": int(len(set(record_ids))),
        "duplicate_record_count": int(duplicate_count),
        "contract_number_unique_count": int(frame["contract_number"].nunique()),
        "total_contract_value": float(values.sum(skipna=True)),
        "missing_contract_value_count": int(values.isna().sum()),
        "missing_end_date_count": int(end_dates.isna().sum()),
        "minimum_end_date": (
            end_dates.min().date().isoformat() if end_dates.notna().any() else None
        ),
        "maximum_end_date": (
            end_dates.max().date().isoformat() if end_dates.notna().any() else None
        ),
        "quality_tier_counts": {str(k): int(v) for k, v in quality_counts.items()},
        "coverage_through": coverage_through,
        "generated_at": datetime.now(UTC).isoformat(),
        "status": "reconciled",
    }
    return LoadResult(manifest=manifest, rows=rows)


def chunks(rows: list[dict[str, Any]], size: int) -> Iterable[list[dict[str, Any]]]:
    for start in range(0, len(rows), size):
        yield rows[start : start + size]


def load_to_supabase(
    client: Client,
    result: LoadResult,
    *,
    source_resources: list[str],
    activate: bool,
    chunk_size: int,
) -> dict[str, Any]:
    manifest = result.manifest
    version = manifest["product_version"]

    version_row = {
        "product_id": PRODUCT_ID,
        "product_version": version,
        "country_code": "CA",
        "source_system": "CanadaBuys",
        "source_resources": source_resources,
        "coverage_through": manifest["coverage_through"],
        "generated_at": manifest["generated_at"],
        "row_count": manifest["prepared_row_count"],
        "dataset_sha256": manifest["dataset_sha256"],
        "status": "candidate",
        "reconciliation": manifest,
        "metadata": {"loader": "load_ca_renewals.py", "schema_version": "1.0"},
    }

    client.table(VERSIONS_TABLE).upsert(
        version_row,
        on_conflict="product_id,product_version",
    ).execute()

    client.table(TARGET_TABLE).delete().eq("product_version", version).execute()
    for batch in chunks(result.rows, chunk_size):
        client.table(TARGET_TABLE).upsert(
            batch,
            on_conflict="product_version,record_id",
        ).execute()

    verification = (
        client.table(TARGET_TABLE)
        .select("record_id", count="exact")
        .eq("product_version", version)
        .limit(1)
        .execute()
    )
    database_count = int(verification.count or 0)
    expected_count = int(manifest["prepared_row_count"])
    if database_count != expected_count:
        raise ReconciliationError(
            f"Database row-count mismatch: expected {expected_count}, got {database_count}"
        )

    manifest["database_row_count"] = database_count
    manifest["database_reconciled"] = True
    client.table(VERSIONS_TABLE).update(
        {"row_count": database_count, "reconciliation": manifest}
    ).eq("product_id", PRODUCT_ID).eq("product_version", version).execute()

    if activate:
        client.rpc(
            "fedpulse_activate_product_version",
            {"p_product_id": PRODUCT_ID, "p_product_version": version},
        ).execute()
        manifest["activated"] = True
    else:
        manifest["activated"] = False

    return manifest


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="Path to the Gold renewal CSV")
    parser.add_argument("--product-version", required=True)
    parser.add_argument("--coverage-through")
    parser.add_argument("--expected-count", type=int)
    parser.add_argument("--expected-sha256")
    parser.add_argument("--source-resource", action="append", default=[])
    parser.add_argument("--manifest", type=Path)
    parser.add_argument("--chunk-size", type=int, default=500)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--no-activate", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        result = prepare_dataset(
            args.source,
            product_version=args.product_version,
            coverage_through=args.coverage_through,
            expected_count=args.expected_count,
            expected_sha256=args.expected_sha256,
        )

        manifest = result.manifest
        if not args.dry_run:
            url = os.environ.get("SUPABASE_URL", "")
            service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
            if not url or not service_key:
                raise ReconciliationError(
                    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required"
                )
            manifest = load_to_supabase(
                create_client(url, service_key),
                result,
                source_resources=args.source_resource,
                activate=not args.no_activate,
                chunk_size=args.chunk_size,
            )

        output = json.dumps(manifest, indent=2, sort_keys=True)
        print(output)
        if args.manifest:
            args.manifest.parent.mkdir(parents=True, exist_ok=True)
            args.manifest.write_text(output + "\n", encoding="utf-8")
        return 0
    except (ReconciliationError, OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
