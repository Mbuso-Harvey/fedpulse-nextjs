import os
from pathlib import Path

from fastapi import APIRouter, HTTPException
from models.schemas import HealthResponse
from config import settings

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        version=settings.api_version,
        graph_version=settings.graph_version
    )


@router.get("/ready")
async def readiness_check():
    """Fail closed when required launch services or released data are absent."""
    required = (
        "SUPABASE_URL",
        "SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_ROLE_KEY",
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "STRIPE_PRICE_TIER_MAP_JSON",
        "FEDPULSE_BILLING_PLANS_JSON",
        "SAM_GOV_API_KEY",
        "FEDPULSE_DATA_ROOT",
        "CANADABUYS_AWARDS_URL",
        "CANADABUYS_CONTRACT_HISTORY_URL",
    )
    missing = [name for name in required if not os.getenv(name, "").strip()]
    data_root = Path(os.getenv("FEDPULSE_DATA_ROOT", "")) if not missing else None
    releases = data_root / "product_releases" if data_root else None
    canada_release_present = bool(releases and any(releases.glob("ca/renewal_watch/*/*/release.manifest.json")))
    if missing or not canada_release_present:
        detail = {"missing_configuration": missing, "canada_release_present": canada_release_present}
        raise HTTPException(status_code=503, detail=detail)
    return {"status": "ready", "canada_release_present": True}
