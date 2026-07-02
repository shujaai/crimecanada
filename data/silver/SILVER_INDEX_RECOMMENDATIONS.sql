-- PROPOSED ONLY. DO NOT RUN UNTIL APPROVED.
-- CrimeCanada.io Silver Index Recommendations
-- Generated: 2026-07-02T10:23:55.086Z
-- Target: data/silver/crimecanada-silver.sqlite :: silver_incidents
-- Apply only after taxonomy cleanup (Step 6C) and before internal API endpoints (Step 6B).

-- Single-column filters
CREATE INDEX IF NOT EXISTS idx_silver_incidents_jurisdiction_id ON silver_incidents (jurisdiction_id);
CREATE INDEX IF NOT EXISTS idx_silver_incidents_category_family ON silver_incidents (category_family);
CREATE INDEX IF NOT EXISTS idx_silver_incidents_category_canonical ON silver_incidents (category_canonical);
CREATE INDEX IF NOT EXISTS idx_silver_incidents_occ_date ON silver_incidents (occ_date);
CREATE INDEX IF NOT EXISTS idx_silver_incidents_municipality ON silver_incidents (municipality);
CREATE INDEX IF NOT EXISTS idx_silver_incidents_mappable ON silver_incidents (mappable);

-- Year extraction (SQLite expression index pattern — prefer occ_date prefix queries until materialized year column exists)
-- CREATE INDEX IF NOT EXISTS idx_silver_incidents_occ_year ON silver_incidents (SUBSTR(occ_date, 1, 4));

-- Composite filters for common app queries
CREATE INDEX IF NOT EXISTS idx_silver_incidents_jurisdiction_occ_date ON silver_incidents (jurisdiction_id, occ_date);
CREATE INDEX IF NOT EXISTS idx_silver_incidents_jurisdiction_category_family ON silver_incidents (jurisdiction_id, category_family);
CREATE INDEX IF NOT EXISTS idx_silver_incidents_jurisdiction_municipality ON silver_incidents (jurisdiction_id, municipality);
CREATE INDEX IF NOT EXISTS idx_silver_incidents_jurisdiction_mappable_category ON silver_incidents (jurisdiction_id, mappable, category_family);
CREATE INDEX IF NOT EXISTS idx_silver_incidents_jurisdiction_occ_date_category ON silver_incidents (jurisdiction_id, occ_date, category_family);

-- Map bounding-box queries (only if map layer uses lat/lng bbox scans on mappable rows)
CREATE INDEX IF NOT EXISTS idx_silver_incidents_mappable_lat_lng ON silver_incidents (mappable, lat, lng);
