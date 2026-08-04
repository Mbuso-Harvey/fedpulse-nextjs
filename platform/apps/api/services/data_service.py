import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Literal

import numpy as np
import pandas as pd
from supabase import Client, create_client

from config import settings


logger = logging.getLogger(__name__)


class DataUnavailableError(RuntimeError):
    """Raised when an authoritative product dataset cannot be loaded."""


@dataclass(frozen=True)
class DataSourceStatus:
    backend: Literal["supabase", "csv", "unavailable"]
    configured: bool
    detail: str


class DataService:
    def __init__(self) -> None:
        self._renewals_df: pd.DataFrame | None = None
        self._departments_df: pd.DataFrame | None = None
        self._suppliers_df: pd.DataFrame | None = None
        self._recommendations_df: pd.DataFrame | None = None

        self.supabase: Client | None = None
        if settings.supabase_url and settings.server_supabase_key:
            self.supabase = create_client(
                settings.supabase_url,
                settings.server_supabase_key,
            )

    def _selected_backend(self) -> Literal["supabase", "csv"]:
        if settings.data_backend == "supabase":
            if self.supabase is None:
                raise DataUnavailableError(
                    "DATA_BACKEND=supabase but Supabase is not configured"
                )
            return "supabase"

        if settings.data_backend == "csv":
            return "csv"

        if self.supabase is not None:
            return "supabase"
        return "csv"

    def status(self) -> DataSourceStatus:
        try:
            backend = self._selected_backend()
        except DataUnavailableError as exc:
            return DataSourceStatus(
                backend="unavailable",
                configured=False,
                detail=str(exc),
            )

        if backend == "supabase":
            return DataSourceStatus(
                backend="supabase",
                configured=True,
                detail=f"Supabase view {settings.ca_renewals_table}",
            )

        return DataSourceStatus(
            backend="csv",
            configured=settings.renewals_data_path.exists(),
            detail=str(settings.data_dir_base.resolve()),
        )

    @staticmethod
    def _normalize_dataframe(df: pd.DataFrame) -> pd.DataFrame:
        if df.empty:
            return df
        return df.replace({np.nan: None})

    def _load_csv(self, path: Path, dataset_name: str) -> pd.DataFrame:
        if not path.exists():
            raise DataUnavailableError(
                f"{dataset_name} dataset is unavailable at {path.resolve()}"
            )

        try:
            logger.info("Loading %s data from %s", dataset_name, path)
            return self._normalize_dataframe(pd.read_csv(path))
        except Exception as exc:
            raise DataUnavailableError(
                f"Failed to load {dataset_name} dataset"
            ) from exc

    def _load_table(self, table: str) -> pd.DataFrame:
        if self.supabase is None:
            raise DataUnavailableError("Supabase data service is not configured")

        try:
            response = self.supabase.table(table).select("*").execute()
        except Exception as exc:
            raise DataUnavailableError(
                f"Failed to load authoritative Supabase table or view: {table}"
            ) from exc

        data = response.data or []
        if not data:
            raise DataUnavailableError(
                f"Authoritative Supabase product is empty: {table}. "
                "Load and activate a reconciled product version before serving it."
            )
        return self._normalize_dataframe(pd.DataFrame(data))

    def _load_product(
        self,
        *,
        table: str,
        csv_path: Path,
        dataset_name: str,
    ) -> pd.DataFrame:
        backend = self._selected_backend()
        if backend == "supabase":
            return self._load_table(table)
        return self._load_csv(csv_path, dataset_name)

    def get_renewals(self) -> pd.DataFrame:
        if self._renewals_df is None:
            self._renewals_df = self._load_product(
                table=settings.ca_renewals_table,
                csv_path=settings.renewals_data_path,
                dataset_name="renewals",
            )
        return self._renewals_df.copy()

    def get_renewals_context(self) -> dict[str, Any]:
        frame = self.get_renewals()
        first = frame.iloc[0].to_dict() if not frame.empty else {}

        def text_value(name: str, fallback: Any = None) -> Any:
            value = first.get(name, fallback)
            if value is None or pd.isna(value):
                return fallback
            if isinstance(value, pd.Timestamp):
                return value.isoformat()
            return str(value)

        return {
            "country_code": text_value("country_code", settings.ca_country_code),
            "source_system": text_value("source_system", settings.ca_source_system),
            "product_version": text_value(
                "product_version", settings.ca_product_version
            ),
            "coverage_through": text_value(
                "coverage_through", settings.ca_coverage_through
            ),
            "generated_at": text_value("generated_at"),
            "dataset_sha256": text_value("dataset_sha256"),
            "row_count": int(len(frame)),
        }

    def get_departments(self) -> pd.DataFrame:
        if self._departments_df is None:
            self._departments_df = self._load_product(
                table="departments",
                csv_path=settings.departments_data_path,
                dataset_name="departments",
            )
        return self._departments_df.copy()

    def get_suppliers(self) -> pd.DataFrame:
        if self._suppliers_df is None:
            self._suppliers_df = self._load_product(
                table="suppliers",
                csv_path=settings.suppliers_data_path,
                dataset_name="suppliers",
            )
        return self._suppliers_df.copy()

    def get_recommendations(self) -> pd.DataFrame:
        if self._recommendations_df is None:
            self._recommendations_df = self._load_csv(
                settings.recommendations_data_path,
                "recommendations",
            )
        return self._recommendations_df.copy()

    def reload(self) -> None:
        self._renewals_df = None
        self._departments_df = None
        self._suppliers_df = None
        self._recommendations_df = None


data_service = DataService()
