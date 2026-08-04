from typing import Any

from fastapi import APIRouter, Depends

from models.ask_fedpulse import AskFedPulseRequest, AskFedPulseResponse
from services.ask_fedpulse import execute_ask_fedpulse
from services.auth import get_current_user


router = APIRouter(tags=["Ask FedPulse"])


@router.post("", response_model=AskFedPulseResponse)
async def ask_fedpulse(
    request: AskFedPulseRequest,
    user: dict[str, Any] = Depends(get_current_user),
) -> AskFedPulseResponse:
    """Execute an allowlisted, grounded Canada procurement analysis.

    The caller selects a registered analysis ID and structured filters. The
    server never accepts raw SQL, arbitrary columns, or frontend calculations.
    """

    return execute_ask_fedpulse(request, user)
