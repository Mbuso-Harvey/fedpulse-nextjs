from datetime import datetime, timezone
import json
from pathlib import Path
import sys

import pytest


PROJECT_ROOT = Path(__file__).resolve().parents[2]
API_DIR = PROJECT_ROOT / "platform" / "apps" / "api"
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

from services.canonical_artifacts import (  # noqa: E402
    CanonicalArtifactError,
    materialize_parsed_capture,
    verify_canonical_artifact_set,
)
from services.source_foundation import build_capture_manifest, write_immutable_capture  # noqa: E402
from services.source_parsers import parse_sam_opportunities_capture  # noqa: E402


def parsed_sam_capture(tmp_path, rows):
    raw = json.dumps({"opportunitiesData": rows}).encode("utf-8")
    manifest = build_capture_manifest(
        source_id="U1_SAM_OPPORTUNITIES",
        resource_url="https://api.sam.gov/opportunities/v2/search",
        raw_bytes=raw,
        acquired_at=datetime(2026, 8, 8, tzinfo=timezone.utc),
    )
    raw_path, _ = write_immutable_capture(tmp_path / "captures", manifest, raw, ".json")
    return parse_sam_opportunities_capture(raw_path)


def test_materialize_persists_verified_capture_linkage_and_review_gate(tmp_path):
    parsed = parsed_sam_capture(
        tmp_path,
        [{"noticeId": "notice-1", "title": "Cybersecurity support", "postedDate": "2026-08-07"}],
    )

    artifact_set = materialize_parsed_capture(parsed, artifact_root=tmp_path / "canonical")
    verified = verify_canonical_artifact_set(artifact_set.manifest_path)

    assert verified.manifest["source"]["capture_id"] == parsed.capture_id
    assert verified.manifest["source"]["capture_content_sha256"] == parsed.capture_content_sha256
    assert verified.manifest["artifacts"]["accepted"]["record_count"] == 1
    assert verified.manifest["review_gate"] == {
        "status": "pending_human_review",
        "requires_human_approval": True,
        "product_eligible": False,
    }
    stored = json.loads(artifact_set.accepted_path.read_text(encoding="utf-8"))
    assert stored["source_capture"]["capture_id"] == parsed.capture_id
    assert stored["product_lineage"]["status"] == "not_linked"


def test_materialize_keeps_all_quarantined_rows_and_reuses_identical_outputs(tmp_path):
    parsed = parsed_sam_capture(tmp_path, [{"noticeId": "notice-2", "postedDate": "2026-08-07"}])

    first = materialize_parsed_capture(parsed, artifact_root=tmp_path / "canonical")
    second = materialize_parsed_capture(parsed, artifact_root=tmp_path / "canonical")

    assert first.manifest_path == second.manifest_path
    assert first.manifest["artifacts"]["accepted"]["record_count"] == 0
    assert first.manifest["artifacts"]["quarantined"]["record_count"] == 1


def test_verifier_and_writer_fail_closed_on_tampered_artifacts(tmp_path):
    parsed = parsed_sam_capture(
        tmp_path,
        [{"noticeId": "notice-3", "title": "Support", "postedDate": "2026-08-07"}],
    )
    artifact_set = materialize_parsed_capture(parsed, artifact_root=tmp_path / "canonical")
    artifact_set.accepted_path.write_text("{}\n", encoding="utf-8")

    with pytest.raises(CanonicalArtifactError, match="checksum"):
        verify_canonical_artifact_set(artifact_set.manifest_path)
    with pytest.raises(CanonicalArtifactError, match="collision"):
        materialize_parsed_capture(parsed, artifact_root=tmp_path / "canonical")
