from datetime import date
from pathlib import Path
import sys

import pytest


PROJECT_ROOT = Path(__file__).resolve().parents[2]
API_DIR = PROJECT_ROOT / "platform" / "apps" / "api"
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

from services.canonical_artifacts import materialize_parsed_capture  # noqa: E402
from services.product_releases import (  # noqa: E402
    ProductReleaseError,
    release_canadian_renewal_watch,
    release_us_compliance_assessments,
    verify_product_release,
)
from services.renewal_intelligence import build_renewal_watch  # noqa: E402
from services.compliance_intelligence import CustomerCapabilityProfile, build_us_compliance_assessments  # noqa: E402
from services.source_parsers import ParsedCapture  # noqa: E402


def _manifest(tmp_path, *, source_id, country, capture_id, records, acquired_at="2026-08-08T00:00:00Z"):
    parsed = ParsedCapture(
        source_id=source_id,
        country=country,
        capture_id=capture_id,
        capture_content_sha256=f"sha-{capture_id}",
        capture_acquired_at=acquired_at,
        accepted_records=tuple(records),
        quarantined_records=(),
    )
    return materialize_parsed_capture(parsed, artifact_root=tmp_path / "canonical").manifest_path


def test_canadian_renewal_release_is_immutable_and_verifiable(tmp_path):
    contract = {
        "source_id": "C3_CANADABUYS_CONTRACT_HISTORY", "country": "CA", "native_id": "CON-1", "title": None,
        "canonical_id": "CA:C3_CANADABUYS_CONTRACT_HISTORY:CON-1", "record_snapshot_id": "contract-1", "record_type": "contract_history",
        "quality_status": "accepted", "source_url": "https://canadabuys.canada.ca/opendata/pub/current.csv",
        "source_capture": {"capture_id": "contract", "content_sha256": "sha-contract", "acquired_at": "2026-08-08T00:00:00Z"},
        "source_fields": {"contract_number": "CON-1", "contract_end_at": "2026-08-20", "supplier": "Supplier"},
    }
    contract_manifest = _manifest(tmp_path, source_id="C3_CANADABUYS_CONTRACT_HISTORY", country="CA", capture_id="contract", records=[contract])
    build = build_renewal_watch(contract_manifest_path=contract_manifest, award_manifest_path=None, as_of=date(2026, 8, 8), lookahead_days=90)

    release = release_canadian_renewal_watch(
        build=build, contract_manifest_path=contract_manifest, award_manifest_path=None, release_root=tmp_path / "products"
    )
    verified = verify_product_release(release.manifest_path)

    assert verified.manifest["release_status"] == "released"
    assert verified.manifest["records"]["record_count"] == 1
    assert release_canadian_renewal_watch(
        build=build, contract_manifest_path=contract_manifest, award_manifest_path=None, release_root=tmp_path / "products"
    ).release_id == release.release_id
    release.records_path.write_text("tampered\n", encoding="utf-8")
    with pytest.raises(ProductReleaseError, match="checksum"):
        verify_product_release(release.manifest_path)


def test_us_compliance_release_requires_public_document_source_and_fresh_inputs(tmp_path):
    opportunity = {
        "source_id": "U1_SAM_OPPORTUNITIES", "country": "US", "native_id": "notice-1", "title": "Security support",
        "canonical_id": "US:U1_SAM_OPPORTUNITIES:notice-1", "quality_status": "accepted", "source_url": "https://api.sam.gov/opportunities/v2/search",
        "source_capture": {"capture_id": "opportunity", "content_sha256": "sha-opportunity", "acquired_at": "2026-08-08T00:00:00Z"},
        "source_fields": {"response_deadline": "2026-09-01"},
    }
    document = {
        "source_id": "U2_SAM_PUBLIC_DOCUMENTS", "country": "US", "native_id": "doc-1", "parent_native_id": "notice-1",
        "canonical_id": "US:U2_SAM_PUBLIC_DOCUMENTS:doc-1", "quality_status": "accepted", "source_url": "https://sam.gov/document",
        "source_capture": {"capture_id": "document", "content_sha256": "sha-document", "acquired_at": "2026-08-08T00:00:00Z"},
        "document": {"passages": [{"page": 1, "text": "Offerors must submit a proposal."}]},
    }
    opportunity_manifest = _manifest(tmp_path, source_id="U1_SAM_OPPORTUNITIES", country="US", capture_id="opportunity", records=[opportunity])
    document_manifest = _manifest(tmp_path, source_id="U2_SAM_PUBLIC_DOCUMENTS", country="US", capture_id="document", records=[document])
    assessments = build_us_compliance_assessments(
        opportunity_manifest_path=opportunity_manifest,
        document_manifest_paths=[document_manifest],
        customer_profile=CustomerCapabilityProfile(profile_id="customer-1"),
    )

    release = release_us_compliance_assessments(
        assessments=assessments,
        opportunity_manifest_path=opportunity_manifest,
        document_manifest_paths=[document_manifest],
        as_of=date(2026, 8, 8),
        release_root=tmp_path / "products",
    )
    assert verify_product_release(release.manifest_path).manifest["source_ids"] == ["U1_SAM_OPPORTUNITIES", "U2_SAM_PUBLIC_DOCUMENTS"]
    with pytest.raises(ProductReleaseError, match="lacks required official sources"):
        release_us_compliance_assessments(
            assessments=assessments,
            opportunity_manifest_path=opportunity_manifest,
            document_manifest_paths=[],
            as_of=date(2026, 8, 8),
            release_root=tmp_path / "other-products",
        )
