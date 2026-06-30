/**
 * Source receipt: the "keep the receipts" component. Every chart, table, map,
 * or metric panel that shows data should pair with one of these so a viewer can
 * see exactly what produced the number and reproduce it.
 *
 * Surfaces: dataset(s), source agency, update date, ingestion date, active
 * filters, record count, and a reproducible explorer URL.
 */

import type { DatasetMeta } from "@/lib/datasets";
import { PreviewBadge } from "./PreviewBadge";

interface SourceReceiptProps {
  datasets: DatasetMeta[];
  recordCount?: number;
  /** Marks the record count as derived from synthetic preview data. */
  recordCountPreview?: boolean;
  /** Human-readable active filters (e.g. from describeFilters). */
  filters?: string[];
  /** Reproducible explorer URL for this exact view. */
  reproUrl?: string;
  className?: string;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <span className="kicker shrink-0 pt-0.5">{label}</span>
      <span className="nums text-right text-xs text-ink">{value}</span>
    </div>
  );
}

export function SourceReceipt({
  datasets,
  recordCount,
  recordCountPreview = false,
  filters = [],
  reproUrl,
  className = "",
}: SourceReceiptProps) {
  const agency = datasets[0]?.sourceName ?? "Toronto Police Service";
  const updateDate = datasets[0]?.datasetUpdateDate ?? "Pending ingestion";
  const ingestionDate = datasets[0]?.ingestionDate ?? "Pending ingestion";
  const provenancePending = datasets.some(
    (d) => d.provenanceStatus === "to_be_confirmed",
  );

  return (
    <section
      className={`overflow-hidden rounded-lg border border-line bg-base/60 ${className}`}
      aria-label="Source receipt"
    >
      <div className="flex items-center justify-between gap-2 border-b border-line bg-panel/40 px-3 py-2">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber" />
          <span className="kicker text-amber">Source receipt</span>
        </span>
        {recordCountPreview ? <PreviewBadge /> : null}
      </div>

      <div className="divide-y divide-line/60 px-3 py-1.5">
        <Row
          label="Dataset"
          value={
            datasets.length === 1
              ? datasets[0].name
              : `${datasets.length} datasets`
          }
        />
        <Row label="Source agency" value={agency} />
        <Row label="TPS update date" value={updateDate} />
        <Row label="Ingested" value={ingestionDate} />
        <Row
          label="Active filters"
          value={filters.length ? filters.join(" · ") : "None (all records)"}
        />
        {typeof recordCount === "number" ? (
          <Row label="Record count" value={recordCount.toLocaleString("en-CA")} />
        ) : null}
        {reproUrl ? (
          <Row
            label="Reproducible URL"
            value={
              <a
                href={reproUrl}
                className="font-mono text-cyan underline-offset-2 hover:underline"
              >
                {reproUrl}
              </a>
            }
          />
        ) : null}
      </div>

      {provenancePending ? (
        <p className="border-t border-line/60 px-3 py-2 text-[0.68rem] leading-relaxed text-faint">
          Source URL, licence, and update dates are placeholders pending real
          ingestion (Phase 3). Record counts shown in explorer views are preview
          values until then.
        </p>
      ) : null}
    </section>
  );
}
