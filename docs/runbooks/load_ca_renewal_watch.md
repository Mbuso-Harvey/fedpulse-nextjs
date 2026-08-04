# Load Canada Renewal Watch

## Purpose

Validate, reconcile, load, verify, and optionally activate one version of the Canada Renewal Watch product.

The process is fail-closed. No version becomes active unless the source file passes validation and the database row count matches the prepared row count.

## Prerequisites

- Apply `platform/supabase/migrations/202608040001_create_fedpulse_ca_renewal_product.sql`.
- Obtain the authoritative Gold CSV.
- Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- Run from `platform/apps/api` with project dependencies installed.

## 1. Dry-run reconciliation

```bash
python scripts/load_ca_renewals.py \
  /path/to/gold_renewal_candidates_supplier_mastered_v2.csv \
  --product-version ca-renewals-YYYYMMDD-v1 \
  --coverage-through YYYY-MM-DD \
  --expected-count EXPECTED_ROWS \
  --manifest exports/ca-renewals-YYYYMMDD-v1.manifest.json \
  --dry-run
```

Review:

- source and prepared row counts;
- stable-record duplicate count;
- unique contract count;
- total contract value;
- missing values and dates;
- quality-tier counts;
- dataset SHA-256.

Re-run with `--expected-sha256` after recording the accepted source hash.

## 2. Load as a candidate version

```bash
python scripts/load_ca_renewals.py \
  /path/to/gold_renewal_candidates_supplier_mastered_v2.csv \
  --product-version ca-renewals-YYYYMMDD-v1 \
  --coverage-through YYYY-MM-DD \
  --expected-count EXPECTED_ROWS \
  --expected-sha256 ACCEPTED_SHA256 \
  --source-resource 4fe645a1-ffcd-40c1-9385-2c771be956a4 \
  --manifest exports/ca-renewals-YYYYMMDD-v1.manifest.json \
  --no-activate
```

The loader:

1. upserts a candidate product manifest;
2. replaces only records belonging to that product version;
3. loads records in bounded batches;
4. verifies the exact database count;
5. stores the completed reconciliation manifest.

## 3. Activate the verified version

Run the same command without `--no-activate`, or call the database function after independent validation:

```sql
select public.fedpulse_activate_product_version(
  'ca-renewal-watch',
  'ca-renewals-YYYYMMDD-v1'
);
```

Activation supersedes the prior active version and updates `public.fedpulse_ca_renewals_current` atomically.

## 4. Verify production state

```sql
select product_id, product_version, status, row_count,
       dataset_sha256, coverage_through, generated_at, loaded_at
from public.fedpulse_product_versions
where product_id = 'ca-renewal-watch'
order by loaded_at desc;

select count(*) as active_rows,
       count(distinct record_id) as unique_records,
       sum(clean_contract_value) as total_contract_value
from public.fedpulse_ca_renewals_current;
```

Verify the API health endpoint, `/api/v1/ca/renewals/stats`, and a filtered `/api/v1/ca/renewals` request through the deployed path.

## Release blockers

Do not activate when:

- the authoritative source artifact is unresolved;
- the expected source count or hash is unknown;
- stable identities collide;
- the database count differs from the prepared count;
- source coverage cannot be stated;
- quality-tier policy is not satisfied;
- the deployed API reports a different product version or row count.
