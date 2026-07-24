from fastapi import APIRouter
from models.schemas import SupplierRequest
from services.data_service import data_service
from typing import List, Dict, Any

router = APIRouter(prefix="/supplier", tags=["Supplier"])

@router.post("/intelligence", response_model=List[Dict[str, Any]])
async def get_supplier_intelligence(request: SupplierRequest):
    df = data_service.get_suppliers()
    if df.empty:
        return []
        
    if request.supplier:
        df = df[df['supplier_master_name'] == request.supplier]
        
    return df.to_dict(orient='records')
