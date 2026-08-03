# Current State

**Last updated:** 2026-08-03  
**Status:** Strategic reset accepted; implementation baseline being established

## Current product direction

FedPulse is now defined as an **API-first conversational procurement intelligence platform** rather than a collection of broad dashboards.

The accepted commercial structure is:

- **FedPulse Canada** for CanadaBuys-derived contract, supplier, department, incumbent, and renewal intelligence.
- **FedPulse United States** for SAM.gov-derived opportunity, solicitation, requirement, compliance, amendment, and bid/no-bid intelligence.
- One shared governed intelligence core, API platform, evidence model, authentication and billing layer, visualization contract, alerts, reports, and outcome tracking.

The primary application experience will combine:

- a mission-control briefing;
- **Ask FedPulse**, a ChatGPT-style conversational intelligence workspace;
- focused decision pages such as Renewal Watch, Target Accounts, Opportunity Watch, Bid / No-Bid, Compliance Review, and Amendment Impact;
- exploration pages for underlying governed records;
- the Embeddable Analytics Widget for dynamic charts and visual analysis;
- evidence, confidence, freshness, saved analysis, watchlists, alerts, reports, and actions.

Canonical direction:

- `docs/product/strategy/api_first_conversational_procurement_intelligence.md`
- `docs/architecture/product/ask_fedpulse_visual_intelligence_architecture.md`
- `docs/product/roadmap/api_first_conversational_implementation_plan.md`

## Data-source position

The project contains two real procurement tracks:

### Canada

CanadaBuys tender notices, award notices, and contract history were used to build the Canadian warehouse, supplier and department intelligence, and Renewal Watch products.

The current application backend is configured around Canadian Gold outputs such as:

- `gold_renewal_candidates_supplier_mastered_v2.csv`
- `department_profiles_v1.csv`
- `supplier_market_position_v1.csv`

### United States

SAM.gov opportunity and solicitation documents were used for later requirement extraction, semantic intelligence, knowledge-graph, compliance, bid-analysis, and agent prototypes.

The Canada and U.S. products are not yet unified into one production data system and must remain explicitly separated in schemas, APIs, prompts, terminology, and customer claims.

## Historical product state

Historical Wave 15 documentation reported:

- Next.js frontend and FastAPI backend;
- Renewal Watch, department, supplier, search, and recommendation pages;
- 6,926 Intelligence Layer V1 renewal candidates;
- later Gold documentation referencing approximately 4,050 renewal candidates;
- authentication, database migration, Stripe, and handoff work still incomplete or deferred.

These historical counts are not yet treated as one reconciled production release. They must be tied to explicit product-data versions, generation rules, source coverage, and refresh timestamps before external claims are made.

## Current technical reality

The repository provides a useful MVP shell and extensive historical documentation, but the production path still requires hardening.

Known blockers include:

- production data migration and population are not yet proven for the active Renewal Watch product;
- local API fallback paths point to `C:\ProcurementIntelligence` and are not a portable production source;
- acquisition and transformation assets are not fully recoverable from the application repository alone;
- authentication contains development fallbacks and must fail closed in production;
- billing contracts and subscription behaviour require alignment and removal of mocks;
- some UI statistics and examples are hard-coded;
- Ask FedPulse and AI analysis are not yet consistently evidence-grounded;
- Canada and U.S. contexts are mixed across some historical experiments;
- automated tests, CI, release manifests, and reproducibility controls need expansion.

## Embeddable Analytics Widget

The Google Drive `embeddable-analytics-widget` project has been reviewed and is approved as a candidate shared visualization layer.

It currently provides:

- a framework-neutral `<chart-widget>` Web Component;
- Shadow DOM isolation;
- Vega-Lite rendering;
- JSON data input and remote-fetch placeholders;
- automatic column profiling and scored chart selection;
- KPI, time-series, scatter, breakdown, histogram, heatmap, and table output;
- desktop cross-filtering and mobile grid layouts;
- custom Vega-Lite specs, chart configuration, and layout overrides;
- PNG, SVG, CSV, and JSON exports;
- dashboard feedback events.

It must be integrated as a controlled, versioned rendering dependency. The FedPulse backend remains responsible for authorization, procurement semantics, calculations, ranking, evidence, and permitted data scope.

## Active milestone

The active milestone is:

> Build a reproducible, secure, API-backed Canada Renewal Watch product with reconciled data, explicit freshness, admitted evidence, and no hard-coded customer-facing intelligence.

After that release gate passes:

1. integrate the visualization widget;
2. implement grounded Ask FedPulse Canada;
3. add watchlists, alerts, reports, and selected public APIs;
4. productionize the U.S. Bid / No-Bid and Compliance product on a separate source-specific path.

## Immediate priorities

### P0 — Truth and reproducibility

- recover the authoritative Canada data and pipeline assets;
- reconcile renewal counts and rules;
- establish source and product registries;
- populate and validate the production database;
- expose coverage and freshness;
- create a release manifest.

### P0 — Security and API contract

- introduce `/api/v1/ca`, `/api/v1/us`, and `/api/v1/core` boundaries;
- fail closed for authentication and entitlements;
- align frontend and backend contracts;
- remove production mock behaviour;
- add typed schemas, contract tests, and observability.

### P1 — Reference customer decision

- complete Canada Renewal Watch as the first decision-first product;
- make every displayed score and claim explainable and evidence-backed;
- add saved results and watchlists;
- remove unnecessary dashboard breadth.

### P1 — Conversational and visual layer

- package the analytics widget as a controlled dependency;
- create the governed visualization response contract;
- implement Ask FedPulse Canada with typed tool calls and synchronized result views.

## Governing rule

When historical documents, UI copy, or prototypes conflict with the accepted strategy, the new API-first conversational product direction governs future implementation unless explicitly superseded.
