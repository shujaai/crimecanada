-- CrimeCanada.io Bronze Smoke Test Sample Queries
-- Generated: 2026-07-02T09:40:16.588Z
-- Database: data/bronze/crimecanada-bronze.sqlite

-- ============================================================
-- A1. Structural checks
-- ============================================================

-- Metadata tables exist
SELECT name FROM sqlite_schema
WHERE type = 'table' AND name IN ('bronze_catalog', 'bronze_load_log')
ORDER BY name;

-- Loaded catalog entries
SELECT COUNT(*) AS loaded_catalog_rows
FROM bronze_catalog
WHERE load_status = 'loaded';

-- Load errors
SELECT COUNT(*) AS error_rows
FROM bronze_catalog
WHERE load_status = 'error';

-- Manifest parity (should return 0 mismatches)
SELECT bc.catalog_id, bc.bronze_table, bc.rows_loaded AS catalog_rows, e.rows_loaded AS manifest_rows
FROM bronze_catalog bc
JOIN (
  SELECT catalog_id, bronze_table, rows_loaded
  FROM json_each('manifest_entries_placeholder')
) e ON e.catalog_id = bc.catalog_id
WHERE bc.rows_loaded != e.rows_loaded OR bc.bronze_table != e.bronze_table;

-- ============================================================
-- A2. Global row totals
-- ============================================================

SELECT SUM(rows_loaded) AS manifest_total_rows
FROM bronze_catalog
WHERE load_status = 'loaded';

-- Per-table counts are in BRONZE_SMOKE_TEST_TABLE_COUNTS.csv (107 tables).
-- Live total verified: 6886703

-- ============================================================
-- A3. Provenance column checks (sample tables)
-- ============================================================

PRAGMA table_info("bronze__tps__tps_major_crime_v1__assault_open_data_4176353985444773481_cs");
PRAGMA table_info("bronze__peel_prp__peel_ecrimes_incidents__peel_prp_ecrimes_2026_07_01_with_geometr");
PRAGMA table_info("bronze__yrp__yrp_community_safety_incidents__yrp_community_safety_occurrences_2026_07");
PRAGMA table_info("bronze__durham_drps__durham_master__durham_drps_avl_odp_crimemap_master_2026");
PRAGMA table_info("bronze__halton_hrps__halton_crime_map_incidents__halton_hrps_crime_map_incidents_2026_07_");

-- Expected provenance columns on every bronze data table:
-- _bronze_catalog_id, _bronze_jurisdiction_id, _bronze_source_path,
-- _bronze_loaded_at_utc, _bronze_ingestion_status

-- ============================================================
-- A4. Cross-jurisdiction spot checks
-- ============================================================

-- TPS assault (expect 254378 rows; occ_date populated; most coords non-zero)
SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN occ_date IS NOT NULL AND occ_date != '' THEN 1 ELSE 0 END) AS occ_date_non_null,
  SUM(CASE WHEN lat_wgs84 NOT IN ('0', '0.0', '') AND long_wgs84 NOT IN ('0', '0.0', '') THEN 1 ELSE 0 END) AS coord_non_zero
FROM "bronze__tps__tps_major_crime_v1__assault_open_data_4176353985444773481_cs";

-- Peel ECrimes incidents (expect 82401)
SELECT COUNT(*) AS total
FROM "bronze__peel_prp__peel_ecrimes_incidents__peel_prp_ecrimes_2026_07_01_with_geometr";

-- YRP community safety (expect 67153)
SELECT COUNT(*) AS total
FROM "bronze__yrp__yrp_community_safety_incidents__yrp_community_safety_occurrences_2026_07";

-- Durham master crime map (expect 7819)
SELECT COUNT(*) AS total
FROM "bronze__durham_drps__durham_master__durham_drps_avl_odp_crimemap_master_2026";

-- Durham standalone assault extract (expect 16157)
SELECT COUNT(*) AS total
FROM "bronze__durham_drps__durham_standalone_extract__durham_drps_assault_open_data_2026_07_01";

-- Halton CSV vs GeoJSON duplicate pair (expect 20252 each)
SELECT 'csv' AS source, COUNT(*) AS total
FROM "bronze__halton_hrps__halton_crime_map_incidents__halton_hrps_crime_map_incidents_2026_07_"
UNION ALL
SELECT 'geojson' AS source, COUNT(*) AS total
FROM "bronze__halton_hrps__halton_crime_map_incidents_geojson__halton_hrps_crime_map_incidents_2026_07_";

-- Hamilton HPS-only cleaned vs raw review (expect 21367 vs 21369)
SELECT 'hps_only_cleaned' AS source, COUNT(*) AS total
FROM "bronze__hamilton_hps__hamilton_communitycrimemap_hps_only__hamilton_communitycrimemap_hps_only_2021"
UNION ALL
SELECT 'raw_review' AS source, COUNT(*) AS total
FROM "bronze__hamilton_hps__hamilton_communitycrimemap_raw__hamilton_communitycrimemap_2000_to_2026_";

-- TPS processed v1 sqlite in bronze (expect 581393)
SELECT COUNT(*) AS total
FROM "bronze__tps__tps_processed_v1__tps_v1_v2_sqlite";
