from datetime import datetime, timedelta, timezone
from pathlib import Path
import sys

import httpx


PROJECT_ROOT = Path(__file__).resolve().parents[2]
API_DIR = PROJECT_ROOT / "platform" / "apps" / "api"
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

from services.compliance_intelligence import CustomerCapabilityProfile  # noqa: E402
from services.product_refresh import refresh_canadian_renewal_watch, refresh_us_compliance_analyst  # noqa: E402
from services.product_releases import verify_product_release  # noqa: E402


def test_canadian_refresh_runs_official_capture_to_verified_release(tmp_path):
    as_of = datetime.now(timezone.utc).date()
    end_date = (as_of + timedelta(days=30)).isoformat()
    award_csv = (
        "title-titre-eng,contractNumber-numeroContrat,publicationDate-datePublication,contractAwardDate-dateAttributionContrat,contractAmount-montantContrat\n"
        f"Security platform,CON-1,{as_of.isoformat()},{as_of.isoformat()},250000\n"
    ).encode()
    contract_csv = (
        "contractNumber-numeroContrat,publicationDate-datePublication,contractEndDate-dateFinContrat,supplierStandardizedName-nomNormaliseFournisseur-eng\n"
        f"CON-1,{as_of.isoformat()},{end_date},Example Supplier\n"
    ).encode()

    def handler(request):
        body = award_csv if "awardNotice" in request.url.path else contract_csv
        return httpx.Response(200, content=body, headers={"content-type": "text/csv"}, request=request)

    client = httpx.Client(transport=httpx.MockTransport(handler))
    try:
        result = refresh_canadian_renewal_watch(
            award_resource_url="https://canadabuys.canada.ca/opendata/pub/awardNoticeComplete-avisAttributionComplet.csv",
            contract_resource_url="https://canadabuys.canada.ca/opendata/pub/contractHistoryComplete-contratsOctroyesComplet.csv",
            capture_root=tmp_path / "captures",
            canonical_root=tmp_path / "canonical",
            release_root=tmp_path / "products",
            as_of=as_of,
            client=client,
        )
    finally:
        client.close()

    release = verify_product_release(result.release.manifest_path)
    assert release.manifest["records"]["record_count"] == 1
    assert release.manifest["operational_observations"]["excluded_counts"] == {}


def test_us_refresh_runs_official_metadata_documents_and_profile_scoped_release(tmp_path, monkeypatch):
    monkeypatch.setenv("SAM_GOV_API_KEY", "test-key-not-for-output")
    as_of = datetime.now(timezone.utc).date()

    def handler(request):
        if request.url.host == "api.sam.gov":
            return httpx.Response(
                200,
                json={
                    "opportunitiesData": [
                        {
                            "noticeId": "notice-1",
                            "title": "Cybersecurity support",
                            "postedDate": as_of.isoformat(),
                            "resourceLinks": "https://sam.gov/api/prod/opps/v3/opportunities/resources/files/example/download",
                        }
                    ]
                },
                headers={"content-type": "application/json"},
                request=request,
            )
        return httpx.Response(200, content=b"Offerors must submit a proposal.", headers={"content-type": "text/plain"}, request=request)

    client = httpx.Client(transport=httpx.MockTransport(handler))
    try:
        result = refresh_us_compliance_analyst(
            capture_root=tmp_path / "captures",
            canonical_root=tmp_path / "canonical",
            release_root=tmp_path / "products",
            posted_from=as_of.strftime("%m/%d/%Y"),
            posted_to=as_of.strftime("%m/%d/%Y"),
            customer_profile=CustomerCapabilityProfile(profile_id="customer-profile-1"),
            as_of=as_of,
            client=client,
        )
    finally:
        client.close()

    release = verify_product_release(result.release.manifest_path)
    assert release.manifest["audience"] == {"scope": "customer", "customer_scope_id": "customer-profile-1"}
    assert release.manifest["operational_observations"]["public_document_discovery"] == {
        "discovered_count": 1,
        "retrieved_count": 1,
        "failed_count": 0,
    }
