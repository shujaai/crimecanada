import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PreviewBadge } from "@/components/ui/PreviewBadge";
import { DataLayerStack } from "@/components/explorer/DataLayerStack";

export const metadata: Metadata = {
  title: "Vision",
  description:
    "The long-term concept for CrimeCanada.io: a federated, provenance-aware civic-data organism. Concept only — not a description of live features.",
};

const LAYERS = [
  {
    n: "01",
    title: "Official public data explorer",
    body: "A clean, neutral, source-backed dashboard for public records: search by offence, date, neighbourhood, and division; view on a map or in a table; cite every record; share a filtered URL; and always see dataset limitations.",
    status: "Live in V1 (Toronto)",
  },
  {
    n: "02",
    title: "Visual intelligence",
    body: "Trend cards, calendar heat strips, hour-of-day rhythm, neighbourhood and division profile cards, a compare workspace, and a “what changed?” panel — all neutral, never fear-based, never danger-ranked.",
    status: "Designed · partially scaffolded",
  },
  {
    n: "03",
    title: "AI data co-pilot",
    body: "A source-bound analyst that turns questions into structured filters, generates charts from exact query specs, cites datasets and record counts, links back to a reproducible explorer view, and refuses unsupported or safety-recommendation questions.",
    status: "Concept",
  },
  {
    n: "04",
    title: "Canada-wide organism",
    body: "Other cities plug in through jurisdictions, datasets, ingestion runs, and typed source layers — each with its own provenance. Calgary, Peel, Edmonton, Vancouver, and Winnipeg are designed to appear naturally when their official sources are ready.",
    status: "Concept",
  },
  {
    n: "05",
    title: "External context layer",
    body: "Future CrimeInToronto reporting could appear as clearly labelled context beside official records — never blended into TPS data, never implying guilt, always badged as external context.",
    status: "Concept · 0 records today",
  },
];

export default function Vision() {
  return (
    <>
      <PageHero
        grid
        kicker="The long view"
        badge={<PreviewBadge label="Concept · not live data" />}
        title={
          <>
            A living civic atlas for{" "}
            <span className="text-violet">Canada&apos;s public crime data</span>.
          </>
        }
        description="CrimeCanada.io is built to grow from one city into a federated, provenance-aware organism: map, dashboard, search engine, source ledger, and source-bound AI analyst. This page describes the concept — not features that exist today."
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-4">
          {LAYERS.map((l) => (
            <GlassPanel key={l.n} className="flex flex-col gap-3 p-6 sm:flex-row sm:gap-6">
              <span className="nums text-2xl font-semibold text-violet sm:w-16">{l.n}</span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-ink">{l.title}</h2>
                  <span className="rounded-full border border-line bg-panel-2 px-2.5 py-0.5 text-[0.62rem] text-muted">
                    {l.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{l.body}</p>
              </div>
            </GlassPanel>
          ))}
        </section>

        <section className="mt-12">
          <SectionHeader
            kicker="Federated, not blended"
            title="The data layer stack"
            description="A single organism does not mean a single undifferentiated database. Each typed layer keeps its own schema and provenance."
            className="mb-5"
          />
          <DataLayerStack />
        </section>

        <section className="mt-12">
          <GlassPanel className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-muted">
              Beauty is allowed. Motion is allowed. Data fiction is not. Every
              answer in this product must be grounded in a cited record.
            </p>
            <div className="flex gap-2">
              <Link href="/canada" className="rounded-md border border-violet/40 bg-violet/10 px-4 py-2 text-sm font-medium text-violet hover:bg-violet/20">
                Canada organism
              </Link>
              <Link href="/toronto" className="rounded-md border border-line bg-panel-2 px-4 py-2 text-sm font-medium text-ink hover:border-cyan/30">
                Explore Toronto (live)
              </Link>
            </div>
          </GlassPanel>
        </section>
      </div>
    </>
  );
}
