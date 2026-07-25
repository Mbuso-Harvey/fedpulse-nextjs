# Semantic Object Model Schema V1

Created: 2026-06-27 21:23:24

## Canonical Semantic Object Fields

- semantic_object_id
- semantic_object_type_id
- semantic_object_type
- canonical_name
- domain_id
- domain_name
- subdomain_name
- intent
- lifecycle_state
- evidence_count
- supporting_pattern_ids
- supporting_expression_ids
- official_registry_id
- ontology_domain_id
- knowledge_graph_node_id
- embedding_id
- confidence
- governance_status
- pkv_version
- created_at
- updated_at

## Object Lifecycle

Draft
    -> Candidate
    -> Reviewed
    -> Approved
    -> Embedded
    -> Graph Ready
    -> Graph Published
    -> Intelligence Consumed

## Required Integrity Rules

1. Every object must have a type.
2. Every object must have a lifecycle state.
3. Every object must preserve evidence lineage.
4. Every object must indicate registry status.
5. Every object must be versioned.
