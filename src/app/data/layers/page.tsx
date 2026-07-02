import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StatusChip } from "@/components/ui/StatusChip";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { DataLayerStack } from "@/components/explorer/DataLayerStack";
import { TOTAL_CORPUS_FILES } from "@/lib/datasets";

export const metadata: Metadata = {
  title: "Source layers",
  description:
    "The seven typed source layers of the Unified Source Foundation, and which are live, deferred, reference-only, or future.",
};

export default function DataLayers() {
  return (
    <>
      <PageHero
        kicker="Unified source foundation"
        badge={
          <>
            <TrustBadge label="Live source data" />
            <StatusChip tone="cyan" dot>1 of 7 layers live</StatusChip>
          </>
        }
        title="Typed source layers"
        description={`All ${TOTAL_CORPUS_FILES} TPS files are classified into exactly one typed layer. Layers have different schemas and are never merged into one universal incident table.`}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <DataLayerStack />

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <GlassPanel soft className="p-4">
            <p className="kicker mb-2 text-cyan">Why layers</p>
            <p className="text-xs leading-relaxed text-muted">
              Forcing 74 different files into one schema would destroy provenance
              and meaning. Each layer keeps its own shape, sensitivity, and release
              rules while sharing common dataset metadata.
            </p>
          </GlassPanel>
          <GlassPanel soft className="p-4">
            <p className="kicker mb-2 text-amber">Deferred ≠ ignored</p>
            <p className="text-xs leading-relaxed text-muted">
              Sensitive incidents, traffic/KSI, crisis calls, and aggregates are
              preserved and classified — published only when schema design and
              legal review allow.
            </p>
          </GlassPanel>
          <GlassPanel soft className="p-4">
            <p className="kicker mb-2 text-violet">External context</p>
            <p className="text-xs leading-relaxed text-muted">
              Any future CrimeInToronto reporting stays in its own layer with
              explicit provenance — never blended into official TPS records.
            </p>
          </GlassPanel>
        </section>

        <section className="mt-8">
          <GlassPanel className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              See exactly which datasets sit in each layer and how they are cited.
            </p>
            <Link href="/data/sources" className="rounded-md border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan hover:bg-cyan/20">
              Open the source ledger →
            </Link>
          </GlassPanel>
        </section>
      </div>
    </>
  );
}
