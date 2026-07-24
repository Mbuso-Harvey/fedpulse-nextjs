from fastapi import APIRouter, HTTPException, Query, Depends
from services.auth import get_current_user
from models.schemas import (
    RenewalRequest, 
    RenewalResponse, 
    DepartmentSummaryResponse, 
    SupplierExposureResponse,
    RenewalStatsResponse
)
from services.data_service import data_service
import pandas as pd
from typing import List

router = APIRouter(prefix="/renewals", tags=["Renewals"])

@router.post("", response_model=RenewalResponse)
async def get_renewals(request: RenewalRequest, user: dict = Depends(get_current_user)):
    df = data_service.get_renewals()
    if df.empty:
        return RenewalResponse(status="success", total_count=0, page=request.page, page_size=request.page_size, data=[], filters_applied={})
    
    # Apply filters
    filters_applied = {}
    if request.filters:
        if request.filters.department:
            df = df[df['buyer_department'] == request.filters.department]
            filters_applied['department'] = request.filters.department
        if request.filters.supplier:
            df = df[df['supplier_master_name'] == request.filters.supplier]
            filters_applied['supplier'] = request.filters.supplier
        if request.filters.min_value is not None:
            df = df[df['clean_contract_value'] >= request.filters.min_value]
            filters_applied['min_value'] = request.filters.min_value
        if request.filters.max_value is not None:
            df = df[df['clean_contract_value'] <= request.filters.max_value]
            filters_applied['max_value'] = request.filters.max_value
        if request.filters.days_until_end_max is not None:
            df = df[df['days_until_end'] <= request.filters.days_until_end_max]
            filters_applied['days_until_end_max'] = request.filters.days_until_end_max
        if request.filters.category:
            df = df[df['procurement_category'] == request.filters.category]
            filters_applied['category'] = request.filters.category

    # Sort
    sort_col = request.sort_by
    if sort_col in df.columns:
        ascending = request.sort_order.lower() == 'asc'
        df = df.sort_values(by=sort_col, ascending=ascending)
        
    total_count = len(df)
    
    # Paginate
    # Enforce API limits based on tier
    tier = user.get("user_metadata", {}).get("subscription_tier", "starter")
    if tier == "starter" and request.page_size > 10:
        request.page_size = 10
        # For starter, limit total accessible data
        df = df.head(10)
        total_count = len(df)
        
    start_idx = (request.page - 1) * request.page_size
    end_idx = start_idx + request.page_size
    
    data = df.iloc[start_idx:end_idx].to_dict(orient='records')
    
    return RenewalResponse(
        status="success",
        total_count=total_count,
        page=request.page,
        page_size=request.page_size,
        data=data,
        filters_applied=filters_applied
    )

@router.get("/departments", response_model=List[DepartmentSummaryResponse])
async def get_departments_summary():
    df = data_service.get_renewals()
    if df.empty:
        return []
    
    summary = df.groupby('buyer_department').agg(
        renewal_count=('contract_number', 'count'),
        renewal_value=('clean_contract_value', 'sum')
    ).reset_index()
    
    summary = summary.rename(columns={'buyer_department': 'department_name'})
    summary = summary.sort_values('renewal_value', ascending=False)
    
    return [DepartmentSummaryResponse(**row) for row in summary.to_dict(orient='records')]

@router.get("/suppliers", response_model=List[SupplierExposureResponse])
async def get_suppliers_summary():
    df = data_service.get_renewals()
    if df.empty:
        return []
        
    summary = df.groupby('supplier_master_name').agg(
        renewal_count=('contract_number', 'count'),
        renewal_value=('clean_contract_value', 'sum')
    ).reset_index()
    
    summary = summary.rename(columns={'supplier_master_name': 'supplier_name'})
    summary = summary.sort_values('renewal_value', ascending=False)
    
    return [SupplierExposureResponse(**row) for row in summary.to_dict(orient='records')]

@router.get("/stats", response_model=RenewalStatsResponse)
async def get_renewals_stats():
    df = data_service.get_renewals()
    if df.empty:
        return RenewalStatsResponse(
            total_candidates=0,
            total_value=0.0,
            departments_count=0,
            suppliers_count=0
        )
        
    return RenewalStatsResponse(
        total_candidates=len(df),
        total_value=float(df['clean_contract_value'].sum()),
        departments_count=df['buyer_department'].nunique(),
        suppliers_count=df['supplier_master_name'].nunique()
    )
