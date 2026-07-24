# Sprint 0012B - Clean Intelligence Layer V2

Created: 2026-06-17 03:18:16

## Objective

Fix department intelligence by using buyer/end-user department instead of contracting authority.

## Key Change

V1 used contractingEntityName, which collapsed many records into PSPC.

V2 uses:

1. endUserEntitiesName as buyer department when available.
2. contractingEntityName only as fallback.

## Results

- Clean contract rows: 321956
- Duplicates removed: 183246
- Buyer departments: 265
- Suppliers: 39809
- Categories: 4
- Renewal candidates: 4054
- Accepted value rows: 275392
- Zero/missing value rows: 46564
- Extreme value rows: 0

## Outputs

- data\quality\clean_contracts_v2.csv
- data\quality\canonical_buyer_departments_v2.csv
- data\quality\canonical_suppliers_v2.csv
- data\warehouse\clean_department_intelligence_v2.csv
- data\warehouse\clean_supplier_intelligence_v2.csv
- data\warehouse\clean_category_intelligence_v2.csv
- data\warehouse\clean_renewal_candidates_v2.csv

## Status

Completed.
