# Wave 9 Graph Export Governance V1

Created: 2026-06-29 15:40:03

## Purpose

This document governs the export and distribution layer for the Federal Procurement Knowledge Graph.

## Release Status

wave9_graph_export_certified

## Graph Version

KG-1.0

## Export Formats

The graph is exported in the following formats:

- Canonical node CSV
- Canonical edge CSV
- Neo4j bulk import CSV
- GraphML
- JSON graph
- RDF N-Triples
- Semantic search index
- AI semantic context JSON

## Governance Rules

1. No export may be certified unless graph publication readiness has been certified.
2. Node and edge row counts must match source graph records.
3. AI context must preserve node identity, type, domain, and relationship context.
4. Search index must include one searchable record per node.
5. Neo4j exports must preserve node IDs and relationship types.
6. RDF exports must preserve node properties and relationship triples.
7. Every export release must include a release manifest and QA artifact.

## Certification

QA pass: 9
QA review: 0
QA fail: 0

Status:

wave9_graph_export_certified
