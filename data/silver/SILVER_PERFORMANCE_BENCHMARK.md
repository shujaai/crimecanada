# Silver Performance Benchmark

Generated: 2026-07-02T11:39:03.889Z

Database: `data/silver/crimecanada-silver.sqlite`

## Overall verdict: **PASS WITH CAVEATS**

## Summary

| Metric | Value |
|--------|-------|
| Indexes applied | 12 |
| Fastest query | hard_crime/durham_shooting (0.03 ms warm) |
| Slowest query | map_bbox/tps_mappable_bbox (5170.78 ms warm) |
| Queries using index (plan) | 23 / 23 |
| GTA core map bbox warm | 77.54 ms (745636 rows) |
| TPS mappable bbox warm | 5170.78 ms |

## Results by query class

| class | query_id | cold_ms | warm_ms | rows | index_used |
|-------|----------|--------:|--------:|-----:|------------|
| jurisdiction_filters | total_by_jurisdiction | 66.5 | 55.3 | 6 | idx_silver_incidents_jurisdiction_id |
| jurisdiction_filters | tps_count | 40.3 | 24.5 | 581393 | idx_silver_incidents_jurisdiction_id |
| category_filters | category_family_counts | 54.3 | 56.6 | 18 | idx_silver_incidents_category_family |
| category_filters | tps_assault | 31.9 | 15.2 | 254378 | idx_silver_incidents_jurisdiction_category_family |
| date_windows | peel_date_window | 10.4 | 8.9 | 82401 | idx_silver_incidents_jurisdiction_occ_date |
| date_windows | yrp_date_window | 3.7 | 1.6 | 67153 | idx_silver_incidents_jurisdiction_occ_date |
| jurisdiction_category_date | toronto_assault_by_year | 775.6 | 790.9 | 27 | idx_silver_incidents_jurisdiction_category_family |
| jurisdiction_category_date | tps_assault_2024 | 6.5 | 4.0 | 25111 | idx_silver_incidents_jurisdiction_occ_date_category |
| municipality_filters | peel_mississauga_assault | 62.5 | 56.6 | 0 | idx_silver_incidents_jurisdiction_category_family |
| municipality_filters | yrp_vaughan_robbery | 1.9 | 0.1 | 222 | idx_silver_incidents_jurisdiction_category_family |
| mappable_filters | mappable_by_jurisdiction | 78.6 | 77.5 | 6 | idx_silver_incidents_jurisdiction_mappable_category |
| mappable_filters | tps_mappable_assault | 16.1 | 15.7 | 250253 | idx_silver_incidents_jurisdiction_mappable_category |
| map_bbox | gta_core_bbox | 81.1 | 77.5 | 745636 | idx_silver_incidents_mappable_lat_lng |
| map_bbox | tps_mappable_bbox | 5583.9 | 5170.8 | 423141 | idx_silver_incidents_mappable_lat_lng |
| hard_crime | peel_hard_crime | 2.9 | 1.7 | 3 | idx_silver_incidents_jurisdiction_category_family |
| hard_crime | yrp_hard_crime | 0.2 | 0.1 | 3 | idx_silver_incidents_jurisdiction_category_family |
| hard_crime | durham_shooting | 0.1 | 0.0 | 61 | idx_silver_incidents_jurisdiction_category_family |
| hard_crime | halton_traffic_robbery | 0.5 | 0.3 | 4 | idx_silver_incidents_jurisdiction_category_family |
| hard_crime | hamilton_selected | 2.1 | 2.5 | 4 | idx_silver_incidents_jurisdiction_category_family |
| top_offence_labels | tps_top_offences | 1886.1 | 1781.4 | 20 | idx_silver_incidents_jurisdiction_mappable_category |
| top_offence_labels | yrp_top_offences | 163.5 | 152.7 | 20 | idx_silver_incidents_jurisdiction_mappable_category |
| jurisdiction_year | tps_by_year | 243.0 | 229.2 | 27 | idx_silver_incidents_jurisdiction_occ_date |
| jurisdiction_date_window | multi_jurisdiction_windows | 124.5 | 108.6 | 4 | idx_silver_incidents_jurisdiction_occ_date |

## App query strategy recommendations

### Safe for first internal API

- `jurisdiction_id` + `category_family` + `occ_date` range (uses composite indexes)
- `mappable = 1` for map endpoints
- Exact `municipality` match (avoid `LIKE` / `LOWER()`)

### Pagination

- **Required** for row-returning SELECT * queries: default `LIMIT 100`, max `LIMIT 500`
- COUNT queries for pagination headers are fast with jurisdiction + category + date filters

### Map queries

- Always require `mappable = 1` + bounding box (`lat`/`lng` BETWEEN)
- Cap map feature limit at **5,000** points per request
- GTA-wide bbox may return large counts; cluster or tile server-side

### Defer

- Full-text search on `offence_raw` / location text (no FTS index; LIKE scans are slow)
- Unanchored `LIKE '%value%'` on municipality

### Future optimization

- Materialized `occ_year` column + index instead of `SUBSTR(occ_date,1,4)` in GROUP BY
- Consider `occ_month` for dashboard rollups

## Related artifacts

- [`SILVER_PERFORMANCE_BENCHMARK.csv`](SILVER_PERFORMANCE_BENCHMARK.csv)
- [`SILVER_INDEXED_QUERY_PLAN_REPORT.md`](SILVER_INDEXED_QUERY_PLAN_REPORT.md)
- [`SILVER_INDEXED_SAMPLE_QUERIES.sql`](SILVER_INDEXED_SAMPLE_QUERIES.sql)
- [`SILVER_INDEX_APPLICATION_REPORT.md`](SILVER_INDEX_APPLICATION_REPORT.md)
