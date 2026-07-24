# Wave 8B Pack 4 Semantic QA and Release Readiness Report V1

Created: 2026-06-29 00:54:06

## Release Certification

- Release Status: certified_for_wave9_graph_population
- PKV Version: PKV-1.3
- Semantic Registry: semantic_procurement_object_registry_v3.csv

## Input Counts

- Semantic objects V2.5 input: 36
- Entity objects input: 10
- Entity links input: 14
- Governance score records: 36
- Promotion candidates: 36

## Deduplication

- Semantic object duplicate clusters: 4
- Semantic entity duplicate clusters: 0
- Objects before dedupe: 36
- Objects after dedupe / V3: 32

## Integrity Validation

- pass: 160

## Confidence Distribution

- High confidence: 6
- Medium confidence: 24
- Low confidence: 2

## Interpretation Coverage

- Interpreted objects V3: 32
- Uninterpreted objects V3: 0
- Interpretation coverage V3: 100.0%

## Graph Readiness

- graph_candidate: 18
- graph_ready: 12
- not_graph_ready: 2

## Object Type Counts V3

- Acquisition Metadata: 7
- Submission Instruction: 2
- Contract Type: 2
- Pricing Structure: 2
- Technical Requirement: 2
- Supplier Qualification: 2
- Military Organization: 2
- Domain Specific Requirement: 1
- Procurement Role: 1
- Evaluation Factor: 1
- Document Structure Object: 1
- Administrative Service Labor Category: 1
- Proposal Structure: 1
- Delivery Requirement: 1
- Evaluation Method: 1
- Military Installation: 1
- Procurement Document Artifact: 1
- Regulation Set: 1
- Federal Agency: 1
- Proposal Document Artifact: 1

## Domain Counts V3

- Acquisition Strategy: 9
- Domain-Specific Operations: 4
- Commercial and Pricing: 4
- Submission and Proposal Management: 3
- Document Structure and Administrative Forms: 3
- Technical Requirements: 2
- Evaluation and Source Selection: 2
- Supplier Eligibility and Qualifications: 2
- Performance and Operations: 1
- Delivery and Logistics: 1
- Legal, Compliance, and Labor: 1

## Release Scorecard

- semantic_objects_v3: 32 (target=>= 25, status=pass)
- duplicate_clusters_detected: 4 (target=<= 5, status=pass)
- objects_after_deduplication: 32 (target=<= input object count, status=pass)
- interpretation_coverage_pct: 100.0 (target=>= 90%, status=pass)
- graph_ready_objects: 12 (target=>= 8, status=pass)
- graph_ready_pct: 37.5 (target=>= 20%, status=pass)
- not_graph_ready_objects: 2 (target=<= 2, status=pass)
- integrity_failures: 0 (target=0, status=pass)
- low_confidence_objects: 2 (target=<= 2, status=pass)

## Graph Ready Objects

- Solicitation Amendment | Submission Instruction | domain=Submission and Proposal Management | confidence=0.902
- National Cemetery Operations | Domain Specific Requirement | domain=Domain-Specific Operations | confidence=0.89
- Firm Fixed Price | Contract Type | domain=Commercial and Pricing | confidence=0.805
- Contracting Officer | Procurement Role | domain=Acquisition Strategy | confidence=0.802
- Performance Work Statement | Technical Requirement | domain=Technical Requirements | confidence=0.811
- Award Basis | Evaluation Method | domain=Evaluation and Source Selection | confidence=0.82
- Marine Corps Base Camp Lejeune | Military Installation | domain=Domain-Specific Operations | confidence=0.92
- United States Army | Military Organization | domain=Domain-Specific Operations | confidence=0.82
- Firm Fixed Price | Contract Type | domain=Commercial and Pricing | confidence=0.84
- United States Marine Corps | Military Organization | domain=Domain-Specific Operations | confidence=0.86
- FAR and DOSAR Provisions | Regulation Set | domain=Legal, Compliance, and Labor | confidence=0.86
- Food and Drug Administration | Federal Agency | domain=Acquisition Strategy | confidence=0.92

## Not Graph Ready Objects

- Solicitation Metadata | Acquisition Metadata | required_action=semantic_review_required
- Solicitation Amendment | Submission Instruction | required_action=semantic_review_required