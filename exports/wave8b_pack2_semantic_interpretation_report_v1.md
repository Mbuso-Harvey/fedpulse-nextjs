# Wave 8B Pack 2 Semantic Interpretation Report V1

Created: 2026-06-28 17:16:16

## Pack Scope

This pack implements:

- SAM-0008ABF Semantic Eligibility Filter
- SAM-0008ABG Semantic Rule Library Builder
- SAM-0008ABH Semantic Interpretation Engine V2
- SAM-0008ABI Semantic Procurement Object Builder V2
- SAM-0008ABJ Evidence Aggregation Engine
- SAM-0008ABK Semantic Confidence Engine
- SAM-0008ABL Review Queue Optimizer
- SAM-0008ABM Semantic QA & Metrics
- SAM-0008ABN Documentation + Manifest Update

## Input Counts

- Canonical expressions V2: 74
- Expression family member rows: 74
- Semantic object types: 15

## Output Counts

- Eligibility records: 74
- Eligible or review expressions: 46
- Ineligible expressions: 28
- Semantic rules created: 40
- Semantic objects V2: 36
- Interpreted objects: 20
- Uninterpreted objects: 16
- Evidence rows V2: 46
- Confidence rows: 36
- Review queue rows: 36

## Coverage Metrics

- Interpretation coverage: 55.56%
- Review rate: 100.0%

## Eligibility Counts

- eligible: 39
- ineligible: 28
- review: 7

## Semantic Object Type Counts

- Uninterpreted Expression: 16
- Acquisition Metadata: 6
- Pricing Structure: 2
- Technical Requirement: 2
- Supplier Qualification: 2
- Submission Instruction: 1
- Domain Specific Requirement: 1
- Contract Type: 1
- Procurement Role: 1
- Evaluation Factor: 1
- Document Structure Object: 1
- Proposal Structure: 1
- Delivery Requirement: 1

## Domain Counts

- : 16
- Acquisition Strategy: 7
- Commercial and Pricing: 3
- Submission and Proposal Management: 2
- Technical Requirements: 2
- Supplier Eligibility and Qualifications: 2
- Domain-Specific Operations: 1
- Evaluation and Source Selection: 1
- Document Structure and Administrative Forms: 1
- Delivery and Logistics: 1

## Confidence Bands

- medium: 18
- low: 16
- high: 2

## Sample Semantic Objects V2

### SPO2-000001 - Solicitation Amendment

Type: Submission Instruction
Domain: Submission and Proposal Management
Intent: Submission Compliance
Evidence Count: 5
Confidence: 0.902
Lifecycle: reviewed
Governance: ready_for_scoring

### SPO2-000002 - National Cemetery Operations

Type: Domain Specific Requirement
Domain: Domain-Specific Operations
Intent: Domain Requirement
Evidence Count: 6
Confidence: 0.89
Lifecycle: reviewed
Governance: ready_for_scoring

### SPO2-000003 - Solicitation Number

Type: Acquisition Metadata
Domain: Acquisition Strategy
Intent: Acquisition Metadata
Evidence Count: 1
Confidence: 0.777
Lifecycle: candidate
Governance: review_recommended

### SPO2-000004 - Firm Fixed Price

Type: Contract Type
Domain: Commercial and Pricing
Intent: Contract Type
Evidence Count: 1
Confidence: 0.805
Lifecycle: candidate
Governance: review_recommended

### SPO2-000005 - Unit Price

Type: Pricing Structure
Domain: Commercial and Pricing
Intent: Pricing
Evidence Count: 1
Confidence: 0.79
Lifecycle: candidate
Governance: review_recommended

### SPO2-000006 - Contracting Officer

Type: Procurement Role
Domain: Acquisition Strategy
Intent: Procurement Role
Evidence Count: 1
Confidence: 0.802
Lifecycle: candidate
Governance: review_recommended

### SPO2-000007 - Performance Work Statement

Type: Technical Requirement
Domain: Technical Requirements
Intent: Technical Requirement
Evidence Count: 1
Confidence: 0.811
Lifecycle: candidate
Governance: review_recommended

### SPO2-000008 - Evaluation Factors

Type: Evaluation Factor
Domain: Evaluation and Source Selection
Intent: Evaluation Factor
Evidence Count: 1
Confidence: 0.74
Lifecycle: candidate
Governance: review_recommended

### SPO2-000009 - Table of Contents

Type: Document Structure Object
Domain: Document Structure and Administrative Forms
Intent: Document Structure
Evidence Count: 1
Confidence: 0.704
Lifecycle: candidate
Governance: review_recommended

### SPO2-000010 - Past Performance

Type: Supplier Qualification
Domain: Supplier Eligibility and Qualifications
Intent: Supplier Evidence
Evidence Count: 1
Confidence: 0.734
Lifecycle: candidate
Governance: review_recommended

### SPO2-000011 - Request for Information

Type: Acquisition Metadata
Domain: Acquisition Strategy
Intent: Market Research
Evidence Count: 1
Confidence: 0.761
Lifecycle: candidate
Governance: review_recommended

### SPO2-000012 - Administrative Support And Clerical

Type: Uninterpreted Expression
Domain: 
Intent: Needs Review
Evidence Count: 1
Confidence: 0.404
Lifecycle: draft
Governance: needs_review

### SPO2-000013 - Proposal Volume

Type: Proposal Structure
Domain: Submission and Proposal Management
Intent: Proposal Structure
Evidence Count: 1
Confidence: 0.719
Lifecycle: candidate
Governance: review_recommended

### SPO2-000014 - Solicitation Metadata

Type: Uninterpreted Expression
Domain: 
Intent: Needs Review
Evidence Count: 1
Confidence: 0.428
Lifecycle: draft
Governance: needs_review

### SPO2-000015 - Combined Synopsis Solicitation

Type: Acquisition Metadata
Domain: Acquisition Strategy
Intent: Solicitation Method
Evidence Count: 2
Confidence: 0.769
Lifecycle: candidate
Governance: review_recommended

### SPO2-000016 - Small Business Set-Aside

Type: Supplier Qualification
Domain: Supplier Eligibility and Qualifications
Intent: Socioeconomic Eligibility
Evidence Count: 1
Confidence: 0.706
Lifecycle: candidate
Governance: review_recommended

### SPO2-000017 - Amendments Of Solicitations

Type: Uninterpreted Expression
Domain: 
Intent: Needs Review
Evidence Count: 1
Confidence: 0.45
Lifecycle: draft
Governance: needs_review

### SPO2-000018 - Place of Performance

Type: Delivery Requirement
Domain: Delivery and Logistics
Intent: Delivery Logistics
Evidence Count: 1
Confidence: 0.74
Lifecycle: candidate
Governance: review_recommended

### SPO2-000019 - Method of Solicitation

Type: Acquisition Metadata
Domain: Acquisition Strategy
Intent: Acquisition Metadata
Evidence Count: 1
Confidence: 0.718
Lifecycle: candidate
Governance: review_recommended

### SPO2-000020 - Request for Proposal

Type: Acquisition Metadata
Domain: Acquisition Strategy
Intent: Solicitation Method
Evidence Count: 1
Confidence: 0.743
Lifecycle: candidate
Governance: review_recommended

### SPO2-000021 - Statement of Work

Type: Technical Requirement
Domain: Technical Requirements
Intent: Technical Requirement
Evidence Count: 1
Confidence: 0.727
Lifecycle: candidate
Governance: review_recommended

### SPO2-000022 - Award A Contract

Type: Uninterpreted Expression
Domain: 
Intent: Needs Review
Evidence Count: 1
Confidence: 0.432
Lifecycle: draft
Governance: needs_review

### SPO2-000023 - Corps Base Camp Lejeune

Type: Uninterpreted Expression
Domain: 
Intent: Needs Review
Evidence Count: 1
Confidence: 0.38
Lifecycle: draft
Governance: needs_review

### SPO2-000024 - Marine Corps Base Camp

Type: Uninterpreted Expression
Domain: 
Intent: Needs Review
Evidence Count: 1
Confidence: 0.38
Lifecycle: draft
Governance: needs_review

### SPO2-000025 - Army Mil Proposal Default

Type: Uninterpreted Expression
Domain: 
Intent: Needs Review
Evidence Count: 1
Confidence: 0.414
Lifecycle: draft
Governance: needs_review

### SPO2-000026 - Award A Firm Fixed

Type: Uninterpreted Expression
Domain: 
Intent: Needs Review
Evidence Count: 1
Confidence: 0.414
Lifecycle: draft
Governance: needs_review

### SPO2-000027 - Award Will Be Made

Type: Uninterpreted Expression
Domain: 
Intent: Needs Review
Evidence Count: 1
Confidence: 0.414
Lifecycle: draft
Governance: needs_review

### SPO2-000028 - Chess Army Mil Proposal

Type: Uninterpreted Expression
Domain: 
Intent: Needs Review
Evidence Count: 1
Confidence: 0.414
Lifecycle: draft
Governance: needs_review

### SPO2-000029 - Cl Marine Corps Base

Type: Uninterpreted Expression
Domain: 
Intent: Needs Review
Evidence Count: 1
Confidence: 0.378
Lifecycle: draft
Governance: needs_review

### SPO2-000030 - Copies Of The Amendment

Type: Uninterpreted Expression
Domain: 
Intent: Needs Review
Evidence Count: 1
Confidence: 0.414
Lifecycle: draft
Governance: needs_review

### SPO2-000031 - Far And Dosar Provisions

Type: Uninterpreted Expression
Domain: 
Intent: Needs Review
Evidence Count: 1
Confidence: 0.378
Lifecycle: draft
Governance: needs_review

### SPO2-000032 - Food And Drug Administration

Type: Uninterpreted Expression
Domain: 
Intent: Needs Review
Evidence Count: 1
Confidence: 0.378
Lifecycle: draft
Governance: needs_review

### SPO2-000033 - Mil Proposal Default Index

Type: Uninterpreted Expression
Domain: 
Intent: Needs Review
Evidence Count: 1
Confidence: 0.414
Lifecycle: draft
Governance: needs_review

### SPO2-000034 - Renovation Cl Marine Corps

Type: Uninterpreted Expression
Domain: 
Intent: Needs Review
Evidence Count: 1
Confidence: 0.378
Lifecycle: draft
Governance: needs_review

### SPO2-000035 - Request for Quotation

Type: Acquisition Metadata
Domain: Acquisition Strategy
Intent: Solicitation Method
Evidence Count: 1
Confidence: 0.712
Lifecycle: candidate
Governance: review_recommended

### SPO2-000036 - Payment and Invoice

Type: Pricing Structure
Domain: Commercial and Pricing
Intent: Payment Administration
Evidence Count: 1
Confidence: 0.701
Lifecycle: candidate
Governance: review_recommended


## QA Metrics

- source_canonical_expressions: 74 [info]
- eligible_or_review_expressions: 46 [pass]
- ineligible_expressions: 28 [info]
- semantic_rules_created: 40 [pass]
- semantic_objects_v2: 36 [pass]
- interpreted_objects: 20 [pass]
- uninterpreted_objects: 16 [review]
- object_evidence_rows: 46 [pass]
- confidence_rows: 36 [pass]
- review_queue_rows: 36 [info]
- interpretation_coverage_pct: 55.56 [pass]
- review_rate_pct: 100.0 [review]