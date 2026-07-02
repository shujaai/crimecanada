import type { ReactNode } from "react";
import Link from "next/link";
import {
  type ExplorerFilters,
  buildExplorerUrl,
  describeFilters,
  activeFilterCount,
  toQueryString,
} from "@/lib/filters";
import { StatusChip } from "@/components/ui/StatusChip";
import { ResearcherModeToggle } from "@/components/explorer/ResearcherModeToggle";

type View = "map" | "table" | "search" | "ask";

const VIEWS: { id: View; label: string }[] = [
  { id: "map", label: "Map" },
  { id: "table", label: "Table" },
  { id: "search", label: "Search" },
  { id: "ask", label: "Ask" },
];

/**
 * Ask does not use the same query-string shape as map/table/search (it reads
 * a plain-language "q" param, not offence/date/etc.), so it needs its own
 * link builder. This only composes a URL string — it does not touch
 * lib/filters.ts or any parsing/query semantics.
 */
function buildViewUrl(view: View, filters: ExplorerFilters): string {
  if (view === "ask") {
    const qs = toQueryString(filters);
    return qs ? `/toronto/ask?${qs}` : "/toronto/ask";
  }
  return buildExplorerUrl(view, filters);
}

interface ExplorerShellProps {
  view: View;
  filters: ExplorerFilters;
  children: ReactNode;
  /** Optional right-aligned slot in the toolbar (e.g. record count). */
  toolbar?: ReactNode;
}

export function ExplorerShell({ view, filters, children, toolbar }: ExplorerShellProps) {
  const chips = describeFilters(filters);
  const count = activeFilterCount(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex overflow-hidden rounded-lg border border-line bg-panel/60">
            {VIEWS.map((v) => (
              <Link
                key={v.id}
                href={buildViewUrl(v.id, filters)}
                aria-current={v.id === view ? "page" : undefined}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  v.id === view
                    ? "bg-cyan/15 text-cyan"
                    : "text-muted hover:text-ink"
                }`}
              >
                {v.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ResearcherModeToggle />
            {toolbar}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="kicker">Active filters</span>
          {count === 0 ? (
            <StatusChip tone="neutral">All V1 records</StatusChip>
          ) : (
            chips.map((c) => (
              <StatusChip key={c} tone="cyan" dot>
                {c}
              </StatusChip>
            ))
          )}
          {count > 0 ? (
            <Link
              href={buildViewUrl(view, { offence: [], geocodable: "any" })}
              className="text-xs text-faint underline-offset-2 hover:text-ink hover:underline"
            >
              reset
            </Link>
          ) : null}
        </div>
      </div>

      {children}
    </div>
  );
}
