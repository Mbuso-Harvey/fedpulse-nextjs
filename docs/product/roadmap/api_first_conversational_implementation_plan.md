# API-First Conversational Procurement Intelligence — Implementation Plan

**Status:** Active implementation plan  
**Date:** 2026-08-03  
**Depends on:**

- `docs/product/strategy/api_first_conversational_procurement_intelligence.md`
- `docs/architecture/product/ask_fedpulse_visual_intelligence_architecture.md`

## 1. Objective

Implement FedPulse as an API-first procurement intelligence platform with:

- separate Canada and U.S. product workspaces;
- one shared governed intelligence core;
- Ask FedPulse as a conversational control surface;
- decision-first pages rather than an expanding collection of generic dashboards;
- the Embeddable Analytics Widget for governed, dynamic visualizations;
- public APIs for selected derived intelligence products;
- evidence, freshness, confidence, authorization, and outcome tracking built into the product.

The plan deliberately prioritizes one complete customer decision over feature breadth.

## 2. Current constraints that must shape execution

The repository contains substantial historical intelligence work, but the production path is not yet fully reproducible.

Known constraints include:

- the Canada Renewal Watch API is configured around local Gold CSV artifacts;
- the local fallback paths are Windows-specific;
- the connected database migration is incomplete or not populated for the active renewal product;
- data acquisition and transformation scripts are not fully represented in the application repository;
- authentication and billing contain development or mock behaviour;
- parts of the user interface contain hard-coded statistics and examples;
- current AI analysis is not consistently grounded in admitted procurement evidence;
- Canada and U.S. concepts are mixed across historical product experiments;
- the Embeddable Analytics Widget is a capable prototype but not yet a controlled production dependency.

No launch claim should be based on documentation status alone. Each phase below has an explicit release gate.

## 3. Delivery principles

1. **API contract before page expansion.**
2. **One decision product at a time.**
3. **No hard-coded production intelligence in the client.**
4. **Deny by default when auth, data, or entitlements are unavailable.**
5. **Every material conclusion carries evidence and freshness.**
6. **Canada and U.S. tools, schemas, and prompts remain separate.**
7. **Use the visualization widget to avoid bespoke chart engineering, not to bypass domain logic.**
8. **Preserve source-native data and derived-intelligence lineage.**
9. **A feature is complete only when tested through the real deployment path.**
10. **Stop adding breadth when the active release gate is not satisfied.**

## 4. Target release sequence

```text
Foundation truth and security
        |
        v
Canada Renewal Intelligence API
        |
        v
Canada Renewal Watch decision workspace
        |
        v
Ask FedPulse Canada + visual intelligence
        |
        v
Alerts, saved analysis, and public Canada API
        |
        v
U.S. opportunity-document intelligence API
        |
        v
U.S. Bid / No-Bid and Compliance workspace
        |
        v
Ask FedPulse U.S. + public U.S. API
```

## 5. Phase 0 — Establish the authoritative baseline

### Goal

Remove ambiguity about sources, counts, data freshness, runtime dependencies, and current product truth before building new user-facing capabilities.

### Work

#### 5.1 Source and product registry

Create a machine-readable registry for each product containing:

- product identifier;
- country code;
- source datasets;
- source owner and official URL;
- date coverage;
- expected refresh cadence;
- latest successful ingestion;
- raw, canonical, mastered, and product tables;
- quality status rules;
- API endpoints using the product;
- user-facing pages and claims;
- owner and runbook.

#### 5.2 Reconcile Canada product counts

Reconcile historical values including 6,926 and 4,050 renewal candidates. Select one versioned, reproducible product dataset and document:

- inclusion rules;
- deduplication rules;
- value rules;
- expiry-window logic;
- supplier-master version;
- quality-status policy;
- generated-at and coverage-through dates.

#### 5.3 Verify current source artifacts

Recover or locate the authoritative CanadaBuys data, scripts, source registries, Gold outputs, and refresh procedures. Do not infer that historical documentation alone is sufficient for regeneration.

#### 5.4 Establish database target

Choose and document the production data store for FedPulse application queries. Load the selected Canada product tables and verify record counts and checksums.

#### 5.5 Remove misleading claims

Until refresh and database status are proven, replace unsupported “live” or “real-time” language with explicit source and coverage timestamps.

#### 5.6 Create a release manifest

Every release must record:

- application commit;
- API version;
- product-data version;
- pipeline version;
- database migration version;
- source coverage date;
- environment;
- validation results.

### Gate 0

Proceed only when:

- the selected Canada Renewal Watch dataset is reproducible;
- production storage contains the expected records;
- counts are reconciled;
- freshness is exposed;
- source and product registries exist;
- no customer-facing page relies on unexplained historical counts.

## 6. Phase 1 — Secure, versioned API foundation

### Goal

Make the API the authoritative product layer and eliminate fail-open or mock production behaviour.

### Work

#### 6.1 API namespaces

Introduce explicit routes:

```text
/api/v1/ca/...
/api/v1/us/...
/api/v1/core/...
```

Maintain compatibility aliases only when needed and with a deprecation plan.

#### 6.2 Authentication and authorization

- Fail closed when Supabase or auth dependencies are absent.
- Validate JWTs server-side.
- Implement organization and tenant scope.
- Add plan entitlements and endpoint-level authorization.
- Remove trial-user fallbacks from production mode.
- Separate public, authenticated-app, service-role, and administrative credentials.

#### 6.3 Standard response envelope

All intelligence endpoints should return:

- data;
- pagination;
- applied filters;
- source context;
- freshness;
- quality status;
- evidence references;
- calculation and product versions;
- limitations;
- request identifier.

#### 6.4 Typed schemas

Generate or maintain OpenAPI schemas for filters, sorting, result records, evidence, errors, and actions. Create client types from the contract rather than hand-maintaining divergent interfaces.

#### 6.5 Errors and observability

Add structured errors, request correlation, endpoint metrics, audit logging, and data-version logging.

#### 6.6 Billing alignment

Align frontend and backend checkout contracts. Remove mock checkout URLs and hard-coded subscription state from production behaviour.

### Gate 1

Proceed only when:

- unauthenticated and unauthorized access tests pass;
- the API returns versioned source and freshness metadata;
- frontend and API contracts match;
- deployment does not depend on Windows file paths;
- billing does not silently simulate success;
- OpenAPI validation and contract tests pass.

## 7. Phase 2 — FedPulse Canada Renewal Watch as the reference decision product

### Goal

Deliver one end-to-end decision workspace that demonstrates the commercial model and becomes the reference client for the API.

### Primary question

> Which Canadian federal contracts are likely to renew, and where should this customer focus business-development effort?

### Work

#### 7.1 Renewal intelligence endpoint

Implement a governed endpoint supporting:

- department;
- supplier or incumbent;
- category;
- contract value;
- expiry window;
- renewal score and components;
- quality status;
- new or changed since a prior product version;
- pagination and stable sorting;
- evidence and source links.

#### 7.2 Decision workspace

Renewal Watch should contain:

- a prioritized result list;
- transparent score explanation;
- contract and incumbent context;
- buyer history;
- recommended timing and next action;
- evidence drawer;
- saved views and watchlist actions;
- explicit source, freshness, and quality indicators.

Do not add broad dashboard modules unless they directly support the renewal decision.

#### 7.3 Briefing integration

The Canada briefing should surface only meaningful changes, such as:

- high-priority contracts entering a renewal window;
- watched contracts changing;
- relevant new tender or award activity;
- target departments with material buying changes;
- watched supplier awards.

#### 7.4 Customer profile foundation

Implement the minimum profile needed to rank renewal records for a customer:

- target categories;
- target departments;
- value range;
- incumbent exclusions or competitors;
- geographic or delivery constraints where available.

### Gate 2

Proceed only when:

- all displayed records come from the production API;
- filters materially affect the API query;
- the score explanation matches the stored calculation;
- every material claim exposes evidence;
- no hard-coded headline statistics remain in the production path;
- a user can save or watch a result;
- desktop and mobile acceptance tests pass.

## 8. Phase 3 — Integrate the Embeddable Analytics Widget

### Goal

Allow decision workspaces and Ask FedPulse to produce useful charts and visual exploration without hand-building a dashboard for each question.

### Work

#### 8.1 Package strategy

Move or publish the widget as a controlled dependency, for example:

```text
platform/packages/embeddable-analytics-widget
```

or a versioned private/public package. Record source version and license obligations.

#### 8.2 Typed wrapper

Create a React/Next.js host component that:

- loads the Web Component safely;
- maps theme and responsive mode;
- passes data as a property;
- applies approved specs and layouts;
- handles loading, empty, and error states;
- listens for interaction and feedback events;
- enforces maximum rows and fields;
- gates exports by entitlement;
- exposes accessibility labels and fallback tables.

#### 8.3 Visualization metadata

Extend API results with field semantics:

- data type;
- metric or dimension role;
- allowed aggregation;
- currency and locale;
- unit;
- display label;
- sensitivity;
- visualization eligibility.

Do not rely only on column-name regexes to infer currency or business meaning.

#### 8.4 Initial approved uses

Use the widget for:

- renewal value by department;
- expiry distribution;
- renewal candidates over time;
- supplier or incumbent concentration;
- selected-record comparisons;
- Ask FedPulse result visualizations.

Use dedicated product views for compliance matrices, evidence ledgers, amendment diffs, and other domain-specific structures.

#### 8.5 Security

Do not place production long-lived API keys in `api-key` attributes. The application or BFF should retrieve authorized data and pass the approved result to the widget.

### Gate 3

Proceed only when:

- the widget is versioned and reproducible;
- it renders real API result sets;
- unsupported fields cannot be visualized;
- export entitlements are enforced;
- interaction events are observable;
- mobile, accessibility, and error tests pass;
- charts do not silently apply invalid aggregations.

## 9. Phase 4 — Ask FedPulse Canada

### Goal

Make natural language a reliable way to query, explain, visualize, and act on the Canada intelligence product.

### Initial supported capabilities

1. Find renewal candidates.
2. Apply and revise filters.
3. Rank records using governed scores.
4. Compare selected contracts, departments, or suppliers.
5. Explain why a record is ranked.
6. Visualize a result set.
7. Open the result in Renewal Watch.
8. Save the analysis.
9. Create a watchlist.
10. Create an alert.

### Work

#### 9.1 Tool registry

Create allow-listed, typed tools for the Canada endpoints. Model-generated arguments must pass schema validation.

#### 9.2 Conversation result state

Store a result identifier and query plan so follow-up requests update the existing result deterministically.

#### 9.3 Structured streaming

Stream explanatory text where useful, but complete every response with the canonical intelligence response object.

#### 9.4 Evidence-aware generation

The generator receives admitted claims and evidence, not unrestricted raw source data. Unsupported conclusions must be marked.

#### 9.5 Suggested prompts

The initial empty state should suggest high-value questions based on the current workspace and user profile rather than display a generic blank chat.

#### 9.6 Evaluation

Build a Canada evaluation suite covering:

- numeric consistency;
- source citation correctness;
- ambiguous departments or suppliers;
- unsupported causal claims;
- filter follow-ups;
- authorization boundaries;
- attempts to switch into U.S. data implicitly;
- empty and stale data;
- evidence coverage.

### Gate 4

Proceed only when:

- chat results match direct API queries;
- follow-up filters update the active result correctly;
- evidence links support the answer;
- fake or fallback sources are impossible;
- unsupported conclusions are surfaced;
- no prompt can broaden tenant or country scope;
- chart output uses the governed visualization contract.

## 10. Phase 5 — Alerts, reports, and public Canada API

### Goal

Turn the intelligence into a repeatable workflow and developer product.

### Work

- watchlists for contracts, departments, suppliers, and categories;
- configurable renewal-window and material-change alerts;
- email and later Slack delivery;
- report generation from saved result artifacts;
- scoped developer API keys;
- rate limits, usage metering, and plan entitlements;
- API documentation and examples;
- sandbox or sample datasets that do not expose proprietary raw assets;
- webhook or delivery design when supported;
- usage analytics and customer-outcome capture.

### Gate 5

Proceed only when:

- alerts are generated from versioned product changes;
- users are not repeatedly notified about unchanged records;
- reports reproduce the saved data and evidence version;
- public APIs expose derived intelligence without leaking restricted internals;
- keys, quotas, logs, and revocation are operational.

## 11. Phase 6 — FedPulse United States foundation

### Goal

Build the first production U.S. product around one narrow decision rather than attempting to launch the entire historical knowledge-graph and agent suite.

### Primary question

> Should this company pursue this SAM.gov opportunity, and what are the major compliance risks?

### Work

#### 11.1 U.S. ingestion and document lifecycle

Implement reliable:

- SAM.gov opportunity ingestion;
- pagination and incremental refresh;
- attachment discovery and retrieval;
- amendment versioning;
- document parsing;
- source lineage;
- deadlines and status changes;
- quality and failure queues.

#### 11.2 Requirement intelligence

Produce versioned requirement objects with:

- mandatory or optional classification;
- source document and page;
- submission artifact;
- due date;
- certification, clearance, personnel, experience, pricing, and formatting attributes;
- extraction confidence;
- review status.

#### 11.3 Customer capability matching

Match admitted requirements against a tenant-specific capability profile without implying that missing profile data proves non-compliance.

#### 11.4 Bid/no-bid contract

Return:

- recommendation state;
- supporting and opposing factors;
- compliance blockers;
- missing information;
- evidence coverage;
- conditions and required actions;
- explicit unsupported dimensions.

#### 11.5 Amendment impact

Compare document versions and identify material changes to deadline, scope, qualifications, submissions, pricing, and evaluation.

### Gate 6

Proceed only when:

- opportunity and document refresh is repeatable;
- amendments are versioned;
- requirements link to exact source evidence;
- capability matching distinguishes unknown from missing;
- bid/no-bid conclusions are bounded by available evidence;
- the U.S. product cannot access Canada scoring logic accidentally.

## 12. Phase 7 — Ask FedPulse U.S. and public U.S. API

### Goal

Expose opportunity and compliance intelligence conversationally and through selected APIs.

### Initial Ask FedPulse U.S. capabilities

- find matching opportunities;
- summarize a solicitation;
- list mandatory requirements;
- identify likely compliance blockers;
- compare requirements to the customer profile;
- explain bid/no-bid factors;
- summarize amendments;
- create deadline and amendment alerts;
- generate a compliance report.

### Public API candidates

```text
/api/v1/us/opportunities
/api/v1/us/opportunities/{id}/requirements
/api/v1/us/opportunities/{id}/amendments
/api/v1/us/opportunities/{id}/bid-analysis
/api/v1/us/opportunities/{id}/compliance-analysis
```

### Gate 7

Proceed only when the same evidence, authorization, result-state, and observability standards used in Canada are satisfied for the U.S. product.

## 13. Cross-cutting engineering backlog

### Required early

- CI for frontend and API;
- linting, type checking, tests, dependency audit, and build validation;
- production environment validation;
- database migrations under version control;
- secrets and configuration validation;
- structured logging and error monitoring;
- API schema generation;
- release manifests;
- synthetic and real-data test fixtures;
- backup and recovery procedures.

### Required before external launch

- tenant isolation tests;
- rate limiting;
- audit retention policy;
- data-source terms and attribution review;
- accessibility acceptance;
- privacy policy and customer-data handling;
- incident response and rollback plan;
- billing and entitlement reconciliation;
- API documentation and support workflow.

## 14. Proposed implementation epics

1. `CORE-TRUTH` — source registry, product registry, data reconciliation, release manifest.
2. `CORE-DATA` — production database migration and refresh pipeline.
3. `CORE-AUTH` — fail-closed auth, tenant scope, entitlements.
4. `CA-RENEWAL-API` — versioned Canada renewal intelligence endpoints.
5. `CA-RENEWAL-UX` — decision-first Renewal Watch and briefing.
6. `CORE-VISUAL` — widget packaging, wrapper, visualization contract.
7. `CA-ASK` — grounded Ask FedPulse Canada.
8. `CORE-WORKFLOW` — watchlists, alerts, reports, decisions, outcomes.
9. `CORE-DEVELOPER` — API keys, metering, docs, public API.
10. `US-INGESTION` — SAM.gov opportunities, documents, amendments.
11. `US-REQUIREMENTS` — requirement and compliance intelligence.
12. `US-BID` — bid/no-bid decision product.
13. `US-ASK` — grounded Ask FedPulse U.S.

## 15. Immediate next implementation milestone

The next milestone is not a visual redesign and not another intelligence module.

It is:

> **A reproducible, secure, API-backed Canada Renewal Watch product with reconciled data, explicit freshness, admitted evidence, and no hard-coded customer-facing intelligence.**

Once that gate passes, integrate the visualization widget and Ask FedPulse Canada on top of the same API contract.

## 16. Stop conditions

Pause feature expansion when any of the following is true:

- the active product dataset cannot be reproduced;
- source freshness is unknown;
- UI and API disagree;
- authentication fails open;
- a score cannot be explained;
- an answer cannot identify supporting evidence;
- country context is ambiguous;
- a chart applies an invalid aggregation;
- a new page does not correspond to a clear customer decision;
- the public API would expose raw assets without a commercial or legal decision.

These conditions are release blockers, not deferred polish.
