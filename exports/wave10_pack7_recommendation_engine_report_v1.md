# Wave 10 Pack 7 Recommendation Engine Report V1

Created: 2026-07-01 14:16:58

## Product Status

- Product Status: recommendation_engine_certified
- Graph Version: KG-1.0
- Product Version: 0.1.0

## Recommendation Summary

The recommendation engine generated 9 graph-backed recommendations. The top recommendation is: Proceed with qualified bid pursuit. Supplier fit is 78.4, opportunity bid readiness is 90.0, opportunity complexity is 98.0, and the top similarity score is 72.5. The recommended path is to continue pursuit while strengthening compliance, delivery, evaluation, and technical response evidence.

## Inputs

- Nodes: 29
- Edges: 44
- Opportunity scores: 1
- Opportunity risks: 5
- Supplier scores: 1
- Supplier gaps: 8
- Department scores: 1
- Department recommendations: 8
- Similarity matches: 4

## Key Upstream Scores

- Opportunity complexity score: 98.0
- Opportunity bid readiness score: 90.0
- Supplier fit score: 78.4
- Supplier readiness score: 80.12
- Department intelligence score: 52.2
- Top similarity score: 72.5

## Ranked Recommendations

- Rank 1: Proceed with qualified bid pursuit | category=bid_strategy | priority=critical | score=90.2
  - Supplier fit and opportunity bid-readiness are both strong enough to justify continued pursuit, subject to pricing and compliance review.
- Rank 2: Map proposal to evaluation factors | category=evaluation_strategy | priority=critical | score=89.5
  - Evaluation concepts are present in the opportunity and department intelligence. Build a compliance matrix and proposal win themes around evaluation factors and award basis.
- Rank 3: Strengthen compliance evidence | category=compliance | priority=critical | score=88.8
  - Supplier intelligence found compliance-related gaps or medium-strength evidence. Review FAR/DOSAR and compliance obligations before final bid decision.
- Rank 4: Use disciplined pricing review | category=pricing_strategy | priority=critical | score=87.4
  - Opportunity complexity is high. Pricing should include risk review, delivery assumptions, compliance cost, and margin sensitivity.
- Rank 5: Build technical compliance matrix | category=technical_strategy | priority=critical | score=87.4
  - Technical concepts such as statement of work and performance work statement should be translated into a response compliance matrix.
- Rank 6: Address opportunity risk flags early | category=risk_mitigation | priority=critical | score=87.4
  - Opportunity intelligence identified risk flags. Resolve evaluation, compliance, delivery, documentation, and supplier-readiness risks before final bid approval.
- Rank 7: Validate delivery and place-of-performance assumptions | category=delivery | priority=high | score=76.0
  - Delivery fit should be strengthened. Validate logistics, location, staffing, travel, and execution assumptions before pricing.
- Rank 8: Reuse capture strategy from similar opportunities | category=similarity_reuse | priority=high | score=76.0
  - Similar Opportunity Engine found high-similarity historical-style opportunity patterns. Review technical, commercial, and evaluation overlap for reusable capture material.
- Rank 9: Tailor pursuit to buyer acquisition style | category=buyer_strategy | priority=medium | score=74.6
  - Department intelligence suggests an identifiable buying style. Align capture strategy with the buyer's acquisition patterns and solicitation behavior.

## Explainability

- Proceed with qualified bid pursuit: Generated from supplier_score_registry_v1 + opportunity_score_registry_v1 with confidence 0.86 and business impact high.
- Use disciplined pricing review: Generated from opportunity_score_registry_v1 with confidence 0.82 and business impact high.
- Strengthen compliance evidence: Generated from supplier_gap_registry_v1 with confidence 0.84 and business impact high.
- Validate delivery and place-of-performance assumptions: Generated from supplier_gap_registry_v1 with confidence 0.8 and business impact medium.
- Map proposal to evaluation factors: Generated from opportunity_intelligence + department_intelligence with confidence 0.85 and business impact high.
- Build technical compliance matrix: Generated from opportunity_summary_registry_v1 with confidence 0.82 and business impact high.
- Reuse capture strategy from similar opportunities: Generated from similar_opportunity_match_registry_v1 with confidence 0.8 and business impact medium.
- Tailor pursuit to buyer acquisition style: Generated from department_score_registry_v1 with confidence 0.78 and business impact medium.
- Address opportunity risk flags early: Generated from opportunity_risk_registry_v1 with confidence 0.82 and business impact high.

## QA

- recommendations_created: 9 (target=>= 8, status=pass)
- priority_rows: 9 (target=9, status=pass)
- explainability_rows: 9 (target=9, status=pass)
- evidence_rows: 9 (target=9, status=pass)
- summary_rows: 1 (target=1, status=pass)
- top_recommendation_present: 1 (target=1, status=pass)