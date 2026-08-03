from typing import Any

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import Client, create_client

from config import settings


security = HTTPBearer(auto_error=False)

_auth_client: Client | None = None
if settings.supabase_url and settings.auth_supabase_key:
    _auth_client = create_client(settings.supabase_url, settings.auth_supabase_key)


def _dev_user() -> dict[str, Any]:
    return {
        "id": "local-development-user",
        "app_metadata": {"provider": "development"},
        "user_metadata": {
            "subscription_tier": settings.default_dev_subscription_tier,
            "is_trial": True,
        },
    }


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Security(security),
) -> dict[str, Any]:
    """Return the authenticated user and fail closed by default.

    Development bypass is available only when ALLOW_DEV_AUTH=true and the
    runtime is not production.
    """

    if credentials is None:
        if settings.allow_dev_auth and not settings.is_production:
            return _dev_user()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if _auth_client is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service is not configured",
        )

    try:
        response = _auth_client.auth.get_user(credentials.credentials)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    if not response.user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return response.user.model_dump()


def require_tier(allowed_tiers: list[str]):
    allowed = set(allowed_tiers)

    async def tier_checker(
        user: dict[str, Any] = Depends(get_current_user),
    ) -> dict[str, Any]:
        tier = user.get("user_metadata", {}).get("subscription_tier", "starter")
        if tier not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your subscription tier does not have access to this resource",
            )
        return user

    return tier_checker
