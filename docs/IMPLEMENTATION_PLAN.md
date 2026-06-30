# CrimeCanada.io — Implementation Plan

Phased build plan for V1. Agents mark items `[x]` when complete, `[ ]` when pending.

**Tech stack (target):** Next.js, TypeScript, Tailwind, Prisma, PostgreSQL, Leaflet or MapLibre. Auth, Stripe, and AI search are **post-V1**.

**Data strategy:** [Unified Source Foundation + Layered Release](./NORTH_STAR.md#unified-source-foundation--layered-release) — preserve and classify all 74 TPS CSV files; publish public UI layer by layer. V1 ingests the Major Crime Open Data 31-column family only. **Do not ingest all 74 files into one schema.** See [TPS_RAW_DATA_INVENTORY_2026-06-30.md](./TPS_RAW_DATA_INVENTORY_2026-06-30.md).

See also: [NORTH_STAR.md](./NORTH_STAR.md), [DATA_SOURCE_PLAN.md](./DATA_SOURCE_PLAN.md), [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md).

**Status note (2026-06-30):** Toronto explorer routes serve **real local processed data** from `data/processed/tps/v1/` (SQLite interim path). PostgreSQL/Prisma ingestion and production deployment data strategy remain pending. See [Local development: TPS V1 processed data](./DATA_SOURCE_PLAN.md#local-development-tps-v1-processed-data).

---

## Phase 0: Repo & Docs Setup

Foundation work before feature development.

- [x] New repo created at `X:\crimecanada`
- [x] Next.js app initialized (Next.js 16, TypeScript, Tailwind)
- [x] Production build passed
- [x] Create planning docs (`NORTH_STAR`, `FINAL_PRODUCT_SPEC`, `IMPLEMENTATION_PLAN`, `DATA_SOURCE_PLAN`, `LEGAL_GUARDRAILS`)
- [x] `docs/` and `Logs/` folders created
- [x] Adopted Unified Source Foundation + Layered Release strategy (2026-06-30)
- [ ] Confirm folder structure conventions (app routes, `data/raw/`, components)

**Exit criteria:** All planning docs in place; repo builds cleanly; no application features started.

---

## Phase 1: Static Shell & Design System

Build the visual foundation and placeholder routes. **No real data yet.**

- [x] Dark dashboard layout shell (header, nav, footer)
- [x] Design tokens: dark background, glass panels, cyan/red/amber accents
- [x] Shared components: glass panel, filter bar, source citation block, empty state (plus MetricCard, DatasetBadge, StatusChip, PreviewBadge, SourceReceipt, DataLayerStack, ExplorerShell, MapPreview, DataTablePreview, AiQueryBar, DisclaimerBlock)
- [x] Placeholder routes for all V1 pages:
  - [x] `/` — landing
  - [x] `/toronto` — explorer hub
  - [x] `/toronto/map` — map placeholder
  - [x] `/toronto/table` — table placeholder
  - [x] `/toronto/search` — search/filter placeholder
  - [x] `/data/sources` — dataset page skeleton (published / deferred / full inventory sections)
  - [x] `/pricing` — pricing placeholder
  - [x] `/api` — API waitlist/docs placeholder
  - [x] Concept routes (clearly labelled future): `/vision`, `/canada`, `/ai`, `/data/layers`
- [x] Responsive layout for desktop-first dashboard (mobile acceptable, not primary)
- [x] Footer with disclaimer and licence attribution copy

### Phase 1 constraints (non-negotiable)

> **Do not build auth, billing, or API keys in Phase 1.**

- No NextAuth, Clerk, or custom login
- No Stripe integration
- No API key generation or management
- No user database

**Exit criteria:** All V1 routes render with consistent dark dashboard styling; navigation works; no backend required.

---

## Phase 2: TPS Raw File Intake

Acquire, inventory, and classify official TPS public data. **No database yet.**

### Completed

- [x] Audit TPS open-data portal; copy full public corpus
- [x] 74 CSV files archived under `data/raw/tps/_downloads/2026-06-30`
- [x] Structural inventory report: [TPS_RAW_DATA_INVENTORY_2026-06-30.md](./TPS_RAW_DATA_INVENTORY_2026-06-30.md)
- [x] V1 public ingestion target defined: **Major Crime Open Data 31-column family** (six files — see [DATA_SOURCE_PLAN.md](./DATA_SOURCE_PLAN.md))

### Remaining

- [x] Organize TPS files into typed source layers **without modifying originals** (classification manifest only — no CSV edits)
- [ ] Move/copy V1 target files into per-dataset archive convention: `data/raw/tps/{dataset-slug}/{YYYY-MM-DD}/`
- [ ] Generate `manifest.json` per archived dataset (see DATA_SOURCE_PLAN)
- [ ] Document dataset fields, update cadence, and licence for V1 family in [DATA_SOURCE_PLAN.md](./DATA_SOURCE_PLAN.md)
- [x] Verify no suspect names, victim names, or mugshots in V1 target dataset fields
- [x] Document V1 field mapping for Major Crime Open Data family (reference inventory identifier facts; see DATA_SOURCE_PLAN normalization table)

**Exit criteria:** Full corpus inventoried and classified by typed layer; V1 target files archived with manifests; no single-schema assumption for all 74 files.

---

## Phase 3a: Universal Source / Dataset Metadata Layer

Wire up persistence for dataset-level metadata. **Do not design one universal incident schema for all 74 files.**

- [ ] Add PostgreSQL (local dev + deployment target)
- [ ] Add Prisma; define schema for metadata layer
- [ ] Core concepts/tables:
  - [ ] `jurisdictions` (V1: Toronto / TPS only)
  - [ ] `datasets` — one row per source file/dataset with typed layer and publish status
  - [ ] `ingestion_runs` — audit trail per ingest attempt
- [ ] Every dataset row tracks:
  - [ ] `source_url`
  - [ ] `dataset_name`
  - [ ] `licence_url`
  - [ ] `dataset_update_date`
  - [ ] `ingestion_timestamp`
  - [ ] `typed_layer` (e.g. `public_incident_records`, `aggregate_metric_tables`)
  - [ ] `publish_status` (`published` | `deferred`)
- [ ] Register all 74 TPS datasets with correct layer classification
- [ ] Mark six Major Crime Open Data files as `published`; all others as `deferred`

**Exit criteria:** All TPS datasets registered in PostgreSQL with provenance and layer classification; no incident rows ingested yet.

---

## Phase 3b: First Public Incident Ingestion — Major Crime Open Data Family

Ingest the six V1 target files into the `public_incident_records` layer.

### Local interim (done — SQLite, not PostgreSQL)

- [x] Define `public_incident_records` schema (SQLite table in `data/processed/tps/v1/tps-v1-v2.sqlite`)
- [x] Normalization rules implemented (see [DATA_SOURCE_PLAN.md](./DATA_SOURCE_PLAN.md)):
  - [x] `OBJECTID` → `source_record_id` (unique within file)
  - [x] `EVENT_UNIQUE_ID` → `event_unique_id` (store; **do not dedupe**)
  - [x] Primary neighbourhood: `HOOD_158`, `NEIGHBOURHOOD_158`
  - [x] Preserve `HOOD_140`, `NEIGHBOURHOOD_140` in `source_fields_json`
  - [x] Map coordinates: `LAT_WGS84`, `LONG_WGS84`; 0,0 rows marked non-mappable
  - [x] All original columns preserved in `source_fields_json`
- [x] Build ingestion script: `scripts/process-tps-v1.mjs` (read raw CSVs → validate → write SQLite + NDJSON)
- [x] Validation script: `scripts/validate-tps-v1.mjs` (581,393 rows; 573,191 mappable; 8,202 non-mappable)
- [x] Idempotent re-run on same source files
- [x] Ingestion output: `manifest.json` with record counts and facets

### Production path (pending — PostgreSQL)

- [ ] Add PostgreSQL ingest from raw archive → upsert records via Prisma
- [ ] PostGIS / geospatial indexing — **deferred post-V1** (use lat/lng columns; exclude 0,0 from map queries)

**Exit criteria (local interim):** Six Major Crime Open Data files queryable locally via SQLite; metadata and `source_fields_json` preserved on every row.

**Exit criteria (production):** Six Major Crime Open Data files queryable in PostgreSQL via Prisma; metadata and `source_fields_json` preserved on every row.

---

## Phase 4: Toronto Explorer / Table / Search

Connect UI to real data from Phase 3b.

- [x] Shared filter state (URL-synced): offence type, date range, neighbourhood, police division
- [x] `/toronto/search` — filter UI wired to query params
- [x] `/toronto/table` — paginated table from SQLite with sort
- [x] Source citation on every table row and page footer
- [x] `/toronto` hub — active filter summary and result count
- [x] Empty states, loading states, error states (including missing processed-data error)
- [x] Server-side pagination and filtering (no client-side full dataset load)

**Exit criteria:** Users can filter and browse Major Crime Open Data records in table view with full source attribution.

---

## Phase 5: Map View

Add geospatial exploration.

- [ ] Choose map library: Leaflet or MapLibre
- [x] `/toronto/map` — render incident markers from filtered query (canvas projection; real mappable data)
- [x] Exclude rows where `LAT_WGS84 = 0` and `LONG_WGS84 = 0` from map markers (still in table/search)
- [ ] Marker clustering for dense areas
- [x] Click marker → detail panel with source citation
- [x] Filter sync: map respects same filters as table/search
- [x] Map empty state when no geocodable records match filters

**Exit criteria:** Map view functional with filter sync; 0,0 rows excluded from markers; no safety heatmaps or danger-zone colouring.

---

## Phase 6: Launch Hardening

Prepare for public traffic.

- [ ] Performance: query indexes, pagination limits, map tile loading
- [ ] SEO/meta tags for public pages
- [ ] `/data/sources` populated with published, deferred, and full-inventory sections (see [FINAL_PRODUCT_SPEC.md](./FINAL_PRODUCT_SPEC.md))
- [ ] Legal copy aligned with [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md) on explorer pages
- [ ] `/pricing` and `/api` placeholder pages reviewed
- [ ] Error boundaries and 404 page styled consistently
- [ ] Accessibility pass: keyboard nav, contrast, table headers
- [ ] Cross-browser smoke test (Chrome, Firefox, Safari)
- [ ] Environment config documented (no secrets in repo)

**Exit criteria:** Site ready for production deployment with documented known limitations.

---

## Phase 7: V1 Launch

Ship it.

- [ ] Deploy to production hosting
- [ ] Production PostgreSQL provisioned; Phase 3a + 3b ingestion run
- [ ] Smoke test all V1 pages in production
- [ ] Verify source citations render correctly in production
- [ ] Document known V1 limitations in README or `/data/sources`
- [ ] Update [STEP_LOG.md](../Logs/STEP_LOG.md) with launch date

**Exit criteria:** CrimeCanada.io V1 live with Toronto Major Crime Open Data explorer accessible to the public.

---

## Explicitly Deferred (Post-V1)

Do not start these until V1 is launched and stable:

| Feature | Notes |
|---------|-------|
| Authentication | NextAuth or equivalent — for saved searches, API keys |
| Billing / Stripe | Paid exports, alerts, AI, API tiers |
| API keys & REST/GraphQL API | Waitlist only in V1 |
| AI search | Must cite sources; see LEGAL_GUARDRAILS |
| PostGIS | Geospatial indexing upgrade |
| Typed layers beyond `public_incident_records` | `sensitive_incident_records`, `traffic_ksi_records`, `calls_for_service_crisis_records`, `aggregate_metric_tables`, `reference_geography_datasets` |
| `external_context_links` / `article_links` | CrimeInToronto future bridge; separate from official public-data ingestion; 0 article records today |
| Multi-city ingestion foundation | jurisdictions + datasets + ingestion_runs pattern; cities per DATA_SOURCE_PLAN priority list (Calgary, Peel, Edmonton, Vancouver, Winnipeg, StatsCan) |
| CrimeInToronto article layer | Premium/context tier; separate ingestion pipeline |
| Data exports (paid) | Placeholder in V1 pricing page only |
| Future data design pass | Cross-dataset navigation, relationships — source-backed only; see NORTH_STAR |

---

## Folder Structure (Target)

```
crimecanada/
├── docs/                    # Planning and spec docs
├── Logs/                    # Agent step log
├── data/
│   ├── raw/
│   │   └── tps/
│   │       ├── _downloads/  # Bulk corpus copy (2026-06-30: 74 files)
│   │       └── {dataset-slug}/
│   │           └── {YYYY-MM-DD}/
│   │               ├── original-file.csv
│   │               └── manifest.json
│   └── processed/
│       └── tps/
│           └── v1/          # Generated locally: manifest.json, SQLite, NDJSON (gitignored)
├── prisma/                  # Phase 3a+
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # UI components
│   └── lib/                 # DB, ingestion, utils
└── scripts/                 # Ingestion scripts (Phase 3b+)
```

---

## Related Documents

- [NORTH_STAR.md](./NORTH_STAR.md)
- [FINAL_PRODUCT_SPEC.md](./FINAL_PRODUCT_SPEC.md)
- [DATA_SOURCE_PLAN.md](./DATA_SOURCE_PLAN.md)
- [TPS_RAW_DATA_INVENTORY_2026-06-30.md](./TPS_RAW_DATA_INVENTORY_2026-06-30.md)
- [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md)
- [../Logs/STEP_LOG.md](../Logs/STEP_LOG.md)
