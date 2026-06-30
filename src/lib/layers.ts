/**
 * The seven typed source layers of the Unified Source Foundation.
 * Drives the DataLayerStack component and the /data/layers concept route.
 *
 * Counts reflect the committed typed-source-layer plan
 * (docs/TPS_TYPED_SOURCE_LAYER_PLAN_2026-06-30.md).
 */

import type { TypedLayer } from "./datasets";

export type LayerStatus = "live" | "deferred" | "reference" | "future";

export interface LayerInfo {
  id: TypedLayer;
  label: string;
  status: LayerStatus;
  /** Number of TPS files classified into this layer in the 2026-06-30 corpus. */
  fileCount: number;
  blurb: string;
  /** Why this layer is or is not published in V1. */
  note: string;
}

export const TYPED_LAYERS: LayerInfo[] = [
  {
    id: "public_incident_records",
    label: "Public incident records",
    status: "live",
    fileCount: 8,
    blurb: "Standard geocoded incident open data for public search, table, and map.",
    note: "V1 publishes six Major Crime datasets from this layer. Two more (Bicycle Thefts, Major Crime Indicators) stay classified but unpublished.",
  },
  {
    id: "sensitive_incident_records",
    label: "Sensitive incident records",
    status: "deferred",
    fileCount: 7,
    blurb: "Incident data requiring additional legal or presentation review.",
    note: "Homicides, shootings, hate crime, IPV, mental-health apprehensions. Classified and preserved; not published in V1.",
  },
  {
    id: "traffic_ksi_records",
    label: "Traffic / KSI records",
    status: "deferred",
    fileCount: 9,
    blurb: "Traffic collisions and Killed-or-Seriously-Injured participant records.",
    note: "Distinct 54-column participant schema; not merged into the incident layer.",
  },
  {
    id: "calls_for_service_crisis_records",
    label: "Crisis calls for service",
    status: "deferred",
    fileCount: 1,
    blurb: "Crisis and mental-health-related calls-for-service records.",
    note: "Uses EVENT_ID, no WGS84 coordinates; separate crisis domain.",
  },
  {
    id: "aggregate_metric_tables",
    label: "Aggregate metric tables",
    status: "deferred",
    fileCount: 46,
    blurb: "Annual reports, budgets, FIRS, RBDC, and count/summary tables.",
    note: "Summary counts, not event-level geocoded incidents; not suitable for the map/table explorer.",
  },
  {
    id: "reference_geography_datasets",
    label: "Reference geography",
    status: "reference",
    fileCount: 3,
    blurb: "Division boundaries, patrol zones, and facilities.",
    note: "Reference geometry that may support future map context, not incident records.",
  },
  {
    id: "future_article_context_links",
    label: "External article context",
    status: "future",
    fileCount: 0,
    blurb: "Future CrimeInToronto article or micro-data links — kept separate from official data.",
    note: "0 article records today. Would enter via external_context_links with explicit provenance, never blended into TPS records.",
  },
];

export const LAYER_STATUS_LABEL: Record<LayerStatus, string> = {
  live: "Live in V1",
  deferred: "Classified · deferred",
  reference: "Reference only",
  future: "Future · separate layer",
};
