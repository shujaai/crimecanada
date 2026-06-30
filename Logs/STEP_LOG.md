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
- [x] Document local TPS V1 data generation and production limitation (`docs/DATA_SOURCE_PLAN.md` — Local development section)

---

## In Progress

- [ ] Phase 2 remaining: archive V1 target files into per-dataset folders with `manifest.json`

---

## Next Up

- [ ] Wire real provenance (source URLs, licence URLs, update dates) into dataset metadata
- [ ] Design universal source/dataset metadata layer (Phase 3a)
- [ ] Define production PostgreSQL ingestion (Phase 3b DB path)
- [ ] Define production data strategy for Vercel/hosting (processed corpus not in repo; deployment path TBD)
- [ ] Upgrade map to Leaflet/MapLibre (Phase 5)

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
