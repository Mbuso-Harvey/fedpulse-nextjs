from fastapi import APIRouter
from services.data_service import data_service
from typing import List, Dict, Any

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("", response_model=List[Dict[str, Any]])
async def get_recommendations():
    df = data_service.get_recommendations()
    if df.empty:
        return []
        
    return df.to_dict(orient='records')
