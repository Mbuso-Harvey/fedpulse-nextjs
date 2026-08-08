"""Immutable, verified product releases for FedPulse customer products.

Canonical artifacts are evidence inputs, not customer-facing data products.
This module is the boundary between them: it verifies the country-scoped
canonical inputs, applies deterministic release controls, and writes an
immutable product artifact with its own provenance manifest.  A reader must
verify this manifest before returning a product record to a customer.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime
from hashlib import sha256
import json
from pathlib import Path
from typing import Any, Iterable, Mapping

from services.canonical_artifacts import CanonicalArtifactError, verify_canonical_artifact_set
from services.compliance_intelligence import COMPLIANCE_ENGINE_VERSION
from services.renewal_intelligence import RENEWAL_ENGINE_VERSION, RenewalWatchBuild


PRODUCT_RELEASE_MANIFEST_VERSION = "1.0"
PRODUCT_RELEASE_LAYOUT_VERSION = "product-release-v1"
PRODUCT_RELEASE_GATE_STATUS = "passed"


class ProductReleaseError(RuntimeError):
    """Raised when a product cannot be safely released to customers."""


@dataclass(frozen=True)
class ProductRelease:
    release_id: str
    release_dir: Path
    records_path: Path
    manifest_path: Path
    manifest: Mapping[str, Any]


def _digest(content: bytes) -> str:
    return sha256(content).hexdigest()


def _jsonl(records: Iterable[Mapping[str, Any]]) -> bytes:
    return b"".join(
        json.dumps(record, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8") + b"\n"
        for record in records
    )


def _write_immutable(path: Path, content: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        if path.read_bytes() != content:
            raise ProductReleaseError(f"Immutable product artifact collision at {path}")
        return
    path.write_bytes(content)


def _capture_date(value: Any) -> date:
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00")).date()
    except ValueError as exc:
        raise ProductReleaseError("Canonical input has an invalid capture acquisition timestamp") from exc


def _verified_inputs(
    *,
    country: str,
    input_manifest_paths: Iterable[Path],
    required_source_ids: set[str],
    as_of: date,
    max_capture_age_days: int,
) -> tuple[list[dict[str, str]], tuple[str, ...]]:
    if max_capture_age_days < 0:
        raise ProductReleaseError("max_capture_age_days cannot be negative")
    manifests = tuple(Path(path) for path in input_manifest_paths)
    if not manifests:
        raise ProductReleaseError("A product release requires at least one canonical input")

    sources_seen: set[str] = set()
    input_metadata: list[dict[str, str]] = []
    for manifest_path in manifests:
        try:
            artifact = verify_canonical_artifact_set(manifest_path)
        except CanonicalArtifactError as exc:
            raise ProductReleaseError(f"Product release input failed canonical verification: {exc}") from exc
        source = artifact.manifest["source"]
        source_id = str(source["source_id"])
        if source["country"] != country:
            raise ProductReleaseError("Product release cannot mix countries")
        capture_acquired_at = str(source["capture_acquired_at"])
        age_days = (as_of - _capture_date(capture_acquired_at)).days
        if age_days < 0 or age_days > max_capture_age_days:
            raise ProductReleaseError(
                f"Canonical input {source_id} is outside the release freshness SLA ({age_days} days)"
            )
        sources_seen.add(source_id)
        input_metadata.append(
            {
                "source_id": source_id,
                "country": country,
                "capture_id": str(source["capture_id"]),
                "capture_content_sha256": str(source["capture_content_sha256"]),
                "capture_acquired_at": capture_acquired_at,
                "canonical_manifest_sha256": _digest(manifest_path.read_bytes()),
                "canonical_manifest_path": str(manifest_path),
            }
        )
    missing = required_source_ids - sources_seen
    if missing:
        raise ProductReleaseError(f"Product release lacks required official sources: {', '.join(sorted(missing))}")
    input_metadata.sort(key=lambda item: (item["source_id"], item["capture_id"], item["canonical_manifest_sha256"]))
    return input_metadata, tuple(sorted(sources_seen))


def materialize_product_release(
    *,
    product: str,
    country: str,
    engine_version: str,
    records: Iterable[Mapping[str, Any]],
    input_manifest_paths: Iterable[Path],
    required_source_ids: Iterable[str],
    as_of: date,
    coverage_through: date,
    max_capture_age_days: int,
    release_root: Path,
    customer_scope_id: str | None = None,
) -> ProductRelease:
    """Write an immutable, customer-readable release after deterministic checks.

    This function deliberately refuses cross-market data, stale evidence,
    missing required source coverage, malformed product records, and records
    without a source-evidence/limitations boundary.  An empty result set is a
    valid release when the verified evidence contains no current candidates.
    """
    if country not in {"CA", "US"}:
        raise ProductReleaseError("Product release country must be CA or US")
    if not product.strip() or not engine_version.strip():
        raise ProductReleaseError("Product release requires a product and engine version")
    if customer_scope_id is not None and not customer_scope_id.strip():
        raise ProductReleaseError("customer_scope_id cannot be blank")
    if coverage_through > as_of:
        raise ProductReleaseError("coverage_through cannot be after as_of")

    input_metadata, source_ids = _verified_inputs(
        country=country,
        input_manifest_paths=input_manifest_paths,
        required_source_ids=set(required_source_ids),
        as_of=as_of,
        max_capture_age_days=max_capture_age_days,
    )
    release_records = tuple(dict(record) for record in records)
    for record in release_records:
        if record.get("country") != country or record.get("product") != product:
            raise ProductReleaseError("Product record country or product does not match its release")
        if not isinstance(record.get("evidence"), Mapping) or not record["evidence"]:
            raise ProductReleaseError("Product record is missing source evidence")
        if not isinstance(record.get("limitations"), list) or not record["limitations"]:
            raise ProductReleaseError("Product record is missing limitations")

    records_bytes = _jsonl(release_records)
    release_seed = json.dumps(
        {
            "product": product,
            "country": country,
            "engine_version": engine_version,
            "as_of": as_of.isoformat(),
            "coverage_through": coverage_through.isoformat(),
            "customer_scope_id": customer_scope_id,
            "input_manifests": [item["canonical_manifest_sha256"] for item in input_metadata],
            "records_sha256": _digest(records_bytes),
        },
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    release_id = f"{country.lower()}-{product}-{as_of:%Y%m%d}-{_digest(release_seed)[:16]}"
    release_dir = release_root / country.lower() / product / release_id / PRODUCT_RELEASE_LAYOUT_VERSION
    records_path = release_dir / "records.jsonl"
    manifest_path = release_dir / "release.manifest.json"
    manifest = {
        "manifest_version": PRODUCT_RELEASE_MANIFEST_VERSION,
        "release_id": release_id,
        "country": country,
        "product": product,
        "engine_version": engine_version,
        "as_of": as_of.isoformat(),
        "coverage_through": coverage_through.isoformat(),
        "release_status": "released",
        "audience": {"scope": "customer" if customer_scope_id else "market", "customer_scope_id": customer_scope_id},
        "records": {"file": records_path.name, "record_count": len(release_records), "sha256": _digest(records_bytes)},
        "inputs": input_metadata,
        "source_ids": list(source_ids),
        "automated_gate": {
            "status": PRODUCT_RELEASE_GATE_STATUS,
            "checks": [
                "verified_canonical_inputs",
                "country_isolation",
                "required_source_coverage",
                "freshness_sla",
                "record_evidence_and_limitations",
                "immutable_release_checksum",
            ],
            "max_capture_age_days": max_capture_age_days,
        },
    }
    manifest_bytes = (json.dumps(manifest, indent=2, sort_keys=True) + "\n").encode("utf-8")
    _write_immutable(records_path, records_bytes)
    _write_immutable(manifest_path, manifest_bytes)
    return ProductRelease(release_id, release_dir, records_path, manifest_path, manifest)


def verify_product_release(manifest_path: Path) -> ProductRelease:
    """Verify the immutable product release before a customer API reads it."""
    if not manifest_path.is_file():
        raise ProductReleaseError(f"Product release manifest is missing: {manifest_path}")
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ProductReleaseError("Product release manifest is unreadable") from exc
    if (
        manifest.get("manifest_version") != PRODUCT_RELEASE_MANIFEST_VERSION
        or manifest.get("release_status") != "released"
        or manifest.get("automated_gate", {}).get("status") != PRODUCT_RELEASE_GATE_STATUS
    ):
        raise ProductReleaseError("Product release is not a verified released artifact")
    country = manifest.get("country")
    if country not in {"CA", "US"}:
        raise ProductReleaseError("Product release has invalid country")
    audience = manifest.get("audience", {})
    if audience.get("scope") not in {"market", "customer"} or (
        audience.get("scope") == "customer" and not audience.get("customer_scope_id")
    ):
        raise ProductReleaseError("Product release has an invalid audience scope")
    records_meta = manifest.get("records", {})
    records_path = manifest_path.parent / str(records_meta.get("file", ""))
    records_bytes = records_path.read_bytes() if records_path.is_file() else None
    if records_bytes is None or _digest(records_bytes) != records_meta.get("sha256"):
        raise ProductReleaseError("Product release records checksum does not match its manifest")
    records = tuple(json.loads(line) for line in records_bytes.decode("utf-8").splitlines() if line)
    if len(records) != records_meta.get("record_count"):
        raise ProductReleaseError("Product release record count does not match its manifest")
    for input_metadata in manifest.get("inputs", []):
        canonical_path = Path(input_metadata["canonical_manifest_path"])
        if not canonical_path.is_file() or _digest(canonical_path.read_bytes()) != input_metadata.get("canonical_manifest_sha256"):
            raise ProductReleaseError("Product release canonical input is missing or changed")
        try:
            artifact = verify_canonical_artifact_set(canonical_path)
        except CanonicalArtifactError as exc:
            raise ProductReleaseError(f"Product release canonical input no longer verifies: {exc}") from exc
        if artifact.manifest["source"]["country"] != country:
            raise ProductReleaseError("Product release canonical input mixes countries")
    return ProductRelease(str(manifest["release_id"]), manifest_path.parent, records_path, manifest_path, manifest)


def release_canadian_renewal_watch(
    *,
    build: RenewalWatchBuild,
    contract_manifest_path: Path,
    award_manifest_path: Path | None,
    release_root: Path,
    max_capture_age_days: int = 35,
) -> ProductRelease:
    """Release a verified Canada Renewal Watch build to the product store."""
    inputs = [contract_manifest_path]
    if award_manifest_path:
        inputs.append(award_manifest_path)
    return materialize_product_release(
        product="renewal_watch",
        country="CA",
        engine_version=RENEWAL_ENGINE_VERSION,
        records=build.candidates,
        input_manifest_paths=inputs,
        required_source_ids={"C3_CANADABUYS_CONTRACT_HISTORY"},
        as_of=build.as_of,
        coverage_through=build.as_of,
        max_capture_age_days=max_capture_age_days,
        release_root=release_root,
    )


def release_us_compliance_assessments(
    *,
    assessments: Iterable[Mapping[str, Any]],
    opportunity_manifest_path: Path,
    document_manifest_paths: Iterable[Path],
    as_of: date,
    release_root: Path,
    max_capture_age_days: int = 2,
) -> ProductRelease:
    """Release U.S. advisory compliance assessments backed by U1 and U2 evidence."""
    assessment_records = tuple(dict(assessment) for assessment in assessments)
    profile_ids = {str(record.get("customer_profile_id") or "").strip() for record in assessment_records}
    if len(profile_ids) != 1 or not next(iter(profile_ids)):
        raise ProductReleaseError("U.S. compliance release requires exactly one customer capability profile")
    return materialize_product_release(
        product="bid_no_bid_compliance_analyst",
        country="US",
        engine_version=COMPLIANCE_ENGINE_VERSION,
        records=assessment_records,
        input_manifest_paths=[opportunity_manifest_path, *document_manifest_paths],
        required_source_ids={"U1_SAM_OPPORTUNITIES", "U2_SAM_PUBLIC_DOCUMENTS"},
        as_of=as_of,
        coverage_through=as_of,
        max_capture_age_days=max_capture_age_days,
        release_root=release_root,
        customer_scope_id=next(iter(profile_ids)),
    )
