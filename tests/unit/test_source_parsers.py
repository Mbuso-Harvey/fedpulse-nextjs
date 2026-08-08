from datetime import datetime, timezone
import json
from pathlib import Path
import sys

import pytest


PROJECT_ROOT = Path(__file__).resolve().parents[2]
API_DIR = PROJECT_ROOT / "platform" / "apps" / "api"
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

from services.source_foundation import build_capture_manifest, write_immutable_capture  # noqa: E402
from services.source_parsers import (  # noqa: E402
    SourceParseError,
    load_verified_capture,
    parse_canadabuys_tender_capture,
    parse_capture,
    parse_sam_opportunities_capture,
)


def write_capture(tmp_path, *, source_id, resource_url, raw_bytes, extension):
    manifest = build_capture_manifest(
        source_id=source_id,
        resource_url=resource_url,
        raw_bytes=raw_bytes,
        acquired_at=datetime(2026, 8, 8, tzinfo=timezone.utc),
        parser_version="unparsed",
        schema_version="raw-v1",
    )
    raw_path, _ = write_immutable_capture(tmp_path, manifest, raw_bytes, extension)
    return raw_path


def test_sam_parser_preserves_capture_lineage_and_quarantines_invalid_rows(tmp_path):
    raw_path = write_capture(
        tmp_path,
        source_id="U1_SAM_OPPORTUNITIES",
        resource_url="https://api.sam.gov/opportunities/v2/search",
        raw_bytes=json.dumps(
            {
                "opportunitiesData": [
                    {
                        "noticeId": "notice-1",
                        "title": "Cybersecurity support",
                        "postedDate": "2026-08-07",
                        "solicitationNumber": "SOL-1",
                    },
                    {"noticeId": "notice-2", "postedDate": "2026-08-07"},
                    "not-an-object",
                ]
            }
        ).encode(),
        extension=".json",
    )

    result = parse_sam_opportunities_capture(raw_path)

    assert len(result.accepted_records) == 1
    record = result.accepted_records[0]
    assert record["canonical_id"] == "US:U1_SAM_OPPORTUNITIES:notice-1"
    assert record["source_capture"]["capture_id"] == result.capture_id
    assert record["transformation"]["field_status"]["title"] == {"status": "mapped", "source_field": "title"}
    assert record["product_lineage"] == {"status": "not_linked", "product_record_id": None}
    assert result.quarantined_records[0]["reasons"] == ["missing_title"]
    assert result.quarantined_records[1]["reasons"] == ["invalid_source_record"]
    assert parse_capture(raw_path) == result


def test_canadabuys_parser_maps_bilingual_headers_and_quarantines_missing_title(tmp_path):
    raw_path = write_capture(
        tmp_path,
        source_id="C1_CANADABUYS_TENDERS",
        resource_url="https://canadabuys.canada.ca/opendata/pub/newTenderNotice-nouvelAvisAppelOffres.csv",
        raw_bytes=(
            "referenceNumber-numeroReference,title-titre-eng,title-titre-fra,publicationDate-datePublication,"
            "solicitationNumber-numeroSollicitation,tenderClosingDate-appelOffresDateCloture,unspsc\n"
            "REF-1,English title,Titre francais,2026-08-07,SOL-1,2026-08-30,81111800\n"
            "REF-2,,,2026-08-07,SOL-2,2026-08-30,81111800\n"
        ).encode(),
        extension=".csv",
    )

    result = parse_canadabuys_tender_capture(raw_path)

    assert len(result.accepted_records) == 1
    record = result.accepted_records[0]
    assert record["country"] == "CA"
    assert record["native_id"] == "REF-1"
    assert record["title"] == "English title"
    assert record["source_fields"]["solicitation_number"] == "SOL-1"
    assert result.quarantined_records == (
        {
            "source_id": "C1_CANADABUYS_TENDERS",
            "capture_id": result.capture_id,
            "row_number": 3,
            "native_id": "REF-2",
            "quality_status": "quarantined",
            "reasons": ["missing_title"],
        },
    )


def test_parser_rejects_tampered_raw_bytes_and_missing_canadabuys_mapping_header(tmp_path):
    raw_path = write_capture(
        tmp_path,
        source_id="U1_SAM_OPPORTUNITIES",
        resource_url="https://api.sam.gov/opportunities/v2/search",
        raw_bytes=b'{"opportunitiesData": []}',
        extension=".json",
    )
    raw_path.write_bytes(b'{"opportunitiesData": ["tampered"]}')
    with pytest.raises(SourceParseError, match="checksum"):
        parse_sam_opportunities_capture(raw_path)

    invalid_ca_path = write_capture(
        tmp_path,
        source_id="C1_CANADABUYS_TENDERS",
        resource_url="https://canadabuys.canada.ca/opendata/pub/newTenderNotice-nouvelAvisAppelOffres.csv",
        raw_bytes=b"unexpected-header\nvalue\n",
        extension=".csv",
    )
    with pytest.raises(SourceParseError, match="mapping headers"):
        parse_canadabuys_tender_capture(invalid_ca_path)


def test_parser_rejects_a_manifest_sidecar_as_raw_data(tmp_path):
    raw_path = write_capture(
        tmp_path,
        source_id="U1_SAM_OPPORTUNITIES",
        resource_url="https://api.sam.gov/opportunities/v2/search",
        raw_bytes=b'{"opportunitiesData": []}',
        extension=".json",
    )
    manifest_path = raw_path.with_name(f"{raw_path.stem}.manifest.json")
    with pytest.raises(SourceParseError, match="sidecar"):
        load_verified_capture(manifest_path)
