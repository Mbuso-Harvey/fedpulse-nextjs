"""Immutable persistence and review gating for parsed procurement captures.

Canonical artifacts are intentionally separate from raw captures and customer
data. A parser result is persisted as immutable accepted and quarantined JSONL
files plus a manifest that is always ineligible for product use until an
independent human-review workflow approves a later release.
"""

from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256
import json
from pathlib import Path
from typing import Any, Iterable, Mapping

from services.source_foundation import source_definition
from services.source_parsers import CANONICAL_SCHEMA_VERSION, PARSER_VERSION, ParsedCapture


ARTIFACT_MANIFEST_VERSION = "1.0"
REVIEW_STATUS_PENDING = "pending_human_review"


class CanonicalArtifactError(RuntimeError):
    """Raised when canonical artifacts cannot be materialized or verified safely."""


@dataclass(frozen=True)
class CanonicalArtifactSet:
    artifact_dir: Path
    accepted_path: Path
    quarantined_path: Path
    manifest_path: Path
    manifest: Mapping[str, Any]


def _jsonl(records: Iterable[Mapping[str, Any]]) -> bytes:
    return b"".join(
        json.dumps(record, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8") + b"\n"
        for record in records
    )


def _write_immutable(path: Path, content: bytes) -> None:
    """Write once, or prove an earlier identical artifact is being reused."""
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        if path.read_bytes() != content:
            raise CanonicalArtifactError(f"Immutable artifact collision at {path}")
        return
    path.write_bytes(content)


def _digest(content: bytes) -> str:
    return sha256(content).hexdigest()


def _validate_parsed_capture(parsed: ParsedCapture) -> None:
    source = source_definition(parsed.source_id)
    if parsed.country != source.country:
        raise CanonicalArtifactError("Parsed capture country does not match the source registry")
    if not parsed.capture_id or not parsed.capture_content_sha256 or not parsed.capture_acquired_at:
        raise CanonicalArtifactError("Parsed capture is missing required capture lineage")
    for record in parsed.accepted_records:
        source_capture = record.get("source_capture", {})
        if (
            record.get("quality_status") != "accepted"
            or record.get("source_id") != parsed.source_id
            or record.get("country") != parsed.country
            or source_capture.get("capture_id") != parsed.capture_id
            or source_capture.get("content_sha256") != parsed.capture_content_sha256
        ):
            raise CanonicalArtifactError("Accepted record does not match its parsed capture lineage")
    for record in parsed.quarantined_records:
        if (
            record.get("quality_status") != "quarantined"
            or record.get("source_id") != parsed.source_id
            or record.get("capture_id") != parsed.capture_id
        ):
            raise CanonicalArtifactError("Quarantined record does not match its parsed capture lineage")


def _artifact_dir(artifact_root: Path, parsed: ParsedCapture) -> Path:
    return artifact_root / parsed.country.lower() / parsed.source_id.lower() / parsed.capture_id / PARSER_VERSION


def materialize_parsed_capture(parsed: ParsedCapture, *, artifact_root: Path) -> CanonicalArtifactSet:
    """Persist a parsed capture as immutable, review-gated canonical artifacts."""
    _validate_parsed_capture(parsed)
    target_dir = _artifact_dir(artifact_root, parsed)
    accepted_path = target_dir / "accepted.jsonl"
    quarantined_path = target_dir / "quarantined.jsonl"
    manifest_path = target_dir / "canonical.manifest.json"
    accepted_bytes = _jsonl(parsed.accepted_records)
    quarantined_bytes = _jsonl(parsed.quarantined_records)
    manifest = {
        "manifest_version": ARTIFACT_MANIFEST_VERSION,
        "canonical_schema_version": CANONICAL_SCHEMA_VERSION,
        "parser_version": PARSER_VERSION,
        "source": {
            "source_id": parsed.source_id,
            "country": parsed.country,
            "capture_id": parsed.capture_id,
            "capture_content_sha256": parsed.capture_content_sha256,
            "capture_acquired_at": parsed.capture_acquired_at,
        },
        "artifacts": {
            "accepted": {"file": accepted_path.name, "record_count": len(parsed.accepted_records), "sha256": _digest(accepted_bytes)},
            "quarantined": {"file": quarantined_path.name, "record_count": len(parsed.quarantined_records), "sha256": _digest(quarantined_bytes)},
        },
        "review_gate": {
            "status": REVIEW_STATUS_PENDING,
            "requires_human_approval": True,
            "product_eligible": False,
        },
    }
    manifest_bytes = (json.dumps(manifest, indent=2, sort_keys=True) + "\n").encode("utf-8")
    _write_immutable(accepted_path, accepted_bytes)
    _write_immutable(quarantined_path, quarantined_bytes)
    _write_immutable(manifest_path, manifest_bytes)
    return CanonicalArtifactSet(
        artifact_dir=target_dir,
        accepted_path=accepted_path,
        quarantined_path=quarantined_path,
        manifest_path=manifest_path,
        manifest=manifest,
    )


def _read_jsonl(path: Path) -> tuple[dict[str, Any], ...]:
    if not path.is_file():
        raise CanonicalArtifactError(f"Canonical artifact is missing: {path}")
    try:
        return tuple(json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line)
    except json.JSONDecodeError as exc:
        raise CanonicalArtifactError(f"Canonical JSONL is malformed: {path}") from exc


def verify_canonical_artifact_set(manifest_path: Path) -> CanonicalArtifactSet:
    """Verify persisted bytes and enforce that pending artifacts stay out of products."""
    if not manifest_path.is_file():
        raise CanonicalArtifactError(f"Canonical manifest is missing: {manifest_path}")
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise CanonicalArtifactError(f"Canonical manifest is unreadable: {manifest_path}") from exc
    if manifest.get("canonical_schema_version") != CANONICAL_SCHEMA_VERSION or manifest.get("parser_version") != PARSER_VERSION:
        raise CanonicalArtifactError("Canonical manifest has an unsupported schema or parser version")
    review_gate = manifest.get("review_gate", {})
    if review_gate.get("status") != REVIEW_STATUS_PENDING or review_gate.get("product_eligible") is not False:
        raise CanonicalArtifactError("Canonical artifact review gate is invalid")

    artifact_dir = manifest_path.parent
    paths = {
        "accepted": artifact_dir / manifest["artifacts"]["accepted"]["file"],
        "quarantined": artifact_dir / manifest["artifacts"]["quarantined"]["file"],
    }
    for artifact_name, path in paths.items():
        raw = path.read_bytes() if path.is_file() else None
        metadata = manifest["artifacts"][artifact_name]
        if raw is None or _digest(raw) != metadata.get("sha256"):
            raise CanonicalArtifactError(f"Canonical {artifact_name} artifact checksum does not match its manifest")
        if len(_read_jsonl(path)) != metadata.get("record_count"):
            raise CanonicalArtifactError(f"Canonical {artifact_name} artifact count does not match its manifest")
    return CanonicalArtifactSet(
        artifact_dir=artifact_dir,
        accepted_path=paths["accepted"],
        quarantined_path=paths["quarantined"],
        manifest_path=manifest_path,
        manifest=manifest,
    )
