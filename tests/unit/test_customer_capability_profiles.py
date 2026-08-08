from pathlib import Path
import sys

import pytest


PROJECT_ROOT = Path(__file__).resolve().parents[2]
API_DIR = PROJECT_ROOT / "platform" / "apps" / "api"
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

from services import customer_capability_profiles as profiles  # noqa: E402


class _Response:
    def __init__(self, data):
        self.data = data


class _Query:
    def __init__(self, response):
        self.response = response

    def select(self, _columns):
        return self

    def eq(self, _field, _value):
        return self

    def upsert(self, _payload, on_conflict):
        assert on_conflict == "user_id"
        return self

    def execute(self):
        return _Response(self.response)


class _Client:
    def __init__(self, response):
        self.response = response

    def table(self, name):
        assert name == "customer_capability_profiles"
        return _Query(self.response)


def test_save_profile_normalizes_values_and_produces_engine_profile(monkeypatch):
    record = {
        "profile_id": "profile-1", "user_id": "user-1", "certifications": ["CMMC"],
        "clearances": ["Secret Clearance"], "capabilities": ["Cybersecurity"], "version": 2,
    }
    monkeypatch.setattr(profiles, "_admin_client", lambda: _Client([record]))

    profile = profiles.save_customer_capability_profile(
        user_id="user-1",
        certifications=[" cmmc ", "CMMC"],
        clearances=["Secret Clearance"],
        capabilities=["Cybersecurity"],
    )

    assert profile.profile_id == "profile-1"
    assert profile.certifications == ("CMMC",)
    assert profile.to_engine_profile().clearances == ("Secret Clearance",)


def test_profile_rejects_oversized_entries_before_database_access():
    with pytest.raises(profiles.CustomerCapabilityProfileError, match="200"):
        profiles.save_customer_capability_profile(
            user_id="user-1", certifications=["x" * 201], clearances=[], capabilities=[]
        )
