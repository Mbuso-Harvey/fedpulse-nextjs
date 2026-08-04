from __future__ import annotations

from typing import Any, Literal

from pydantic import Field, model_validator

from models.visualizations import (
    AnalyticsFacts,
    ApprovedVisualId,
    StrictContractModel,
)


ASK_FEDPULSE_CONTRACT_VERSION = "fedpulse.ask.response.v1"
ASK_FEDPULSE_TOOL_NAME = "query_ca_renewal_intelligence"

AnalysisId = Literal[
    "renewal_watchlist",
    "renewal_value_by_department",
    "renewal_value_by_supplier",
    "renewal_expiry_trend",
    "renewal_value_by_category",
    "renewal_value_distribution",
    "renewal_score_relationship",
    "department_supplier_flow",
]


class AskFedPulseFilters(StrictContractModel):
    department: str | None = Field(default=None, min_length=1, max_length=200)
    supplier: str | None = Field(default=None, min_length=1, max_length=240)
    category: str | None = Field(default=None, min_length=1, max_length=160)
    minValue: float | None = Field(default=None, ge=0)
    maxValue: float | None = Field(default=None, ge=0)
    daysUntilEndMin: int | None = Field(default=None, ge=-3650, le=36500)
    daysUntilEndMax: int | None = Field(default=None, ge=-3650, le=36500)
    expiryFrom: str | None = Field(default=None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    expiryTo: str | None = Field(default=None, pattern=r"^\d{4}-\d{2}-\d{2}$")

    @model_validator(mode="after")
    def validate_ranges(self) -> AskFedPulseFilters:
        if (
            self.minValue is not None
            and self.maxValue is not None
            and self.minValue > self.maxValue
        ):
            raise ValueError("minValue cannot exceed maxValue")
        if (
            self.daysUntilEndMin is not None
            and self.daysUntilEndMax is not None
            and self.daysUntilEndMin > self.daysUntilEndMax
        ):
            raise ValueError("daysUntilEndMin cannot exceed daysUntilEndMax")
        if self.expiryFrom and self.expiryTo and self.expiryFrom > self.expiryTo:
            raise ValueError("expiryFrom cannot be after expiryTo")
        return self


class AskFedPulseVisualContext(StrictContractModel):
    preferredVisualId: ApprovedVisualId | None = None
    recentVisualIds: list[ApprovedVisualId] = Field(
        default_factory=list,
        max_length=20,
    )
    accessibilityMode: Literal["standard", "high-contrast"] = "standard"
    audienceRole: str | None = Field(default=None, min_length=1, max_length=100)


class AskFedPulseRequest(StrictContractModel):
    question: str = Field(min_length=3, max_length=600)
    analysisId: AnalysisId
    filters: AskFedPulseFilters = Field(default_factory=AskFedPulseFilters)
    limit: int = Field(default=100, ge=1, le=1000)
    visualContext: AskFedPulseVisualContext = Field(
        default_factory=AskFedPulseVisualContext
    )


class AskFedPulseExecution(StrictContractModel):
    toolName: Literal["query_ca_renewal_intelligence"]
    analysisId: AnalysisId
    state: Literal["success", "empty", "unavailable"]
    requestId: str = Field(min_length=1, max_length=120)
    userTier: str = Field(min_length=1, max_length=60)
    sourceProductVersion: str | None = Field(default=None, max_length=100)
    rowsScanned: int = Field(ge=0)
    rowsMatched: int = Field(ge=0)
    rowsReturned: int = Field(ge=0)
    filtersApplied: dict[str, Any] = Field(default_factory=dict)
    queryPlan: list[str] = Field(min_length=1, max_length=20)
    warnings: list[str] = Field(default_factory=list, max_length=20)


class AskFedPulseResponse(StrictContractModel):
    contractVersion: Literal["fedpulse.ask.response.v1"]
    answer: str = Field(min_length=1, max_length=1200)
    analytics: AnalyticsFacts
    execution: AskFedPulseExecution
