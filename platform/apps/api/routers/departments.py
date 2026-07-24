from fastapi import APIRouter
from models.schemas import DepartmentRequest
from services.data_service import data_service
from typing import List, Dict, Any

router = APIRouter(prefix="/department", tags=["Department"])

@router.post("/intelligence", response_model=List[Dict[str, Any]])
async def get_department_intelligence(request: DepartmentRequest):
    df = data_service.get_departments()
    if df.empty:
        return []
        
    if request.department:
        df = df[df['buyer_department'] == request.department]
        
    return df.to_dict(orient='records')
