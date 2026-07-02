# Silver Cross-Jurisdiction QA Report

Generated: 2026-07-02T10:23:55.086Z

Database: `data/silver/crimecanada-silver.sqlite`
Manifest: `data/silver/silver-load-manifest.json`

## Overall result: **PASS WITH CAVEATS**

## Hard-gate checks

| Check | Expected | Actual | Status | Notes |
|-------|----------|--------|--------|-------|
| total_rows | 780385 | 780385 | PASS |  |
| jurisdiction_rows_tps | 581393 | 581393 | PASS |  |
| jurisdiction_rows_peel-prp | 82401 | 82401 | PASS |  |
| jurisdiction_rows_yrp | 67153 | 67153 | PASS |  |
| jurisdiction_rows_durham-drps | 7819 | 7819 | PASS |  |
| jurisdiction_rows_halton-hrps | 20252 | 20252 | PASS |  |
| jurisdiction_rows_hamilton-hps | 21367 | 21367 | PASS |  |
| tps_municipality_toronto | 0 | 0 | PASS | all TPS rows should be Toronto |
| coords_inside_ontario | 0 | 0 | PASS | mappable rows outside Ontario bounding box |
| silver_record_key_unique | 780385 | 780385 | PASS |  |
| only_phase1_catalog_ids | 6 | 6 | PASS |  |
| excluded_absent_cat-0010 | 0 | 0 | PASS |  |
| excluded_absent_cat-0011 | 0 | 0 | PASS |  |
| excluded_absent_cat-0013 | 0 | 0 | PASS |  |
| excluded_absent_cat-0061 | 0 | 0 | PASS |  |
| excluded_absent_cat-0067 | 0 | 0 | PASS |  |
| excluded_absent_cat-0068 | 0 | 0 | PASS |  |
| excluded_absent_cat-0012 | 0 | 0 | PASS |  |
| excluded_absent_cat-0094 | 0 | 0 | PASS |  |
| excluded_absent_cat-0095 | 0 | 0 | PASS |  |
| excluded_absent_cat-0096 | 0 | 0 | PASS |  |
| excluded_absent_cat-0097 | 0 | 0 | PASS |  |
| excluded_absent_cat-0098 | 0 | 0 | PASS |  |
| excluded_absent_cat-0099 | 0 | 0 | PASS |  |
| excluded_absent_cat-0100 | 0 | 0 | PASS |  |
| excluded_absent_cat-0106 | 0 | 0 | PASS |  |
| excluded_absent_cat-0107 | 0 | 0 | PASS |  |
| peel_duplicate_groups_preserved | >0 | 6564 | PASS | groups=6564 |

## Flags and caveats

- Durham date caveat: occ_date populated on 7818/7819 rows (n/a to 2026-06-16); report_date populated on 7819/7819 — master map uses occurrence dates; report lag may differ.
- category_family=other is 111,664 rows (14.31%) — needs taxonomy cleanup before cross-jurisdiction category filters.
- 26,547 mappable regional rows outside strict GTA core bbox — expected for outer municipalities; review samples only.
- 175 rows have blank occ_date (174 TPS, 1 Durham) but populated report_date — exclude from date-window filters or fall back to report_date in app layer.

## Year coverage summary

| jurisdiction | min_year | max_year | distinct_years | note |
|--------------|----------|----------|----------------|------|
| durham-drps | 2008 | 2026 | 15 |  |
| halton-hrps | 2025 | 2026 | 2 | 2025+ public layer only |
| hamilton-hps | 2021 | 2026 | 6 | 2021+ HPS-only cleaned subset |
| peel-prp | 2023 | 2026 | 4 | 2023+ public window (catalog verified) |
| tps | 2000 | 2026 | 27 |  |
| yrp | 2025 | 2026 | 2 | 2025+ public window (catalog verified) |

## Category coverage summary

| category_family | rows | share |
|-----------------|------|-------|
| assault | 287,769 | 36.88% |
| other | 111,664 | 14.31% |
| theft_from_vehicle | 109,228 | 14.00% |
| auto_vehicle_theft | 103,887 | 13.31% |
| break_and_enter | 92,355 | 11.83% |
| robbery | 44,365 | 5.69% |
| fraud | 24,716 | 3.17% |
| drugs | 4,853 | 0.62% |
| sexual_assault | 733 | 0.09% |
| shooting_firearm | 456 | 0.06% |
| arson | 202 | 0.03% |
| homicide | 157 | 0.02% |

## Geography / coordinate summary

| jurisdiction | mappable% | blank_municipality | outside_ontario |
|--------------|-----------|--------------------|-----------------|
| durham-drps | 100% | 0 | 0 |
| halton-hrps | 100% | 0 | 0 |
| hamilton-hps | 100% | 0 | 0 |
| peel-prp | 100% | 52 | 0 |
| tps | 98.59% | 0 | 0 |
| yrp | 100% | 0 | 0 |

## Duplicate / overlap summary

- silver_record_key uniqueness: PASS
- Phase 1 catalog_ids only: cat-0075, cat-0076, cat-0090, cat-0093, cat-0105, cat-0108
- Peel duplicate occurrence groups: 6,564
- TPS duplicate event_unique_id groups (expected): 51,824
- Excluded sources verified absent (16 checks)

## Smoke query execution results

- **total_by_jurisdiction**: 6 result row(s)
- **toronto_assault_by_year**: 27 result row(s)
- **peel_hard_crime**: 3 result row(s)
- **yrp_hard_crime**: 3 result row(s)
- **durham_shooting**: 1 result row(s)
- **halton_violent**: 1 result row(s)
- **hamilton_selected**: 3 result row(s)
- **mappable_only**: 6 result row(s)
- **peel_date_window**: 1 result row(s)
- **yrp_date_window**: 1 result row(s)

## Related artifacts

- [`SILVER_CROSS_JURISDICTION_COUNTS.csv`](SILVER_CROSS_JURISDICTION_COUNTS.csv)
- [`SILVER_APP_LAYER_READINESS.md`](SILVER_APP_LAYER_READINESS.md)
- [`SILVER_PUBLIC_CAVEATS.md`](SILVER_PUBLIC_CAVEATS.md)
- [`SILVER_INDEX_RECOMMENDATIONS.sql`](SILVER_INDEX_RECOMMENDATIONS.sql)
- [`SILVER_QUERY_SMOKE_TESTS.sql`](SILVER_QUERY_SMOKE_TESTS.sql)

