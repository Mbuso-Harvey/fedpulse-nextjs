"""Parse verified procurement captures into source-native canonical candidates.

Parsers never fetch, enrich, merge, or publish records. They verify the raw
capture and manifest first, then emit either a canonical candidate with field
provenance or a compact, reviewable quarantine entry. This preserves the
evidence boundary between raw source data and every later product decision.
"""

from __future__ import annotations

import csv
from dataclasses import dataclass
from hashlib import sha256
from io import BytesIO
import io
import json
from pathlib import Path
import re
from typing import Any, Mapping

from pypdf import PdfReader

from services.source_foundation import SourceFoundationError, source_definition, validate_record, validate_resource_url


CANONICAL_SCHEMA_VERSION = "canonical-procurement-v1"
PARSER_VERSION = "source-native-parser-v1"
SAM_DOCUMENT_PARSER_VERSION = "sam-public-document-parser-v1"


class SourceParseError(RuntimeError):
    """Raised when a raw capture cannot be safely interpreted."""


@dataclass(frozen=True)
class VerifiedCapture:
    raw_path: Path
    manifest_path: Path
    manifest: Mapping[str, Any]
    raw_bytes: bytes


@dataclass(frozen=True)
class ParsedCapture:
    source_id: str
    country: str
    capture_id: str
    capture_content_sha256: str
    capture_acquired_at: str
    accepted_records: tuple[dict[str, Any], ...]
    quarantined_records: tuple[dict[str, Any], ...]


def _text(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def _manifest_path(raw_path: Path) -> Path:
    return raw_path.with_name(f"{raw_path.stem}.manifest.json")


def load_verified_capture(raw_path: Path, *, expected_source_id: str | None = None) -> VerifiedCapture:
    """Load a raw capture only when its manifest, source scope, and digest agree."""
    if raw_path.name.endswith(".manifest.json"):
        raise SourceParseError("A capture manifest sidecar cannot be parsed as raw source data")
    if not raw_path.is_file():
        raise SourceParseError(f"Raw capture does not exist: {raw_path}")
    manifest_path = _manifest_path(raw_path)
    if not manifest_path.is_file():
        raise SourceParseError(f"Capture manifest does not exist: {manifest_path}")
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise SourceParseError(f"Capture manifest is unreadable: {manifest_path}") from exc

    source_id = _text(manifest.get("source_id"))
    if not source_id:
        raise SourceParseError("Capture manifest is missing source_id")
    if expected_source_id and source_id != expected_source_id:
        raise SourceParseError(f"Expected {expected_source_id}, received {source_id}")
    try:
        source = source_definition(source_id)
        validate_resource_url(source_id, str(manifest["resource_url"]))
    except (KeyError, SourceFoundationError) as exc:
        raise SourceParseError(f"Capture manifest has invalid source provenance: {source_id}") from exc
    if manifest.get("country") != source.country:
        raise SourceParseError(f"Capture country does not match registry for {source_id}")

    raw_bytes = raw_path.read_bytes()
    actual_digest = sha256(raw_bytes).hexdigest()
    if actual_digest != manifest.get("content_sha256"):
        raise SourceParseError("Raw capture checksum does not match its manifest")
    return VerifiedCapture(raw_path=raw_path, manifest_path=manifest_path, manifest=manifest, raw_bytes=raw_bytes)


def _field_status(source_field: str | None, value: Any) -> dict[str, str | None]:
    return {"status": "mapped" if _text(value) else "missing", "source_field": source_field}


def _canonical_record(
    *,
    capture: VerifiedCapture,
    native_id: Any,
    title: Any,
    published_at: Any,
    field_status: Mapping[str, Mapping[str, str | None]],
    source_fields: Mapping[str, Any],
) -> dict[str, Any]:
    manifest = capture.manifest
    source_id = str(manifest["source_id"])
    source = source_definition(source_id)
    normalized_native_id = _text(native_id)
    record_snapshot_id = sha256(
        f"{manifest['content_sha256']}\x00{normalized_native_id or ''}".encode("utf-8")
    ).hexdigest()
    return {
        "canonical_schema_version": CANONICAL_SCHEMA_VERSION,
        "canonical_id": f"{source.country}:{source_id}:{normalized_native_id or 'unidentified'}",
        "record_snapshot_id": record_snapshot_id,
        "record_type": source.record_type,
        "source_id": source_id,
        "country": source.country,
        "native_id": normalized_native_id,
        "title": _text(title),
        "published_at": _text(published_at),
        "source_url": manifest["resource_url"],
        "source_capture": {
            "capture_id": manifest["capture_id"],
            "content_sha256": manifest["content_sha256"],
            "acquired_at": manifest["acquired_at"],
            "source_updated_at": manifest.get("source_updated_at"),
        },
        "transformation": {"parser_version": PARSER_VERSION, "field_status": dict(field_status)},
        "product_lineage": {"status": "not_linked", "product_record_id": None},
        "quality_status": "accepted",
        "source_fields": {key: _text(value) for key, value in source_fields.items() if _text(value)},
    }


def _quarantine(*, capture: VerifiedCapture, row_number: int, native_id: Any, reasons: tuple[str, ...]) -> dict[str, Any]:
    return {
        "source_id": capture.manifest["source_id"],
        "capture_id": capture.manifest["capture_id"],
        "row_number": row_number,
        "native_id": _text(native_id),
        "quality_status": "quarantined",
        "reasons": list(reasons),
    }


def _admit_or_quarantine(
    *,
    capture: VerifiedCapture,
    row_number: int,
    native_id: Any,
    title: Any,
    published_at: Any,
    field_status: Mapping[str, Mapping[str, str | None]],
    source_fields: Mapping[str, Any],
) -> tuple[dict[str, Any] | None, dict[str, Any] | None]:
    candidate = _canonical_record(
        capture=capture,
        native_id=native_id,
        title=title,
        published_at=published_at,
        field_status=field_status,
        source_fields=source_fields,
    )
    validation_record = dict(candidate)
    # The canonical schema uses ``published_at`` for both markets; SAM's
    # source contract intentionally retains its native ``posted_at`` rule.
    if capture.manifest["source_id"] == "U1_SAM_OPPORTUNITIES":
        validation_record["posted_at"] = candidate["published_at"]
    validation = validate_record(str(capture.manifest["source_id"]), validation_record)
    if validation.status == "accepted":
        return candidate, None
    return None, _quarantine(
        capture=capture,
        row_number=row_number,
        native_id=native_id,
        reasons=validation.reasons,
    )


def parse_sam_opportunities_capture(raw_path: Path) -> ParsedCapture:
    """Parse a verified U1 SAM opportunities API response."""
    capture = load_verified_capture(raw_path, expected_source_id="U1_SAM_OPPORTUNITIES")
    try:
        payload = json.loads(capture.raw_bytes.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise SourceParseError("SAM capture is not valid UTF-8 JSON") from exc
    opportunities = payload.get("opportunitiesData") if isinstance(payload, dict) else None
    if not isinstance(opportunities, list):
        raise SourceParseError("SAM capture does not contain an opportunitiesData list")

    accepted: list[dict[str, Any]] = []
    quarantined: list[dict[str, Any]] = []
    for row_number, opportunity in enumerate(opportunities, start=1):
        if not isinstance(opportunity, Mapping):
            quarantined.append(_quarantine(capture=capture, row_number=row_number, native_id=None, reasons=("invalid_source_record",)))
            continue
        native_id = opportunity.get("noticeId")
        title = opportunity.get("title")
        published_at = opportunity.get("postedDate")
        candidate, reject = _admit_or_quarantine(
            capture=capture,
            row_number=row_number,
            native_id=native_id,
            title=title,
            published_at=published_at,
            field_status={
                "native_id": _field_status("noticeId", native_id),
                "title": _field_status("title", title),
                "published_at": _field_status("postedDate", published_at),
                "source_url": _field_status("capture_manifest.resource_url", capture.manifest["resource_url"]),
            },
            source_fields={
                "solicitation_number": opportunity.get("solicitationNumber"),
                "department": opportunity.get("department"),
                "notice_type": opportunity.get("type"),
                "response_deadline": opportunity.get("responseDeadLine"),
            },
        )
        if candidate:
            accepted.append(candidate)
        if reject:
            quarantined.append(reject)
    return ParsedCapture(
        source_id="U1_SAM_OPPORTUNITIES",
        country="US",
        capture_id=str(capture.manifest["capture_id"]),
        capture_content_sha256=str(capture.manifest["content_sha256"]),
        capture_acquired_at=str(capture.manifest["acquired_at"]),
        accepted_records=tuple(accepted),
        quarantined_records=tuple(quarantined),
    )


def _first_value(row: Mapping[str | None, Any], *field_names: str) -> tuple[str | None, str | None]:
    for field_name in field_names:
        value = row.get(field_name)
        if _text(value):
            return _text(value), field_name
    return None, None


def parse_canadabuys_tender_capture(raw_path: Path) -> ParsedCapture:
    """Parse a verified C1 CanadaBuys tender CSV into canonical candidates."""
    capture = load_verified_capture(raw_path, expected_source_id="C1_CANADABUYS_TENDERS")
    try:
        reader = csv.DictReader(io.StringIO(capture.raw_bytes.decode("utf-8-sig")))
    except UnicodeDecodeError as exc:
        raise SourceParseError("CanadaBuys tender capture is not UTF-8 CSV") from exc
    if not reader.fieldnames:
        raise SourceParseError("CanadaBuys tender capture has no CSV header")
    required_header_groups = (
        ("referenceNumber-numeroReference", "solicitationNumber-numeroSollicitation"),
        ("title-titre-eng", "title-titre-fra"),
        ("publicationDate-datePublication",),
    )
    if any(not set(group).intersection(reader.fieldnames) for group in required_header_groups):
        raise SourceParseError("CanadaBuys tender capture is missing canonical mapping headers")

    accepted: list[dict[str, Any]] = []
    quarantined: list[dict[str, Any]] = []
    for row_number, row in enumerate(reader, start=2):
        if not isinstance(row, Mapping):
            quarantined.append(_quarantine(capture=capture, row_number=row_number, native_id=None, reasons=("invalid_source_record",)))
            continue
        native_id, native_id_field = _first_value(row, "referenceNumber-numeroReference", "solicitationNumber-numeroSollicitation")
        title, title_field = _first_value(row, "title-titre-eng", "title-titre-fra")
        published_at, published_at_field = _first_value(row, "publicationDate-datePublication")
        candidate, reject = _admit_or_quarantine(
            capture=capture,
            row_number=row_number,
            native_id=native_id,
            title=title,
            published_at=published_at,
            field_status={
                "native_id": _field_status(native_id_field, native_id),
                "title": _field_status(title_field, title),
                "published_at": _field_status(published_at_field, published_at),
                "source_url": _field_status("capture_manifest.resource_url", capture.manifest["resource_url"]),
            },
            source_fields={
                "solicitation_number": row.get("solicitationNumber-numeroSollicitation"),
                "amendment_number": row.get("amendmentNumber-numeroModification"),
                "tender_status": row.get("tenderStatus-appelOffresStatut-eng"),
                "closing_at": row.get("tenderClosingDate-appelOffresDateCloture"),
                "contracting_entity": row.get("contractingEntityName-nomEntitContractante-eng"),
                "unspsc": row.get("unspsc"),
            },
        )
        if candidate:
            accepted.append(candidate)
        if reject:
            quarantined.append(reject)
    return ParsedCapture(
        source_id="C1_CANADABUYS_TENDERS",
        country="CA",
        capture_id=str(capture.manifest["capture_id"]),
        capture_content_sha256=str(capture.manifest["content_sha256"]),
        capture_acquired_at=str(capture.manifest["acquired_at"]),
        accepted_records=tuple(accepted),
        quarantined_records=tuple(quarantined),
    )


def _canadabuys_versioned_native_id(
    row: Mapping[str | None, Any],
    *native_id_fields: str,
) -> tuple[str | None, str | None]:
    """Return the publisher's business key plus its amendment where available."""
    base_id, base_field = _first_value(row, *native_id_fields)
    amendment, amendment_field = _first_value(row, "amendmentNumber-numeroModification")
    if not base_id:
        return None, base_field
    if amendment:
        return f"{base_id}~{amendment}", f"{base_field}+{amendment_field}"
    return base_id, base_field


def _parse_canadabuys_commercial_csv_capture(
    raw_path: Path,
    *,
    source_id: str,
    title_required: bool,
) -> ParsedCapture:
    """Parse current CanadaBuys award or contract-history CSV captures."""
    capture = load_verified_capture(raw_path, expected_source_id=source_id)
    try:
        reader = csv.DictReader(io.StringIO(capture.raw_bytes.decode("utf-8-sig")))
    except UnicodeDecodeError as exc:
        raise SourceParseError(f"{source_id} capture is not UTF-8 CSV") from exc
    if not reader.fieldnames:
        raise SourceParseError(f"{source_id} capture has no CSV header")
    native_id_fields = (
        "contractNumber-numeroContrat",
        "referenceNumber-numeroReference",
        "solicitationNumber-numeroSollicitation",
        "procurementNumber-numeroApprovisionnement",
    )
    required_header_groups = [native_id_fields, ("publicationDate-datePublication",)]
    if title_required:
        required_header_groups.append(("title-titre-eng", "title-titre-fra"))
    if any(not set(group).intersection(reader.fieldnames) for group in required_header_groups):
        raise SourceParseError(f"{source_id} capture is missing canonical mapping headers")

    accepted: list[dict[str, Any]] = []
    quarantined: list[dict[str, Any]] = []
    for row_number, row in enumerate(reader, start=2):
        if not isinstance(row, Mapping):
            quarantined.append(_quarantine(capture=capture, row_number=row_number, native_id=None, reasons=("invalid_source_record",)))
            continue
        native_id, native_id_field = _canadabuys_versioned_native_id(row, *native_id_fields)
        title, title_field = _first_value(row, "title-titre-eng", "title-titre-fra")
        published_at, published_at_field = _first_value(row, "publicationDate-datePublication")
        candidate, reject = _admit_or_quarantine(
            capture=capture,
            row_number=row_number,
            native_id=native_id,
            title=title,
            published_at=published_at,
            field_status={
                "native_id": _field_status(native_id_field, native_id),
                "title": _field_status(title_field, title),
                "published_at": _field_status(published_at_field, published_at),
                "source_url": _field_status("capture_manifest.resource_url", capture.manifest["resource_url"]),
            },
            source_fields={
                "contract_number": row.get("contractNumber-numeroContrat"),
                "reference_number": row.get("referenceNumber-numeroReference"),
                "solicitation_number": row.get("solicitationNumber-numeroSollicitation"),
                "amendment_number": row.get("amendmentNumber-numeroModification"),
                "award_date": row.get("contractAwardDate-dateAttributionContrat"),
                "contract_start_at": row.get("contractStartDate-contratDateDebut"),
                "contract_end_at": row.get("contractEndDate-dateFinContrat"),
                "contract_amount": row.get("contractAmount-montantContrat"),
                "total_contract_value": row.get("totalContractValue-valeurTotaleContrat"),
                "currency": row.get("contractCurrency-contratMonnaie"),
                "contract_status": row.get("contractStatus-statutContrat-eng") or row.get("awardStatus-attributionStatut-eng"),
                "supplier": row.get("supplierStandardizedName-nomNormaliseFournisseur-eng") or row.get("supplierLegalName-nomLegalFournisseur-eng"),
                "contracting_entity": row.get("contractingEntityName-nomEntitContractante-eng"),
                "unspsc": row.get("unspsc"),
            },
        )
        if candidate:
            accepted.append(candidate)
        if reject:
            quarantined.append(reject)
    return ParsedCapture(
        source_id=source_id,
        country="CA",
        capture_id=str(capture.manifest["capture_id"]),
        capture_content_sha256=str(capture.manifest["content_sha256"]),
        capture_acquired_at=str(capture.manifest["acquired_at"]),
        accepted_records=tuple(accepted),
        quarantined_records=tuple(quarantined),
    )


def parse_canadabuys_award_capture(raw_path: Path) -> ParsedCapture:
    """Parse a verified C2 CanadaBuys award CSV."""
    return _parse_canadabuys_commercial_csv_capture(
        raw_path,
        source_id="C2_CANADABUYS_AWARDS",
        title_required=True,
    )


def parse_canadabuys_contract_history_capture(raw_path: Path) -> ParsedCapture:
    """Parse a verified C3 CanadaBuys contract-history CSV for Renewal Watch."""
    return _parse_canadabuys_commercial_csv_capture(
        raw_path,
        source_id="C3_CANADABUYS_CONTRACT_HISTORY",
        title_required=False,
    )


def _sam_document_text(capture: VerifiedCapture) -> tuple[str, tuple[dict[str, Any], ...], str] | None:
    """Extract publicly captured SAM text while preserving page/passages."""
    content_type = str(capture.manifest.get("content_type") or "").split(";", 1)[0].lower()
    raw = capture.raw_bytes
    if content_type == "application/pdf" or raw.startswith(b"%PDF"):
        try:
            reader = PdfReader(BytesIO(raw))
            passages = []
            for page_number, page in enumerate(reader.pages, start=1):
                text = _text(page.extract_text())
                if text:
                    passages.append({"page": page_number, "text": text})
        except Exception as exc:  # pypdf has several format-specific error types.
            raise SourceParseError("SAM PDF capture could not be extracted") from exc
        full_text = "\n\n".join(passage["text"] for passage in passages)
        return (full_text, tuple(passages), "pdf") if full_text else None
    if content_type in {"text/plain", "text/html", "application/xhtml+xml"} or raw.lstrip().startswith(b"<"):
        try:
            decoded = raw.decode("utf-8")
        except UnicodeDecodeError as exc:
            raise SourceParseError("SAM text capture is not UTF-8") from exc
        if "html" in content_type or raw.lstrip().startswith(b"<"):
            decoded = re.sub(r"<[^>]+>", " ", decoded)
            decoded = re.sub(r"\s+", " ", decoded)
        text = _text(decoded)
        return (text, ({"page": 1, "text": text},), "text") if text else None
    return None


def parse_sam_public_document_capture(raw_path: Path) -> ParsedCapture:
    """Parse a verified U2 public document into source-linked text evidence."""
    capture = load_verified_capture(raw_path, expected_source_id="U2_SAM_PUBLIC_DOCUMENTS")
    parent_native_id = _text(capture.manifest.get("request_metadata", {}).get("parent_native_id"))
    resource_kind = _text(capture.manifest.get("request_metadata", {}).get("resource_kind"))
    if not parent_native_id or not resource_kind:
        raise SourceParseError("SAM public document capture is missing parent opportunity lineage")
    extracted = _sam_document_text(capture)
    document_native_id = "sam-document-" + sha256(
        f"{parent_native_id}\x00{capture.manifest['content_sha256']}".encode("utf-8")
    ).hexdigest()[:24]
    if not extracted:
        return ParsedCapture(
            source_id="U2_SAM_PUBLIC_DOCUMENTS",
            country="US",
            capture_id=str(capture.manifest["capture_id"]),
            capture_content_sha256=str(capture.manifest["content_sha256"]),
            capture_acquired_at=str(capture.manifest["acquired_at"]),
            accepted_records=(),
            quarantined_records=(
                _quarantine(
                    capture=capture,
                    row_number=1,
                    native_id=document_native_id,
                    reasons=("no_extractable_text",),
                ),
            ),
        )
    extracted_text, passages, file_type = extracted
    record = {
        "canonical_schema_version": CANONICAL_SCHEMA_VERSION,
        "canonical_id": f"US:U2_SAM_PUBLIC_DOCUMENTS:{document_native_id}",
        "record_snapshot_id": sha256(
            f"{capture.manifest['content_sha256']}\x00{document_native_id}".encode("utf-8")
        ).hexdigest(),
        "record_type": "opportunity_document",
        "source_id": "U2_SAM_PUBLIC_DOCUMENTS",
        "country": "US",
        "native_id": document_native_id,
        "parent_native_id": parent_native_id,
        "title": None,
        "published_at": None,
        "source_url": capture.manifest["resource_url"],
        "source_capture": {
            "capture_id": capture.manifest["capture_id"],
            "content_sha256": capture.manifest["content_sha256"],
            "acquired_at": capture.manifest["acquired_at"],
            "source_updated_at": capture.manifest.get("source_updated_at"),
        },
        "transformation": {
            "parser_version": SAM_DOCUMENT_PARSER_VERSION,
            "field_status": {
                "native_id": _field_status("derived_from_parent_and_capture_checksum", document_native_id),
                "parent_native_id": _field_status("capture_manifest.request_metadata.parent_native_id", parent_native_id),
                "source_url": _field_status("capture_manifest.resource_url", capture.manifest["resource_url"]),
                "extracted_text": _field_status("captured_document", extracted_text),
            },
        },
        "product_lineage": {"status": "not_linked", "product_record_id": None},
        "quality_status": "accepted",
        "document": {
            "resource_kind": resource_kind,
            "content_type": capture.manifest.get("content_type"),
            "file_type": file_type,
            "page_count": len(passages),
            "extracted_character_count": len(extracted_text),
            "passages": list(passages),
        },
    }
    validation = validate_record("U2_SAM_PUBLIC_DOCUMENTS", record)
    if validation.status != "accepted":
        return ParsedCapture(
            source_id="U2_SAM_PUBLIC_DOCUMENTS",
            country="US",
            capture_id=str(capture.manifest["capture_id"]),
            capture_content_sha256=str(capture.manifest["content_sha256"]),
            capture_acquired_at=str(capture.manifest["acquired_at"]),
            accepted_records=(),
            quarantined_records=(
                _quarantine(capture=capture, row_number=1, native_id=document_native_id, reasons=validation.reasons),
            ),
        )
    return ParsedCapture(
        source_id="U2_SAM_PUBLIC_DOCUMENTS",
        country="US",
        capture_id=str(capture.manifest["capture_id"]),
        capture_content_sha256=str(capture.manifest["content_sha256"]),
        capture_acquired_at=str(capture.manifest["acquired_at"]),
        accepted_records=(record,),
        quarantined_records=(),
    )


def parse_capture(raw_path: Path) -> ParsedCapture:
    """Dispatch a verified supported capture to its source-specific parser."""
    capture = load_verified_capture(raw_path)
    source_id = capture.manifest["source_id"]
    if source_id == "U1_SAM_OPPORTUNITIES":
        return parse_sam_opportunities_capture(raw_path)
    if source_id == "C1_CANADABUYS_TENDERS":
        return parse_canadabuys_tender_capture(raw_path)
    if source_id == "C2_CANADABUYS_AWARDS":
        return parse_canadabuys_award_capture(raw_path)
    if source_id == "C3_CANADABUYS_CONTRACT_HISTORY":
        return parse_canadabuys_contract_history_capture(raw_path)
    if source_id == "U2_SAM_PUBLIC_DOCUMENTS":
        return parse_sam_public_document_capture(raw_path)
    raise SourceParseError(f"No parser has been approved for {source_id}")
