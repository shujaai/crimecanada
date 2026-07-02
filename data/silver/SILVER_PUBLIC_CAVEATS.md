# Silver Public Caveats

Generated: 2026-07-02T10:23:55.086Z

Public-facing limitations for Phase 1 silver incident sources. Display alongside any map, table, or search powered by `data/silver/crimecanada-silver.sqlite`.

## Toronto (TPS processed V1)

- **Source:** Toronto Police Service Open Data — processed V1 package (`cat-0075`)
- **URL:** https://data.torontopolice.on.ca/
- **Coverage:** Six published major-crime categories only (assault, auto theft, break and enter, robbery, theft from motor vehicle, theft over)
- **History:** 2000-01-01 through 2026-03-31
- **Not included:** Homicide, shooting/firearm, hate crime, bicycle theft, traffic collisions, and other TPS open datasets remain out of Phase 1 silver
- **Coordinates:** Most rows mappable (98.6%); ~8,202 non-mappable (0,0) rows excluded from map views
- **Duplicates:** `EVENT_UNIQUE_ID` may repeat across offence rows by source design; not deduplicated

## Peel Region (PRP ECrimes)

- **Source:** PRP ECrimes ArcGIS public crime map (`cat-0076`)
- **URL:** https://experience.arcgis.com/experience/6eb9c3c452c34ce2b19821de0f6eb775/
- **Window:** 2023-06-30 through 2026-06-30
- **Privacy:** Offset/generalized locations (`public_offset`); not exact addresses
- **Duplicates:** Duplicate `OccurrenceNumber` rows preserved (6,564 duplicate groups)
- **Category gaps:** Sexual assault and arson not found in public Peel layer per coverage matrix
- **Disclaimer:** Source disclaimer required on public UI

## York Region (YRP Community Safety)

- **Source:** YRP Community Safety Portal (`cat-0090`)
- **URL:** https://community-safety-portal-datayrp.hub.arcgis.com/
- **Window:** 2025-01-01 through 2026-06-30
- **Coverage:** Broad hard-crime and property crime categories; strong assault/robbery/fraud/drugs coverage
- **Disclaimer:** Source disclaimer required on public UI
- **Note:** Some categories flagged in source (e.g. hate crime, shooting) — verify label semantics before hard-crime dashboards

## Durham Region (DRPS master crime map)

- **Source:** DRPS Open Data Hub master AVL crime map (`cat-0093`) — standalone category extracts excluded
- **URL:** https://open-data-drps.hub.arcgis.com/
- **Window:** Occurrence dates 2008-09-27 through 2026-06-16
- **Date nuance:** Master map keyed on occurrence dates; report dates populated on 7819/7819 rows — do not assume report-date filtering equals occurrence-date filtering
- **Taxonomy:** Categories mapped from coarse `crime_category` labels; cross-jurisdiction comparison needs cleanup
- **Disclaimer:** Source disclaimer required on public UI

## Halton Region (HRPS Crime Map CSV)

- **Source:** HRPS Crime Map CSV (`cat-0105`) — GeoJSON mirror excluded
- **URL:** https://www.haltonpolice.ca/crime-files/crime-map/
- **Window:** 2025-07-01 through 2026-07-01
- **Taxonomy:** DESCRIPTION-driven labels include traffic/MVC and administrative categories; many violent categories sparse or absent vs other regions
- **Disclaimer:** Source disclaimer required on public UI

## Hamilton (HPS Community Crime Map — cleaned subset)

- **Source:** HPS-only cleaned Community Crime Map derivative (`cat-0108`) — raw export excluded
- **URL:** https://hamiltonpolice.on.ca/how-to/online-crime-mapping-tool
- **Window:** 2021-09-18 through 2026-06-29
- **Selection:** Selected crime types only (not full Hamilton crime spectrum)
- **Privacy:** Block-masked / offset addresses; do not present as point-precise locations
- **Taxonomy:** Map from `Crime` / `MO_Class` / `UCRGroup`; review before public hard-crime comparisons
