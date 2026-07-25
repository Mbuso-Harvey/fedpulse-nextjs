# Sprint 0004 - Raw Data Download

Created: 2026-06-16 20:01:10

## Objective

Download priority official federal procurement CSV datasets.

## Download Strategy

Downloaded high-value aggregate and legacy files first:

- All CanadaBuys records
- Legacy records
- Archived records

Annual files were skipped initially to avoid duplicate loading.

## Files Downloaded

- canadabuys_tender_notices | All CanadaBuys tender notices, 2022-08-08 onwards | 162.58 MB
  - `C:\ProcurementIntelligence\data\raw\canadabuys_tender_notices\all_canadabuys_tender_notices_2022_08_08_onwards.csv`
- canadabuys_tender_notices | Archived, 2009-2022 legacy tender notices | 532.53 MB
  - `C:\ProcurementIntelligence\data\raw\canadabuys_tender_notices\archived_2009_2022_legacy_tender_notices.csv`
- canadabuys_award_notices | All CanadaBuys award notices, 2022-08-08 onwards | 88.96 MB
  - `C:\ProcurementIntelligence\data\raw\canadabuys_award_notices\all_canadabuys_award_notices_2022_08_08_onwards.csv`
- canadabuys_award_notices | Legacy award notices, 2012 to 2022-08 (prior to CanadaBuys) | 257.79 MB
  - `C:\ProcurementIntelligence\data\raw\canadabuys_award_notices\legacy_award_notices_2012_to_2022_08_prior_to_canadabuys.csv`
- canadabuys_contract_history | All CanadaBuys contract history, 2023-06-01 onwards | 50.66 MB
  - `C:\ProcurementIntelligence\data\raw\canadabuys_contract_history\all_canadabuys_contract_history_2023_06_01_onwards.csv`
- canadabuys_contract_history | Legacy contract history, 2009-01 to 2023-05 (prior to CanadaBuys) | 791.9 MB
  - `C:\ProcurementIntelligence\data\raw\canadabuys_contract_history\legacy_contract_history_2009_01_to_2023_05_prior_to_canadabuys.csv`

## Failed Downloads

None.

## Status

Completed.

## Next Sprint

Sprint 0005 - Raw Data Validation and Header Inspection.