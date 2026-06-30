/**
 * Applies ExplorerFilters to the synthetic preview incidents.
 *
 * This exists ONLY to make the preview UI feel alive. Every number it returns
 * is a preview value derived from synthetic data, never a live TPS statistic.
 * When real ingestion lands, this is replaced by a server-side DB query.
 */

import type { ExplorerFilters } from "./filters";
import { PREVIEW_INCIDENTS, type PreviewIncident } from "./mockIncidents";

export function filterPreviewIncidents(
  filters: ExplorerFilters,
  source: PreviewIncident[] = PREVIEW_INCIDENTS,
): PreviewIncident[] {
  return source.filter((r) => {
    if (filters.offence.length && !filters.offence.includes(r.datasetSlug)) {
      return false;
    }
    if (filters.dateFrom && r.occDate < filters.dateFrom) return false;
    if (filters.dateTo && r.occDate > filters.dateTo) return false;
    if (filters.neighbourhood && r.hood158 !== filters.neighbourhood) return false;
    if (filters.division && r.division !== filters.division) return false;
    if (filters.geocodable === "yes" && !r.mappable) return false;
    if (filters.geocodable === "no" && r.mappable) return false;
    return true;
  });
}

export interface PreviewSummary {
  total: number;
  mappable: number;
  nonMappable: number;
}

export function summarizePreview(rows: PreviewIncident[]): PreviewSummary {
  const mappable = rows.filter((r) => r.mappable).length;
  return {
    total: rows.length,
    mappable,
    nonMappable: rows.length - mappable,
  };
}
