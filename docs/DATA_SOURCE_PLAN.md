# CrimeCanada.io — Data Source Plan

Data acquisition strategy for V1 and beyond. V1 is **TPS-only**.

See also: [NORTH_STAR.md](./NORTH_STAR.md), [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md), [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md).

---

## V1 Scope: Toronto Police Service Only

CrimeCanada.io V1 ingests data from **one source only:**

**Toronto Police Service (TPS) public/open data**

- No other cities in V1
- No provincial or national aggregated datasets in V1
- No CrimeInToronto articles or micro incident data in V1
- No unofficial, scraped, or restricted sources

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

---

## Starting Dataset: Major Crime Indicators (MCI)

**Primary candidate:** TPS **Major Crime Indicators** dataset — or the cleanest, most complete TPS public dataset available after Phase 2 audit.

### Selection criteria

Choose the dataset that best balances:

| Criterion | Priority |
|-----------|----------|
| Official open-data publication with licence | Required |
| Offence type field | Required |
| Date field (incident or report date) | Required |
| Neighbourhood or location descriptor | Required |
| Police division field | Preferred (use if available) |
| Lat/lng or mappable coordinates | Preferred (geocode in Phase 5 if absent) |
| Regular update cadence | Preferred |
| No personal identifiers in published fields | Required |

If MCI does not meet all required criteria, document the alternative TPS dataset selected and why.

### Phase 2 audit checklist

- [ ] Identify official TPS portal URL
- [ ] List available crime-related open datasets
- [ ] Compare fields against selection criteria
- [ ] Confirm open-data licence URL
- [ ] Confirm no name/mugshot fields in V1 scope
- [ ] Record official update cadence
- [ ] Download first raw archive

---

## Raw File Archive Convention

Every TPS download is stored unmodified with a manifest. **Never overwrite** a previous download — append a new dated folder.

```
data/raw/tps/{dataset-slug}/{YYYY-MM-DD}/
  original-file.csv          # exact file as downloaded (extension may vary: .csv, .xlsx, etc.)
  manifest.json              # metadata for this ingest (see below)
```

### Example

```
data/raw/tps/major-crime-indicators/2026-06-30/
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
  "dataset_slug": "major-crime-indicators",
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
| `notes` | Free text for agents: parsing quirks, column renames, missing fields |

### Database record metadata

When records are ingested into PostgreSQL (Phase 3), **every row** must also carry:

- `source_url`
- `dataset_name`
- `licence_url`
- `dataset_update_date`
- `ingestion_timestamp`

These may be duplicated per row or normalized via a `datasets` table — implementation choice in Phase 3, but all five values must be retrievable for every displayed record.

---

## Fields Excluded in V1

Do not ingest, store, or display these even if present in a TPS file:

- Suspect names
- Victim names
- Mugshots or photos of individuals
- Any field identified as personal identifier during Phase 2 audit
- Article-level micro incident data from CrimeInToronto

If TPS publishes fields that appear to contain personal identifiers, **exclude them at ingestion** and document the exclusion in `manifest.json` notes and `/data/sources`.

---

## Ingestion Rules (Phase 3+)

- Read from latest dated raw archive (or specified archive version)
- Validate checksum before ingest
- Skip or quarantine malformed rows; log counts
- Idempotent: re-running on same file produces same DB state
- New TPS download → new dated folder → new ingest run → update `dataset_update_date` in UI

---

## Future Source Priorities (Out of V1 Scope)

The following are **post-V1 / not started**. Do not implement until Toronto V1 is launched and stable.

| Priority | Source | Status |
|----------|--------|--------|
| P2 | Other Ontario municipal police open-data portals (e.g. Peel, York, Ottawa) | Post-V1 / not started |
| P3 | Provincial aggregated crime statistics (StatsCan, provincial portals) | Post-V1 / not started |
| P4 | National Canadian crime data aggregations | Post-V1 / not started |
| P5 | CrimeInToronto article / micro incident premium layer | Post-V1 / not started |
| P6 | User-contributed or crowdsourced data | Not planned — official sources only |

When adding a new source post-V1:

1. Document in this file with official URL, licence, and field audit
2. Use parallel archive convention: `data/raw/{agency-slug}/{dataset-slug}/{YYYY-MM-DD}/`
3. Add city/region selector to UI only when at least one additional source is production-ready
4. Never mix sources without clear UI attribution per record

---

## Source Citation in UI

Every displayed record and the `/data/sources` page must show:

- Dataset name
- Source URL (link to TPS)
- Licence URL (link)
- Dataset update date
- CrimeCanada.io ingestion timestamp

See [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md) for full citation requirements.

---

## Related Documents

- [NORTH_STAR.md](./NORTH_STAR.md)
- [FINAL_PRODUCT_SPEC.md](./FINAL_PRODUCT_SPEC.md)
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
- [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md)
