# Ask FedPulse Visual Intelligence Architecture

**Status:** Proposed implementation architecture under accepted product direction  
**Date:** 2026-08-03  
**Scope:** Ask FedPulse, decision workspaces, visualization widget integration, APIs, evidence, actions, and country isolation

## 1. Purpose

This document defines how the conversational interface, procurement intelligence APIs, evidence layer, decision workspaces, and Embeddable Analytics Widget work together.

The design goal is to let a user ask a natural-language procurement question and receive a governed, interactive result containing the answer, records, visuals, evidence, confidence, and next actions—without requiring the team to build a new dashboard for every possible question.

## 2. Architectural rule

> The backend decides what is true. Ask FedPulse decides how to investigate and explain it. The visualization widget decides how approved data is rendered.

The language model and the chart widget are not authoritative data sources.

## 3. High-level architecture

```text
User
  |
  v
FedPulse Web Application
  |-- Sidebar / workspace routing
  |-- Briefing
  |-- Ask FedPulse conversation
  |-- Decision workspaces
  |-- Explore views
  |-- Evidence drawer
  |-- Actions / watchlists / alerts
  `-- Embeddable Analytics Widget host
  |
  v
FedPulse Application API / BFF
  |-- Authentication and entitlements
  |-- Conversation orchestration
  |-- Intent and country routing
  |-- Query planning
  |-- Result shaping
  |-- Visualization contract builder
  |-- Action execution
  `-- Streaming response coordination
  |
  v
Governed Intelligence APIs
  |-- Canada intelligence services
  |-- United States intelligence services
  |-- Search / retrieval
  |-- Scoring / recommendations
  |-- Evidence and provenance
  |-- Watchlists / alerts
  |-- Reports / exports
  `-- Decisions / outcomes
  |
  v
Data and Intelligence Stores
  |-- Canada source-native and canonical data
  |-- U.S. source-native and canonical data
  |-- Derived intelligence products
  |-- Evidence registry
  |-- Customer capability profiles
  |-- Conversation artifacts
  `-- Audit and outcome history
```

## 4. Responsibility boundaries

### 4.1 FedPulse web application

Responsible for:

- selected country workspace;
- navigation and user state;
- conversational transcript;
- streaming answer presentation;
- rendering tables, cards, comparison views, and charts;
- opening evidence and record detail;
- submitting explicit user actions;
- retaining active filters and result context;
- accessibility and responsive behaviour.

It must not contain hidden copies of procurement scoring logic or hard-coded headline data that contradicts the API.

### 4.2 Ask FedPulse orchestrator

Responsible for:

- determining whether the request is Canadian, U.S., or invalid in the current context;
- resolving the user's intended decision or exploration task;
- selecting approved tools and endpoints;
- translating natural language into a typed query plan;
- validating filter fields and values;
- requesting evidence-backed results;
- selecting the response presentation type;
- explaining the result without exceeding the evidence;
- preserving conversation context and active result state;
- refusing or qualifying unsupported conclusions.

The orchestrator must use an allow-listed tool registry. It must not construct arbitrary SQL or call arbitrary internal services from model-generated text.

### 4.3 Governed intelligence APIs

Responsible for:

- source-specific queries;
- canonical calculations;
- filters and sorting;
- scoring and ranking;
- recommendation rules;
- source freshness and quality;
- evidence admission;
- entitlement enforcement;
- stable response schemas;
- auditability and reproducibility.

### 4.4 Embeddable Analytics Widget

Responsible for:

- profiling the approved result dataset for visual suitability;
- rendering Vega-Lite charts;
- selecting useful default visual forms when permitted;
- applying FedPulse theme and layout constraints;
- supporting custom approved Vega-Lite specifications;
- cross-filtering and responsive display;
- exports where the user's entitlement allows them;
- emitting feedback or interaction events.

It must not:

- access unrestricted procurement stores directly;
- determine bid/no-bid recommendations;
- invent metrics or evidence;
- receive long-lived secret API keys in browser markup;
- silently aggregate fields whose semantics are unknown;
- override country or authorization boundaries.

## 5. Country isolation

Every request must carry an explicit `country_code` and `source_context`.

Example:

```json
{
  "country_code": "CA",
  "source_context": ["canadabuys_contract_history"],
  "workspace": "renewal_watch"
}
```

or:

```json
{
  "country_code": "US",
  "source_context": ["sam_gov_opportunities", "sam_gov_documents"],
  "workspace": "bid_no_bid"
}
```

The model must not infer a silent cross-country blend. If a user asks a U.S. question while in the Canada workspace, the interface should either offer to switch workspaces or require an explicit cross-country capability that has its own governed endpoint.

Country-specific prompt packages, tool registries, terminology maps, and evaluation tests are required.

## 6. Ask FedPulse request lifecycle

### Step 1: Capture context

The client sends:

- user message;
- selected country and workspace;
- organization and user identifiers;
- active result identifier, if any;
- current filters and selected records;
- conversation identifier;
- client capabilities, including whether visual rendering is available.

### Step 2: Classify intent

Initial supported intents should be narrow and typed:

- `find_records`
- `rank_records`
- `compare_records`
- `explain_record`
- `explain_score`
- `summarize_changes`
- `visualize_result`
- `open_workspace`
- `save_analysis`
- `create_watchlist`
- `create_alert`
- `generate_report`

### Step 3: Build a typed query plan

Example:

```json
{
  "intent": "rank_records",
  "country_code": "CA",
  "domain": "renewals",
  "filters": {
    "department": ["Department of National Defence"],
    "category": ["Services"],
    "minimum_value": 5000000,
    "expiry_days_max": 365
  },
  "sort": [
    {"field": "renewal_score", "direction": "desc"}
  ],
  "limit": 20,
  "requested_presentation": ["answer", "table", "chart", "evidence"]
}
```

The plan must be validated against an endpoint-specific schema before execution.

### Step 4: Execute governed tools

The orchestrator calls one or more approved services. Each service returns data plus provenance, freshness, quality, and limitations.

### Step 5: Build the intelligence response

The BFF composes a stable response contract rather than allowing the model to emit arbitrary UI markup.

### Step 6: Render synchronized answer and view

The client displays the narrative answer and a structured result surface. Subsequent conversational filters operate on the active result or issue a new governed query.

### Step 7: Record audit and feedback

Store:

- user request;
- query plan;
- endpoints and versions used;
- source coverage timestamp;
- result identifier and hash;
- evidence identifiers;
- model version;
- user actions and feedback;
- latency and error information.

## 7. Canonical intelligence response contract

A response should be shaped approximately as follows:

```json
{
  "response_id": "resp_...",
  "conversation_id": "conv_...",
  "country_code": "CA",
  "workspace": "renewal_watch",
  "answer": {
    "headline": "Twelve DND service contracts meet the selected renewal criteria.",
    "summary": "The top three represent approximately $184M and all expire within twelve months.",
    "recommendation": "Prioritize account research for the three highest-ranked records.",
    "limitations": []
  },
  "result": {
    "result_id": "result_...",
    "kind": "ranked_records",
    "schema_version": "1.0",
    "columns": [],
    "rows": [],
    "total_rows": 12,
    "aggregates": {}
  },
  "visualization": {
    "mode": "auto",
    "dataset": [],
    "approved_fields": [],
    "layout_mode": "grid",
    "chart_layout": [],
    "vega_lite_spec": null,
    "export_allowed": true
  },
  "evidence": {
    "coverage": 0.94,
    "confidence": 0.87,
    "items": []
  },
  "freshness": {
    "retrieved_at": "2026-08-03T22:00:00Z",
    "coverage_through": "2026-08-01",
    "pipeline_status": "healthy"
  },
  "actions": [
    {"type": "open_workspace", "label": "Open Renewal Watch"},
    {"type": "save_analysis", "label": "Save analysis"},
    {"type": "create_watchlist", "label": "Watch these contracts"}
  ]
}
```

The narrative may be streamed first, but the final structured payload must be retained as the authoritative response artifact.

## 8. Visualization contract

### 8.1 Rendering modes

The API may choose one of three modes:

1. **No visualization** — for simple factual answers or unsuitable data.
2. **Auto visualization** — pass an approved, well-shaped dataset to the widget and allow its profiling and scoring engine to select charts.
3. **Specified visualization** — pass a governed Vega-Lite specification or explicit chart layout when the procurement meaning requires a particular representation.

### 8.2 When auto mode is appropriate

Use auto mode for:

- trends over time;
- categorical value comparisons;
- distributions;
- two-metric relationships;
- compact exploratory result sets;
- result previews where the field semantics are included in the API metadata.

### 8.3 When a specified visualization is required

Use a specified chart or dedicated React view for:

- renewal timelines;
- deadline and amendment impact sequences;
- compliance matrices;
- evidence coverage displays;
- risk or confidence components;
- graph relationships;
- charts requiring business-specific thresholds;
- visualizations where an automatic sum would be misleading;
- mixed units or pre-calculated percentages.

### 8.4 Approved widget integration

For the first implementation, the FedPulse client should import the widget bundle and pass data as a property:

```javascript
const widget = document.querySelector('chart-widget');
widget.data = response.visualization.dataset;
widget.setAttribute('theme', currentTheme);
widget.setAttribute('layout-mode', response.visualization.layout_mode || 'grid');
```

If the API supplies an approved specification:

```javascript
widget.setAttribute('spec', JSON.stringify(response.visualization.vega_lite_spec));
```

If the API supplies an approved layout:

```javascript
widget.setAttribute('chart-layout', JSON.stringify(response.visualization.chart_layout));
```

The host should listen for `dashboard-feedback` and translate it into the FedPulse analytics and outcome model.

### 8.5 Widget hardening required before production

The current widget is a valuable prototype but requires a production integration pass:

- package and version it through a controlled artifact registry or monorepo package;
- replace mock remote fetching and static test credentials;
- add typed input and output contracts;
- add dataset-size limits and sampling rules;
- prevent unsafe or unsupported Vega-Lite properties;
- add field-semantic metadata and aggregation controls;
- add accessibility tests;
- add deterministic snapshot and browser tests;
- add error events rather than console-only failures;
- add export entitlement hooks;
- add interaction events for selected marks and filters;
- add localization and currency context;
- prevent automatic currency formatting based only on broad column-name regexes;
- expose a supported API for clearing and updating filters;
- document browser support and bundle size.

## 9. Evidence architecture

Evidence is not an optional citation list appended after generation. It is part of every intelligence object.

### 9.1 Evidence object

```json
{
  "evidence_id": "ev_...",
  "source_system": "canadabuys_contract_history",
  "source_record_id": "...",
  "source_url": "...",
  "document_id": null,
  "page": null,
  "passage": null,
  "retrieved_at": "...",
  "quality_status": "gold",
  "admission_status": "admitted",
  "supports": ["claim_1", "score_component_2"]
}
```

### 9.2 Claim ledger

Material generated claims should be represented in a claim ledger with support status:

- `SUPPORTED`
- `PARTIALLY_SUPPORTED`
- `INFERRED`
- `UNSUPPORTED_CONCLUSION`

The user-facing answer should not present an unsupported conclusion as fact.

### 9.3 Calculation evidence

Derived metrics require:

- input evidence identifiers;
- calculation name and version;
- parameters;
- output value;
- rounding and display rules;
- known exclusions.

## 10. Public API and internal API separation

The public API should expose stable, commercially useful derived intelligence without exposing the full proprietary acquisition and transformation pipeline.

### Public candidates

- ranked renewal candidates;
- department and supplier intelligence summaries;
- opportunity fit results;
- extracted requirement objects;
- compliance findings;
- amendment impact summaries;
- evidence references allowed by source terms;
- saved result and alert integrations.

### Internal-only candidates

- raw source dumps;
- internal matching dictionaries;
- unreleased scoring components;
- manual-review queues;
- source credentials;
- complete transformation lineage internals;
- privileged customer capability data;
- model-control prompts and guardrails.

## 11. Security and entitlements

The current fail-open development patterns must not reach production.

Required controls:

- deny by default when authentication or entitlement configuration is absent;
- enforce authorization in the API, not only the client;
- separate service-role credentials from public keys;
- use scoped API keys and rate limits for developer access;
- protect customer capability profiles as tenant data;
- filter exports by entitlement;
- sign or authorize report and artifact downloads;
- audit watchlist, alert, report, and decision actions;
- prevent prompt content from expanding a user's data scope;
- validate all model-produced tool arguments against typed schemas.

## 12. Recommended initial query capabilities

### Canada MVP

Ask FedPulse Canada should initially support:

1. Find and rank renewal candidates.
2. Filter by department, supplier, category, value, expiry window, and quality status.
3. Explain a renewal score using admitted components.
4. Compare selected contracts, departments, or suppliers.
5. Visualize selected result sets.
6. Open records in Renewal Watch.
7. Save an analysis and create a watchlist.

### U.S. first release

Ask FedPulse U.S. should initially support:

1. Find matching SAM.gov opportunities.
2. Summarize an opportunity and its documents.
3. Extract and review mandatory requirements.
4. Compare requirements to a customer capability profile.
5. Explain bid/no-bid findings.
6. Summarize material amendment changes.
7. Create deadline and amendment alerts.

## 13. Observability and evaluation

Track separately:

- intent-classification accuracy;
- query-plan validation failures;
- tool and endpoint errors;
- evidence coverage;
- unsupported-claim rate;
- answer-to-view consistency;
- visualization rendering failures;
- user corrections;
- watchlist and alert conversion;
- time from question to action;
- API latency and cost;
- outcome quality where known.

Evaluation sets must include Canada/U.S. boundary tests, authorization tests, numeric-display consistency, citation correctness, ambiguous questions, missing-data cases, and attempts to induce unsupported analysis.

## 14. Architectural acceptance criteria

The architecture is correctly implemented when:

- the same governed result can be consumed by the FedPulse UI and an API client;
- a chat query produces a typed, auditable query plan;
- every material answer carries evidence and freshness metadata;
- a follow-up filter updates the active result deterministically;
- the visualization widget renders only approved fields and data;
- no long-lived secret is passed to the browser widget;
- country context cannot be silently mixed;
- users can move from answer to workspace, evidence, watchlist, alert, or report;
- unsupported conclusions are explicitly marked rather than concealed;
- the system denies access when auth or entitlement dependencies are unavailable.
