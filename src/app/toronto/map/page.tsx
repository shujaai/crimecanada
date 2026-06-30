import type { Metadata } from "next";
import { ExplorerShell } from "@/components/explorer/ExplorerShell";
import { FilterBar } from "@/components/explorer/FilterBar";
import { TorontoMap as TorontoIncidentMap } from "@/components/explorer/TorontoMap";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SourceReceipt } from "@/components/ui/SourceReceipt";
import { StatusChip } from "@/components/ui/StatusChip";
import { parseFilters, describeFilters, buildExplorerUrl } from "@/lib/filters";
import { getTorontoFacets, queryTorontoIncidents } from "@/lib/tpsQuery";
import { getV1DatasetsBySlug } from "@/lib/datasets";

export const metadata: Metadata = {
  title: "Toronto map",
  description: "Geospatial view of filtered Toronto Police Service open data. Neutral incident markers only.",
};

export default async function TorontoMap({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const [result, facets] = await Promise.all([
    queryTorontoIncidents(filters, { includeMapRecords: true }),
    getTorontoFacets(),
  ]);
  const { summary } = result;
  const selectedDatasets = getV1DatasetsBySlug(filters.offence);

  return (
    <ExplorerShell
      view="map"
      filters={filters}
      toolbar={
        <StatusChip tone="cyan" dot>
          {summary.mappable.toLocaleString("en-CA")} matching mappable
        </StatusChip>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="flex flex-col gap-4">
          <GlassPanel className="p-4">
            <p className="kicker mb-3">Filter drawer</p>
            <FilterBar
              initial={filters}
              matchingCount={summary.total}
              facets={facets}
              mode="live"
              view="map"
            />
          </GlassPanel>
          <SourceReceipt
            datasets={selectedDatasets}
            recordCount={summary.total}
            filters={describeFilters(filters)}
            reproUrl={buildExplorerUrl("map", filters)}
          />
        </div>

        <TorontoIncidentMap
          incidents={result.mapRecords}
          totalMappableCount={summary.mappable}
          nonMappableCount={summary.nonMappable}
          mapLimit={result.mapLimit}
        />
      </div>
    </ExplorerShell>
  );
}
