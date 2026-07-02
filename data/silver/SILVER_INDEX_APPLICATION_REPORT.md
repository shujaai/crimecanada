# Silver Index Application Report

Generated: 2026-07-02T11:39:03.889Z

Database: `data/silver/crimecanada-silver.sqlite`

## Overall result: **SUCCESS**

## File size

| When | Size |
|------|------|
| Before indexes | 1564.96 MB (1,640,980,480 bytes) |
| After indexes | 1761.50 MB (1,847,062,528 bytes) |
| Delta | 196.54 MB |

## Indexes before apply

| name | table | sql |
|------|-------|-----|
| sqlite_autoindex_silver_incidents_1 | silver_incidents | (auto) |

## Index application log

| index | applied | duration_ms | error |
|-------|---------|------------:|-------|
| idx_silver_incidents_jurisdiction_id | yes | 1632.8 |  |
| idx_silver_incidents_category_family | yes | 982.5 |  |
| idx_silver_incidents_category_canonical | yes | 1823.6 |  |
| idx_silver_incidents_occ_date | yes | 2184.8 |  |
| idx_silver_incidents_municipality | yes | 2034.4 |  |
| idx_silver_incidents_mappable | yes | 1978.5 |  |
| idx_silver_incidents_jurisdiction_occ_date | yes | 2416.1 |  |
| idx_silver_incidents_jurisdiction_category_family | yes | 2638.3 |  |
| idx_silver_incidents_jurisdiction_municipality | yes | 2413.9 |  |
| idx_silver_incidents_jurisdiction_mappable_category | yes | 2606.9 |  |
| idx_silver_incidents_jurisdiction_occ_date_category | yes | 2920.2 |  |
| idx_silver_incidents_mappable_lat_lng | yes | 2608.3 |  |
| ANALYZE | yes | 1256.3 |  |



## Indexes after apply

| name | table |
|------|-------|
| idx_silver_incidents_category_canonical | silver_incidents |
| idx_silver_incidents_category_family | silver_incidents |
| idx_silver_incidents_jurisdiction_category_family | silver_incidents |
| idx_silver_incidents_jurisdiction_id | silver_incidents |
| idx_silver_incidents_jurisdiction_mappable_category | silver_incidents |
| idx_silver_incidents_jurisdiction_municipality | silver_incidents |
| idx_silver_incidents_jurisdiction_occ_date | silver_incidents |
| idx_silver_incidents_jurisdiction_occ_date_category | silver_incidents |
| idx_silver_incidents_mappable | silver_incidents |
| idx_silver_incidents_mappable_lat_lng | silver_incidents |
| idx_silver_incidents_municipality | silver_incidents |
| idx_silver_incidents_occ_date | silver_incidents |
| sqlite_autoindex_silver_incidents_1 | silver_incidents |

## Post-apply data verification

| check | expected | actual | status |
|-------|----------|--------|--------|
| total_rows | 780385 | 780385 | PASS |
| jurisdiction_tps | 581393 | 581393 | PASS |
| jurisdiction_peel-prp | 82401 | 82401 | PASS |
| jurisdiction_yrp | 67153 | 67153 | PASS |
| jurisdiction_durham-drps | 7819 | 7819 | PASS |
| jurisdiction_halton-hrps | 20252 | 20252 | PASS |
| jurisdiction_hamilton-hps | 21367 | 21367 | PASS |
| other_count | 12579 | 12579 | PASS |
| silver_record_key_unique | 780385 | 780385 | PASS |

## Source

Applied from [`SILVER_INDEX_RECOMMENDATIONS.sql`](SILVER_INDEX_RECOMMENDATIONS.sql) (approved Step 6E).

`source_fields_json` was **not** indexed.
