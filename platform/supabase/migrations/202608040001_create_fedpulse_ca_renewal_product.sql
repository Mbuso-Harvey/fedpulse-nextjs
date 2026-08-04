-- FedPulse Canada Renewal Intelligence product schema.
-- Additive and isolated from unrelated application tables in this Supabase project.

create table if not exists public.fedpulse_product_versions (
    product_id text not null,
    product_version text not null,
    country_code text not null check (country_code in ('CA', 'US')),
    source_system text not null,
    source_resources jsonb not null default '[]'::jsonb,
    coverage_through date,
    generated_at timestamptz not null,
    loaded_at timestamptz not null default now(),
    row_count integer not null check (row_count >= 0),
    dataset_sha256 text not null check (dataset_sha256 ~ '^[0-9a-f]{64}$'),
    status text not null default 'candidate'
        check (status in ('candidate', 'active', 'superseded', 'rejected')),
    reconciliation jsonb not null default '{}'::jsonb,
    metadata jsonb not null default '{}'::jsonb,
    primary key (product_id, product_version)
);

create unique index if not exists fedpulse_one_active_version_per_product
    on public.fedpulse_product_versions (product_id)
    where status = 'active';

create table if not exists public.fedpulse_ca_renewal_candidates (
    product_id text not null default 'ca-renewal-watch'
        check (product_id = 'ca-renewal-watch'),
    product_version text not null,
    record_id text not null check (record_id ~ '^[0-9a-f]{64}$'),
    contract_number text not null,
    supplier_master_id text,
    supplier_master_name text,
    supplier_master_match_status text,
    reference_number text,
    title text,
    buyer_department text,
    procurement_category text,
    award_date date,
    contract_start_date date,
    clean_contract_end_date date,
    days_until_end integer,
    clean_contract_value numeric(20, 2),
    quality_tier text,
    renewal_score numeric(8, 5),
    source_record_id text,
    source_url text,
    row_sha256 text not null check (row_sha256 ~ '^[0-9a-f]{64}$'),
    ingested_at timestamptz not null default now(),
    primary key (product_version, record_id),
    foreign key (product_id, product_version)
        references public.fedpulse_product_versions (product_id, product_version)
        on delete cascade
);

create index if not exists fedpulse_ca_renewals_contract_number_idx
    on public.fedpulse_ca_renewal_candidates (contract_number);
create index if not exists fedpulse_ca_renewals_department_idx
    on public.fedpulse_ca_renewal_candidates (buyer_department);
create index if not exists fedpulse_ca_renewals_supplier_idx
    on public.fedpulse_ca_renewal_candidates (supplier_master_name);
create index if not exists fedpulse_ca_renewals_category_idx
    on public.fedpulse_ca_renewal_candidates (procurement_category);
create index if not exists fedpulse_ca_renewals_end_date_idx
    on public.fedpulse_ca_renewal_candidates (clean_contract_end_date);
create index if not exists fedpulse_ca_renewals_value_idx
    on public.fedpulse_ca_renewal_candidates (clean_contract_value desc);

create or replace function public.fedpulse_activate_product_version(
    p_product_id text,
    p_product_version text
) returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
    if not exists (
        select 1
        from public.fedpulse_product_versions
        where product_id = p_product_id
          and product_version = p_product_version
          and status in ('candidate', 'active')
    ) then
        raise exception 'Unknown or ineligible product version: %/%',
            p_product_id, p_product_version;
    end if;

    update public.fedpulse_product_versions
       set status = 'superseded'
     where product_id = p_product_id
       and status = 'active'
       and product_version <> p_product_version;

    update public.fedpulse_product_versions
       set status = 'active'
     where product_id = p_product_id
       and product_version = p_product_version;
end;
$$;

create or replace view public.fedpulse_ca_renewals_current
with (security_invoker = true)
as
select
    r.product_version,
    r.record_id,
    r.contract_number,
    r.supplier_master_id,
    r.supplier_master_name,
    r.supplier_master_match_status,
    r.reference_number,
    r.title,
    r.buyer_department,
    r.procurement_category,
    r.award_date,
    r.contract_start_date,
    r.clean_contract_end_date,
    r.days_until_end,
    r.clean_contract_value,
    r.quality_tier,
    r.renewal_score,
    r.source_record_id,
    r.source_url,
    r.row_sha256,
    v.country_code,
    v.source_system,
    v.coverage_through,
    v.generated_at,
    v.dataset_sha256
from public.fedpulse_ca_renewal_candidates r
join public.fedpulse_product_versions v
  on v.product_id = r.product_id
 and v.product_version = r.product_version
 and v.status = 'active';

alter table public.fedpulse_product_versions enable row level security;
alter table public.fedpulse_ca_renewal_candidates enable row level security;

comment on table public.fedpulse_product_versions is
    'Version and reconciliation manifest for governed FedPulse intelligence products.';
comment on table public.fedpulse_ca_renewal_candidates is
    'Versioned CanadaBuys-derived renewal candidates. Service-role access only until tenant policies are defined.';
comment on view public.fedpulse_ca_renewals_current is
    'Active, reconciled Canada Renewal Watch product version.';
