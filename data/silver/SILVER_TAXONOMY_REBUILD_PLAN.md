# Silver Taxonomy Rebuild Plan

Generated: 2026-07-02T10:49:21.434Z

## Safety verdict

**Taxonomy V2 is safe to use for silver rebuild** for high-confidence mappings. Medium-confidence mappings (Peel MIS, some TPS keyword fallbacks, YRP Attempt Murder / Firearms Violations) should be reviewed before expanding public MVP category filters.

Do **not** rebuild in this step. Await explicit user approval.

## High-confidence mappings (apply on rebuild)

- halton-hrps / ROADSIDE TEST → impaired_driving (10,332 rows)
- tps / Theft Over → theft_other (9,574 rows)
- yrp / Theft Under $5000 - Shoplifting → theft_other (8,439 rows)
- hamilton-hps / Theft Under or equal to $5000 - FROM Motor Vehicle - NO Damage → theft_from_vehicle (5,267 rows)
- yrp / Mischief To Property → mischief_property_damage (4,975 rows)
- yrp / Theft Under $5000- Other → theft_other (4,921 rows)
- tps / Theft From Motor Vehicle Over → theft_other (3,961 rows)
- hamilton-hps / Break and Enter - Business → break_and_enter (3,161 rows)
- hamilton-hps / Break and Enter - Residence → break_and_enter (2,575 rows)
- yrp / Theft Over $5000 - Vehicle → auto_vehicle_theft (2,547 rows)
- hamilton-hps / Theft Under or equal to $5000 - FROM Motor Vehicle - Damage → theft_from_vehicle (2,283 rows)
- yrp / Theft Under $5000 - From Motor Vehicle → theft_other (1,953 rows)
- halton-hrps / MVC - HIT & RUN → traffic_collisions (1,946 rows)
- yrp / Break and Enter  - Residential → break_and_enter (1,934 rows)
- tps / Theft From Mail / Bag / Key → theft_other (1,725 rows)
- yrp / Impaired Alcohol / Over 80 Mgs → impaired_driving (1,412 rows)
- halton-hrps / THEFT OF VEHICLE → auto_vehicle_theft (1,233 rows)
- halton-hrps / MVC - PI → traffic_collisions (1,165 rows)
- durham-drps / Break & Enter → break_and_enter (1,075 rows)
- yrp / Break and Enter  - Commercial → break_and_enter (1,054 rows)
- halton-hrps / THEFT FROM AUTO → theft_from_vehicle (1,045 rows)
- halton-hrps / THEFT UNDER → theft_other (1,029 rows)
- hamilton-hps / Break and Enter - Other → break_and_enter (969 rows)
- yrp / Missing Person-Adult → missing_person (935 rows)
- tps / Theft Over - Shoplifting → theft_other (826 rows)


... and 48 more in SILVER_CATEGORY_TAXONOMY_PATCH.csv


## Manual review queue (medium/low)

- [medium] peel-prp / Mischief Over - Property → mischief_property_damage: 13,948+ rows — review before public MVP
- [medium] peel-prp / Mischief Under - Property → mischief_property_damage: 13,948+ rows — review before public MVP
- [medium] peel-prp / Mischief/(Non-Physical) Property → mischief_property_damage: 13,948+ rows — review before public MVP
- [medium] peel-prp / Cybercrime - Mischief to Data/Ransomware/Malware - Denial of Service/Webpage Defacement → mischief_property_damage: 13,948+ rows — review before public MVP
- [medium] halton-hrps / DANGEROUS OPERATION - TRAFFIC → traffic_collisions: Could also be impaired_driving; review if needed
- [medium] peel-prp / Hate Motivated Mischief Relating to Property Used By Identifiable Group → mischief_property_damage: 13,948+ rows — review before public MVP
- [medium] peel-prp / Mischief in relation to cultural property → mischief_property_damage: 13,948+ rows — review before public MVP
- [low] yrp / Utter Threats To Person → other_criminal_code: Manual review
- [low] yrp / Possession Under - Property Obtained By Crime → other_criminal_code: Manual review
- [low] yrp / Criminal Harassment → other_criminal_code: Manual review
- [low] yrp / Harassing / Indecent Communications → other_criminal_code: Manual review
- [low] yrp / Other Persons Crime → other_criminal_code: Manual review
- [low] yrp / Trafficking Stolen Goods Over $5000 → other_criminal_code: Manual review
- [low] yrp / Possession Over - Property Obtained By Crime → other_criminal_code: Manual review
- [low] yrp / Extortion → other_criminal_code: Manual review
- [low] yrp / Disguise With Intent → other_criminal_code: Manual review
- [low] yrp / Trespass To Property Act → other: Manual review
- [low] yrp / Utter Threats to Property / Animals → other_criminal_code: Manual review
- [low] halton-hrps / RECOVERED VEHICLE OTH SERVICE → other: Manual review — not a crime type
- [low] yrp / Liquor - Other Offences → other: Manual review
- [low] yrp / Public Morals → other_criminal_code: Manual review
- [low] yrp / Liquor - Intoxicated → other: Manual review
- [low] yrp / Possession of Break and Enter Instruments → other_criminal_code: Manual review
- [low] yrp / Trespass By Night → other_criminal_code: Manual review
- [low] yrp / Proceeds Of Crime → other_criminal_code: Manual review
- [low] yrp / Firearms / Other Offensive Weapons → other_criminal_code: Manual review
- [low] yrp / Personate Peace Officer → other_criminal_code: Manual review
- [low] yrp / Escape Custody → other_criminal_code: Manual review
- [low] yrp / Trafficking Stolen Goods Under $5000 → other_criminal_code: Manual review
- [low] yrp / Other Gaming / Betting - Other → other_criminal_code: Manual review
- [low] yrp / Gaming House - Keeper → other_criminal_code: Manual review
- [low] yrp / Gaming House - Found In → other_criminal_code: Manual review
- [low] yrp / Prisoner Unlawfully At Large → other_criminal_code: Manual review
- [low] yrp / Incite Hatred → other_criminal_code: Manual review
- [low] yrp / Other Gaming / Betting - Lotteries → other_criminal_code: Manual review

## Loader changes required (not applied in Step 6C)

Update [`scripts/load-silver-database.mjs`](../scripts/load-silver-database.mjs) before rebuild:

1. Set `TAXONOMY_PATH` to `data/silver/SILVER_CATEGORY_TAXONOMY_V2_DRAFT.csv`
2. Fix `normalizeTaxonomyFamily()` to trust V2 `category_family` when it is a valid allowed family (remove placeholder blocklist once V2 rows are corrected)
3. Extend `keywordFamily()` for: `impaired_driving`, `weapons`, `mischief_property_damage`, `traffic_collisions`, `theft_other`, `missing_person`, `other_criminal_code`
4. Fix Break & Enter regex: `\bbreak\s*(?:&|and)\s*enter\b`
5. Update `PEEL_OCC_TYPE.MIS` from `other` to `mischief_property_damage` (after approval)
6. Update `TPS_SLUG_FAMILY['theft-over-open-data']` from `other` to `theft_other`

## Exact rebuild request

```text
Rebuild silver Phase 1 using taxonomy V2: update scripts/load-silver-database.mjs to load data/silver/SILVER_CATEGORY_TAXONOMY_V2_DRAFT.csv, apply loader mapping fixes documented in SILVER_TAXONOMY_REBUILD_PLAN.md, then run node scripts/load-silver-database.mjs and re-run Step 5 QA.
```

## Expected post-rebuild category counts (simulated)

| category_family | current | proposed |
|-----------------|--------:|---------:|
| assault | 287,769 | 287,855 |
| theft_from_vehicle | 109,228 | 118,098 |
| auto_vehicle_theft | 103,887 | 107,970 |
| break_and_enter | 92,355 | 104,102 |
| robbery | 44,365 | 44,365 |
| theft_other | 0 | 35,025 |
| fraud | 24,716 | 24,716 |
| mischief_property_damage | 0 | 20,319 |
| impaired_driving | 0 | 13,001 |
| other | 111,664 | 12,939 |
| drugs | 4,853 | 4,968 |
| traffic_collisions | 0 | 3,143 |
| missing_person | 0 | 1,600 |
| weapons | 0 | 736 |
| sexual_assault | 733 | 733 |
| shooting_firearm | 456 | 456 |
| arson | 202 | 202 |
| homicide | 157 | 157 |

Summary:
- current other: 111,664
- proposed other: 12,939
- rows moved out of other: 98,725 (88.41% reduction)

## Risks

- Cross-jurisdiction category totals will shift when Halton traffic/impaired and YRP occ_type labels leave `other`
- New families (`impaired_driving`, `traffic_collisions`, `mischief_property_damage`, `theft_other`, `missing_person`, `other_criminal_code`, `weapons`) are not in current app filters
- Peel MIS semantic debate (mischief vs generic other)
- Do not apply indexes until post-rebuild Step 5 QA passes

## Next steps after rebuild

1. Re-run Step 5 cross-jurisdiction QA
2. Step 6A — apply proposed indexes from SILVER_INDEX_RECOMMENDATIONS.sql
3. Step 6B — internal API/query endpoints
