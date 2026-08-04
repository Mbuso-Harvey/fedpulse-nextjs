# FedPulse Enterprise Visual Intelligence Contract

Facts contract: `fedpulse.analytics.facts.v2`

Visual registry: `fedpulse.visual-registry.v1`

FedPulse uses the supplied **Embeddable Analytics Widget** as its only visualization engine. The platform does not maintain a parallel chart renderer.

## Enterprise boundary

FedPulse APIs and Ask FedPulse own analytical meaning and authorization:

- authorized source records and customer scope;
- calculations, rankings, filters, and derived metrics;
- the decision intent and analytical question;
- semantic field roles and permitted aggregations;
- data quality, confidence, coverage, evidence, and limitations;
- visual-policy limits and the approved visual registry version.

The embedded analytics engine owns governed presentation:

- candidate generation from approved templates;
- deterministic utility, confidence, diversity, and recent-use scoring;
- accessible rendering through Vega, Vega-Lite, and HTML;
- responsive desktop canvas and mobile grid composition;
- approved interaction, export, layout, and feedback capabilities.

The AI supplies governed facts and intent. It may prefer an approved visual, but it cannot introduce an unregistered visual or alter the facts.

## Semantic fact model

Every fact field is described exactly once. Metadata includes:

- stable field name and human label;
- semantic roles such as `measure`, `dimension`, `time`, `source`, `target`, `weight`, `latitude`, or `longitude`;
- semantic type such as currency, percentage, duration, supplier, department, region, or identifier;
- default and allowed aggregations;
- currency or unit where applicable;
- priority independent of JSON column order;
- hierarchy, sensitivity, coverage, and confidence.

Non-measure fields cannot be aggregated. Currency measures require an ISO currency code. Flow and geographic intents require their complete semantic role sets.

## Approved visual registry

The V1 registry contains:

- `trend.line.v1`;
- `comparison.bar.v1`;
- `comparison.dot.v1`;
- `distribution.histogram.v1`;
- `relationship.scatter.v1`;
- `relationship.heatmap.v1`;
- `composition.treemap.v1`;
- `flow.sankey.v1`;
- `geo.point-map.v1`;
- `table.detail.v1`.

Each registry entry declares its family, renderer, supported intents, required semantic roles, base utility, accessibility score, complexity cost, and fallback.

## Selection safeguards

Automatic selection is deterministic and fail-closed. It enforces:

- approved-registry-only selection;
- explicit semantic field roles;
- aggregation allowlists;
- minimum recommendation confidence;
- duplicate analytical-signature rejection;
- maximum charts and maximum visuals per family;
- recent-visual penalties to reduce repetitive output;
- category, heatmap, Sankey, and map complexity limits;
- accessible detail-table fallback;
- deterministic tie-breaking and JSON field-order independence.

Visual diversity never overrides correctness. A different visual is selected only when it remains semantically valid and meets the confidence threshold.

## Sankey governance

`flow.sankey.v1` requires exactly one `source`, `target`, and positive `weight` field. The engine:

- aggregates duplicate source-target links;
- excludes missing, non-finite, zero, and negative weights;
- enforces maximum node and link counts;
- produces a versioned full Vega specification;
- records exclusions and selection reasons;
- preserves the governed detail table as the accessible fallback.

Sankey is eligible only for flow, transition, or allocation intents.

## Geographic governance

`geo.point-map.v1` requires exactly one latitude and longitude field. The engine:

- validates latitude and longitude ranges;
- excludes invalid coordinates and reports the exclusion;
- enforces a maximum point count;
- uses a governed projection and approved encodings;
- may use a governed measure for point size and a low-cardinality dimension for colour;
- preserves the detail table as the accessible fallback.

Geographic visuals are eligible only for geography, regional-comparison, or location intents.

## Custom specification policy

Arbitrary Vega or Vega-Lite specifications are disabled by default. A custom `presentation.spec` is accepted only when `visualPolicy.allowCustomSpec` is explicitly true. This flag is part of the governed server response, not a frontend decision.

Preferred visuals, chart configuration, layout, theme, and approval mode remain constrained to the facts and policy envelope.

## Selection audit

Every recommendation produces an auditable record containing:

- registry version and decision intent;
- selected and rejected visual IDs;
- candidate utility score and confidence;
- analytical signature;
- selection reasons and warnings;
- applied policy limits and safeguards.

The host can surface this audit to Ask FedPulse, telemetry, evaluation, or approval workflows without exposing raw customer data.

## Contract invariants

- Unknown envelope fields are rejected.
- Ready and partial responses require facts.
- Empty and error responses cannot carry facts.
- Every row must expose the same fields.
- The semantic model must describe every fact field exactly once.
- Flow intents require source, target, and weight roles.
- Geographic intents require latitude and longitude roles.
- A visual cannot appear in both allow and deny lists.
- Custom specifications require explicit policy authorization.

## Implementation

Server validation:

`platform/apps/api/models/visualizations.py`

Client validation:

`platform/apps/web/src/lib/visualization/contract.ts`

Enterprise selector and approved registry:

`platform/apps/web/public/vendor/embeddable-analytics/recommender.js`

`platform/apps/web/public/vendor/embeddable-analytics/visual-registry.js`

React/Web Component adapter:

`platform/apps/web/src/components/analytics/AnalyticsWidgetHost.tsx`

Supplied engine source:

`platform/apps/web/public/vendor/embeddable-analytics/`

Enterprise compatibility fixtures:

`platform/contracts/visualization/examples/`
