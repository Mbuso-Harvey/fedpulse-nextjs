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
    parse_canadabuys_award_capture,
    parse_canadabuys_contract_history_capture,
    parse_sam_public_document_capture,
    parse_canadabuys_tender_capture,
    parse_capture,
    parse_sam_opportunities_capture,
)


def write_capture(tmp_path, *, source_id, resource_url, raw_bytes, extension, request_metadata=None, content_type=None):
    manifest = build_capture_manifest(
        source_id=source_id,
        resource_url=resource_url,
        raw_bytes=raw_bytes,
        acquired_at=datetime(2026, 8, 8, tzinfo=timezone.utc),
        parser_version="unparsed",
        schema_version="raw-v1",
        request_metadata=request_metadata,
        content_type=content_type,
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


def test_canadabuys_award_and_contract_history_parsers_preserve_versioned_keys(tmp_path):
    award_path = write_capture(
        tmp_path,
        source_id="C2_CANADABUYS_AWARDS",
        resource_url="https://canadabuys.canada.ca/opendata/pub/awardNoticeComplete-avisAttributionComplet.csv",
        raw_bytes=(
            "title-titre-eng,referenceNumber-numeroReference,contractNumber-numeroContrat,amendmentNumber-numeroModification,"
            "publicationDate-datePublication,contractAwardDate-dateAttributionContrat,contractAmount-montantContrat,"
            "contractCurrency-contratMonnaie,supplierLegalName-nomLegalFournisseur-eng\n"
            "Security platform,REF-1,CON-1,002,2026-08-07,2026-08-06,250000,CAD,Example Supplier\n"
        ).encode(),
        extension=".csv",
    )
    contract_path = write_capture(
        tmp_path,
        source_id="C3_CANADABUYS_CONTRACT_HISTORY",
        resource_url="https://canadabuys.canada.ca/opendata/pub/contractHistoryComplete-historiqueContratsComplet.csv",
        raw_bytes=(
            "referenceNumber-numeroReference,contractNumber-numeroContrat,amendmentNumber-numeroModification,"
            "publicationDate-datePublication,contractEndDate-dateFinContrat,totalContractValue-valeurTotaleContrat,"
            "contractCurrency-contratMonnaie,supplierStandardizedName-nomNormaliseFournisseur-eng\n"
            "REF-2,CON-2,003,2026-08-07,2027-08-07,500000,CAD,Example Supplier\n"
        ).encode(),
        extension=".csv",
    )

    award = parse_canadabuys_award_capture(award_path)
    contract = parse_canadabuys_contract_history_capture(contract_path)

    assert award.accepted_records[0]["native_id"] == "CON-1~002"
    assert award.accepted_records[0]["source_fields"]["supplier"] == "Example Supplier"
    assert contract.accepted_records[0]["native_id"] == "CON-2~003"
    assert contract.accepted_records[0]["source_fields"]["contract_end_at"] == "2027-08-07"
    assert parse_capture(award_path) == award
    assert parse_capture(contract_path) == contract


def test_sam_public_document_parser_extracts_parent_linked_text_evidence(tmp_path):
    raw_path = write_capture(
        tmp_path,
        source_id="U2_SAM_PUBLIC_DOCUMENTS",
        resource_url="https://sam.gov/api/prod/opps/v3/opportunities/resources/files/example/download",
        raw_bytes=b"Security clearance and technical proposal instructions.",
        extension=".txt",
        content_type="text/plain",
        request_metadata={"parent_native_id": "notice-1", "resource_kind": "attachment"},
    )

    result = parse_sam_public_document_capture(raw_path)

    assert len(result.accepted_records) == 1
    record = result.accepted_records[0]
    assert record["parent_native_id"] == "notice-1"
    assert record["document"]["file_type"] == "text"
    assert record["document"]["passages"] == [{"page": 1, "text": "Security clearance and technical proposal instructions."}]
    assert parse_capture(raw_path) == result


def test_sam_public_document_parser_quarantines_unsupported_binary(tmp_path):
    raw_path = write_capture(
        tmp_path,
        source_id="U2_SAM_PUBLIC_DOCUMENTS",
        resource_url="https://sam.gov/api/prod/opps/v3/opportunities/resources/files/example/download",
        raw_bytes=b"\x89PNG\r\n\x1a\n",
        extension=".bin",
        content_type="application/octet-stream",
        request_metadata={"parent_native_id": "notice-1", "resource_kind": "attachment"},
    )

    result = parse_sam_public_document_capture(raw_path)

    assert result.accepted_records == ()
    assert result.quarantined_records[0]["reasons"] == ["no_extractable_text"]
