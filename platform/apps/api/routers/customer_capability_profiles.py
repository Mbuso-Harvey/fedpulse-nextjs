"""Authenticated customer capability-profile API for U.S. intelligence."""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from services.auth import get_current_user
from services.customer_capability_profiles import (
    CustomerCapabilityProfileError,
    StoredCustomerCapabilityProfile,
    get_customer_capability_profile,
    save_customer_capability_profile,
)


router = APIRouter(prefix="/customer-capability-profile", tags=["Customer capability profile"])


class CapabilityProfileRequest(BaseModel):
    certifications: list[str] = Field(default_factory=list, max_length=100)
    clearances: list[str] = Field(default_factory=list, max_length=100)
    capabilities: list[str] = Field(default_factory=list, max_length=100)


def _user_id(user: dict[str, Any]) -> str:
    user_id = user.get("id") or user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Verified user identifier is required")
    return str(user_id)


def _response(profile: StoredCustomerCapabilityProfile) -> dict[str, Any]:
    return {
        "profile_id": profile.profile_id,
        "certifications": list(profile.certifications),
        "clearances": list(profile.clearances),
        "capabilities": list(profile.capabilities),
        "version": profile.version,
    }


@router.get("")
async def read_customer_capability_profile(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    try:
        profile = get_customer_capability_profile(_user_id(user))
    except CustomerCapabilityProfileError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    if not profile:
        raise HTTPException(status_code=404, detail="Customer capability profile is not configured")
    return _response(profile)


@router.put("")
async def write_customer_capability_profile(
    request: CapabilityProfileRequest,
    user: dict[str, Any] = Depends(get_current_user),
) -> dict[str, Any]:
    try:
        profile = save_customer_capability_profile(
            user_id=_user_id(user),
            certifications=request.certifications,
            clearances=request.clearances,
            capabilities=request.capabilities,
        )
    except CustomerCapabilityProfileError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return _response(profile)
