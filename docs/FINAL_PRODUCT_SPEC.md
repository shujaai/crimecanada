# CrimeCanada.io — Final Product Spec (V1)

This document describes the **V1 user experience** for CrimeCanada.io: a dark, command-center-style data dashboard for Toronto Police Service public crime data.

V1 is read-only, unauthenticated, and focused on exploration — not news, not safety scoring, not multi-city coverage.

See also: [NORTH_STAR.md](./NORTH_STAR.md), [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md).

---

## V1 Product Summary

**Product:** CrimeCanada.io — Toronto Public Crime Data Explorer

**Audience:** Researchers, journalists, residents, and developers who want to search, filter, and explore official TPS public crime data with full source attribution.

**Core value:** Make official Toronto crime data easy to search, map, and cite — without editorial spin or safety claims.

**V1 constraints:**

- Toronto only
- TPS public/open data only
- No login, no billing, no API keys
- Source citation on every record

---

## Page-by-Page Spec

### `/` — Landing Page

**Purpose:** Introduce CrimeCanada.io and drive users to the Toronto explorer.

**Key elements:**

- Hero with product name and one-line value proposition
- Brief explanation: official TPS public data, not news or safety scores
- Primary CTA: "Explore Toronto Data" → `/toronto`
- Secondary links: Data Sources (`/data/sources`), Pricing (`/pricing`), API (`/api`)
- Trust signals: "Official public data", "Source cited on every record", "Toronto Police Service open data"
- Footer with licence attribution and disclaimer

**Not on landing page:** Article feeds, neighbourhood safety rankings, login/signup, pricing checkout.

---

### `/toronto` — Toronto Explorer Hub

**Purpose:** Central navigation for all Toronto data views with shared filter context.

**Key elements:**

- View switcher: Map | Table | Search
- Active filter summary bar (offence, date range, neighbourhood, division)
- Quick stats panel (filtered record count, date range of results)
- Link to data sources page for transparency

**Behaviour:**

- Filters set here apply across map, table, and search views
- URL reflects active filters (shareable links)

---

### `/toronto/map` — Map View

**Purpose:** Geospatial exploration of filtered TPS records.

**Key elements:**

- Full-width map (Leaflet or MapLibre)
- Incident markers or clusters based on filtered dataset
- Filter panel (synced with hub): offence type, date range, neighbourhood, police division
- Record count and date range indicator
- Click marker → incident detail panel with source citation
- "View in table" link for same filter set

**Behaviour:**

- Map respects all active filters
- Empty state when no records match filters
- No heatmap "danger zones" or safety colouring — neutral incident markers only

---

### `/toronto/table` — Table View

**Purpose:** Sortable, paginated tabular view of filtered records.

**Key elements:**

- Data table with columns appropriate to TPS dataset (e.g. offence type, date, neighbourhood, division, location descriptor)
- Sortable columns where meaningful
- Pagination (server-side when DB is wired)
- Source citation row/footer: dataset name, source URL, licence link, update date
- Export placeholder (disabled in V1 — "Coming soon" for paid tier)

**Behaviour:**

- Same filter set as map view
- Every row traceable to source metadata
- No personal names or mugshots in any column

---

### `/toronto/search` — Search / Filter View

**Purpose:** Structured query builder for power users.

**Key elements:**

- Filter controls:
  - **Offence type** — multi-select or dropdown from dataset values
  - **Date range** — start/end date pickers
  - **Neighbourhood** — select from dataset values
  - **Police division** — select if available in dataset
- "Apply filters" action → updates shared filter state, navigates to table or map
- Result count preview before navigation
- Clear all filters button

**Behaviour:**

- Filters are the primary interaction — no free-text search across personal names
- Invalid date ranges show inline validation

---

### `/data/sources` — Dataset / Source / Licence Page

**Purpose:** Full transparency about data origins.

**Key elements:**

- Dataset name(s) used in V1 (e.g. TPS Major Crime Indicators)
- Official source URL(s) with direct download links
- Open-data licence URL and summary
- Update cadence as published by TPS
- Last ingestion date and record count
- Field glossary (what each column means, per TPS documentation)
- Explicit list of excluded fields (names, mugshots, etc.)
- Link to [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md) principles in user-friendly language

---

### `/pricing` — Pricing Placeholder

**Purpose:** Signal future paid features without implementing billing.

**Key elements:**

- Static page: "Free tier" = current V1 explorer
- "Coming soon" paid features list:
  - Data exports
  - Saved searches
  - Alerts
  - AI search (source-backed)
  - API access
  - Custom dashboards
- Explicit note: we do not offer record removal, hiding, or reputation services
- No Stripe, no checkout, no account creation

---

### `/api` — API Waitlist / Docs Placeholder

**Purpose:** Capture interest for future API access; stub documentation structure.

**Key elements:**

- Headline: "API access coming soon"
- Waitlist CTA (email capture form or mailto — no backend required in V1 beyond static form)
- Docs skeleton: endpoints placeholder, authentication note ("API keys in a future release")
- Link to `/data/sources` for current data access (manual download via TPS until API ships)

---

## Core V1 Features (User-Facing)

| Feature | Description |
|---------|-------------|
| Search by offence type | Filter records by TPS offence category |
| Search by date range | Filter by incident/report date within dataset bounds |
| Search by neighbourhood | Filter by neighbourhood field in TPS data |
| Search by police division | Filter by division if present in dataset |
| Map view | Geospatial display of filtered records |
| Table view | Paginated, sortable tabular display |
| Source citation | Every record and page shows dataset name, source URL, licence, update date |
| Public access | No login required for any V1 page |

---

## User-Facing Language Guidelines

### Tone

- **Factual and neutral.** Use "reported incidents" not "crime wave" or "surge."
- **Attributive.** Always name TPS as the data source.
- **Humble about limitations.** Data reflects official reports; it is not real-time and not exhaustive.

### Required phrasing patterns

- "According to Toronto Police Service open data…"
- "Reported [offence type] incidents in [neighbourhood], [date range]"
- "Data last updated by TPS on [date]; ingested by CrimeCanada.io on [date]"

### Prohibited phrasing

- "Safe neighbourhood" / "unsafe neighbourhood"
- "Crime-ridden" / "dangerous area"
- "You should avoid…"
- Any implication of guilt for individuals
- Any statistic not traceable to a cited TPS record

### Disclaimers (show on explorer pages and footer)

- Data is sourced from official TPS public/open datasets.
- CrimeCanada.io does not verify individual incidents beyond what TPS publishes.
- Data may lag official reports. Not suitable for emergency use.
- CrimeCanada.io does not provide safety ratings or recommendations.

### Personal data

- No personal identifiers in UI copy, filters, or search.
- No "search by name" feature in V1.

---

## Visual Direction

### Aesthetic

**Dark command-center / data-dashboard** — not a blog, not a news site, not a consumer safety app.

Think: operational dashboard, research tool, public transparency portal.

### Layout

- Grid-based page structure
- Glass / frosted panels with subtle borders on dark background
- High information density; data-first
- Minimal decorative imagery — no stock photos, no editorial hero images

### Colour palette

| Role | Colour | Usage |
|------|--------|-------|
| Background | Near-black / dark slate | Page canvas |
| Panel | Dark glass with low-opacity white border | Cards, filter panels, table containers |
| Primary accent | Cyan | Links, active filters, primary actions, data highlights |
| Incident accent | Red | Incident markers, offence-type badges (use sparingly) |
| Metadata accent | Amber | Warnings, date ranges, licence/update metadata |
| Text | White / light grey hierarchy | Headings, body, muted labels |

### Typography

- **UI chrome:** Clean sans-serif (system or project default)
- **Data values:** Monospace or tabular-nums for counts, dates, IDs
- **Headings:** Short, functional — "Toronto Map", "Filter Records", not editorial headlines

### Components (design system targets for Phase 1)

- Glass panel card
- Filter bar with cyan active state
- Data table with zebra or border-row styling on dark background
- Map container with overlay filter drawer
- Source citation footer block (amber metadata accent)
- Empty state and error state panels

### What to avoid

- Blog-style article layouts
- Bright white backgrounds
- Safety score gauges or red/green neighbourhood maps
- News ticker or "latest crimes" feed aesthetic
- Mugshots or person imagery

---

## Out of Scope for V1 UX

- User accounts and login
- Billing and Stripe checkout
- API key management
- Saved searches (UI placeholder only on pricing page)
- AI chat or AI search
- Multi-city selector
- CrimeInToronto article embeds or links as data sources
- Export download (show "coming soon" only)

---

## Related Documents

- [NORTH_STAR.md](./NORTH_STAR.md)
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
- [DATA_SOURCE_PLAN.md](./DATA_SOURCE_PLAN.md)
- [LEGAL_GUARDRAILS.md](./LEGAL_GUARDRAILS.md)
