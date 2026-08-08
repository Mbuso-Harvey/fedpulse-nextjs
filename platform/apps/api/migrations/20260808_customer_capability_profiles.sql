-- Customer-controlled U.S. bid/no-bid capability data. Apply through the
-- Supabase migration pipeline before enabling the profile API or U.S. release job.
create table if not exists public.customer_capability_profiles (
    profile_id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique references auth.users(id) on delete cascade,
    certifications jsonb not null default '[]'::jsonb,
    clearances jsonb not null default '[]'::jsonb,
    capabilities jsonb not null default '[]'::jsonb,
    version integer not null default 1 check (version > 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.customer_capability_profiles enable row level security;

drop policy if exists "Users read own customer capability profile" on public.customer_capability_profiles;
create policy "Users read own customer capability profile"
    on public.customer_capability_profiles for select
    using (auth.uid() = user_id);

drop policy if exists "Users insert own customer capability profile" on public.customer_capability_profiles;
create policy "Users insert own customer capability profile"
    on public.customer_capability_profiles for insert
    with check (auth.uid() = user_id);

drop policy if exists "Users update own customer capability profile" on public.customer_capability_profiles;
create policy "Users update own customer capability profile"
    on public.customer_capability_profiles for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create or replace function public.set_customer_capability_profile_revision()
returns trigger
language plpgsql
as $$
begin
    new.version = old.version + 1;
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_customer_capability_profile_revision on public.customer_capability_profiles;
create trigger set_customer_capability_profile_revision
    before update on public.customer_capability_profiles
    for each row execute function public.set_customer_capability_profile_revision();
