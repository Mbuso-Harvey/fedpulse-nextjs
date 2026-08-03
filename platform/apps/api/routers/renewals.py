from typing import Any, List
from uuid import uuid4

import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, status

from config import settings
from models.schemas import (
    DepartmentSummaryResponse,
    RenewalRequest,
    RenewalResponse,
    RenewalStatsResponse,
    SourceContext,
    SupplierExposureResponse,
)
from services.auth import get_current_user
from services.data_service import DataUnavailableError, data_service


router = APIRouter(tags=["Canada Renewals"])


def _source_context() -> SourceContext:
    return SourceContext(
        country_code=settings.ca_country_code,
        source_system=settings.ca_source_system,
        product_version=settings.ca_product_version,
        coverage_through=settings.ca_coverage_through,
    )


def _load_renewals() -> pd.DataFrame:
    try:
        return data_service.get_renewals()
    except DataUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc


@router.post("", response_model=RenewalResponse)
async def get_renewals(
    request: RenewalRequest,
    user: dict[str, Any] = Depends(get_current_user),
) -> RenewalResponse:
    df = _load_renewals()
    filters_applied: dict[str, Any] = {}

    if request.filters.department:
        df = df[df["buyer_department"] == request.filters.department]
        filters_applied["department"] = request.filters.department

    if request.filters.supplier:
        df = df[df["supplier_master_name"] == request.filters.supplier]
        filters_applied["supplier"] = request.filters.supplier

    if request.filters.min_value is not None:
        df = df[df["clean_contract_value"] >= request.filters.min_value]
        filters_applied["min_value"] = request.filters.min_value

    if request.filters.max_value is not None:
        df = df[df["clean_contract_value"] <= request.filters.max_value]
        filters_applied["max_value"] = request.filters.max_value

    if request.filters.days_until_end_min is not None:
        df = df[df["days_until_end"] >= request.filters.days_until_end_min]
        filters_applied["days_until_end_min"] = request.filters.days_until_end_min

    if request.filters.days_until_end_max is not None:
        df = df[df["days_until_end"] <= request.filters.days_until_end_max]
        filters_applied["days_until_end_max"] = request.filters.days_until_end_max

    if request.filters.category:
        df = df[df["procurement_category"] == request.filters.category]
        filters_applied["category"] = request.filters.category

    if request.sort_by in df.columns:
        df = df.sort_values(
            by=request.sort_by,
            ascending=request.sort_order == "asc",
            kind="mergesort",
        )

    tier = user.get("user_metadata", {}).get("subscription_tier", "starter")
    effective_page_size = (
        min(request.page_size, 10) if tier == "starter" else request.page_size
    )

    total_count = len(df)
    start_idx = (request.page - 1) * effective_page_size
    end_idx = start_idx + effective_page_size
    records = df.iloc[start_idx:end_idx].to_dict(orient="records")

    return RenewalResponse(
        status="success",
        request_id=str(uuid4()),
        total_count=total_count,
        page=request.page,
        page_size=effective_page_size,
        data=records,
        filters_applied=filters_applied,
        source=_source_context(),
        limitations=(
            ["Starter plan responses are limited to 10 records per page."]
            if tier == "starter"
            else []
        ),
    )


@router.get("/departments", response_model=List[DepartmentSummaryResponse])
async def get_departments_summary(
    _: dict[str, Any] = Depends(get_current_user),
) -> list[DepartmentSummaryResponse]:
    df = _load_renewals()
    summary = (
        df.groupby("buyer_department")
        .agg(
            renewal_count=("contract_number", "count"),
            renewal_value=("clean_contract_value", "sum"),
        )
        .reset_index()
        .rename(columns={"buyer_department": "department_name"})
        .sort_values("renewal_value", ascending=False)
    )
    return [
        DepartmentSummaryResponse(**row)
        for row in summary.to_dict(orient="records")
    ]


@router.get("/suppliers", response_model=List[SupplierExposureResponse])
async def get_suppliers_summary(
    _: dict[str, Any] = Depends(get_current_user),
) -> list[SupplierExposureResponse]:
    df = _load_renewals()
    summary = (
        df.groupby("supplier_master_name")
        .agg(
            renewal_count=("contract_number", "count"),
            renewal_value=("clean_contract_value", "sum"),
        )
        .reset_index()
        .rename(columns={"supplier_master_name": "supplier_name"})
        .sort_values("renewal_value", ascending=False)
    )
    return [
        SupplierExposureResponse(**row)
        for row in summary.to_dict(orient="records")
    ]


@router.get("/stats", response_model=RenewalStatsResponse)
async def get_renewals_stats(
    _: dict[str, Any] = Depends(get_current_user),
) -> RenewalStatsResponse:
    df = _load_renewals()
    return RenewalStatsResponse(
        total_candidates=len(df),
        total_value=float(df["clean_contract_value"].sum()),
        departments_count=int(df["buyer_department"].nunique()),
        suppliers_count=int(df["supplier_master_name"].nunique()),
        source=_source_context(),
    )
