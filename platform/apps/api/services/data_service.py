import pandas as pd
import numpy as np
from typing import Optional, Dict, Any, List
from pathlib import Path
from config import settings
import logging
from supabase import create_client, Client
import os

logger = logging.getLogger(__name__)

class DataService:
    def __init__(self):
        self._renewals_df: Optional[pd.DataFrame] = None
        self._departments_df: Optional[pd.DataFrame] = None
        self._suppliers_df: Optional[pd.DataFrame] = None
        self._recommendations_df: Optional[pd.DataFrame] = None
        
        self.use_supabase = bool(settings.supabase_url and settings.supabase_key)
        if self.use_supabase:
            logger.info("Initializing Supabase client for data service")
            self.supabase: Client = create_client(settings.supabase_url, settings.supabase_key)
        
    def _load_csv(self, path: Path) -> pd.DataFrame:
        try:
            if path.exists():
                logger.info(f"Loading data from {path}")
                df = pd.read_csv(path)
                return df.replace({np.nan: None})
            else:
                logger.warning(f"File not found: {path}")
                return pd.DataFrame()
        except Exception as e:
            logger.error(f"Error loading {path}: {e}")
            return pd.DataFrame()
            
    def get_renewals(self) -> pd.DataFrame:
        if self._renewals_df is None:
            if self.use_supabase:
                try:
                    res = self.supabase.table('renewals').select('*').execute()
                    self._renewals_df = pd.DataFrame(res.data)
                except Exception as e:
                    logger.error(f"Failed to fetch renewals from Supabase: {e}")
                    self._renewals_df = pd.DataFrame()
            else:
                self._renewals_df = self._load_csv(settings.renewals_data_path)
        return self._renewals_df
        
    def get_departments(self) -> pd.DataFrame:
        if self._departments_df is None:
            if self.use_supabase:
                try:
                    res = self.supabase.table('departments').select('*').execute()
                    self._departments_df = pd.DataFrame(res.data)
                except Exception as e:
                    logger.error(f"Failed to fetch departments from Supabase: {e}")
                    self._departments_df = pd.DataFrame()
            else:
                self._departments_df = self._load_csv(settings.departments_data_path)
        return self._departments_df
        
    def get_suppliers(self) -> pd.DataFrame:
        if self._suppliers_df is None:
            if self.use_supabase:
                try:
                    res = self.supabase.table('suppliers').select('*').execute()
                    self._suppliers_df = pd.DataFrame(res.data)
                except Exception as e:
                    logger.error(f"Failed to fetch suppliers from Supabase: {e}")
                    self._suppliers_df = pd.DataFrame()
            else:
                self._suppliers_df = self._load_csv(settings.suppliers_data_path)
        return self._suppliers_df
        
    def get_recommendations(self) -> pd.DataFrame:
        if self._recommendations_df is None:
            self._recommendations_df = self._load_csv(settings.recommendations_data_path)
        return self._recommendations_df
        
    def reload(self):
        """Force a reload of all dataframes"""
        self._renewals_df = None
        self._departments_df = None
        self._suppliers_df = None
        self._recommendations_df = None

# Singleton instance
data_service = DataService()
