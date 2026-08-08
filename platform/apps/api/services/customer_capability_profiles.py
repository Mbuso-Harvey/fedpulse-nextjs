"""Persisted customer capability profiles for U.S. decision support.

Profiles belong to authenticated customers, not to a browser session or a
shared release. They are deliberately separate from public user metadata:
certifications, clearances, and capabilities can be commercially sensitive.
"""

from __future__ import annotations

from dataclasses import dataclass
import os
from typing import Any, Iterable, Mapping

from supabase import Client, create_client

from services.compliance_intelligence import CustomerCapabilityProfile


class CustomerCapabilityProfileError(RuntimeError):
    """Raised when a customer capability profile cannot be safely used."""


@dataclass(frozen=True)
class StoredCustomerCapabilityProfile:
    profile_id: str
    user_id: str
    certifications: tuple[str, ...]
    clearances: tuple[str, ...]
    capabilities: tuple[str, ...]
    version: int

    def to_engine_profile(self) -> CustomerCapabilityProfile:
        return CustomerCapabilityProfile(
            profile_id=self.profile_id,
            certifications=self.certifications,
            clearances=self.clearances,
            capabilities=self.capabilities,
        )


def _admin_client() -> Client:
    url = os.getenv("SUPABASE_URL", "").strip()
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if not url or not key:
        raise CustomerCapabilityProfileError("Customer profile service is not configured")
    return create_client(url, key)


def _values(values: Iterable[str], *, field_name: str) -> tuple[str, ...]:
    normalized: list[str] = []
    seen: set[str] = set()
    for value in values:
        text = str(value).strip()
        if not text:
            continue
        if len(text) > 200:
            raise CustomerCapabilityProfileError(f"{field_name} entries must not exceed 200 characters")
        key = text.casefold()
        if key not in seen:
            seen.add(key)
            normalized.append(text)
    if len(normalized) > 100:
        raise CustomerCapabilityProfileError(f"{field_name} cannot contain more than 100 entries")
    return tuple(normalized)


def _stored(record: Mapping[str, Any]) -> StoredCustomerCapabilityProfile:
    try:
        return StoredCustomerCapabilityProfile(
            profile_id=str(record["profile_id"]),
            user_id=str(record["user_id"]),
            certifications=_values(record.get("certifications") or (), field_name="certifications"),
            clearances=_values(record.get("clearances") or (), field_name="clearances"),
            capabilities=_values(record.get("capabilities") or (), field_name="capabilities"),
            version=int(record["version"]),
        )
    except (KeyError, TypeError, ValueError) as exc:
        raise CustomerCapabilityProfileError("Stored customer capability profile is invalid") from exc


def get_customer_capability_profile(user_id: str) -> StoredCustomerCapabilityProfile | None:
    if not user_id.strip():
        raise CustomerCapabilityProfileError("Customer profile requires a verified user identifier")
    try:
        response = _admin_client().table("customer_capability_profiles").select("*").eq("user_id", user_id).execute()
    except Exception as exc:
        raise CustomerCapabilityProfileError("Customer profile service is unavailable") from exc
    data = response.data or []
    if not data:
        return None
    if not isinstance(data, list) or len(data) != 1 or not isinstance(data[0], Mapping):
        raise CustomerCapabilityProfileError("Customer profile identity is not unique")
    return _stored(data[0])


def save_customer_capability_profile(
    *,
    user_id: str,
    certifications: Iterable[str],
    clearances: Iterable[str],
    capabilities: Iterable[str],
) -> StoredCustomerCapabilityProfile:
    if not user_id.strip():
        raise CustomerCapabilityProfileError("Customer profile requires a verified user identifier")
    payload = {
        "user_id": user_id,
        "certifications": list(_values(certifications, field_name="certifications")),
        "clearances": list(_values(clearances, field_name="clearances")),
        "capabilities": list(_values(capabilities, field_name="capabilities")),
    }
    try:
        response = _admin_client().table("customer_capability_profiles").upsert(
            payload,
            on_conflict="user_id",
        ).execute()
    except Exception as exc:
        raise CustomerCapabilityProfileError("Customer profile could not be saved") from exc
    data = response.data or []
    if not isinstance(data, list) or len(data) != 1 or not isinstance(data[0], Mapping):
        raise CustomerCapabilityProfileError("Customer profile save returned an invalid result")
    return _stored(data[0])


def list_customer_capability_profiles() -> tuple[StoredCustomerCapabilityProfile, ...]:
    """Return profiles for a controlled server-side refresh job only."""
    try:
        response = _admin_client().table("customer_capability_profiles").select("*").execute()
    except Exception as exc:
        raise CustomerCapabilityProfileError("Customer profile service is unavailable") from exc
    data = response.data or []
    if not isinstance(data, list):
        raise CustomerCapabilityProfileError("Customer profile list is invalid")
    return tuple(_stored(record) for record in data if isinstance(record, Mapping))
