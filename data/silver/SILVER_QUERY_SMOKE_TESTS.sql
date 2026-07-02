-- CrimeCanada.io Silver App-Layer Query Smoke Tests
-- Generated: 2026-07-02T10:23:55.086Z
-- Database: data/silver/crimecanada-silver.sqlite

-- Total incidents by jurisdiction
SELECT jurisdiction_id, COUNT(*) AS total_rows FROM silver_incidents GROUP BY jurisdiction_id ORDER BY total_rows DESC;

-- Total incidents by year
SELECT SUBSTR(occ_date, 1, 4) AS occ_year, COUNT(*) AS total_rows
FROM silver_incidents WHERE occ_date != '' GROUP BY occ_year ORDER BY occ_year;

-- Incidents by category_family
SELECT category_family, COUNT(*) AS total_rows FROM silver_incidents GROUP BY category_family ORDER BY total_rows DESC;

-- Incidents by municipality (top 50)
SELECT jurisdiction_id, municipality, COUNT(*) AS total_rows
FROM silver_incidents GROUP BY jurisdiction_id, municipality ORDER BY total_rows DESC LIMIT 50;

-- Toronto assault by year
SELECT SUBSTR(occ_date, 1, 4) AS occ_year, COUNT(*) AS total_rows
FROM silver_incidents
WHERE jurisdiction_id = 'tps' AND category_family = 'assault' AND occ_date != ''
GROUP BY occ_year ORDER BY occ_year;

-- Peel robbery / homicide / vehicle theft
SELECT category_family, COUNT(*) AS total_rows FROM silver_incidents
WHERE jurisdiction_id = 'peel-prp' AND category_family IN ('robbery', 'homicide', 'auto_vehicle_theft')
GROUP BY category_family;

-- York sexual assault / arson / homicide
SELECT category_family, COUNT(*) AS total_rows FROM silver_incidents
WHERE jurisdiction_id = 'yrp' AND category_family IN ('sexual_assault', 'arson', 'homicide')
GROUP BY category_family;

-- Durham shooting / firearm / homicide
SELECT category_family, offence_raw, COUNT(*) AS total_rows FROM silver_incidents
WHERE jurisdiction_id = 'durham-drps'
  AND (category_family IN ('shooting_firearm', 'homicide')
       OR LOWER(offence_raw) LIKE '%shoot%' OR LOWER(offence_raw) LIKE '%firearm%')
GROUP BY category_family, offence_raw ORDER BY total_rows DESC;

-- Halton robbery / arson / weapons
SELECT offence_raw, category_family, COUNT(*) AS total_rows FROM silver_incidents
WHERE jurisdiction_id = 'halton-hrps'
  AND (category_family IN ('robbery', 'arson')
       OR LOWER(offence_raw) LIKE '%robbery%' OR LOWER(offence_raw) LIKE '%arson%' OR LOWER(offence_raw) LIKE '%weapon%')
GROUP BY offence_raw, category_family ORDER BY total_rows DESC LIMIT 25;

-- Hamilton homicide / robbery / auto theft / B&E
SELECT category_family, COUNT(*) AS total_rows FROM silver_incidents
WHERE jurisdiction_id = 'hamilton-hps'
  AND category_family IN ('homicide', 'robbery', 'auto_vehicle_theft', 'break_and_enter')
GROUP BY category_family;

-- TPS assault / robbery / auto theft samples
SELECT offence_raw, category_family, dataset_slug, COUNT(*) AS total_rows FROM silver_incidents
WHERE jurisdiction_id = 'tps' AND category_family IN ('assault', 'robbery', 'auto_vehicle_theft')
GROUP BY offence_raw, category_family, dataset_slug ORDER BY total_rows DESC LIMIT 20;

-- Mappable incidents only
SELECT jurisdiction_id, COUNT(*) AS total_rows FROM silver_incidents WHERE mappable = 1 GROUP BY jurisdiction_id;

-- Date-window filtered incidents
SELECT jurisdiction_id, COUNT(*) AS total_rows FROM silver_incidents
WHERE (jurisdiction_id = 'peel-prp' AND occ_date >= '2023-06-30')
   OR (jurisdiction_id = 'yrp' AND occ_date >= '2025-01-01')
   OR (jurisdiction_id = 'halton-hrps' AND occ_date >= '2025-07-01')
   OR (jurisdiction_id = 'hamilton-hps' AND occ_date >= '2021-09-18')
   OR jurisdiction_id IN ('tps', 'durham-drps')
GROUP BY jurisdiction_id;

-- City + category filters (Peel Mississauga assault)
SELECT COUNT(*) AS total_rows FROM silver_incidents
WHERE jurisdiction_id = 'peel-prp' AND LOWER(municipality) = 'mississauga' AND category_family = 'assault';

-- City + category filters (York Vaughan robbery)
SELECT COUNT(*) AS total_rows FROM silver_incidents
WHERE jurisdiction_id = 'yrp' AND LOWER(municipality) LIKE '%vaughan%' AND category_family = 'robbery';
