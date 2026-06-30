"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import type { ExplorerFilters } from "@/lib/filters";
import { buildExplorerUrl } from "@/lib/filters";
import type { TorontoIncident } from "@/lib/tps";
import { getDatasetBySlug } from "@/lib/datasets";

interface DataTableProps {
  incidents: TorontoIncident[];
  filters: ExplorerFilters;
  total: number;
  page: number;
  pageCount: number;
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

export function DataTable({ incidents, filters, total, page, pageCount }: DataTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-panel/40">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-panel/60 px-4 py-2.5">
        <span className="kicker">Records</span>
        <span className="nums text-xs text-muted">
          {total.toLocaleString("en-CA")} match · showing {incidents.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              {COLUMNS.map((column) => (
                <th key={column} className="kicker whitespace-nowrap px-4 py-2.5 font-medium">
                  {column}
                </th>
              ))}
              <th className="px-4 py-2.5" aria-label="Expand" />
            </tr>
          </thead>
          <tbody>
            {incidents.map((record) => {
              const dataset = getDatasetBySlug(record.datasetSlug);
              const open = expanded === record.recordKey;
              return (
                <Fragment key={record.recordKey}>
                  <tr
                    className={`cursor-pointer border-b border-line/50 transition-colors hover:bg-cyan/[0.04] ${
                      open ? "bg-cyan/[0.04]" : ""
                    }`}
                    onClick={() => setExpanded(open ? null : record.recordKey)}
                  >
                    <td className="nums whitespace-nowrap px-4 py-2.5 text-muted">
                      {record.occDate || "Unknown"}
                    </td>
                    <td className="px-4 py-2.5 text-ink">{record.offence}</td>
                    <td className="px-4 py-2.5 text-muted">
                      <span className="nums text-faint">{record.hood158}</span>{" "}
                      {record.neighbourhood158}
                    </td>
                    <td className="nums px-4 py-2.5 text-muted">{record.division}</td>
                    <td className="px-4 py-2.5 text-muted">{record.premisesType}</td>
                    <td className="px-4 py-2.5 text-faint">
                      {dataset?.name ?? record.datasetSlug}
                    </td>
                    <td className="nums px-4 py-2.5 text-faint">#{record.sourceRecordId}</td>
                    <td className="px-2 py-2.5 text-center text-faint">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setExpanded(open ? null : record.recordKey);
                        }}
                        className="rounded px-2 py-1 hover:bg-cyan/10 hover:text-cyan"
                        aria-label={`Toggle source details for ${record.recordKey}`}
                      >
                        {open ? "−" : "+"}
                      </button>
                    </td>
                  </tr>
                  {open ? (
                    <tr className="border-b border-line/50 bg-base/50">
                      <td colSpan={8} className="px-4 py-3">
                        <p className="kicker mb-2 text-amber">Source citation</p>
                        <dl className="grid gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2">
                          <Cite label="Dataset" value={dataset?.name ?? record.datasetSlug} />
                          <Cite label="Source agency" value={dataset?.sourceName ?? "Toronto Police Service"} />
                          <Cite label="TPS update date" value={dataset?.datasetUpdateDate ?? "Not provided"} />
                          <Cite label="Ingested" value={dataset?.ingestionDate ?? "2026-06-30"} />
                          <Cite label="OBJECTID (source_record_id)" value={record.sourceRecordId} />
                          <Cite label="EVENT_UNIQUE_ID" value={record.eventUniqueId} />
                          <Cite label="Primary neighbourhood" value={`${record.hood158} · ${record.neighbourhood158}`} />
                          <Cite label="Legacy neighbourhood" value={`${record.hood140} · ${record.neighbourhood140}`} />
                          <Cite label="CSI category" value={record.csiCategory} />
                          <Cite
                            label="Coordinates"
                            value={record.mappable ? `${record.lat}, ${record.lng}` : "0, 0 (non-mappable)"}
                          />
                        </dl>
                        <details className="mt-3 rounded-md border border-line bg-panel/40 px-3 py-2">
                          <summary className="cursor-pointer text-xs text-cyan">
                            Original TPS fields (source_fields_json)
                          </summary>
                          <dl className="mt-2 grid gap-x-5 gap-y-1 text-[0.68rem] sm:grid-cols-2">
                            {Object.entries(record.sourceFieldsJson).map(([field, value]) => (
                              <Cite key={field} label={field} value={value || "—"} />
                            ))}
                          </dl>
                        </details>
                        <p className="mt-2 text-[0.68rem] text-faint">
                          Official TPS open-data row. No suspect or victim names, mugshots,
                          or profiles are stored or displayed.
                        </p>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
            {!incidents.length ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted">
                  No records match this page and filter combination.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
        <span className="nums text-xs text-faint">
          Page {page.toLocaleString("en-CA")} of {pageCount.toLocaleString("en-CA")}
        </span>
        <div className="flex items-center gap-1.5">
          {page > 1 ? (
            <Link
              href={buildExplorerUrl("table", filters, { page: page - 1 })}
              className="rounded-md border border-line px-2.5 py-1 text-xs text-muted hover:border-cyan/30 hover:text-ink"
            >
              ← Prev
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-md border border-line px-2.5 py-1 text-xs text-faint opacity-60">
              ← Prev
            </span>
          )}
          <span className="rounded-md border border-cyan/40 bg-cyan/10 px-2.5 py-1 text-xs text-cyan">
            {page}
          </span>
          {page < pageCount ? (
            <Link
              href={buildExplorerUrl("table", filters, { page: page + 1 })}
              className="rounded-md border border-line px-2.5 py-1 text-xs text-muted hover:border-cyan/30 hover:text-ink"
            >
              Next →
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-md border border-line px-2.5 py-1 text-xs text-faint opacity-60">
              Next →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Cite({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="kicker shrink-0 pt-0.5">{label}</dt>
      <dd className="nums break-all text-right text-ink">{value}</dd>
    </div>
  );
}
