# Wave 12 Pack 2 API Contract Validation Report V1

Created: 2026-07-05 17:27:42

## Product Status

- Product Status: api_contract_validation_certified
- Gate Decision: api_contracts_validated
- API Version: v1

## Endpoint Contracts

- [pass] semantic_search: expected=/api/v1/search | actual=/api/v1/search
- [pass] question_answering: expected=/api/v1/ask | actual=/api/v1/ask
- [pass] opportunity_intelligence: expected=/api/v1/opportunity/intelligence | actual=/api/v1/opportunity/intelligence
- [pass] supplier_intelligence: expected=/api/v1/supplier/intelligence | actual=/api/v1/supplier/intelligence
- [pass] department_intelligence: expected=/api/v1/department/intelligence | actual=/api/v1/department/intelligence
- [pass] similar_opportunities: expected=/api/v1/opportunity/similar | actual=/api/v1/opportunity/similar
- [pass] recommendations: expected=/api/v1/recommendations | actual=/api/v1/recommendations
- [pass] graph_analytics: expected=/api/v1/graph/analytics | actual=/api/v1/graph/analytics
- [pass] ai_procurement_analyst: expected=/api/v1/analyst | actual=/api/v1/analyst
- [pass] health: expected=/api/v1/health | actual=/api/v1/health

## Manifest Validation

- [pass] manifest_services_present: 0 / 0
- [pass] manifest_extra_services: 0 / 0
- [pass] request_format_json: 1 / 1
- [pass] response_format_json: 1 / 1
- [pass] auth_required: 1 / 1
- [pass] rate_limited: 1 / 1
- [pass] audit_logging: 1 / 1

## Mismatches

- No API contract mismatches identified.

## QA

- session_rows: 1 (target=1, status=pass)
- contract_rows: 10 (target=10, status=pass)
- contract_failures: 0 (target=0, status=pass)
- manifest_validation_failures: 0 (target=0, status=pass)
- critical_mismatches: 0 (target=0, status=pass)
- gate_decision: api_contracts_validated (target=api_contracts_validated, status=pass)