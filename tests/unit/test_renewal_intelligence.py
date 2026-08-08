from datetime import date
from pathlib import Path
import sys

import pytest


PROJECT_ROOT = Path(__file__).resolve().parents[2]
API_DIR = PROJECT_ROOT / "platform" / "apps" / "api"
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

from services.canonical_artifacts import materialize_parsed_capture  # noqa: E402
from services.renewal_intelligence import RenewalIntelligenceError, build_renewal_watch  # noqa: E402
from services.source_parsers import ParsedCapture  # noqa: E402


def canonical_record(*, source_id, native_id, capture_id, capture_sha, fields, published_at="2026-08-01"):
    return {
        "canonical_schema_version": "canonical-procurement-v1",
        "canonical_id": f"CA:{source_id}:{native_id}",
        "record_snapshot_id": f"snapshot-{native_id}",
        "record_type": "contract_history" if source_id == "C3_CANADABUYS_CONTRACT_HISTORY" else "award_notice",
        "source_id": source_id,
        "country": "CA",
        "native_id": native_id,
        "title": "Example contract" if source_id == "C2_CANADABUYS_AWARDS" else None,
        "published_at": published_at,
        "source_url": "https://canadabuys.canada.ca/opendata/pub/current.csv",
        "source_capture": {"capture_id": capture_id, "content_sha256": capture_sha, "acquired_at": "2026-08-01T00:00:00Z", "source_updated_at": None},
        "transformation": {"parser_version": "source-native-parser-v1", "field_status": {}},
        "product_lineage": {"status": "not_linked", "product_record_id": None},
        "quality_status": "accepted",
        "source_fields": fields,
    }


def materialized(tmp_path, source_id, records):
    parsed = ParsedCapture(
        source_id=source_id,
        country="CA",
        capture_id=f"capture-{source_id}",
        capture_content_sha256=f"sha-{source_id}",
        capture_acquired_at="2026-08-01T00:00:00Z",
        accepted_records=tuple(records),
        quarantined_records=(),
    )
    return materialize_parsed_capture(parsed, artifact_root=tmp_path).manifest_path


def test_renewal_watch_selects_latest_amendment_and_attaches_award_evidence(tmp_path):
    contracts = [
        canonical_record(
            source_id="C3_CANADABUYS_CONTRACT_HISTORY",
            native_id="CON-1~001",
            capture_id="capture-C3_CANADABUYS_CONTRACT_HISTORY",
            capture_sha="sha-C3_CANADABUYS_CONTRACT_HISTORY",
            fields={"contract_number": "CON-1", "amendment_number": "001", "contract_end_at": "2026-08-20", "supplier": "Older Supplier"},
        ),
        canonical_record(
            source_id="C3_CANADABUYS_CONTRACT_HISTORY",
            native_id="CON-1~002",
            capture_id="capture-C3_CANADABUYS_CONTRACT_HISTORY",
            capture_sha="sha-C3_CANADABUYS_CONTRACT_HISTORY",
            fields={"contract_number": "CON-1", "amendment_number": "002", "contract_end_at": "2026-09-15", "total_contract_value": "250000.00", "currency": "CAD", "supplier": "Current Supplier", "contracting_entity": "Example Buyer", "unspsc": "81111800"},
        ),
        canonical_record(
            source_id="C3_CANADABUYS_CONTRACT_HISTORY",
            native_id="CON-2~000",
            capture_id="capture-C3_CANADABUYS_CONTRACT_HISTORY",
            capture_sha="sha-C3_CANADABUYS_CONTRACT_HISTORY",
            fields={"contract_number": "CON-2", "amendment_number": "000", "contract_end_at": "bad-date"},
        ),
    ]
    awards = [
        canonical_record(
            source_id="C2_CANADABUYS_AWARDS",
            native_id="CON-1~002",
            capture_id="capture-C2_CANADABUYS_AWARDS",
            capture_sha="sha-C2_CANADABUYS_AWARDS",
            fields={"contract_number": "CON-1", "amendment_number": "002", "award_date": "2026-07-01", "supplier": "Current Supplier", "total_contract_value": "250000.00"},
        )
    ]
    contract_manifest = materialized(tmp_path, "C3_CANADABUYS_CONTRACT_HISTORY", contracts)
    award_manifest = materialized(tmp_path, "C2_CANADABUYS_AWARDS", awards)

    build = build_renewal_watch(
        contract_manifest_path=contract_manifest,
        award_manifest_path=award_manifest,
        as_of=date(2026, 8, 8),
        lookahead_days=90,
    )

    assert len(build.candidates) == 1
    candidate = build.candidates[0]
    assert candidate["contract_key"] == "CON-1"
    assert candidate["contract_end_date"] == "2026-09-15"
    assert candidate["supplier"] == "Current Supplier"
    assert candidate["award_context"]["canonical_id"] == "CA:C2_CANADABUYS_AWARDS:CON-1~002"
    assert candidate["urgency_tier"] == "high"
    assert build.excluded_counts == {"missing_or_invalid_contract_end_date": 1}


def test_renewal_watch_rejects_mixed_or_invalid_source_inputs(tmp_path):
    award_manifest = materialized(
        tmp_path,
        "C2_CANADABUYS_AWARDS",
        [
            canonical_record(
                source_id="C2_CANADABUYS_AWARDS",
                native_id="CON-1",
                capture_id="capture-C2_CANADABUYS_AWARDS",
                capture_sha="sha-C2_CANADABUYS_AWARDS",
                fields={"contract_number": "CON-1"},
            )
        ],
    )
    with pytest.raises(RenewalIntelligenceError, match="C3_CANADABUYS_CONTRACT_HISTORY"):
        build_renewal_watch(
            contract_manifest_path=award_manifest,
            award_manifest_path=None,
            as_of=date(2026, 8, 8),
        )
    with pytest.raises(RenewalIntelligenceError, match="positive"):
        build_renewal_watch(
            contract_manifest_path=award_manifest,
            award_manifest_path=None,
            as_of=date(2026, 8, 8),
            lookahead_days=0,
        )
