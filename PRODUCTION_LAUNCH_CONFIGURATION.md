# Production Launch Configuration

FedPulse is ready to run only when the API process has a durable volume mounted at `FEDPULSE_DATA_ROOT`, the committed Supabase migrations have been applied, and `/api/v1/health/ready` returns `200`.

The production API container is built from `platform/apps/api/Dockerfile`. Run the scheduled worker separately with:

```text
python -m services.scheduled_refresh --market both
```

Use a daily U.S. schedule and a Canada schedule that at minimum follows the monthly C3 publisher refresh; it is safe to run more often because artifacts are immutable and source freshness is enforced.

Required secret/runtime configuration is checked by readiness and must be injected by the deployment platform, never committed:

- Supabase: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_TIER_MAP_JSON`, `FEDPULSE_BILLING_PLANS_JSON`, `STRIPE_ALLOWED_PRICE_IDS`, `CHECKOUT_ALLOWED_HOSTS`
- Official sources: `SAM_GOV_API_KEY`, `CANADABUYS_AWARDS_URL`, `CANADABUYS_CONTRACT_HISTORY_URL`
- Operations: `FEDPULSE_DATA_ROOT`, optionally `SAM_REFRESH_LOOKBACK_DAYS`

Apply these committed database migrations before enabling the corresponding API features:

- `platform/apps/api/migrations/20260808_customer_capability_profiles.sql`
- `platform/apps/api/migrations/20260808_billing_subscriptions.sql`

The runner and readiness endpoint fail closed if these requirements are absent. No manual record-review queue is part of this operating model.
