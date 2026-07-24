import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    api_title: str = "Procurement Intelligence API"
    api_version: str = "1.0.0"
    graph_version: str = "KG-1.0"
    
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_key: str = os.getenv("SUPABASE_KEY", "")
    supabase_service_role_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    stripe_secret_key: str = os.getenv("STRIPE_SECRET_KEY", "")
    cors_origins: str = os.getenv("CORS_ORIGINS", "http://localhost:3000,https://*.vercel.app,https://*.up.railway.app")
    
    # Data Paths
    data_dir_base: Path = Path("c:/ProcurementIntelligence/data")
    intelligence_products_base: Path = Path("c:/ProcurementIntelligence/11_intelligence_products")
    
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
        return self.intelligence_products_base / "recommendation_engine" / "recommendation_registry_v1.csv"

    class Config:
        env_file = ".env"

settings = Settings()
