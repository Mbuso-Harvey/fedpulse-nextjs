"""Source-native capture and quality primitives for FedPulse.

This module deliberately does not fetch from, mutate, or fall back to a live
source. Collectors call it after obtaining bytes from an approved official
source. That separation keeps credentials out of manifests and makes a failed
or partial collection observable rather than convertible into demo data.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from hashlib import sha256
import json
from pathlib import Path
import re
from typing import Any, Mapping
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse


MANIFEST_VERSION = "1.0"


class SourceFoundationError(ValueError):
    """Raised when a source capture cannot be admitted safely."""


@dataclass(frozen=True)
class SourceDefinition:
    source_id: str
    country: str
    name: str
    approved_hosts: tuple[str, ...]
    cadence: str
    record_type: str
    required_record_fields: tuple[str, ...]


# This registry is intentionally small. New sources require an explicit
# commercial, legal, schema, and quality decision before they are admitted.
SOURCE_REGISTRY: dict[str, SourceDefinition] = {
    "C1_CANADABUYS_TENDERS": SourceDefinition(
        source_id="C1_CANADABUYS_TENDERS",
        country="CA",
        name="CanadaBuys tender notices",
        approved_hosts=("open.canada.ca", "donnees-data.tpsgc-pwgsc.gc.ca"),
        cadence="daily",
        record_type="tender_notice",
        required_record_fields=("native_id", "title", "published_at", "source_url"),
    ),
    "C2_CANADABUYS_AWARDS": SourceDefinition(
        source_id="C2_CANADABUYS_AWARDS",
        country="CA",
        name="CanadaBuys award notices",
        approved_hosts=("open.canada.ca", "donnees-data.tpsgc-pwgsc.gc.ca"),
        cadence="publisher_metadata_checked",
        record_type="award_notice",
        required_record_fields=("native_id", "title", "source_url"),
    ),
    "C3_CANADABUYS_CONTRACT_HISTORY": SourceDefinition(
        source_id="C3_CANADABUYS_CONTRACT_HISTORY",
        country="CA",
        name="CanadaBuys contract history",
        approved_hosts=("open.canada.ca", "donnees-data.tpsgc-pwgsc.gc.ca"),
        cadence="monthly",
        record_type="contract_history",
        required_record_fields=("native_id", "source_url"),
    ),
    "U1_SAM_OPPORTUNITIES": SourceDefinition(
        source_id="U1_SAM_OPPORTUNITIES",
        country="US",
        name="SAM.gov opportunities",
        approved_hosts=("api.sam.gov", "sam.gov"),
        cadence="active_daily_archive_weekly",
        record_type="opportunity",
        required_record_fields=("native_id", "title", "posted_at", "source_url"),
    ),
    "U2_SAM_PUBLIC_DOCUMENTS": SourceDefinition(
        source_id="U2_SAM_PUBLIC_DOCUMENTS",
        country="US",
        name="SAM.gov public opportunity material",
        approved_hosts=("api.sam.gov", "sam.gov"),
        cadence="with_parent_opportunity",
        record_type="opportunity_document",
        required_record_fields=("native_id", "parent_native_id", "source_url"),
    ),
    "U3_USASPENDING_AWARDS": SourceDefinition(
        source_id="U3_USASPENDING_AWARDS",
        country="US",
        name="USAspending awards",
        approved_hosts=("api.usaspending.gov", "usaspending.gov", "www.usaspending.gov"),
        cadence="source_update_checked",
        record_type="award",
        required_record_fields=("native_id", "source_url"),
    ),
}


SENSITIVE_QUERY_KEYS = frozenset({"api_key", "apikey", "key", "token", "access_token", "authorization"})
SAFE_CAPTURE_NAME = re.compile(r"^[a-z0-9][a-z0-9._-]{0,127}$")


@dataclass(frozen=True)
class CaptureManifest:
    manifest_version: str
    capture_id: str
    source_id: str
    country: str
    resource_url: str
    acquired_at: str
    source_updated_at: str | None
    request_metadata: dict[str, str]
    content_sha256: str
    byte_size: int
    content_type: str | None
    parser_version: str
    schema_version: str


@dataclass(frozen=True)
class RecordValidation:
    status: str
    reasons: tuple[str, ...]


def source_definition(source_id: str) -> SourceDefinition:
    try:
        return SOURCE_REGISTRY[source_id]
    except KeyError as exc:
        raise SourceFoundationError(f"Unknown source_id: {source_id}") from exc


def registry_for_country(country: str) -> tuple[SourceDefinition, ...]:
    country = country.upper()
    return tuple(source for source in SOURCE_REGISTRY.values() if source.country == country)


def redact_request_metadata(metadata: Mapping[str, Any] | None) -> dict[str, str]:
    """Return safe manifest metadata without secrets or request payloads."""
    safe: dict[str, str] = {}
    for key, value in (metadata or {}).items():
        normalized_key = str(key).strip().lower()
        if normalized_key in SENSITIVE_QUERY_KEYS or "token" in normalized_key or "secret" in normalized_key:
            safe[str(key)] = "[REDACTED]"
        elif value is not None:
            safe[str(key)] = str(value)
    return safe


def redact_resource_url(resource_url: str) -> str:
    """Retain a reproducible resource location without retaining query secrets."""
    parsed = urlparse(resource_url)
    redacted_query = [
        (key, "[REDACTED]" if key.strip().lower() in SENSITIVE_QUERY_KEYS or "token" in key.strip().lower() or "secret" in key.strip().lower() else value)
        for key, value in parse_qsl(parsed.query, keep_blank_values=True)
    ]
    return urlunparse(parsed._replace(query=urlencode(redacted_query)))


def validate_resource_url(source_id: str, resource_url: str) -> None:
    source = source_definition(source_id)
    parsed = urlparse(resource_url)
    host = (parsed.hostname or "").lower()
    if parsed.scheme != "https" or host not in source.approved_hosts:
        raise SourceFoundationError(
            f"{source_id} capture must use HTTPS from an approved official host; received {resource_url!r}"
        )


def validate_record(source_id: str, record: Mapping[str, Any]) -> RecordValidation:
    source = source_definition(source_id)
    missing = tuple(field for field in source.required_record_fields if not record.get(field))
    country = record.get("country")
    if country and str(country).upper() != source.country:
        return RecordValidation("quarantined", missing + ("country_mismatch",))
    if missing:
        return RecordValidation("quarantined", tuple(f"missing_{field}" for field in missing))
    try:
        validate_resource_url(source_id, str(record["source_url"]))
    except SourceFoundationError:
        return RecordValidation("quarantined", ("unapproved_source_url",))
    return RecordValidation("accepted", ())


def build_capture_manifest(
    *,
    source_id: str,
    resource_url: str,
    raw_bytes: bytes,
    acquired_at: datetime | None = None,
    source_updated_at: str | None = None,
    request_metadata: Mapping[str, Any] | None = None,
    content_type: str | None = None,
    parser_version: str = "unparsed",
    schema_version: str = "raw-v1",
) -> CaptureManifest:
    """Build a manifest for immutable source bytes without storing secrets."""
    if not raw_bytes:
        raise SourceFoundationError("Empty source captures cannot be admitted")
    validate_resource_url(source_id, resource_url)
    source = source_definition(source_id)
    acquired = (acquired_at or datetime.now(timezone.utc)).astimezone(timezone.utc)
    digest = sha256(raw_bytes).hexdigest()
    timestamp = acquired.strftime("%Y%m%dT%H%M%SZ")
    return CaptureManifest(
        manifest_version=MANIFEST_VERSION,
        capture_id=f"{source_id.lower()}-{timestamp}-{digest[:12]}",
        source_id=source.source_id,
        country=source.country,
        resource_url=redact_resource_url(resource_url),
        acquired_at=acquired.isoformat().replace("+00:00", "Z"),
        source_updated_at=source_updated_at,
        request_metadata=redact_request_metadata(request_metadata),
        content_sha256=digest,
        byte_size=len(raw_bytes),
        content_type=content_type,
        parser_version=parser_version,
        schema_version=schema_version,
    )


def write_immutable_capture(capture_root: Path, manifest: CaptureManifest, raw_bytes: bytes, extension: str) -> tuple[Path, Path]:
    """Persist a capture once; collision with differing bytes is a hard failure."""
    if not extension.startswith(".") or not SAFE_CAPTURE_NAME.fullmatch(extension[1:].lower()):
        raise SourceFoundationError("Capture extension must be a safe file extension")
    if sha256(raw_bytes).hexdigest() != manifest.content_sha256:
        raise SourceFoundationError("Capture bytes do not match manifest checksum")
    target_dir = capture_root / manifest.country.lower() / manifest.source_id.lower()
    raw_path = target_dir / f"{manifest.capture_id}{extension.lower()}"
    manifest_path = target_dir / f"{manifest.capture_id}.manifest.json"
    target_dir.mkdir(parents=True, exist_ok=True)

    if raw_path.exists() and raw_path.read_bytes() != raw_bytes:
        raise SourceFoundationError(f"Immutable capture collision at {raw_path}")
    if not raw_path.exists():
        raw_path.write_bytes(raw_bytes)
    serialized = json.dumps(asdict(manifest), indent=2, sort_keys=True) + "\n"
    if manifest_path.exists() and manifest_path.read_text(encoding="utf-8") != serialized:
        raise SourceFoundationError(f"Immutable manifest collision at {manifest_path}")
    if not manifest_path.exists():
        manifest_path.write_text(serialized, encoding="utf-8")
    return raw_path, manifest_path
