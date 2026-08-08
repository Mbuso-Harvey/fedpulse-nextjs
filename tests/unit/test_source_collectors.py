import json
from pathlib import Path
import sys

import httpx
import pytest


PROJECT_ROOT = Path(__file__).resolve().parents[2]
API_DIR = PROJECT_ROOT / "platform" / "apps" / "api"
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

from services.source_collectors import (  # noqa: E402
    COLLECTOR_USER_AGENT,
    SourceCollectionError,
    collect_canadabuys_resource,
    collect_sam_public_document,
    collect_usaspending_awards,
    collect_sam_opportunities,
)


def mock_client(handler):
    return httpx.Client(transport=httpx.MockTransport(handler))


def test_sam_collection_requires_managed_environment_key(tmp_path, monkeypatch):
    monkeypatch.delenv("SAM_GOV_API_KEY", raising=False)
    with pytest.raises(SourceCollectionError, match="SAM_GOV_API_KEY"):
        collect_sam_opportunities(
            capture_root=tmp_path,
            posted_from="08/01/2026",
            posted_to="08/07/2026",
        )


def test_sam_collection_captures_real_response_and_quarantines_bad_rows(tmp_path, monkeypatch):
    monkeypatch.setenv("SAM_GOV_API_KEY", "test-secret-not-for-output")
    payload = {
        "opportunitiesData": [
            {"noticeId": "notice-1", "title": "Cybersecurity support", "postedDate": "2026-08-07"},
            {"noticeId": "notice-2", "postedDate": "2026-08-07"},
        ]
    }

    def handler(request):
        assert request.url.host == "api.sam.gov"
        assert request.url.params["api_key"] == "test-secret-not-for-output"
        assert request.headers["user-agent"] == COLLECTOR_USER_AGENT
        return httpx.Response(200, json=payload, headers={"content-type": "application/json"})

    result = collect_sam_opportunities(
        capture_root=tmp_path,
        posted_from="08/01/2026",
        posted_to="08/07/2026",
        client=mock_client(handler),
    )

    assert [record["native_id"] for record in result.admitted_records] == ["notice-1"]
    assert result.quarantined_records == ({"native_id": "notice-2", "status": "quarantined", "reasons": ["missing_title"]},)
    manifest_text = result.manifest_path.read_text(encoding="utf-8")
    assert "test-secret-not-for-output" not in manifest_text
    assert json.loads(manifest_text)["request_metadata"]["api_key"] == "[REDACTED]"
    assert json.loads(result.raw_path.read_text(encoding="utf-8")) == payload


def test_canadabuys_capture_accepts_only_canadian_sources(tmp_path):
    def handler(request):
        assert request.headers["user-agent"] == COLLECTOR_USER_AGENT
        return httpx.Response(200, content=b"header\\nvalue\\n", headers={"content-type": "text/csv", "last-modified": "Thu, 07 Aug 2026 00:00:00 GMT"})

    result = collect_canadabuys_resource(
        source_id="C1_CANADABUYS_TENDERS",
        resource_url="https://open.canada.ca/data/en/dataset/example",
        capture_root=tmp_path,
        client=mock_client(handler),
    )
    assert result.manifest.country == "CA"
    assert result.raw_path.read_bytes() == b"header\\nvalue\\n"

    with pytest.raises(SourceCollectionError, match="not a Canadian source"):
        collect_canadabuys_resource(
            source_id="U1_SAM_OPPORTUNITIES",
            resource_url="https://api.sam.gov/opportunities/v2/search",
            capture_root=tmp_path,
            client=mock_client(handler),
        )


def test_sam_public_document_capture_preserves_parent_lineage_without_a_key(tmp_path):
    def handler(request):
        assert request.url.host == "sam.gov"
        assert request.headers["user-agent"] == COLLECTOR_USER_AGENT
        assert "api_key" not in request.url.params
        return httpx.Response(200, content=b"%PDF-1.7 document", headers={"content-type": "application/pdf"})

    result = collect_sam_public_document(
        parent_native_id="notice-1",
        resource_url="https://sam.gov/api/prod/opps/v3/opportunities/resources/files/example/download",
        resource_kind="attachment",
        capture_root=tmp_path,
        client=mock_client(handler),
    )

    assert result.parent_native_id == "notice-1"
    assert result.raw_path.suffix == ".pdf"
    manifest = json.loads(result.manifest_path.read_text(encoding="utf-8"))
    assert manifest["source_id"] == "U2_SAM_PUBLIC_DOCUMENTS"
    assert manifest["request_metadata"] == {
        "final_host": "sam.gov",
        "parent_native_id": "notice-1",
        "redirect_count": "0",
        "resource_kind": "attachment",
    }


def test_default_collector_client_follows_official_publisher_redirects():
    from services.source_collectors import _client_or_default

    client, owns_client = _client_or_default(None)
    try:
        assert owns_client is True
        assert client.follow_redirects is True
    finally:
        client.close()


def test_document_collection_rejects_nonpositive_timeout(tmp_path):
    with pytest.raises(SourceCollectionError, match="timeout"):
        collect_sam_public_document(
            parent_native_id="notice-1",
            resource_url="https://sam.gov/api/prod/opps/v3/opportunities/resources/files/example/download",
            resource_kind="attachment",
            capture_root=tmp_path,
            timeout_seconds=0,
        )


def test_usaspending_award_capture_requires_bounded_request_and_captures_response(tmp_path):
    payload = {"filters": {"time_period": []}, "fields": ["Award ID"], "page": 1, "limit": 10}
    def handler(request):
        assert request.method == "POST"
        assert request.url.host == "api.usaspending.gov"
        return httpx.Response(200, json={"results": []}, headers={"content-type": "application/json"})
    result = collect_usaspending_awards(request_payload=payload, capture_root=tmp_path, client=mock_client(handler))
    assert result.manifest.source_id == "U3_USASPENDING_AWARDS"
    with pytest.raises(SourceCollectionError, match="limit"):
        collect_usaspending_awards(request_payload={**payload, "limit": 101}, capture_root=tmp_path, client=mock_client(handler))
