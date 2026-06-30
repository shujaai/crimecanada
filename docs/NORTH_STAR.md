# CrimeCanada.io — North Star

## Mission

CrimeCanada.io is the official public-data, search, dashboard, and (future) API product for Canadian crime statistics.

V1 is deliberately narrow: a **Toronto-only** explorer built entirely on **Toronto Police Service (TPS) open/public data**. The product must be simple, clean, shippable, and data-dashboard focused — not a news site, not a multi-city platform, and not a premium media product on day one.

Our job is to make official public crime data **searchable, filterable, mappable, and citable** — with full transparency about where every record came from.

---

## Brand Separation (Strict)

Three related brands serve different purposes. They must remain separate in code, data, and positioning.

| Brand | Role | Repo / Scope |
|-------|------|--------------|
| **CrimeInToronto.com** | Toronto article and news product | Separate repository. Do not modify or depend on it from this repo. |
| **CrimeCanada.io** | Public-data, search, dashboard, and (future) API product | **This repository.** V1 focus. |
| **CanadianCrimeWatch.com** | Potential future national public media brand | Not V1 scope. May complement data products later. |

### Rules

- CrimeCanada.io is a **standalone repository**. No imports, shared packages, or runtime dependencies on CrimeInToronto.
- CrimeInToronto articles are **not ingested in V1**. We currently have **0 article records**.
- Future article or micro-incident data from CrimeInToronto may become a **premium layer** — post-V1, explicitly scoped, and never mixed into the free public-data layer without clear product boundaries.
- Do not conflate CrimeCanada.io (data product) with CrimeInToronto (media product) in UI copy, metadata, or marketing.

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

- **Multi-city rollout** — do not build all cities at once
- **CrimeInToronto article ingestion** — 0 articles today; not in V1
- **Suspect names, victim names, mugshots** — prohibited in V1
- **Article-level micro incident data** — prohibited in V1
- **Safety scoring or neighbourhood labels** — no "safe neighbourhood" or "unsafe neighbourhood" claims
- **Removal or reputation monetization** — never charge to hide, remove, or "clean up" records
- **Authentication, billing, or API keys** — deferred to post-V1
- **Private personal profiles** — not in scope, ever

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
- Prefer a shippable V1 over a feature-complete V1 that never launches.

---

## Related Documents

- [FINAL_PRODUCT_SPEC.md](./FINAL_PRODUCT_SPEC.md) — V1 user experience and visual direction
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) — phased build plan
- [DATA_SOURCE_PLAN.md](./DATA_SOURCE_PLAN.md) — TPS data acquisition and archive conventions
- [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md) — legal, privacy, and citation requirements
- [../Logs/STEP_LOG.md](../Logs/STEP_LOG.md) — chronological agent checklist
