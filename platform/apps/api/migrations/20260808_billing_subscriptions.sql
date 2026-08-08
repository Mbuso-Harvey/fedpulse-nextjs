-- Stripe-derived billing state is the server-side authority for entitlements.
create table if not exists public.billing_customers (
    user_id uuid primary key references auth.users(id) on delete cascade,
    stripe_customer_id text not null unique,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.billing_subscriptions (
    user_id uuid primary key references auth.users(id) on delete cascade,
    stripe_customer_id text not null,
    stripe_subscription_id text not null unique,
    stripe_price_id text not null,
    tier text not null,
    status text not null,
    current_period_end timestamptz,
    updated_at timestamptz not null default now()
);

alter table public.billing_customers enable row level security;
alter table public.billing_subscriptions enable row level security;

drop policy if exists "Users read own billing customer" on public.billing_customers;
create policy "Users read own billing customer" on public.billing_customers for select using (auth.uid() = user_id);
drop policy if exists "Users read own subscription" on public.billing_subscriptions;
create policy "Users read own subscription" on public.billing_subscriptions for select using (auth.uid() = user_id);
