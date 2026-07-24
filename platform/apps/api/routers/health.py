from fastapi import APIRouter
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
