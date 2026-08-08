from datetime import datetime, timezone
from hashlib import sha256
from pathlib import Path
import json
import sys

import pytest


PROJECT_ROOT = Path(__file__).resolve().parents[2]
API_DIR = PROJECT_ROOT / "platform" / "apps" / "api"
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

from services.source_foundation import (  # noqa: E402
    SOURCE_REGISTRY,
    SourceFoundationError,
    build_capture_manifest,
    registry_for_country,
    validate_record,
    write_immutable_capture,
)


def test_registry_is_country_scoped_and_contains_the_approved_core_sources():
    assert {source.source_id for source in registry_for_country("CA")} == {
        "C1_CANADABUYS_TENDERS",
        "C2_CANADABUYS_AWARDS",
        "C3_CANADABUYS_CONTRACT_HISTORY",
    }
    assert {source.source_id for source in registry_for_country("US")} == {
        "U1_SAM_OPPORTUNITIES",
        "U2_SAM_PUBLIC_DOCUMENTS",
        "U3_USASPENDING_AWARDS",
    }
    assert all(source.country in {"CA", "US"} for source in SOURCE_REGISTRY.values())


def test_capture_manifest_redacts_a_key_and_writes_immutable_bytes(tmp_path):
    raw = b'{"opportunitiesData": []}'
    manifest = build_capture_manifest(
        source_id="U1_SAM_OPPORTUNITIES",
        resource_url="https://api.sam.gov/opportunities/v2/search?api_key=must-not-appear&limit=10",
        raw_bytes=raw,
        acquired_at=datetime(2026, 8, 7, tzinfo=timezone.utc),
        request_metadata={"api_key": "must-not-appear", "limit": 10},
        content_type="application/json",
    )

    raw_path, manifest_path = write_immutable_capture(tmp_path, manifest, raw, ".json")
    stored = json.loads(manifest_path.read_text(encoding="utf-8"))

    assert raw_path.read_bytes() == raw
    assert stored["request_metadata"] == {"api_key": "[REDACTED]", "limit": "10"}
    assert stored["content_sha256"] == sha256(raw).hexdigest()
    assert "must-not-appear" not in manifest_path.read_text(encoding="utf-8")


def test_capture_rejects_unapproved_hosts_and_empty_bytes():
    with pytest.raises(SourceFoundationError, match="approved official host"):
        build_capture_manifest(
            source_id="U1_SAM_OPPORTUNITIES",
            resource_url="https://example.com/opportunities",
            raw_bytes=b"not-sam",
        )
    with pytest.raises(SourceFoundationError, match="Empty"):
        build_capture_manifest(
            source_id="C1_CANADABUYS_TENDERS",
            resource_url="https://open.canada.ca/data/en/dataset/example",
            raw_bytes=b"",
        )


def test_record_validation_quarantines_missing_or_cross_country_records():
    assert validate_record(
        "U1_SAM_OPPORTUNITIES",
        {
            "native_id": "notice-1",
            "title": "Cybersecurity support",
            "posted_at": "2026-08-07",
            "source_url": "https://api.sam.gov/opportunities/v2/search",
            "country": "US",
        },
    ).status == "accepted"

    missing = validate_record("U1_SAM_OPPORTUNITIES", {"native_id": "notice-1"})
    assert missing.status == "quarantined"
    assert "missing_title" in missing.reasons

    wrong_country = validate_record(
        "C3_CANADABUYS_CONTRACT_HISTORY",
        {
            "native_id": "contract-1",
            "published_at": "2026-08-08",
            "source_url": "https://open.canada.ca/data/en/dataset/example",
            "country": "US",
        },
    )
    assert wrong_country.status == "quarantined"
    assert wrong_country.reasons == ("country_mismatch",)
