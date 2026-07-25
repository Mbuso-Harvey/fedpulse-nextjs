# PLU Sprint Roadmap V1

Created: 2026-06-24 19:00:15

## Objective

Build PLU as a reusable semantic foundation for the Procurement Intelligence platform.

## Sprint Sequence

### SAM-0007X
PLU Architecture Documentation

Status:
Completed by this sprint.

Outputs:
- procurement_language_understanding_architecture_v1.md
- procurement_language_governance_v1.md
- plu_sprint_roadmap_v1.md

### SAM-0007Y
PLU Registry Builder V1

Build canonical IDs, context families, context types, and downstream routes.

Expected outputs:
- procurement_language_registry_v1.csv
- procurement_context_taxonomy_v1.csv
- procurement_downstream_routes_v1.csv

### SAM-0007Z
PLU Classification Engine V1

Classify grounded procurement statements into canonical PLU contexts.

Expected outputs:
- procurement_language_classifications_v1.csv
- procurement_context_discovery_queue_v1.csv
- procurement_language_classification_report_v1.md

### SAM-0008A
PLU Semantic Pattern Engine V1

Normalize synonymous procurement expressions.

Examples:
- lowest priced technically acceptable -> LPTA
- firm-fixed-price -> Firm Fixed Price
- Section M -> Evaluation Navigation
- source selection sensitive -> Document Marking

### SAM-0008B
PLU Integration Engine V1

Feed PLU outputs into existing intelligence engines.

Integrations:
- Evaluation Frameworks
- Pricing Structures
- Proposal Structures
- Supplier Qualifications
- Compliance
- Technical Requirements

### SAM-0008C
PLU Quality and Coverage Engine V1

Measure:
- unknown context rate
- confidence bands
- false positives
- discovery queue size
- downstream routing quality

### SAM-0008D
Procurement Genome Builder V1

Use PLU-classified objects to build a canonical procurement genome per opportunity.

### SAM-0008E
Supplier Capability Matching V1

Compare opportunity genome against supplier capabilities.

### SAM-0008F
Winning Company Intelligence V1

Begin measuring which capability combinations appear to align with award outcomes.
