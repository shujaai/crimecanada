# CrimeCanada.io — Unified Product Vision: The Living Record

Status: Vision / design intent. Concept only — not a description of live features.
Companion to: NORTH_STAR.md, FINAL_PRODUCT_SPEC.md,
PRODUCT_UI_ARCHITECTURE_2026-06-30.md.

> Guardrails inherited unchanged from NORTH_STAR.md and LEGAL_GUARDRAILS.md:
> source on every record, no safety scores, no name search, no fear framing,
> public data only, brands kept as separate layers (no CrimeInToronto coupling).
> This document adds product direction. It changes none of those rules.

---

## 1. The Soul

**CrimeCanada.io is the Living Record of Canada.**

Not a dashboard — a public record that breathes. Anyone can ask it a plain
question, watch the answer appear as a living map and rhythm, and trace every
fact back to its official source. The interaction metaphor is a **telescope**:
it observes patterns (time, place, rhythm, season); it never judges people or
ranks places as safe/unsafe.

One sentence north star:

> **CrimeCanada.io is the place where anyone can ask Canada's public safety
> record a plain question, instantly see the answer as a living map and rhythm,
> and trace every single fact back to its official source — without fear, spin,
> or judgment.**

Homepage line:

> **"Ask the public record. See it move. Trust where it came from."**

---

## 2. One System, Not Ten Screens

The 10 signature UI ideas are **not separate pages**. They are **views inside a
single organism** that share one spine:

```
ASK  →  SEE  →  UNDERSTAND  →  CONNECT  →  TRACE SOURCE
```

### The spine (already exists today)

- **One filter state** (`ExplorerFilters`, URL-encoded — `src/lib/filters.ts`)
  is the single source of truth behind every view.
- **One source receipt** (`SourceReceipt`) ends every answer.
- **One typed-layer foundation** (jurisdictions → datasets → ingestion_runs →
  typed layers) feeds every view; layers are federated, never blended.

Every one of the 10 ideas is just a **different lens on the same filter state**.
Change the question once; every view updates. That single decision — questions
first, filters as the *result* not the *chore* — is what turns the current
dashboard into the Living Record.

---

## 3. The Front Door: Ask Bar → Living Answer

The Ask Bar replaces "filters → table" as the way in. The flow:

1. **Ask.** User types a plain sentence ("break-ins in Rouge in 2024").
2. **Compile (visible).** The sentence is compiled into structured
   `ExplorerFilters`, shown to the user so they watch their words become a real,
   reproducible query.
3. **See.** The map blooms with real matching TPS records + a plain-language
   count sentence.
4. **Understand.** A "why am I seeing this?" link explains the result in data
   terms (datasets, filters, counts).
5. **Trace source.** A `SourceReceipt` slides in: dataset, licence, TPS update
   date, ingestion date, and "reproduce this view."

The Ask Bar is the **hub**. Every other view is a tab/lens you can flip the same
answer into.

---

## 4. The 10 Ideas as Views Inside the System

Each idea is a lens on the shared filter state. Grouped by the loop stage it
serves and the data it already has.

| # | View | Loop stage | Powered by (existing/near-term) | Status |
|---|------|-----------|----------------------------------|--------|
| 1 | **Ask Bar** (front door) | Ask | `ExplorerFilters`, NL→filter compile | **Prototype first** |
| 2 | **The Pulse** (city heartbeat / ECG) | See | `occ_hour`, `occ_dow`, `occ_date` | Future view |
| 3 | **Timefold** (scrub the year like video) | See | `occ_date` + `lat/lng` | Future view |
| 4 | **Place Portraits** (neighbourhood/division cards) | Understand | `hood_158`, `division`, `premises_type`, time | Future view |
| 5 | **Source Spotlight** (provenance as reward) | Trace source | `SourceReceipt` + dataset metadata | Near-term (extends today) |
| 6 | **Honesty Map** (show the holes on purpose) | Understand | `non_mappable_count`, `publish_status`, layers | Future view |
| 7 | **Rhythm Rings** (24-hour clock face) | See | `occ_hour` × `offence` | Future view |
| 8 | **Compare Mode** (two places, no winner) | Connect | shared filter model, doubled | Future view |
| 9 | **Layer Stack** (peel the city, federated) | Connect | typed layers + reference geography | Future view |
| 10 | **Receipt Wall / Ledger feed** (ingestion heartbeat) | Trace source | `ingestion_run` model | Future view |

Design rule for all 10: they read from the same filter state, they never rank
safe/unsafe, and they all terminate in a traceable source.

---

## 5. Phased Path

- **Phase A — Prototype (next):** Ask Bar → Living Answer on existing TPS V1
  data, one offence family + one neighbourhood. Validates "questions first."
- **Phase B — Trust surfaces:** Source Spotlight (#5) + Honesty Map (#6) +
  Receipt Wall (#10). These extend what already exists and deepen the moat
  (transparency). No new sensitive data needed.
- **Phase C — Rhythm surfaces:** Pulse (#2), Rhythm Rings (#7), Timefold (#3).
  Pure time-field lenses; no new datasets.
- **Phase D — Place & connection:** Place Portraits (#4), Compare Mode (#8),
  Layer Stack (#9). Introduces reference geography; still TPS-only.
- **Phase E — Canada scale:** the same telescope, zoomed to many cities (see
  NORTH_STAR future-city strategy). Views unchanged; data foundation widens.

The CrimeInToronto context layer stays a **future, badged, separate seam**
(`external_context_link`) — never merged into official records, consistent with
NORTH_STAR brand separation.

---

## 6. Visual Language (carried forward)

Keep the existing bones (near-black canvas, glass panels, cyan primary, violet
for future/AI, amber metadata, tabular-nums). Push further: motion = breathing
not blinking; red is rationed (never a "bad place" wash); light = data we have
and trust, dim/locked = data we don't yet have. The aesthetic *is* the honesty
model.

5-second homepage feeling: *"Whoa — I can just ask this, and it will tell me the
truth and show me where it came from."*

---

## 7. Best Next Experiment (carried into Implementation later)

Build the **Ask Bar → Living Answer** loop end-to-end on one dataset + one
neighbourhood. Smallest magical version = the moment a normal person's sentence
becomes trustworthy, cited, living data on screen. Everything else in this
document is a variation on that single feeling.

(No schema/auth/AI-backend changes required for the prototype: NL→filter compile
can be deterministic/rules-based first, rendering existing records + existing
SourceReceipt.)

---

## Related documents

- NORTH_STAR.md
- FINAL_PRODUCT_SPEC.md
- PRODUCT_UI_ARCHITECTURE_2026-06-30.md
- LEGAL_GUARDRAILS.md
- ../Logs/STEP_LOG.md
