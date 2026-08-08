from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
import os
from typing import Optional

security = HTTPBearer(auto_error=False)

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_ANON_KEY")

# Use anon key for verifying JWTs from clients
supabase: Optional[Client] = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Return only a user verified by the configured authentication authority.

    Customer-facing routes must fail closed: request headers, strings that look
    like plan names, and missing provider configuration are never substitutes
    for a verified identity.
    """
    if not supabase:
        raise HTTPException(status_code=503, detail="Authentication service is not configured")
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication is required")
    token = credentials.credentials
    try:
        response = supabase.auth.get_user(token)
        if response.user:
            return response.user.model_dump()
        raise HTTPException(status_code=401, detail="Invalid token")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication")


def require_tier(allowed_tiers: list[str]):
    async def tier_checker(user = Depends(get_current_user)):
        tier = user.get("user_metadata", {}).get("subscription_tier", "starter")
        if tier not in allowed_tiers:
            raise HTTPException(status_code=403, detail="Your subscription tier does not have access to this resource")
        return user
    return tier_checker
