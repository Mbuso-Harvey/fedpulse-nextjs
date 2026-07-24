# Wave 10 Pack 6 Similar Opportunity Engine Report V1

Created: 2026-07-01 10:11:25

## Product Status

- Product Status: similar_opportunity_engine_certified
- Graph Version: KG-1.0
- Product Version: 0.1.0

## Input Counts

- Nodes: 29
- Edges: 44
- Opportunity profiles: 1
- Opportunity categories: 29
- Supplier scores: 1
- Department scores: 1

## Similarity Outputs

- Opportunity variants: 5
- Fingerprints: 5
- Similarity matches: 4
- Explainability rows: 4

## Ranked Similar Opportunities

- Rank 1: Technical Services Similar Opportunity | score=72.5 | band=high
- Rank 2: Commercial Pricing Similar Opportunity | score=60.0 | band=high
- Rank 3: Compliance Heavy Opportunity | score=50.0 | band=medium
- Rank 4: Low Similarity Administrative Opportunity | score=5.0 | band=very_low

## Similarity Breakdown

### Technical Services Similar Opportunity

- Technical: 100.0
- Commercial: 66.67
- Evaluation: 100.0
- Supplier: 50.0
- Compliance: 0.0
- Delivery: 100.0
- Buyer: 100.0
- Operations: 0.0
- Overall graph score: 56.25

### Commercial Pricing Similar Opportunity

- Technical: 50.0
- Commercial: 100.0
- Evaluation: 50.0
- Supplier: 50.0
- Compliance: 0.0
- Delivery: 100.0
- Buyer: 100.0
- Operations: 0.0
- Overall graph score: 53.33

### Compliance Heavy Opportunity

- Technical: 50.0
- Commercial: 33.33
- Evaluation: 50.0
- Supplier: 50.0
- Compliance: 100.0
- Delivery: 0.0
- Buyer: 100.0
- Operations: 0.0
- Overall graph score: 40.0

### Low Similarity Administrative Opportunity

- Technical: 0.0
- Commercial: 33.33
- Evaluation: 0.0
- Supplier: 0.0
- Compliance: 0.0
- Delivery: 0.0
- Buyer: 0.0
- Operations: 0.0
- Overall graph score: 6.25

## Explainability

- Technical Services Similar Opportunity: technical requirements overlap; commercial/pricing structure overlap; evaluation approach overlap; supplier qualification overlap; delivery/logistics overlap; same or similar buyer context
- Commercial Pricing Similar Opportunity: technical requirements overlap; commercial/pricing structure overlap; evaluation approach overlap; supplier qualification overlap; delivery/logistics overlap; same or similar buyer context
- Compliance Heavy Opportunity: technical requirements overlap; commercial/pricing structure overlap; evaluation approach overlap; supplier qualification overlap; compliance overlap; same or similar buyer context
- Low Similarity Administrative Opportunity: commercial/pricing structure overlap

## QA

- opportunity_variants: 5 (target=>= 5, status=pass)
- fingerprints_created: 5 (target=5, status=pass)
- similarity_matches: 4 (target=4, status=pass)
- explainability_rows: 4 (target=4, status=pass)
- top_similarity_score: 72.5 (target=> 0, status=pass)