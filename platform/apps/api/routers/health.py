from fastapi import APIRouter

from config import settings
from models.schemas import HealthResponse
from services.data_service import data_service


router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    data_status = data_service.status()
    return HealthResponse(
        status="healthy" if data_status.configured else "degraded",
        version=settings.api_version,
        graph_version=settings.graph_version,
        environment=settings.environment,
        data_backend=data_status.backend,
        data_configured=data_status.configured,
    )
