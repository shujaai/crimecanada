import type { Metadata } from "next";
import { ExplorerShell } from "@/components/explorer/ExplorerShell";
import { FilterBar } from "@/components/explorer/FilterBar";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SourceReceipt } from "@/components/ui/SourceReceipt";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { parseFilters, describeFilters, buildExplorerUrl } from "@/lib/filters";
import { filterPreviewIncidents, summarizePreview } from "@/lib/previewQuery";
import { V1_DATASETS } from "@/lib/datasets";

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
  const rows = filterPreviewIncidents(filters);
  const summary = summarizePreview(rows);

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
          <FilterBar initial={filters} mode="builder" view="search" />
        </GlassPanel>

        <SourceReceipt
          datasets={V1_DATASETS}
          recordCount={summary.total}
          recordCountPreview
          filters={describeFilters(filters)}
          reproUrl={buildExplorerUrl("search", filters)}
        />
      </div>
    </ExplorerShell>
  );
}
