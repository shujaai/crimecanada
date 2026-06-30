"use client";

import { Fragment, useState } from "react";
import type { PreviewIncident } from "@/lib/mockIncidents";
import { getDatasetBySlug } from "@/lib/datasets";
import { PreviewBadge } from "@/components/ui/PreviewBadge";

interface DataTablePreviewProps {
  incidents: PreviewIncident[];
  /** Rows to show before the pagination placeholder. */
  pageSize?: number;
}

const COLUMNS = [
  "Occurrence",
  "Offence",
  "Neighbourhood",
  "Division",
  "Premises",
  "Dataset",
  "Source record",
];

export function DataTablePreview({ incidents, pageSize = 25 }: DataTablePreviewProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const rows = incidents.slice(0, pageSize);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-panel/40">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-panel/60 px-4 py-2.5">
        <span className="kicker">Records</span>
        <div className="flex items-center gap-2">
          <span className="nums text-xs text-muted">
            {incidents.length.toLocaleString("en-CA")} match · showing {rows.length}
          </span>
          <PreviewBadge />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              {COLUMNS.map((c) => (
                <th key={c} className="kicker whitespace-nowrap px-4 py-2.5 font-medium">
                  {c}
                </th>
              ))}
              <th className="px-4 py-2.5" aria-label="Expand" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const ds = getDatasetBySlug(r.datasetSlug);
              const open = expanded === r.sourceRecordId;
              return (
                <Fragment key={r.sourceRecordId}>
                  <tr
                    className={`cursor-pointer border-b border-line/50 transition-colors hover:bg-cyan/[0.04] ${
                      open ? "bg-cyan/[0.04]" : ""
                    }`}
                    onClick={() => setExpanded(open ? null : r.sourceRecordId)}
                  >
                    <td className="nums whitespace-nowrap px-4 py-2.5 text-muted">{r.occDate}</td>
                    <td className="px-4 py-2.5 text-ink">{r.offence}</td>
                    <td className="px-4 py-2.5 text-muted">
                      <span className="nums text-faint">{r.hood158}</span> {r.neighbourhood158}
                    </td>
                    <td className="nums px-4 py-2.5 text-muted">{r.division}</td>
                    <td className="px-4 py-2.5 text-muted">{r.premisesType}</td>
                    <td className="px-4 py-2.5 text-faint">{ds?.name ?? r.datasetSlug}</td>
                    <td className="nums px-4 py-2.5 text-faint">#{r.sourceRecordId}</td>
                    <td className="px-2 py-2.5 text-center text-faint">{open ? "−" : "+"}</td>
                  </tr>
                  {open ? (
                    <tr className="border-b border-line/50 bg-base/50">
                      <td colSpan={8} className="px-4 py-3">
                        <p className="kicker mb-2 text-amber">Source citation</p>
                        <dl className="grid gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2">
                          <Cite label="Dataset" value={ds?.name ?? r.datasetSlug} />
                          <Cite label="Source agency" value={ds?.sourceName ?? "Toronto Police Service"} />
                          <Cite label="TPS update date" value={ds?.datasetUpdateDate ?? "Pending"} />
                          <Cite label="Ingested" value={ds?.ingestionDate ?? "Pending"} />
                          <Cite label="OBJECTID (source_record_id)" value={String(r.sourceRecordId)} />
                          <Cite label="EVENT_UNIQUE_ID" value={r.eventUniqueId} />
                          <Cite label="CSI category" value={r.csiCategory} />
                          <Cite
                            label="Coordinates"
                            value={r.mappable ? `${r.lat}, ${r.lng}` : "0, 0 (non-mappable)"}
                          />
                        </dl>
                        <p className="mt-2 text-[0.68rem] text-faint">
                          Preview record (synthetic). No suspect or victim names are
                          stored or displayed.
                        </p>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
        <span className="text-xs text-faint">
          Server-side pagination wires up when the database is connected (Phase 4).
        </span>
        <div className="flex items-center gap-1.5">
          <span className="cursor-not-allowed rounded-md border border-line px-2.5 py-1 text-xs text-faint opacity-60">
            ← Prev
          </span>
          <span className="rounded-md border border-cyan/40 bg-cyan/10 px-2.5 py-1 text-xs text-cyan">1</span>
          <span className="cursor-not-allowed rounded-md border border-line px-2.5 py-1 text-xs text-faint opacity-60">
            Next →
          </span>
        </div>
      </div>
    </div>
  );
}

function Cite({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="kicker shrink-0 pt-0.5">{label}</dt>
      <dd className="nums text-right text-ink">{value}</dd>
    </div>
  );
}
