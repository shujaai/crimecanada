import type { Metadata } from "next";
import { ExplorerShell } from "@/components/explorer/ExplorerShell";
import { FilterBar } from "@/components/explorer/FilterBar";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SourceReceipt } from "@/components/ui/SourceReceipt";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { parseFilters, describeFilters, buildExplorerUrl } from "@/lib/filters";
import { getTorontoFacets, queryTorontoIncidents } from "@/lib/tpsQuery";
import { getV1DatasetsBySlug } from "@/lib/datasets";

export const metadata: Metadata = {
  title: "Toronto search",
  description: "Structured query builder for Toronto Police Service open data. Filters only — no free-text person search.",
};

export default async function TorontoSearch({
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
    <ExplorerShell view="search" filters={filters}>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <GlassPanel className="p-5">
          <SectionHeader
            kicker="Structured query builder"
            title="Compose a search"
            description="Combine offence type, date range, neighbourhood, division, and mappability, then open the result in map or table. There is no free-text search for people."
            className="mb-5"
          />
          <FilterBar
            initial={filters}
            matchingCount={summary.total}
            facets={facets}
            mode="builder"
            view="search"
          />
        </GlassPanel>

        <SourceReceipt
          datasets={selectedDatasets}
          recordCount={summary.total}
          filters={describeFilters(filters)}
          reproUrl={buildExplorerUrl("search", filters)}
        />
      </div>
    </ExplorerShell>
  );
}
