from datetime import date
from pathlib import Path
import sys

from fastapi import FastAPI
from fastapi.testclient import TestClient


PROJECT_ROOT = Path(__file__).resolve().parents[2]
API_DIR = PROJECT_ROOT / "platform" / "apps" / "api"
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

from routers import intelligence_products  # noqa: E402
from services.auth import get_current_user  # noqa: E402
from services.canonical_artifacts import materialize_parsed_capture  # noqa: E402
from services.product_releases import materialize_product_release  # noqa: E402
from services.source_parsers import ParsedCapture  # noqa: E402


def _release(tmp_path):
    record = {
        "source_id": "C3_CANADABUYS_CONTRACT_HISTORY", "country": "CA", "native_id": "CON-1", "canonical_id": "CA:C3_CANADABUYS_CONTRACT_HISTORY:CON-1",
        "quality_status": "accepted", "source_capture": {"capture_id": "capture-1", "content_sha256": "capture-sha", "acquired_at": "2026-08-08T00:00:00Z"},
    }
    parsed = ParsedCapture("C3_CANADABUYS_CONTRACT_HISTORY", "CA", "capture-1", "capture-sha", "2026-08-08T00:00:00Z", (record,), ())
    manifest = materialize_parsed_capture(parsed, artifact_root=tmp_path / "canonical").manifest_path
    product_record = {
        "country": "CA", "product": "renewal_watch", "candidate_id": "candidate-1",
        "evidence": {"contract_canonical_id": record["canonical_id"]}, "limitations": ["Contract-end urgency is not a renewal prediction."],
    }
    return materialize_product_release(
        product="renewal_watch", country="CA", engine_version="renewal-watch-v1", records=[product_record],
        input_manifest_paths=[manifest], required_source_ids=["C3_CANADABUYS_CONTRACT_HISTORY"],
        as_of=date(2026, 8, 8), coverage_through=date(2026, 8, 8), max_capture_age_days=35,
        release_root=tmp_path / "products",
    )


def test_router_serves_only_verified_entitled_release(tmp_path, monkeypatch):
    _release(tmp_path)
    monkeypatch.setenv("PRODUCT_RELEASE_ROOT", str(tmp_path / "products"))
    monkeypatch.setattr(intelligence_products, "active_subscription_tier", lambda _user_id: "watch")
    app = FastAPI()
    app.include_router(intelligence_products.router)
    app.dependency_overrides[get_current_user] = lambda: {"id": "user-1"}
    client = TestClient(app)

    response = client.get("/intelligence/ca/renewal_watch")
    assert response.status_code == 200
    assert response.json()["release"]["release_status"] == "released"
    assert response.json()["records"][0]["candidate_id"] == "candidate-1"

    monkeypatch.setattr(intelligence_products, "active_subscription_tier", lambda _user_id: "starter")
    assert client.get("/intelligence/ca/renewal_watch").status_code == 403
