# FedPulse Governed Facts Contract

Contract identifier: `fedpulse.analytics.facts.v1`

FedPulse uses the supplied **Embeddable Analytics Widget** as its visualization engine. The platform does not maintain a parallel Recharts renderer.

## Governing boundary

FedPulse APIs and Ask FedPulse own the facts:

- authorized source records;
- calculations, rankings, filters, and derived metrics;
- product version and coverage date;
- evidence identifiers and limitations;
- customer and country authorization.

The embeddable widget owns presentation:

- profiling field types and cardinality;
- selecting KPIs, time series, correlations, category breakdowns, histograms, heatmaps, and detail tables;
- desktop Vega-Lite canvas cross-filtering;
- mobile responsive grid rendering;
- chart swapping and average-line controls;
- PNG, SVG, JSON, and CSV export capabilities;
- theme and layout behaviour;
- dashboard-layout feedback events.

The default path sends only governed fact rows to the widget. No chart type is required. The widget profiles those rows and recommends the appropriate visual composition.

## Optional AI presentation controls

Ask FedPulse may use the widget's native controls when a specific presentation is justified:

- `chartConfig` for global Vega-Lite configuration;
- `chartLayout` for approved panel order and spans;
- `spec` for a complete Vega-Lite escape hatch;
- `layoutMode` for `auto`, `canvas`, or `grid`;
- `theme` for `auto`, `light`, or `dark`;
- `approvalMode` for layout feedback collection.

These controls never authorize the AI or frontend to invent, aggregate, or alter facts. The fact envelope remains the source of truth.

## Contract envelope

Every response contains:

- `contractVersion` and stable `datasetId`;
- title, optional description, and explicit status;
- source, product version, coverage, generation timestamp, evidence, and limitations;
- optional presentation controls;
- a rectangular array of scalar fact rows.

Unknown envelope fields are rejected. Ready or partial responses require facts. Empty and error responses cannot carry facts. All rows must expose the same fields so profiling is deterministic.

## Implementation

Server validation:

`platform/apps/api/models/visualizations.py`

Client validation:

`platform/apps/web/src/lib/visualization/contract.ts`

React/Web Component adapter:

`platform/apps/web/src/components/analytics/AnalyticsWidgetHost.tsx`

Supplied engine source:

`platform/apps/web/public/vendor/embeddable-analytics/`

Shared compatibility fixtures:

`platform/contracts/visualization/examples/`
