import type { Metadata } from "next";
import { ExplorerShell } from "@/components/explorer/ExplorerShell";
import { FilterBar } from "@/components/explorer/FilterBar";
import { DataTablePreview } from "@/components/explorer/DataTablePreview";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SourceReceipt } from "@/components/ui/SourceReceipt";
import { StatusChip } from "@/components/ui/StatusChip";
import { parseFilters, describeFilters, buildExplorerUrl } from "@/lib/filters";
import { filterPreviewIncidents, summarizePreview } from "@/lib/previewQuery";
import { V1_DATASETS } from "@/lib/datasets";

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
  const rows = filterPreviewIncidents(filters);
  const summary = summarizePreview(rows);

  return (
    <ExplorerShell
      view="table"
      filters={filters}
      toolbar={
        <StatusChip tone="cyan" dot>
          {summary.total.toLocaleString("en-CA")} records · preview
        </StatusChip>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="flex flex-col gap-4">
          <GlassPanel className="p-4">
            <p className="kicker mb-3">Filters</p>
            <FilterBar initial={filters} mode="live" view="table" />
          </GlassPanel>
          <SourceReceipt
            datasets={V1_DATASETS}
            recordCount={summary.total}
            recordCountPreview
            filters={describeFilters(filters)}
            reproUrl={buildExplorerUrl("table", filters)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <DataTablePreview incidents={rows} />
          <p className="px-1 text-[0.68rem] leading-relaxed text-faint">
            Columns never include suspect or victim names, mugshots, or personal
            identifiers. Every row expands to its full source citation.
          </p>
        </div>
      </div>
    </ExplorerShell>
  );
}
