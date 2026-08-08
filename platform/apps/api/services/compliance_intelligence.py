"""Evidence-bound U.S. bid/no-bid and compliance decision support."""

from __future__ import annotations

from dataclasses import dataclass
import json
from pathlib import Path
import re
from typing import Any, Iterable, Mapping

from services.canonical_artifacts import CanonicalArtifactError, verify_canonical_artifact_set


COMPLIANCE_ENGINE_VERSION = "us-compliance-analyst-v1"
_PATTERNS = {
    "security_clearance": re.compile(r"\b(?:top secret|secret|confidential) clearance\b", re.IGNORECASE),
    "certification": re.compile(r"\b(?:cmmc|fedramp|nist\s*(?:sp)?\s*800[- ]?171|iso\s*27001|soc\s*2)\b", re.IGNORECASE),
    "proposal_instruction": re.compile(r"\b(?:shall|must) submit\b", re.IGNORECASE),
    "evaluation_criterion": re.compile(r"\b(?:evaluation factors?|best value|lowest price technically acceptable|lpta)\b", re.IGNORECASE),
}


class ComplianceIntelligenceError(RuntimeError):
    """Raised when compliance analysis lacks verified country-scoped evidence."""


@dataclass(frozen=True)
class CustomerCapabilityProfile:
    profile_id: str
    certifications: tuple[str, ...] = ()
    clearances: tuple[str, ...] = ()
    capabilities: tuple[str, ...] = ()


def _records(path: Path) -> tuple[dict[str, Any], ...]:
    try:
        return tuple(json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line)
    except (OSError, json.JSONDecodeError) as exc:
        raise ComplianceIntelligenceError(f"Canonical evidence artifact is unreadable: {path}") from exc


def _assert_source(manifest: Mapping[str, Any], source_id: str) -> None:
    source = manifest.get("source", {})
    if source.get("source_id") != source_id or source.get("country") != "US":
        raise ComplianceIntelligenceError(f"Compliance analysis requires U.S. {source_id} evidence")


def _normalized(values: Iterable[str]) -> set[str]:
    return {value.casefold().strip() for value in values if value and value.strip()}


def _requirement_evidence(document: Mapping[str, Any]) -> list[dict[str, Any]]:
    findings: list[dict[str, Any]] = []
    for passage in document.get("document", {}).get("passages", []):
        text = str(passage.get("text") or "")
        for category, pattern in _PATTERNS.items():
            match = pattern.search(text)
            if match:
                findings.append(
                    {
                        "category": category,
                        "requirement": match.group(0),
                        "document_canonical_id": document["canonical_id"],
                        "page": passage.get("page"),
                        "snippet": text[max(0, match.start() - 120) : match.end() + 180],
                    }
                )
    return findings


def _profile_status(finding: Mapping[str, Any], profile: CustomerCapabilityProfile) -> str:
    requirement = str(finding["requirement"]).casefold()
    if finding["category"] == "certification":
        values = _normalized(profile.certifications)
    elif finding["category"] == "security_clearance":
        values = _normalized(profile.clearances)
    else:
        return "evidence_found"
    if not values:
        return "profile_not_configured"
    return "customer_match" if requirement in values else "customer_mismatch"


def build_us_compliance_assessments(
    *,
    opportunity_manifest_path: Path,
    document_manifest_paths: Iterable[Path],
    customer_profile: CustomerCapabilityProfile,
    historical_award_manifest_paths: Iterable[Path] = (),
) -> tuple[dict[str, Any], ...]:
    """Build advisory assessments from verified SAM metadata and public documents."""
    try:
        opportunity_artifacts = verify_canonical_artifact_set(opportunity_manifest_path)
        _assert_source(opportunity_artifacts.manifest, "U1_SAM_OPPORTUNITIES")
        document_artifacts = [verify_canonical_artifact_set(path) for path in document_manifest_paths]
        for artifact in document_artifacts:
            _assert_source(artifact.manifest, "U2_SAM_PUBLIC_DOCUMENTS")
        award_artifacts = [verify_canonical_artifact_set(path) for path in historical_award_manifest_paths]
        for artifact in award_artifacts:
            _assert_source(artifact.manifest, "U3_USASPENDING_AWARDS")
    except CanonicalArtifactError as exc:
        raise ComplianceIntelligenceError(f"Compliance analysis requires verified evidence: {exc}") from exc

    documents_by_parent: dict[str, list[dict[str, Any]]] = {}
    for artifact in document_artifacts:
        for document in _records(artifact.accepted_path):
            documents_by_parent.setdefault(document["parent_native_id"], []).append(document)
    awards_by_agency: dict[str, list[dict[str, Any]]] = {}
    for artifact in award_artifacts:
        for award in _records(artifact.accepted_path):
            agency = str(award.get("source_fields", {}).get("awarding_agency") or "").casefold().strip()
            if agency:
                awards_by_agency.setdefault(agency, []).append(award)

    assessments = []
    for opportunity in _records(opportunity_artifacts.accepted_path):
        documents = documents_by_parent.get(opportunity["native_id"], [])
        agency = str(opportunity.get("source_fields", {}).get("department") or "").casefold().strip()
        historical_awards = awards_by_agency.get(agency, [])[:5] if agency else []
        findings = [finding for document in documents for finding in _requirement_evidence(document)]
        for finding in findings:
            finding["customer_status"] = _profile_status(finding, customer_profile)
        statuses = {finding["customer_status"] for finding in findings}
        if not documents:
            status = "unknown_no_public_document_evidence"
        elif "customer_mismatch" in statuses:
            status = "customer_profile_mismatch"
        elif "profile_not_configured" in statuses:
            status = "profile_required"
        else:
            status = "evidence_available"
        assessments.append(
            {
                "engine_version": COMPLIANCE_ENGINE_VERSION,
                "country": "US",
                "product": "bid_no_bid_compliance_analyst",
                "opportunity_canonical_id": opportunity["canonical_id"],
                "opportunity_native_id": opportunity["native_id"],
                "title": opportunity.get("title"),
                "response_deadline": opportunity.get("source_fields", {}).get("response_deadline"),
                "assessment_status": status,
                "customer_profile_id": customer_profile.profile_id,
                "public_document_count": len(documents),
                "historical_award_context": [{"award_canonical_id": award["canonical_id"], "recipient": award.get("source_fields", {}).get("recipient"), "award_amount": award.get("source_fields", {}).get("award_amount"), "award_end_at": award.get("source_fields", {}).get("award_end_at")} for award in historical_awards],
                "requirements": findings,
                "evidence": {
                    "opportunity_capture": opportunity["source_capture"],
                    "document_canonical_ids": [document["canonical_id"] for document in documents],
                    "historical_award_canonical_ids": [award["canonical_id"] for award in historical_awards],
                },
                "limitations": [
                    "Assessment covers only publicly retrieved document evidence.",
                    "Evidence not found is not evidence that a requirement does not exist.",
                    "This is advisory decision support and does not submit or authorize a bid.",
                    "Historical award context is agency-level market context, not evidence of an incumbent for this opportunity.",
                ],
            }
        )
    return tuple(assessments)
