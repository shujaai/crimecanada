import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusChip } from "@/components/ui/StatusChip";
import { DatasetBadge } from "@/components/ui/DatasetBadge";
import { SourceReceipt } from "@/components/ui/SourceReceipt";
import { DisclaimerBlock } from "@/components/ui/DisclaimerBlock";
import { FilterBar } from "@/components/explorer/FilterBar";
import { DataLensCards } from "@/components/explorer/DataLensCards";
import { parseFilters, describeFilters, buildExplorerUrl } from "@/lib/filters";
import { getTorontoFacets, queryTorontoIncidents } from "@/lib/tpsQuery";
import { getV1DatasetsBySlug, V1_DATASETS } from "@/lib/datasets";

export const metadata: Metadata = {
  title: "Toronto explorer",
  description:
    "Control room for Toronto Police Service Major Crime open data: filter, map, table, and search with a source citation on every record.",
};

export default async function TorontoHub({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const [result, facets] = await Promise.all([
    queryTorontoIncidents(filters),
    getTorontoFacets(),
  ]);
  const { summary } = result;
  const selectedDatasets = getV1DatasetsBySlug(filters.offence);

  return (
    <>
      <PageHero
        kicker="Toronto · Toronto Police Service open data"
        badge={<StatusChip tone="cyan" dot>V1 live</StatusChip>}
        title="Toronto explorer"
        description="The control room for Toronto's Major Crime open data. Set filters once — they carry across map, table, and search, and into a shareable URL."
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Filters */}
          <GlassPanel className="p-5">
            <SectionHeader
              kicker="Build a query"
              title="Filter records"
              className="mb-5"
            />
            <FilterBar
              initial={filters}
              matchingCount={summary.total}
              facets={facets}
              mode="builder"
            />
          </GlassPanel>

          {/* Quick stats */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <MetricCard label="Matching" value={summary.total} tone="cyan" />
              <MetricCard label="Mappable" value={summary.mappable} />
              <MetricCard label="Non-mappable" value={summary.nonMappable} tone="amber" />
              <MetricCard label="Datasets" value={V1_DATASETS.length} />
            </div>
            <SourceReceipt
              datasets={selectedDatasets}
              recordCount={summary.total}
              filters={describeFilters(filters)}
              reproUrl={buildExplorerUrl("table", filters)}
            />
          </div>
        </div>

        {/* Mappable vs non-mappable explanation */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <GlassPanel soft className="p-4 md:col-span-2">
            <p className="kicker mb-2 text-amber">Mappable vs non-mappable</p>
            <p className="text-sm leading-relaxed text-muted">
              Some records carry coordinates of <span className="nums text-ink">0, 0</span>{" "}
              in the source data. Those records stay fully available in the table
              and search results, but they are <span className="text-amber">excluded from map markers</span>{" "}
              because their location is not known. We never invent a location.
            </p>
          </GlassPanel>
          <GlassPanel soft className="flex flex-col justify-center p-4">
            <p className="kicker mb-1">Across the six V1 datasets</p>
            <p className="nums text-sm text-muted">
              <span className="font-semibold text-amber">8,202</span> verified source rows
              sit at 0,0 and are map-excluded by design.
            </p>
          </GlassPanel>
        </section>

        {/* Published datasets */}
        <section className="mt-10">
          <SectionHeader
            kicker="Published in V1"
            title="Six Major Crime open datasets"
            description="One shared 31-column schema. OBJECTID is the source record id; EVENT_UNIQUE_ID is stored but not used to deduplicate."
            action={
              <Link href="/data/sources" className="text-sm text-cyan hover:underline">
                Full source ledger →
              </Link>
            }
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {V1_DATASETS.map((d) => (
              <GlassPanel key={d.slug} className="flex flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-ink">{d.name}</h3>
                  <DatasetBadge layer={d.layer} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="kicker mb-0.5">Records</p>
                    <p className="nums text-ink">{d.rowCount.toLocaleString("en-CA")}</p>
                  </div>
                  <div>
                    <p className="kicker mb-0.5">Non-mappable</p>
                    <p className="nums text-amber">
                      {(d.nonMappableCount ?? 0).toLocaleString("en-CA")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[0.68rem] text-faint">
                  <span>Update date</span>
                  <span className="nums">{d.datasetUpdateDate}</span>
                </div>
              </GlassPanel>
            ))}
          </div>
        </section>

        {/* Data lenses */}
        <section className="mt-10">
          <SectionHeader kicker="Data lenses" title="Pick a way to explore" className="mb-5" />
          <DataLensCards />
        </section>

        {/* View entry cards */}
        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <ViewCard href={buildExplorerUrl("map", filters)} title="Open in map" glyph="◎" />
          <ViewCard href={buildExplorerUrl("table", filters)} title="Open in table" glyph="▤" />
          <ViewCard href={buildExplorerUrl("search", filters)} title="Refine in search" glyph="⌕" />
        </section>

        <section className="mb-12 mt-10">
          <DisclaimerBlock />
        </section>
      </div>
    </>
  );
}

function ViewCard({ href, title, glyph }: { href: string; title: string; glyph: string }) {
  return (
    <Link href={href} className="group">
      <GlassPanel interactive className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-cyan">{glyph}</span>
          <span className="text-sm font-semibold text-ink">{title}</span>
        </div>
        <span className="text-faint transition-transform group-hover:translate-x-0.5">→</span>
      </GlassPanel>
    </Link>
  );
}
