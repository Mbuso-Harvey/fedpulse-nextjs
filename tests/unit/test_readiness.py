from pathlib import Path
import sys

from fastapi import FastAPI
from fastapi.testclient import TestClient

PROJECT_ROOT = Path(__file__).resolve().parents[2]
API_DIR = PROJECT_ROOT / "platform" / "apps" / "api"
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

from routers import health  # noqa: E402


def test_readiness_fails_closed_when_launch_configuration_is_missing(monkeypatch):
    for name in ("SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_PRICE_TIER_MAP_JSON", "FEDPULSE_BILLING_PLANS_JSON", "SAM_GOV_API_KEY", "FEDPULSE_DATA_ROOT", "CANADABUYS_AWARDS_URL", "CANADABUYS_CONTRACT_HISTORY_URL"):
        monkeypatch.delenv(name, raising=False)
    app = FastAPI()
    app.include_router(health.router)
    response = TestClient(app).get("/health/ready")
    assert response.status_code == 503
    assert "SAM_GOV_API_KEY" in response.json()["detail"]["missing_configuration"]
