"""Evidence-backed Canada Renewal Watch calculations.

This module turns only verified CanadaBuys canonical artifacts into a
transparent renewal watchlist. It deliberately measures contract-end urgency,
not an ungrounded prediction that a contract will renew.
"""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass
from datetime import date
from decimal import Decimal, InvalidOperation
import json
from pathlib import Path
from typing import Any, Iterable, Mapping

from services.canonical_artifacts import CanonicalArtifactError, verify_canonical_artifact_set


RENEWAL_ENGINE_VERSION = "renewal-watch-v1"


class RenewalIntelligenceError(RuntimeError):
    """Raised when Renewal Watch is given invalid or mixed source artifacts."""


@dataclass(frozen=True)
class RenewalWatchBuild:
    as_of: date
    lookahead_days: int
    candidates: tuple[dict[str, Any], ...]
    excluded_counts: Mapping[str, int]
    source_captures: tuple[Mapping[str, str], ...]


def _read_jsonl(path: Path) -> tuple[dict[str, Any], ...]:
    try:
        return tuple(json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line)
    except (OSError, json.JSONDecodeError) as exc:
        raise RenewalIntelligenceError(f"Canonical artifact is unreadable: {path}") from exc


def _date(value: Any) -> date | None:
    if not value:
        return None
    try:
        return date.fromisoformat(str(value).strip()[:10])
    except ValueError:
        return None


def _amount(value: Any) -> str | None:
    if value is None or not str(value).strip():
        return None
    try:
        return str(Decimal(str(value).strip().replace(",", "")))
    except InvalidOperation:
        return None


def _contract_key(record: Mapping[str, Any]) -> str | None:
    fields = record.get("source_fields", {})
    for field in ("contract_number", "reference_number", "solicitation_number"):
        value = fields.get(field)
        if value:
            return str(value).strip()
    native_id = str(record.get("native_id") or "").split("~", 1)[0].strip()
    return native_id or None


def _version_key(record: Mapping[str, Any]) -> tuple[int, str, str]:
    fields = record.get("source_fields", {})
    amendment = str(fields.get("amendment_number") or "").strip()
    try:
        amendment_value = int(amendment)
    except ValueError:
        amendment_value = -1
    return amendment_value, str(record.get("published_at") or ""), str(record.get("record_snapshot_id") or "")


def _latest_by_key(records: Iterable[Mapping[str, Any]]) -> dict[str, Mapping[str, Any]]:
    latest: dict[str, Mapping[str, Any]] = {}
    for record in records:
        key = _contract_key(record)
        if not key:
            continue
        if key not in latest or _version_key(record) > _version_key(latest[key]):
            latest[key] = record
    return latest


def _source_capture(manifest: Mapping[str, Any]) -> dict[str, str]:
    source = manifest["source"]
    return {
        "source_id": source["source_id"],
        "capture_id": source["capture_id"],
        "capture_content_sha256": source["capture_content_sha256"],
        "capture_acquired_at": source["capture_acquired_at"],
    }


def _assert_source(manifest: Mapping[str, Any], expected_source_id: str) -> None:
    source = manifest.get("source", {})
    if source.get("source_id") != expected_source_id or source.get("country") != "CA":
        raise RenewalIntelligenceError(f"Renewal Watch requires Canadian {expected_source_id} artifacts")


def _urgency(days_until_end: int, lookahead_days: int) -> tuple[str, int]:
    if days_until_end <= 30:
        tier = "critical"
    elif days_until_end <= 90:
        tier = "high"
    elif days_until_end <= 180:
        tier = "planned"
    else:
        tier = "watch"
    score = max(0, min(100, round(100 * (lookahead_days - days_until_end) / lookahead_days)))
    return tier, score


def build_renewal_watch(
    *,
    contract_manifest_path: Path,
    award_manifest_path: Path | None,
    as_of: date,
    lookahead_days: int = 365,
) -> RenewalWatchBuild:
    """Build a current, source-traceable Canada Renewal Watch window.

    Records with past, invalid, or out-of-window end dates are excluded with a
    machine-readable aggregate reason. The output is not a renewal prediction:
    it is a contract-end watchlist with award context where official evidence
    can be joined by a native key.
    """
    if lookahead_days < 1:
        raise RenewalIntelligenceError("lookahead_days must be positive")
    try:
        contract_artifacts = verify_canonical_artifact_set(contract_manifest_path)
        _assert_source(contract_artifacts.manifest, "C3_CANADABUYS_CONTRACT_HISTORY")
        award_artifacts = verify_canonical_artifact_set(award_manifest_path) if award_manifest_path else None
        if award_artifacts:
            _assert_source(award_artifacts.manifest, "C2_CANADABUYS_AWARDS")
    except CanonicalArtifactError as exc:
        raise RenewalIntelligenceError(f"Renewal Watch requires verified canonical artifacts: {exc}") from exc

    contracts = _latest_by_key(_read_jsonl(contract_artifacts.accepted_path))
    awards = _latest_by_key(_read_jsonl(award_artifacts.accepted_path)) if award_artifacts else {}
    candidates: list[dict[str, Any]] = []
    excluded = Counter()
    for contract_key, contract in contracts.items():
        fields = contract.get("source_fields", {})
        end_date = _date(fields.get("contract_end_at"))
        if not end_date:
            excluded["missing_or_invalid_contract_end_date"] += 1
            continue
        days_until_end = (end_date - as_of).days
        if days_until_end < 0:
            excluded["contract_end_date_elapsed"] += 1
            continue
        if days_until_end > lookahead_days:
            excluded["outside_renewal_window"] += 1
            continue
        urgency_tier, urgency_score = _urgency(days_until_end, lookahead_days)
        award = awards.get(contract_key)
        award_fields = award.get("source_fields", {}) if award else {}
        candidates.append(
            {
                "engine_version": RENEWAL_ENGINE_VERSION,
                "country": "CA",
                "product": "renewal_watch",
                "candidate_id": f"CA:renewal_watch:{contract['canonical_id']}",
                "contract_key": contract_key,
                "contract_end_date": end_date.isoformat(),
                "days_until_contract_end": days_until_end,
                "urgency_tier": urgency_tier,
                "urgency_score": urgency_score,
                "contract_value": _amount(fields.get("total_contract_value")) or _amount(fields.get("contract_amount")),
                "currency": fields.get("currency"),
                "supplier": fields.get("supplier"),
                "buyer": fields.get("contracting_entity"),
                "category": fields.get("unspsc"),
                "award_context": (
                    {
                        "canonical_id": award["canonical_id"],
                        "contract_award_date": award_fields.get("award_date"),
                        "supplier": award_fields.get("supplier"),
                        "value": _amount(award_fields.get("total_contract_value")) or _amount(award_fields.get("contract_amount")),
                    }
                    if award
                    else None
                ),
                "evidence": {
                    "contract_canonical_id": contract["canonical_id"],
                    "contract_source_url": contract["source_url"],
                    "contract_capture": contract["source_capture"],
                    "award_canonical_id": award["canonical_id"] if award else None,
                },
                "limitations": [
                    "Contract-end urgency is not a prediction that procurement will renew.",
                    "Award context is included only where a native source key matched.",
                ],
            }
        )
    candidates.sort(key=lambda candidate: (candidate["days_until_contract_end"], candidate["candidate_id"]))
    source_captures = [_source_capture(contract_artifacts.manifest)]
    if award_artifacts:
        source_captures.append(_source_capture(award_artifacts.manifest))
    return RenewalWatchBuild(
        as_of=as_of,
        lookahead_days=lookahead_days,
        candidates=tuple(candidates),
        excluded_counts=dict(sorted(excluded.items())),
        source_captures=tuple(source_captures),
    )
