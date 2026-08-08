# FedPulse Dual-Market Source and Quality Plan

**Decision date:** 2026-08-07
**Purpose:** Commercialise separate Canadian and U.S. procurement products from official, reproducible evidence.
**Status:** Active execution plan. The official C1, C2, C3, U1, U2, and U3 source paths have immutable-capture and canonical-parser implementations. Current C2/C3 resources, public U2 attachments from the active U1 window, and a bounded U3 award-context response have been captured and processed. Immutable Gold product releases and their country-scoped, entitlement-gated API are implemented. The Canada Renewal Watch production refresh completed successfully on 2026-08-08; U.S. release automation now awaits persisted customer capability profiles and deployment scheduling.

## 1. Non-negotiable operating model

FedPulse runs two source-native product lines:

| Product | Primary commercial decision | Rule |
|---|---|---|
| FedPulse Canada | Renewal, incumbent, buyer, supplier, and target-account decisions | CanadaBuys source records and Canada-specific logic only |
| FedPulse United States | Opportunity fit, bid/no-bid, requirements, compliance, amendment, and deadline decisions | SAM.gov and U.S.-specific logic only |

They may share ingestion infrastructure, evidence conventions, identity services, authentication, entitlements, alerts, and APIs. They must not share raw datasets, treat field names as equivalent, or make cross-country claims without an explicit, defensible mapping.

## 2. Approved source registry

### Canada: production sources

| Priority | Official source | Use | Refresh and evidence requirements |
|---|---|---|---|
| C1 | CanadaBuys tender notices (`open.canada.ca` dataset `6abd20d4-7a1c-4b38-baa2-9525d0bb2fd2`) | New/open opportunity discovery, buyer activity, expiry/renewal signals where present | Poll the published dataset metadata and incremental/aggregate resources; retain the data-dictionary version and resource URL with each load. Do not use the archived tender catalogue as a current feed. |
| C2 | CanadaBuys award notices (`open.canada.ca` dataset `a1acb126-9ce8-40a9-b889-5da2b1dd20cb`) | Incumbent and award evidence | Ingest as a distinct award source. Version schema mappings because the publisher changed CSV structure during 2026. |
| C3 | CanadaBuys contract history (`open.canada.ca` dataset `4fe645a1-ffcd-40c1-9385-2c771be956a4`) | Renewal Watch, active/history contracts, amendments, incumbency, supplier and buyer analysis | Treat the current contract-history resource as the primary renewal feed. It is refreshed monthly; historic files are baseline history, not a substitute for the current feed. |
| C4 | CanadaBuys data dictionary | Field interpretation and schema-change control | Store the exact dictionary artefact/hash used for every production mapping. |
| C5 | Official GSIN/UNSPSC/classification reference files where available | Controlled category lookup only | Version separately; never overwrite source-native category values. |

### United States: production sources

| Priority | Official source | Use | Refresh and evidence requirements |
|---|---|---|---|
| U1 | SAM.gov Get Opportunities Public API v2 | Live and archived opportunity metadata, dates, agency, NAICS/PSC, notices, descriptions, and public attachment links | Incremental active-notice pull daily and archive pull weekly. The API returns the latest active version; FedPulse must capture its own snapshots and amendments over time. Keep the API query, response bytes, source timestamp, notice ID, and public resource metadata. |
| U2 | Public SAM.gov opportunity descriptions and attachments referenced by U1 | Requirement, compliance, amendment, evaluation, and deadline evidence | Retrieve only publicly accessible material. Preserve the original file/bytes, MIME type, resource URL/ID, checksum, extraction method/version, page or passage offsets, and access result. Never infer that unavailable/private material does not exist. |
| U3 | USAspending API / official custom award-data downloads | Award, obligation, recipient, agency, parent/child award, and incumbent-market context | Use as the U.S. award/spend authority. Preserve API request/filter, bulk-download identifier where used, source update date, award identifiers, and transaction/revision time. Do not claim real-time award completeness. |
| U4 | Acquisition.gov FAR and DFARS releases | Versioned regulatory reference and clause/explanation lookup | Reference material only. A regulation match does not prove that a requirement applies unless the opportunity evidence contains it. Store regulation version/effective date. |
| U5 | Official NAICS and PSC reference sources | Classification lookup and customer-profile matching | Version reference releases independently. Preserve the opportunity's native classification values; mappings require mapping version and confidence. |

### Sources deliberately excluded from the first production release

- Scraped reseller portals, search-engine snippets, and unauthenticated third-party aggregators as intelligence authority.
- SAM entity, proprietary contractor, credit, or contact data until access rights, permitted use, freshness, and identity treatment are approved.
- A generic web model's knowledge as a procurement fact source.
- Local samples, mock records, static graphs, or prior generated reports as a live data feed.

## 3. Extraction architecture

```text
Official source registry
  -> source-specific collector
  -> immutable raw capture (Bronze)
  -> parse/validate/quarantine
  -> source-native canonical records (Silver)
  -> governed calculations and evidence links (Gold)
  -> country-scoped product APIs
  -> decision workspace, alerts, exports, and Ask FedPulse
```

Every raw capture must have: `source_id`, jurisdiction, resource/API URL, acquisition time, source-reported update time, request parameters (with secrets removed), HTTP metadata, checksum, byte size, parser version, schema version, and retention state.

Every canonical record must have: native source key, record version/snapshot identity, source URL or document ID, source timestamps, raw-capture link, field-level transformation status, country, quality status, and lineage to its product record.

No source record is overwritten. Corrections, amendments, withdrawals, and re-publications create new versions linked to the prior observation.

## 4. Quality gates

### Gate A — admission

- Official source identity, permitted use, and ownership recorded.
- Secret-free credential configuration; no keys in code, data, Git, logs, or browser payloads.
- Schema contract, source key, cadence expectation, and failure mode defined.
- Collector can distinguish `not retrieved`, `empty legitimate result`, `source unavailable`, and `parse failure`.

### Gate B — raw integrity

- Checksum, size, MIME/type, download status, and duplicate resource detection pass.
- CSV encoding/delimiter/header validation or document-format validation passes.
- Malformed, password-protected, inaccessible, oversized, or unsafe documents are quarantined with a reason—never silently skipped or represented as analysed.

### Gate C — canonical record quality

- Required native identifier, source URL/document ID where published, source timestamps, and country are present.
- Dates, currency/value, agency/buyer, supplier/recipient, classification, status, and amendment/version fields pass source-specific validation.
- Deduplication uses native keys and version history; fuzzy supplier/recipient matching is an assistive layer with confidence and review, never a destructive replacement.
- Referential checks resolve known agency, award, opportunity, and attachment links; unresolved values are retained and flagged.
- Schema drift automatically blocks promotion until the versioned mapping, backfill impact, and deterministic coverage checks pass.

### Gate D — document and semantic quality (U.S. first)

- Extracted statements retain document, page/passage, character offsets, extraction tool/version, and raw-text link.
- OCR or parser confidence below threshold is automatically quarantined or excluded, not a fact source.
- Canonicalization preserves every original statement and prevents duplicate text from inflating counts.
- Classifications carry a rule/model version, confidence, evidence coverage, and discovery/review state.
- Bid/no-bid or compliance output may state only: evidence found, evidence not found in retrieved material, unknown, or customer-profile mismatch. It must not convert missing material into a clean bill of compliance.

### Gate E — product release

- A product release manifest identifies exact input captures, coverage-through date, source cadence, row/document counts, rejected/quarantined count, transformation/calculation versions, and quality metrics.
- Freshness status is visible to the customer. A stale or partial product must show `unavailable`, `degraded`, or its limited coverage—not a fabricated successful result.
- Every material result links to its source evidence and limitation statement.
- Automated reconciliation compares source counts, changed records, records entering/leaving scope, and key aggregates against the previous release.
- Automated regression fixtures and production reconciliation must cover high-value, amended, incomplete, duplicated, and edge-case records. A release passes only when its deterministic thresholds pass; otherwise it is `degraded` or `unavailable`.

## 5. First commercial products and minimum data needed

| Market | First product | Minimum admitted evidence |
|---|---|---|
| Canada | Renewal Watch | Current CanadaBuys contract history; award context when available; source/dictionary version; clean end-date rules; department/supplier identity confidence; snapshot/change history; freshness and coverage indicators. |
| U.S. | Bid / No-Bid and Compliance Analyst | Current SAM opportunity metadata; official description and publicly retrievable attachments; amendment snapshots; source-linked requirements; customer capability profile; FAR/DFARS reference version where cited; USAspending context clearly labelled as historical award context. |

## 6. Immediate execution order

1. Create two source-registry records and country-specific canonical schemas before downloading another production dataset.
2. Rotate the exposed SAM credential, remove all hard-coded/fallback credentials, then provision a managed U.S. collector credential with least privilege.
3. Build small, repeatable collectors that write only immutable raw captures and manifests. Start with one CanadaBuys resource and one SAM search window; do not reuse the existing fabricated pipeline route.
4. Implement quality/quarantine reporting before product calculations.
5. Run repeatable production captures, validate source and canonical counts with automated reconciliation, and publish an immutable machine-generated quality report.
6. Only then build the two minimal Gold products and their country-scoped APIs.
7. Run paid design-partner validation in parallel with the pilot; the commercial question is whether the decision outcome is valuable enough to pay for, not whether a dashboard has many pages.

## 7. Completion criteria for the source foundation

The source foundation is ready when each country can produce a repeatable, independently auditable release from official sources; failures and stale data are visible; every product record is traceable; Canada and U.S. cannot mix; and a customer-facing recommendation can state its evidence, confidence, freshness, and limitations.
