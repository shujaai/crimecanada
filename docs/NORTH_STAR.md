# CrimeCanada.io — North Star

## Mission

CrimeCanada.io is the official public-data, search, dashboard, and (future) API product for Canadian crime statistics.

V1 is deliberately narrow: a **Toronto-only** explorer built entirely on **Toronto Police Service (TPS) open/public data**. The product must be simple, clean, shippable, and data-dashboard focused — not a news site, not a multi-city platform, and not a premium media product on day one.

Our job is to make official public crime data **searchable, filterable, mappable, and citable** — with full transparency about where every record came from.

---

## Unified Source Foundation + Layered Release

This is the **canonical data strategy** for CrimeCanada.io. All planning, implementation, and documentation should use this framing.

### Core meaning

CrimeCanada.io should **understand and preserve the full TPS public-data corpus from day one**, but **public features should be released in controlled layers**.

- All **74 TPS CSV files** have been copied and inventoried (2026-06-30). See [TPS_RAW_DATA_INVENTORY_2026-06-30.md](./TPS_RAW_DATA_INVENTORY_2026-06-30.md).
- All TPS datasets are **first-class source datasets**. Do not force every file into one incident schema.
- Preserve source files, source metadata, raw fields, provenance, licence details, and ingestion timestamps.
- Classify datasets into **typed source layers** (see below).
- Public UI releases happen **layer by layer**. V1 publishes only the cleanest shared event-level crime data first.

### Typed source layers

| Layer | Purpose |
|-------|---------|
| `public_incident_records` | Standard geocoded incident open data suitable for public search, table, and map |
| `sensitive_incident_records` | Incident data requiring additional legal or presentation review before public release |
| `traffic_ksi_records` | Traffic collisions and Killed or Seriously Injured (KSI) participant-level records |
| `calls_for_service_crisis_records` | Crisis and mental-health-related calls-for-service records |
| `aggregate_metric_tables` | Annual reports, budgets, FIRS, RBDC, and other count or summary tables |
| `reference_geography_datasets` | Division boundaries, patrol zones, facilities, and other reference geometry |
| `future_article_context_links` | Future CrimeInToronto article or micro-data links — separate from official public-data ingestion |

Do **not** ingest all 74 files into a single universal incident schema. Each layer may have its own schema boundaries while sharing common dataset metadata.

---

## Brand Separation (Strict)

Three related brands serve different purposes. They must remain separate in code, data, and positioning.

| Brand | Role | Repo / Scope |
|-------|------|--------------|
| **CrimeInToronto.com** | Toronto article and news product | Separate repository. Do not modify or depend on it from this repo. **0 article records today.** |
| **CrimeCanada.io** | Official public-data, search, dashboard, and (future) API product | **This repository.** V1 focus. |
| **CanadianCrimeWatch.com** | Future national media / public-facing umbrella brand | Not V1 scope. May complement data products later. |

### Rules

- CrimeCanada.io is a **standalone repository**. No imports, shared packages, or runtime dependencies on CrimeInToronto.
- **CrimeCanada.io** is the official public-data product. **CrimeInToronto.com** is the Toronto article/news product. Do not conflate them in UI copy, metadata, or marketing.
- Do **not** connect directly to CrimeInToronto Prisma in V1.
- CrimeInToronto articles are **not ingested in V1**. We currently have **0 article records**.
- Future article or micro-incident data from CrimeInToronto may link in via an `article_links` or `external_context_links` typed layer — post-V1, explicitly scoped, and never mixed into the free public-data layer without clear product boundaries.

---

## V1 Data Scope vs Full Foundation

V1 is TPS-only, but the **source foundation is the full corpus**.

### Full source foundation

- All **74 TPS CSV files** copied to `data/raw/tps/_downloads/2026-06-30`
- Structural inventory completed: [TPS_RAW_DATA_INVENTORY_2026-06-30.md](./TPS_RAW_DATA_INVENTORY_2026-06-30.md)
- Every file classified by typed source layer
- Original files preserved unmodified

### Public V1 release

V1 public UI launches with the **Major Crime Open Data 31-column family** — six offence-specific datasets that share a common schema:

- Assault Open Data
- Auto Theft Open Data
- Break and Enter Open Data
- Robbery Open Data
- Theft From Motor Vehicle Open Data
- Theft Over Open Data

These datasets share `OBJECTID`, `EVENT_UNIQUE_ID`, report/occurrence dates, `DIVISION`, `OFFENCE`, `CSI_CATEGORY`, 158/140 neighbourhood fields, WGS84 coordinates, and projected x/y.

### Deferred layers (classified, not ignored)

The following TPS datasets are **understood, preserved, and classified** for later typed layers. They are **not** published in V1 public UI:

- Homicides
- Shooting and Firearm Discharges
- Hate Crime
- Intimate Partner and Family Violence
- Mental Health Act Apprehensions
- Persons in Crisis Calls for Service
- KSI / Traffic Collisions
- Budget / ASR / FIRS / RBDC / aggregate files
- Reference and geometry files (e.g. Police Divisions, Patrol Zone, Police Facilities)
- Bicycle Thefts Open Data (same 31-column schema; deferred from V1 public release)

Deferred does not mean ignored. Each dataset has a typed layer assignment and will be released when legal guardrails, schema design, and product scope allow.

---

## Future CrimeInToronto Linking Strategy

- **CrimeInToronto.com** remains a separate product in a separate repository.
- Do **not** connect directly to CrimeInToronto Prisma in V1.
- We currently have **0 article records**.
- Future CrimeInToronto article or micro-incident data may link into CrimeCanada through a separate `article_links` or `external_context_links` typed layer.
- This should become a **future premium/context layer** only after enough records exist to justify the feature.
- **CrimeCanada.io** remains the official public-data product.
- **CrimeInToronto.com** remains the Toronto article/news product.
- The article/context layer must remain **separate from official public-data ingestion**.

---

## Future City Expansion Strategy

- Do **not** ingest or build other cities in V1.
- Design the foundation so future official city datasets can plug in later.
- Future ingestion should use: **jurisdictions**, **datasets**, **ingestion_runs**, **typed layers**, and **preserved source metadata**.
- Do **not** scrape private, restricted, or unofficial city websites.
- Any future media or article layer must remain separate from official public-data ingestion.

### Future source priorities (post-V1)

1. Calgary Police public dashboard/data
2. Peel Police crime statistics/maps
3. Edmonton Community Safety Data Portal
4. Vancouver VPD GeoDASH/open data
5. Winnipeg Police crime/calls-for-service maps
6. Statistics Canada crime/justice data (later)

---

## Future Data Design Pass

After factual inventory, schema boundaries, and legal guardrails are locked, a **later advanced reasoning/design pass** (explicitly not V1) may explore:

- Safe dataset relationships
- Efficient visual exploration
- Cross-dataset navigation
- Neighbourhood, division, time, and category relationships
- Cross-city expansion patterns
- Future CrimeInToronto article/micro-data links
- Future CanadianCrimeWatch national media layer

### Constraints for that pass

- Stay **source-backed** — no speculative claims
- Respect [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md)
- **No safety scoring**
- **No "safe/unsafe neighbourhood" claims**
- **Never override source provenance**
- Do not invent dataset relationships without inventory and legal review

---

## What V1 Is

V1 is a **Toronto public-data dashboard** with these core surfaces:

- Landing page
- Toronto data explorer (hub)
- Toronto map view
- Toronto table view
- Toronto search/filter view
- Dataset / source / licence page
- Pricing placeholder
- API waitlist / docs placeholder

V1 features:

- Search by offence type
- Search by date range
- Search by neighbourhood
- Search by police division (if available in the dataset)
- Map view and table view
- Source citation on every record
- Clean public-data UI
- **No authentication**
- **No billing**
- **No API keys**

Technical direction (documented, not all built in V1):

- Next.js, TypeScript, Tailwind
- Prisma + PostgreSQL (Phase 3+)
- PostGIS later
- Leaflet or MapLibre for maps
- Auth, Stripe, and AI search later

---

## What V1 Is Not

V1 explicitly excludes:

- **Multi-city rollout** — no other city pages or city selector in V1
- **CrimeInToronto article ingestion or links** — 0 articles today; no article links in V1 UI
- **Suspect names, victim names, mugshots** — prohibited in V1
- **Article-level micro incident data** — prohibited in V1
- **Safety scoring or neighbourhood labels** — no "safe neighbourhood" or "unsafe neighbourhood" claims
- **Removal or reputation monetization** — never charge to hide, remove, or "clean up" records
- **Authentication, billing, or API keys** — deferred to post-V1
- **Private personal profiles** — not in scope, ever
- **Cross-dataset relationship UI** — deferred to future design pass
- **Publishing deferred TPS layers** — homicides, shootings, crisis calls, aggregates, etc. remain classified but unpublished in V1

---

## Non-Negotiable Principles

These principles apply to every phase of development and every future feature. They are not optional.

### 1. Official public data only

- Use official TPS public/open data only in V1.
- Prefer **direct downloads** from the TPS website or open-data portal first.
- Do not scrape private, restricted, or unofficial sources.

### 2. Full source provenance on every record

Every ingested and displayed record must preserve:

- Source URL
- Dataset name
- Licence URL
- Dataset update date (as published by TPS)
- Ingestion timestamp

### 3. Neutral presentation

- Present counts, filters, and facts — not judgments.
- No safety scores, rankings, or predictive claims.
- Users draw their own conclusions from official data.

### 4. No personal identifiers in V1

- Do not ingest or display suspect names, victim names, mugshots, or article-level micro data.
- Do not build private personal profile features.

### 5. Ethical monetization only

Paid features may include:

- Exports
- Saved searches
- Alerts
- AI search (source-backed)
- API access
- Dashboards

Paid features must **never** include:

- Record removals
- Hiding records
- Reputation cleanup
- Private personal profiles

### 6. Future AI must cite sources

When AI search or AI answers are added post-V1:

- Every answer must cite underlying records.
- No hallucinated statistics.
- Refuse when source data is insufficient.
- Same prohibited-content rules apply to AI outputs.

### 7. Ship small, ship clean

- One city (Toronto). One primary data source (TPS). One clear product (data dashboard).
- Full corpus preserved; V1 publishes one typed layer only.
- Prefer a shippable V1 over a feature-complete V1 that never launches.

---

## Related Documents

- [FINAL_PRODUCT_SPEC.md](./FINAL_PRODUCT_SPEC.md) — V1 user experience and visual direction
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) — phased build plan
- [DATA_SOURCE_PLAN.md](./DATA_SOURCE_PLAN.md) — TPS data acquisition, typed layers, and archive conventions
- [TPS_RAW_DATA_INVENTORY_2026-06-30.md](./TPS_RAW_DATA_INVENTORY_2026-06-30.md) — structural inventory of all 74 TPS CSV files
- [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md) — legal, privacy, and citation requirements
- [../Logs/STEP_LOG.md](../Logs/STEP_LOG.md) — chronological agent checklist
