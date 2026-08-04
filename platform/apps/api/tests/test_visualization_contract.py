import json
from pathlib import Path

import pytest
from pydantic import ValidationError

from models.visualizations import validate_analytics_facts


FIXTURE_PATH = (
    Path(__file__).resolve().parents[3]
    / "contracts"
    / "visualization"
    / "examples"
    / "renewal-intelligence.facts.json"
)


def load_fixture() -> dict:
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


def test_shared_fact_fixture_is_valid() -> None:
    analytics = validate_analytics_facts(load_fixture())

    assert analytics.contractVersion == "fedpulse.analytics.facts.v1"
    assert analytics.datasetId == "ca-renewal-watch-fixture"
    assert analytics.presentation.layoutMode == "auto"
    assert analytics.provenance.sourceSystem == "CanadaBuys"
    assert len(analytics.facts) == 6


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


def test_contract_rejects_unknown_fields() -> None:
    payload = load_fixture()
    payload["frontendCalculatedTotal"] = 999

    with pytest.raises(ValidationError, match="Extra inputs are not permitted"):
        validate_analytics_facts(payload)


def test_provenance_rejects_naive_timestamps() -> None:
    payload = load_fixture()
    payload["provenance"]["generatedAt"] = "2026-08-04T00:00:00"

    with pytest.raises(ValidationError, match="timezone"):
        validate_analytics_facts(payload)
