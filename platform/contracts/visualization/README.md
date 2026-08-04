# FedPulse Visualization Contract V1

The visualization contract is the transport-neutral boundary between governed procurement intelligence and any presentation surface, including dashboard pages, embedded analytics, reports, and Ask FedPulse.

Contract identifier: `fedpulse.visualization.v1`

## Governing rule

The backend owns analytics, rankings, aggregations, recommendations, confidence, evidence selection, and limitations. The frontend must not independently calculate procurement intelligence or query raw procurement data to complete a widget.

The widget host may only:

- validate the response against the contract;
- format already-governed scalar values;
- render approved metric, chart, table, or insight-list layouts;
- expose source, version, coverage, evidence IDs, and limitations;
- show explicit partial, empty, and error states.

## Required envelope

Every widget contains:

- `contractVersion` — exact supported contract identifier;
- `widgetId` — stable machine-readable identity;
- `kind` — `metric`, `chart`, `table`, or `insight_list`;
- `title` and optional `description`;
- `status` — `ready`, `partial`, `empty`, or `error`;
- `provenance` — source system, product version, coverage date, generation time, evidence IDs, and limitations;
- a kind-specific payload containing only values that are safe for direct presentation.

Unknown fields are rejected. Missing chart fields are rejected. Pie and scatter charts accept exactly one series in V1. The host fails closed rather than guessing how to display malformed analytics.

## Cross-stack compatibility

The server-side Pydantic models live in:

`platform/apps/api/models/visualizations.py`

The client-side Zod contract and inferred TypeScript types live in:

`platform/apps/web/src/lib/visualization/contract.ts`

The reusable renderer lives in:

`platform/apps/web/src/components/analytics/AnalyticsWidgetHost.tsx`

Shared JSON fixtures under `examples/` are validated by both stacks in CI. These fixtures are compatibility artifacts, not production procurement data.

## Supported V1 widgets

### Metric

A single governed value with optional context and trend wording supplied by the backend.

### Chart

Bar, line, pie, or scatter presentation. A chart names its x-axis field and one to five governed series. The host does not aggregate or rank rows.

### Table

A typed set of columns and already-prepared rows. Pagination, ranking, and filtering decisions remain API responsibilities.

### Insight list

Backend-authored procurement findings with severity and evidence identifiers. The host does not generate or rewrite the findings.

## Versioning

V1 is additive only within fields already marked optional. A breaking field change, semantic change, or new required behaviour must use a new contract identifier. Existing V1 responses must continue to validate and render unchanged.
