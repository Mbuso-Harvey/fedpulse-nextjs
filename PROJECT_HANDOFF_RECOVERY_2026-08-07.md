# FedPulse Project Handoff and Recovery Assessment

**Assessment date:** 2026-08-07
**Mode:** Evidence-based, no implementation changes
**Scope:** Local workspace, Git history, GitHub repository, configuration, tests, generated artifacts, and configured deployment endpoints.

## 1. Executive summary

FedPulse began as a CanadaBuys data-engineering project intended to become the “Bloomberg for Canadian federal procurement intelligence.” It acquired official Canadian tender, award, and contract-history extracts; transformed them into canonical warehouse CSVs; then built supplier, department, and renewal-oriented derived products. A later experimental U.S. track added SAM.gov document/requirement, graph, and AI-agent prototypes.

The current **authoritative product direction** is the GitHub `master` strategy accepted on 2026-08-03: an API-first, conversational procurement-intelligence platform with deliberately separate Canada and U.S. products. The first shippable product is Canada Renewal Watch, followed by grounded Ask FedPulse Canada. See GitHub commit `0381bb9` and the remote strategy documents listed below.

The project is **not production-ready today**. Its strongest real assets are the local Canada data products and the extensive offline pipeline/artifact corpus. The web/API application is a useful prototype and test harness, but it is not yet a reliable implementation of the accepted strategy: the configured Railway deployment returns HTTP 502; authentication and billing can fail open or mock success; several UI/API contracts disagree; the visible Ask FedPulse paths are mock or disconnected; and the recorded “production certification” documents validate generated registries rather than the live application.

The recommended path is **not a rewrite**. Preserve the Canada pipeline and renewal product as assets, then establish one reproducible, versioned Canada product release, secure the small FastAPI surface around it, reconcile the web client, and only then decide whether to land the stacked GitHub PRs. Do not extend the dashboard/agent surface before this foundation exists.

## 2. Evidence, authority, and present-state split

| Evidence source | What it establishes | Authority |
|---|---|---|
| GitHub `master` | Accepted product strategy and current remote baseline as of 2026-08-03 | Authoritative for intended direction |
| Local Git `master` (`42d2479`) | July UI/API prototype baseline | Stale relative to GitHub; local `origin/master` has not been fetched since before the strategy merge |
| Local dirty/untracked worktree | Later Phase-5-style implementation/recovery work | Potentially valuable, but no commit/review provenance; do not treat as release-ready |
| `data/`, `scripts/`, `docs/`, `exports/` | Offline pipeline history, datasets, registries, and generated reports | Authoritative evidence of historical work, not proof of current runtime/deployment health |
| Local focused tests and TypeScript typecheck | Local fallback path behavior | Evidence only for the tested local path |

### Important repository facts

- GitHub repository: `Mbuso-Harvey/fedpulse-nextjs`, public, default branch `master`.
- GitHub has no issues and four open, mergeable, stacked PRs: #2 foundation, #3 Canada data reconciliation, #4 governed visualization contract, and #5 Ask FedPulse tool execution. Their merge order must be #2 → #3 → #4 → #5.
- GitHub `master` contains the merged strategy/documentation change from PR #1, but this local checkout does not. The local branch and its `origin/master` both stop at `42d2479` (2026-07-25); the remote strategy commit is `0381bb9` (2026-08-03).
- The local worktree is materially dirty: tracked files are modified/deleted and about 693 files are untracked. Those changes must be inventoried and committed or discarded deliberately; they must not be mixed casually with the PR stack.
- There is no checked-in GitHub Actions workflow on the local or remote `master` baseline. PR #2 introduces a read-only API workflow, and PR #4 adds a web visualization workflow, but neither is merged.

### Document-reading addendum (2026-08-07)

The local written record was re-inventoried before any further recommendation. It contains 239 project documents under `docs/` (architecture, product, operations, data engineering, historical build logs), 106 generated Markdown/text reports under `exports/`, and a separate set of prior agent-work records. The governing, product, architecture, operating, historical, and generated-report sets were examined as a hierarchy rather than treated as equally authoritative.

**The evidenced product identity is:** a commercial, evidence-backed procurement decision-intelligence platform. Its purpose is not to expose public records, generate generic dashboards, or let an LLM improvise procurement advice. It converts official evidence into canonical records and governed meaning, then into repeatable products that help customers decide where to pursue, target, prepare, or review.

The source record establishes three compatible but distinct layers:

1. **Canada data product:** official CanadaBuys tender, award, and contract-history data; supplier/department mastering; and the commercially prioritized Renewal Watch/Expiry Intelligence product for contractors. This is the original operational data asset and the designated first production decision product.
2. **U.S. document-intelligence research track:** SAM.gov opportunities and solicitation documents; requirements, evaluation, PLU, semantic-object, graph, and controlled decision-support experiments. It is valuable research, but it is not interchangeable with Canada data and cannot substantiate a live Canada product.
3. **Shared governed core:** evidence preservation, canonicalization, provenance, explainability, confidence, registry/discovery review, APIs, authentication, auditability, and visualisation as a last-mile rendering concern.

The later GitHub strategy is the operative decision when documents disagree. It confirms the two source-specific products and their shared governed core, explicitly says Canada Renewal Watch launches first, and forbids generic chat, blended-country data, ungrounded claims, placeholder evidence, and breadth before a repeatable customer decision is reliable.

**Working authority order for future changes:**

1. Explicit newer accepted decision on GitHub `master` (the 2026-08-03 API-first strategy and its linked architecture/roadmap).
2. Constitutional principles: evidence first, provenance always, canonical before semantic, explainable intelligence, evidence-backed graph relationships, commercial alignment, and non-binding decision support at consequential boundaries.
3. Source-specific product specifications and approved data-product/release evidence.
4. Historical build logs and generated reports as evidence of past work only.
5. Existing code, handoffs, tests, filenames, and `certified`/`ready` labels as claims to verify—not product authority.

This reading changes no prior risk finding; it strengthens the conclusion that the next work must be a controlled, evidence-bearing Canada Renewal Watch release, not another broad dashboard, LLM, or U.S.-feature expansion.

## 3. Project history

### Facts supported by dated artifacts

1. **June 16–18: Canada warehouse and first commercial intelligence products.**
   - Official CanadaBuys tender, award, and contract-history files were downloaded (`docs/history/build_logs/sprint_0004_raw_data_download.md`).
   - Canonical warehouse design followed (`sprint_0007_canonical_warehouse_schema.md`), then processed data: 99,357 tenders, 132,301 awards, and 505,202 contracts (`sprint_0008_processed_procurement_datasets.md`).
   - The first intelligence layer reported 412 department rows, 68,323 supplier rows, and 6,926 renewal candidates (`sprint_0009_intelligence_layer_v1.md`).
   - A V2 cleanup changed the buyer-department rule and reported 4,054 renewal candidates (`sprint_0012b_clean_intelligence_layer_v2.md`).

2. **June 17–July 12: supplier resolution, procurement-language/graph, and generated release waves.**
   - The workspace contains scripts and registries for supplier mastering, canonical evidence, semantic classification, graph construction, intelligence products, autonomous agents, and Waves 8B–14.
   - The Wave 12–14 reports claim a frozen/certified Version 1.0. Their checks are largely registry/artifact checks, not evidence that the current FastAPI/Next.js deployment serves those products.

3. **July 24–25: web/API prototype and commercial UI work.**
   - Git began with a UI commit (`58f9708`) and followed with styling, billing-client, Vercel-build, and broad “GTM hardening” commits.
   - The local app gained a FastAPI layer backed by CSV/SQLite fallbacks, Supabase/Stripe hooks, a Next.js dashboard shell, test harnesses, and later uncommitted SQLAlchemy/Celery/Neo4j/analyst additions.

4. **August 3 onward: strategic reset and unmerged implementation stack.**
   - The remote strategy declares FedPulse an API-first conversational platform and makes Canada Renewal Watch the first production decision product.
   - PR #2 implements an API foundation, #3 a versioned Canada product loader/reconciliation design, #4 a governed visualization contract, and #5 typed Ask FedPulse execution. They remain open and are not present in the deployed/master code path.

### Strong inferences

- The “Wave” sequence was an offline artifact-generation program, while the GitHub application repository was created later as a separate commercialization/demo surface. They were never fully reconciled into one deployable product.
- The U.S. SAM.gov/agent work is exploratory/prototype work, not a production U.S. product. Its use of placeholder data and keyword extraction supports this conclusion.

### Unknowns

- Which data snapshot, calculation rules, and coverage date are approved for external Canada Renewal Watch use.
- Whether Supabase, Railway, Vercel, Stripe, Redis, Neo4j, and SAM.gov accounts are still configured and owned by the intended team.
- Whether the local dirty worktree was an intentional handoff, an interrupted implementation, or a mixture of experiments.

## 4. Product and architecture reconstruction

### Product promise

The enduring customer problem is helping government contractors, capture teams, and advisers identify upcoming procurement decisions—especially renewal opportunities—early enough to act, with defensible evidence. The original Canada product focuses on buyers, suppliers/incumbents, contract expiries, and target opportunities. The accepted strategy adds a separate U.S. bid/no-bid and compliance path.

### Current local architecture

```text
CanadaBuys CSV archives (local, ~3.4 GB)
  → Python batch scripts in scripts/
  → processed / quality / gold CSV products
  → DataService startup seed into SQLite, or attempted Supabase read
  → FastAPI routes under /api/v1
  → Next.js dashboard client
  → configured Railway API URL / Vercel rewrite

SAM.gov samples / live endpoint (prototype)
  → Celery task or synchronous fallback
  → Renewal + Requirement SQLAlchemy tables
  → static/offline graph and rule-based/optional-LangChain analyst
  → prototype pages and mock Q&A routes
```

### Component map

| Area | Location | Observed responsibility | Assessment |
|---|---|---|---|
| Raw/derived data | `data/` | CanadaBuys raw extracts and CSV layers | Valuable local asset; not versioned in Git/release storage |
| Offline pipeline | `scripts/` | Warehouse, mastering, renewal, semantic/graph, reporting builders | Broad and historically documented; script-run reproducibility not revalidated in this assessment |
| Historical product data | `docs/`, `exports/` | Product specifications, registries, wave reports | Strong context, but many claims conflict with application code |
| API | `platform/apps/api/` | FastAPI, SQLAlchemy, route handlers, auth/billing adapters | Prototype/partial production foundation |
| Web app | `platform/apps/web/` | Next.js 16 dashboard, auth shell, marketing, workspaces | Visually broad prototype; many pages use mock data or mismatched API contracts |
| Compatibility layer | `source/` | Thin re-exports of `platform/apps/api` modules | Duplication/legacy compatibility, not an independent service |
| Tests | `tests/`, `pytest.ini`, `scripts/run_e2e_tests.py` | Local API fallback testing | Useful, but does not validate live integrations or browser journeys |
| Deployment | `platform/apps/api/render.yaml`, `Procfile`, web `vercel.json` | Render, Railway, and Vercel configuration references | Conflicting/incomplete topology |

### Storage, auth, and integrations

- **Storage:** CSV files are the effective local source of truth. The API starts with SQLite unless `DATABASE_URL` is set; it can read Supabase only when configured. No versioned migration is on `master`.
- **Auth:** Next.js uses Supabase when browser variables exist; otherwise it creates a development user. API auth accepts a subscription-tier header and falls back to a professional trial user if Supabase or credentials are absent.
- **Billing:** Stripe checkout/webhook scaffolding exists, but absent credentials return mock success; subscription status is static.
- **Background processing:** Celery/Redis configuration exists, but the pipeline route directly invokes the task and falls back to a fabricated successful queue response on exceptions.
- **Graph/AI:** Neo4j and LangChain/OpenAI are optional. Tests exercise in-memory/offline graph behavior and heuristic SQL synthesis, not a live graph or grounded model workflow.

## 5. Current-state matrix

| State | Findings and evidence |
|---|---|
| **Working locally** | Local Canada Gold input exists: `gold_renewal_candidates_supplier_mastered_v2.csv` has 4,050 data rows; focused API tests passed 26/26 on 2026-08-07 in an isolated SQLite DB; `npm exec -- tsc --noEmit` passed. Basic renewal aggregation, offline graph responses, and guarded local SQL queries execute in that fallback environment. |
| **Partially working** | FastAPI routes, CSV/SQLite seeding, Supabase/Stripe/Neo4j/Celery adapters, Next.js middleware, and dashboard data views exist, but use fallbacks, mocks, hard-coded paths, or unverified external dependencies. The historical 32-test run passed on 2026-07-25, but it validates the local process and includes mocked/offline behavior. |
| **Not working / failed now** | The configured Railway API (`fedpulse-api-production.up.railway.app`) returned HTTP 502 for root and health on 2026-08-07. `AskFedPulseView` posts to nonexistent `/api/ai-qa`, while the web API route is `/api/qa` and returns a different payload shape. The billing page calls the TypeScript API client’s obsolete `/checkout` route, not the FastAPI billing route. |
| **Planned, not landed** | The remote PR stack’s secure API foundation, versioned Canada product loader, visualization contract/widget, and governed Ask FedPulse tool execution. These are open GitHub work, not part of `master`. |
| **Legacy / possibly obsolete** | The `source/` proxy modules; hard-coded Windows filesystem paths; two competing API clients (`src/lib/api.js` and `api.ts`); broad dashboard pages that do not map to the accepted decision-first product; Wave certification claims and registries that do not reflect actual routes. |
| **Unknown** | Live databases, deployment ownership/configuration, source-refresh cadence, production credentials, legal source-data terms, backup/restore, and customer usage. |

## 6. Documentation-versus-code discrepancies

1. **“Production API ready/certified” is contradicted by routes and deployment.** `docs/architecture/api/production_api_manifest_v1.json` lists active `/api/v1/ask`, `/api/v1/opportunity/intelligence`, `/api/v1/graph/analytics`, and `POST /api/v1/recommendations`; `platform/apps/api/main.py` does not mount those routes and `routers/recommendations.py` is `GET`. The configured live API is 502.
2. **Security claims are contradicted by code.** The manifest claims auth, rate limiting, and audit logging are enabled. `services/auth.py` accepts a caller-controlled tier header and falls back to a privileged dev user; no rate-limiting or audit middleware is present.
3. **Remote direction is absent from local checkout.** Remote `master` has the accepted API-first strategy, while local docs retain a July dashboard/MVP current state and lack all three canonical strategy documents.
4. **Counts are not one release.** V1 documents cite 6,926 renewal candidates; V2 warehouse documentation cites 4,054; the current Gold file used by local config contains 4,050. These are explainable pipeline snapshots, but no release manifest proves which is approved.
5. **The latest handoff is stale.** `handoff_manifest.md` says deployment and database migration are outstanding, calls the backend “10+ endpoints, all verified,” and points to artifacts that are not available at the paths it names. It predates the August strategic reset.
6. **Client and API contracts drift.** The primary TypeScript client expects different request/filter and response field names from those returned by the FastAPI renewal endpoints; the JS client preserves yet another endpoint set.

## 7. Risk register

| Severity | Risk | Evidence | Consequence | Recommended action |
|---|---|---|---|---|
| **P0** | Credential exposure | A tracked root credential file exists, and `tasks/ingestion_tasks.py` has a hard-coded fallback credential. Values are intentionally omitted here. | Unauthorized third-party API use and repository-secret exposure. | Revoke/rotate affected credentials, remove from Git history and source, use managed secrets, and add secret scanning before any deployment. |
| **P0** | Authentication/entitlement fails open | `services/auth.py`; `auth-context.tsx`; `lib/supabase/middleware.ts` | Unauthenticated users can receive privileged local access; caller controls tier via header. | Make production auth/tenant/entitlement checks fail closed and cover them with negative integration tests. |
| **P0** | Live API unavailable | Railway root and `/api/v1/health` returned 502 on 2026-08-07; client defaults to that hostname. | Reference application cannot reliably function. | Inspect Railway service/build logs, variables, start command, and deployment health before feature work. |
| **P0** | Product/data provenance unreconciled | Gold file is local/untracked; PR #3 reported no authoritative CSV available; counts/rules differ across documents. | Unsupported commercial claims and irreproducible results. | Create an approved Canada product manifest with source hash, row count, coverage, calculation version, acceptance record, and activation process. |
| **P0** | Canada/U.S. and real/mock data are mixed | Canada brand/data coexist with SAM.gov pipeline, U.S. mock data, Gemini mock Q&A, and placeholder graph content. | Incorrect customer claims and leakage of invalid assumptions into answers. | Establish `/ca`, `/us`, and shared-core boundaries before adding features. |
| **P1** | Web/API contract drift | `api.ts`, `api.js`, renewal page, billing page, `AskFedPulseView`, API routers. | Pages can build but fail or silently show empty/mock data at runtime. | Replace duplicate clients with generated/typed contracts and add browser/API contract tests. |
| **P1** | Mock success hides failed integrations | `routers/pipeline.py`, `routers/billing.py`, web QA route, dashboard pages. | Operators and users can mistake simulated data/actions for real activity. | Make production unavailable/error states explicit; confine fixtures/mocks to tests and development. |
| **P1** | Portability/deployment conflict | `config.py` has `C:/ProcurementIntelligence` paths; `render.yaml`, Railway URL, Vercel rewrite, Docker/Procfile disagree. | Container deployments lack data or use an unintended topology. | Select one production topology and data store; configure paths exclusively through validated environment/config. |
| **P1** | Tests overstate readiness | Tests pass against isolated SQLite/offline fallbacks; no merged CI; historical reports certify registries. | False confidence in external services, security, and production behavior. | Add CI, contract tests, authenticated integration tests, deployment smoke checks, and evidence-backed acceptance tests. |
| **P2** | Maintainability drag | `source/` proxies, two API clients, JS/TS page duplicates, uncommitted bytecode/build artifacts. | Higher regression risk and unclear ownership. | Stabilize first, then remove/relocate only proven obsolete compatibility code in small reviewed changes. |

## 8. Recommended roadmap

### P0 — Must resolve before further product development

1. Quarantine and inventory the dirty worktree; do not merge it with the GitHub PR stack.
2. Revoke/rotate the exposed SAM.gov credential and eliminate the tracked credential file/hard-coded fallback through a controlled security change.
3. Diagnose the Railway 502 and document the actual deployed commit, service, region, build/start logs, variables (names only), and rollback position.
4. Define and activate one approved Canada Renewal Watch data product: source files, SHA-256, 4,050-vs-4,054 reconciliation, source coverage date, rules, and owner.
5. Make API auth, tenant scope, and entitlements fail closed; remove header-controlled tiers and dev-user production fallback.
6. Choose a single production data topology and move configuration off Windows-only filesystem assumptions.

### P1 — Stabilize the existing product

1. Create a minimal versioned `/api/v1/ca/renewals` contract with evidence/freshness/quality metadata and explicit unavailable states.
2. Reconcile the Next.js client to that one contract, starting with Canada Renewal Watch; remove mock headline values from its production path.
3. Repair the billing and Q&A route mismatches, but keep billing/AI disabled rather than mocked until their real authorization/evidence paths are ready.
4. Merge a CI baseline with lint, typecheck, unit/contract tests, secret scanning, and deployment smoke tests.
5. Add observability: structured logs, request IDs, data-product version, readiness state, and error reporting.

### P2 — Complete the intended product

1. Evaluate and, if aligned, land PR #2 then #3 after independent review and data-asset reconciliation.
2. Build the decision-first Canada Renewal Watch experience from the production API; add saved analyses/watchlists only when tenant-scoped storage exists.
3. Review/land PR #4 only after the API supplies governed field semantics/evidence; then PR #5 only after the active Canada product is reconciled.
4. Implement alerts/reports/outcomes from versioned product changes, not static files.

### P3 — Improve/optimize

1. Consolidate compatibility modules and duplicate JS/TS API clients.
2. Rationalize the broad dashboard into decision workspaces based on user evidence.
3. Resume U.S. SAM.gov ingestion, requirement intelligence, and bid/no-bid only as a separate product program with document provenance.

### Explicitly do not do yet

- Do not rewrite the Canada pipeline or replace the application wholesale.
- Do not merge all four PRs as a batch.
- Do not expose public APIs, production billing, AI advice, or customer claims while data, auth, and evidence controls are unresolved.
- Do not expand charts, agents, dashboards, or U.S. features to mask the foundation gap.

## 9. Immediate next actions

1. Create a safe branch/worktree or archive of the current uncommitted state; record exactly which files belong to which unfinished effort.
2. Rotate the exposed credential and prepare a dedicated security remediation PR.
3. Inspect Railway service logs and configuration to determine the 502 root cause and deployed revision.
4. Fetch remote `master` into a separate worktree and compare it with the local July baseline; retain the remote strategy docs locally.
5. Produce a signed Canada data-product manifest for the Gold Renewal Watch input and reconcile 4,050/4,054/6,926 counts.
6. Decide whether PostgreSQL/Supabase is the production store; write a migration/loading/reconciliation runbook before changing application behavior.
7. Implement or review fail-closed auth/entitlements and a minimum `/api/v1/ca/renewals` contract.
8. Add contract tests that prove the Renewal Watch UI uses actual API fields, filters, and unavailable states.
9. Repair the deployment only after its data source and required configuration are known.
10. Review PR #2 independently, then proceed through the stack one PR at a time with the prior PR merged and validated.

## 10. Validation performed in this assessment

- Read-only workspace, Git, documentation, configuration-name, data-layout, and GitHub inspection.
- GitHub repository metadata, branches, PRs, and issues inspected through the GitHub integration.
- Focused API unit tests: **26 passed** (`tests/unit/test_ai_analyst_sqlagent.py` and `tests/unit/test_neo4j_graph_service.py`) against a temporary isolated SQLite database.
- Web TypeScript check: **passed** (`npm exec -- tsc --noEmit`).
- Configured Railway health/root probes: **HTTP 502**.

The tests prove local fallback behavior only. They do not prove Supabase, Stripe, Celery/Redis, Neo4j, SAM.gov, Vercel, Railway, or real browser workflows.

## 11. Canonical references going forward

- Remote strategy: `docs/product/strategy/api_first_conversational_procurement_intelligence.md` on GitHub `master` (not present in local checkout).
- Remote architecture: `docs/architecture/product/ask_fedpulse_visual_intelligence_architecture.md` on GitHub `master`.
- Remote roadmap: `docs/product/roadmap/api_first_conversational_implementation_plan.md` on GitHub `master`.
- Current local historical context: `docs/README.md`, `docs/history/build_logs/`, `handoff_manifest.md`, `PROJECT.md`, and `test_results.json`.

This document supersedes neither the accepted remote product strategy nor historical evidence. It is the recovery map needed to reconcile them with the actual code and deployment state.

## 12. Product-owner commercial-priority clarification (2026-08-07)

The product owner clarified after this assessment that FedPulse is a commercial-validation business, not a research or demonstration project, and that the U.S. federal market is the higher-priority revenue opportunity. This is an explicit prioritisation decision that overrides the earlier default sequencing assumption that Canada must be the first commercial focus.

Accordingly, the operating objective is to validate sellable U.S. and Canadian decision products in parallel, with the U.S. track receiving commercial-priority attention but Canada remaining an active product track—not a deferred data asset or prerequisite. The most commercially direct U.S. wedge remains a tightly scoped, evidence-backed **Bid / No-Bid and Compliance Analyst** for SAM.gov opportunities; the Canadian wedge remains **Renewal Watch**. Neither requires a broad portal, generic chatbot, or agent suite.

The constitutional controls still apply unchanged: official-source evidence, source-native U.S. schema and terminology, canonicalization before semantic interpretation, provenance, explainability, confidence/limitations, non-binding decision support at consequential boundaries, real freshness, and no fabricated integration success. Commercial speed means reducing scope to a paid decision outcome and measuring willingness to pay; it does not mean relaxing the evidence standard that differentiates the product from free search tools.

**Revised commercial sequence:**

1. Validate U.S. and Canadian customer segments, urgent workflows, price hypotheses, and buyer access before expanding either feature surface.
2. Establish reliable, separate SAM.gov and CanadaBuys evidence-ingestion/versioning paths; remove exposed credentials and all fabricated/mocked production-success paths.
3. Ship authenticated, source-traceable U.S. Bid / No-Bid / Compliance and Canada Renewal Watch decision workflows behind documented country-scoped APIs and reference interfaces.
4. Use pilots, paid design partners, usage, conversion, and decision outcomes to determine the next workflow in each market.
5. Share governance and platform services without blending countries, source semantics, or commercial claims.

The detailed source selection, extraction model, and release-quality gates are in `DUAL_MARKET_SOURCE_QUALITY_PLAN_2026-08-07.md`.
