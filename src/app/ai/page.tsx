import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusChip } from "@/components/ui/StatusChip";
import { PreviewBadge } from "@/components/ui/PreviewBadge";
import { SourceReceipt } from "@/components/ui/SourceReceipt";
import { AiQueryBar } from "@/components/explorer/AiQueryBar";
import { V1_DATASETS } from "@/lib/datasets";
import { buildExplorerUrl } from "@/lib/filters";

export const metadata: Metadata = {
  title: "Ask the Data",
  description:
    "Concept for a source-bound AI data co-pilot. It does not answer yet. When it does, every answer will cite datasets, filters, and record counts, and refuse unsupported questions.",
};

const REFUSALS = [
  "Safety recommendations (“is this neighbourhood safe?”)",
  "Anything about named or identifiable people",
  "Statistics not traceable to ingested records",
  "Predictions presented as fact",
];

const robbery = V1_DATASETS.filter((d) => d.slug === "robbery-open-data");

export default function AiPage() {
  const exampleFilters = {
    offence: ["robbery-open-data"],
    dateFrom: "2025-01-01",
    dateTo: "2025-12-31",
    neighbourhood: "131",
    geocodable: "any" as const,
  };

  return (
    <>
      <PageHero
        grid
        kicker="Source-bound AI"
        badge={<PreviewBadge label="Coming soon · does not answer yet" tone="violet" />}
        title="Ask the Data"
        description="A future co-pilot that converts plain questions into structured, cited queries. It will behave like a source-bound analyst — not a chatbot that guesses."
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <GlassPanel className="p-5">
          <AiQueryBar />
        </GlassPanel>

        {/* Structured answer card concept */}
        <section className="mt-10">
          <SectionHeader
            kicker="What an answer will look like"
            title="Structured answer card"
            description="Every answer is a card, not a paragraph: interpreted query, filters used, result count, view tabs, a source receipt, limitations, and a link into the explorer."
            className="mb-5"
          />

          <GlassPanel className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-line bg-panel/50 px-4 py-2.5">
              <span className="kicker text-violet">Example · “Show robberies in Scarborough (Rouge) in 2025”</span>
              <PreviewBadge label="Illustrative" tone="violet" />
            </div>

            <div className="grid gap-5 p-5 lg:grid-cols-[1.4fr_1fr]">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="kicker mb-1.5">Interpreted query</p>
                  <p className="text-sm text-ink">
                    Robbery records where neighbourhood = Rouge (158-code 131) and
                    occurrence year = 2025.
                  </p>
                </div>
                <div>
                  <p className="kicker mb-1.5">Filters used</p>
                  <div className="flex flex-wrap gap-1.5">
                    <StatusChip tone="cyan" dot>Offence: Robbery</StatusChip>
                    <StatusChip tone="cyan" dot>2025-01-01 → 2025-12-31</StatusChip>
                    <StatusChip tone="cyan" dot>Neighbourhood 131</StatusChip>
                  </div>
                </div>
                <div>
                  <p className="kicker mb-1.5">View</p>
                  <div className="inline-flex overflow-hidden rounded-lg border border-line">
                    {["Map", "Table", "Chart"].map((t, i) => (
                      <span
                        key={t}
                        className={`px-4 py-1.5 text-xs ${i === 0 ? "bg-cyan/15 text-cyan" : "text-faint"}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-md border border-amber/25 bg-amber/[0.06] p-3">
                  <p className="kicker mb-1 text-amber">Limitations</p>
                  <p className="text-xs leading-relaxed text-muted">
                    Reported incidents only, per TPS open data. Not real-time. Some
                    records may be non-mappable (0,0). “Reported” does not mean
                    “confirmed.”
                  </p>
                </div>
                <a
                  href={buildExplorerUrl("table", exampleFilters)}
                  className="inline-flex w-fit rounded-md border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan hover:bg-cyan/20"
                >
                  Open this answer in the explorer →
                </a>
              </div>

              <SourceReceipt
                datasets={robbery.length ? robbery : V1_DATASETS}
                recordCount={0}
                recordCountPreview
                filters={["Offence: Robbery", "2025", "Neighbourhood 131"]}
                reproUrl={buildExplorerUrl("table", exampleFilters)}
              />
            </div>
          </GlassPanel>
        </section>

        {/* Refusal rules */}
        <section className="mt-10">
          <GlassPanel className="border-red/25 p-6">
            <SectionHeader
              kicker="Guardrails"
              title="What the co-pilot will refuse"
              className="mb-4"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {REFUSALS.map((r) => (
                <div key={r} className="flex items-center gap-2 rounded-lg border border-red/20 bg-red/[0.05] px-3 py-2.5">
                  <span className="text-red-soft">✕</span>
                  <span className="text-sm text-ink">{r}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-faint">
              The same prohibited-content rules that govern the rest of the site
              apply to AI output: no names, no mugshots, no safety scores, and no
              statistic that cannot be traced to an ingested record.
            </p>
          </GlassPanel>
        </section>
      </div>
    </>
  );
}
