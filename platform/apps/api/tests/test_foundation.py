import pytest
from fastapi import HTTPException
from pydantic import ValidationError

from config import settings
from main import app
from models.schemas import RenewalRequest
from services.auth import get_current_user


def test_canada_renewals_route_is_registered() -> None:
    paths = set(app.openapi()["paths"])
    assert "/api/v1/ca/renewals" in paths
    assert "/api/v1/ca/renewals/stats" in paths


@pytest.mark.asyncio
async def test_authentication_fails_closed_without_credentials(monkeypatch) -> None:
    monkeypatch.setattr(settings, "allow_dev_auth", False)
    monkeypatch.setattr(settings, "environment", "test")

    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(None)

    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_development_auth_requires_explicit_opt_in(monkeypatch) -> None:
    monkeypatch.setattr(settings, "allow_dev_auth", True)
    monkeypatch.setattr(settings, "environment", "test")

    user = await get_current_user(None)

    assert user["id"] == "local-development-user"
    assert user["user_metadata"]["subscription_tier"] == "professional"


def test_renewal_request_rejects_invalid_sort_order() -> None:
    with pytest.raises(ValidationError):
        RenewalRequest(sort_order="sideways")


def test_renewal_request_caps_page_size_in_schema() -> None:
    with pytest.raises(ValidationError):
        RenewalRequest(page_size=101)
