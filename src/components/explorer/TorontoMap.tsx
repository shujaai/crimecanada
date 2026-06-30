"use client";

import { useState } from "react";
import { TORONTO_BOUNDS } from "@/lib/toronto";
import type { TorontoMapIncident } from "@/lib/tps";
import { getDatasetBySlug } from "@/lib/datasets";

interface TorontoMapProps {
  incidents: TorontoMapIncident[];
  totalMappableCount: number;
  nonMappableCount: number;
  mapLimit: number;
}

function project(lat: number, lng: number) {
  const { minLat, maxLat, minLng, maxLng } = TORONTO_BOUNDS;
  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
  return { x: Math.min(98, Math.max(2, x)), y: Math.min(96, Math.max(4, y)) };
}

export function TorontoMap({
  incidents,
  totalMappableCount,
  nonMappableCount,
  mapLimit,
}: TorontoMapProps) {
  const [selected, setSelected] = useState<TorontoMapIncident | null>(null);
  const sampled = totalMappableCount > incidents.length;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="relative overflow-hidden rounded-xl border border-line bg-base">
        <div className="grid-overlay scanlines relative aspect-[16/10] w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyan/[0.04] to-transparent animate-sweep" />

          {incidents.map((record) => {
            const { x, y } = project(record.lat, record.lng);
            const active = selected?.recordKey === record.recordKey;
            return (
              <button
                key={record.recordKey}
                type="button"
                onClick={() => setSelected(record)}
                aria-label={`${record.offence} in ${record.neighbourhood158}`}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${
                  active
                    ? "h-3.5 w-3.5 bg-amber ring-2 ring-amber/50"
                    : "h-2 w-2 bg-cyan/65 hover:h-3 hover:w-3 hover:bg-cyan"
                }`}
              />
            );
          })}

          <div className="absolute left-3 top-3 rounded-md border border-cyan/30 bg-base/85 px-3 py-1.5 text-[0.68rem] text-cyan backdrop-blur">
            Real TPS WGS84 coordinates
          </div>

          <div className="absolute bottom-3 left-3 rounded-md border border-line bg-base/80 px-3 py-1.5 backdrop-blur">
            <span className="nums text-sm font-semibold text-cyan">
              {incidents.length.toLocaleString("en-CA")}
            </span>
            <span className="ml-1.5 text-xs text-muted">
              {sampled ? `sampled markers (limit ${mapLimit.toLocaleString("en-CA")})` : "markers shown"}
            </span>
          </div>
        </div>

        <p className="border-t border-line px-3 py-2 text-[0.68rem] leading-relaxed text-amber">
          {nonMappableCount.toLocaleString("en-CA")} matching record(s) have 0,0
          coordinates and are excluded from markers only. They remain in table and search.
          {sampled
            ? ` The canvas shows a deterministic ${incidents.length.toLocaleString("en-CA")}-record sample of ${totalMappableCount.toLocaleString("en-CA")} matching mappable records.`
            : ""}
        </p>
      </div>

      <aside className="rounded-xl border border-line bg-panel/50 p-4">
        {selected ? (
          <SelectedRecord record={selected} onClose={() => setSelected(null)} />
        ) : (
          <div className="flex flex-col gap-3">
            <span className="kicker">Map panel</span>
            <p className="text-xs leading-relaxed text-muted">
              Select a neutral marker to inspect a real TPS record. The lightweight
              canvas projects source WGS84 coordinates inside Toronto bounds.
            </p>
            <Metric label="Matching mappable" value={totalMappableCount} tone="cyan" />
            <Metric label="Markers rendered" value={incidents.length} tone="cyan" />
            <Metric label="Non-mappable (0,0)" value={nonMappableCount} tone="amber" />
          </div>
        )}
      </aside>
    </div>
  );
}

function SelectedRecord({
  record,
  onClose,
}: {
  record: TorontoMapIncident;
  onClose: () => void;
}) {
  const dataset = getDatasetBySlug(record.datasetSlug);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="kicker text-cyan">Selected record</span>
        <button type="button" onClick={onClose} className="text-faint hover:text-ink" aria-label="Close detail">
          ×
        </button>
      </div>
      <h3 className="text-sm font-semibold text-ink">{record.offence}</h3>
      <dl className="flex flex-col gap-1.5 text-xs">
        <DetailRow label="Occurrence" value={record.occDate || "Unknown"} />
        <DetailRow label="Neighbourhood" value={`${record.hood158} · ${record.neighbourhood158}`} />
        <DetailRow label="Division" value={record.division} />
        <DetailRow label="Premises" value={record.premisesType} />
        <DetailRow label="Dataset" value={dataset?.name ?? record.datasetSlug} />
        <DetailRow label="Source record" value={`OBJECTID ${record.sourceRecordId}`} />
        <DetailRow label="Event ID" value={record.eventUniqueId} />
        <DetailRow label="Coordinates" value={`${record.lat}, ${record.lng}`} />
      </dl>
      <p className="rounded-md border border-amber/25 bg-amber/[0.06] px-2.5 py-2 text-[0.68rem] leading-relaxed text-amber">
        Official TPS open-data record, ingested 2026-06-30. EVENT_UNIQUE_ID is
        stored for provenance and is not used for deduplication.
      </p>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "cyan" | "amber" }) {
  return (
    <div className="rounded-md border border-line bg-base/60 p-3">
      <p className="kicker mb-1">{label}</p>
      <p className={`nums text-lg font-semibold ${tone === "cyan" ? "text-cyan" : "text-amber"}`}>
        {value.toLocaleString("en-CA")}
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="kicker shrink-0 pt-0.5">{label}</dt>
      <dd className="nums text-right text-ink">{value}</dd>
    </div>
  );
}
