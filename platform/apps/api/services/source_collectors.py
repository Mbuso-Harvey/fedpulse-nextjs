"""Non-fallback collectors for approved official procurement sources.

The collectors intentionally return observable failure states and never create
sample records. Their only persistent output is an immutable raw capture plus
the safe manifest created by :mod:`services.source_foundation`.
"""

from __future__ import annotations

from dataclasses import dataclass
import json
import os
from pathlib import Path
from typing import Any, Mapping

import httpx

from services.source_foundation import (
    CaptureManifest,
    RecordValidation,
    SourceFoundationError,
    build_capture_manifest,
    source_definition,
    validate_record,
    validate_resource_url,
    write_immutable_capture,
)


SAM_OPPORTUNITIES_URL = "https://api.sam.gov/opportunities/v2/search"


class SourceCollectionError(RuntimeError):
    """Raised when an approved source could not be collected."""


@dataclass(frozen=True)
class RawCaptureResult:
    manifest: CaptureManifest
    raw_path: Path
    manifest_path: Path


@dataclass(frozen=True)
class SamOpportunityCollection(RawCaptureResult):
    admitted_records: tuple[dict[str, Any], ...]
    quarantined_records: tuple[dict[str, Any], ...]
    parse_error: str | None = None


def _client_or_default(client: httpx.Client | None) -> tuple[httpx.Client, bool]:
    if client is not None:
        return client, False
    return httpx.Client(timeout=httpx.Timeout(30.0)), True


def _capture_response(
    *,
    source_id: str,
    resource_url: str,
    capture_root: Path,
    raw_bytes: bytes,
    request_metadata: Mapping[str, Any],
    response: httpx.Response,
    extension: str,
    parser_version: str,
    schema_version: str,
) -> RawCaptureResult:
    manifest = build_capture_manifest(
        source_id=source_id,
        resource_url=resource_url,
        raw_bytes=raw_bytes,
        source_updated_at=response.headers.get("last-modified"),
        request_metadata=request_metadata,
        content_type=response.headers.get("content-type"),
        parser_version=parser_version,
        schema_version=schema_version,
    )
    raw_path, manifest_path = write_immutable_capture(capture_root, manifest, raw_bytes, extension)
    return RawCaptureResult(manifest=manifest, raw_path=raw_path, manifest_path=manifest_path)


def collect_canadabuys_resource(
    *,
    source_id: str,
    resource_url: str,
    capture_root: Path,
    client: httpx.Client | None = None,
) -> RawCaptureResult:
    """Capture an approved CanadaBuys resource without parsing it into products."""
    source = source_definition(source_id)
    if source.country != "CA":
        raise SourceCollectionError(f"{source_id} is not a Canadian source")
    validate_resource_url(source_id, resource_url)
    active_client, owns_client = _client_or_default(client)
    try:
        response = active_client.get(resource_url)
        response.raise_for_status()
        return _capture_response(
            source_id=source_id,
            resource_url=resource_url,
            capture_root=capture_root,
            raw_bytes=response.content,
            request_metadata={},
            response=response,
            extension=".raw",
            parser_version="unparsed",
            schema_version="raw-v1",
        )
    except httpx.HTTPError as exc:
        raise SourceCollectionError(f"CanadaBuys collection failed for {source_id}: {exc}") from exc
    finally:
        if owns_client:
            active_client.close()


def _sam_api_key() -> str:
    key = os.getenv("SAM_GOV_API_KEY", "").strip()
    if not key:
        raise SourceCollectionError("SAM_GOV_API_KEY is required; collectors do not read credential files or use fallback keys")
    return key


def _sam_record(opportunity: Mapping[str, Any]) -> dict[str, Any]:
    return {
        "native_id": opportunity.get("noticeId"),
        "title": opportunity.get("title"),
        "posted_at": opportunity.get("postedDate"),
        "source_url": SAM_OPPORTUNITIES_URL,
        "country": "US",
        "solicitation_number": opportunity.get("solicitationNumber"),
        "department": opportunity.get("department"),
        "notice_type": opportunity.get("type"),
        "response_deadline": opportunity.get("responseDeadLine"),
    }


def _quarantine_entry(record: Mapping[str, Any], validation: RecordValidation) -> dict[str, Any]:
    return {
        "native_id": record.get("native_id"),
        "status": validation.status,
        "reasons": list(validation.reasons),
    }


def collect_sam_opportunities(
    *,
    capture_root: Path,
    posted_from: str,
    posted_to: str,
    limit: int = 100,
    client: httpx.Client | None = None,
) -> SamOpportunityCollection:
    """Collect and validate a bounded SAM.gov opportunity window.

    The API key is read only from ``SAM_GOV_API_KEY``. It is included in the
    request but redacted by the manifest layer and never returned by this API.
    """
    if not 1 <= limit <= 1000:
        raise SourceCollectionError("SAM opportunity limit must be between 1 and 1000")
    api_key = _sam_api_key()
    parameters = {
        "api_key": api_key,
        "limit": limit,
        "postedFrom": posted_from,
        "postedTo": posted_to,
    }
    active_client, owns_client = _client_or_default(client)
    try:
        response = active_client.get(SAM_OPPORTUNITIES_URL, params=parameters)
        response.raise_for_status()
        raw_capture = _capture_response(
            source_id="U1_SAM_OPPORTUNITIES",
            resource_url=SAM_OPPORTUNITIES_URL,
            capture_root=capture_root,
            raw_bytes=response.content,
            request_metadata=parameters,
            response=response,
            extension=".json",
            parser_version="sam-opportunity-v1",
            schema_version="sam-opportunities-v2",
        )
        try:
            payload = response.json()
        except json.JSONDecodeError:
            return SamOpportunityCollection(
                **raw_capture.__dict__,
                admitted_records=(),
                quarantined_records=(),
                parse_error="invalid_json_response",
            )
        opportunities = payload.get("opportunitiesData")
        if not isinstance(opportunities, list):
            return SamOpportunityCollection(
                **raw_capture.__dict__,
                admitted_records=(),
                quarantined_records=(),
                parse_error="missing_opportunities_data_list",
            )
        admitted: list[dict[str, Any]] = []
        quarantined: list[dict[str, Any]] = []
        for opportunity in opportunities:
            if not isinstance(opportunity, Mapping):
                quarantined.append({"native_id": None, "status": "quarantined", "reasons": ["invalid_source_record"]})
                continue
            record = _sam_record(opportunity)
            validation = validate_record("U1_SAM_OPPORTUNITIES", record)
            if validation.status == "accepted":
                admitted.append(record)
            else:
                quarantined.append(_quarantine_entry(record, validation))
        return SamOpportunityCollection(
            **raw_capture.__dict__,
            admitted_records=tuple(admitted),
            quarantined_records=tuple(quarantined),
        )
    except httpx.HTTPError as exc:
        raise SourceCollectionError(f"SAM.gov collection failed: {exc}") from exc
    finally:
        if owns_client:
            active_client.close()
