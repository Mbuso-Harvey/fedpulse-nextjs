# Grounded Statement Canonicalization Plan V1

Created: 2026-06-25 07:56:47

## Sprint

SAM-0007ZD - Grounded Statement Canonicalization Engine V1

## Purpose

The canonicalization engine creates a clean, de-duplicated, normalized evidence layer before segmentation and PLU classification.

## Problem

Recent reports showed duplicate grounded statements flowing into segmentation and PLU.

This creates:

- inflated counts
- repeated classifications
- biased semantic learning
- noisy reports
- unreliable procurement genome statistics

## Required Outputs

### canonical_grounded_statements_v1.csv

One row per canonical grounded statement.

Required fields:

- canonical_statement_id
- notice_id
- opportunity_title
- canonical_text
- normalized_text_hash
- source_count
- duplicate_count
- original_statement_ids
- created_at

### grounded_statement_provenance_v1.csv

One row per original-to-canonical relationship.

Required fields:

- provenance_id
- canonical_statement_id
- original_grounded_statement_id
- notice_id
- opportunity_title
- source_file
- original_text
- canonical_text
- normalization_notes

### grounded_statement_duplicate_clusters_v1.csv

One row per duplicate cluster.

Required fields:

- cluster_id
- canonical_statement_id
- cluster_size
- opportunity_title
- normalized_text_hash
- sample_text

### grounded_statement_normalization_log_v1.csv

One row per normalization action.

Required fields:

- normalization_id
- original_grounded_statement_id
- canonical_statement_id
- normalization_type
- before_value
- after_value

## Normalization Rules V1

### Unicode Cleanup

Normalize common corrupted characters:

- ΓÇô -> -
- ΓÇö -> -
- ΓÇ£ -> "
- ΓÇ¥ -> "
- ΓÇÖ -> '
- ΓÇó -> bullet
- ∩é╖ -> bullet
- ∩éº -> bullet

### Whitespace Cleanup

- collapse repeated spaces
- strip leading and trailing spaces
- normalize line breaks
- normalize tab characters

### Punctuation Cleanup

- normalize smart quotes
- normalize dashes
- normalize repeated punctuation
- normalize bullet markers

### Hashing

Hash normalized text, not raw text.

This allows duplicate detection even when formatting differs.

## Design Rule

Canonicalization must never destroy evidence.

It must reduce duplicate records while preserving every original source through provenance.
