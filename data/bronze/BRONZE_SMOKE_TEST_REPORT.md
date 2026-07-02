# Bronze Smoke Test Report

Generated: 2026-07-02T09:40:16.596Z

Database: `data/bronze/crimecanada-bronze.sqlite`  
Manifest: `data/bronze/bronze-load-manifest.json`  
Catalog: `data/DATA_COLLECTION_MASTER_CATALOG.csv`

## Overall result: **PASS** (with metadata caveat)

### Metadata caveat

- `bronze_catalog` has 108 loaded rows vs 107 manifest entries.
- Orphan metadata row(s): `bronze__hamilton_hps__hamilton_communitycrimemap_hps_only__hamilton_communitycrimemap_hps_only_2021` (catalog_id="").
- All 107 manifest data tables still pass row-count reconciliation.


## Structural checks

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Metadata tables | `bronze_catalog`, `bronze_load_log` | present | PASS |
| Loaded catalog rows | 107 | 108 | WARN |
| Manifest loaded rows | 107 | 107 | PASS |
| Load errors | 0 | 0 | PASS |
| Manifest ↔ bronze_catalog parity | 107/107 match | 107/107 | PASS |
| Data tables in manifest | 107 | 107 | PASS |
| Live row total | 6,886,703 | 6,886,703 | PASS |
| Manifest row total | 6,886,703 | 6,886,703 | PASS |
| Hard table/count failures | 0 | 0 | PASS |
| Load log entries | >0 | 321 | PASS |

## Table count summary

- Total SQLite tables in schema: 145
- Bronze data tables loaded: 107
- Metadata tables: `bronze_catalog`, `bronze_load_log`

### By jurisdiction

| Jurisdiction | Tables |
|--------------|--------|
| tps | 75 |
| peel-prp | 14 |
| durham-drps | 12 |
| yrp | 2 |
| halton-hrps | 2 |
| hamilton-hps | 2 |

## Row count summary

- Live total across 107 data tables: **6,886,703**
- Manifest total: **6,886,703**
- Catalog non-archive candidates loaded: 107 of 107 eligible rows

### Top 15 tables by row count

| Bronze table | Rows |
|--------------|------|
| `bronze__tps__tps_traffic_ksi__traffic_collisions_open_data_81287304025` | 809,034 |
| `bronze__tps__tps_traffic_ksi__traffic_collisions_open_data_81287304025` | 809,034 |
| `bronze__tps__tps_processed_v1__tps_v1_v2_sqlite` | 581,393 |
| `bronze__tps__tps_major_crime_combined__major_crime_indicators_open_data_csv` | 474,819 |
| `bronze__tps__tps_aggregate__2012_firs_7370968145260043353_csv` | 404,293 |
| `bronze__tps__tps_aggregate__2011_firs_4422831101139071978_csv` | 386,315 |
| `bronze__tps__tps_aggregate__2010_firs_2517232609472490769_csv` | 373,297 |
| `bronze__tps__tps_calls_for_service__persons_in_crisis_calls_for_service_atte` | 357,697 |
| `bronze__tps__tps_aggregate__2009_firs_5907723437875695368_csv` | 344,981 |
| `bronze__tps__tps_aggregate__2008_firs_2679553021179060779_csv` | 323,457 |
| `bronze__tps__tps_major_crime_v1__assault_open_data_4176353985444773481_cs` | 254,378 |
| `bronze__tps__tps_sensitive_incident__intimate_partner_and_family_violence_ope` | 190,723 |
| `bronze__tps__tps_aggregate__2013_firs_8501434035380412761_csv` | 189,564 |
| `bronze__tps__tps_aggregate__arrested_and_charged_persons_asr_enf_tbl` | 163,738 |
| `bronze__tps__tps_sensitive_incident__mental_health_act_apprehensions_open_dat` | 134,457 |

## Provenance spot checks

- `bronze__tps__tps_major_crime_v1__assault_open_data_4176353985444773481_cs`: PASS — all 5 provenance columns present
- `bronze__peel_prp__peel_ecrimes_incidents__peel_prp_ecrimes_2026_07_01_with_geometr`: PASS — all 5 provenance columns present
- `bronze__yrp__yrp_community_safety_incidents__yrp_community_safety_occurrences_2026_07`: PASS — all 5 provenance columns present
- `bronze__durham_drps__durham_master__durham_drps_avl_odp_crimemap_master_2026`: PASS — all 5 provenance columns present
- `bronze__halton_hrps__halton_crime_map_incidents__halton_hrps_crime_map_incidents_2026_07_`: PASS — all 5 provenance columns present

## Cross-jurisdiction spot checks

| Source | Expected | Actual | Status |
|--------|----------|--------|--------|
| TPS assault | 254,378 | 254378 | PASS |
| TPS assault occ_date non-null | >0 | 254378 | PASS |
| Peel ECrimes | 82,401 | 82401 | PASS |
| YRP community safety | 67,153 | 67153 | PASS |
| Durham master | 7,819 | 7819 | PASS |
| Durham assault extract | 16,157 | 16157 | PASS |
| Halton CSV | 20,252 | 20252 | PASS |
| Halton GeoJSON | 20,252 | 20252 | PASS |
| Hamilton HPS-only | 21,367 | 21367 | PASS |
| Hamilton raw review | 21,369 | 21369 | PASS |

## Anomalies and notes

No smoke anomalies detected.

### Expected non-fail anomalies (documented)

- **Halton CSV + GeoJSON**: duplicate incident payloads (20252 rows each); silver should ingest CSV as primary.
- **Hamilton raw vs HPS-only cleaned**: raw review file has 2 extra rows vs cleaned public derivative.
- **Duplicate TPS homicide catalog entries**: two source files map to two bronze tables with identical row counts (1531 each); both loaded intentionally for audit, not deduped in bronze.

## Canonical incident tables identified

Total incident-class bronze tables: **31**

Phase 1 silver candidates: **19**  
Deferred / QA-only incident tables: **12**

See `data/silver/SILVER_SOURCE_COLUMN_MAPPING.csv` and `data/silver/SILVER_NORMALIZATION_PLAN.md` for mapping details.

## Related artifacts

- `data/bronze/BRONZE_SMOKE_TEST_TABLE_COUNTS.csv` — per-table reconciliation (107 rows)
- `data/bronze/BRONZE_SMOKE_TEST_SAMPLE_QUERIES.sql` — reproducible validation SQL
