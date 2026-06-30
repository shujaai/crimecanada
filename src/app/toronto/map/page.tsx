import type { Metadata } from "next";
import { ExplorerShell } from "@/components/explorer/ExplorerShell";
import { FilterBar } from "@/components/explorer/FilterBar";
import { MapPreview } from "@/components/explorer/MapPreview";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SourceReceipt } from "@/components/ui/SourceReceipt";
import { StatusChip } from "@/components/ui/StatusChip";
import { parseFilters, describeFilters, buildExplorerUrl } from "@/lib/filters";
import { filterPreviewIncidents, summarizePreview } from "@/lib/previewQuery";
import { V1_DATASETS } from "@/lib/datasets";

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
  const rows = filterPreviewIncidents(filters);
  const summary = summarizePreview(rows);
  const mappable = rows.filter((r) => r.mappable);

  return (
    <ExplorerShell
      view="map"
      filters={filters}
      toolbar={
        <StatusChip tone="cyan" dot>
          {summary.mappable.toLocaleString("en-CA")} mappable · preview
        </StatusChip>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="flex flex-col gap-4">
          <GlassPanel className="p-4">
            <p className="kicker mb-3">Filter drawer</p>
            <FilterBar initial={filters} mode="live" view="map" />
          </GlassPanel>
          <SourceReceipt
            datasets={V1_DATASETS}
            recordCount={summary.total}
            recordCountPreview
            filters={describeFilters(filters)}
            reproUrl={buildExplorerUrl("map", filters)}
          />
        </div>

        <MapPreview incidents={mappable} nonMappableCount={summary.nonMappable} />
      </div>
    </ExplorerShell>
  );
}
