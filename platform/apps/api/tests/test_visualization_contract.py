import json
from pathlib import Path

import pytest
from pydantic import ValidationError

from models.visualizations import validate_analytics_widget


FIXTURE_PATH = (
    Path(__file__).resolve().parents[3]
    / "contracts"
    / "visualization"
    / "examples"
    / "renewal-value-by-department.chart.json"
)


def load_fixture() -> dict:
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


def test_shared_visualization_fixture_is_valid() -> None:
    widget = validate_analytics_widget(load_fixture())

    assert widget.contractVersion == "fedpulse.visualization.v1"
    assert widget.kind == "chart"
    assert widget.chart.type == "bar"
    assert widget.provenance.sourceSystem == "CanadaBuys"


def test_chart_rejects_missing_series_field() -> None:
    payload = load_fixture()
    del payload["data"][0]["contractValue"]

    with pytest.raises(ValidationError, match="missing required fields"):
        validate_analytics_widget(payload)


def test_contract_rejects_unknown_fields() -> None:
    payload = load_fixture()
    payload["frontendCalculatedTotal"] = 999

    with pytest.raises(ValidationError, match="Extra inputs are not permitted"):
        validate_analytics_widget(payload)
