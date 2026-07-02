# CrimeCanada.io — Data Pipeline Log — 2026-07-02

Records local data collection, catalog, bronze, silver, taxonomy, indexing, and benchmark work completed **2026-07-01 through 2026-07-02** on the CrimeCanada.io collection machine. This log is for future ingestion and app planning — it does **not** change V1 public app scope.

Executive summary: [docs/DATA_PIPELINE_STATUS_2026-07-02.md](../docs/DATA_PIPELINE_STATUS_2026-07-02.md)

---

## Purpose

This document captures the major July 1–2, 2026 data-engineering milestone:

- Local raw multi-jurisdiction collection and source-freeze audits
- Prehistory checks (YRP, Durham, Halton, Peel, Hamilton)
- Master catalog and ingestion-readiness documentation
- Bronze SQLite warehouse load
- Silver Phase 1 canonical incident load
- Cross-jurisdiction QA
- Taxonomy V2 rebuild
- Silver index application and performance benchmarks

**Public/V1 app integration remains separate and pending.** The current public app continues to serve Toronto TPS processed V1 data unless application code is changed separately.

---

## Global Rules Applied

- Raw files preserved unmodified; provenance/source-freeze first
- No app code changes in this pipeline milestone
- No raw data committed to git (`data/raw/` gitignored)
- Missing from a public source layer ≠ offence did not occur
- Coordinates must respect source privacy, offset, and generalization status
- Bronze includes sensitive/review-required records — not public display data
- Silver Phase 1 uses six canonical sources only to avoid duplicate/overlap
- Do not expose `source_fields_json` in public API responses by default

---

## Public App Scope Reminder

Older TPS-only documentation ([`docs/DATA_SOURCE_PLAN.md`](../docs/DATA_SOURCE_PLAN.md), [`docs/IMPLEMENTATION_PLAN.md`](../docs/IMPLEMENTATION_PLAN.md)) remains **historically true** for the public UI: V1 is TPS-only, six major-crime datasets, `/toronto` routes.

Local data engineering has advanced to a **multi-jurisdiction indexed silver database**, but:

- Raw/bronze/silver database files are local artifacts, not public-app-ready
- Multi-jurisdiction map/table/search over silver is **not started**
- Production deployment data strategy remains pending

---

## Layer Definitions

| Layer | Definition |
|-------|------------|
| **Raw collection** | Source exports (CSV, GeoJSON, metadata, source-freeze reports) under `data/raw/` on the collection machine |
| **Catalog** | Machine-readable inventory (`DATA_COLLECTION_MASTER_CATALOG.csv/.md`) of all known files with ingestion and display status |
| **Bronze** | Broad local SQLite warehouse (`crimecanada-bronze.sqlite`) loading cataloged tabular sources |
| **Silver** | Normalized cross-jurisdiction incident table (`silver_incidents`) from approved canonical sources |
| **Taxonomy** | Category mapping from source labels to canonical `category_family` values |
| **Indexes / benchmarks** | Query performance layer and validated query patterns for internal API design |
| **Internal API** | Pending Step 7A — bounded read-only query service |
| **Public UI** | Pending Step 8 — app integration after internal API QA |

---

## Current Status Tables

### Pipeline layer status

| Layer | Status | Key output | Rows | Notes |
|-------|--------|------------|-----:|-------|
| Raw collection | Collected locally/off-repo | `data/raw/...` | source-dependent | TPS, Peel, YRP, Durham, Halton, Hamilton |
| Catalog | Complete | `DATA_COLLECTION_MASTER_CATALOG` | 144 catalog rows | inventory/readiness layer |
| Bronze | Complete | `crimecanada-bronze.sqlite` | 6,886,703 | broad local warehouse; not public app data |
| Silver Phase 1 | Complete | `crimecanada-silver.sqlite` | 780,385 | six canonical incident sources |
| Taxonomy V2 | Applied | V2 taxonomy + rebuilt silver | 12,579 `other` rows | other bucket reduced 88.73% |
| Indexes | Applied | 12 SQLite indexes | 780,385 | query benchmarks pass with caveats |
| Internal API | Pending | none | n/a | Step 7A |
| Public UI integration | Pending | none | n/a | after internal API QA |

### Phase 1 silver jurisdiction rows

| Jurisdiction | Rows | Source |
|--------------|-----:|--------|
| TPS | 581,393 | processed TPS V1 |
| Peel PRP | 82,401 | ECrimes |
| YRP | 67,153 | Community Safety current view |
| Durham DRPS | 7,819 | master public crime map |
| Halton HRPS | 20,252 | Crime Map CSV |
| Hamilton HPS | 21,367 | HPS-only cleaned CommunityCrimeMap |
| **Total** | **780,385** | |

### Raw source status

| Jurisdiction | Status | Notes |
|--------------|--------|-------|
| Toronto TPS | Processed + wired to V1 app | `data/processed/tps/v1/`; V1 app routes active |
| Peel PRP ECrimes | collected_pending_ingestion | In bronze; in silver Phase 1 |
| York YRP Community Safety | collected_pending_ingestion | Current view + pre-2025 historical export (not in Phase 1 silver) |
| Durham DRPS Community Safety | collected_pending_ingestion | Master in silver; pre-2025 caveated export optional |
| Halton HRPS Crime Map | collected_pending_ingestion | CSV in silver; boundaries dir missing on disk |
| Hamilton HPS CommunityCrimeMap | collected_pending_ingestion | HPS-only cleaned derivative in silver |

---

## Raw Collection and Source Freeze Notes

### Toronto TPS

**Status:** Already processed and locally wired into the current product before this multi-jurisdiction pipeline milestone. V1 app remains TPS-only unless separately changed.

- **Processed root:** `data/processed/tps/v1`
- **Raw corpus:** `data/raw/tps/_downloads/2026-06-30` (74 CSVs)
- **Total rows:** 581,393 | **Mappable:** 573,191 | **Non-mappable:** 8,202
- **Date range:** ~2000-01-01 to 2026-03-31 | **Source fields:** 31 per row

**Six TPS V1 datasets:**

| Dataset | Rows |
|---------|-----:|
| Assault Open Data | 254,378 |
| Auto Theft Open Data | 78,714 |
| Break and Enter Open Data | 84,689 |
| Robbery Open Data | 40,248 |
| Theft From Motor Vehicle Open Data | 106,574 |
| Theft Over Open Data | 16,790 |

**Current app routes (TPS processed data):** `/toronto`, `/toronto/map`, `/toronto/table`, `/toronto/search`, `/toronto/ask` (deterministic only; no AI backend).

**Known prior issue:** Ask Bar out-of-jurisdiction/unmatched geography guard still needed (e.g. "assault in york region" must not return broad Toronto assault results).

**Caveats:** Some TPS hard/sensitive/deferred files exist in raw/deferred context but are not public V1. Before final cross-jurisdiction category docs, TPS categories should be rechecked from local manifests, not memory.

---

### Peel PRP ECrimes

**Status:** collected_pending_ingestion

- **Raw root:** `data/raw/peel-prp/ecrimes`
- **Main CSV:** `data/raw/peel-prp/ecrimes/incidents/2026-07-01/peel-prp-ecrimes-2026-07-01-with-geometry.csv`
- **Endpoint:** `https://services.arcgis.com/w0dAT1ctgtKwxvde/arcgis/rest/services/Experience_gdb/FeatureServer/0`

**Facts:** 82,401 rows | 2023-06-30 to 2026-06-30 | 100% mappable | offset/generalized coordinates | duplicate `OccurrenceNumber` preserved.

**OccTypes:** ASL (Assault), VEH (Vehicle Theft), FRA (Fraud), MIS (Mischief), BNE (Break and Enter), DRP (Drug Possession), ROB (Robbery), DRT (Drug Trafficking), HOM (Homicide).

**Notes:** HOM source-level total = 58 (use as authoritative; regex matched 54). Sexual assault and firearms/shootings **not found in public ECrimes OccType list** — not proof they did not occur.

**Pre-2023 check:** `OccDate` and `OccDateUTC` returned 0 pre-2023 rows. String fields like `OccurrenceDate`/`OccurrenceTime` produced misleading SQL date counts — do not use for historical checks. Calls for Service app exposed no usable service URLs. No pre-2023 export created.

**Error/lesson:** Broad Peel completeness script fetching `/data?f=pjson` for many ArcGIS item IDs became slow/noisy; stopped and replaced with safer known-service check.

---

### York Regional Police / YRP Community Safety

**Status:** collected_pending_ingestion

- **Raw root:** `data/raw/yrp/community-safety`
- **Current CSV:** `data/raw/yrp/community-safety/incidents/2026-07-01/yrp-community-safety-occurrences-2026-07-01-with-geometry.csv`
- **Occurrence endpoint:** `https://services8.arcgis.com/lYI034SQcOoxRCR7/arcgis/rest/services/Occurrence_Data_View/FeatureServer/0`

**Current public view:** 67,153 rows | 100% mappable | 2025-01-01 to 2026-06-30 | row key: `UniqueIdentifier` | grouping key: `occ_id` (do not dedupe on `occ_id` alone).

**Top municipalities:** Vaughan 21,348 | Markham 15,475 | Richmond Hill 11,375 | Newmarket 6,466 | Aurora 3,983 | Georgina 3,493 | East Gwillimbury 1,975 | Whitchurch-Stouffville 1,686 | King 1,352.

**Hard-crime coverage present:** homicide, sexual assault, robbery, assault, firearms/shooting, arson, attempted murder, break and enter, vehicle theft, drug offences.

**CCTV:** YRP CCTV Cameras discovered and archived — **archive-only/sensitive**, not public MVP incident display.

---

### YRP pre-2025 historical layer

**Official historical layer:** `https://services8.arcgis.com/lYI034SQcOoxRCR7/arcgis/rest/services/Occurrence_Data_2020_to_2023/FeatureServer/0`

**Export folder:** `data/raw/yrp/community-safety/incidents/pre-2025/2026-07-02/`

| File | Purpose |
|------|---------|
| `yrp-community-safety-occurrences-pre-2025-2026-07-02.csv` | Incident rows |
| `yrp-community-safety-occurrences-pre-2025-2026-07-02.geojson` | Geometry mirror |
| `yrp-community-safety-occurrences-pre-2025-2026-07-02.metadata.json` | Export metadata |

**Validation:** 177,331 rows | 2021-01-01 to 2024-12-31 | 26 fields | 0 missing geometry.

**Year counts:** 2021: 36,515 | 2022: 42,659 | 2023: 50,303 | 2024: 47,854.

**Decision:** Useful; silver-ready with caveats; use `UniqueIdentifier` as row key; do not dedupe only on `occ_id`.

**Phase 1 silver:** Not included (current view only in Phase 1).

---

### Durham DRPS Community Safety

**Status:** collected_pending_ingestion

- **Raw root:** `data/raw/durham-drps/community-safety`
- **Source freeze:** `data/raw/durham-drps/community-safety/source-freeze-2026-07-01`
- **Main CSV:** `data/raw/durham-drps/community-safety/incidents/2026-07-01/durham-drps-avl-odp-crimemap-master-2026-07-01.csv`
- **Portal:** `https://open-data-drps.hub.arcgis.com/`
- **Endpoint:** `https://services6.arcgis.com/2r8RrIqBhHAeyu7x/arcgis/rest/services/avl_odp_crimemap/FeatureServer/2`

**Why canonical master:** Public crime map master layer; combines map categories; includes homicide and shooting/firearm discharge; standalone extracts have different windows/ID spaces — excluded from Phase 1 silver to avoid overlap.

**Master facts:** 7,819 rows | report_date range 2025-06-16 to 2026-06-16 UTC | occ_date observed 1993-10-31 to 2026-06-16 UTC | row key candidate: `event_unique_id`.

**Master category counts:** Assault 3,103 | Theft from MV 1,397 | Vehicle Theft 1,164 | Break & Enter 1,075 | Impaired Operation 752 | Robbery 267 | Shooting & Firearm Discharge 48 | Homicide 13.

**Not in public incident rows (captured package):** sexual assault, attempted murder, hate crime, arson, calls for service. Sexual assault appeared in metadata/glossary searches but **not as public incident-point rows** — DRPS does not publish sexual assault incident rows in the captured public ArcGIS package.

**Pre-2025 deep search:** No separate public historical incident archive. Current master: 118 rows with `occ_date < 2025-01-01` (2021: 7, 2022: 12, 2023: 27, 2024: 46, 2025: 4,423). `report_date < 2025-01-01`: 0.

**Pre-2025 export:** `data/raw/durham-drps/community-safety/incidents/pre-2025/2026-07-02/` — caveated supplemental raw data only; **not** Durham historical coverage.

**Errors/fixes:** PowerShell `$id?f=json` → use `${id}`; `ConvertTo-Json -Depth 120` → use 80/100; giant OBJECTID IN queries → pagination; polluted export-report CSV → validate expected paths directly.

---

### Halton HRPS Crime Map

**Status:** collected_pending_ingestion

- **Raw root:** `data/raw/halton-hrps/crime-map`
- **Source freeze:** `data/raw/halton-hrps/crime-map/source-freeze-2026-07-01`
- **Main CSV:** `data/raw/halton-hrps/crime-map/incidents/2026-07-01/halton-hrps-crime-map-incidents-2026-07-01.csv`
- **Endpoint:** `https://services2.arcgis.com/o1LYr96CpFkfsDJS/arcgis/rest/services/Crime_Map/FeatureServer/0`

**Validation:** 20,252 rows | 2025-07-01 to 2026-07-01 | 100% mappable | key: `GlobalID`.

**Top categories:** ROADSIDE TEST 10,332 | MVC HIT & RUN 1,946 | THEFT OF VEHICLE 1,233 | ROBBERY 155 | ARSON 48.

**Not found in public layer:** homicide, murder, assault, sexual assault, shooting/firearms, hate crime, domestic, stabbing — use "not found in public layer," not "did not occur."

**Pre-2025 check:** 0 pre-2025 rows on official layer; no separate historical FeatureServer; no export created.

**Phase 1 silver:** CSV canonical; GeoJSON mirror excluded to avoid duplicate rows.

**Gap:** Halton boundaries/current directory missing on disk.

---

### Hamilton HPS / LexisNexis Community Crime Map

**Status:** collected_pending_ingestion (after cleanup audit)

- **Raw root:** `data/raw/hamilton-hps/communitycrimemap`
- **Source freeze:** `data/raw/hamilton-hps/communitycrimemap/source-freeze-2026-07-02`
- **Official page:** `https://hamiltonpolice.on.ca/how-to/online-crime-mapping-tool`
- **Community Crime Map:** LexisNexis provider — no official ArcGIS/open-data endpoint found
- **API:** `https://www.communitycrimemap.com/api/v1/search/load-data`

**Discovery:** Initial ArcGIS searches produced false positives (StatsCan, police stations, Hamilton Ohio, etc.). Browser/network work confirmed Community Crime Map provider; UI 500-record display cap; adaptive windowed export required.

**Raw export (2000–2026 query window):** 21,369 pin rows | min date 2015-11-27 | max 2026-06-29 — includes 2 non-HPS contamination rows (California agencies).

**Cleaned HPS-only derivative** (`Agency == "Hamilton Police Service"` AND `AgencyID == "Hamilton"`):

- 21,367 rows | 2021-09-18 to 2026-06-29 | 100% coordinates | 0 duplicates
- **Cleaned files:** `incidents/2026-07-02/cleaned/hamilton-communitycrimemap-hps-only-2021-to-2026-records-2026-07-02.csv`

**Selected category scope** (`crimeTypes=[1,6,7,10,11,16,17]`):

| ID | Category |
|----|----------|
| 1 | Homicide / manslaughter |
| 6–7 | Robbery (commercial / individual) |
| 10–11 | Burglary / break and enter |
| 16 | Motor vehicle theft |
| 17 | Theft from motor vehicle |

**Not included:** assault, sexual offences, drugs, fraud, weapons, most traffic, most vandalism.

**Exact public wording:**

> Source: Hamilton Police Service via LexisNexis Community Crime Map. Coverage: map-published records for selected offence categories only (`crimeTypes` 1, 6, 7, 10, 11, 16, 17: homicide/manslaughter, robbery, residential/commercial burglary, motor vehicle theft, theft from motor vehicle). This is not a complete record of all crime in Hamilton.
>
> Hamilton Police Service records in this export span 18 September 2021 through 29 June 2026. Earlier years requested from the API were not returned by the selected source/API configuration and should not be interpreted as proof that no offences occurred. 2019 and 2020 returned zero records in API window queries and should be treated as a source/API returned-zero gap.
>
> Addresses are masked (e.g. block-level 1XX / 6XX / XX formats). Map coordinates are display coordinates with source privacy offset flags and are not verified exact addresses. Two non-Hamilton records returned by the map provider were excluded from the cleaned Hamilton data.

**Phase 1 silver:** HPS-only cleaned derivative canonical; raw 2000–2026 export excluded (raw-only provenance).

---

## Catalog and Bronze

### Step 1 — Catalog generation

**Scripts (recorded; not modified in this logging task):** `scripts/audit-data-collection.mjs`

**Generated:**

- `data/DATA_COLLECTION_MASTER_CATALOG.csv`
- `data/DATA_COLLECTION_MASTER_CATALOG.md`
- `data/DATA_COLLECTION_COVERAGE_MATRIX.csv`
- `data/DATA_COLLECTION_INGESTION_READINESS.md`

**Results:** 144 catalog rows | 144 confirmed load paths | 1 missing expected path (Halton boundaries).

### Step 2 — Bronze load

**Scripts (recorded):** `scripts/load-bronze-database.mjs`

**Output:**

- `data/bronze/crimecanada-bronze.sqlite`
- `data/bronze/bronze-load-manifest.json`

**Loaded:** 107 catalog rows → 107 bronze tables | 6,886,703 total rows | 0 load errors.

**Excluded from bronze by design:** YRP CCTV archive | CrimeMaps benchmark files | JSON audit/metadata as catalog-only.

**Caveat:** Some TPS aggregate/FIRS physical line counts may be inflated due to embedded newlines; primary regional incident counts match handoff baselines.

---

## Bronze Smoke Test and Silver Design

**Generated:**

- `data/bronze/BRONZE_SMOKE_TEST_REPORT.md`
- `data/bronze/BRONZE_SMOKE_TEST_TABLE_COUNTS.csv`
- `data/bronze/BRONZE_SMOKE_TEST_SAMPLE_QUERIES.sql`
- `data/silver/SILVER_CANONICAL_COLUMNS.csv`
- `data/silver/SILVER_SOURCE_COLUMN_MAPPING.csv`
- `data/silver/SILVER_CATEGORY_TAXONOMY_DRAFT.csv`
- `data/silver/SILVER_NORMALIZATION_PLAN.md`

**Bronze smoke test:** PASS with metadata caveat — 107/107 manifest data tables reconciled; 6,886,703 live rows matched manifest. One `bronze_catalog` orphan row (Hamilton HPS-only; empty `catalog_id`) — handled in silver lineage.

**Canonical Phase 1 incident sources selected:**

1. TPS processed V1
2. Peel ECrimes primary
3. YRP Community Safety current view
4. Durham master (`avl_odp_crimemap`)
5. Halton CSV
6. Hamilton HPS-only cleaned

---

## Silver Phase 1 Build

**Scripts (recorded):** `scripts/load-silver-database.mjs`

**Output:**

- `data/silver/crimecanada-silver.sqlite`
- `data/silver/silver-load-manifest.json`
- `data/silver/SILVER_LOAD_QA_REPORT.md`
- `data/silver/SILVER_TABLE_COUNTS.csv`
- `data/silver/SILVER_SAMPLE_QUERIES.sql`

**Loaded:** 780,385 rows in `silver_incidents` from six canonical sources only.

**QA:** PASS — 0 load errors; all 15 QA checks passed; `silver_record_key` unique; only six Phase 1 catalog_ids present.

---

## Cross-Jurisdiction QA

**Generated:**

- `data/silver/SILVER_CROSS_JURISDICTION_QA_REPORT.md`
- `data/silver/SILVER_CROSS_JURISDICTION_COUNTS.csv`
- `data/silver/SILVER_APP_LAYER_READINESS.md`
- `data/silver/SILVER_PUBLIC_CAVEATS.md`
- `data/silver/SILVER_INDEX_RECOMMENDATIONS.sql`
- `data/silver/SILVER_QUERY_SMOKE_TESTS.sql`

**Result:** PASS WITH CAVEATS.

**Main pre-V2 caveat:** `category_family='other'` had 111,664 rows (14.31%).

**Date windows:**

| Jurisdiction | Window |
|--------------|--------|
| TPS | 2000–2026 |
| Peel | 2023–2026 |
| York | 2025–2026 |
| Durham | 2008–2026 (occurrence dates) |
| Halton | 2025–2026 |
| Hamilton | 2021–2026 |

**Geography:** Peel 52 blank municipalities; TPS 98.59% mappable; others 100%; no mappable rows outside Ontario bbox; 175 blank `occ_date` rows with `report_date` populated.

**Readiness (pre-public integration):**

| Jurisdiction | Classification |
|--------------|----------------|
| tps, peel-prp, yrp | ready_for_public_mvp_with_caveats |
| durham-drps | needs_taxonomy_cleanup + needs_source_caveat_only |
| halton-hrps | needs_taxonomy_cleanup |
| hamilton-hps | ready_for_internal_query + needs_source_caveat_only |

---

## Taxonomy Cleanup and V2 Rebuild

### Step 6C — Cleanup analysis (read-only)

**Generated:**

- `data/silver/SILVER_TAXONOMY_CLEANUP_REPORT.md`
- `data/silver/SILVER_OTHER_BUCKET_ANALYSIS.csv`
- `data/silver/SILVER_CATEGORY_TAXONOMY_PATCH.csv`
- `data/silver/SILVER_CATEGORY_TAXONOMY_V2_DRAFT.csv`
- `data/silver/SILVER_TAXONOMY_IMPACT_ESTIMATE.csv`
- `data/silver/SILVER_TAXONOMY_REBUILD_PLAN.md`

**Results:** 108 proposed patch mappings | 98,725 rows estimated to move out of `other` | estimated `other` after rebuild: 12,939 (88.41% reduction).

### Step 6D — V2 silver rebuild

**Regenerated:** silver DB, manifest, QA report, table counts, sample queries.

**Created:** `data/silver/SILVER_TAXONOMY_V2_REBUILD_REPORT.md`

**Results:**

| Metric | Value |
|--------|------:|
| Total rows | 780,385 (unchanged) |
| Previous `other` | 111,664 |
| New `other` | 12,579 |
| Reduction | 88.73% |
| QA | PASS, 0 load errors |

**Loader tuning recorded (during pipeline work, not modified in this logging task):**

- Taxonomy path → `SILVER_CATEGORY_TAXONOMY_V2_DRAFT.csv`
- Peel `MIS` → `mischief_property_damage`
- TPS `theft-over-open-data` slug → `theft_other`
- Extended keyword families; reordered `mapCategory`: Peel codes → taxonomy exact → keyword fallback

**Post-rebuild top families:** assault 288,061 | theft_from_vehicle 118,098 | auto_vehicle_theft 107,970 | break_and_enter 104,160 | robbery 44,365 | other 12,579.

---

## Silver Indexes and Performance Benchmark

### Step 6E — Index application

**Applied to `data/silver/crimecanada-silver.sqlite` only** (do not reapply):

- `idx_silver_incidents_jurisdiction_id`
- `idx_silver_incidents_category_family`
- `idx_silver_incidents_category_canonical`
- `idx_silver_incidents_occ_date`
- `idx_silver_incidents_municipality`
- `idx_silver_incidents_mappable`
- `idx_silver_incidents_jurisdiction_occ_date`
- `idx_silver_incidents_jurisdiction_category_family`
- `idx_silver_incidents_jurisdiction_municipality`
- `idx_silver_incidents_jurisdiction_mappable_category`
- `idx_silver_incidents_jurisdiction_occ_date_category`
- `idx_silver_incidents_mappable_lat_lng`
- ANALYZE

**Created:**

- `data/silver/SILVER_INDEX_APPLICATION_REPORT.md`
- `data/silver/SILVER_PERFORMANCE_BENCHMARK.md`
- `data/silver/SILVER_PERFORMANCE_BENCHMARK.csv`
- `data/silver/SILVER_INDEXED_QUERY_PLAN_REPORT.md`
- `data/silver/SILVER_INDEXED_SAMPLE_QUERIES.sql`

**DB size:** 1,564.96 MB → 1,761.50 MB (+196.54 MB).

**Integrity after indexing:** 780,385 rows unchanged; per-jurisdiction counts match; `other` = 12,579; `silver_record_key` unique.

**Benchmarks:** PASS WITH CAVEATS — 23/23 queries used indexes.

| Query | Warm time | Notes |
|-------|----------:|-------|
| Fastest | 0.03 ms | Durham shooting hard-crime |
| Slowest | 5,170.78 ms | TPS mappable bbox (423,141 rows) |
| GTA core bbox | 77.54 ms | 745,636 rows |

**API strategy recommendation:**

- List endpoint: default limit 100 / max 500
- Map endpoints: require bbox + `mappable=1`; cap 5,000 points
- Avoid unbounded map queries and `LIKE '%value%'` on municipality
- Use exact indexed filters

---

## Intentional Exclusions (Phase 1 silver)

| Excluded | Reason |
|----------|--------|
| TPS raw major-crime CSVs | Overlap with processed V1 |
| TPS sensitive/deferred raw sources | Review-required; not Phase 1 public incident |
| Durham standalone extracts | Different windows/ID spaces vs master |
| Halton GeoJSON mirror | Duplicate rows vs CSV |
| Hamilton raw 2000–2026 export | Provenance/noise; HPS-only cleaned is canonical |
| Peel legacy no-geometry | Superseded by geometry export |
| YRP CCTV | Archive/reference-only |
| CrimeMaps benchmark | Benchmark-only |
| Traffic/collision standalone feeds | Not Phase 1 canonical incident policy |
| Aggregates, geography/reference tables | Not incident-point sources |

---

## Source and Privacy Caveats

See `data/silver/SILVER_PUBLIC_CAVEATS.md` for display-ready text. Summary:

- **TPS:** Six categories only; non-mappable 0,0 rows; event ID duplicates by design
- **Peel:** Offset coordinates; 2023+ window; duplicate occurrence numbers preserved
- **YRP:** 2025+ current view; disclaimer required; CCTV not for MVP
- **Durham:** Master only; sexual assault not in incident-point rows; occ vs report date
- **Halton:** Traffic/MVC label dominance; many violent categories not in public layer
- **Hamilton:** Selected categories only; masked addresses; approximate coordinates; API returned-zero gap for 2019–2020

**Security:** Encoding/base64/obfuscation is not protection if the browser can decode it. Full row search/export requires auth, quotas, rate limits, and logging.

---

## Technical Errors and Lessons

### PowerShell / ArcGIS

| Wrong | Correct |
|-------|---------|
| `"https://www.arcgis.com/sharing/rest/content/items/$id?f=json"` | Use `${id}` not `$id?f=json` |
| `ConvertTo-Json -Depth 120` | Use `-Depth 80` or `-Depth 100` |
| Giant `OBJECTID IN (...)` queries | `resultOffset`, `resultRecordCount`, pagination |
| `$host` / `$Host` for portal base | Use `$PortalBase`, `$PortalHost`, etc. |

### Validation

- Always compare service count, exported feature count, and CSV row count
- Always confirm CSV/GeoJSON/metadata exists
- Do not rely on report CSV if pipeline output may have polluted it
- Check full category fields before marking a category absent

### Hamilton CommunityCrimeMap API

- UI 500-record display cap; full replay without windowing returned only 500 records
- `quick=365` returns recent; `quick="custom"` returned wrong data
- Correct exporter: omit `quick`; use adaptive date windows
- 2019–2020 returned zero — source/API returned-zero gap, not proof of no crime

### General

- Do not confuse bronze with public app data
- TPS aggregate/FIRS line counts may inflate due to embedded newlines
- Bronze catalog orphan row (Hamilton) — lineage warning in silver load

---

## New Data Pipeline Rule

New data must follow:

```
raw file → catalog → bronze → classification → silver inclusion decision → QA
```

- Everything new goes into raw + bronze first
- Silver inclusion requires: source classification, dedupe/overlap policy, mapping approval, source/legal/privacy caveat review
- ~20,000 new records manageable if saved under correct source folder and cataloged
- **Do not wire new raw data directly into the public app**

---

## Current Local Pipeline State

| Component | Status |
|-----------|--------|
| Catalog | Complete (144 rows) |
| Bronze | Complete (6,886,703 rows, 107 tables) |
| Silver Phase 1 | Complete (780,385 rows, 6 sources) |
| Taxonomy V2 | Applied (`other` = 12,579) |
| Silver indexes | Applied (12 indexes + ANALYZE) |
| Benchmarks | PASS WITH CAVEATS |
| Internal query service | **Next (Step 7A)** |
| Public UI integration | **Not started** |
| Production deployment data strategy | **Pending** |
| PostgreSQL/Prisma production path | **Pending** |

App should not expose full raw/bronze/silver directly without internal query service, limits, caveats, and review.

---

## Next Recommended Steps

1. **Step 7A** — Internal read-only query service against indexed silver DB
2. **Step 7B** — Protected/internal API route wrapper (limits, caveats, no raw source-field exposure)
3. **Step 8** — App/query UI integration only after internal API QA
4. Incremental new-data / backdata ingestion workflow (YRP pre-2025, Durham pre-2025 caveated, etc.)
5. Production data strategy (hosted silver / PostgreSQL / object storage)
6. Public coordinate/display policy for non-TPS sources
7. Multi-jurisdiction metadata/schema review before public release

---

## Suggested Step 7A Composer Prompt

**For later — do not execute in this logging task.**

> You are in X:\crimecanada. Build an internal read-only query service for the indexed local silver SQLite database. Do not expose public UI yet. Read `data/silver/SILVER_PERFORMANCE_BENCHMARK.md`, `SILVER_INDEX_APPLICATION_REPORT.md`, `SILVER_PUBLIC_CAVEATS.md`, and `SILVER_APP_LAYER_READINESS.md` first. Create a server-side query module that supports bounded list/count/map queries with strict limits, source caveats, no raw `source_fields_json` by default, and exact indexed filters. Do not add auth/billing. Do not expose unbounded map queries. Run targeted checks and update logs.

---

## Related artifacts (local; not modified in this logging task)

| Path | Description |
|------|-------------|
| `data/DATA_COLLECTION_MASTER_CATALOG.md` | Full catalog |
| `data/bronze/BRONZE_SMOKE_TEST_REPORT.md` | Bronze QA |
| `data/silver/SILVER_LOAD_QA_REPORT.md` | Silver load QA |
| `data/silver/SILVER_CROSS_JURISDICTION_QA_REPORT.md` | Cross-jurisdiction QA |
| `data/silver/SILVER_TAXONOMY_V2_REBUILD_REPORT.md` | Taxonomy V2 results |
| `data/silver/SILVER_INDEX_APPLICATION_REPORT.md` | Index application |
| `data/silver/SILVER_PERFORMANCE_BENCHMARK.md` | Query benchmarks |

Local artifact paths under `data/raw/`, `data/processed/`, and `*.sqlite` files exist on the collection machine but may be absent in a fresh clone (`data/raw/` and `data/processed/` are gitignored).
