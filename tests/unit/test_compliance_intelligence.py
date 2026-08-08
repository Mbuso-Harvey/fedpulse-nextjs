from pathlib import Path
import sys

import pytest


PROJECT_ROOT = Path(__file__).resolve().parents[2]
API_DIR = PROJECT_ROOT / "platform" / "apps" / "api"
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

from services.canonical_artifacts import materialize_parsed_capture  # noqa: E402
from services.compliance_intelligence import (  # noqa: E402
    ComplianceIntelligenceError,
    CustomerCapabilityProfile,
    build_us_compliance_assessments,
)
from services.source_parsers import ParsedCapture  # noqa: E402


def materialized(tmp_path, source_id, records, capture_id):
    parsed = ParsedCapture(
        source_id=source_id,
        country="US",
        capture_id=capture_id,
        capture_content_sha256=f"sha-{capture_id}",
        capture_acquired_at="2026-08-08T00:00:00Z",
        accepted_records=tuple(records),
        quarantined_records=(),
    )
    return materialize_parsed_capture(parsed, artifact_root=tmp_path).manifest_path


def test_compliance_assessment_reports_evidence_and_customer_mismatch(tmp_path):
    opportunity = {
        "source_id": "U1_SAM_OPPORTUNITIES", "country": "US", "native_id": "notice-1", "title": "Security support",
        "canonical_id": "US:U1_SAM_OPPORTUNITIES:notice-1", "quality_status": "accepted", "source_url": "https://api.sam.gov/opportunities/v2/search",
        "source_capture": {"capture_id": "opp-capture", "content_sha256": "sha-opp-capture", "acquired_at": "2026-08-08T00:00:00Z"},
        "source_fields": {"response_deadline": "2026-09-01"},
    }
    document = {
        "source_id": "U2_SAM_PUBLIC_DOCUMENTS", "country": "US", "native_id": "doc-1", "parent_native_id": "notice-1",
        "canonical_id": "US:U2_SAM_PUBLIC_DOCUMENTS:doc-1", "quality_status": "accepted", "source_url": "https://sam.gov/document",
        "source_capture": {"capture_id": "doc-capture", "content_sha256": "sha-doc-capture", "acquired_at": "2026-08-08T00:00:00Z"},
        "document": {"passages": [{"page": 2, "text": "Offerors must hold a Secret clearance and CMMC certification. Evaluation factors include best value."}]},
    }
    opportunity_manifest = materialized(tmp_path, "U1_SAM_OPPORTUNITIES", [opportunity], "opp-capture")
    document_manifest = materialized(tmp_path, "U2_SAM_PUBLIC_DOCUMENTS", [document], "doc-capture")

    assessments = build_us_compliance_assessments(
        opportunity_manifest_path=opportunity_manifest,
        document_manifest_paths=[document_manifest],
        customer_profile=CustomerCapabilityProfile(profile_id="customer-1", certifications=("CMMC",), clearances=("Top Secret clearance",)),
    )

    assert assessments[0]["assessment_status"] == "customer_profile_mismatch"
    assert {item["category"] for item in assessments[0]["requirements"]} == {"security_clearance", "certification", "evaluation_criterion"}
    assert any(item["customer_status"] == "customer_mismatch" for item in assessments[0]["requirements"])


def test_compliance_assessment_rejects_non_opportunity_manifest(tmp_path):
    document_manifest = materialized(tmp_path, "U2_SAM_PUBLIC_DOCUMENTS", [], "doc-capture")
    with pytest.raises(ComplianceIntelligenceError, match="U1_SAM_OPPORTUNITIES"):
        build_us_compliance_assessments(
            opportunity_manifest_path=document_manifest,
            document_manifest_paths=[],
            customer_profile=CustomerCapabilityProfile(profile_id="customer-1"),
        )
