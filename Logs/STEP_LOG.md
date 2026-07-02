# CrimeCanada.io — Step Log

Chronological checklist for agents working on this repo.

Use `[x]` for completed items and `[ ]` for pending items. Add new entries at the bottom with date when significant work is done.

---

## Completed

- [x] New repo created at `X:\crimecanada`
- [x] Next.js app initialized (Next.js 16, TypeScript, Tailwind)
- [x] Production build passed
- [x] `docs/` and `Logs/` folders created
- [x] Create planning docs (`NORTH_STAR`, `FINAL_PRODUCT_SPEC`, `IMPLEMENTATION_PLAN`, `DATA_SOURCE_PLAN`, `LEGAL_GUARDRAILS`)
- [x] TPS raw files copied into repo (`data/raw/tps/_downloads/2026-06-30`, 74 CSV files)
- [x] TPS raw data inventory report (`docs/TPS_RAW_DATA_INVENTORY_2026-06-30.md`)
- [x] Adopted **Unified Source Foundation + Layered Release** strategy (docs update 2026-06-30)
- [x] TPS typed source layer classification manifest (`docs/TPS_TYPED_SOURCE_LAYER_PLAN_2026-06-30.md`)
- [x] Organize TPS files into typed source layers without modifying originals (manifest-only; see typed source layer plan)
- [x] Relocated misplaced Major Crime Indicators CSV into `_downloads/2026-06-30`; removed empty `major-crime-indicators/` folders
- [x] Phase 1: Static shell and design system — dark dashboard shell, design tokens, reusable components, all V1 routes plus four labelled concept routes (UI foundation pass)
- [x] Product/UI architecture design doc (`docs/PRODUCT_UI_ARCHITECTURE_2026-06-30.md`) covering the 10 data/UI models
- [x] TPS V1 local processing scripts: `scripts/process-tps-v1.mjs`, `scripts/validate-tps-v1.mjs`
- [x] TPS V1 real local data wired: 6 datasets → `data/processed/tps/v1/` (581,393 rows; 573,191 mappable; 8,202 non-mappable; 31 source fields)
- [x] Toronto explorer (`/toronto`, `/toronto/table`, `/toronto/map`, `/toronto/search`) reads processed SQLite via server-side queries
- [x] Ask Bar → Living Answer prototype (`/toronto/ask`) compiles plain questions into reproducible TPS filters without AI
- [x] TPS Ask Bar field/scope audit completed; confirmed current Ask filters and identified out-of-jurisdiction broad-query risk
- [x] Document local TPS V1 data generation and production limitation (`docs/DATA_SOURCE_PLAN.md` — Local development section)
- [x] Multi-jurisdiction raw collection/source-freeze recorded for TPS, Peel, York, Durham, Halton, and Hamilton
- [x] YRP pre-2025 historical source discovered and exported locally: official York Regional Police ArcGIS historical occurrence layer `Occurrence_Data_2020_to_2023/FeatureServer/0`; exported 177,331 rows for 2021-01-01 through 2024-12-31 to `data/raw/yrp/community-safety/incidents/pre-2025/2026-07-02/`
- [x] Durham DRPS pre-2025 deep search completed: no separate public historical incident archive found; exported 118 caveated current-layer rows where `occ_date < 2025-01-01` to `data/raw/durham-drps/community-safety/incidents/pre-2025/2026-07-02/`
- [x] Halton HRPS pre-2025 check completed: official `Crime_Map/FeatureServer/0` returned 0 pre-2025 rows; no separate usable historical incident FeatureServer found; no export created
- [x] Peel PRP pre-2023 check completed: official `Experience_gdb/FeatureServer/0` real date fields `OccDate` and `OccDateUTC` returned 0 pre-2023 rows; Calls for Service app/web map exposed no usable service URLs; no export created
- [x] Hamilton CommunityCrimeMap local audit completed: full `2000-to-2026` export treated as raw-only/noise for historical use; cleaned HPS-only file is limited but usable for selected hard-crime categories from 2021-09-18 to 2026-06-29
- [x] Local data collection catalog generated with 144 catalog rows and ingestion-readiness docs
- [x] Bronze SQLite warehouse loaded with 107 tables and 6,886,703 rows
- [x] Bronze smoke test passed with metadata caveat
- [x] Silver Phase 1 canonical incident database loaded with 780,385 rows from six canonical sources
- [x] Cross-jurisdiction silver QA completed with caveats
- [x] Taxonomy cleanup analysis completed and V2 taxonomy prepared
- [x] Taxonomy V2 silver rebuild completed; `other` category reduced from 111,664 to 12,579 rows
- [x] Silver SQLite indexes applied and benchmarked; 23/23 benchmark queries used indexes

---

## In Progress

- [ ] Phase 2 remaining: archive V1 target files into per-dataset folders with `manifest.json`

---

## Next Up

- [ ] Fix Ask Bar out-of-jurisdiction and unmatched geography guard so outside places do not trigger broad Toronto queries
- [ ] Wire real provenance (source URLs, licence URLs, update dates) into dataset metadata
- [ ] Design universal source/dataset metadata layer (Phase 3a)
- [ ] Define production PostgreSQL ingestion (Phase 3b DB path)
- [ ] Define production data strategy for Vercel/hosting (processed corpus not in repo; deployment path TBD)
- [ ] Upgrade map to Leaflet/MapLibre (Phase 5)
- [ ] Step 7A internal read-only query service against indexed silver database
- [ ] Step 7B protected/internal API route wrapper with limits, caveats, and no raw source-field exposure by default
- [ ] Step 8 app/query UI integration only after internal API QA
- [ ] New-data incremental pipeline / backdata ingestion workflow
- [ ] Production data strategy decision for hosted silver/PostgreSQL/object-storage path
- [ ] PostgreSQL/Prisma production path remains pending
- [ ] Public coordinate/display policy for non-TPS sources
- [ ] Multi-jurisdiction metadata/schema review before public release

---

## Log Entries

| Date | Agent / Session | Action |
|------|-----------------|--------|
| 2026-06-30 | Initial setup | Repo created, Next.js initialized, production build passed |
| 2026-06-30 | Planning docs | Created `docs/NORTH_STAR.md`, `docs/FINAL_PRODUCT_SPEC.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/DATA_SOURCE_PLAN.md`, `docs/LEGAL_GUARDRAILS.md`, `Logs/STEP_LOG.md` |
| 2026-06-30 | TPS inventory | Inspected 73 CSV files in `data/raw/tps/_downloads/2026-06-30`; wrote `docs/TPS_RAW_DATA_INVENTORY_2026-06-30.md` |
| 2026-06-30 | Strategy adoption | Adopted Unified Source Foundation + Layered Release; updated `NORTH_STAR`, `FINAL_PRODUCT_SPEC`, `IMPLEMENTATION_PLAN`, `DATA_SOURCE_PLAN` |
| 2026-06-30 | Typed source layer plan | Created manifest-only classification for 73 TPS CSVs in `docs/TPS_TYPED_SOURCE_LAYER_PLAN_2026-06-30.md`; no file operations |
| 2026-06-30 | Corpus relocation | Moved `major-crime-indicators/.../original-file.csv` → `_downloads/2026-06-30/Major_Crime_Indicators_Open_Data.csv`; deleted empty folders; updated docs to 74-file corpus (SHA-256 verified) |
| 2026-06-30 | UI foundation pass | Built dark "civic atlas" design system + 12 routes (8 V1 + 4 concept) with mock/preview data; added `docs/PRODUCT_UI_ARCHITECTURE_2026-06-30.md`. No new deps, no DB, no auth/billing/AI backend, no CrimeInToronto coupling |
| 2026-06-30 | TPS V1 local data | Processed 6 Major Crime CSVs from `_downloads/2026-06-30` into `data/processed/tps/v1/`; validation totals 581,393 / 573,191 / 8,202; app serves real records locally; production still lacks data |
| 2026-06-30 | Docs sync | Updated `Logs/STEP_LOG.md` and `docs/DATA_SOURCE_PLAN.md` (local data generation section); synced `docs/IMPLEMENTATION_PLAN.md` checkboxes to local SQLite interim path |
| 2026-06-30 | Product vision | Unified the 10 signature UI ideas into one system ("The Living Record"); added `docs/PRODUCT_VISION_LIVING_RECORD_2026-06-30.md`. Ask Bar → Living Answer named as first prototype; other 9 ideas defined as future views on the shared filter spine. Docs only — no src, no schema, no deps |
| 2026-06-30 | Ask Bar prototype | Added `/toronto/ask`: deterministic plain-language compilation to shared TPS filters, real map/table previews, transparent unused text, legacy neighbourhood support, and SourceReceipt-backed reproducible links. No AI, backend, schema, package, or data changes. |
| 2026-07-01 | Ask Bar audit | Reviewed TPS Ask Bar field coverage and parser behavior. Confirmed current Ask support for offence, year, division, neighbourhood, and legacy neighbourhood. Identified trust fix: outside jurisdictions or unmatched geography must block broad Toronto queries instead of being ignored. Logs only — no code changes. |
| 2026-07-02 | Raw collection recap | Recorded local/off-repo raw collection state for TPS, Peel PRP, York YRP, Durham DRPS, Halton HRPS, and Hamilton HPS/LexisNexis CommunityCrimeMap. This is source collection and pipeline preparation only, not public app integration. |
| 2026-07-02 | Prehistory data collection | Collected and validated YRP historical pre-2025 data: 177,331 rows, 2021-2024, CSV/GeoJSON/metadata under `data/raw/yrp/community-safety/incidents/pre-2025/2026-07-02/`. Silver-ready using `UniqueIdentifier`; do not dedupe on `occ_id` alone. |
| 2026-07-02 | Durham DRPS check | Deep official ArcGIS search found only `avl_odp_crimemap`; exported 118 caveated records where `occ_date < 2025-01-01`; not a full historical archive. |
| 2026-07-02 | Halton HRPS check | Official `Crime_Map` layer had 0 pre-2025 rows and no separate historical incident layer was found; skipped export. |
| 2026-07-02 | Peel PRP check | `Experience_gdb` real date fields had 0 pre-2023 rows; string-field comparisons were identified as misleading; Calls for Service web map exposed no service URLs; skipped export. |
| 2026-07-02 | Hamilton HPS audit | Existing CommunityCrimeMap source-freeze audited: full `2000-to-2026` dataset is raw-only/noise as historical archive; cleaned HPS-only dataset is usable only for selected categories from 2021-09-18 onward. |
| 2026-07-02 | Catalog generation | Created local data collection catalog/readiness outputs covering raw public data packages; master catalog contains 144 rows. Documentation/data-pipeline milestone only, not app integration. |
| 2026-07-02 | Bronze load | Built local bronze SQLite warehouse from cataloged sources: 107 bronze tables, 6,886,703 rows, 0 load errors. Bronze includes review-required data and is not public app data. |
| 2026-07-02 | Bronze smoke and silver design | Bronze smoke test passed with metadata caveat; 107/107 manifest tables reconciled and Phase 1 silver canonical-source policy selected six incident sources. |
| 2026-07-02 | Silver Phase 1 load | Loaded local silver incident database with 780,385 canonical rows from TPS, Peel, YRP, Durham master, Halton CSV, and Hamilton HPS-only cleaned source; all 15 QA checks passed. |
| 2026-07-02 | Cross-jurisdiction QA | Completed silver cross-jurisdiction QA: PASS WITH CAVEATS. Main issue was 111,664 `other` rows before taxonomy cleanup; source/date/geography caveats documented. |
| 2026-07-02 | Taxonomy cleanup | Completed read-only taxonomy cleanup analysis with 108 proposed mappings, estimating 88.41% reduction in `other` rows. |
| 2026-07-02 | Taxonomy V2 rebuild | Rebuilt silver with Taxonomy V2: total rows stayed 780,385 and `other` dropped from 111,664 to 12,579 rows, an 88.73% reduction. QA passed with 0 load errors. |
| 2026-07-02 | Silver indexes and benchmark | Applied 12 indexes to local silver SQLite and ran benchmarks. Integrity remained stable, 23/23 benchmark queries used indexes, and benchmark result was PASS WITH CAVEATS. |
| 2026-07-02 | Pipeline status handoff | Documented that local pipeline is now catalog + bronze + indexed silver with Taxonomy V2 complete. Next step is internal read-only query service, not public UI. |

---

## Reference

- North star: [docs/NORTH_STAR.md](../docs/NORTH_STAR.md)
- Product vision (Living Record): [docs/PRODUCT_VISION_LIVING_RECORD_2026-06-30.md](../docs/PRODUCT_VISION_LIVING_RECORD_2026-06-30.md)
- Product spec: [docs/FINAL_PRODUCT_SPEC.md](../docs/FINAL_PRODUCT_SPEC.md)
- Implementation plan: [docs/IMPLEMENTATION_PLAN.md](../docs/IMPLEMENTATION_PLAN.md)
- Data sources: [docs/DATA_SOURCE_PLAN.md](../docs/DATA_SOURCE_PLAN.md)
- TPS inventory: [docs/TPS_RAW_DATA_INVENTORY_2026-06-30.md](../docs/TPS_RAW_DATA_INVENTORY_2026-06-30.md)
- TPS typed source layer plan: [docs/TPS_TYPED_SOURCE_LAYER_PLAN_2026-06-30.md](../docs/TPS_TYPED_SOURCE_LAYER_PLAN_2026-06-30.md)
- Legal guardrails: [docs/LEGAL_GUARDRAILS.md](../docs/LEGAL_GUARDRAILS.md)
- Local TPS V1 data: [docs/DATA_SOURCE_PLAN.md](../docs/DATA_SOURCE_PLAN.md#local-development-tps-v1-processed-data)
- Data pipeline log: [DATA_PIPELINE_LOG_2026-07-02.md](./DATA_PIPELINE_LOG_2026-07-02.md)
- Data pipeline status: [docs/DATA_PIPELINE_STATUS_2026-07-02.md](../docs/DATA_PIPELINE_STATUS_2026-07-02.md)
