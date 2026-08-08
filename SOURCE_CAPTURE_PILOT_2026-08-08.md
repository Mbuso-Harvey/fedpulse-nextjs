# Official Source Capture Pilot — 2026-08-08

## Purpose

Record the first bounded, live proof that the governed source-capture foundation can retrieve official Canada and U.S. procurement data without fabricating results, blending countries, or persisting credentials in project files or manifests.

This is an ingestion-control pilot, not a production data release. The raw captures remain outside Git under the ignored `data/` directory; this report records only reproducible, non-sensitive audit metadata.

## Scope and outcome

| Market | Registry source | Official endpoint used | Outcome |
| --- | --- | --- | --- |
| Canada | `C1_CANADABUYS_TENDERS` | Open Canada dataset metadata API for CanadaBuys tender notices | Immutable raw metadata capture written successfully. |
| United States | `U1_SAM_OPPORTUNITIES` | SAM.gov Opportunities v2 search API | Immutable raw response written successfully; 10 returned records passed the first required-field and country-scope checks. |

The U.S. request was intentionally bounded to postings from `08/01/2026` through `08/07/2026`, with a maximum of 10 records. The SAM key was read only from the active process environment, was not written to disk, and is absent from the capture manifest.

## Capture audit metadata

| Market | Capture ID | Captured (UTC) | Bytes | SHA-256 | Manifest secret check |
| --- | --- | --- | ---: | --- | --- |
| Canada | `c1_canadabuys_tenders-20260808T001655Z-b6fb33030630` | 2026-08-08T00:16:55Z | 39,128 | `b6fb330306306c6eeb730bafe39dc84b753a3a96cc596cda278c2fffa2228890` | Pass |
| United States | `u1_sam_opportunities-20260808T002145Z-0abd9aa3efb4` | 2026-08-08T00:21:45Z | 17,894 | `0abd9aa3efb445a02bca1b0ec90597cc76e033b9fb28d113de5d4b0def76b6e5` | Pass |

## Validation performed

- Each endpoint was checked against the allow-listed host and its country-specific source registry entry.
- Each capture has an immutable raw artifact, sidecar manifest, size, and content checksum.
- The SAM response was parsed only after raw capture; all 10 returned records met the pilot's required identifier, title, posted-date, and U.S. country-scope checks. No records were silently substituted.
- Raw capture content is ignored by Git. This prevents both repository bloat and accidental publishing of source payloads; this report is the committed audit trail.

## Canonical parser validation

The parser stage was subsequently exercised against one newly captured CanadaBuys CSV and the bounded SAM response above. Each parser first rechecks its sidecar manifest, the approved source ID and country, resource host, and raw-content SHA-256. It then emits a source-native canonical candidate or a compact quarantine entry; it does not enrich, deduplicate, merge, or publish the record.

| Market | Source | Input capture | Candidate records | Quarantined records | Result |
| --- | --- | --- | ---: | ---: | --- |
| Canada | `C1_CANADABUYS_TENDERS` | `c1_canadabuys_tenders-20260808T003115Z-68c57ea5ec32` (292,829 bytes; SHA-256 `68c57ea5ec32ee6efb78ce9f7d34165d56e402f06975ffaf7614bb7e274656dc`) | 41 | 0 | Pass |
| United States | `U1_SAM_OPPORTUNITIES` | `u1_sam_opportunities-20260808T002145Z-0abd9aa3efb4` | 10 | 0 | Pass |

Each accepted candidate now retains its native ID, country, source ID and record type, captured-source URL and timestamps, capture ID and checksum, deterministic record snapshot ID, field-level mapping status, parser version, and a `not_linked` product-lineage state. The raw candidate payload is not committed to Git.

## Canonical artifact persistence and automated gate

The validated parser outputs were materialized as immutable `accepted.jsonl` and `quarantined.jsonl` artifacts with a capture-linked `canonical.manifest.json`. Re-running the same parsed capture reuses byte-identical artifacts; a differing write or a manifest/checksum mismatch is a hard failure.

| Market | Source | Accepted | Quarantined | Automated gate | Product eligible |
| --- | --- | ---: | ---: | --- | --- |
| Canada | `C1_CANADABUYS_TENDERS` | 41 | 0 | `passed` | No — canonical stage only |
| United States | `U1_SAM_OPPORTUNITIES` | 10 | 0 | `passed` | No — canonical stage only |

The artifacts remain under the Git-ignored `data/canonical/` operational store. The manifest records automated lineage, checksum, schema, and record-count checks. `product_eligible` remains `false` because the canonical stage is not the product-release stage; subsequent automated normalization, freshness, reconciliation, and product-calculation gates determine eligibility.

## Renewal Watch engine run

The current complete CanadaBuys award and contract-history resources were captured and processed through the same automated path. The award capture admitted 26,870 records. The contract-history capture admitted 21,268 records and automatically quarantined six records missing a publication date.

Using the source-capture date of 2026-08-08 and a 365-day horizon, the Renewal Watch engine produced 3,428 evidence-linked contract-end watch candidates. It automatically excluded 6,006 elapsed contracts and 3,582 contracts outside the watch window. This is an urgency watchlist based on published end dates, not a prediction that a contract will renew.

## U.S. public-document and compliance evidence run

All 25 public attachment references in the bounded SAM opportunity window were captured through the official SAM redirect path. The operational store now contains 30 U2 document captures from this window and the preceding retrieval attempts; 24 produced extractable source text and six were automatically quarantined because they had no extractable text.

The U.S. compliance engine assessed all 10 U1 opportunities against the extracted U2 evidence. Six had public-document evidence and four correctly reported `unknown_no_public_document_evidence`. The extracted evidence in this bounded window contained proposal-instruction and evaluation-criterion signals. No customer capability profile was configured, and the engine made no compliance or bid/no-bid claim for any customer.

## Not yet production-ready

- The Canada parser has been tested on the small "new tender notices" feed, not the full tender corpus or historical backfill.
- Neither market has completed normalization, deduplication, amendment handling, or automated product-release criteria.
- The U.S. collector needs an explicit end-to-end deadline/retry policy before scheduled operation. This pilot used the existing fail-closed HTTP behavior and ran once successfully.
- No customer-facing route or legacy ingestion path was changed by this pilot.

## Next controlled implementation step

Implement deterministic normalization, deduplication, amendment/version, freshness, and reconciliation gates. Only an automated product release that passes these criteria may be read by a customer-facing product route.
