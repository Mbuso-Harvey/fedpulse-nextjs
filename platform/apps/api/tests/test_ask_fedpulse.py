from __future__ import annotations

import pandas as pd
import pytest

from models.ask_fedpulse import AskFedPulseRequest
from services.ask_fedpulse import execute_ask_fedpulse
from services.data_service import DataUnavailableError, data_service


@pytest.fixture
def renewal_frame() -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "record_id": "record-001",
                "contract_number": "C-001",
                "clean_contract_end_date": "2026-10-31",
                "buyer_department": "National Defence",
                "supplier_master_name": "Supplier A",
                "procurement_category": "Information technology",
                "clean_contract_value": 120_000_000.0,
                "days_until_end": 88,
                "renewal_score": 0.92,
            },
            {
                "record_id": "record-002",
                "contract_number": "C-002",
                "clean_contract_end_date": "2026-11-30",
                "buyer_department": "National Defence",
                "supplier_master_name": "Supplier B",
                "procurement_category": "Professional services",
                "clean_contract_value": 80_000_000.0,
                "days_until_end": 118,
                "renewal_score": 0.81,
            },
            {
                "record_id": "record-003",
                "contract_number": "C-003",
                "clean_contract_end_date": "2026-12-15",
                "buyer_department": "Shared Services Canada",
                "supplier_master_name": "Supplier A",
                "procurement_category": "Information technology",
                "clean_contract_value": 60_000_000.0,
                "days_until_end": 133,
                "renewal_score": 0.76,
            },
            {
                "record_id": "record-004",
                "contract_number": "C-004",
                "clean_contract_end_date": "2027-01-31",
                "buyer_department": "Transport Canada",
                "supplier_master_name": "Supplier C",
                "procurement_category": "Professional services",
                "clean_contract_value": 40_000_000.0,
                "days_until_end": 180,
                "renewal_score": 0.67,
            },
        ]
    )


@pytest.fixture
def source_context() -> dict[str, object]:
    return {
        "country_code": "CA",
        "source_system": "CanadaBuys",
        "product_version": "ca-renewals-test-v1",
        "coverage_through": "2026-06-16",
        "generated_at": "2026-08-04T00:00:00Z",
        "dataset_sha256": "a" * 64,
        "row_count": 4,
    }


def _user(tier: str = "professional") -> dict[str, object]:
    return {
        "id": "test-user",
        "user_metadata": {"subscription_tier": tier},
    }


def _install_product(
    monkeypatch: pytest.MonkeyPatch,
    frame: pd.DataFrame,
    context: dict[str, object],
) -> None:
    monkeypatch.setattr(data_service, "get_renewals", lambda: frame.copy())
    monkeypatch.setattr(data_service, "get_renewals_context", lambda: context.copy())


def test_department_analysis_returns_grounded_enterprise_facts(
    monkeypatch: pytest.MonkeyPatch,
    renewal_frame: pd.DataFrame,
    source_context: dict[str, object],
) -> None:
    _install_product(monkeypatch, renewal_frame, source_context)
    request = AskFedPulseRequest(
        question="Which departments have the most renewal value?",
        analysisId="renewal_value_by_department",
        visualContext={"recentVisualIds": ["comparison.bar.v1"]},
    )

    response = execute_ask_fedpulse(request, _user())

    assert response.contractVersion == "fedpulse.ask.response.v1"
    assert response.execution.state == "success"
    assert response.execution.rowsScanned == 4
    assert response.execution.rowsMatched == 4
    assert response.analytics.contractVersion == "fedpulse.analytics.facts.v2"
    assert response.analytics.decision.intent == "comparison"
    assert response.analytics.provenance.productVersion == "ca-renewals-test-v1"
    assert response.analytics.provenance.datasetHash == f"sha256:{'a' * 64}"
    assert response.analytics.provenance.evidenceIds[0] == "ca-renewal:record-001"
    assert response.analytics.visualPolicy.allowCustomSpec is False
    assert response.analytics.visualPolicy.requireTableFallback is True
    assert response.analytics.facts[0]["department"] == "National Defence"
    assert response.analytics.facts[0]["contractValue"] == 200_000_000.0
    assert {field.field for field in response.analytics.semanticModel.fields} == {
        "department",
        "contractValue",
        "renewalCount",
    }


def test_flow_analysis_emits_sankey_roles_and_positive_weights(
    monkeypatch: pytest.MonkeyPatch,
    renewal_frame: pd.DataFrame,
    source_context: dict[str, object],
) -> None:
    _install_product(monkeypatch, renewal_frame, source_context)
    request = AskFedPulseRequest(
        question="How does renewal value flow from departments to suppliers?",
        analysisId="department_supplier_flow",
    )

    response = execute_ask_fedpulse(request, _user("enterprise"))

    assert response.analytics.decision.intent == "flow"
    assert "flow.sankey.v1" in response.analytics.visualPolicy.allowedVisualIds
    roles = {
        role
        for field in response.analytics.semanticModel.fields
        for role in field.roles
    }
    assert {"source", "target", "weight"}.issubset(roles)
    assert all(row["contractValue"] > 0 for row in response.analytics.facts)
    assert response.analytics.presentation.spec is None


def test_starter_tier_enforces_fact_row_limit(
    monkeypatch: pytest.MonkeyPatch,
    renewal_frame: pd.DataFrame,
    source_context: dict[str, object],
) -> None:
    large_frame = pd.concat([renewal_frame] * 20, ignore_index=True)
    large_frame["record_id"] = [f"record-{index:03d}" for index in range(len(large_frame))]
    large_frame["contract_number"] = [f"C-{index:03d}" for index in range(len(large_frame))]
    _install_product(monkeypatch, large_frame, source_context)
    request = AskFedPulseRequest(
        question="Show the renewal watchlist.",
        analysisId="renewal_watchlist",
        limit=100,
    )

    response = execute_ask_fedpulse(request, _user("starter"))

    assert response.execution.rowsReturned == 25
    assert len(response.analytics.facts) == 25
    assert any("starter plan" in warning.lower() for warning in response.execution.warnings)


def test_no_matching_records_returns_governed_empty_state(
    monkeypatch: pytest.MonkeyPatch,
    renewal_frame: pd.DataFrame,
    source_context: dict[str, object],
) -> None:
    _install_product(monkeypatch, renewal_frame, source_context)
    request = AskFedPulseRequest(
        question="Show renewals for a department that is not present.",
        analysisId="renewal_watchlist",
        filters={"department": "Missing Department"},
    )

    response = execute_ask_fedpulse(request, _user())

    assert response.execution.state == "empty"
    assert response.execution.rowsMatched == 0
    assert response.analytics.status.state == "empty"
    assert response.analytics.facts == []


def test_unavailable_product_returns_no_substitute_facts(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    def unavailable() -> pd.DataFrame:
        raise DataUnavailableError("No active reconciled product version exists")

    monkeypatch.setattr(data_service, "get_renewals", unavailable)
    request = AskFedPulseRequest(
        question="Show the renewal watchlist.",
        analysisId="renewal_watchlist",
    )

    response = execute_ask_fedpulse(request, _user())

    assert response.execution.state == "unavailable"
    assert response.analytics.status.state == "error"
    assert response.analytics.facts == []
    assert "No facts were fabricated" in response.analytics.provenance.limitations[1]


def test_request_rejects_non_allowlisted_analysis() -> None:
    with pytest.raises(ValueError):
        AskFedPulseRequest(
            question="Run arbitrary SQL.",
            analysisId="raw_sql",
        )
