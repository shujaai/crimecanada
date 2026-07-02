# Silver App-Layer Readiness

Generated: 2026-07-02T10:23:55.086Z

Cross-jurisdiction QA result: **PASS WITH CAVEATS**

## Readiness classifications

| jurisdiction_id | classification | row_count | public MVP |
|-----------------|----------------|-----------|------------|
| tps | ready_for_public_mvp_with_caveats | 581,393 | Yes — Toronto hub (existing six-category V1) |
| peel-prp | ready_for_public_mvp_with_caveats | 82,401 | Yes — with offset/duplicate/date caveats |
| yrp | ready_for_public_mvp_with_caveats | 67,153 | Yes — with 2025+ window and source disclaimer |
| durham-drps | needs_taxonomy_cleanup + needs_source_caveat_only | 7,819 | Internal query only until taxonomy pass |
| halton-hrps | needs_taxonomy_cleanup | 20,252 | Internal query only until DESCRIPTION taxonomy cleaned |
| hamilton-hps | ready_for_internal_query + needs_source_caveat_only | 21,367 | Internal QA; public MVP after caveat review |

## Recommended first public/query app subset

### Include in first cross-region public MVP

1. **Toronto (tps)** — full historical six-category V1 slice
2. **Peel (peel-prp)** — apply `occ_date >= '2023-06-30'` filter
3. **York (yrp)** — apply `occ_date >= '2025-01-01'` filter

### Internal-only until follow-up

4. **Durham (durham-drps)** — master-only source; taxonomy + occ/report date caveats
5. **Halton (halton-hrps)** — 2025+ window; traffic/MVC label noise
6. **Hamilton (hamilton-hps)** — selected categories; masked addresses

## Query guardrails for app layer

- Always filter `mappable = 1` on map views
- Apply jurisdiction-specific minimum `occ_date` windows (see [`SILVER_PUBLIC_CAVEATS.md`](SILVER_PUBLIC_CAVEATS.md))
- Do not dedupe Peel `occurrence_group_key` or TPS `occurrence_group_key`
- Treat `category_family = 'other'` (111,664 rows, 14.31%) as low-confidence until Step 6C taxonomy cleanup
- Show source attribution per jurisdiction on every view

## Step 6 recommendation

**C → A → B**

1. **C — Improve taxonomy first** (`other` bucket, Durham `crime_category`, Halton `DESCRIPTION`)
2. **A — Apply proposed indexes** in [`SILVER_INDEX_RECOMMENDATIONS.sql`](SILVER_INDEX_RECOMMENDATIONS.sql) and run performance benchmark
3. **B — Build internal API/query endpoints** wired to silver with caveats

Do **not** prioritize back-data collection (D) before taxonomy — MVP windows are sufficient for initial cross-region views.
