"use client";

/**
 * Lightweight, REPLACEABLE map shell. This is intentionally a schematic, not a
 * geographic map — markers are placed by linear interpolation inside Toronto's
 * bounding box purely to shape the UI. Swap this component for MapLibre/Leaflet
 * later without touching the surrounding page: it accepts the same incident
 * shape the real query will return.
 */

import { useState } from "react";
import { TORONTO_BOUNDS } from "@/lib/toronto";
import type { PreviewIncident } from "@/lib/mockIncidents";
import { PreviewBadge } from "@/components/ui/PreviewBadge";

interface MapPreviewProps {
  incidents: PreviewIncident[];
  nonMappableCount: number;
}

function project(lat: number, lng: number) {
  const { minLat, maxLat, minLng, maxLng } = TORONTO_BOUNDS;
  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
  return { x: Math.min(98, Math.max(2, x)), y: Math.min(96, Math.max(4, y)) };
}

export function MapPreview({ incidents, nonMappableCount }: MapPreviewProps) {
  const [selected, setSelected] = useState<PreviewIncident | null>(null);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="relative overflow-hidden rounded-xl border border-line bg-base">
        {/* Schematic canvas */}
        <div className="grid-overlay scanlines relative aspect-[16/10] w-full">
          {/* Sweep accent */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyan/[0.04] to-transparent animate-sweep" />

          {incidents.map((r) => {
            const { x, y } = project(r.lat, r.lng);
            const active = selected?.sourceRecordId === r.sourceRecordId;
            return (
              <button
                key={r.sourceRecordId}
                type="button"
                onClick={() => setSelected(r)}
                aria-label={`${r.offence} in ${r.neighbourhood158}`}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${
                  active
                    ? "h-3.5 w-3.5 bg-cyan ring-2 ring-cyan/50"
                    : "h-2 w-2 bg-red/80 hover:h-3 hover:w-3 hover:bg-red"
                }`}
              />
            );
          })}

          <div className="absolute left-3 top-3 flex items-center gap-2">
            <PreviewBadge label="Schematic preview · not a geographic map" />
          </div>

          <div className="absolute bottom-3 left-3 rounded-md border border-line bg-base/80 px-3 py-1.5 backdrop-blur">
            <span className="nums text-sm font-semibold text-cyan">
              {incidents.length.toLocaleString("en-CA")}
            </span>
            <span className="ml-1.5 text-xs text-muted">markers shown</span>
          </div>
        </div>

        <p className="border-t border-line px-3 py-2 text-[0.68rem] leading-relaxed text-amber">
          {nonMappableCount.toLocaleString("en-CA")} matching record(s) have 0,0
          coordinates and are excluded from map markers. They remain in the table
          and search results.
        </p>
      </div>

      {/* Detail drawer / count panel */}
      <aside className="rounded-xl border border-line bg-panel/50 p-4">
        {selected ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="kicker text-cyan">Selected record</span>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-faint hover:text-ink"
                aria-label="Close detail"
              >
                ×
              </button>
            </div>
            <h3 className="text-sm font-semibold text-ink">{selected.offence}</h3>
            <dl className="flex flex-col gap-1.5 text-xs">
              <DetailRow label="Occurrence" value={selected.occDate} />
              <DetailRow label="Neighbourhood" value={`${selected.hood158} · ${selected.neighbourhood158}`} />
              <DetailRow label="Division" value={selected.division} />
              <DetailRow label="Premises" value={selected.premisesType} />
              <DetailRow label="CSI category" value={selected.csiCategory} />
              <DetailRow label="Source record" value={`OBJECTID ${selected.sourceRecordId}`} />
              <DetailRow label="Event ID" value={selected.eventUniqueId} />
            </dl>
            <p className="rounded-md border border-amber/25 bg-amber/[0.06] px-2.5 py-2 text-[0.68rem] leading-relaxed text-amber">
              Preview record (synthetic). Real records will cite dataset, source
              URL, licence, and update date here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <span className="kicker">Map panel</span>
            <p className="text-xs leading-relaxed text-muted">
              Select a marker to inspect a record. Markers are neutral incident
              points — no danger colouring, heatmaps, or safety scoring.
            </p>
            <div className="rounded-md border border-line bg-base/60 p-3">
              <p className="kicker mb-1">Mappable</p>
              <p className="nums text-lg font-semibold text-cyan">
                {incidents.length.toLocaleString("en-CA")}
              </p>
            </div>
            <div className="rounded-md border border-line bg-base/60 p-3">
              <p className="kicker mb-1">Non-mappable (0,0)</p>
              <p className="nums text-lg font-semibold text-amber">
                {nonMappableCount.toLocaleString("en-CA")}
              </p>
            </div>
          </div>
        )}
      </aside>
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
