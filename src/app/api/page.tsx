import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusChip } from "@/components/ui/StatusChip";
import { PreviewBadge } from "@/components/ui/PreviewBadge";

export const metadata: Metadata = {
  title: "API",
  description:
    "API access is coming after V1. Preview the conceptual endpoint shapes. Until then, datasets are available via the official TPS portal listed on the sources page.",
};

const ENDPOINTS: { method: string; path: string; note: string }[] = [
  { method: "GET", path: "/v1/datasets", note: "List datasets with typed layer, publish status, and provenance." },
  { method: "GET", path: "/v1/incidents", note: "Filter incidents by offence, date, neighbourhood, division, geocodable." },
  { method: "GET", path: "/v1/incidents/{source_record_id}", note: "Fetch a single record with full source citation." },
  { method: "GET", path: "/v1/incidents.geojson", note: "GeoJSON for mappable records (0,0 excluded)." },
  { method: "GET", path: "/v1/sources", note: "Source/licence metadata for citation." },
];

export default function ApiPage() {
  return (
    <>
      <PageHero
        kicker="Developers"
        badge={<StatusChip tone="amber" dot>Waitlist</StatusChip>}
        title="API access is coming"
        description="There are no API keys in V1. These endpoint shapes are conceptual previews of a future, source-backed, citation-first API. Today, data is available via the official TPS portal."
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Conceptual endpoints */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <SectionHeader kicker="Conceptual shapes" title="Planned endpoints" />
              <PreviewBadge label="Concept · not live" tone="violet" />
            </div>
            <GlassPanel className="divide-y divide-line/60 p-2">
              {ENDPOINTS.map((e) => (
                <div key={e.path} className="flex flex-col gap-1 px-3 py-3 sm:flex-row sm:items-center sm:gap-4">
                  <span className="inline-flex w-fit shrink-0 rounded border border-green/40 bg-green/10 px-2 py-0.5 font-mono text-[0.62rem] text-green">
                    {e.method}
                  </span>
                  <code className="nums shrink-0 font-mono text-xs text-cyan sm:w-72">{e.path}</code>
                  <span className="text-xs leading-relaxed text-muted">{e.note}</span>
                </div>
              ))}
            </GlassPanel>
            <p className="mt-3 text-xs leading-relaxed text-faint">
              Every API response will carry provenance and a reproducible explorer
              URL, mirroring the citations shown across the site. No personal
              identifiers, no safety scores.
            </p>
          </div>

          {/* Waitlist + access today */}
          <div className="flex flex-col gap-4">
            <GlassPanel soft className="p-5">
              <p className="kicker mb-2">Join the waitlist</p>
              <p className="mb-4 text-sm leading-relaxed text-muted">
                Want early API access? Tell us what you would build. (Form is a
                placeholder — no backend is wired in V1.)
              </p>
              <form className="flex flex-col gap-2" aria-label="API waitlist (preview)">
                <input
                  type="email"
                  placeholder="you@example.com"
                  disabled
                  className="rounded-md border border-line bg-base px-3 py-2 text-sm text-ink placeholder:text-faint disabled:opacity-60"
                />
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-md border border-cyan/30 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan opacity-70"
                >
                  Notify me (coming soon)
                </button>
              </form>
            </GlassPanel>

            <GlassPanel className="p-5">
              <p className="kicker mb-2 text-cyan">Get data today</p>
              <p className="text-sm leading-relaxed text-muted">
                Until the API ships, the underlying datasets are available
                directly from the Toronto Police Service portal, linked on the
                sources page with licence details.
              </p>
              <Link href="/data/sources" className="mt-3 inline-flex text-sm text-cyan hover:underline">
                Go to data sources →
              </Link>
            </GlassPanel>
          </div>
        </div>
      </div>
    </>
  );
}
