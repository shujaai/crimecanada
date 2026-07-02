# Silver Indexed Query Plan Report

Generated: 2026-07-02T11:39:03.889Z

Database: `data/silver/crimecanada-silver.sqlite`

## Summary

- Benchmark queries run: 23
- Queries with index use in plan: 23
- Benchmark verdict: **PASS WITH CAVEATS**

## tps_count

**Class:** jurisdiction_filters

**SQL:**

```sql
SELECT COUNT(*) AS c FROM silver_incidents WHERE jurisdiction_id = 'tps'
```

**Warm run:** 24.53 ms | **Rows:** 581393

**Index used:** yes (idx_silver_incidents_jurisdiction_id)

**EXPLAIN QUERY PLAN:**

```
SEARCH silver_incidents USING COVERING INDEX idx_silver_incidents_jurisdiction_id (jurisdiction_id=?)
```

**Notes:** —


## category_family_counts

**Class:** category_filters

**SQL:**

```sql
SELECT category_family, COUNT(*) AS c FROM silver_incidents GROUP BY category_family ORDER BY c DESC
```

**Warm run:** 56.62 ms | **Rows:** 18

**Index used:** yes (idx_silver_incidents_category_family)

**EXPLAIN QUERY PLAN:**

```
SCAN silver_incidents USING COVERING INDEX idx_silver_incidents_category_family | USE TEMP B-TREE FOR ORDER BY
```

**Notes:** Global aggregate


## peel_date_window

**Class:** date_windows

**SQL:**

```sql
SELECT COUNT(*) AS c FROM silver_incidents WHERE jurisdiction_id = 'peel-prp' AND occ_date >= '2023-06-30'
```

**Warm run:** 8.89 ms | **Rows:** 82401

**Index used:** yes (idx_silver_incidents_jurisdiction_occ_date)

**EXPLAIN QUERY PLAN:**

```
SEARCH silver_incidents USING COVERING INDEX idx_silver_incidents_jurisdiction_occ_date (jurisdiction_id=? AND occ_date>?)
```

**Notes:** —


## toronto_assault_by_year

**Class:** jurisdiction_category_date

**SQL:**

```sql
SELECT SUBSTR(occ_date, 1, 4) AS occ_year, COUNT(*) AS c FROM silver_incidents
     WHERE jurisdiction_id = 'tps' AND category_family = 'assault' AND occ_date != ''
     GROUP BY occ_year ORDER BY occ_year
```

**Warm run:** 790.86 ms | **Rows:** 27

**Index used:** yes (idx_silver_incidents_jurisdiction_category_family)

**EXPLAIN QUERY PLAN:**

```
SEARCH silver_incidents USING INDEX idx_silver_incidents_jurisdiction_category_family (jurisdiction_id=? AND category_family=?) | USE TEMP B-TREE FOR GROUP BY
```

**Notes:** SUBSTR may reduce index use on occ_date


## tps_assault_2024

**Class:** jurisdiction_category_date

**SQL:**

```sql
SELECT COUNT(*) AS c FROM silver_incidents WHERE jurisdiction_id = 'tps' AND category_family = 'assault' AND occ_date >= '2024-01-01' AND occ_date < '2025-01-01'
```

**Warm run:** 3.96 ms | **Rows:** 25111

**Index used:** yes (idx_silver_incidents_jurisdiction_occ_date_category)

**EXPLAIN QUERY PLAN:**

```
SEARCH silver_incidents USING COVERING INDEX idx_silver_incidents_jurisdiction_occ_date_category (jurisdiction_id=? AND occ_date>? AND occ_date<?)
```

**Notes:** —


## peel_mississauga_assault

**Class:** municipality_filters

**SQL:**

```sql
SELECT COUNT(*) AS c FROM silver_incidents WHERE jurisdiction_id = 'peel-prp' AND municipality = 'Mississauga' AND category_family = 'assault'
```

**Warm run:** 56.65 ms | **Rows:** 0

**Index used:** yes (idx_silver_incidents_jurisdiction_category_family)

**EXPLAIN QUERY PLAN:**

```
SEARCH silver_incidents USING INDEX idx_silver_incidents_jurisdiction_category_family (jurisdiction_id=? AND category_family=?)
```

**Notes:** Exact municipality match uses composite index


## yrp_vaughan_robbery

**Class:** municipality_filters

**SQL:**

```sql
SELECT COUNT(*) AS c FROM silver_incidents WHERE jurisdiction_id = 'yrp' AND municipality LIKE '%Vaughan%' AND category_family = 'robbery'
```

**Warm run:** 0.13 ms | **Rows:** 222

**Index used:** yes (idx_silver_incidents_jurisdiction_category_family)

**EXPLAIN QUERY PLAN:**

```
SEARCH silver_incidents USING INDEX idx_silver_incidents_jurisdiction_category_family (jurisdiction_id=? AND category_family=?)
```

**Notes:** LIKE prevents municipality index


## mappable_by_jurisdiction

**Class:** mappable_filters

**SQL:**

```sql
SELECT jurisdiction_id, COUNT(*) AS c FROM silver_incidents WHERE mappable = 1 GROUP BY jurisdiction_id
```

**Warm run:** 77.48 ms | **Rows:** 6

**Index used:** yes (idx_silver_incidents_jurisdiction_mappable_category)

**EXPLAIN QUERY PLAN:**

```
SCAN silver_incidents USING COVERING INDEX idx_silver_incidents_jurisdiction_mappable_category
```

**Notes:** —


## tps_mappable_assault

**Class:** mappable_filters

**SQL:**

```sql
SELECT COUNT(*) AS c FROM silver_incidents WHERE jurisdiction_id = 'tps' AND mappable = 1 AND category_family = 'assault'
```

**Warm run:** 15.72 ms | **Rows:** 250253

**Index used:** yes (idx_silver_incidents_jurisdiction_mappable_category)

**EXPLAIN QUERY PLAN:**

```
SEARCH silver_incidents USING COVERING INDEX idx_silver_incidents_jurisdiction_mappable_category (jurisdiction_id=? AND mappable=? AND category_family=?)
```

**Notes:** —


## gta_core_bbox

**Class:** map_bbox

**SQL:**

```sql
SELECT COUNT(*) AS c FROM silver_incidents
     WHERE mappable = 1 AND lat BETWEEN 43.4 AND 44.4 AND lng BETWEEN -80.2 AND -78.5
```

**Warm run:** 77.54 ms | **Rows:** 745636

**Index used:** yes (idx_silver_incidents_mappable_lat_lng)

**EXPLAIN QUERY PLAN:**

```
SEARCH silver_incidents USING COVERING INDEX idx_silver_incidents_mappable_lat_lng (mappable=? AND lat>? AND lat<?)
```

**Notes:** Bounding-box scan on mappable rows


## durham_shooting

**Class:** hard_crime

**SQL:**

```sql
SELECT COUNT(*) AS c FROM silver_incidents WHERE jurisdiction_id = 'durham-drps'
     AND category_family IN ('shooting_firearm', 'homicide')
```

**Warm run:** 0.03 ms | **Rows:** 61

**Index used:** yes (idx_silver_incidents_jurisdiction_category_family)

**EXPLAIN QUERY PLAN:**

```
SEARCH silver_incidents USING COVERING INDEX idx_silver_incidents_jurisdiction_category_family (jurisdiction_id=? AND category_family=?)
```

**Notes:** —


## tps_top_offences

**Class:** top_offence_labels

**SQL:**

```sql
SELECT offence_raw, COUNT(*) AS c FROM silver_incidents
     WHERE jurisdiction_id = 'tps' GROUP BY offence_raw ORDER BY c DESC LIMIT 20
```

**Warm run:** 1781.38 ms | **Rows:** 20

**Index used:** yes (idx_silver_incidents_jurisdiction_mappable_category)

**EXPLAIN QUERY PLAN:**

```
SEARCH silver_incidents USING INDEX idx_silver_incidents_jurisdiction_mappable_category (jurisdiction_id=?) | USE TEMP B-TREE FOR GROUP BY | USE TEMP B-TREE FOR ORDER BY
```

**Notes:** Sort on aggregate; jurisdiction index helps scan


