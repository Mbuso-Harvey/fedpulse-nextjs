# Canonical Warehouse Schema

Created: 2026-06-16 22:47:29

## Purpose

Define the first canonical warehouse design for the Federal Procurement Intelligence Network.

## Fact Tables

### fact_tenders

Grain: One row per tender notice record

Source: CanadaBuys Tender Notices

Fields:

- tender_id
- reference_number
- solicitation_number
- title
- description
- publication_date
- closing_date
- expected_contract_start_date
- expected_contract_end_date
- tender_status
- procurement_category
- procurement_method
- selection_criteria
- limited_tendering_reason
- trade_agreements
- regions_of_opportunity
- regions_of_delivery
- department_id
- unspsc_id
- gsin_id
- notice_url
- source_file
- source_system

### fact_awards

Grain: One row per award notice record

Source: CanadaBuys Award Notices

Fields:

- award_id
- reference_number
- solicitation_number
- contract_number
- title
- description
- publication_date
- award_date
- contract_start_date
- contract_end_date
- contract_amount
- total_contract_value
- currency
- award_status
- instrument_type
- procurement_category
- procurement_method
- selection_criteria
- department_id
- supplier_id
- unspsc_id
- gsin_id
- source_file
- source_system

### fact_contracts

Grain: One row per contract history record

Source: CanadaBuys Contract History

Fields:

- contract_id
- reference_number
- procurement_number
- solicitation_number
- contract_number
- title
- description
- publication_date
- award_date
- amendment_date
- contract_start_date
- contract_end_date
- clean_contract_end_date
- is_placeholder_end_date
- contract_amount
- total_contract_value
- currency
- contract_status
- instrument_type
- amendment_type
- procurement_category
- procurement_method
- selection_criteria
- department_id
- supplier_id
- unspsc_id
- gsin_id
- source_file
- source_system

## Dimension Tables

### dim_departments

- department_id
- department_name
- department_city
- department_province
- department_country
- department_postal_code

### dim_suppliers

- supplier_id
- supplier_legal_name
- supplier_standardized_name
- supplier_operating_name
- supplier_city
- supplier_province
- supplier_country
- supplier_postal_code
- supplier_employee_count

### dim_categories

- category_id
- procurement_category
- category_group

### dim_unspsc

- unspsc_id
- unspsc_code
- unspsc_description

### dim_gsin

- gsin_id
- gsin_code
- gsin_description

### dim_dates

- date_id
- date
- year
- quarter
- month
- month_name
- fiscal_year

## Date Cleaning Rules

The raw data contains placeholder dates such as 9999-09-09, 3103-01-05, 2999-01-01, and 2100-12-31.

The warehouse will keep the original date and also create cleaned analytical dates.

Rule:

If a contract end date is unrealistic, keep `contract_end_date`, set `clean_contract_end_date` to null, and mark `is_placeholder_end_date` as true.
