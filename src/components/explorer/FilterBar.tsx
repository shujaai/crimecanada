"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  type ExplorerFilters,
  type Geocodable,
  buildExplorerUrl,
  describeFilters,
  activeFilterCount,
  EMPTY_FILTERS,
  toQueryString,
} from "@/lib/filters";
import { OFFENCE_GROUPS } from "@/lib/toronto";
import type { TorontoFacets } from "@/lib/tps";

interface FilterBarProps {
  initial: ExplorerFilters;
  /**
   * "live" pushes filter changes to the current view URL immediately.
   * "builder" stages changes locally and exposes Open-in-Map/Table actions.
   */
  mode?: "live" | "builder";
  /** The current view, used for "live" mode URL updates. */
  view?: "map" | "table" | "search";
  matchingCount: number;
  facets: TorontoFacets;
}

const GEO_OPTIONS: { value: Geocodable; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "yes", label: "Mappable" },
  { value: "no", label: "Non-mappable" },
];

export function FilterBar({
  initial,
  matchingCount,
  facets,
  mode = "builder",
  view = "search",
}: FilterBarProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<ExplorerFilters>(initial);
  const hasStagedChanges = toQueryString(filters) !== toQueryString(initial);

  function update(next: ExplorerFilters) {
    setFilters(next);
    if (mode === "live") {
      router.replace(buildExplorerUrl(view, next), { scroll: false });
    }
  }

  function toggleOffence(slug: string) {
    const has = filters.offence.includes(slug);
    update({
      ...filters,
      offence: has
        ? filters.offence.filter((s) => s !== slug)
        : [...filters.offence, slug],
    });
  }

  const chips = describeFilters(filters);

  return (
    <div className="flex flex-col gap-5">
      {/* Offence multi-select */}
      <fieldset className="flex flex-col gap-2">
        <legend className="kicker mb-1">Offence type</legend>
        <div className="flex flex-wrap gap-2">
          {OFFENCE_GROUPS.map((g) => {
            const on = filters.offence.includes(g.datasetSlug);
            return (
              <button
                key={g.datasetSlug}
                type="button"
                onClick={() => toggleOffence(g.datasetSlug)}
                aria-pressed={on}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  on
                    ? "border-cyan/50 bg-cyan/15 text-cyan"
                    : "border-line bg-panel-2 text-muted hover:border-cyan/30 hover:text-ink"
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Date range */}
        <fieldset className="flex flex-col gap-2">
          <legend className="kicker mb-1">Occurrence date</legend>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.dateFrom ?? ""}
              onChange={(e) => update({ ...filters, dateFrom: e.target.value || undefined })}
              className="nums w-full rounded-md border border-line bg-base px-2 py-1.5 text-sm text-ink outline-none focus:border-cyan/50"
              aria-label="From date"
            />
            <span className="text-faint">→</span>
            <input
              type="date"
              value={filters.dateTo ?? ""}
              onChange={(e) => update({ ...filters, dateTo: e.target.value || undefined })}
              className="nums w-full rounded-md border border-line bg-base px-2 py-1.5 text-sm text-ink outline-none focus:border-cyan/50"
              aria-label="To date"
            />
          </div>
        </fieldset>

        {/* Geocodable */}
        <fieldset className="flex flex-col gap-2">
          <legend className="kicker mb-1">Mappable</legend>
          <div className="inline-flex overflow-hidden rounded-md border border-line">
            {GEO_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ ...filters, geocodable: opt.value })}
                className={`px-3 py-1.5 text-xs transition-colors ${
                  filters.geocodable === opt.value
                    ? "bg-cyan/15 text-cyan"
                    : "bg-base text-muted hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Neighbourhood */}
        <fieldset className="flex flex-col gap-2">
          <legend className="kicker mb-1">Neighbourhood</legend>
          <select
            value={filters.neighbourhood ?? ""}
            onChange={(e) => update({ ...filters, neighbourhood: e.target.value || undefined })}
            className="w-full rounded-md border border-line bg-base px-2 py-1.5 text-sm text-ink outline-none focus:border-cyan/50"
          >
            <option value="">All neighbourhoods</option>
            {facets.neighbourhoods.map((n) => (
              <option key={n.code} value={n.code}>
                {n.code} · {n.name}
              </option>
            ))}
          </select>
        </fieldset>

        {/* Division */}
        <fieldset className="flex flex-col gap-2">
          <legend className="kicker mb-1">Police division</legend>
          <select
            value={filters.division ?? ""}
            onChange={(e) => update({ ...filters, division: e.target.value || undefined })}
            className="w-full rounded-md border border-line bg-base px-2 py-1.5 text-sm text-ink outline-none focus:border-cyan/50"
          >
            <option value="">All divisions</option>
            {facets.divisions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </fieldset>
      </div>

      {/* Exact current result count + actions */}
      <div className="flex flex-col gap-3 border-t border-line pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Matching real records:</span>
          <span className="nums text-sm font-semibold text-cyan">
            {matchingCount.toLocaleString("en-CA")}
          </span>
          {mode === "builder" && hasStagedChanges ? (
            <span className="text-xs text-faint">recounts when a view opens</span>
          ) : null}
          {activeFilterCount(filters) > 0 ? (
            <button
              type="button"
              onClick={() => update({ ...EMPTY_FILTERS })}
              className="ml-auto text-xs text-faint underline-offset-2 hover:text-ink hover:underline"
            >
              Clear all
            </button>
          ) : null}
        </div>

        {chips.length ? (
          <div className="flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <span
                key={c}
                className="rounded border border-line bg-panel-2 px-2 py-0.5 text-[0.68rem] text-muted"
              >
                {c}
              </span>
            ))}
          </div>
        ) : null}

        {mode === "builder" ? (
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildExplorerUrl("map", filters)}
              className="rounded-md border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan transition-colors hover:bg-cyan/20"
            >
              Open in map
            </Link>
            <Link
              href={buildExplorerUrl("table", filters)}
              className="rounded-md border border-line bg-panel-2 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-cyan/30"
            >
              Open in table
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
