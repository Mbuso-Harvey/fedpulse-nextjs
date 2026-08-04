from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, field_validator


class HealthResponse(BaseModel):
    status: str
    version: str
    graph_version: str
    environment: str
    data_backend: str
    data_configured: bool


class SourceContext(BaseModel):
    country_code: str
    source_system: str
    product_version: str
    coverage_through: Optional[str] = None
    generated_at: Optional[str] = None
    dataset_sha256: Optional[str] = None
    row_count: Optional[int] = None


class SearchRequest(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None
    limit: int = 10


class SearchResponse(BaseModel):
    status: str
    graph_version: str
    product_version: str
    data: List[Dict[str, Any]]
    lineage: Dict[str, Any]
    explainability: Dict[str, Any]


class RenewalFilters(BaseModel):
    department: Optional[str] = None
    supplier: Optional[str] = None
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    days_until_end_min: Optional[int] = None
    days_until_end_max: Optional[int] = None
    category: Optional[str] = None


class RenewalRequest(BaseModel):
    filters: RenewalFilters = Field(default_factory=RenewalFilters)
    sort_by: str = "days_until_end"
    sort_order: str = "asc"
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=25, ge=1, le=100)

    @field_validator("sort_order")
    @classmethod
    def validate_sort_order(cls, value: str) -> str:
        normalized = value.lower()
        if normalized not in {"asc", "desc"}:
            raise ValueError("sort_order must be 'asc' or 'desc'")
        return normalized


class RenewalResponse(BaseModel):
    status: str
    request_id: str
    total_count: int
    page: int
    page_size: int
    data: List[Dict[str, Any]]
    filters_applied: Dict[str, Any]
    source: SourceContext
    limitations: List[str] = Field(default_factory=list)


class DepartmentSummaryResponse(BaseModel):
    department_name: str
    renewal_count: int
    renewal_value: float


class SupplierExposureResponse(BaseModel):
    supplier_name: str
    renewal_count: int
    renewal_value: float


class RenewalStatsResponse(BaseModel):
    total_candidates: int
    total_value: float
    departments_count: int
    suppliers_count: int
    source: SourceContext


class DepartmentRequest(BaseModel):
    department: Optional[str] = None


class SupplierRequest(BaseModel):
    supplier: Optional[str] = None
