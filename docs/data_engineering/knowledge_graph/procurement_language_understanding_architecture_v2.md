# Procurement Language Understanding Architecture V2

Created: 2026-06-25 07:56:47

## Purpose

This document updates the Procurement Language Understanding architecture after the segmentation and reasoning sprints.

The platform is moving from extraction scripts toward a semantic procurement operating system.

## V2 Architecture

Raw Procurement Document
    -> Document Structure Extraction
    -> Grounded Statement Extraction
    -> Grounded Statement Canonicalization
    -> Statement Segmentation
    -> PLU Classification
    -> Context Reasoning
    -> Semantic Pattern Learning
    -> Procurement Knowledge Graph
    -> Intelligence Products

## Layer Responsibilities

### Layer 1: Document Structure Extraction

Identifies document structure:

- pages
- headings
- tables
- forms
- sections
- attachments
- amendments
- appendices

### Layer 2: Grounded Statement Extraction

Creates source-linked procurement statements from documents.

Each statement must preserve:

- opportunity title
- notice id
- source file
- source evidence
- original extracted text

### Layer 3: Grounded Statement Canonicalization

New required layer.

Purpose:

- remove duplicate grounded statements
- normalize Unicode and OCR artifacts
- create stable canonical statement IDs
- preserve all original sources through provenance
- prevent inflated downstream counts

### Layer 4: Statement Segmentation

Splits long or mixed statements into smaller procurement language units.

Purpose:

- avoid assigning one classification to mixed-context paragraphs
- improve PLU precision
- preserve segment order
- preserve relationship to canonical statement

### Layer 5: PLU Classification

Assigns each canonical or segmented text unit to the PLU registry.

Outputs:

- PLU ID
- context family
- context type
- canonical object
- downstream route
- confidence
- evidence

### Layer 6: Context Reasoning

Applies procurement context bundles and weighted evidence.

Purpose:

- resolve ambiguity
- distinguish proposal structure from evaluation factors
- distinguish price schedule from price evaluation
- distinguish FAR references from ordinary English usage
- distinguish non-procurement evaluation from source-selection evaluation

### Layer 7: Semantic Pattern Learning

Learns recurring procurement language patterns from canonical evidence.

Purpose:

- discover new aliases
- improve recall
- suggest taxonomy expansion
- reduce manual rule writing over time

### Layer 8: Procurement Knowledge Graph

Stores canonical relationships among:

- opportunities
- agencies
- requirements
- evaluation frameworks
- suppliers
- pricing structures
- clauses
- certifications
- risks
- deliverables
- contract vehicles

### Layer 9: Intelligence Products

Produces commercial intelligence products:

- Supplier Intelligence
- Agency Intelligence
- Opportunity Intelligence
- Pricing Intelligence
- Evaluation Intelligence
- Capture Intelligence
- Renewal Intelligence
- Market Intelligence

## Core V2 Principles

1. Canonical evidence comes before classification.
2. Duplicate evidence must not inflate intelligence.
3. Segmentation comes before semantic reasoning.
4. Context must be classified before intelligence is inferred.
5. Every downstream object must preserve provenance.
6. Unknown language goes to discovery, not deletion.
7. PLU outputs should feed specialized engines wherever possible.
