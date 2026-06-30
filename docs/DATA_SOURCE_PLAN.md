# CrimeCanada.io — Data Source Plan

Data acquisition strategy for V1 and beyond. V1 is **TPS-only**.

**Canonical strategy:** [Unified Source Foundation + Layered Release](./NORTH_STAR.md#unified-source-foundation--layered-release) — preserve the full TPS corpus; publish public features layer by layer.

See also: [NORTH_STAR.md](./NORTH_STAR.md), [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md), [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md), [TPS_RAW_DATA_INVENTORY_2026-06-30.md](./TPS_RAW_DATA_INVENTORY_2026-06-30.md).

---

## V1 Scope: Toronto Police Service Only

CrimeCanada.io V1 ingests **one typed layer** from **one jurisdiction:**

**Toronto Police Service (TPS) public/open data** — Major Crime Open Data 31-column family (six files)

- No other cities in V1
- No provincial or national aggregated datasets in V1
- No CrimeInToronto articles or micro incident data in V1
- No unofficial, scraped, or restricted sources
- Full TPS corpus (74 files) is preserved and classified; only the six-file family is published in V1 UI

---

## Unified Source Foundation

As of 2026-06-30:

- **74 TPS CSV files** under `data/raw/tps/_downloads/2026-06-30` (~1,035 MB; includes relocated Major Crime Indicators export)
- Structural inventory completed: [TPS_RAW_DATA_INVENTORY_2026-06-30.md](./TPS_RAW_DATA_INVENTORY_2026-06-30.md)
- Every file is a **first-class source dataset** — not forced into one incident schema
- Original files are stored **unmodified**; never overwrite prior downloads
- Each dataset will receive typed layer classification, provenance metadata, and (when applicable) layer-specific ingestion schema

**Anti-pattern:** Do not ingest all 74 files into a single universal incident table.

---

## Typed Source Layers

Each TPS dataset is assigned exactly one typed layer. Layers may have different schema boundaries while sharing common dataset metadata (`jurisdictions`, `datasets`, `ingestion_runs`).

| Layer | Description | Example TPS datasets |
|-------|-------------|---------------------|
| `public_incident_records` | Standard geocoded incident open data for public search, table, and map | Major Crime Open Data x6 (**V1 published**) |
| `sensitive_incident_records` | Incident data requiring additional legal or presentation review | Homicides, Shooting and Firearm Discharges, Hate Crime, Intimate Partner and Family Violence, Mental Health Act Apprehensions |
| `traffic_ksi_records` | Traffic collisions and KSI participant-level records | AUTOMOBILE_KSI, CYCLIST_KSI, FATALS_KSI, MOTORCYCLIST_KSI, PASSENGER_KSI, PEDESTRIAN_KSI, TOTAL_KSI, Traffic Collisions Open Data |
| `calls_for_service_crisis_records` | Crisis and mental-health-related calls-for-service | Persons in Crisis Calls for Service Attended |
| `aggregate_metric_tables` | Annual reports, budgets, FIRS, RBDC, and count/summary tables | ASR_* tables, Budget_* files, FIRS (2008–2013), RBDC_* tables, Neighbourhood Crime Rates Open Data, Staffing by Command |
| `reference_geography_datasets` | Division boundaries, patrol zones, facilities, reference geometry | TPS Police Divisions, Patrol Zone, Police Facilities |
| `future_article_context_links` | Future CrimeInToronto article or micro-data links | Not ingested in V1; 0 article records today |

**Note:** Bicycle Thefts Open Data shares the 31-column Major Crime schema but is **deferred from V1** — classify for a future public or sensitive layer decision, not V1.

---

## V1 Published Dataset Family: Major Crime Open Data

V1 public UI is powered by **six offence-specific datasets** sharing a **31-column schema**:

| Dataset | Example filename |
|---------|-----------------|
| Assault Open Data | `Assault_Open_Data_4176353985444773481.csv` |
| Auto Theft Open Data | `Auto_Theft_Open_Data_4481082360476864088.csv` |
| Break and Enter Open Data | `Break_and_Enter_Open_Data_9198768316349412680.csv` |
| Robbery Open Data | `Robbery_Open_Data_2226832258065309099.csv` |
| Theft From Motor Vehicle Open Data | `Theft_From_Motor_Vehicle_Open_Data_4636805822324249695.csv` |
| Theft Over Open Data | `Theft_Over_Open_Data_-309556416197554984.csv` |

### Shared schema (31 columns)

`OBJECTID`, `EVENT_UNIQUE_ID`, `REPORT_DATE`, `OCC_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DAY`, `REPORT_DOY`, `REPORT_DOW`, `REPORT_HOUR`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DAY`, `OCC_DOY`, `OCC_DOW`, `OCC_HOUR`, `DIVISION`, `LOCATION_TYPE`, `PREMISES_TYPE`, `UCR_CODE`, `UCR_EXT`, `OFFENCE`, `CSI_CATEGORY`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `LONG_WGS84`, `LAT_WGS84`, `x`, `y`

### V1 normalization decisions

| Source field | Target / rule |
|--------------|---------------|
| `OBJECTID` | `source_record_id` — unique within each file (per inventory) |
| `EVENT_UNIQUE_ID` | `event_unique_id` — **store but do not dedupe**; not unique in Major Crime files (e.g. Assault: 216,653 distinct / 254,378 non-blank rows) |
| `HOOD_158` | Primary neighbourhood code for filters and display |
| `NEIGHBOURHOOD_158` | Primary neighbourhood name for filters and display |
| `HOOD_140`, `NEIGHBOURHOOD_140` | Preserve in `source_fields_json` or legacy fields — not primary filters in V1 |
| `LAT_WGS84`, `LONG_WGS84` | Map coordinates; rows with `0,0` stay in table/search but are **excluded from map markers** |
| All 31 columns | Full original row preserved in `source_fields_json` |
| Provenance | `source_url`, `dataset_name`, `licence_url`, `dataset_update_date`, `ingestion_timestamp` on every row |

### Phase 2 checklist (V1 family)

- [x] Identify official TPS portal; download full corpus
- [x] List all 74 available datasets; structural inventory complete
- [x] Confirm Major Crime Open Data family shares 31-column schema
- [x] Confirm no personal-name columns in V1 target files (inventory scan)
- [ ] Confirm open-data licence URL per dataset
- [ ] Record official update cadence per dataset
- [ ] Archive V1 target files under `data/raw/tps/{dataset-slug}/{YYYY-MM-DD}/` with manifests

---

## Deferred but Classified TPS Datasets

These datasets are **preserved, inventoried, and classified** — not published in V1 public UI.

### Sensitive incidents (`sensitive_incident_records`)

- Homicides Open Data
- Shooting and Firearm Discharges Open Data
- Hate Crime Open Data
- Intimate Partner and Family Violence open data
- Mental Health Act Apprehensions Open Data

**Deferred because:** Higher sensitivity; additional legal and presentation review required before public release.

### Traffic / KSI (`traffic_ksi_records`)

- AUTOMOBILE_KSI, CYCLIST_KSI, FATALS_KSI, MOTORCYCLIST_KSI, PASSENGER_KSI, PEDESTRIAN_KSI, TOTAL_KSI
- Traffic Collisions Open Data (2 copies in bulk download)

**Deferred because:** Participant-level collision schema (54 columns for KSI; 23 for Traffic Collisions); distinct from incident open-data layer; large volume with many 0,0 coordinates in Traffic Collisions.

### Crisis calls (`calls_for_service_crisis_records`)

- Persons in Crisis Calls for Service Attended Open Data

**Deferred because:** Crisis/calls-for-service domain; uses `EVENT_ID` instead of `EVENT_UNIQUE_ID`; no WGS84 coordinates in source.

### Aggregates (`aggregate_metric_tables`)

- All ASR_* tables (Reported Crimes, Arrested and Charged Persons, Tickets Issued, Budget tables, etc.)
- FIRS contact records (2008–2013)
- RBDC arrest and use-of-force tables
- Neighbourhood Crime Rates Open Data (222-column matrix)
- Staffing by Command, Budget by Command

**Deferred because:** Summary/count tables without event-level geocoded incidents; not suitable for V1 map/table explorer.

### Reference geography (`reference_geography_datasets`)

- TPS Police Divisions
- Patrol Zone
- Police Facilities

**Deferred because:** Reference/geometry layers; support future map context, not V1 incident records.

### Same schema, deferred from V1

- Bicycle Thefts Open Data — 31-column schema; deferred pending layer assignment decision

---

## Acquisition Priority

### 1. Direct TPS downloads (preferred)

Always attempt to obtain data via:

- Official TPS open-data portal
- Official TPS website download links
- Documented open-data catalogue entries with published licence

Download the file as published. Store unmodified. Record the exact URL used.

### 2. Never use

- Private or restricted TPS systems
- Unofficial third-party mirrors without verified provenance
- Scraped HTML pages when a direct download exists
- FOIA/request-only datasets not published as open data
- CrimeInToronto article content as a data source
- Private, restricted, or unofficial city websites (future multi-city)

---

## Raw File Archive Convention

Every TPS download is stored unmodified with a manifest. **Never overwrite** a previous download — append a new dated folder.

```
data/raw/tps/{dataset-slug}/{YYYY-MM-DD}/
  original-file.csv          # exact file as downloaded (extension may vary: .csv, .xlsx, etc.)
  manifest.json              # metadata for this ingest (see below)
```

Bulk corpus (all 74 files) currently lives at:

```
data/raw/tps/_downloads/2026-06-30/
```

V1 target files should additionally be organized under per-dataset slugs without modifying originals.

### Example

```
data/raw/tps/assault-open-data/2026-06-30/
  original-file.csv
  manifest.json
```

### `dataset-slug` rules

- Lowercase, hyphen-separated
- Derived from official TPS dataset name
- Stable across re-downloads (do not include date in slug)

### File naming

- Preserve original filename inside the dated folder **or** rename to `original-file.{ext}` consistently
- Document original filename in `manifest.json`

---

## Metadata Requirements

Every ingest must produce a `manifest.json` alongside the raw file.

### Required fields

```json
{
  "source_url": "https://...",
  "dataset_name": "Official TPS dataset title",
  "licence_url": "https://...",
  "dataset_update_date": "YYYY-MM-DD",
  "ingestion_timestamp": "2026-06-30T12:00:00Z",
  "file_checksum_sha256": "...",
  "record_count": 0,
  "original_filename": "filename-as-downloaded.csv",
  "dataset_slug": "assault-open-data",
  "typed_layer": "public_incident_records",
  "publish_status": "published",
  "notes": "Optional: field mapping notes, anomalies, TPS changelog observations"
}
```

### Field definitions

| Field | Description |
|-------|-------------|
| `source_url` | Direct TPS download or dataset page URL used for this file |
| `dataset_name` | Official title as published by TPS |
| `licence_url` | Open-data licence URL (e.g. Open Government Licence) |
| `dataset_update_date` | Date TPS last updated the dataset, as stated on their portal |
| `ingestion_timestamp` | ISO 8601 UTC timestamp when CrimeCanada.io downloaded/archived the file |
| `file_checksum_sha256` | SHA-256 hash of the unmodified raw file |
| `record_count` | Row count after parsing (excluding header); 0 if not yet parsed at archive time |
| `original_filename` | Filename as received from TPS |
| `dataset_slug` | Archive folder slug |
| `typed_layer` | One of the seven typed source layers |
| `publish_status` | `published` or `deferred` |
| `notes` | Free text for agents: parsing quirks, column renames, missing fields |

### Database record metadata

When records are ingested into PostgreSQL (Phase 3b), **every row** must also carry:

- `source_url`
- `dataset_name`
- `licence_url`
- `dataset_update_date`
- `ingestion_timestamp`

These may be duplicated per row or normalized via a `datasets` table — implementation choice in Phase 3a/3b, but all five values must be retrievable for every displayed record.

---

## Fields Excluded in V1

Do not ingest, store, or display these even if present in a TPS file:

- Suspect names
- Victim names
- Mugshots or photos of individuals
- Any field identified as personal identifier during inventory audit
- Article-level micro incident data from CrimeInToronto

If TPS publishes fields that appear to contain personal identifiers, **exclude them at ingestion** and document the exclusion in `manifest.json` notes and `/data/sources`.

---

## Ingestion Rules (Phase 3b+)

- Read from latest dated raw archive (or specified archive version)
- Validate checksum before ingest
- Skip or quarantine malformed rows; log counts
- Idempotent: re-running on same file produces same DB state
- New TPS download → new dated folder → new ingest run → update `dataset_update_date` in UI
- Ingest only into the appropriate typed layer schema — do not merge layers
- Preserve full source row in `source_fields_json`

---

## CrimeInToronto Future Bridge

- **CrimeInToronto.com** is a separate product in a separate repository
- Do **not** connect to CrimeInToronto Prisma in V1
- We currently have **0 article records**
- Future CrimeInToronto article or micro-incident data may link into CrimeCanada through a separate `article_links` or `external_context_links` typed layer
- This becomes a **future premium/context layer** only after enough records exist
- **CrimeCanada.io** = official public-data product
- **CrimeInToronto.com** = Toronto article/news product
- Article/context ingestion must remain **separate from official public-data ingestion**

---

## Future Source Priorities (Out of V1 Scope)

The following are **post-V1 / not started**. Do not implement until Toronto V1 is launched and stable.

| Priority | Source | Status |
|----------|--------|--------|
| 1 | Calgary Police public dashboard/data | Post-V1 / not started |
| 2 | Peel Police crime statistics/maps | Post-V1 / not started |
| 3 | Edmonton Community Safety Data Portal | Post-V1 / not started |
| 4 | Vancouver VPD GeoDASH/open data | Post-V1 / not started |
| 5 | Winnipeg Police crime/calls-for-service maps | Post-V1 / not started |
| 6 | Statistics Canada crime/justice data | Later / not started |
| — | CrimeInToronto article / micro incident context layer | Post-V1 / 0 records today |
| — | User-contributed or crowdsourced data | Not planned — official sources only |

### Multi-city ingestion pattern (future)

When adding a new city:

1. Document in this file with official URL, licence, and field audit
2. Create jurisdiction record (e.g. `calgary-police`)
3. Use parallel archive convention: `data/raw/{agency-slug}/{dataset-slug}/{YYYY-MM-DD}/`
4. Classify each dataset into typed layers
5. Track ingestion via `ingestion_runs` with full provenance
6. Add city/region selector to UI only when at least one additional source is production-ready
7. Never mix sources without clear UI attribution per record
8. Do not scrape private, restricted, or unofficial city websites
9. Keep any media or article layer separate from official public-data ingestion

---

## Source Citation in UI

Every displayed record and the `/data/sources` page must show:

- Dataset name
- Source URL (link to TPS)
- Licence URL (link)
- Dataset update date
- CrimeCanada.io ingestion timestamp

The `/data/sources` page must also show published vs deferred datasets and acknowledge the full 74-file inventory.

See [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md) for full citation requirements.

---

## Related Documents

- [NORTH_STAR.md](./NORTH_STAR.md)
- [FINAL_PRODUCT_SPEC.md](./FINAL_PRODUCT_SPEC.md)
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
- [TPS_RAW_DATA_INVENTORY_2026-06-30.md](./TPS_RAW_DATA_INVENTORY_2026-06-30.md)
- [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md)
