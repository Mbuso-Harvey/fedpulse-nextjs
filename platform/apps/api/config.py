import os
from pathlib import Path
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings for the FedPulse API.

    Production deployments must be configured explicitly. Local CSV paths are
    supported for development and recovery, but no Windows-specific path is
    assumed.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    api_title: str = "FedPulse Procurement Intelligence API"
    api_version: str = "1.2.0"
    graph_version: str = "KG-1.0"
    environment: Literal["development", "test", "staging", "production"] = "development"

    supabase_url: str = ""
    supabase_key: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    stripe_secret_key: str = ""

    cors_origins: str = (
        "http://localhost:3000,"
        "https://*.vercel.app,"
        "https://*.up.railway.app"
    )

    data_backend: Literal["auto", "supabase", "csv"] = "auto"
    data_dir_base: Path = Path("data")
    intelligence_products_base: Path = Path("data/intelligence_products")

    allow_dev_auth: bool = False
    default_dev_subscription_tier: str = "professional"

    ca_product_id: str = "ca-renewal-watch"
    ca_product_version: str = "ca-renewals-unreconciled"
    ca_product_versions_table: str = "fedpulse_product_versions"
    ca_renewals_table: str = "fedpulse_ca_renewals_current"
    ca_source_system: str = "CanadaBuys"
    ca_country_code: str = "CA"
    ca_coverage_through: str | None = None

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def server_supabase_key(self) -> str:
        return self.supabase_service_role_key or self.supabase_key

    @property
    def auth_supabase_key(self) -> str:
        return self.supabase_anon_key or self.supabase_key

    @property
    def renewals_data_path(self) -> Path:
        return self.data_dir_base / "gold" / "gold_renewal_candidates_supplier_mastered_v2.csv"

    @property
    def departments_data_path(self) -> Path:
        return self.data_dir_base / "gold" / "department_profiles_v1.csv"

    @property
    def suppliers_data_path(self) -> Path:
        return self.data_dir_base / "gold" / "supplier_market_position_v1.csv"

    @property
    def recommendations_data_path(self) -> Path:
        return (
            self.intelligence_products_base
            / "recommendation_engine"
            / "recommendation_registry_v1.csv"
        )


settings = Settings()
