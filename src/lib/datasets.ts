/**
 * Dataset metadata for CrimeCanada.io.
 *
 * Row counts and non-mappable (0,0 coordinate) counts are FACTUAL, taken from
 * the committed structural inventory (docs/TPS_RAW_DATA_INVENTORY_2026-06-30.md).
 *
 * The six V1 dataset counts are verified against the local 2026-06-30 ingest.
 * TPS update dates are not present in these CSVs and are reported as unavailable.
 */

export type TypedLayer =
  | "public_incident_records"
  | "sensitive_incident_records"
  | "traffic_ksi_records"
  | "calls_for_service_crisis_records"
  | "aggregate_metric_tables"
  | "reference_geography_datasets"
  | "future_article_context_links";

export type PublishStatus = "v1_published" | "deferred" | "reference_only";

export type ProvenanceStatus = "to_be_confirmed" | "verified";

export interface DatasetMeta {
  slug: string;
  name: string;
  layer: TypedLayer;
  publishStatus: PublishStatus;
  /** Factual row count from inventory (excludes header). */
  rowCount: number;
  /** Factual count of rows with 0,0 coordinates (excluded from map markers only). */
  nonMappableCount?: number;
  schemaColumns?: number;
  sourceName: string;
  sourceUrl: string;
  licenceName: string;
  licenceUrl: string;
  /** Placeholder until ingestion; see provenanceStatus. */
  datasetUpdateDate: string;
  /** Placeholder until ingestion; see provenanceStatus. */
  ingestionDate: string;
  provenanceStatus: ProvenanceStatus;
  /** Short reason a dataset is deferred from V1 public UI. */
  deferredReason?: string;
}

const TPS_PORTAL = "https://data.torontopolice.on.ca/";
const OGL_NAME = "Open Government Licence – Toronto Police Service";
const OGL_URL = "https://data.torontopolice.on.ca/pages/open-data-licence";

/** Common defaults for TPS datasets (placeholder provenance). */
function tps(meta: Omit<DatasetMeta, "sourceName" | "sourceUrl" | "licenceName" | "licenceUrl" | "datasetUpdateDate" | "ingestionDate" | "provenanceStatus"> & Partial<DatasetMeta>): DatasetMeta {
  const ingested = meta.publishStatus === "v1_published";
  return {
    sourceName: "Toronto Police Service Public Safety Data Portal",
    sourceUrl: TPS_PORTAL,
    licenceName: OGL_NAME,
    licenceUrl: OGL_URL,
    datasetUpdateDate: ingested ? "Not provided in local CSV" : "Pending ingestion",
    ingestionDate: ingested ? "2026-06-30" : "Pending ingestion",
    provenanceStatus: ingested ? "verified" : "to_be_confirmed",
    ...meta,
  };
}

/**
 * The six V1-published Major Crime Open Data datasets (31-column family).
 * These are the only datasets with publishStatus "v1_published".
 */
export const V1_DATASETS: DatasetMeta[] = [
  tps({
    slug: "assault-open-data",
    name: "Assault Open Data",
    layer: "public_incident_records",
    publishStatus: "v1_published",
    rowCount: 254378,
    nonMappableCount: 4125,
    schemaColumns: 31,
  }),
  tps({
    slug: "auto-theft-open-data",
    name: "Auto Theft Open Data",
    layer: "public_incident_records",
    publishStatus: "v1_published",
    rowCount: 78714,
    nonMappableCount: 858,
    schemaColumns: 31,
  }),
  tps({
    slug: "break-and-enter-open-data",
    name: "Break and Enter Open Data",
    layer: "public_incident_records",
    publishStatus: "v1_published",
    rowCount: 84689,
    nonMappableCount: 569,
    schemaColumns: 31,
  }),
  tps({
    slug: "robbery-open-data",
    name: "Robbery Open Data",
    layer: "public_incident_records",
    publishStatus: "v1_published",
    rowCount: 40248,
    nonMappableCount: 1105,
    schemaColumns: 31,
  }),
  tps({
    slug: "theft-from-motor-vehicle-open-data",
    name: "Theft From Motor Vehicle Open Data",
    layer: "public_incident_records",
    publishStatus: "v1_published",
    rowCount: 106574,
    nonMappableCount: 1250,
    schemaColumns: 31,
  }),
  tps({
    slug: "theft-over-open-data",
    name: "Theft Over Open Data",
    layer: "public_incident_records",
    publishStatus: "v1_published",
    rowCount: 16790,
    nonMappableCount: 295,
    schemaColumns: 31,
  }),
];

/**
 * Representative deferred-but-classified TPS datasets, grouped for the
 * /data/sources transparency page. This is a curated subset of the full
 * 74-file corpus (see TOTAL_CORPUS_FILES); the inventory remains the
 * authoritative list.
 */
export const DEFERRED_DATASETS: DatasetMeta[] = [
  tps({
    slug: "homicides-open-data",
    name: "Homicides Open Data",
    layer: "sensitive_incident_records",
    publishStatus: "deferred",
    rowCount: 1531,
    schemaColumns: undefined,
    deferredReason: "Higher sensitivity; additional legal and presentation review required before public release.",
  }),
  tps({
    slug: "shooting-and-firearm-discharges-open-data",
    name: "Shooting and Firearm Discharges Open Data",
    layer: "sensitive_incident_records",
    publishStatus: "deferred",
    deferredReason: "Sensitive firearm-discharge incidents; deferred pending legal review.",
    rowCount: 0,
  }),
  tps({
    slug: "hate-crime-open-data",
    name: "Hate Crime Open Data",
    layer: "sensitive_incident_records",
    publishStatus: "deferred",
    rowCount: 2041,
    deferredReason: "Sensitive incident data; legal/presentation review required; no WGS84 in source.",
  }),
  tps({
    slug: "intimate-partner-and-family-violence-open-data",
    name: "Intimate Partner and Family Violence Open Data",
    layer: "sensitive_incident_records",
    publishStatus: "deferred",
    rowCount: 190723,
    deferredReason: "Sensitive domestic/family violence data; no WGS84; presentation review required.",
  }),
  tps({
    slug: "mental-health-act-apprehensions-open-data",
    name: "Mental Health Act Apprehensions Open Data",
    layer: "sensitive_incident_records",
    publishStatus: "deferred",
    rowCount: 134457,
    deferredReason: "Sensitive mental-health apprehension incidents; no WGS84 coordinates.",
  }),
  tps({
    slug: "bicycle-thefts-open-data",
    name: "Bicycle Thefts Open Data",
    layer: "public_incident_records",
    publishStatus: "deferred",
    rowCount: 39969,
    deferredReason: "Shares the 31-column schema but deferred from V1 pending layer-assignment decision.",
  }),
  tps({
    slug: "traffic-collisions-open-data",
    name: "Traffic Collisions Open Data",
    layer: "traffic_ksi_records",
    publishStatus: "deferred",
    rowCount: 809034,
    deferredReason: "Participant/collision schema distinct from incident layer; large volume with many 0,0 rows.",
  }),
  tps({
    slug: "total-ksi",
    name: "Total KSI (Killed or Seriously Injured)",
    layer: "traffic_ksi_records",
    publishStatus: "deferred",
    rowCount: 0,
    deferredReason: "54-column KSI participant-level collision records; distinct traffic layer.",
  }),
  tps({
    slug: "persons-in-crisis-calls-for-service-attended-open-data",
    name: "Persons in Crisis Calls for Service Attended Open Data",
    layer: "calls_for_service_crisis_records",
    publishStatus: "deferred",
    rowCount: 357697,
    deferredReason: "Crisis calls-for-service domain; uses EVENT_ID; no WGS84 in source.",
  }),
  tps({
    slug: "neighbourhood-crime-rates-open-data",
    name: "Neighbourhood Crime Rates Open Data",
    layer: "aggregate_metric_tables",
    publishStatus: "deferred",
    rowCount: 158,
    deferredReason: "222-column neighbourhood rate matrix; summary metrics, not event-level incidents.",
  }),
  tps({
    slug: "reported-crimes-asr-rc-tbl-001",
    name: "Reported Crimes (ASR RC TBL 001)",
    layer: "aggregate_metric_tables",
    publishStatus: "deferred",
    rowCount: 0,
    deferredReason: "Annual count summary by category/year; not incident-level open data.",
  }),
  tps({
    slug: "tps-police-divisions",
    name: "TPS Police Divisions",
    layer: "reference_geography_datasets",
    publishStatus: "reference_only",
    rowCount: 16,
    deferredReason: "Division boundary/reference geometry; supports future map context, not incident data.",
  }),
  tps({
    slug: "patrol-zone",
    name: "Patrol Zone",
    layer: "reference_geography_datasets",
    publishStatus: "reference_only",
    rowCount: 76,
    deferredReason: "Patrol zone reference geometry for future map context.",
  }),
  tps({
    slug: "police-facilities",
    name: "Police Facilities",
    layer: "reference_geography_datasets",
    publishStatus: "reference_only",
    rowCount: 26,
    deferredReason: "Facility locations; reference layer for future map context.",
  }),
];

/** Authoritative corpus size (see typed source layer plan). */
export const TOTAL_CORPUS_FILES = 74;

/** Sum of factual V1 row counts. */
export const V1_TOTAL_RECORDS = V1_DATASETS.reduce((s, d) => s + d.rowCount, 0);

/** Sum of factual V1 non-mappable (0,0) rows. */
export const V1_NON_MAPPABLE_RECORDS = V1_DATASETS.reduce(
  (s, d) => s + (d.nonMappableCount ?? 0),
  0,
);

export function getDatasetBySlug(slug: string): DatasetMeta | undefined {
  return [...V1_DATASETS, ...DEFERRED_DATASETS].find((d) => d.slug === slug);
}

export function getV1DatasetsBySlug(slugs: string[]): DatasetMeta[] {
  if (!slugs.length) return V1_DATASETS;
  const selected = new Set(slugs);
  return V1_DATASETS.filter((dataset) => selected.has(dataset.slug));
}

/** Human-readable label for a typed layer. */
export const LAYER_LABELS: Record<TypedLayer, string> = {
  public_incident_records: "Public incident records",
  sensitive_incident_records: "Sensitive incident records",
  traffic_ksi_records: "Traffic / KSI records",
  calls_for_service_crisis_records: "Crisis calls for service",
  aggregate_metric_tables: "Aggregate metric tables",
  reference_geography_datasets: "Reference geography",
  future_article_context_links: "External article context",
};
