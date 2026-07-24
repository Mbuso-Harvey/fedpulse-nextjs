# Wave 10 Pack 10 Production API Report V1

Created: 2026-07-02 17:38:10

## Product Status

- Product Status: production_api_certified
- API Version: v1
- Graph Version: KG-1.0
- Product Version: 1.0.0

## API Summary

- APIs: 1
- Endpoints: 10
- Active Endpoints: 10
- Review Endpoints: 0
- Services: 10

## Endpoints

- POST /api/v1/search | semantic_search | records=77 | status=active
- POST /api/v1/ask | question_answering | records=8 | status=active
- POST /api/v1/opportunity/intelligence | opportunity_intelligence | records=1 | status=active
- POST /api/v1/supplier/intelligence | supplier_intelligence | records=1 | status=active
- POST /api/v1/department/intelligence | department_intelligence | records=1 | status=active
- POST /api/v1/opportunity/similar | similar_opportunities | records=4 | status=active
- POST /api/v1/recommendations | recommendations | records=9 | status=active
- GET /api/v1/graph/analytics | graph_analytics | records=1 | status=active
- POST /api/v1/analyst | ai_procurement_analyst | records=1 | status=active
- GET /api/v1/health | health | records=1 | status=active

## API Contract

- Request format: application/json
- Response format: application/json
- Auth required: true
- Rate limited: true
- Audit logging: true
- Lineage required: true
- Explainability required: true

## QA

- api_rows: 1 (target=1, status=pass)
- endpoint_rows: 10 (target=10, status=pass)
- service_rows: 10 (target=10, status=pass)
- active_endpoints: 10 (target=>=9, status=pass)
- manifest_created: 1 (target=1, status=pass)