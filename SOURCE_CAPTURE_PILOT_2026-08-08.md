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

## Not yet production-ready

- Canada tender resources still require resource-level CSV capture and parsing into the canonical schema; the pilot captured official catalogue metadata, not the tender corpus.
- Neither market has completed normalization, deduplication, amendment handling, historical backfill, analyst review, or release-manifest approval.
- The U.S. collector needs an explicit end-to-end deadline/retry policy before scheduled operation. This pilot used the existing fail-closed HTTP behavior and ran once successfully.
- No customer-facing route or legacy ingestion path was changed by this pilot.

## Next controlled implementation step

Add source-specific parsers that turn captured Canada and SAM raw artifacts into quarantined-or-accepted canonical records, then run fixture-based and small live validation before any product endpoint reads them.
