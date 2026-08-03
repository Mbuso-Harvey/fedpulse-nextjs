# FedPulse Product Direction: API-First Conversational Procurement Intelligence

**Status:** Accepted strategic direction  
**Decision date:** 2026-08-03  
**Owner:** Mbuso Harvey  
**Applies to:** FedPulse Canada, FedPulse United States, Ask FedPulse, public APIs, and future procurement-intelligence products

## 1. Executive decision

FedPulse will be built as an **API-first procurement intelligence platform** with two commercial product experiences:

1. **FedPulse Canada** — Canadian federal contract, supplier, department, incumbent, and renewal intelligence derived from CanadaBuys data.
2. **FedPulse United States** — U.S. federal opportunity, requirement, compliance, amendment, and bid/no-bid intelligence derived primarily from SAM.gov opportunity documents and related official sources.

The two products will remain commercially and semantically distinct, but they will share one governed intelligence core, one API platform, one evidence model, one authentication and billing layer, and one reusable user-experience shell.

The principal user interface will combine:

- a ChatGPT-style **Ask FedPulse** conversational workspace;
- a collapsible sidebar containing focused decision workspaces and exploration pages;
- a briefing page that surfaces what deserves attention now;
- interactive result views, tables, charts, and visual narratives generated from governed API responses;
- evidence, confidence, freshness, and lineage controls;
- saved analyses, watchlists, alerts, reports, actions, and outcome tracking.

FedPulse is **not** a dashboard builder and **not** a generic chatbot. It is a procurement intelligence engine whose capabilities are available through APIs and exposed through a conversational, decision-first application.

## 2. Product definition

> FedPulse identifies the procurement decisions that need attention, recommends what action to take, and provides the official evidence behind every conclusion.

The platform must help users answer questions such as:

### Canada

- Which contracts are likely to renew?
- Which departments should we target?
- Which incumbents are vulnerable?
- What has changed in a buyer's behaviour?
- Which suppliers are winning in our market?
- What opportunities should our business-development team prepare for now?

### United States

- Which SAM.gov opportunities best fit our company?
- Should we bid or decline?
- What mandatory requirements could disqualify us?
- What changed in the latest amendment?
- Which capabilities, certifications, clearances, partners, or past-performance evidence are missing?
- What actions must be completed before the response deadline?

## 3. Locked product principles

These principles govern future implementation. They should not be reversed by coding agents or individual feature work without an explicit new strategic decision.

### 3.1 Intelligence engine, not chatbot

Ask FedPulse is a control surface for governed procurement intelligence. The language model may interpret requests, plan queries, explain results, and compose views, but it must not invent procurement facts, unsupported win probabilities, fake sources, or untraceable recommendations.

### 3.2 API first

Every meaningful capability must exist behind a documented, versioned API contract before or alongside its user-interface implementation.

The first-class product surfaces are:

- authenticated application APIs;
- public developer APIs where commercially appropriate;
- alerts and scheduled delivery;
- embeddable or exportable intelligence artifacts;
- the FedPulse web application as the reference client.

The web interface must consume the same governed services that customers can eventually access through the API. Business logic must not live only in React components or prompts.

### 3.3 Decision pages, not endless dashboards

FedPulse will not attempt to create a bespoke dashboard for every dataset or metric. Pages exist to help a user complete a recurring procurement decision or investigate the evidence behind one.

Good page names include:

- Renewal Watch
- Target Accounts
- Incumbent Opportunities
- Competitor Watch
- Opportunity Watch
- Bid / No-Bid
- Compliance Review
- Amendment Impact

Database-table names and generic dashboard labels are not customer-facing product concepts.

### 3.4 Chat plus structured workspaces

Chat and navigation solve different problems:

- **Ask FedPulse** supports flexible questions, comparisons, explanations, and one-off investigations.
- **Decision workspaces** support repeatable workflows, governed definitions, filters, review, and action.
- **Explore pages** expose underlying contracts, opportunities, departments, agencies, suppliers, requirements, and categories for evidence-driven discovery.

A chat-only interface is insufficient because users do not always know what to ask and cannot easily repeat or audit a workflow. A dashboard-only interface is insufficient because fixed pages cannot anticipate every procurement question.

### 3.5 Chat produces views and actions, not only prose

A successful Ask FedPulse response may include:

- a concise answer;
- ranked records;
- a filterable table;
- an interactive chart or visual composition;
- a comparison view;
- an evidence drawer;
- confidence and coverage information;
- recommended next actions;
- links into the appropriate decision workspace;
- buttons to save, watch, alert, export, or assign the result.

The conversation and the active result view must remain synchronized. A follow-up such as “remove anything under $5 million” should update the result set rather than merely produce another paragraph.

### 3.6 Evidence first

Every material claim, score, ranking, or recommendation must be traceable to admitted evidence.

At minimum, the response contract must support:

- source system;
- source record identifier;
- official source URL or document identifier;
- source page or passage where applicable;
- retrieval timestamp;
- coverage-through date;
- pipeline version;
- quality status;
- calculation or rule version;
- model version when AI is used;
- confidence and evidence coverage;
- limitations and unsupported conclusions.

### 3.7 Country products remain separate

CanadaBuys and SAM.gov are not interchangeable datasets.

FedPulse Canada and FedPulse United States must have separate:

- source registries;
- native schemas;
- terminology;
- filters;
- scoring logic;
- prompts and retrieval tools;
- customer workflows;
- product claims;
- freshness and coverage indicators.

A shared semantic layer may map concepts such as buyer, supplier, opportunity, award, contract, requirement, category, and renewal, but source-native fields must be preserved and no cross-country comparison may be implied unless the mapping is defensible.

### 3.8 Personalization is part of the moat

“Top opportunities” must eventually mean the best opportunities for a specific customer, not merely the largest records in the database.

An organization capability profile may contain:

- offerings and service lines;
- GSIN, UNSPSC, NAICS, and PSC mappings;
- target departments or agencies;
- geography;
- certifications;
- clearances;
- past performance;
- contract-size preferences;
- set-aside eligibility;
- delivery capacity;
- incumbent and competitor relationships;
- partners;
- exclusions and risk tolerance.

The same opportunity may receive different fit and eligibility results for different customers.

### 3.9 Alerts are a product surface

The platform must deliver time-sensitive intelligence without requiring the user to repeatedly inspect a dashboard.

Examples include:

- a watched contract entering a renewal window;
- a new opportunity matching the customer profile;
- a material solicitation amendment;
- a compliance requirement that changed;
- a watched supplier winning a new award;
- a target department changing buying behaviour;
- a deadline or action approaching.

### 3.10 Outcome tracking closes the loop

Where practical, FedPulse should record:

- the recommendation made;
- the evidence available at the time;
- whether the user accepted or rejected it;
- actions taken;
- the eventual outcome;
- reasons for disagreement;
- model or rule version.

This creates auditable value evidence and training material for future scoring improvements.

## 4. Commercial product architecture

```text
Procurement Intelligence Platform
|
|-- FedPulse Canada
|   |-- Briefing
|   |-- Ask FedPulse
|   |-- Renewal Watch
|   |-- Target Accounts
|   |-- Incumbent Opportunities
|   |-- Competitor Watch
|   |-- Contracts, Departments, Suppliers, Categories, Awards
|   `-- Watchlists, Alerts, Saved Analysis, Reports
|
|-- FedPulse United States
|   |-- Briefing
|   |-- Ask FedPulse
|   |-- Opportunity Watch
|   |-- Bid / No-Bid
|   |-- Compliance Review
|   |-- Amendment Impact
|   |-- Opportunities, Agencies, Requirements, Incumbents, NAICS, PSC
|   `-- Pipeline, Watchlists, Alerts, Saved Analysis, Reports
|
`-- Shared Intelligence Core
    |-- API gateway and entitlements
    |-- evidence and provenance
    |-- search and retrieval
    |-- scoring and recommendations
    |-- visualization contract
    |-- organization capability profiles
    |-- watchlists and alerts
    |-- reports and exports
    |-- decision and outcome tracking
    |-- authentication and billing
    `-- observability and audit
```

## 5. Primary application shell

The shared shell should contain:

### 5.1 Workspace selector

Users must clearly choose Canada or United States. The selected workspace determines terminology, tools, sources, navigation, and AI context.

### 5.2 Briefing

The home page is a mission-control briefing, not a generic KPI dashboard.

It should answer:

- What changed?
- What requires attention?
- Why does it matter?
- What should I do next?

Briefing cards must be actionable and traceable to evidence.

### 5.3 Ask FedPulse

The conversational workspace should support:

- suggested decision prompts;
- natural-language filters;
- comparison;
- explanation of scores and rankings;
- chart and visual generation;
- workspace navigation;
- saving and watchlisting;
- alert creation;
- report generation;
- retrieval of supporting evidence.

### 5.4 Decision workspaces

Each workspace must have one primary question and a clear decision outcome. It should expose enough supporting data to review the recommendation without becoming a broad, all-purpose dashboard.

### 5.5 Explore

Explore pages provide transparent access to the governed records beneath the intelligence. They are secondary to decision workflows but essential for trust, discovery, and API demonstration.

### 5.6 My Work

The system should retain user state through watchlists, alerts, saved analyses, reports, assignments, decisions, and outcomes.

### 5.7 Evidence and data status

Every workspace should make data source, coverage, freshness, pipeline health, and quality status visible.

## 6. API product surface

Initial namespace direction:

```text
/api/v1/ca/renewals
/api/v1/ca/contracts
/api/v1/ca/departments
/api/v1/ca/suppliers
/api/v1/ca/target-accounts
/api/v1/ca/incumbent-opportunities

/api/v1/us/opportunities
/api/v1/us/requirements
/api/v1/us/amendments
/api/v1/us/bid-analysis
/api/v1/us/compliance-analysis

/api/v1/core/query
/api/v1/core/evidence
/api/v1/core/visualizations
/api/v1/core/watchlists
/api/v1/core/alerts
/api/v1/core/reports
/api/v1/core/decisions
/api/v1/core/outcomes
```

API consumers should be able to request structured intelligence without requiring the FedPulse interface. The application remains valuable as the reference experience, onboarding surface, demonstrator, and decision workspace.

## 7. Role of the Embeddable Analytics Widget

The `embeddable-analytics-widget` project is approved as a candidate shared visualization engine for Ask FedPulse and decision workspaces.

Its current architecture is well aligned with this direction:

- framework-neutral Web Component;
- Shadow DOM isolation;
- Vega-Lite rendering;
- JSON data input;
- automatic column profiling;
- rule/scoring-based chart selection;
- KPI cards;
- time-series, scatter, breakdown, histogram, heatmap, and table outputs;
- cross-filtered desktop canvas;
- responsive grid mode;
- custom Vega-Lite `spec` escape hatch;
- chart configuration and layout overrides;
- PNG, SVG, CSV, and JSON exports;
- dashboard feedback events.

The widget is a **last-mile visualization component**, not the procurement intelligence authority.

Ask FedPulse and the governed backend must determine:

- the user's intent;
- authorized data scope;
- source and country context;
- query plan;
- calculations;
- rankings and recommendations;
- evidence and caveats;
- which records may be visualized.

The widget may then render approved data or an approved visualization specification.

Long-lived credentials must not be embedded in browser attributes. Production remote fetching should use short-lived, scoped tokens or, preferably for the first implementation, have the FedPulse application fetch governed data server-side and pass the permitted dataset and visualization contract to the widget.

## 8. Explicit non-goals

FedPulse will not prioritize:

- a Power BI or Tableau replacement;
- drag-and-drop dashboard construction;
- a custom page for every metric;
- charts whose only purpose is to decorate the interface;
- a single blended Canada/U.S. dataset;
- raw data dumps as the primary value proposition;
- ungrounded LLM analysis;
- invented sources or placeholder evidence;
- autonomous high-impact actions without human approval;
- breadth before the first repeatable customer decision is production-ready.

## 9. Launch sequence

The default launch sequence is:

1. **FedPulse Canada Renewal Watch** as the first production decision product.
2. **Ask FedPulse Canada** for governed renewal, department, supplier, incumbent, and contract questions.
3. **Public Canada intelligence APIs** for selected derived products.
4. **FedPulse U.S. Bid / No-Bid and Compliance Analyst** as the first U.S. decision product.
5. **Ask FedPulse U.S.** for governed opportunity and solicitation-document intelligence.
6. Broader shared intelligence, alerts, integrations, and cross-border concepts only after source-specific products are reliable.

## 10. Definition of success

This direction is successful when:

- a customer can receive value without constructing a dashboard;
- a developer can access the same governed intelligence through an API;
- chat answers are reproducible, source-backed, and convertible into structured views;
- decision workspaces reduce time to a procurement action;
- visualizations are generated from governed result sets rather than hard-coded examples;
- users can understand why a recommendation was made;
- Canada and U.S. source contexts cannot be accidentally mixed;
- every production claim exposes freshness and evidence;
- product usage and outcomes demonstrate which intelligence customers will pay for.

## 11. Canonical implementation documents

This strategy is implemented through:

- `docs/architecture/product/ask_fedpulse_visual_intelligence_architecture.md`
- `docs/product/roadmap/api_first_conversational_implementation_plan.md`
- `docs/product/overview/current_state.md`

When other historical documents conflict with this strategy, this accepted direction governs future implementation unless explicitly superseded.
