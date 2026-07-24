# Wave 10 Pack 8 Graph Analytics Report V1

Created: 2026-07-01 20:51:37

## Product Status

- Product Status: graph_analytics_certified
- Graph Version: KG-1.0
- Product Version: 0.1.0

## Graph Summary

- Nodes: 29
- Edges: 44
- Density: 0.0542
- Clusters: 8
- Largest Cluster Size: 22
- Domains: 11
- Analytics Health Score: 67 (moderate)

## Influence

- High Influence Nodes: 4
- Medium Influence Nodes: 9
- Isolated Nodes: 7

## Top Influence Nodes

- Solicitation Amendment | Submission Instruction | degree=9 | centrality=1.0 | band=high
- Contracting Officer | Procurement Role | degree=8 | centrality=0.8889 | band=high
- Award Basis | Evaluation Method | degree=8 | centrality=0.8889 | band=high
- Food and Drug Administration | Federal Agency | degree=7 | centrality=0.7778 | band=high
- Place of Performance | Delivery Requirement | degree=5 | centrality=0.5556 | band=medium
- Performance Work Statement | Technical Requirement | degree=4 | centrality=0.4444 | band=medium
- Solicitation Number | Acquisition Metadata | degree=4 | centrality=0.4444 | band=medium
- Request for Information | Acquisition Metadata | degree=4 | centrality=0.4444 | band=medium
- Combined Synopsis Solicitation | Acquisition Metadata | degree=4 | centrality=0.4444 | band=medium
- Method of Solicitation | Acquisition Metadata | degree=4 | centrality=0.4444 | band=medium

## Top Bridge Edges

- Contracting Officer -> Solicitation Amendment | issues_or_receives | bridge=0.9444 | band=high
- Contracting Officer -> Solicitation Amendment | issues_or_receives_submission_instruction | bridge=0.9444 | band=high
- Solicitation Number -> Solicitation Amendment | defines_submission_context | bridge=0.7222 | band=high
- Request for Information -> Solicitation Amendment | defines_submission_context | bridge=0.7222 | band=high
- Combined Synopsis Solicitation -> Solicitation Amendment | defines_submission_context | bridge=0.7222 | band=high
- Method of Solicitation -> Solicitation Amendment | defines_submission_context | bridge=0.7222 | band=high
- Request for Proposal -> Solicitation Amendment | defines_submission_context | bridge=0.7222 | band=high
- Request for Quotation -> Solicitation Amendment | defines_submission_context | bridge=0.7222 | band=high
- Solicitation Number -> Award Basis | shapes_source_selection | bridge=0.6667 | band=medium
- Request for Information -> Award Basis | shapes_source_selection | bridge=0.6667 | band=medium

## Clusters

- GCLUSTER-000001: size=22 | band=large | dominant_domain=Acquisition Strategy
- GCLUSTER-000002: size=1 | band=small | dominant_domain=Domain-Specific Operations
- GCLUSTER-000003: size=1 | band=small | dominant_domain=Domain-Specific Operations
- GCLUSTER-000004: size=1 | band=small | dominant_domain=Legal, Compliance, and Labor
- GCLUSTER-000005: size=1 | band=small | dominant_domain=Document Structure and Administrative Forms
- GCLUSTER-000006: size=1 | band=small | dominant_domain=Performance and Operations
- GCLUSTER-000007: size=1 | band=small | dominant_domain=Document Structure and Administrative Forms
- GCLUSTER-000008: size=1 | band=small | dominant_domain=Document Structure and Administrative Forms

## Domain Analytics

- Acquisition Strategy: nodes=8 | internal_edges=12 | external_edges=15 | avg_degree=4.875 | coverage=high
- Domain-Specific Operations: nodes=4 | internal_edges=0 | external_edges=4 | avg_degree=1.0 | coverage=medium
- Commercial and Pricing: nodes=3 | internal_edges=2 | external_edges=5 | avg_degree=3.0 | coverage=medium
- Document Structure and Administrative Forms: nodes=3 | internal_edges=0 | external_edges=0 | avg_degree=0.0 | coverage=medium
- Submission and Proposal Management: nodes=2 | internal_edges=1 | external_edges=8 | avg_degree=5.0 | coverage=medium
- Technical Requirements: nodes=2 | internal_edges=1 | external_edges=6 | avg_degree=4.0 | coverage=medium
- Evaluation and Source Selection: nodes=2 | internal_edges=1 | external_edges=7 | avg_degree=4.5 | coverage=medium
- Supplier Eligibility and Qualifications: nodes=2 | internal_edges=0 | external_edges=4 | avg_degree=2.0 | coverage=medium
- Legal, Compliance, and Labor: nodes=1 | internal_edges=0 | external_edges=0 | avg_degree=0.0 | coverage=low
- Performance and Operations: nodes=1 | internal_edges=0 | external_edges=0 | avg_degree=0.0 | coverage=low
- Delivery and Logistics: nodes=1 | internal_edges=0 | external_edges=5 | avg_degree=5.0 | coverage=low

## QA

- node_analytics_rows: 29 (target=29, status=pass)
- edge_analytics_rows: 44 (target=44, status=pass)
- cluster_rows: 8 (target=>= 1, status=pass)
- domain_rows: 11 (target=>= 1, status=pass)
- summary_rows: 1 (target=1, status=pass)
- analytics_health_score: 67 (target=> 0, status=pass)