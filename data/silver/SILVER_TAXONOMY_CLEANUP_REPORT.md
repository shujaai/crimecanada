# Silver Taxonomy Cleanup Report

Generated: 2026-07-02T10:49:21.434Z

Database: `data/silver/crimecanada-silver.sqlite` (780,385 rows, unchanged)
Taxonomy V1: `data/silver/SILVER_CATEGORY_TAXONOMY_DRAFT.csv` (unchanged)

## Executive summary

- Current `category_family='other'`: **111,664** rows (**14.31%** of silver)
- Root cause: regional taxonomy rows store placeholder `category_family` values (`DESCRIPTION`, `crime_category`, `occ_type`) that [`normalizeTaxonomyFamily()`](../scripts/load-silver-database.mjs) collapses to `other`, plus intentional keyword rules sending impaired/mischief/weapon/theft-over to `other`.
- Proposed patch mappings: **108**
- Simulated rows moved out of `other` (high+medium confidence): **98,725** (**88.41%** reduction)
- Estimated proposed `other`: **12,939** rows
- Taxonomy V2 draft: **safe for rebuild** with manual review on medium/low mappings listed below

## Root cause

| jurisdiction | other rows | primary cause |
|--------------|----------:|---------------|
| yrp | 44520 | `occ_type` placeholder family blocklisted in loader |
| halton-hrps | 20049 | `DESCRIPTION` placeholder family blocklisted |
| hamilton-hps | 14530 | `selected crimeTypes` placeholder + B&E regex gap |
| tps | 16790 | theft-over slug + keyword rules |
| peel-prp | 13948 | Peel MIS hard-coded to other |
| durham-drps | 1827 | crime_category blocklist + B&E regex gap |

## Top 20 other labels

| jurisdiction | offence_raw | row_count | proposed family | confidence |
|--------------|-------------|----------:|-----------------|------------|
| halton-hrps | ROADSIDE TEST | 10,332 | impaired_driving | high |
| peel-prp | Mischief Over - Property | 9,782 | mischief_property_damage | medium |
| tps | Theft Over | 9,574 | theft_other | high |
| yrp | Theft Under $5000 - Shoplifting | 8,439 | theft_other | high |
| hamilton-hps | Theft Under or equal to $5000 - FROM Motor Vehicle - NO Damage | 5,267 | theft_from_vehicle | high |
| yrp | Mischief To Property | 4,975 | mischief_property_damage | high |
| yrp | Theft Under $5000- Other | 4,921 | theft_other | high |
| tps | Theft From Motor Vehicle Over | 3,961 | theft_other | high |
| peel-prp | Mischief Under - Property | 3,743 | mischief_property_damage | medium |
| yrp | Utter Threats To Person | 3,339 | other_criminal_code | low |
| hamilton-hps | Break and Enter - Business | 3,161 | break_and_enter | high |
| yrp | Possession Under - Property Obtained By Crime | 2,992 | other_criminal_code | low |
| hamilton-hps | Break and Enter - Residence | 2,575 | break_and_enter | high |
| yrp | Theft Over $5000 - Vehicle | 2,547 | auto_vehicle_theft | high |
| hamilton-hps | Theft Under or equal to $5000 - FROM Motor Vehicle - Damage | 2,283 | theft_from_vehicle | high |
| yrp | Theft Under $5000 - From Motor Vehicle | 1,953 | theft_other | high |
| halton-hrps | MVC - HIT & RUN | 1,946 | traffic_collisions | high |
| yrp | Break and Enter  - Residential | 1,934 | break_and_enter | high |
| tps | Theft From Mail / Bag / Key | 1,725 | theft_other | high |
| yrp | Impaired Alcohol / Over 80 Mgs | 1,412 | impaired_driving | high |

## Patch summary

- High confidence patches: **73** (84,816 rows)
- Medium confidence patches: **7** (13,909 rows)
- Low confidence patches: **28** (12,579 rows, excluded from impact simulation)

## Jurisdiction highlights

### Halton (`DESCRIPTION`)
- ROADSIDE TEST (10,332 catalog) → impaired_driving
- MVC labels → traffic_collisions
- PROPERTY DAMAGE → mischief_property_damage
- OFFENSIVE WEAPONS → weapons; FEDERAL STATS - DRUGS → drugs

### Durham (`crime_category`)
- Break & Enter → break_and_enter; Impaired Operation → impaired_driving

### Hamilton (`Crime`)
- B&E / robbery / homicide / vehicle theft labels → respective families

### YRP (`occ_type`)
- Structured occ_type labels → matching families; catch-alls → other_criminal_code or remain other

### Peel (`OccType`)
- MIS → mischief_property_damage (medium confidence, 13,948 rows)

### TPS
- theft-over-open-data dataset → theft_other

## Related artifacts

- [`SILVER_OTHER_BUCKET_ANALYSIS.csv`](SILVER_OTHER_BUCKET_ANALYSIS.csv)
- [`SILVER_CATEGORY_TAXONOMY_PATCH.csv`](SILVER_CATEGORY_TAXONOMY_PATCH.csv)
- [`SILVER_CATEGORY_TAXONOMY_V2_DRAFT.csv`](SILVER_CATEGORY_TAXONOMY_V2_DRAFT.csv)
- [`SILVER_TAXONOMY_IMPACT_ESTIMATE.csv`](SILVER_TAXONOMY_IMPACT_ESTIMATE.csv)
- [`SILVER_TAXONOMY_REBUILD_PLAN.md`](SILVER_TAXONOMY_REBUILD_PLAN.md)

