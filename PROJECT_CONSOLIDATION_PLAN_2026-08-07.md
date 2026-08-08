# FedPulse Project Consolidation Plan

**Created:** 2026-08-07
**Status:** Planning only — no files have been moved, deleted, copied, or rewritten.

## Objective

Make `C:\ProcurementIntelligence` the one canonical FedPulse workspace while retaining provenance, Git history, cloud-sync access, and recoverability. This is a consolidation plan, not authorization to execute it.

## Mapped locations

| Location | What it is | Relationship | Decision |
|---|---|---|---|
| `C:\ProcurementIntelligence` | Primary 3.57-GB FedPulse workspace and Git checkout (`Mbuso-Harvey/fedpulse-nextjs`) | Canonical project root | Keep as canonical root. Do not relocate the existing `data`, `docs`, `exports`, `scripts`, `platform`, or `source` layout yet. |
| `C:\Users\Harvey\OneDrive\ProcurementIntelligence` | Windows symbolic link targeting `C:\ProcurementIntelligence` | Same physical tree, not a duplicate | Keep the link as a OneDrive convenience path. Do not copy, move, deduplicate, or count it twice. |
| `C:\SAMOpportunityIntelligence` | Separate 20-MB Git repository (`Mbuso-Harvey/federal-pursuit-intelligence`) | Related U.S. SAM.gov / bid-no-bid demonstration project, created as a separate application | Preserve as an independent repository. Stage it for relocation under `related-projects` only after its separate Git history and deployment are preserved. Do not merge its code into the FedPulse app. |
| `C:\Users\Harvey\embeddable-analytics-widget` | Standalone 2.22-MB visualization-widget source folder | Candidate visualization dependency referenced by the FedPulse strategy/PR stack | Treat this root copy as the current candidate: it contains one additional, newer approval-rule document. Snapshot and vendor it deliberately; do not hand-copy files into the web app. |
| `C:\Users\Harvey\OneDrive\embeddable-analytics-widget` | OneDrive-synced widget copy | Near-duplicate of the root widget copy | All shared non-`node_modules` files are SHA-256-identical. Preserve as a cloud backup until the canonical snapshot is committed, then archive/remove only with approval. |
| `C:\Users\Harvey\embeddable-analytics-widget.zip` | 20.4-MB widget archive | Historical/distribution archive | Retain as an archive until contents and checksum are compared to the selected canonical widget snapshot. |
| `C:\Users\Harvey\Documents\Codex\2026-08-02\federal-pursuit-intelligence-sites-project-appgprj` | Empty Codex project shell | No project content found | Exclude from consolidation. |
| `C:\ContentIntelligence`, Euronext, CanGrant, AdamCo, Peachabble, VFEX, and other home-directory projects | Separate projects | No evidence found that they are part of FedPulse | Exclude. Do not use name similarity as authorization to move them. |

## Important findings that affect consolidation

1. The OneDrive FedPulse path is a symbolic link to the main root. Moving either endpoint carelessly could break both paths.
2. The widget has two copies. Their shared content matches exactly; the local root copy additionally has `APPROVAL_AUTHORITY_RULE.md` dated 2026-08-03.
3. `C:\SAMOpportunityIntelligence` is not an old copy of the current web app. Its README describes a separate U.S. demonstration product, and its Git history/deployment are separate.
4. The SAM project contains `scripts/sync-procurement-outputs.mjs`, whose default source root is `C:\ProcurementIntelligence` but whose expected legacy `09_knowledge_graph`, `11_intelligence_products`, and `13_autonomous_agents` paths do not exist in the current root. The integration is therefore historical/broken until mapped to current assets.
5. The main workspace already contains the authoritative local pipeline data and historical documentation. Its internal structure is referenced by current code through absolute Windows paths, so a broad internal reorganization would create avoidable breakage.

## Target organization

The target is an umbrella workspace that keeps the active product in place and makes related projects explicit:

```text
C:\ProcurementIntelligence\
├── data\                         # existing source/processed/quality/gold layers
├── docs\                         # existing documentation
│   ├── handoff\                  # future curated handoff and recovery material
│   └── provenance\               # future source/product/dependency manifests
├── exports\                      # historical generated reports
├── platform\                     # existing FastAPI and Next.js application
├── scripts\                      # existing offline pipeline builders
├── source\                       # existing compatibility layer
├── vendor\
│   └── embeddable-analytics-widget\  # selected, versioned widget snapshot
├── related-projects\
│   └── federal-pursuit-intelligence\ # separate nested Git repo; not merged
├── archive\
│   └── external-snapshots\       # dated archives only after checksum verification
└── PROJECT_HANDOFF_RECOVERY_2026-08-07.md
```

`vendor/` and `related-projects/` must not be added to the parent Git repository by accident. The widget needs an explicit vendoring decision; Federal Pursuit Intelligence must remain an independent Git repository or become a deliberate submodule/reference.

## Execution plan — requires separate approval

### Phase 0 — Freeze and manifest

1. Pause editor, sync, and deployment activity for these folders.
2. Capture a manifest for every source location: absolute path, Git remote/HEAD, file count, size, SHA-256 inventory, and current dirty state.
3. Back up the main workspace and the SAM repository independently to immutable storage before moving anything.
4. Record the OneDrive symbolic-link target and confirm it still resolves after each phase.

### Phase 1 — Establish authority

1. Declare `C:\ProcurementIntelligence` the canonical FedPulse root.
2. Keep `C:\Users\Harvey\OneDrive\ProcurementIntelligence` as a link only; do not duplicate it.
3. Classify `C:\SAMOpportunityIntelligence` as a related U.S. demonstration repository, not as mainline FedPulse code.
4. Select the local root widget directory as the candidate source and compare its archive/OneDrive copies before any transfer.

### Phase 2 — Bring related material under the umbrella without merging it

1. Move or clone the widget into `vendor\embeddable-analytics-widget` using a checksum-verified copy first. Preserve its original folder until the copied snapshot builds and its manifest is committed.
2. Move the SAM repository as a whole into `related-projects\federal-pursuit-intelligence`, preserving `.git`, branch state, uncommitted video assets, and its independent remote. Alternatively retain it in place and create a manifest reference if nested repositories are undesirable.
3. Move the ZIP only to `archive\external-snapshots` after validating it is a useful historical artifact; do not discard it solely because a folder copy exists.
4. Add an `EXTERNAL_ASSET_MANIFEST.md` or machine-readable equivalent that records source path, relationship, license/owner, revision/hash, integration status, and intended maintenance model.

### Phase 3 — Reconcile, do not merge blindly

1. Map the SAM repo’s historical input paths to current FedPulse assets, or mark its sync script deprecated. Do not silently redirect it to unrelated CSVs.
2. Decide whether the widget becomes a versioned vendored dependency, a package, or a separately maintained repository. Record the decision, exact revision, license, and update procedure.
3. Add Git ignore rules or submodule configuration before any parent-repository commit to prevent accidental inclusion of nested Git history, `node_modules`, builds, videos, or secret files.
4. Update only the project documentation/configuration that explicitly needs the new location; keep compatibility aliases temporarily when required.

### Phase 4 — Validate and retire duplicates

1. Run checksum comparisons and build/test checks from the new locations.
2. Confirm the FedPulse checkout, OneDrive link, widget build, and SAM repository Git remote all work.
3. Retain source directories as read-only recovery copies for an agreed retention period.
4. Only after written confirmation, remove or archive verified duplicate copies. Credentials, build caches, `node_modules`, `.next`, `__pycache__`, and Codex internal state must be handled separately and never mixed into source consolidation.

## Explicit exclusions

- Do not move `C:\Users\Harvey\.codex`, `.agents`, `.railway`, `.supabase`, browser/app caches, or other tool state into the project.
- Do not move unrelated home-directory scripts or projects (including Euronext, CanGrant, ContentIntelligence, AdamCo, Peachabble, VFEX, or school/cloud folders).
- Do not delete the OneDrive symbolic link.
- Do not delete any original directory, ZIP, or Git metadata during initial consolidation.
- Do not place credentials, `.env` files, or `node_modules` in the main repository.

## Approval gate

Before execution, confirm:

1. The target structure above is acceptable.
2. Whether `Federal Pursuit Intelligence` should be physically moved under FedPulse or remain a linked external repository.
3. Whether the widget should be vendored inside the main Git repository or maintained as a separate dependency repository.
4. The required backup location and retention period for original copies.
