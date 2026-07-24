# Wave 13 Pack 2 UI API Integration Contracts Report V1

Created: 2026-07-08 17:38:01

## Product Status

- Product Status: ui_api_integration_contracts_certified
- Integration Gate: ui_api_integration_contracts_ready
- Release Version: 1.0.0-rc1
- API Version: v1

## UI Views

- [critical] Dashboard Home | service=health | endpoint=/api/v1/health
- [critical] Search | service=semantic_search | endpoint=/api/v1/search
- [critical] Ask | service=question_answering | endpoint=/api/v1/ask
- [critical] Opportunity Intelligence | service=opportunity_intelligence | endpoint=/api/v1/opportunity/intelligence
- [high] Recommendations | service=recommendations | endpoint=/api/v1/recommendations
- [high] AI Analyst | service=ai_procurement_analyst | endpoint=/api/v1/analyst
- [medium] Graph Analytics | service=graph_analytics | endpoint=/api/v1/graph/analytics

## API Contracts

- [ready] Dashboard Home: /api/v1/health | request=application/json | response=application/json
- [ready] Search: /api/v1/search | request=application/json | response=application/json
- [ready] Ask: /api/v1/ask | request=application/json | response=application/json
- [ready] Opportunity Intelligence: /api/v1/opportunity/intelligence | request=application/json | response=application/json
- [ready] Recommendations: /api/v1/recommendations | request=application/json | response=application/json
- [ready] AI Analyst: /api/v1/analyst | request=application/json | response=application/json
- [ready] Graph Analytics: /api/v1/graph/analytics | request=application/json | response=application/json

## Required UI Fields

- Dashboard Home | platform_status (string): Display current launch/readiness status.
- Dashboard Home | release_version (string): Display current release candidate.
- Dashboard Home | human_approval_required (boolean): Show that human approval remains required.
- Search | query (string): User search query.
- Search | results (array): Returned procurement search results.
- Search | evidence (array): Evidence records supporting results.
- Ask | question (string): User procurement question.
- Ask | answer (string): Graph-backed answer.
- Ask | citations (array): Evidence or source references.
- Opportunity Intelligence | complexity_score (number): Opportunity complexity score.
- Opportunity Intelligence | bid_readiness_score (number): Bid readiness score.
- Opportunity Intelligence | risk_flags (array): Opportunity risk flags.
- Recommendations | recommendations (array): Ranked recommendations.
- Recommendations | priority (string): Recommendation priority.
- Recommendations | evidence (array): Evidence for each recommendation.
- AI Analyst | overall_assessment_score (number): AI analyst overall assessment.
- AI Analyst | recommended_pursuit (string): Recommended pursuit position.
- AI Analyst | actions (array): Recommended analyst actions.
- Graph Analytics | node_count (number): Graph node count.
- Graph Analytics | edge_count (number): Graph edge count.
- Graph Analytics | analytics_health_score (number): Graph analytics health score.

## UI States

- loading: Shown while the UI waits for an API response.
- empty: Shown when no results or records are returned.
- error: Shown when API request fails or returns unavailable data.
- success: Shown when data loads successfully.

## Navigation

- 1. Dashboard Home | route=/dashboard-home
- 2. Search | route=/search
- 3. Ask | route=/ask
- 4. Opportunity Intelligence | route=/opportunity-intelligence
- 5. Recommendations | route=/recommendations
- 6. AI Analyst | route=/ai-analyst
- 7. Graph Analytics | route=/graph-analytics

## QA

- session_rows: 1 (target=1, status=pass)
- view_rows: 7 (target=7, status=pass)
- contracts_missing: 0 (target=0, status=pass)
- field_rows: 21 (target=>= 21, status=pass)
- state_rows: 4 (target=4, status=pass)
- navigation_rows: 7 (target=7, status=pass)
- integration_gate: ui_api_integration_contracts_ready (target=ui_api_integration_contracts_ready, status=pass)