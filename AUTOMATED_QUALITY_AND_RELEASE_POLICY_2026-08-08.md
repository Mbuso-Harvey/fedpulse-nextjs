# FedPulse Automated Quality and Release Policy

**Effective:** 2026-08-08  
**Authority:** Product-owner direction, which supersedes the proposed manual-review language in the earlier source plan.

FedPulse is a commercial subscription business. Its data and intelligence releases must be repeatable, observable, and fully automated; no human record-review or release-approval queue is an operating dependency.

## Lifecycle

`captured → validated → canonical → normalized → release_candidate → released | degraded | unavailable`

Each transition is decided by deterministic checks and recorded in immutable manifests. Quarantined, unknown, stale, low-confidence, cross-country, malformed, or unresolved records cannot be promoted.

## Required automated controls

- Official-source allow-list, secret-free manifests, checksum, byte-size, content-type, and source-schema validation.
- Required source-native IDs, dates, status, jurisdiction, provenance, and mapping-coverage checks.
- Native-key versioning, amendment handling, deduplication, and reconciliation against the prior release.
- Freshness SLA, coverage-through date, rejection/unknown/duplicate-rate thresholds, and country-isolation checks.
- Fixture, regression, and edge-case test corpus; schema drift automatically blocks promotion.
- Customer-visible source evidence, freshness, confidence, coverage, and limitations.

If a required control fails, the affected product is automatically marked `degraded` or `unavailable`; it must never emit a fabricated successful result.

## Product boundary

FedPulse may automate evidence-backed intelligence and recommendations. It does not autonomously submit bids, set final customer prices, authorize partnerships, or send binding customer proposals. Those are outside the product boundary, not data-release steps.
