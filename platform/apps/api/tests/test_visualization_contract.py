import json
from pathlib import Path

import pytest
from pydantic import ValidationError

from models.visualizations import validate_analytics_facts


FIXTURE_DIRECTORY = (
    Path(__file__).resolve().parents[3]
    / "contracts"
    / "visualization"
    / "examples"
)
RENEWAL_FIXTURE_PATH = FIXTURE_DIRECTORY / "renewal-intelligence.facts.json"
FLOW_FIXTURE_PATH = FIXTURE_DIRECTORY / "contract-flow.facts.json"
MAP_FIXTURE_PATH = FIXTURE_DIRECTORY / "contract-location.facts.json"


def load_fixture(path: Path = RENEWAL_FIXTURE_PATH) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


@pytest.mark.parametrize(
    ("fixture_path", "expected_intent", "expected_rows"),
    [
        (RENEWAL_FIXTURE_PATH, "overview", 6),
        (FLOW_FIXTURE_PATH, "flow", 5),
        (MAP_FIXTURE_PATH, "geography", 4),
    ],
)
def test_shared_enterprise_fact_fixtures_are_valid(
    fixture_path: Path,
    expected_intent: str,
    expected_rows: int,
) -> None:
    analytics = validate_analytics_facts(load_fixture(fixture_path))

    assert analytics.contractVersion == "fedpulse.analytics.facts.v2"
    assert analytics.semanticModel.registryVersion == (
        "fedpulse.visual-registry.v1"
    )
    assert analytics.decision.intent == expected_intent
    assert analytics.presentation.layoutMode == "auto"
    assert analytics.provenance.sourceSystem == "CanadaBuys"
    assert len(analytics.facts) == expected_rows
    assert analytics.visualPolicy.requireTableFallback is True
    assert analytics.visualPolicy.allowCustomSpec is False


def test_ready_analytics_require_facts() -> None:
    payload = load_fixture()
    payload["facts"] = []

    with pytest.raises(ValidationError, match="require at least one fact row"):
        validate_analytics_facts(payload)


def test_fact_rows_require_consistent_fields() -> None:
    payload = load_fixture()
    del payload["facts"][0]["contractValue"]

    with pytest.raises(ValidationError, match="same fields"):
        validate_analytics_facts(payload)


def test_semantic_model_must_cover_fact_fields_exactly() -> None:
    payload = load_fixture()
    payload["semanticModel"]["fields"] = payload["semanticModel"]["fields"][:-1]

    with pytest.raises(
        ValidationError,
        match="describe every fact field exactly once",
    ):
        validate_analytics_facts(payload)


def test_non_measure_fields_cannot_request_sum() -> None:
    payload = load_fixture()
    department = next(
        field
        for field in payload["semanticModel"]["fields"]
        if field["field"] == "department"
    )
    department["defaultAggregation"] = "sum"
    department["allowedAggregations"] = ["sum"]

    with pytest.raises(
        ValidationError,
        match="non-measure fields must use none aggregation",
    ):
        validate_analytics_facts(payload)


def test_currency_fields_require_currency_code() -> None:
    payload = load_fixture()
    value_field = next(
        field
        for field in payload["semanticModel"]["fields"]
        if field["field"] == "contractValue"
    )
    value_field["currency"] = None

    with pytest.raises(
        ValidationError,
        match="require an ISO currency code",
    ):
        validate_analytics_facts(payload)


def test_custom_specs_are_disabled_by_default() -> None:
    payload = load_fixture()
    payload["presentation"]["spec"] = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "mark": "bar",
    }

    with pytest.raises(
        ValidationError,
        match="allowCustomSpec=true",
    ):
        validate_analytics_facts(payload)


def test_flow_intent_requires_source_target_and_weight() -> None:
    payload = load_fixture(FLOW_FIXTURE_PATH)
    target = next(
        field
        for field in payload["semanticModel"]["fields"]
        if field["field"] == "supplier"
    )
    target["roles"] = ["dimension"]

    with pytest.raises(
        ValidationError,
        match="exactly one source, target, and weight",
    ):
        validate_analytics_facts(payload)


def test_geographic_intent_requires_latitude_and_longitude() -> None:
    payload = load_fixture(MAP_FIXTURE_PATH)
    longitude = next(
        field
        for field in payload["semanticModel"]["fields"]
        if field["field"] == "longitude"
    )
    longitude["roles"] = ["measure"]
    longitude["semanticType"] = "number"
    longitude["defaultAggregation"] = "median"
    longitude["allowedAggregations"] = ["median"]

    with pytest.raises(
        ValidationError,
        match="exactly one latitude and longitude",
    ):
        validate_analytics_facts(payload)


def test_visual_policy_rejects_allow_deny_overlap() -> None:
    payload = load_fixture()
    payload["visualPolicy"]["allowedVisualIds"] = ["comparison.dot.v1"]
    payload["visualPolicy"]["deniedVisualIds"] = ["comparison.dot.v1"]

    with pytest.raises(
        ValidationError,
        match="both allowed and denied",
    ):
        validate_analytics_facts(payload)


def test_contract_rejects_unknown_fields() -> None:
    payload = load_fixture()
    payload["frontendCalculatedTotal"] = 999

    with pytest.raises(
        ValidationError,
        match="Extra inputs are not permitted",
    ):
        validate_analytics_facts(payload)


def test_provenance_rejects_naive_timestamps() -> None:
    payload = load_fixture()
    payload["provenance"]["generatedAt"] = "2026-08-04T00:00:00"

    with pytest.raises(ValidationError, match="timezone"):
        validate_analytics_facts(payload)
