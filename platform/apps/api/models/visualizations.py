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


ANALYTICS_FACTS_CONTRACT_VERSION = "fedpulse.analytics.facts.v2"
VISUAL_REGISTRY_VERSION = "fedpulse.visual-registry.v1"
ScalarValue = str | int | float | bool | None

ApprovedVisualId = Literal[
    "trend.line.v1",
    "comparison.bar.v1",
    "comparison.dot.v1",
    "distribution.histogram.v1",
    "relationship.scatter.v1",
    "relationship.heatmap.v1",
    "composition.treemap.v1",
    "flow.sankey.v1",
    "geo.point-map.v1",
    "table.detail.v1",
]
AnalyticsIntent = Literal[
    "overview",
    "trend",
    "comparison",
    "ranking",
    "distribution",
    "relationship",
    "composition",
    "concentration",
    "flow",
    "transition",
    "allocation",
    "geography",
    "regional-comparison",
    "location",
]
SemanticFieldRole = Literal[
    "measure",
    "dimension",
    "time",
    "identifier",
    "source",
    "target",
    "weight",
    "latitude",
    "longitude",
    "geography",
    "stage",
]
SemanticType = Literal[
    "currency",
    "number",
    "percentage",
    "count",
    "duration",
    "date",
    "datetime",
    "category",
    "identifier",
    "organization",
    "supplier",
    "department",
    "latitude",
    "longitude",
    "region",
    "country",
    "flow-node",
    "flow-weight",
    "text",
]
Aggregation = Literal[
    "sum",
    "mean",
    "median",
    "min",
    "max",
    "count",
    "distinct_count",
    "none",
]


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


class AnalyticsDecision(StrictContractModel):
    intent: AnalyticsIntent
    question: str | None = Field(default=None, min_length=1, max_length=600)
    audienceRole: str | None = Field(default=None, min_length=1, max_length=100)
    preferredVisualId: ApprovedVisualId | None = None


class SemanticFieldQuality(StrictContractModel):
    coverage: float = Field(ge=0, le=1)
    confidence: float = Field(ge=0, le=1)


class SemanticField(StrictContractModel):
    field: str = Field(min_length=1, max_length=100)
    label: str = Field(min_length=1, max_length=160)
    roles: list[SemanticFieldRole] = Field(min_length=1, max_length=4)
    semanticType: SemanticType
    defaultAggregation: Aggregation
    allowedAggregations: list[Aggregation] = Field(min_length=1, max_length=8)
    currency: str | None = Field(default=None, pattern=r"^[A-Z]{3}$")
    unit: str | None = Field(default=None, min_length=1, max_length=40)
    priority: int = Field(default=50, ge=0, le=100)
    hierarchy: list[str] = Field(default_factory=list, max_length=10)
    sensitivity: Literal["public", "internal", "commercial", "restricted"] = (
        "internal"
    )
    quality: SemanticFieldQuality

    @model_validator(mode="after")
    def validate_semantic_field(self) -> SemanticField:
        if len(set(self.roles)) != len(self.roles):
            raise ValueError("semantic field roles must be unique")
        if len(set(self.allowedAggregations)) != len(self.allowedAggregations):
            raise ValueError("allowed aggregations must be unique")
        if self.defaultAggregation not in self.allowedAggregations:
            raise ValueError(
                "default aggregation must be in allowed aggregations"
            )

        is_measure = "measure" in self.roles or "weight" in self.roles
        if not is_measure and self.defaultAggregation != "none":
            raise ValueError("non-measure fields must use none aggregation")
        if self.semanticType == "currency" and not self.currency:
            raise ValueError(
                "currency semantic fields require an ISO currency code"
            )
        if "latitude" in self.roles and self.semanticType != "latitude":
            raise ValueError(
                "latitude role requires latitude semantic type"
            )
        if "longitude" in self.roles and self.semanticType != "longitude":
            raise ValueError(
                "longitude role requires longitude semantic type"
            )
        return self


class SemanticModel(StrictContractModel):
    registryVersion: Literal["fedpulse.visual-registry.v1"]
    fields: list[SemanticField] = Field(min_length=1, max_length=100)

    @model_validator(mode="after")
    def validate_unique_fields(self) -> SemanticModel:
        names = [field.field for field in self.fields]
        if len(set(names)) != len(names):
            raise ValueError("semantic field names must be unique")
        return self


class AnalyticsVisualPolicy(StrictContractModel):
    maxCharts: int = Field(default=4, ge=1, le=8)
    maxPerFamily: int = Field(default=1, ge=1, le=4)
    minimumConfidence: float = Field(default=0.62, ge=0, le=1)
    recentVisualIds: list[ApprovedVisualId] = Field(
        default_factory=list, max_length=50
    )
    allowedVisualIds: list[ApprovedVisualId] = Field(
        default_factory=list, max_length=20
    )
    deniedVisualIds: list[ApprovedVisualId] = Field(
        default_factory=list, max_length=20
    )
    diversityWeight: float = Field(default=1, ge=0, le=2)
    requireTableFallback: bool = True
    allowCustomSpec: bool = False
    accessibilityMode: Literal["standard", "high-contrast"] = "standard"
    maxCategories: int = Field(default=30, ge=2, le=100)
    maxHeatmapCardinality: int = Field(default=12, ge=2, le=30)
    maxSankeyNodes: int = Field(default=40, ge=2, le=100)
    maxSankeyLinks: int = Field(default=150, ge=1, le=500)
    maxMapPoints: int = Field(default=2000, ge=1, le=10_000)

    @model_validator(mode="after")
    def validate_policy(self) -> AnalyticsVisualPolicy:
        if self.maxPerFamily > self.maxCharts:
            raise ValueError("maxPerFamily cannot exceed maxCharts")
        overlap = set(self.allowedVisualIds).intersection(
            self.deniedVisualIds
        )
        if overlap:
            raise ValueError(
                "visuals cannot be both allowed and denied: "
                + ", ".join(sorted(overlap))
            )
        return self


class ChartLayoutItem(StrictContractModel):
    id: ApprovedVisualId
    span: int = Field(ge=1, le=12)


class AnalyticsPresentation(StrictContractModel):
    theme: Literal["auto", "light", "dark"] = "auto"
    layoutMode: Literal["auto", "canvas", "grid"] = "auto"
    approvalMode: bool = False
    visualId: ApprovedVisualId | None = None
    chartConfig: dict[str, Any] | None = None
    chartLayout: list[ChartLayoutItem] | None = Field(
        default=None, max_length=30
    )
    spec: dict[str, Any] | None = None


class AnalyticsFacts(StrictContractModel):
    contractVersion: Literal["fedpulse.analytics.facts.v2"]
    datasetId: str = Field(pattern=r"^[a-z0-9][a-z0-9._-]{2,119}$")
    title: str = Field(min_length=1, max_length=160)
    description: str | None = Field(default=None, min_length=1, max_length=600)
    status: AnalyticsStatus
    provenance: AnalyticsProvenance
    decision: AnalyticsDecision
    semanticModel: SemanticModel
    visualPolicy: AnalyticsVisualPolicy = Field(
        default_factory=AnalyticsVisualPolicy
    )
    presentation: AnalyticsPresentation = Field(
        default_factory=AnalyticsPresentation
    )
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
        if self.presentation.spec and not self.visualPolicy.allowCustomSpec:
            raise ValueError(
                "custom specifications require allowCustomSpec=true"
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

        semantic_keys = sorted(
            field.field for field in self.semanticModel.fields
        )
        if semantic_keys != first_keys:
            raise ValueError(
                "semantic model must describe every fact field exactly once"
            )

        if self.decision.intent in {"flow", "transition", "allocation"}:
            source_count = sum(
                "source" in field.roles
                for field in self.semanticModel.fields
            )
            target_count = sum(
                "target" in field.roles
                for field in self.semanticModel.fields
            )
            weight_count = sum(
                "weight" in field.roles
                for field in self.semanticModel.fields
            )
            if (source_count, target_count, weight_count) != (1, 1, 1):
                raise ValueError(
                    "flow decisions require exactly one source, target, "
                    "and weight field"
                )

        if self.decision.intent in {
            "geography",
            "regional-comparison",
            "location",
        }:
            latitude_count = sum(
                "latitude" in field.roles
                for field in self.semanticModel.fields
            )
            longitude_count = sum(
                "longitude" in field.roles
                for field in self.semanticModel.fields
            )
            if (latitude_count, longitude_count) != (1, 1):
                raise ValueError(
                    "geographic decisions require exactly one latitude "
                    "and longitude field"
                )

        return self


analytics_facts_adapter = TypeAdapter(AnalyticsFacts)


def validate_analytics_facts(payload: object) -> AnalyticsFacts:
    return analytics_facts_adapter.validate_python(payload)
