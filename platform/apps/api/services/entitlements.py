"""Server-side subscription entitlement lookups for paid intelligence products."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
import os
from typing import Any, Mapping

from supabase import Client, create_client


class EntitlementError(RuntimeError):
    """Raised when entitlement state cannot be read safely."""


@dataclass(frozen=True)
class SubscriptionEntitlement:
    user_id: str
    tier: str
    status: str
    current_period_end: datetime | None


def _admin_client() -> Client:
    url = os.getenv("SUPABASE_URL", "").strip()
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if not url or not key:
        raise EntitlementError("Subscription service is not configured")
    return create_client(url, key)


def _period_end(value: Any) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError as exc:
        raise EntitlementError("Subscription has an invalid period end") from exc


def get_subscription_entitlement(user_id: str) -> SubscriptionEntitlement | None:
    if not user_id.strip():
        raise EntitlementError("Subscription lookup requires a verified user identifier")
    try:
        response = _admin_client().table("billing_subscriptions").select(
            "user_id,tier,status,current_period_end"
        ).eq("user_id", user_id).execute()
    except Exception as exc:
        raise EntitlementError("Subscription service is unavailable") from exc
    data = response.data or []
    if not data:
        return None
    if not isinstance(data, list) or len(data) != 1 or not isinstance(data[0], Mapping):
        raise EntitlementError("Subscription identity is not unique")
    record = data[0]
    try:
        return SubscriptionEntitlement(
            user_id=str(record["user_id"]),
            tier=str(record["tier"]).casefold(),
            status=str(record["status"]).casefold(),
            current_period_end=_period_end(record.get("current_period_end")),
        )
    except KeyError as exc:
        raise EntitlementError("Subscription record is incomplete") from exc


def active_subscription_tier(user_id: str, *, now: datetime | None = None) -> str | None:
    entitlement = get_subscription_entitlement(user_id)
    if not entitlement or entitlement.status not in {"active", "trialing"}:
        return None
    current = now or datetime.now(timezone.utc)
    if entitlement.current_period_end and entitlement.current_period_end < current:
        return None
    return entitlement.tier
