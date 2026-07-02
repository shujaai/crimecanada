-- CrimeCanada.io Silver Indexed Sample Queries
-- Applied indexes: see SILVER_INDEX_APPLICATION_REPORT.md
-- Generated: 2026-07-02T11:39:03.889Z
-- Database: data/silver/crimecanada-silver.sqlite

-- Filtered incident list (paginated)
-- Bind: jurisdiction_id, category_family, occ_date_from, occ_date_to, limit, offset
SELECT silver_record_key, jurisdiction_id, occ_date, category_family, offence_raw, municipality, lat, lng, mappable
FROM silver_incidents
WHERE jurisdiction_id = ?
  AND category_family = ?
  AND occ_date >= ?
  AND occ_date <= ?
ORDER BY occ_date DESC
LIMIT ? OFFSET ?;

-- Count for pagination header
-- Bind: jurisdiction_id, category_family, occ_date_from, occ_date_to
SELECT COUNT(*) AS total_rows
FROM silver_incidents
WHERE jurisdiction_id = ?
  AND category_family = ?
  AND occ_date >= ?
  AND occ_date <= ?;

-- Mappable map layer (bbox + jurisdiction)
-- Bind: jurisdiction_id, lat_min, lat_max, lng_min, lng_max, limit
SELECT silver_record_key, occ_date, category_family, offence_raw, lat, lng, municipality
FROM silver_incidents
WHERE jurisdiction_id = ?
  AND mappable = 1
  AND lat BETWEEN ? AND ?
  AND lng BETWEEN ? AND ?
LIMIT ?;

-- Aggregate by year (prefer occ_date range filters over SUBSTR in API)
-- Bind: jurisdiction_id, category_family, occ_date_from, occ_date_to
SELECT SUBSTR(occ_date, 1, 4) AS occ_year, COUNT(*) AS total_rows
FROM silver_incidents
WHERE jurisdiction_id = ?
  AND category_family = ?
  AND occ_date >= ?
  AND occ_date <= ?
GROUP BY occ_year
ORDER BY occ_year;

-- Jurisdiction + municipality + category (exact municipality match)
-- Bind: jurisdiction_id, municipality, category_family
SELECT COUNT(*) AS total_rows
FROM silver_incidents
WHERE jurisdiction_id = ?
  AND municipality = ?
  AND category_family = ?;

-- Mappable-only counts by jurisdiction
SELECT jurisdiction_id, COUNT(*) AS total_rows
FROM silver_incidents
WHERE mappable = 1
GROUP BY jurisdiction_id;

-- Hard-crime filter (Peel example)
SELECT category_family, COUNT(*) AS total_rows
FROM silver_incidents
WHERE jurisdiction_id = 'peel-prp'
  AND category_family IN ('robbery', 'homicide', 'auto_vehicle_theft')
GROUP BY category_family;
