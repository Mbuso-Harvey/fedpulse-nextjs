# Ask FedPulse Governed Tool Execution

Response contract: `fedpulse.ask.response.v1`

Tool name: `query_ca_renewal_intelligence`

Analytics payload: `fedpulse.analytics.facts.v2`

Visual registry: `fedpulse.visual-registry.v1`

## Purpose

Ask FedPulse converts a user question into one explicitly allowlisted Canada renewal-intelligence analysis. The authenticated API executes the analysis against the active reconciled Canada Renewal Watch product and returns governed facts that the supplied Embeddable Analytics Widget can render.

The tool is provider-neutral. An LLM or other orchestrator may choose a registered `analysisId` and structured filters, but it cannot submit SQL, arbitrary field names, unregistered calculations, or an arbitrary visualization specification.

## Execution sequence

1. Authenticate the user and resolve the subscription tier.
2. Validate the strict tool arguments and filter ranges.
3. Resolve the active reconciled Canada renewal product.
4. Apply only allowlisted filters.
5. Execute one registered analysis implementation.
6. Produce rectangular fact rows and complete semantic field metadata.
7. Attach source product version, coverage, dataset hash, request ID, evidence IDs, limitations, and execution counts.
8. Apply the approved visual allowlist and recent-visual context.
9. Return the V2 analytics payload to the web client and Embeddable Analytics Widget.

## Registered analyses

- `renewal_watchlist`
- `renewal_value_by_department`
- `renewal_value_by_supplier`
- `renewal_expiry_trend`
- `renewal_value_by_category`
- `renewal_value_distribution`
- `renewal_score_relationship`
- `department_supplier_flow`

Each analysis owns its permitted source fields, aggregations, output schema, semantic roles, intent, and approved visual families.

## Safeguards

- Authentication is required and fails closed.
- Analysis IDs are enumerated and versioned.
- Raw SQL and arbitrary grouping or metric fields are not accepted.
- Filter ranges are validated before execution.
- Tier-specific result limits are enforced server-side.
- Calculations and aggregation happen only in the backend implementation.
- Every fact field is described exactly once by the semantic model.
- Arbitrary Vega and Vega-Lite specifications remain disabled.
- Source product version, evidence, filters, query plan, and row counts are auditable.
- Empty results return a governed empty state.
- Missing authoritative data returns a governed unavailable state with no substitute or fabricated facts.
- The accessible table fallback remains mandatory.

## Unavailable product behavior

When no active reconciled Canada renewal product can be resolved, the tool returns no facts. `coverageThrough` records the date on which product availability was checked for that error response; the limitations explicitly state that no source-data coverage date is being asserted.

## Files

Provider-neutral tool definition:

`platform/contracts/ask-fedpulse/query-ca-renewal-intelligence.tool.json`

Server contracts:

`platform/apps/api/models/ask_fedpulse.py`

Execution service:

`platform/apps/api/services/ask_fedpulse.py`

Authenticated route:

`platform/apps/api/routers/ask_fedpulse.py`

Typed web contract and client:

`platform/apps/web/src/lib/ask-fedpulse/`

Execution tests:

`platform/apps/api/tests/test_ask_fedpulse.py`
