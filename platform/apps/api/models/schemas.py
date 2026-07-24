from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class HealthResponse(BaseModel):
    status: str
    version: str
    graph_version: str

# Search Models
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

# Renewal Models
class RenewalFilters(BaseModel):
    department: Optional[str] = None
    supplier: Optional[str] = None
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    days_until_end_max: Optional[int] = None
    category: Optional[str] = None

class RenewalRequest(BaseModel):
    filters: RenewalFilters = Field(default_factory=RenewalFilters)
    sort_by: str = "days_until_end"
    sort_order: str = "asc"
    page: int = 1
    page_size: int = 25

class RenewalResponse(BaseModel):
    status: str
    total_count: int
    page: int
    page_size: int
    data: List[Dict[str, Any]]
    filters_applied: Dict[str, Any]

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

# Department Models
class DepartmentRequest(BaseModel):
    department: Optional[str] = None

# Supplier Models
class SupplierRequest(BaseModel):
    supplier: Optional[str] = None
