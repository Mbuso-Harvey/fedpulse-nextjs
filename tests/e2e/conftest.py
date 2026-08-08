"""Explicit authenticated principal for E2E tests; never used at runtime."""

from pathlib import Path
import sys

import pytest
from fastapi import Request
from fastapi.testclient import TestClient


PROJECT_ROOT = Path(__file__).resolve().parents[2]
API_DIR = PROJECT_ROOT / "platform" / "apps" / "api"
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))


@pytest.fixture(autouse=True)
def authenticated_test_principal():
    from main import app
    from services.auth import get_current_user

    async def principal(request: Request):
        tier = "starter" if "starter" in request.headers.get("authorization", "").casefold() else "professional"
        return {"id": "00000000-0000-0000-0000-000000000001", "user_metadata": {"subscription_tier": tier}}
    app.dependency_overrides[get_current_user] = principal
    yield
    app.dependency_overrides.pop(get_current_user, None)


@pytest.fixture
def client():
    from main import app
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def auth_headers():
    return {"Authorization": "Bearer professional-test-principal"}


@pytest.fixture
def starter_tier_headers():
    return {"Authorization": "Bearer starter-test-principal"}


@pytest.fixture
def unonboarded_headers():
    return {"Authorization": "Bearer professional-test-principal", "X-User-Id": "unonboarded-test-user"}
