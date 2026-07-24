# Wave 11 Pack 6 Executive Decision Agent Report V1

Created: 2026-07-04 22:34:06

## Product Status

- Product Status: executive_decision_agent_certified
- Graph Version: KG-1.0
- Agent Version: 1.0.0

## Executive Decision

- Executive Decision: partner_or_restructure
- Executive Position: partner_or_restructure
- Base Go Score: 65.28
- Risk Penalty: 27.0
- Adjusted Go Score: 38.28
- Critical Conditions: 3
- High Conditions: 3
- Human Approval Required: true
- Commercial Binding Authority: false

## Executive Brief

The Executive Decision Agent assessed the opportunity with a base go score of 65.28 and an adjusted go score of 38.28 after a risk penalty of 27.0. The executive position is 'partner_or_restructure' and the recommended decision is 'partner_or_restructure'. There are 3 critical conditions and 3 high-priority conditions requiring executive oversight. Human approval is required before bid authorization or any commercially binding action.

## Score Inputs

- Bid Readiness Score: 90.0
- Opportunity Complexity Score: 98.0
- Capture Score: 65.11
- Supplier Strategy Score: 43.44
- Pricing Confidence Score: 71.83
- Commercial Risk Score: 86.72
- Proposal Readiness Score: 67.81
- AI Analyst Score: 61.29
- Compliance Critical Gaps: 3.0
- Compliance High Gaps: 2.0

## Executive Conditions

- [critical] Close critical compliance gaps: Resolve all critical compliance evidence gaps before final bid authorization. (source=Compliance Agent)
- [high] Close high compliance gaps: Resolve or formally accept all high-priority compliance gaps. (source=Compliance Agent)
- [critical] Strengthen supplier position: Complete supplier qualification evidence and evaluate teaming support for weak capability areas. (source=Supplier Strategy Agent)
- [critical] Complete executive pricing gate: Complete margin sensitivity, delivery-cost, compliance-cost, and fixed-price exposure reviews. (source=Pricing Strategy Agent)
- [high] Complete proposal review: Complete compliance matrix, technical response, supplier evidence package, and red-team review. (source=Proposal Strategy Agent)
- [high] Strengthen capture position: Review capture actions, evaluation alignment, buyer messaging, and similar opportunity lessons. (source=Capture Manager Agent)

## Executive Actions

- [critical] Hold executive bid gate: Review the adjusted go score, open conditions, pricing risk, compliance gaps, and supplier position. (owner=executive_team)
- [critical] Assign condition owners: Assign accountable owners and target dates to every open executive condition. (owner=capture_manager)
- [critical] Close compliance evidence gaps: Resolve critical compliance evidence before final bid authorization. (owner=compliance_lead)
- [critical] Complete pricing control review: Complete margin sensitivity and commercial risk controls before price approval. (owner=pricing_lead)
- [high] Strengthen supplier evidence: Package supplier qualification, readiness, past performance, and capability evidence. (owner=supplier_lead)
- [high] Run proposal red-team review: Review evaluation alignment, compliance, technical response, pricing, and buyer fit. (owner=proposal_lead)
- [high] Re-run executive decision: Recalculate the executive decision after critical conditions are closed. (owner=executive_team)

## QA

- session_rows: 1 (target=1, status=pass)
- assessment_rows: 1 (target=1, status=pass)
- decision_rows: 1 (target=1, status=pass)
- condition_rows: 6 (target=>= 1, status=pass)
- action_rows: 7 (target=>= 5, status=pass)
- brief_rows: 1 (target=1, status=pass)
- adjusted_go_score: 38.28 (target=>= 0, status=pass)