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
    if not supabase or not credentials:
        # Fallback to dev user if not configured
        return {"user_metadata": {"subscription_tier": "professional", "is_trial": True}}
    
    token = credentials.credentials
    try:
        response = supabase.auth.get_user(token)
        if response.user:
            return response.user.model_dump()
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication: {str(e)}")

def require_tier(allowed_tiers: list[str]):
    async def tier_checker(user = Depends(get_current_user)):
        tier = user.get("user_metadata", {}).get("subscription_tier", "starter")
        if tier not in allowed_tiers:
            raise HTTPException(status_code=403, detail="Your subscription tier does not have access to this resource")
        return user
    return tier_checker
