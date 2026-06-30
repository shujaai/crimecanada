/**
 * Shared explorer filter state, encoded in the URL so that map, table, and
 * search views stay in sync and any filtered view is shareable/reproducible.
 *
 * This is the single source of truth for the "reproducible URL" promised by
 * SourceReceipt. No free-text person search exists — filters are structured.
 */

export type Geocodable = "any" | "yes" | "no";

export interface ExplorerFilters {
  /** Dataset slugs (offence groups). Empty = all V1 datasets. */
  offence: string[];
  dateFrom?: string;
  dateTo?: string;
  /** Neighbourhood HOOD_158 code. */
  neighbourhood?: string;
  /** Division identifier, e.g. "D51". */
  division?: string;
  geocodable: Geocodable;
}

export const EMPTY_FILTERS: ExplorerFilters = {
  offence: [],
  geocodable: "any",
};

type SearchParamsInput =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

function getAll(input: SearchParamsInput, key: string): string[] {
  if (input instanceof URLSearchParams) {
    const joined = input.get(key);
    return joined ? joined.split(",").filter(Boolean) : [];
  }
  const v = input[key];
  if (Array.isArray(v)) return v.flatMap((s) => s.split(",")).filter(Boolean);
  if (typeof v === "string") return v.split(",").filter(Boolean);
  return [];
}

function getOne(input: SearchParamsInput, key: string): string | undefined {
  if (input instanceof URLSearchParams) return input.get(key) ?? undefined;
  const v = input[key];
  if (Array.isArray(v)) return v[0];
  return v;
}

/** Parse explorer filters from URL search params (server or client). */
export function parseFilters(input: SearchParamsInput): ExplorerFilters {
  const geoRaw = getOne(input, "geo");
  const geocodable: Geocodable =
    geoRaw === "yes" || geoRaw === "no" ? geoRaw : "any";

  return {
    offence: getAll(input, "offence"),
    dateFrom: getOne(input, "from"),
    dateTo: getOne(input, "to"),
    neighbourhood: getOne(input, "hood"),
    division: getOne(input, "div"),
    geocodable,
  };
}

/** Serialize filters into a query string (without leading "?"). */
export function toQueryString(filters: ExplorerFilters): string {
  const params = new URLSearchParams();
  if (filters.offence.length) params.set("offence", filters.offence.join(","));
  if (filters.dateFrom) params.set("from", filters.dateFrom);
  if (filters.dateTo) params.set("to", filters.dateTo);
  if (filters.neighbourhood) params.set("hood", filters.neighbourhood);
  if (filters.division) params.set("div", filters.division);
  if (filters.geocodable !== "any") params.set("geo", filters.geocodable);
  return params.toString();
}

/** Build a reproducible explorer URL for a given view. */
export function buildExplorerUrl(
  view: "map" | "table" | "search",
  filters: ExplorerFilters,
): string {
  const qs = toQueryString(filters);
  const base = `/toronto/${view}`;
  return qs ? `${base}?${qs}` : base;
}

/** Count how many filters are active (for the summary bar). */
export function activeFilterCount(filters: ExplorerFilters): number {
  let n = 0;
  if (filters.offence.length) n += 1;
  if (filters.dateFrom || filters.dateTo) n += 1;
  if (filters.neighbourhood) n += 1;
  if (filters.division) n += 1;
  if (filters.geocodable !== "any") n += 1;
  return n;
}

/** Human-readable summary chips for the active filter bar. */
export function describeFilters(filters: ExplorerFilters): string[] {
  const chips: string[] = [];
  if (filters.offence.length) chips.push(`${filters.offence.length} offence type(s)`);
  if (filters.dateFrom || filters.dateTo) {
    chips.push(`${filters.dateFrom ?? "…"} → ${filters.dateTo ?? "…"}`);
  }
  if (filters.neighbourhood) chips.push(`Neighbourhood ${filters.neighbourhood}`);
  if (filters.division) chips.push(`Division ${filters.division}`);
  if (filters.geocodable !== "any") {
    chips.push(filters.geocodable === "yes" ? "Mappable only" : "Non-mappable only");
  }
  return chips;
}
