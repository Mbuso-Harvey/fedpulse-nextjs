"""Fail-closed command entry point for scheduled FedPulse product refreshes."""

from __future__ import annotations

import argparse
from datetime import datetime, timedelta, timezone
import json
import os
from pathlib import Path

from services.product_refresh import (
    refresh_canadian_renewal_watch,
    refresh_us_compliance_for_configured_customers,
)


class ScheduledRefreshError(RuntimeError):
    pass


def _required_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise ScheduledRefreshError(f"{name} is required")
    return value


def _paths() -> tuple[Path, Path, Path]:
    root = Path(_required_env("FEDPULSE_DATA_ROOT"))
    return root / "captures", root / "canonical", root / "product_releases"


def run(market: str) -> dict[str, object]:
    capture_root, canonical_root, release_root = _paths()
    now = datetime.now(timezone.utc)
    result: dict[str, object] = {"as_of": now.date().isoformat(), "market": market, "releases": []}
    if market in {"ca", "both"}:
        canada = refresh_canadian_renewal_watch(
            award_resource_url=_required_env("CANADABUYS_AWARDS_URL"),
            contract_resource_url=_required_env("CANADABUYS_CONTRACT_HISTORY_URL"),
            capture_root=capture_root,
            canonical_root=canonical_root,
            release_root=release_root,
            as_of=now.date(),
        )
        result["releases"].append({"country": "CA", "release_id": canada.release.release_id, "records": canada.release.manifest["records"]["record_count"]})
    if market in {"us", "both"}:
        lookback_days = int(os.getenv("SAM_REFRESH_LOOKBACK_DAYS", "1"))
        if lookback_days < 0 or lookback_days > 31:
            raise ScheduledRefreshError("SAM_REFRESH_LOOKBACK_DAYS must be between 0 and 31")
        start = (now.date() - timedelta(days=lookback_days)).strftime("%m/%d/%Y")
        end = now.date().strftime("%m/%d/%Y")
        united_states = refresh_us_compliance_for_configured_customers(
            capture_root=capture_root,
            canonical_root=canonical_root,
            release_root=release_root,
            posted_from=start,
            posted_to=end,
            as_of=now.date(),
        )
        result["releases"].extend({"country": "US", "release_id": release.release_id, "records": release.manifest["records"]["record_count"]} for release in united_states.releases)
        result["us_configured_profiles"] = len(united_states.releases)
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description="Refresh verified FedPulse intelligence releases")
    parser.add_argument("--market", choices=("ca", "us", "both"), default="both")
    args = parser.parse_args()
    try:
        print(json.dumps(run(args.market), sort_keys=True))
    except (ScheduledRefreshError, ValueError, RuntimeError) as exc:
        raise SystemExit(f"scheduled refresh failed: {exc}") from exc


if __name__ == "__main__":
    main()
