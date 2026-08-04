from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timezone
from typing import Any, Callable
from uuid import uuid4

import pandas as pd

from models.ask_fedpulse import (
    ASK_FEDPULSE_CONTRACT_VERSION,
    ASK_FEDPULSE_TOOL_NAME,
    AnalysisId,
    AskFedPulseExecution,
    AskFedPulseRequest,
    AskFedPulseResponse,
)
from models.visualizations import (
    ANALYTICS_FACTS_CONTRACT_VERSION,
    VISUAL_REGISTRY_VERSION,
    AnalyticsDecision,
    AnalyticsFacts,
    AnalyticsPresentation,
    AnalyticsProvenance,
    AnalyticsStatus,
    AnalyticsVisualPolicy,
    SemanticField,
    SemanticFieldQuality,
    SemanticModel,
)
from services.data_service import DataUnavailableError, data_service


class GroundingError(RuntimeError):
    """Raised when an allowlisted analysis cannot be grounded in the product."""


@dataclass(frozen=True)
class AnalysisDefinition:
    intent: str
    title: str
    description: str
    allowed_visuals: tuple[str, ...]
    executor: Callable[[pd.DataFrame, int], tuple[list[dict[str, Any]], list[SemanticField]]]


def _quality(confidence: float = 0.95, coverage: float = 1.0) -> SemanticFieldQuality:
    return SemanticFieldQuality(coverage=coverage, confidence=confidence)


def _field(
    *,
    field: str,
    label: str,
    roles: list[str],
    semantic_type: str,
    aggregation: str = "none",
    allowed_aggregations: list[str] | None = None,
    priority: int = 50,
    currency: str | None = None,
    unit: str | None = None,
    confidence: float = 0.95,
) -> SemanticField:
    return SemanticField(
        field=field,
        label=label,
        roles=roles,
        semanticType=semantic_type,
        defaultAggregation=aggregation,
        allowedAggregations=allowed_aggregations or [aggregation],
        priority=priority,
        currency=currency,
        unit=unit,
        sensitivity="public",
        quality=_quality(confidence=confidence),
    )


def _require_columns(frame: pd.DataFrame, columns: set[str]) -> None:
    missing = sorted(columns.difference(frame.columns))
    if missing:
        raise GroundingError(
            "The active Canada renewal product is missing required governed fields: "
            + ", ".join(missing)
        )


def _json_scalar(value: Any) -> str | int | float | bool | None:
    if value is None or pd.isna(value):
        return None
    if isinstance(value, pd.Timestamp):
        return value.date().isoformat()
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if hasattr(value, "item"):
        value = value.item()
    if isinstance(value, (str, int, float, bool)):
        return value
    return str(value)


def _records(frame: pd.DataFrame) -> list[dict[str, Any]]:
    return [
        {key: _json_scalar(value) for key, value in row.items()}
        for row in frame.to_dict(orient="records")
    ]


def _watchlist(frame: pd.DataFrame, limit: int) -> tuple[list[dict[str, Any]], list[SemanticField]]:
    required = {
        "contract_number",
        "clean_contract_end_date",
        "buyer_department",
        "supplier_master_name",
        "procurement_category",
        "clean_contract_value",
        "days_until_end",
    }
    _require_columns(frame, required)
    columns = [
        "contract_number",
        "clean_contract_end_date",
        "buyer_department",
        "supplier_master_name",
        "procurement_category",
        "clean_contract_value",
        "days_until_end",
    ]
    if "renewal_score" in frame.columns:
        columns.append("renewal_score")

    result = (
        frame.sort_values(
            ["days_until_end", "clean_contract_value"],
            ascending=[True, False],
            kind="mergesort",
        )
        .head(limit)[columns]
        .rename(
            columns={
                "contract_number": "contractNumber",
                "clean_contract_end_date": "expiryDate",
                "buyer_department": "department",
                "supplier_master_name": "supplier",
                "procurement_category": "category",
                "clean_contract_value": "contractValue",
                "days_until_end": "daysUntilEnd",
                "renewal_score": "renewalScore",
            }
        )
    )
    fields = [
        _field(field="contractNumber", label="Contract number", roles=["identifier"], semantic_type="identifier", priority=30),
        _field(field="expiryDate", label="Contract expiry date", roles=["time"], semantic_type="date", priority=95),
        _field(field="department", label="Buyer department", roles=["dimension"], semantic_type="department", priority=85),
        _field(field="supplier", label="Supplier", roles=["dimension"], semantic_type="supplier", priority=80),
        _field(field="category", label="Procurement category", roles=["dimension"], semantic_type="category", priority=65),
        _field(
            field="contractValue",
            label="Contract value",
            roles=["measure"],
            semantic_type="currency",
            aggregation="sum",
            allowed_aggregations=["sum", "mean", "median", "min", "max"],
            priority=100,
            currency="CAD",
        ),
        _field(
            field="daysUntilEnd",
            label="Days until expiry",
            roles=["measure"],
            semantic_type="duration",
            aggregation="median",
            allowed_aggregations=["median", "mean", "min", "max"],
            priority=75,
            unit="days",
        ),
    ]
    if "renewalScore" in result.columns:
        fields.append(
            _field(
                field="renewalScore",
                label="Renewal score",
                roles=["measure"],
                semantic_type="number",
                aggregation="mean",
                allowed_aggregations=["mean", "median", "min", "max"],
                priority=70,
            )
        )
    return _records(result), fields


def _group_value(
    frame: pd.DataFrame,
    *,
    source_column: str,
    output_column: str,
    label: str,
    semantic_type: str,
    limit: int,
) -> tuple[list[dict[str, Any]], list[SemanticField]]:
    _require_columns(frame, {source_column, "contract_number", "clean_contract_value"})
    result = (
        frame.dropna(subset=[source_column])
        .groupby(source_column, dropna=False)
        .agg(
            contractValue=("clean_contract_value", "sum"),
            renewalCount=("contract_number", "nunique"),
        )
        .reset_index()
        .rename(columns={source_column: output_column})
        .sort_values(["contractValue", output_column], ascending=[False, True], kind="mergesort")
        .head(limit)
    )
    fields = [
        _field(field=output_column, label=label, roles=["dimension"], semantic_type=semantic_type, priority=90),
        _field(
            field="contractValue",
            label="Renewal contract value",
            roles=["measure"],
            semantic_type="currency",
            aggregation="sum",
            allowed_aggregations=["sum", "mean", "median", "min", "max"],
            priority=100,
            currency="CAD",
        ),
        _field(
            field="renewalCount",
            label="Renewal candidate count",
            roles=["measure"],
            semantic_type="count",
            aggregation="sum",
            allowed_aggregations=["sum", "mean", "median", "min", "max"],
            priority=75,
        ),
    ]
    return _records(result), fields


def _department_value(frame: pd.DataFrame, limit: int):
    return _group_value(
        frame,
        source_column="buyer_department",
        output_column="department",
        label="Buyer department",
        semantic_type="department",
        limit=limit,
    )


def _supplier_value(frame: pd.DataFrame, limit: int):
    return _group_value(
        frame,
        source_column="supplier_master_name",
        output_column="supplier",
        label="Supplier",
        semantic_type="supplier",
        limit=limit,
    )


def _category_value(frame: pd.DataFrame, limit: int):
    return _group_value(
        frame,
        source_column="procurement_category",
        output_column="category",
        label="Procurement category",
        semantic_type="category",
        limit=limit,
    )


def _expiry_trend(frame: pd.DataFrame, limit: int) -> tuple[list[dict[str, Any]], list[SemanticField]]:
    _require_columns(frame, {"clean_contract_end_date", "contract_number", "clean_contract_value"})
    working = frame.copy()
    working["expiryMonth"] = pd.to_datetime(
        working["clean_contract_end_date"], errors="coerce"
    ).dt.to_period("M").astype("string")
    result = (
        working.dropna(subset=["expiryMonth"])
        .groupby("expiryMonth")
        .agg(
            contractValue=("clean_contract_value", "sum"),
            renewalCount=("contract_number", "nunique"),
        )
        .reset_index()
        .sort_values("expiryMonth", kind="mergesort")
        .head(limit)
    )
    fields = [
        _field(field="expiryMonth", label="Expiry month", roles=["time"], semantic_type="date", priority=100),
        _field(
            field="contractValue",
            label="Renewal contract value",
            roles=["measure"],
            semantic_type="currency",
            aggregation="sum",
            allowed_aggregations=["sum", "mean", "median", "min", "max"],
            priority=95,
            currency="CAD",
        ),
        _field(
            field="renewalCount",
            label="Renewal candidate count",
            roles=["measure"],
            semantic_type="count",
            aggregation="sum",
            allowed_aggregations=["sum", "mean", "median", "min", "max"],
            priority=75,
        ),
    ]
    return _records(result), fields


def _value_distribution(frame: pd.DataFrame, limit: int) -> tuple[list[dict[str, Any]], list[SemanticField]]:
    _require_columns(frame, {"clean_contract_value", "procurement_category"})
    result = (
        frame[["clean_contract_value", "procurement_category"]]
        .dropna(subset=["clean_contract_value"])
        .sort_values("clean_contract_value", ascending=False, kind="mergesort")
        .head(limit)
        .rename(columns={"clean_contract_value": "contractValue", "procurement_category": "category"})
    )
    fields = [
        _field(
            field="contractValue",
            label="Contract value",
            roles=["measure"],
            semantic_type="currency",
            aggregation="median",
            allowed_aggregations=["median", "mean", "min", "max", "sum"],
            priority=100,
            currency="CAD",
        ),
        _field(field="category", label="Procurement category", roles=["dimension"], semantic_type="category", priority=45),
    ]
    return _records(result), fields


def _score_relationship(frame: pd.DataFrame, limit: int) -> tuple[list[dict[str, Any]], list[SemanticField]]:
    _require_columns(frame, {"renewal_score", "clean_contract_value", "supplier_master_name"})
    result = (
        frame[["renewal_score", "clean_contract_value", "supplier_master_name"]]
        .dropna(subset=["renewal_score", "clean_contract_value"])
        .sort_values("clean_contract_value", ascending=False, kind="mergesort")
        .head(limit)
        .rename(
            columns={
                "renewal_score": "renewalScore",
                "clean_contract_value": "contractValue",
                "supplier_master_name": "supplier",
            }
        )
    )
    fields = [
        _field(
            field="renewalScore",
            label="Renewal score",
            roles=["measure"],
            semantic_type="number",
            aggregation="mean",
            allowed_aggregations=["mean", "median", "min", "max"],
            priority=90,
        ),
        _field(
            field="contractValue",
            label="Contract value",
            roles=["measure"],
            semantic_type="currency",
            aggregation="sum",
            allowed_aggregations=["sum", "mean", "median", "min", "max"],
            priority=100,
            currency="CAD",
        ),
        _field(field="supplier", label="Supplier", roles=["dimension"], semantic_type="supplier", priority=55),
    ]
    return _records(result), fields


def _department_supplier_flow(frame: pd.DataFrame, limit: int) -> tuple[list[dict[str, Any]], list[SemanticField]]:
    _require_columns(frame, {"buyer_department", "supplier_master_name", "clean_contract_value"})
    working = frame.dropna(
        subset=["buyer_department", "supplier_master_name", "clean_contract_value"]
    ).copy()
    working = working[pd.to_numeric(working["clean_contract_value"], errors="coerce") > 0]
    result = (
        working.groupby(["buyer_department", "supplier_master_name"], dropna=False)
        .agg(contractValue=("clean_contract_value", "sum"))
        .reset_index()
        .rename(
            columns={
                "buyer_department": "sourceDepartment",
                "supplier_master_name": "targetSupplier",
            }
        )
        .sort_values(["contractValue", "sourceDepartment", "targetSupplier"], ascending=[False, True, True], kind="mergesort")
        .head(limit)
    )
    fields = [
        _field(field="sourceDepartment", label="Buyer department", roles=["source"], semantic_type="flow-node", priority=100),
        _field(field="targetSupplier", label="Supplier", roles=["target"], semantic_type="flow-node", priority=95),
        _field(
            field="contractValue",
            label="Contract value flow",
            roles=["weight", "measure"],
            semantic_type="flow-weight",
            aggregation="sum",
            allowed_aggregations=["sum"],
            priority=100,
            currency="CAD",
        ),
    ]
    return _records(result), fields


ANALYSES: dict[AnalysisId, AnalysisDefinition] = {
    "renewal_watchlist": AnalysisDefinition(
        intent="overview",
        title="Canada renewal watchlist",
        description="Authorized renewal candidates ordered by proximity to contract expiry.",
        allowed_visuals=("trend.line.v1", "comparison.bar.v1", "comparison.dot.v1", "table.detail.v1"),
        executor=_watchlist,
    ),
    "renewal_value_by_department": AnalysisDefinition(
        intent="comparison",
        title="Renewal value by department",
        description="Governed comparison of renewal candidate value and count by buyer department.",
        allowed_visuals=("comparison.bar.v1", "comparison.dot.v1", "composition.treemap.v1", "table.detail.v1"),
        executor=_department_value,
    ),
    "renewal_value_by_supplier": AnalysisDefinition(
        intent="ranking",
        title="Supplier renewal exposure",
        description="Governed ranking of supplier exposure across renewal candidates.",
        allowed_visuals=("comparison.bar.v1", "comparison.dot.v1", "composition.treemap.v1", "table.detail.v1"),
        executor=_supplier_value,
    ),
    "renewal_expiry_trend": AnalysisDefinition(
        intent="trend",
        title="Renewal expiry trend",
        description="Renewal candidate value and count grouped by contract expiry month.",
        allowed_visuals=("trend.line.v1", "comparison.bar.v1", "table.detail.v1"),
        executor=_expiry_trend,
    ),
    "renewal_value_by_category": AnalysisDefinition(
        intent="composition",
        title="Renewal value by category",
        description="Governed composition of renewal candidate value by procurement category.",
        allowed_visuals=("composition.treemap.v1", "comparison.bar.v1", "comparison.dot.v1", "table.detail.v1"),
        executor=_category_value,
    ),
    "renewal_value_distribution": AnalysisDefinition(
        intent="distribution",
        title="Renewal value distribution",
        description="Distribution of governed renewal candidate contract values.",
        allowed_visuals=("distribution.histogram.v1", "table.detail.v1"),
        executor=_value_distribution,
    ),
    "renewal_score_relationship": AnalysisDefinition(
        intent="relationship",
        title="Renewal score and contract value",
        description="Relationship between governed renewal scores and contract values.",
        allowed_visuals=("relationship.scatter.v1", "table.detail.v1"),
        executor=_score_relationship,
    ),
    "department_supplier_flow": AnalysisDefinition(
        intent="flow",
        title="Department-to-supplier renewal flow",
        description="Governed contract-value flow from buyer departments to suppliers.",
        allowed_visuals=("flow.sankey.v1", "comparison.bar.v1", "table.detail.v1"),
        executor=_department_supplier_flow,
    ),
}


def _apply_filters(frame: pd.DataFrame, request: AskFedPulseRequest) -> tuple[pd.DataFrame, dict[str, Any]]:
    filters = request.filters
    result = frame.copy()
    applied: dict[str, Any] = {}

    filter_specs = [
        ("department", "buyer_department", filters.department),
        ("supplier", "supplier_master_name", filters.supplier),
        ("category", "procurement_category", filters.category),
    ]
    for name, column, value in filter_specs:
        if value is None:
            continue
        _require_columns(result, {column})
        result = result[result[column] == value]
        applied[name] = value

    if filters.minValue is not None:
        _require_columns(result, {"clean_contract_value"})
        result = result[pd.to_numeric(result["clean_contract_value"], errors="coerce") >= filters.minValue]
        applied["minValue"] = filters.minValue
    if filters.maxValue is not None:
        _require_columns(result, {"clean_contract_value"})
        result = result[pd.to_numeric(result["clean_contract_value"], errors="coerce") <= filters.maxValue]
        applied["maxValue"] = filters.maxValue
    if filters.daysUntilEndMin is not None:
        _require_columns(result, {"days_until_end"})
        result = result[pd.to_numeric(result["days_until_end"], errors="coerce") >= filters.daysUntilEndMin]
        applied["daysUntilEndMin"] = filters.daysUntilEndMin
    if filters.daysUntilEndMax is not None:
        _require_columns(result, {"days_until_end"})
        result = result[pd.to_numeric(result["days_until_end"], errors="coerce") <= filters.daysUntilEndMax]
        applied["daysUntilEndMax"] = filters.daysUntilEndMax
    if filters.expiryFrom is not None or filters.expiryTo is not None:
        _require_columns(result, {"clean_contract_end_date"})
        expiry = pd.to_datetime(result["clean_contract_end_date"], errors="coerce")
        if filters.expiryFrom is not None:
            result = result[expiry >= pd.Timestamp(filters.expiryFrom)]
            applied["expiryFrom"] = filters.expiryFrom
            expiry = pd.to_datetime(result["clean_contract_end_date"], errors="coerce")
        if filters.expiryTo is not None:
            result = result[expiry <= pd.Timestamp(filters.expiryTo)]
            applied["expiryTo"] = filters.expiryTo

    return result, applied


def _tier_limit(requested: int, tier: str) -> tuple[int, list[str]]:
    limits = {"starter": 25, "professional": 250, "enterprise": 1000}
    maximum = limits.get(tier, 25)
    effective = min(requested, maximum)
    warnings = []
    if effective < requested:
        warnings.append(
            f"The {tier} plan limits this tool execution to {effective} returned fact rows."
        )
    return effective, warnings


def _evidence_ids(frame: pd.DataFrame) -> list[str]:
    for column in ("record_id", "source_record_id", "contract_number"):
        if column not in frame.columns:
            continue
        values = [
            str(value)
            for value in frame[column].dropna().astype(str).drop_duplicates().head(100)
            if value
        ]
        if values:
            return [f"ca-renewal:{value}" for value in values]
    return []


def _dataset_hash(value: Any) -> str | None:
    if not value:
        return None
    text = str(value)
    return text if text.startswith("sha256:") else f"sha256:{text}"


def _unavailable_response(
    request: AskFedPulseRequest,
    *,
    tier: str,
    request_id: str,
    detail: str,
) -> AskFedPulseResponse:
    definition = ANALYSES[request.analysisId]
    fallback_field = _field(
        field="statusMessage",
        label="Status",
        roles=["identifier"],
        semantic_type="text",
        priority=1,
        confidence=1,
    )
    analytics = AnalyticsFacts(
        contractVersion=ANALYTICS_FACTS_CONTRACT_VERSION,
        datasetId=f"ca-renewals-{request.analysisId}",
        title=definition.title,
        description=definition.description,
        status=AnalyticsStatus(state="error", message=detail),
        provenance=AnalyticsProvenance(
            sourceSystem="CanadaBuys",
            sourceUrl=None,
            productVersion="ca-renewals-unavailable",
            coverageThrough=None,
            generatedAt=datetime.now(timezone.utc),
            datasetHash=None,
            requestId=request_id,
            evidenceIds=[],
            limitations=[
                detail,
                "No facts were fabricated or substituted from another product version.",
            ],
        ),
        decision=AnalyticsDecision(
            intent=definition.intent,
            question=request.question,
            audienceRole=request.visualContext.audienceRole,
            preferredVisualId=request.visualContext.preferredVisualId,
        ),
        semanticModel=SemanticModel(
            registryVersion=VISUAL_REGISTRY_VERSION,
            fields=[fallback_field],
        ),
        visualPolicy=AnalyticsVisualPolicy(
            allowedVisualIds=list(definition.allowed_visuals),
            recentVisualIds=request.visualContext.recentVisualIds,
            accessibilityMode=request.visualContext.accessibilityMode,
            allowCustomSpec=False,
            requireTableFallback=True,
        ),
        presentation=AnalyticsPresentation(
            theme="auto",
            layoutMode="auto",
            approvalMode=False,
            visualId=request.visualContext.preferredVisualId,
            spec=None,
        ),
        facts=[],
    )
    return AskFedPulseResponse(
        contractVersion=ASK_FEDPULSE_CONTRACT_VERSION,
        answer=(
            "FedPulse could not execute this analysis because the authoritative "
            f"Canada renewal product is unavailable. {detail}"
        ),
        analytics=analytics,
        execution=AskFedPulseExecution(
            toolName=ASK_FEDPULSE_TOOL_NAME,
            analysisId=request.analysisId,
            state="unavailable",
            requestId=request_id,
            userTier=tier,
            sourceProductVersion=None,
            rowsScanned=0,
            rowsMatched=0,
            rowsReturned=0,
            filtersApplied=request.filters.model_dump(exclude_none=True),
            queryPlan=[
                "authorize user",
                "resolve active Canada renewal product",
                "stop without substitution when authoritative data is unavailable",
            ],
            warnings=[detail],
        ),
    )


def execute_ask_fedpulse(
    request: AskFedPulseRequest,
    user: dict[str, Any],
) -> AskFedPulseResponse:
    request_id = str(uuid4())
    tier = str(user.get("user_metadata", {}).get("subscription_tier", "starter"))
    definition = ANALYSES[request.analysisId]
    effective_limit, warnings = _tier_limit(request.limit, tier)

    try:
        source_frame = data_service.get_renewals()
        source_context = data_service.get_renewals_context()
        rows_scanned = len(source_frame)
        filtered, filters_applied = _apply_filters(source_frame, request)
        rows_matched = len(filtered)
        facts, fields = definition.executor(filtered, effective_limit)
    except (DataUnavailableError, GroundingError) as exc:
        return _unavailable_response(
            request,
            tier=tier,
            request_id=request_id,
            detail=str(exc),
        )

    coverage_through = source_context.get("coverage_through")
    product_version = str(
        source_context.get("product_version") or "ca-renewals-unversioned"
    )
    evidence_ids = _evidence_ids(filtered)
    limitations = list(warnings)
    if not evidence_ids and facts:
        limitations.append(
            "The active product did not expose row-level evidence identifiers."
        )

    state = "success" if facts else "empty"
    analytics_state = "ready" if facts else "empty"
    status_message = None if facts else "No authorized renewal facts matched the request."

    analytics = AnalyticsFacts(
        contractVersion=ANALYTICS_FACTS_CONTRACT_VERSION,
        datasetId=f"ca-renewals-{request.analysisId}",
        title=definition.title,
        description=definition.description,
        status=AnalyticsStatus(state=analytics_state, message=status_message),
        provenance=AnalyticsProvenance(
            sourceSystem=str(source_context.get("source_system") or "CanadaBuys"),
            sourceUrl=None,
            productVersion=product_version,
            coverageThrough=coverage_through,
            generatedAt=datetime.now(timezone.utc),
            datasetHash=_dataset_hash(source_context.get("dataset_sha256")),
            requestId=request_id,
            evidenceIds=evidence_ids,
            limitations=limitations,
        ),
        decision=AnalyticsDecision(
            intent=definition.intent,
            question=request.question,
            audienceRole=request.visualContext.audienceRole,
            preferredVisualId=request.visualContext.preferredVisualId,
        ),
        semanticModel=SemanticModel(
            registryVersion=VISUAL_REGISTRY_VERSION,
            fields=fields,
        ),
        visualPolicy=AnalyticsVisualPolicy(
            maxCharts=4,
            maxPerFamily=1,
            minimumConfidence=0.62,
            recentVisualIds=request.visualContext.recentVisualIds,
            allowedVisualIds=list(definition.allowed_visuals),
            deniedVisualIds=[],
            diversityWeight=1,
            requireTableFallback=True,
            allowCustomSpec=False,
            accessibilityMode=request.visualContext.accessibilityMode,
            maxCategories=30,
            maxHeatmapCardinality=12,
            maxSankeyNodes=40,
            maxSankeyLinks=150,
            maxMapPoints=2000,
        ),
        presentation=AnalyticsPresentation(
            theme="auto",
            layoutMode="auto",
            approvalMode=False,
            visualId=request.visualContext.preferredVisualId,
            chartConfig=None,
            chartLayout=None,
            spec=None,
        ),
        facts=facts,
    )

    if facts:
        total_value = sum(
            float(row.get("contractValue") or 0)
            for row in facts
            if isinstance(row.get("contractValue"), (int, float))
        )
        answer = (
            f"FedPulse executed {request.analysisId} against {rows_matched:,} "
            f"authorized renewal records and returned {len(facts):,} governed fact rows."
        )
        if total_value:
            answer += f" The returned rows represent CAD {total_value:,.2f}."
    else:
        answer = "No authorized Canada renewal facts matched the requested filters."

    return AskFedPulseResponse(
        contractVersion=ASK_FEDPULSE_CONTRACT_VERSION,
        answer=answer,
        analytics=analytics,
        execution=AskFedPulseExecution(
            toolName=ASK_FEDPULSE_TOOL_NAME,
            analysisId=request.analysisId,
            state=state,
            requestId=request_id,
            userTier=tier,
            sourceProductVersion=product_version,
            rowsScanned=rows_scanned,
            rowsMatched=rows_matched,
            rowsReturned=len(facts),
            filtersApplied=filters_applied,
            queryPlan=[
                "authorize user and resolve subscription limits",
                "load active reconciled Canada renewal product",
                "apply allowlisted filters",
                f"execute allowlisted analysis: {request.analysisId}",
                "emit governed semantic facts and visual policy",
            ],
            warnings=limitations,
        ),
    )
