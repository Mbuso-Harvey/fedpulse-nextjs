from pathlib import Path

import pandas as pd
import pytest

from scripts.load_ca_renewals import ReconciliationError, prepare_dataset


def _write_csv(path: Path, rows: list[dict]) -> None:
    pd.DataFrame(rows).to_csv(path, index=False)


def test_prepare_dataset_builds_reconciled_manifest(tmp_path: Path) -> None:
    source = tmp_path / "renewals.csv"
    _write_csv(
        source,
        [
            {
                "contract_number": "ABC-001",
                "supplier_master_id": "SUP-1",
                "supplier_master_name": "Example Supplier",
                "buyer_department": "Example Department",
                "procurement_category": "Services",
                "clean_contract_end_date": "2027-01-31",
                "clean_contract_value": 1250000.50,
                "days_until_end": 180,
                "quality_tier": "gold",
            },
            {
                "contract_number": "ABC-002",
                "supplier_master_id": "SUP-2",
                "supplier_master_name": "Second Supplier",
                "buyer_department": "Example Department",
                "procurement_category": "Goods",
                "clean_contract_end_date": "2027-03-31",
                "clean_contract_value": 500000,
                "days_until_end": 240,
                "quality_tier": "gold",
            },
        ],
    )

    result = prepare_dataset(
        source,
        product_version="ca-renewals-test-v1",
        coverage_through="2026-08-03",
        expected_count=2,
        expected_sha256=None,
    )

    assert result.manifest["status"] == "reconciled"
    assert result.manifest["prepared_row_count"] == 2
    assert result.manifest["duplicate_record_count"] == 0
    assert result.manifest["total_contract_value"] == 1750000.50
    assert len(result.manifest["dataset_sha256"]) == 64
    assert all(len(row["record_id"]) == 64 for row in result.rows)
    assert all(len(row["row_sha256"]) == 64 for row in result.rows)


def test_prepare_dataset_rejects_duplicate_stable_identity(tmp_path: Path) -> None:
    source = tmp_path / "renewals.csv"
    duplicate = {
        "contract_number": "ABC-001",
        "supplier_master_id": "SUP-1",
        "supplier_master_name": "Example Supplier",
        "buyer_department": "Example Department",
        "clean_contract_end_date": "2027-01-31",
        "clean_contract_value": 1250000,
    }
    _write_csv(source, [duplicate, duplicate])

    with pytest.raises(ReconciliationError, match="duplicate records"):
        prepare_dataset(
            source,
            product_version="ca-renewals-test-v1",
            coverage_through=None,
            expected_count=None,
            expected_sha256=None,
        )


def test_prepare_dataset_rejects_missing_required_columns(tmp_path: Path) -> None:
    source = tmp_path / "renewals.csv"
    _write_csv(source, [{"contract_number": "ABC-001"}])

    with pytest.raises(ReconciliationError, match="Missing required columns"):
        prepare_dataset(
            source,
            product_version="ca-renewals-test-v1",
            coverage_through=None,
            expected_count=None,
            expected_sha256=None,
        )
