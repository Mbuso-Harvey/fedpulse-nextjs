from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, TypeAdapter, model_validator


VISUALIZATION_CONTRACT_VERSION = "fedpulse.visualization.v1"
ScalarValue = str | int | float | bool | None


class StrictContractModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ValueFormat(StrictContractModel):
    style: Literal["text", "number", "currency", "percent", "date"]
    notation: Literal["standard", "compact"] = "standard"
    decimals: int = Field(default=0, ge=0, le=4)
    currency: str | None = Field(default=None, pattern=r"^[A-Z]{3}$")
    percentScale: Literal["points", "fraction"] = "points"
    prefix: str | None = Field(default=None, max_length=12)
    suffix: str | None = Field(default=None, max_length=12)

    @model_validator(mode="after")
    def validate_currency(self) -> ValueFormat:
        if self.style == "currency" and not self.currency:
            raise ValueError("currency is required when style is currency")
        return self


class WidgetProvenance(StrictContractModel):
    sourceSystem: str = Field(min_length=1, max_length=100)
    sourceUrl: str | None = None
    productVersion: str = Field(min_length=1, max_length=100)
    coverageThrough: date
    generatedAt: datetime
    datasetHash: str | None = Field(default=None, min_length=8, max_length=160)
    requestId: str | None = Field(default=None, min_length=1, max_length=120)
    evidenceIds: list[str] = Field(default_factory=list, max_length=100)
    limitations: list[str] = Field(default_factory=list, max_length=20)


class WidgetStatus(StrictContractModel):
    state: Literal["ready", "partial", "empty", "error"]
    message: str | None = Field(default=None, min_length=1, max_length=300)


class BaseWidgetSpec(StrictContractModel):
    contractVersion: Literal["fedpulse.visualization.v1"]
    widgetId: str = Field(pattern=r"^[a-z0-9][a-z0-9._-]{2,99}$")
    title: str = Field(min_length=1, max_length=120)
    description: str | None = Field(default=None, min_length=1, max_length=500)
    status: WidgetStatus
    provenance: WidgetProvenance


class MetricPayload(StrictContractModel):
    label: str | None = Field(default=None, min_length=1, max_length=100)
    value: ScalarValue
    format: ValueFormat | None = None
    context: str | None = Field(default=None, min_length=1, max_length=240)
    trendLabel: str | None = Field(default=None, min_length=1, max_length=120)


class MetricWidgetSpec(BaseWidgetSpec):
    kind: Literal["metric"]
    metric: MetricPayload


class ChartSeries(StrictContractModel):
    dataKey: str = Field(min_length=1, max_length=80)
    label: str = Field(min_length=1, max_length=100)
    format: ValueFormat | None = None


class ChartConfiguration(StrictContractModel):
    type: Literal["bar", "line", "pie", "scatter"]
    xKey: str = Field(min_length=1, max_length=80)
    xLabel: str | None = Field(default=None, min_length=1, max_length=100)
    yLabel: str | None = Field(default=None, min_length=1, max_length=100)
    barDirection: Literal["columns", "rows"] = "columns"
    showLegend: bool = True
    stacked: bool = False
    series: list[ChartSeries] = Field(min_length=1, max_length=5)


class ChartWidgetSpec(BaseWidgetSpec):
    kind: Literal["chart"]
    chart: ChartConfiguration
    data: list[dict[str, ScalarValue]] = Field(max_length=500)

    @model_validator(mode="after")
    def validate_chart_shape(self) -> ChartWidgetSpec:
        if self.chart.type in {"pie", "scatter"} and len(self.chart.series) != 1:
            raise ValueError(f"{self.chart.type} charts require exactly one series")

        required_keys = [
            self.chart.xKey,
            *(series.dataKey for series in self.chart.series),
        ]
        for row_index, row in enumerate(self.data):
            missing = [key for key in required_keys if key not in row]
            if missing:
                raise ValueError(
                    f"chart row {row_index} is missing required fields: {', '.join(missing)}"
                )
        return self


class TableColumn(StrictContractModel):
    key: str = Field(min_length=1, max_length=80)
    label: str = Field(min_length=1, max_length=100)
    align: Literal["left", "center", "right"] = "left"
    format: ValueFormat | None = None


class TablePayload(StrictContractModel):
    columns: list[TableColumn] = Field(min_length=1, max_length=20)
    rows: list[dict[str, ScalarValue]] = Field(max_length=1000)
    rowKey: str | None = Field(default=None, min_length=1, max_length=80)


class TableWidgetSpec(BaseWidgetSpec):
    kind: Literal["table"]
    table: TablePayload


class InsightItem(StrictContractModel):
    id: str = Field(min_length=1, max_length=100)
    title: str = Field(min_length=1, max_length=140)
    summary: str = Field(min_length=1, max_length=800)
    severity: Literal["info", "opportunity", "watch", "risk"]
    evidenceIds: list[str] = Field(default_factory=list, max_length=30)


class InsightListWidgetSpec(BaseWidgetSpec):
    kind: Literal["insight_list"]
    insights: list[InsightItem] = Field(max_length=20)


AnalyticsWidgetSpec = Annotated[
    MetricWidgetSpec | ChartWidgetSpec | TableWidgetSpec | InsightListWidgetSpec,
    Field(discriminator="kind"),
]

analytics_widget_adapter = TypeAdapter(AnalyticsWidgetSpec)


def validate_analytics_widget(payload: object) -> AnalyticsWidgetSpec:
    return analytics_widget_adapter.validate_python(payload)
