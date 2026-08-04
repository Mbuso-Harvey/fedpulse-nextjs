from __future__ import annotations

from datetime import date
from typing import Any, Literal

from pydantic import (
    AwareDatetime,
    BaseModel,
    ConfigDict,
    Field,
    HttpUrl,
    TypeAdapter,
    model_validator,
)


ANALYTICS_FACTS_CONTRACT_VERSION = "fedpulse.analytics.facts.v1"
ScalarValue = str | int | float | bool | None


class StrictContractModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class AnalyticsProvenance(StrictContractModel):
    sourceSystem: str = Field(min_length=1, max_length=100)
    sourceUrl: HttpUrl | None = None
    productVersion: str = Field(min_length=1, max_length=100)
    coverageThrough: date
    generatedAt: AwareDatetime
    datasetHash: str | None = Field(default=None, min_length=8, max_length=160)
    requestId: str | None = Field(default=None, min_length=1, max_length=120)
    evidenceIds: list[str] = Field(default_factory=list, max_length=100)
    limitations: list[str] = Field(default_factory=list, max_length=20)


class AnalyticsStatus(StrictContractModel):
    state: Literal["ready", "partial", "empty", "error"]
    message: str | None = Field(default=None, min_length=1, max_length=300)


class ChartLayoutItem(StrictContractModel):
    id: str = Field(min_length=1, max_length=100)
    span: int = Field(ge=1, le=12)


class AnalyticsPresentation(StrictContractModel):
    theme: Literal["auto", "light", "dark"] = "auto"
    layoutMode: Literal["auto", "canvas", "grid"] = "auto"
    approvalMode: bool = False
    chartConfig: dict[str, Any] | None = None
    chartLayout: list[ChartLayoutItem] | None = Field(default=None, max_length=30)
    spec: dict[str, Any] | None = None


class AnalyticsFacts(StrictContractModel):
    contractVersion: Literal["fedpulse.analytics.facts.v1"]
    datasetId: str = Field(pattern=r"^[a-z0-9][a-z0-9._-]{2,119}$")
    title: str = Field(min_length=1, max_length=160)
    description: str | None = Field(default=None, min_length=1, max_length=600)
    status: AnalyticsStatus
    provenance: AnalyticsProvenance
    presentation: AnalyticsPresentation = Field(default_factory=AnalyticsPresentation)
    facts: list[dict[str, ScalarValue]] = Field(max_length=10_000)

    @model_validator(mode="after")
    def validate_fact_set(self) -> AnalyticsFacts:
        has_facts = bool(self.facts)
        if self.status.state in {"ready", "partial"} and not has_facts:
            raise ValueError(
                f"{self.status.state} analytics require at least one fact row"
            )
        if self.status.state in {"empty", "error"} and has_facts:
            raise ValueError(
                f"{self.status.state} analytics must not include fact rows"
            )
        if not has_facts:
            return self

        first_keys = sorted(self.facts[0])
        if not first_keys:
            raise ValueError("fact rows must contain at least one field")
        for row_index, row in enumerate(self.facts):
            if sorted(row) != first_keys:
                raise ValueError(
                    f"fact row {row_index} does not expose the same fields"
                )
        return self


analytics_facts_adapter = TypeAdapter(AnalyticsFacts)


def validate_analytics_facts(payload: object) -> AnalyticsFacts:
    return analytics_facts_adapter.validate_python(payload)
