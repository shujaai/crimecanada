# Silver Load QA Report

Generated: 2026-07-02T11:27:35.885Z

Database: `data/silver/crimecanada-silver.sqlite`

## Overall result: **PASS**

## Validation checks

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| table_exists_silver_incidents | present | present | PASS |
| table_exists_silver_lineage | present | present | PASS |
| table_exists_silver_category_taxonomy | present | present | PASS |
| table_exists_silver_load_log | present | present | PASS |
| total_rows | 780385 | 780385 | PASS |
| jurisdiction_rows_tps | 581393 | 581393 | PASS |
| jurisdiction_rows_peel-prp | 82401 | 82401 | PASS |
| jurisdiction_rows_yrp | 67153 | 67153 | PASS |
| jurisdiction_rows_durham-drps | 7819 | 7819 | PASS |
| jurisdiction_rows_halton-hrps | 20252 | 20252 | PASS |
| jurisdiction_rows_hamilton-hps | 21367 | 21367 | PASS |
| source_fields_json_populated | 0 | 0 | PASS |
| load_errors_zero | 0 | 0 | PASS |
| only_phase1_catalog_ids | 0 | 0 | PASS |
| peel_duplicate_occurrence_groups_preserved | >0 | 6564 | PASS |
| silver_record_key_unique | 780385 | 780385 | PASS |
| other_bucket_near_target | ~12939 | 12579 | PASS |

## Category family summary

| category_family | rows |
|-----------------|------|
| assault | 288,061 |
| theft_from_vehicle | 118,098 |
| auto_vehicle_theft | 107,970 |
| break_and_enter | 104,160 |
| robbery | 44,365 |
| theft_other | 35,025 |
| fraud | 24,716 |
| mischief_property_damage | 20,382 |
| impaired_driving | 13,543 |
| other | 12,579 |
| drugs | 4,669 |
| traffic_collisions | 3,143 |
| missing_person | 1,600 |
| weapons | 737 |
| sexual_assault | 733 |
| shooting_firearm | 245 |
| arson | 202 |
| homicide | 157 |

## Date range summary

| jurisdiction | min_date | max_date |
|--------------|----------|----------|
| durham-drps | 2008-09-27 | 2026-06-16 |
| halton-hrps | 2025-07-01 | 2026-07-01 |
| hamilton-hps | 2021-09-18 | 2026-06-29 |
| peel-prp | 2023-06-30 | 2026-06-30 |
| tps | 2000-01-01 | 2026-03-31 |
| yrp | 2025-01-01 | 2026-06-30 |

## Mappability summary

| jurisdiction | total | mappable | percent |
|--------------|-------|----------|---------|
| durham-drps | 7,819 | 7,819 | 100% |
| halton-hrps | 20,252 | 20,252 | 100% |
| hamilton-hps | 21,367 | 21,367 | 100% |
| peel-prp | 82,401 | 82,401 | 100% |
| tps | 581,393 | 573,191 | 98.59% |
| yrp | 67,153 | 67,153 | 100% |

## Warnings

- None

## Errors

- None

## Excluded sources (Phase 1 policy)

- `cat-0010`: TPS raw major-crime CSV; use processed V1 only
- `cat-0011`: TPS raw major-crime CSV; use processed V1 only
- `cat-0013`: TPS raw major-crime CSV; use processed V1 only
- `cat-0061`: TPS raw major-crime CSV; use processed V1 only
- `cat-0067`: TPS raw major-crime CSV; use processed V1 only
- `cat-0068`: TPS raw major-crime CSV; use processed V1 only
- `cat-0012`: TPS deferred raw major-crime CSV
- `cat-0031`: TPS sensitive/deferred raw source
- `cat-0037`: TPS sensitive/deferred raw source
- `cat-0049`: TPS sensitive/deferred raw source
- `cat-0073`: Traffic/collision table excluded from Phase 1 silver
- `cat-0077`: Peel legacy no-geometry CSV; primary with-geometry used
- `cat-0092`: YRP CCTV archive-only
- `cat-0094`: Durham standalone extract; master only in Phase 1
- `cat-0095`: Durham standalone extract; master only in Phase 1
- `cat-0096`: Durham standalone extract; master only in Phase 1
- `cat-0097`: Durham standalone extract; master only in Phase 1
- `cat-0098`: Durham standalone extract; master only in Phase 1
- `cat-0099`: Durham standalone extract; master only in Phase 1
- `cat-0100`: Durham standalone extract; master only in Phase 1
- `cat-0106`: Halton GeoJSON mirror; CSV only in Phase 1
- `cat-0107`: Hamilton raw export; HPS-only cleaned used
- `cat-0109`: CrimeMaps benchmark excluded

