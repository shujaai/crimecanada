# CrimeCanada.io — Data Pipeline Status — 2026-07-02

Executive summary for humans and future agents. Full detail: [Logs/DATA_PIPELINE_LOG_2026-07-02.md](../Logs/DATA_PIPELINE_LOG_2026-07-02.md).

---

## Summary

As of **2026-07-02**, local data engineering has advanced to a **multi-jurisdiction catalog → bronze → silver** pipeline with **Taxonomy V2** and **12 SQLite indexes** applied. This work is **local/off-repo data preparation only** — not public app integration.

The **V1 public app remains TPS-oriented** (`/toronto` routes reading `data/processed/tps/v1/`) unless application code is changed separately. Older TPS-only planning docs remain historically accurate for the public UI scope.

---

## What Exists

| Layer | Status | Key output | Rows |
|-------|--------|------------|-----:|
| Raw collection | Collected locally (gitignored) | `data/raw/...` | source-dependent |
| Catalog | Complete | `data/DATA_COLLECTION_MASTER_CATALOG.md` | 144 catalog rows |
| Bronze | Complete | `data/bronze/crimecanada-bronze.sqlite` | 6,886,703 |
| Silver Phase 1 | Complete | `data/silver/crimecanada-silver.sqlite` | 780,385 |
| Taxonomy V2 | Applied | `data/silver/SILVER_CATEGORY_TAXONOMY_V2_DRAFT.csv` | 12,579 `other` rows |
| Indexes | Applied | 12 SQLite indexes + ANALYZE | 780,385 |
| Benchmarks | PASS WITH CAVEATS | `data/silver/SILVER_PERFORMANCE_BENCHMARK.md` | 23/23 queries used indexes |

Raw, processed, bronze, and silver database files are **local collection-machine artifacts**. `data/raw/` and `data/processed/` are gitignored; other `data/` outputs may exist locally but are not public-app-ready.

---

## Included Phase 1 Silver Sources

Six canonical incident sources only (overlap/duplication sources intentionally excluded):

| Jurisdiction | Rows | Source |
|--------------|-----:|--------|
| TPS | 581,393 | Processed TPS V1 (`data/processed/tps/v1/`) |
| Peel PRP | 82,401 | ECrimes with geometry |
| YRP | 67,153 | Community Safety current public view |
| Durham DRPS | 7,819 | Master public crime map (`avl_odp_crimemap`) |
| Halton HRPS | 20,252 | Crime Map CSV (GeoJSON mirror excluded) |
| Hamilton HPS | 21,367 | HPS-only cleaned CommunityCrimeMap derivative |
| **Total** | **780,385** | |

---

## What Each Layer Means

| Layer | Purpose |
|-------|---------|
| **Raw** | Unmodified source exports, source-freeze metadata, and audit reports preserved on the collection machine |
| **Catalog** | Inventory of all known files: paths, row counts, ingestion status, public-display classification |
| **Bronze** | Broad local SQLite warehouse of cataloged tables — includes sensitive, aggregate, and reference data; **not** public app data |
| **Silver** | Normalized cross-jurisdiction incident table (`silver_incidents`) from six approved canonical sources |
| **Taxonomy** | V2 category mapping reducing `other` bucket from 111,664 to 12,579 rows (88.73% reduction) |
| **Indexes** | Query performance layer on silver; benchmarks guide internal API limits |
| **Internal API** | **Pending (Step 7A)** — bounded read-only query service over indexed silver |
| **Public UI** | **Pending (Step 8)** — multi-jurisdiction app integration only after internal API QA |

---

## What Is Not Public Yet

- Full multi-jurisdiction app integration (map, table, search over silver)
- Public API serving silver data
- Production hosting / deployment data strategy
- PostgreSQL / Prisma production ingestion path
- Exposure of raw, bronze, or full silver rows without limits, caveats, and review

The current public app continues to serve **Toronto TPS V1 processed data only** for `/toronto`, `/toronto/map`, `/toronto/table`, `/toronto/search`, and `/toronto/ask` (deterministic; no AI backend).

---

## Caveats

**General**

- Missing records in a public source layer do **not** mean offences did not occur — use careful wording: "not found in public layer," "not published by source," or "not included in selected export."
- Do not wire public UI directly to raw or bronze.
- Do not expose `source_fields_json` in public API responses by default.
- Full row search/export should require auth, quotas, signed tokens, rate limits, and logging.

**Per jurisdiction (Phase 1 silver)**

| Jurisdiction | Key caveats |
|--------------|-------------|
| TPS | Six major-crime categories only; ~8,202 non-mappable (0,0) rows; `EVENT_UNIQUE_ID` not unique by design |
| Peel | 2023-06-30+ window; offset/generalized coordinates; duplicate `OccurrenceNumber` preserved; sexual assault and firearms not found in public ECrimes list |
| YRP | 2025-01-01+ current view; source disclaimer required; CCTV archive is reference-only, not MVP incident data |
| Durham | Master map only; standalone extracts excluded; sexual assault not published as incident-point rows in captured package; occ vs report date nuance |
| Halton | 2025-07-01+ window; traffic/MVC labels dominate; homicide, assault, sexual assault, firearms not found in public layer |
| Hamilton | Selected `crimeTypes` only (homicide, robbery, B&E, auto theft, theft from MV); 2021-09-18+ HPS-only coverage; masked addresses; display/generalized coordinates |

**Coordinates**

- Peel: offset/generalized per source disclaimer
- Hamilton: masked block-level addresses; `XOffset=1`; treat as approximate display points
- All sources: respect source privacy/generalization status in any public map UI

---

## Next Steps

1. **Step 7A** — Internal read-only query service against indexed `data/silver/crimecanada-silver.sqlite` (bounded list/count/map queries; strict limits; no `source_fields_json` by default)
2. **Step 7B** — Protected/internal API route wrapper with caveats, pagination, and map caps
3. **Step 8** — App/query UI integration only after internal API QA
4. **Incremental data workflow** — New raw → catalog → bronze → silver inclusion decision → QA
5. **Production data strategy** — Hosted silver / PostgreSQL / object-storage path decision
6. **Public coordinate/display policy** — Non-TPS source presentation rules before any public release
7. **Multi-jurisdiction metadata/schema review** — Before cross-region public MVP

See also: [Logs/STEP_LOG.md](../Logs/STEP_LOG.md) for checklist and chronological entries.
