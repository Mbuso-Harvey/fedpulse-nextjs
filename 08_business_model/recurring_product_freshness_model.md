# Subscription Freshness Strategy

Last Updated: 2026-06-18 20:58:16

## Core Principle

Recurring procurement intelligence products must not simply repeat the same records.

Every edition must deliver enough new, changed, newly urgent, or newly interpreted intelligence to justify continued subscription value.

## Freshness Question

Every newsletter, PDF, alert feed, dashboard, or recurring report must answer:

What changed since the last edition?

## Required Edition Sections

Each recurring product should include at least some of:

1. New records
2. Changed records
3. Newly urgent renewals
4. High-value opportunities entering the watch window
5. Departments with rising activity
6. Suppliers gaining or losing position
7. Contracts moving closer to expiry
8. New awards
9. New tenders
10. Notable anomalies
11. Market movement
12. Recommended action

## Edition Memory

The platform must track previous editions.

Each edition should store:

- edition_id
- product_name
- edition_date
- records_included
- new_records
- repeated_records
- changed_records
- freshness_score

## Freshness Score

Each product edition should have a freshness score.

Example:

- 90-100: very fresh
- 70-89: healthy
- 50-69: acceptable
- below 50: weak edition, needs added commentary or broader scope

## Anti-Churn Rule

If a recurring report contains mostly repeated records, it must add one of:

- new interpretation
- ranking changes
- urgency changes
- market movement
- comparison to previous edition
- recommendation summary

## Product-Specific Freshness

### Federal Procurement Weekly

Must include:
- new tenders
- new awards
- new renewals
- buyer activity changes

### Renewal Watch

Must include:
- contracts newly entering 30/60/90/180/365 day windows
- contracts becoming more urgent
- high-value renewals added since last edition

### Department Buyer Intelligence

Must include:
- ranking movement
- new renewal exposure
- supplier concentration changes
- category activity changes

### Supplier Market Intelligence

Must include:
- market share movement
- new awards
- renewal exposure changes
- department penetration changes

## Permanent Rule

A subscription product is not a static report.

A subscription product is a recurring intelligence service.

Its value comes from freshness, change detection, urgency, and actionable interpretation.
