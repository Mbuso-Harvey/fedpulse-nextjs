# Wave 9 Graph Integrity Governance V1

Created: 2026-06-29 11:35:33

## Purpose

This governance document defines the graph integrity gate for the Federal Procurement Intelligence Network.

## Publication Status

certified_for_graph_publication

## Integrity Standards

A graph may be certified for publication when:

- Node and edge structural checks have no hard failures.
- Edge source and target references resolve to valid nodes.
- Duplicate edges are controlled.
- The graph has meaningful connectivity.
- Weak-confidence edges are identified for review.
- Lineage records exist for graph nodes.

## Current Metrics

- Nodes: 29
- Edges: 44
- Connected components: 8
- Largest component size: 22
- Graph density: 0.0542
- Weak edges: 1
- Hard failures: 0
- Review items: 37

## Governance Rule

Graph nodes and edges may proceed to Wave 9 export and knowledge product staging only if publication status is certified or conditional.
