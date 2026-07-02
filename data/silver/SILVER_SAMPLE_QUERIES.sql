-- CrimeCanada.io Silver Sample Queries
-- Generated: 2026-07-02T11:27:33.988Z
-- Database: data/silver/crimecanada-silver.sqlite

-- Total rows by jurisdiction
SELECT jurisdiction_id, COUNT(*) AS total_rows
FROM silver_incidents
GROUP BY jurisdiction_id
ORDER BY total_rows DESC;

-- Rows by category_family
SELECT category_family, COUNT(*) AS total_rows
FROM silver_incidents
GROUP BY category_family
ORDER BY total_rows DESC;

-- Rows by year and jurisdiction
SELECT jurisdiction_id, SUBSTR(occ_date, 1, 4) AS occ_year, COUNT(*) AS total_rows
FROM silver_incidents
WHERE occ_date != ''
GROUP BY jurisdiction_id, occ_year
ORDER BY jurisdiction_id, occ_year;

-- Top 20 offence_raw labels
SELECT offence_raw, COUNT(*) AS total_rows
FROM silver_incidents
GROUP BY offence_raw
ORDER BY total_rows DESC
LIMIT 20;

-- Mappable percent by jurisdiction
SELECT jurisdiction_id,
       COUNT(*) AS total_rows,
       SUM(CASE WHEN mappable = 1 THEN 1 ELSE 0 END) AS mappable_rows,
       ROUND(100.0 * SUM(CASE WHEN mappable = 1 THEN 1 ELSE 0 END) / COUNT(*), 2) AS mappable_percent
FROM silver_incidents
GROUP BY jurisdiction_id
ORDER BY jurisdiction_id;

-- Hard-crime counts by jurisdiction
SELECT jurisdiction_id, category_family, COUNT(*) AS total_rows
FROM silver_incidents
WHERE category_family IN ('assault', 'robbery', 'homicide', 'shooting_firearm', 'sexual_assault', 'arson')
GROUP BY jurisdiction_id, category_family
ORDER BY jurisdiction_id, category_family;

-- Sample Hamilton rows
SELECT silver_record_key, occ_date, offence_raw, category_family, municipality, lat, lng, mappable
FROM silver_incidents
WHERE jurisdiction_id = 'hamilton-hps'
LIMIT 10;

-- Sample Peel duplicate OccurrenceNumber rows
SELECT occurrence_group_key, COUNT(*) AS row_count
FROM silver_incidents
WHERE jurisdiction_id = 'peel-prp'
GROUP BY occurrence_group_key
HAVING COUNT(*) > 1
ORDER BY row_count DESC
LIMIT 10;

-- Sample York homicide / sexual / arson rows if present
SELECT offence_raw, category_family, occ_date, municipality, lat, lng
FROM silver_incidents
WHERE jurisdiction_id = 'yrp'
  AND category_family IN ('homicide', 'sexual_assault', 'arson')
LIMIT 20;

-- Sample Durham shooting / firearm rows if present
SELECT offence_raw, category_family, occ_date, municipality, lat, lng
FROM silver_incidents
WHERE jurisdiction_id = 'durham-drps'
  AND (category_family = 'shooting_firearm' OR LOWER(offence_raw) LIKE '%shoot%' OR LOWER(offence_raw) LIKE '%firearm%')
LIMIT 20;

-- Sample Halton robbery / arson / weapons rows if present
SELECT offence_raw, category_family, occ_date, municipality, lat, lng
FROM silver_incidents
WHERE jurisdiction_id = 'halton-hrps'
  AND (
    category_family IN ('robbery', 'arson')
    OR LOWER(offence_raw) LIKE '%robbery%'
    OR LOWER(offence_raw) LIKE '%arson%'
    OR LOWER(offence_raw) LIKE '%weapon%'
  )
LIMIT 20;

-- Sample TPS assault / robbery / auto theft rows
SELECT offence_raw, category_family, dataset_slug, occ_date, division, lat, lng, mappable
FROM silver_incidents
WHERE jurisdiction_id = 'tps'
  AND category_family IN ('assault', 'robbery', 'auto_vehicle_theft')
LIMIT 20;
