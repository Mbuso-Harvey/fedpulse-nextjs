# Procurement Language Governance V1

Created: 2026-06-24 19:00:15

## Governance Purpose

This document defines how procurement language is classified, normalized, expanded, and audited.

## Core Rules

1. Procurement records are evidence.
2. Raw mention counts are not intelligence.
3. Canonical consolidated records are intelligence.
4. Every classification must preserve source evidence.
5. Context must be classified before intelligence is inferred.
6. Administrative language must not contaminate decision intelligence.
7. Evaluation navigation is not the same as evaluation methodology.
8. Pricing structure is not the same as price evaluation.
9. Proposal structure is not the same as evaluation factor.
10. Absence of extracted evidence is not evidence of absence.

## Classification Flow

Raw Text
    -> Grounded Statement
    -> PLU Context Classification
    -> Canonical Object Match
    -> Confidence Score
    -> Downstream Route
    -> Knowledge Graph

## Discovery Flow

Raw Text
    -> No confident PLU match
    -> Discovery Queue
    -> Analyst Review
    -> Taxonomy Expansion
    -> Pattern Registry Update
    -> Reclassification

## Confidence Bands

- 0.85 to 1.00: High confidence
- 0.65 to 0.84: Medium confidence
- 0.40 to 0.64: Low confidence
- Below 0.40: Review required

## Routing Rules

Evaluation Framework -> Evaluation Intelligence
Evaluation Navigation -> Section Recovery / Document Navigation
Pricing Structure -> Commercial Intelligence
Proposal Structure -> Proposal Intelligence
Supplier Qualification -> Supplier Capability Intelligence
Compliance -> Legal / Risk Intelligence
Technical Requirement -> Technical Capability Intelligence
Metadata -> Document Structure Intelligence
Non-Procurement -> Exclusion Layer

## Quality Requirements

A production-grade PLU layer must measure:

- classification coverage
- unknown context rate
- false positive rate
- confidence distribution
- downstream recovery value
- taxonomy expansion needs

## Target Maturity

The PLU layer reaches production readiness when:

- unknown context rate is below 10 percent
- high or medium confidence classifications exceed 80 percent
- every excluded record has an exclusion reason
- every downstream route is auditable
- taxonomy expansion is repeatable
