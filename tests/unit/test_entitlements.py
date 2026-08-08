from datetime import datetime, timedelta, timezone
from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[2]
API_DIR = PROJECT_ROOT / "platform" / "apps" / "api"
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

from services import entitlements  # noqa: E402


def test_active_subscription_tier_rejects_expired_and_inactive_records(monkeypatch):
    now = datetime(2026, 8, 8, tzinfo=timezone.utc)
    expired = entitlements.SubscriptionEntitlement("user-1", "pro", "active", now - timedelta(seconds=1))
    inactive = entitlements.SubscriptionEntitlement("user-1", "pro", "canceled", now + timedelta(days=1))
    monkeypatch.setattr(entitlements, "get_subscription_entitlement", lambda _user_id: expired)
    assert entitlements.active_subscription_tier("user-1", now=now) is None
    monkeypatch.setattr(entitlements, "get_subscription_entitlement", lambda _user_id: inactive)
    assert entitlements.active_subscription_tier("user-1", now=now) is None


def test_active_subscription_tier_accepts_current_active_record(monkeypatch):
    now = datetime(2026, 8, 8, tzinfo=timezone.utc)
    active = entitlements.SubscriptionEntitlement("user-1", "pro", "active", now + timedelta(days=1))
    monkeypatch.setattr(entitlements, "get_subscription_entitlement", lambda _user_id: active)
    assert entitlements.active_subscription_tier("user-1", now=now) == "pro"
