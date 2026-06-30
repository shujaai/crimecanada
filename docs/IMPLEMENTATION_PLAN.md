# CrimeCanada.io — Implementation Plan

Phased build plan for V1. Agents mark items `[x]` when complete, `[ ]` when pending.

**Tech stack (target):** Next.js, TypeScript, Tailwind, Prisma, PostgreSQL, Leaflet or MapLibre. Auth, Stripe, and AI search are **post-V1**.

See also: [NORTH_STAR.md](./NORTH_STAR.md), [DATA_SOURCE_PLAN.md](./DATA_SOURCE_PLAN.md), [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md).

---

## Phase 0: Repo & Docs Setup

Foundation work before feature development.

- [x] New repo created at `X:\crimecanada`
- [x] Next.js app initialized (Next.js 16, TypeScript, Tailwind)
- [x] Production build passed
- [x] Create planning docs (`NORTH_STAR`, `FINAL_PRODUCT_SPEC`, `IMPLEMENTATION_PLAN`, `DATA_SOURCE_PLAN`, `LEGAL_GUARDRAILS`)
- [x] `docs/` and `Logs/` folders created
- [ ] Confirm folder structure conventions (app routes, `data/raw/`, components)

**Exit criteria:** All planning docs in place; repo builds cleanly; no application features started.

---

## Phase 1: Static Shell & Design System

Build the visual foundation and placeholder routes. **No real data yet.**

- [ ] Dark dashboard layout shell (header, nav, footer)
- [ ] Design tokens: dark background, glass panels, cyan/red/amber accents
- [ ] Shared components: glass panel, filter bar, source citation block, empty state
- [ ] Placeholder routes for all V1 pages:
  - [ ] `/` — landing
  - [ ] `/toronto` — explorer hub
  - [ ] `/toronto/map` — map placeholder
  - [ ] `/toronto/table` — table placeholder
  - [ ] `/toronto/search` — search/filter placeholder
  - [ ] `/data/sources` — dataset page skeleton
  - [ ] `/pricing` — pricing placeholder
  - [ ] `/api` — API waitlist/docs placeholder
- [ ] Responsive layout for desktop-first dashboard (mobile acceptable, not primary)
- [ ] Footer with disclaimer and licence attribution copy

### Phase 1 constraints (non-negotiable)

> **Do not build auth, billing, or API keys in Phase 1.**

- No NextAuth, Clerk, or custom login
- No Stripe integration
- No API key generation or management
- No user database

**Exit criteria:** All V1 routes render with consistent dark dashboard styling; navigation works; no backend required.

---

## Phase 2: TPS Raw File Intake

Acquire and archive official TPS public data. **No database yet.**

- [ ] Audit TPS open-data portal for available datasets
- [ ] Select primary dataset: **Major Crime Indicators (MCI)** or cleanest complete TPS public dataset
- [ ] Document dataset fields, update cadence, and licence in [DATA_SOURCE_PLAN.md](./DATA_SOURCE_PLAN.md)
- [ ] Direct download from official TPS website (no scraping unofficial sources)
- [ ] Store raw file per archive convention: `data/raw/tps/{dataset-slug}/{YYYY-MM-DD}/`
- [ ] Generate `manifest.json` with required metadata (see DATA_SOURCE_PLAN)
- [ ] Verify no suspect names, victim names, or mugshots in selected dataset fields for V1 use
- [ ] Document field mapping notes for Phase 3 schema design

**Exit criteria:** At least one TPS dataset downloaded, archived with manifest, and documented.

---

## Phase 3: Database Schema & Ingestion

Wire up persistence and load TPS data.

- [ ] Add PostgreSQL (local dev + deployment target)
- [ ] Add Prisma; define schema
- [ ] Schema includes required metadata on every record:
  - [ ] `source_url`
  - [ ] `dataset_name`
  - [ ] `licence_url`
  - [ ] `dataset_update_date`
  - [ ] `ingestion_timestamp`
- [ ] Schema includes searchable fields: offence type, date, neighbourhood, division (if available), location fields
- [ ] Build ingestion script: read raw archive → validate → upsert records
- [ ] Idempotent ingestion (re-run safe on same or updated file)
- [ ] Ingestion logs: record count, errors, checksum
- [ ] PostGIS / geospatial indexing — **deferred post-V1** (use lat/lng columns if present; geocode later if needed)

**Exit criteria:** TPS data queryable in PostgreSQL via Prisma; metadata preserved on every row.

---

## Phase 4: Toronto Explorer / Table / Search

Connect UI to real data.

- [ ] Shared filter state (URL-synced): offence type, date range, neighbourhood, police division
- [ ] `/toronto/search` — filter UI wired to query params
- [ ] `/toronto/table` — paginated table from DB with sort
- [ ] Source citation on every table row and page footer
- [ ] `/toronto` hub — active filter summary and result count
- [ ] Empty states, loading states, error states
- [ ] Server-side pagination and filtering (no client-side full dataset load)

**Exit criteria:** Users can filter and browse TPS records in table view with full source attribution.

---

## Phase 5: Map View

Add geospatial exploration.

- [ ] Choose map library: Leaflet or MapLibre
- [ ] `/toronto/map` — render incident markers from filtered query
- [ ] Marker clustering for dense areas
- [ ] Click marker → detail panel with source citation
- [ ] Filter sync: map respects same filters as table/search
- [ ] Geocoding strategy documented and implemented if lat/lng not in raw TPS data
- [ ] Map empty state when no geocodable records match filters

**Exit criteria:** Map view functional with filter sync; no safety heatmaps or danger-zone colouring.

---

## Phase 6: Launch Hardening

Prepare for public traffic.

- [ ] Performance: query indexes, pagination limits, map tile loading
- [ ] SEO/meta tags for public pages
- [ ] `/data/sources` populated with live dataset info, licence, update dates
- [ ] Legal copy aligned with [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md) on explorer pages
- [ ] `/pricing` and `/api` placeholder pages reviewed
- [ ] Error boundaries and 404 page styled consistently
- [ ] Accessibility pass: keyboard nav, contrast, table headers
- [ ] Cross-browser smoke test (Chrome, Firefox, Safari)
- [ ] Environment config documented (no secrets in repo)

**Exit criteria:** Site ready for production deployment with documented known limitations.

---

## Phase 7: V1 Launch

Ship it.

- [ ] Deploy to production hosting
- [ ] Production PostgreSQL provisioned and ingestion run
- [ ] Smoke test all V1 pages in production
- [ ] Verify source citations render correctly in production
- [ ] Document known V1 limitations in README or `/data/sources`
- [ ] Update [STEP_LOG.md](../Logs/STEP_LOG.md) with launch date

**Exit criteria:** CrimeCanada.io V1 live with Toronto TPS public data explorer accessible to the public.

---

## Explicitly Deferred (Post-V1)

Do not start these until V1 is launched and stable:

| Feature | Notes |
|---------|-------|
| Authentication | NextAuth or equivalent — for saved searches, API keys |
| Billing / Stripe | Paid exports, alerts, AI, API tiers |
| API keys & REST/GraphQL API | Waitlist only in V1 |
| AI search | Must cite sources; see LEGAL_GUARDRAILS |
| PostGIS | Geospatial indexing upgrade |
| Multi-city sources | One city at a time after Toronto is stable |
| CrimeInToronto article layer | Premium tier; separate ingestion pipeline |
| Data exports (paid) | Placeholder in V1 pricing page only |

---

## Folder Structure (Target)

```
crimecanada/
├── docs/                    # Planning and spec docs
├── Logs/                    # Agent step log
├── data/
│   └── raw/
│       └── tps/
│           └── {dataset-slug}/
│               └── {YYYY-MM-DD}/
│                   ├── original-file.csv
│                   └── manifest.json
├── prisma/                  # Phase 3+
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # UI components
│   └── lib/                 # DB, ingestion, utils
└── scripts/                 # Ingestion scripts (Phase 3+)
```

---

## Related Documents

- [NORTH_STAR.md](./NORTH_STAR.md)
- [FINAL_PRODUCT_SPEC.md](./FINAL_PRODUCT_SPEC.md)
- [DATA_SOURCE_PLAN.md](./DATA_SOURCE_PLAN.md)
- [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md)
- [../Logs/STEP_LOG.md](../Logs/STEP_LOG.md)
