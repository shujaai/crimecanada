# CrimeCanada.io — Legal Guardrails

Legal, ethical, privacy, and citation requirements for CrimeCanada.io. These rules apply to **all current and future features** unless explicitly revised in a new approved spec.

See also: [NORTH_STAR.md](./NORTH_STAR.md), [DATA_SOURCE_PLAN.md](./DATA_SOURCE_PLAN.md).

---

## 1. Data Sourcing

### Official public data only

- V1 uses **Toronto Police Service (TPS) public/open data** exclusively.
- Prefer **direct downloads** from the official TPS open-data portal or website.
- Document every source URL, dataset name, and licence URL.

### Prohibited sourcing

- Do not scrape private, restricted, login-gated, or unofficial sources.
- Do not use third-party crime aggregators as primary sources without verified official provenance.
- Do not ingest CrimeInToronto articles as structured crime records in V1.
- Do not use FOIA-only or non-public datasets not published under an open-data licence.

### Data integrity

- Store unmodified raw files in the archive (see [DATA_SOURCE_PLAN.md](./DATA_SOURCE_PLAN.md)).
- Do not alter TPS field values during ingestion except for normalization (date parsing, trimming whitespace) — document all transforms.

---

## 2. Prohibited Content in V1

The following must **never** be ingested, stored, indexed, or displayed in V1:

| Content | Rule |
|---------|------|
| Suspect names | Exclude at ingestion; no search by name |
| Victim names | Exclude at ingestion; no search by name |
| Mugshots | Never display or store |
| Photos of identifiable individuals | Never display or store |
| Private personal profiles | No feature; no data model |
| CrimeInToronto article micro data | Not in V1; separate premium pipeline if ever added |

If a TPS dataset field contains unexpected personal identifiers, **exclude the field** and document the exclusion. Do not expose it "temporarily" pending review.

---

## 3. Prohibited Claims & Scoring

CrimeCanada.io is a **data transparency tool**, not a safety recommendation engine.

### Never publish

- "Safe neighbourhood" or "unsafe neighbourhood" labels
- Safety scores, letter grades, or star ratings for areas
- Rankings like "Toronto's most dangerous neighbourhoods"
- Predictive crime forecasts presented as fact
- Editorial framing: "crime wave", "surge", "epidemic" unless quoting an official TPS statement with attribution

### Allowed

- Factual counts: "142 reported assault incidents in [neighbourhood] between [date] and [date], per TPS open data"
- Filters and aggregations tied to cited records
- Neutral maps showing incident locations without danger-zone heatmap colouring

Users draw their own conclusions. We provide data and citations.

---

## 4. Source Citation Requirements

### Every displayed record

When showing a crime record (table row, map popup, detail panel), include or link to:

- **Dataset name** — official TPS title
- **Source URL** — TPS dataset or download page
- **Licence URL** — open-data licence
- **Dataset update date** — as published by TPS
- **Ingestion timestamp** — when CrimeCanada.io loaded the data

### Dataset page (`/data/sources`)

Must mirror the full attribution chain:

- All datasets used in production
- Direct download links
- Licence text or link
- Update cadence
- Field glossary
- Excluded fields list

### No unsourced statistics

Do not display aggregate counts, charts, or summaries unless they are computable from ingested TPS records and the UI provides a path to verify (filter → table).

---

## 5. Future AI Answer Requirements

When AI search or conversational features are added (post-V1, paid tier):

### Required behaviour

- **Every AI answer must cite underlying records** — dataset name, date range, filter used, record count.
- Provide links or references to the explorer view that reproduces the AI's result.
- Refuse to answer when source data is insufficient — do not guess or hallucinate statistics.
- Apply the same prohibited content rules: no names, no mugshots, no safety scores in AI output.

### Prohibited AI behaviour

- Generating statistics not traceable to ingested records
- Recommending neighbourhoods as "safe" or "unsafe"
- Implying guilt for individuals
- Synthesizing information from CrimeInToronto articles without clear separation from official TPS data layer

---

## 6. Monetization Guardrails

### Allowed paid features (future)

- Data exports (CSV, JSON)
- Saved searches
- Email or push alerts on filter matches
- AI search (source-backed, per Section 5)
- API access with keys
- Custom dashboards

### Forbidden monetization (permanent)

CrimeCanada.io must **never** charge for:

- **Record removal** — deleting or suppressing official public records
- **Hiding records** — paywalling visibility of specific incidents from the public layer
- **Reputation cleanup** — services to "clean up" a person's or business's crime-adjacent appearance
- **Private personal profiles** — searchable profiles about individuals

If a feature could be interpreted as "pay to make data go away," it is rejected.

---

## 7. Privacy Guardrails

### V1 privacy posture

- **No authentication in V1** — no user accounts, no personal data collection from users beyond basic analytics (if any — document in privacy policy at launch).
- **No PII in database** — ingestion pipeline excludes personal identifiers.
- **PIPEDA / GDPR awareness** — when auth and user data are added post-V1, publish a privacy policy covering collection, retention, and deletion.

### Analytics

- If using analytics (e.g. Plausible, Vercel Analytics), prefer privacy-respecting, cookieless options.
- Do not sell user data.

---

## 8. Language Guardrails

### Required tone

- Neutral, factual, attributable to TPS
- "Reported incident" not "confirmed crime" (unless TPS field explicitly indicates disposition and we cite it)
- Disclaimers visible on explorer pages

### Required disclaimers

Display on data explorer pages and footer:

1. Data sourced from official TPS public/open datasets.
2. CrimeCanada.io does not independently verify incidents.
3. Data is not real-time and not suitable for emergency use. Call 911 for emergencies.
4. CrimeCanada.io does not provide safety ratings or recommendations.

### Prohibited language

- Implying guilt: "criminal", "offender", "perpetrator" applied to unnamed individuals in UI copy
- Sensationalism: "bloodbath", "terror", "war zone"
- Safety advice: "avoid this area", "you are safe here"

---

## 9. Brand & Separation

- CrimeCanada.io must not imply it is CrimeInToronto or CanadianCrimeWatch.
- Do not use CrimeInToronto article content in the public free data layer.
- Cross-linking between brands is acceptable; data mixing is not (without explicit premium tier boundaries).

---

## 10. Compliance Checklist (Pre-Launch)

Before V1 launch (Phase 6–7), verify:

- [ ] All records have source URL, dataset name, licence URL, update date, ingestion timestamp
- [ ] No name or mugshot fields in DB or UI
- [ ] No safety scoring features
- [ ] `/data/sources` page complete with licence links
- [ ] Disclaimers on explorer pages
- [ ] Pricing page states no removal/reputation services
- [ ] Raw file archive exists with manifests
- [ ] LEGAL_GUARDRAILS reviewed against implemented features

---

## Related Documents

- [NORTH_STAR.md](./NORTH_STAR.md)
- [FINAL_PRODUCT_SPEC.md](./FINAL_PRODUCT_SPEC.md)
- [DATA_SOURCE_PLAN.md](./DATA_SOURCE_PLAN.md)
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
