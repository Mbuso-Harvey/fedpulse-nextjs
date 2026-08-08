"""Repeatable official-source refresh workflows for launched intelligence products.

These workflows compose the guarded source collectors, immutable canonical
artifacts, product engines, and verified release boundary. They do not use
legacy database samples, silently recover from a source failure, or publish a
partial release as successful.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Mapping

import httpx

from services.canonical_artifacts import CanonicalArtifactSet, materialize_parsed_capture
from services.compliance_intelligence import CustomerCapabilityProfile, build_us_compliance_assessments
from services.product_releases import ProductRelease, release_canadian_renewal_watch, release_us_compliance_assessments
from services.renewal_intelligence import build_renewal_watch
from services.source_collectors import (
    RawCaptureResult,
    SamOpportunityCollection,
    SamPublicDocumentBatch,
    collect_canadabuys_resource,
    collect_sam_opportunities,
    collect_sam_public_documents_from_capture,
)
from services.source_parsers import parse_capture


@dataclass(frozen=True)
class CanadaRenewalRefresh:
    award_capture: RawCaptureResult
    contract_capture: RawCaptureResult
    award_artifacts: CanonicalArtifactSet
    contract_artifacts: CanonicalArtifactSet
    release: ProductRelease


@dataclass(frozen=True)
class USComplianceRefresh:
    opportunity_capture: SamOpportunityCollection
    opportunity_artifacts: CanonicalArtifactSet
    document_batch: SamPublicDocumentBatch
    document_artifacts: tuple[CanonicalArtifactSet, ...]
    release: ProductRelease


def refresh_canadian_renewal_watch(
    *,
    award_resource_url: str,
    contract_resource_url: str,
    capture_root: Path,
    canonical_root: Path,
    release_root: Path,
    as_of: date,
    lookahead_days: int = 365,
    client: httpx.Client | None = None,
) -> CanadaRenewalRefresh:
    """Produce one fully verified Canada Renewal Watch release from C2 and C3."""
    award_capture = collect_canadabuys_resource(
        source_id="C2_CANADABUYS_AWARDS", resource_url=award_resource_url, capture_root=capture_root, client=client
    )
    contract_capture = collect_canadabuys_resource(
        source_id="C3_CANADABUYS_CONTRACT_HISTORY", resource_url=contract_resource_url, capture_root=capture_root, client=client
    )
    award_artifacts = materialize_parsed_capture(parse_capture(award_capture.raw_path), artifact_root=canonical_root)
    contract_artifacts = materialize_parsed_capture(parse_capture(contract_capture.raw_path), artifact_root=canonical_root)
    build = build_renewal_watch(
        contract_manifest_path=contract_artifacts.manifest_path,
        award_manifest_path=award_artifacts.manifest_path,
        as_of=as_of,
        lookahead_days=lookahead_days,
    )
    release = release_canadian_renewal_watch(
        build=build,
        contract_manifest_path=contract_artifacts.manifest_path,
        award_manifest_path=award_artifacts.manifest_path,
        release_root=release_root,
        operational_observations={"excluded_counts": dict(build.excluded_counts)},
    )
    return CanadaRenewalRefresh(award_capture, contract_capture, award_artifacts, contract_artifacts, release)


def refresh_us_compliance_analyst(
    *,
    capture_root: Path,
    canonical_root: Path,
    release_root: Path,
    posted_from: str,
    posted_to: str,
    customer_profile: CustomerCapabilityProfile,
    as_of: date,
    limit: int = 100,
    client: httpx.Client | None = None,
) -> USComplianceRefresh:
    """Produce a profile-scoped U.S. compliance release from U1 and public U2."""
    opportunity_capture = collect_sam_opportunities(
        capture_root=capture_root,
        posted_from=posted_from,
        posted_to=posted_to,
        limit=limit,
        client=client,
    )
    opportunity_artifacts = materialize_parsed_capture(parse_capture(opportunity_capture.raw_path), artifact_root=canonical_root)
    document_batch = collect_sam_public_documents_from_capture(
        opportunity_raw_path=opportunity_capture.raw_path,
        capture_root=capture_root,
        client=client,
    )
    document_artifacts = tuple(
        materialize_parsed_capture(parse_capture(capture.raw_path), artifact_root=canonical_root)
        for capture in document_batch.captures
    )
    assessments = build_us_compliance_assessments(
        opportunity_manifest_path=opportunity_artifacts.manifest_path,
        document_manifest_paths=[artifact.manifest_path for artifact in document_artifacts],
        customer_profile=customer_profile,
    )
    release = release_us_compliance_assessments(
        assessments=assessments,
        opportunity_manifest_path=opportunity_artifacts.manifest_path,
        document_manifest_paths=[artifact.manifest_path for artifact in document_artifacts],
        as_of=as_of,
        release_root=release_root,
        operational_observations={
            "public_document_discovery": {
                "discovered_count": document_batch.discovered_count,
                "retrieved_count": len(document_batch.captures),
                "failed_count": len(document_batch.failures),
            }
        },
    )
    return USComplianceRefresh(opportunity_capture, opportunity_artifacts, document_batch, document_artifacts, release)
