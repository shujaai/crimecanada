import type { Metadata } from "next";
import { ExplorerShell } from "@/components/explorer/ExplorerShell";
import { FilterBar } from "@/components/explorer/FilterBar";
import { DataTable } from "@/components/explorer/DataTable";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SourceReceipt } from "@/components/ui/SourceReceipt";
import { StatusChip } from "@/components/ui/StatusChip";
import { parseFilters, parsePage, describeFilters, buildExplorerUrl } from "@/lib/filters";
import { getTorontoFacets, queryTorontoIncidents } from "@/lib/tpsQuery";
import { getV1DatasetsBySlug } from "@/lib/datasets";

export const metadata: Metadata = {
  title: "Toronto table",
  description: "Dense, citable table of filtered Toronto Police Service open data with an expandable source citation on every row.",
};

export default async function TorontoTable({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const page = parsePage(sp);
  const [result, facets] = await Promise.all([
    queryTorontoIncidents(filters, { page, includeRecords: true }),
    getTorontoFacets(),
  ]);
  const { summary } = result;
  const selectedDatasets = getV1DatasetsBySlug(filters.offence);

  return (
    <ExplorerShell
      view="table"
      filters={filters}
      toolbar={
        <StatusChip tone="cyan" dot>
          {summary.total.toLocaleString("en-CA")} real records
        </StatusChip>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="flex flex-col gap-4">
          <GlassPanel className="p-4">
            <p className="kicker mb-3">Filters</p>
            <FilterBar
              initial={filters}
              matchingCount={summary.total}
              facets={facets}
              mode="live"
              view="table"
            />
          </GlassPanel>
          <SourceReceipt
            datasets={selectedDatasets}
            recordCount={summary.total}
            filters={describeFilters(filters)}
            reproUrl={buildExplorerUrl("table", filters)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <DataTable
            incidents={result.records}
            filters={filters}
            total={summary.total}
            page={result.page}
            pageCount={result.pageCount}
          />
          <p className="px-1 text-[0.68rem] leading-relaxed text-faint">
            Columns never include suspect or victim names, mugshots, or personal
            identifiers. Every row expands to its full source citation.
          </p>
        </div>
      </div>
    </ExplorerShell>
  );
}
