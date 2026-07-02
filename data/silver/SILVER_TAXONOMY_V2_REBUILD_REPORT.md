# Silver Taxonomy V2 Rebuild Report

Generated: 2026-07-02T11:28:04.902Z

Database: `data/silver/crimecanada-silver.sqlite`
Taxonomy: `data/silver/SILVER_CATEGORY_TAXONOMY_V2_DRAFT.csv`

## Overall verdict: **PASS**

## Before/after other metrics

| Metric | Value |
|--------|------:|
| Previous other | 111,664 |
| New other | 12,579 |
| Rows moved out of other | 99,085 |
| Reduction | 88.73% |
| Step 6C target | ~12,939 |
| Target within ±5% | yes (12,579 vs 12,939 target; Δ360 rows) |

## Loader tuning notes

- Taxonomy source switched to `SILVER_CATEGORY_TAXONOMY_V2_DRAFT.csv`.
- `normalizeTaxonomyFamily()` trusts V2 families when allowed; maps legacy aliases (`auto_theft`, `theft_over`, etc.).
- Residual catch-alls: V2 `other_criminal_code` taxonomy rows are stored in the taxonomy table but mapped to runtime `category_family='other'` to align with Step 6C impact estimate (no separate `other_criminal_code` incident bucket in silver).
- Low-confidence taxonomy exact matches are skipped; keyword/taxonomy high-confidence mappings apply first after Peel occ-type codes.
- Peel `MIS` → `mischief_property_damage`; TPS `theft-over-open-data` slug → `theft_other`.

## Hard-gate QA

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| total_rows | 780385 | 780385 | PASS |
| jurisdiction_tps | 581393 | 581393 | PASS |
| jurisdiction_peel-prp | 82401 | 82401 | PASS |
| jurisdiction_yrp | 67153 | 67153 | PASS |
| jurisdiction_durham-drps | 7819 | 7819 | PASS |
| jurisdiction_halton-hrps | 20252 | 20252 | PASS |
| jurisdiction_hamilton-hps | 21367 | 21367 | PASS |
| silver_record_key_unique | 780385 | 780385 | PASS |
| source_fields_json_populated | 0 | 0 | PASS |
| load_errors_zero | 0 | 0 | PASS |
| only_phase1_catalog_ids | 6 | 6 | PASS |
| peel_duplicate_groups | >0 | 6564 | PASS |
| other_near_target | ~12939 | 12579 | PASS |

## Category family distribution (post-rebuild)

| category_family | rows |
|-----------------|-----:|
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

## Step 5 core QA summary

### Year coverage
- durham-drps: 2008-2026
- halton-hrps: 2025-2026
- hamilton-hps: 2021-2026
- peel-prp: 2023-2026
- tps: 2000-2026
- yrp: 2025-2026

### Geography / coordinates
- durham-drps: 100% mappable
- halton-hrps: 100% mappable
- hamilton-hps: 100% mappable
- peel-prp: 100% mappable
- tps: 98.59% mappable
- yrp: 100% mappable
- mappable rows outside Ontario bbox: 0

### Duplicate / overlap
- silver_record_key unique: yes
- Peel duplicate groups: 6,564
- Phase 1 catalog_ids: cat-0075, cat-0076, cat-0090, cat-0093, cat-0105, cat-0108

### Smoke query results
- **total_by_jurisdiction**: 6 row(s)
- **toronto_assault**: 254,378
- **halton_impaired**: 10,825
- **yrp_theft_other**: 16,685
- **durham_break_enter**: 1,075
- **mappable_only**: 6 row(s)

## Remaining other bucket (top 15 labels)

| jurisdiction | offence_raw | rows |
|--------------|-------------|-----:|
| yrp | Utter Threats To Person | 3,339 |
| yrp | Possession Under - Property Obtained By Crime | 2,992 |
| yrp | Criminal Harassment | 1,187 |
| yrp | Harassing / Indecent Communications | 1,153 |
| yrp | Other Persons Crime | 504 |
| yrp | Trafficking Stolen Goods Over $5000 | 470 |
| yrp | Possession Over - Property Obtained By Crime | 405 |
| yrp | Extortion | 391 |
| yrp | Disguise With Intent | 349 |
| yrp | Trespass To Property Act | 338 |
| yrp | Utter Threats to Property / Animals | 299 |
| halton-hrps | RECOVERED VEHICLE OTH SERVICE | 205 |
| yrp | Liquor - Other Offences | 190 |
| yrp | Public Morals | 172 |
| yrp | Liquor - Intoxicated | 158 |

## Medium/low-confidence mapping warnings

- [medium] peel-prp / Mischief descriptions → mischief_property_damage (13,948+ rows)
- [medium] halton-hrps / DANGEROUS OPERATION - TRAFFIC → traffic_collisions
- [low] yrp / catch-all labels → other_criminal_code or other (Utter Threats, Provincial Offences, etc.)
- [low] halton-hrps / RECOVERED VEHICLE OTH SERVICE → other (admin/recovery)

## Recommended next step

Step 6E — apply proposed silver indexes from `SILVER_INDEX_RECOMMENDATIONS.sql` and run performance benchmark, only if QA passes.

