"""Customer API for verified FedPulse intelligence releases."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from services.auth import get_current_user
from services.product_releases import ProductRelease, ProductReleaseError, verify_product_release


router = APIRouter(prefix="/intelligence", tags=["Intelligence products"])

_PRODUCT_TIERS = {
    ("CA", "renewal_watch"): {"watch", "professional", "pro", "team", "enterprise"},
    ("US", "bid_no_bid_compliance_analyst"): {"professional", "pro", "team", "enterprise"},
}


def _release_root() -> Path:
    return Path(os.getenv("PRODUCT_RELEASE_ROOT", "data/product_releases"))


def _user_metadata(user: dict[str, Any]) -> dict[str, Any]:
    metadata = user.get("user_metadata", {})
    return metadata if isinstance(metadata, dict) else {}


def _authorize_product(user: dict[str, Any], *, country: str, product: str) -> str | None:
    allowed_tiers = _PRODUCT_TIERS.get((country, product))
    if not allowed_tiers:
        raise HTTPException(status_code=404, detail="Unknown intelligence product")
    metadata = _user_metadata(user)
    tier = str(metadata.get("subscription_tier") or "").casefold()
    if tier not in allowed_tiers:
        raise HTTPException(status_code=403, detail="Subscription does not include this intelligence product")
    profile_id = metadata.get("customer_profile_id")
    return str(profile_id) if profile_id else None


def _latest_release(*, country: str, product: str, customer_scope_id: str | None) -> ProductRelease:
    product_dir = _release_root() / country.lower() / product
    candidates: list[ProductRelease] = []
    for manifest_path in product_dir.glob("*/*/release.manifest.json") if product_dir.is_dir() else ():
        try:
            release = verify_product_release(manifest_path)
        except ProductReleaseError:
            continue
        if release.manifest.get("country") != country or release.manifest.get("product") != product:
            continue
        audience = release.manifest.get("audience", {})
        if audience.get("scope") == "customer" and audience.get("customer_scope_id") != customer_scope_id:
            continue
        candidates.append(release)
    if not candidates:
        raise HTTPException(status_code=503, detail="Verified product release is currently unavailable")
    return max(candidates, key=lambda release: (str(release.manifest.get("as_of")), release.release_id))


def _public_release_summary(release: ProductRelease) -> dict[str, Any]:
    manifest = release.manifest
    return {
        "release_id": release.release_id,
        "country": manifest["country"],
        "product": manifest["product"],
        "engine_version": manifest["engine_version"],
        "as_of": manifest["as_of"],
        "coverage_through": manifest["coverage_through"],
        "release_status": manifest["release_status"],
        "record_count": manifest["records"]["record_count"],
        "source_coverage": [
            {key: input_metadata[key] for key in ("source_id", "capture_id", "capture_acquired_at")}
            for input_metadata in manifest["inputs"]
        ],
        "automated_checks": manifest["automated_gate"]["checks"],
    }


def _read_page(release: ProductRelease, *, offset: int, limit: int) -> list[dict[str, Any]]:
    try:
        records = [json.loads(line) for line in release.records_path.read_text(encoding="utf-8").splitlines() if line]
    except (OSError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=503, detail="Verified product records are unavailable") from exc
    return records[offset : offset + limit]


@router.get("/status")
async def product_status() -> list[dict[str, Any]]:
    """Return availability only; it never reports a non-verified release as live."""
    statuses = []
    for (country, product), _tiers in _PRODUCT_TIERS.items():
        try:
            release = _latest_release(country=country, product=product, customer_scope_id=None)
            statuses.append({"country": country, "product": product, "availability": "released", "release": _public_release_summary(release)})
        except HTTPException:
            statuses.append({"country": country, "product": product, "availability": "unavailable"})
    return statuses


@router.get("/{country}/{product}")
async def product_records(
    country: str,
    product: str,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    user: dict[str, Any] = Depends(get_current_user),
) -> dict[str, Any]:
    normalized_country = country.upper()
    customer_scope_id = _authorize_product(user, country=normalized_country, product=product)
    if normalized_country == "US" and not customer_scope_id:
        raise HTTPException(status_code=403, detail="A configured customer capability profile is required for this product")
    release = _latest_release(country=normalized_country, product=product, customer_scope_id=customer_scope_id)
    return {
        "release": _public_release_summary(release),
        "offset": offset,
        "limit": limit,
        "records": _read_page(release, offset=offset, limit=limit),
    }
