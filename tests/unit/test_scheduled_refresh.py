from pathlib import Path
import sys

import pytest

PROJECT_ROOT = Path(__file__).resolve().parents[2]
API_DIR = PROJECT_ROOT / "platform" / "apps" / "api"
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

from services import scheduled_refresh  # noqa: E402


def test_scheduled_refresh_requires_a_nonsecret_operational_data_root(monkeypatch):
    monkeypatch.delenv("FEDPULSE_DATA_ROOT", raising=False)
    with pytest.raises(scheduled_refresh.ScheduledRefreshError, match="FEDPULSE_DATA_ROOT"):
        scheduled_refresh.run("us")


def test_scheduled_refresh_rejects_unbounded_sam_lookback(monkeypatch, tmp_path):
    monkeypatch.setenv("FEDPULSE_DATA_ROOT", str(tmp_path))
    monkeypatch.setenv("SAM_REFRESH_LOOKBACK_DAYS", "32")
    with pytest.raises(scheduled_refresh.ScheduledRefreshError, match="LOOKBACK"):
        scheduled_refresh.run("us")
