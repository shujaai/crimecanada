import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusChip, type ChipTone } from "@/components/ui/StatusChip";
import { PreviewBadge } from "@/components/ui/PreviewBadge";
import {
  JURISDICTIONS,
  JURISDICTION_STATUS_LABEL,
  type JurisdictionStatus,
} from "@/lib/jurisdictions";

export const metadata: Metadata = {
  title: "Canada organism",
  description:
    "Concept map of how Canadian city datasets could plug into CrimeCanada.io with provenance. Only Toronto is live; all other nodes are future and carry no data.",
};

const STATUS_TONE: Record<JurisdictionStatus, ChipTone> = {
  active: "cyan",
  planned: "amber",
  researching: "violet",
  not_started: "neutral",
};

export default function Canada() {
  return (
    <>
      <PageHero
        grid
        kicker="Federated by design"
        badge={<PreviewBadge label="Concept · only Toronto is live" />}
        title="The Canada organism"
        description="Each city joins through jurisdictions, datasets, ingestion runs, and typed source layers — each with its own provenance. Future nodes below carry no data until their official sources are ingested."
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Schematic node map */}
        <GlassPanel className="relative overflow-hidden p-2">
          <div className="grid-overlay scanlines relative aspect-[16/8] w-full rounded-lg">
            <div className="pointer-events-none absolute left-3 top-3">
              <PreviewBadge label="Schematic · not a geographic map" />
            </div>
            {JURISDICTIONS.map((j) => {
              const active = j.status === "active";
              return (
                <div
                  key={j.id}
                  style={{ left: `${j.pos.x}%`, top: `${j.pos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={`rounded-full ${
                        active
                          ? "h-4 w-4 bg-cyan ring-4 ring-cyan/20 animate-pulse-dot"
                          : "h-2.5 w-2.5 bg-faint"
                      }`}
                    />
                    <span
                      className={`whitespace-nowrap rounded border px-1.5 py-0.5 text-[0.6rem] ${
                        active
                          ? "border-cyan/40 bg-base/80 text-cyan"
                          : "border-line bg-base/70 text-faint"
                      }`}
                    >
                      {j.city}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassPanel>

        {/* Jurisdiction list */}
        <section className="mt-10">
          <SectionHeader
            kicker="Source readiness"
            title="Jurisdictions"
            description="Acquisition priority follows the data source plan. No city ingestion is built in V1, and no fabricated data is shown for any future node."
            className="mb-5"
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JURISDICTIONS.map((j) => (
              <GlassPanel key={j.id} className="flex flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">{j.city}</h3>
                    <p className="text-xs text-faint">{j.agency} · {j.province}</p>
                  </div>
                  <StatusChip tone={STATUS_TONE[j.status]} dot>
                    {JURISDICTION_STATUS_LABEL[j.status]}
                  </StatusChip>
                </div>
                <p className="text-xs leading-relaxed text-muted">{j.note}</p>
                <div className="mt-auto flex items-center justify-between text-[0.68rem] text-faint">
                  <span>{j.priority === 0 ? "Live jurisdiction" : `Priority ${j.priority}`}</span>
                  {j.status === "active" ? (
                    <Link href="/toronto" className="text-cyan hover:underline">
                      Open explorer →
                    </Link>
                  ) : (
                    <span>No data yet</span>
                  )}
                </div>
              </GlassPanel>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
