# Wave 9 Pack 2 Graph Edge Builder Report V1

Created: 2026-06-29 05:21:45

Nodes input: 30
Deduped nodes V2: 29
Node merge clusters: 1
Edges created: 44
Edge index records: 44

## Relationship Counts

- shapes_source_selection: 6
- defines_submission_context: 6
- administers_acquisition: 6
- uses_acquisition_method: 6
- requires_supplier_capability: 4
- has_pricing_structure: 2
- affects_price: 2
- specializes_requirement: 2
- affects_pricing: 2
- uses_evaluation_factor: 1
- requires_submission_instruction: 1
- issues_or_receives: 1
- issues_or_receives_submission_instruction: 1
- has_domain_requirement: 1
- may_define_place_of_performance: 1
- may_result_in_contract_type: 1
- specializes: 1

## Evidence Basis Counts

- semantic_object_relationship_registry_v1: 19
- role_inference: 7
- domain_inference: 6
- agency_inference: 6
- delivery_pricing_inference: 2
- agency_domain_inference: 1
- facility_delivery_inference: 1
- name_based_procurement_inference: 1
- canonical_name_inference: 1

## Node Merge Log

- Firm Fixed Price | merged=KGNODE-000009;KGNODE-000003 -> KGNODE2-000003

## Sample Edges

- Firm Fixed Price --[has_pricing_structure]--> Unit Price (confidence=0.72)
- Firm Fixed Price --[has_pricing_structure]--> Payment and Invoice (confidence=0.72)
- Award Basis --[uses_evaluation_factor]--> Evaluation Factors (confidence=0.72)
- Proposal Volume --[requires_submission_instruction]--> Solicitation Amendment (confidence=0.72)
- Performance Work Statement --[requires_supplier_capability]--> Past Performance (confidence=0.72)
- Performance Work Statement --[requires_supplier_capability]--> Small Business Set-Aside (confidence=0.72)
- Statement of Work --[requires_supplier_capability]--> Past Performance (confidence=0.72)
- Statement of Work --[requires_supplier_capability]--> Small Business Set-Aside (confidence=0.72)
- Place of Performance --[affects_price]--> Unit Price (confidence=0.72)
- Place of Performance --[affects_price]--> Payment and Invoice (confidence=0.72)
- Contracting Officer --[issues_or_receives]--> Solicitation Amendment (confidence=0.72)
- Solicitation Number --[shapes_source_selection]--> Award Basis (confidence=0.72)
- Request for Information --[shapes_source_selection]--> Award Basis (confidence=0.72)
- Combined Synopsis Solicitation --[shapes_source_selection]--> Award Basis (confidence=0.72)
- Method of Solicitation --[shapes_source_selection]--> Award Basis (confidence=0.72)
- Request for Proposal --[shapes_source_selection]--> Award Basis (confidence=0.72)
- Request for Quotation --[shapes_source_selection]--> Award Basis (confidence=0.72)
- National Cemetery Operations --[specializes_requirement]--> Performance Work Statement (confidence=0.72)
- National Cemetery Operations --[specializes_requirement]--> Statement of Work (confidence=0.72)
- Solicitation Number --[defines_submission_context]--> Solicitation Amendment (confidence=0.74)
- Request for Information --[defines_submission_context]--> Solicitation Amendment (confidence=0.74)
- Combined Synopsis Solicitation --[defines_submission_context]--> Solicitation Amendment (confidence=0.74)
- Method of Solicitation --[defines_submission_context]--> Solicitation Amendment (confidence=0.74)
- Request for Proposal --[defines_submission_context]--> Solicitation Amendment (confidence=0.74)
- Request for Quotation --[defines_submission_context]--> Solicitation Amendment (confidence=0.74)
- Place of Performance --[affects_pricing]--> Unit Price (confidence=0.68)
- Place of Performance --[affects_pricing]--> Payment and Invoice (confidence=0.68)
- Contracting Officer --[administers_acquisition]--> Solicitation Number (confidence=0.72)
- Contracting Officer --[administers_acquisition]--> Request for Information (confidence=0.72)
- Contracting Officer --[administers_acquisition]--> Combined Synopsis Solicitation (confidence=0.72)
- Contracting Officer --[administers_acquisition]--> Method of Solicitation (confidence=0.72)
- Contracting Officer --[administers_acquisition]--> Request for Proposal (confidence=0.72)
- Contracting Officer --[administers_acquisition]--> Request for Quotation (confidence=0.72)
- Contracting Officer --[issues_or_receives_submission_instruction]--> Solicitation Amendment (confidence=0.7)
- Food and Drug Administration --[uses_acquisition_method]--> Solicitation Number (confidence=0.66)
- Food and Drug Administration --[uses_acquisition_method]--> Request for Information (confidence=0.66)
- Food and Drug Administration --[uses_acquisition_method]--> Combined Synopsis Solicitation (confidence=0.66)
- Food and Drug Administration --[uses_acquisition_method]--> Method of Solicitation (confidence=0.66)
- Food and Drug Administration --[uses_acquisition_method]--> Request for Proposal (confidence=0.66)
- Food and Drug Administration --[uses_acquisition_method]--> Request for Quotation (confidence=0.66)
- Food and Drug Administration --[has_domain_requirement]--> National Cemetery Operations (confidence=0.66)
- Marine Corps Base Camp Lejeune --[may_define_place_of_performance]--> Place of Performance (confidence=0.62)
- Award Basis --[may_result_in_contract_type]--> Firm Fixed Price (confidence=0.66)
- Performance Work Statement --[specializes]--> Statement of Work (confidence=0.84)