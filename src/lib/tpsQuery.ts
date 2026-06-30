import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ExplorerFilters } from "./filters";
import type {
  TorontoFacets,
  TorontoIncident,
  TorontoMapIncident,
  TorontoQueryResult,
  TpsProcessedManifest,
} from "./tps";

const PROCESSED_DIR = path.join(process.cwd(), "data", "processed", "tps", "v1");
const MANIFEST_PATH = path.join(PROCESSED_DIR, "manifest.json");
const DEFAULT_PAGE_SIZE = 25;
export const DEFAULT_MAP_LIMIT = 2_000;

type SqlValue = string | number | null;

interface SqliteStatement {
  all(...params: SqlValue[]): Record<string, unknown>[];
  get(...params: SqlValue[]): Record<string, unknown> | undefined;
}

interface SqliteDatabase {
  prepare(sql: string): SqliteStatement;
}

interface SqliteModule {
  DatabaseSync: new (
    location: string,
    options?: { readOnly?: boolean },
  ) => SqliteDatabase;
}

interface IncidentRow extends Record<string, unknown> {
  record_key: string;
  source_record_id: string;
  event_unique_id: string;
  dataset_slug: string;
  report_date: string;
  occ_date: string;
  occ_year: number;
  occ_month: string;
  occ_dow: string;
  occ_hour: number;
  division: string;
  location_type: string;
  premises_type: string;
  offence: string;
  csi_category: string;
  hood_158: string;
  neighbourhood_158: string;
  hood_140: string;
  neighbourhood_140: string;
  lat: number;
  lng: number;
  mappable: number;
  source_fields_json: string;
}

let manifestPromise: Promise<TpsProcessedManifest> | undefined;
let database: SqliteDatabase | undefined;

function missingDataError(error: unknown): Error {
  const detail = error instanceof Error ? ` (${error.message})` : "";
  return new Error(
    `TPS V1 processed data is unavailable${detail}. Run: node scripts/process-tps-v1.mjs`,
  );
}

async function loadManifest(): Promise<TpsProcessedManifest> {
  if (!manifestPromise) {
    manifestPromise = readFile(MANIFEST_PATH, "utf8")
      .then((content) => JSON.parse(content) as TpsProcessedManifest)
      .then((manifest) => {
        if (
          manifest.schemaVersion !== 1
          || manifest.datasets.length !== 6
          || manifest.totalRows !== 581_393
          || manifest.nonMappableRows !== 8_202
          || !manifest.databaseFile
        ) {
          throw new Error("manifest validation failed");
        }
        return manifest;
      })
      .catch((error) => {
        manifestPromise = undefined;
        throw missingDataError(error);
      });
  }
  return manifestPromise;
}

function getDatabase(databaseFile: string): SqliteDatabase {
  if (!database) {
    try {
      const nodeProcess = process as NodeJS.Process & {
        getBuiltinModule(id: string): unknown;
      };
      const { DatabaseSync } = nodeProcess.getBuiltinModule("node:sqlite") as SqliteModule;
      database = new DatabaseSync(path.join(PROCESSED_DIR, databaseFile), {
        readOnly: true,
      });
    } catch (error) {
      throw missingDataError(error);
    }
  }
  return database;
}

export async function getTorontoFacets(): Promise<TorontoFacets> {
  const manifest = await loadManifest();
  return manifest.facets;
}

export async function getTpsProcessedManifest(): Promise<TpsProcessedManifest> {
  return loadManifest();
}

function buildWhere(
  filters: ExplorerFilters,
  validDatasetSlugs: string[],
): { sql: string; params: SqlValue[] } {
  const clauses: string[] = [];
  const params: SqlValue[] = [];

  if (filters.offence.length) {
    const requested = new Set(filters.offence);
    const selected = validDatasetSlugs.filter((slug) => requested.has(slug));
    if (!selected.length) {
      clauses.push("1 = 0");
    } else {
      clauses.push(`dataset_slug IN (${selected.map(() => "?").join(", ")})`);
      params.push(...selected);
    }
  }
  if (filters.dateFrom) {
    clauses.push("occ_date >= ?");
    params.push(filters.dateFrom);
  }
  if (filters.dateTo) {
    clauses.push("occ_date <= ?");
    params.push(filters.dateTo);
  }
  if (filters.neighbourhood) {
    clauses.push("hood_158 = ?");
    params.push(filters.neighbourhood);
  }
  if (filters.division) {
    clauses.push("division = ?");
    params.push(filters.division);
  }
  if (filters.geocodable !== "any") {
    clauses.push("mappable = ?");
    params.push(filters.geocodable === "yes" ? 1 : 0);
  }

  return {
    sql: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}

function toIncident(row: IncidentRow): TorontoIncident {
  return {
    recordKey: row.record_key,
    sourceRecordId: row.source_record_id,
    eventUniqueId: row.event_unique_id,
    datasetSlug: row.dataset_slug,
    reportDate: row.report_date,
    occDate: row.occ_date,
    occYear: row.occ_year,
    occMonth: row.occ_month,
    occDow: row.occ_dow,
    occHour: row.occ_hour,
    division: row.division,
    locationType: row.location_type,
    premisesType: row.premises_type,
    offence: row.offence,
    csiCategory: row.csi_category,
    hood158: row.hood_158,
    neighbourhood158: row.neighbourhood_158,
    hood140: row.hood_140,
    neighbourhood140: row.neighbourhood_140,
    lat: row.lat,
    lng: row.lng,
    mappable: row.mappable === 1,
    sourceFieldsJson: JSON.parse(row.source_fields_json) as Record<string, string>,
  };
}

function toMapIncident(row: IncidentRow): TorontoMapIncident {
  return {
    recordKey: row.record_key,
    sourceRecordId: row.source_record_id,
    eventUniqueId: row.event_unique_id,
    datasetSlug: row.dataset_slug,
    occDate: row.occ_date,
    division: row.division,
    premisesType: row.premises_type,
    offence: row.offence,
    csiCategory: row.csi_category,
    hood158: row.hood_158,
    neighbourhood158: row.neighbourhood_158,
    lat: row.lat,
    lng: row.lng,
    mappable: true,
  };
}

interface QueryOptions {
  page?: number;
  pageSize?: number;
  includeRecords?: boolean;
  includeMapRecords?: boolean;
  mapLimit?: number;
}

export async function queryTorontoIncidents(
  filters: ExplorerFilters,
  options: QueryOptions = {},
): Promise<TorontoQueryResult> {
  const manifest = await loadManifest();
  const db = getDatabase(manifest.databaseFile);
  const page = Number.isSafeInteger(options.page) && (options.page ?? 0) > 0
    ? options.page as number
    : 1;
  const pageSize = Number.isSafeInteger(options.pageSize) && (options.pageSize ?? 0) > 0
    ? Math.min(options.pageSize as number, 100)
    : DEFAULT_PAGE_SIZE;
  const mapLimit = Number.isSafeInteger(options.mapLimit) && (options.mapLimit ?? 0) > 0
    ? Math.min(options.mapLimit as number, DEFAULT_MAP_LIMIT)
    : DEFAULT_MAP_LIMIT;
  const where = buildWhere(filters, manifest.datasets.map((item) => item.slug));

  const summaryRow = db.prepare(`
    SELECT COUNT(*) AS total, COALESCE(SUM(mappable), 0) AS mappable
    FROM incidents
    ${where.sql}
  `).get(...where.params);
  const total = Number(summaryRow?.total ?? 0);
  const mappable = Number(summaryRow?.mappable ?? 0);

  let records: TorontoIncident[] = [];
  if (options.includeRecords) {
    const rows = db.prepare(`
      SELECT *
      FROM incidents
      ${where.sql}
      ORDER BY dataset_slug, source_record_id
      LIMIT ? OFFSET ?
    `).all(...where.params, pageSize, (page - 1) * pageSize) as IncidentRow[];
    records = rows.map(toIncident);
  }

  let mapRecords: TorontoMapIncident[] = [];
  if (options.includeMapRecords) {
    const mapWhere = where.sql
      ? `${where.sql} AND mappable = 1`
      : "WHERE mappable = 1";
    const rows = db.prepare(`
      SELECT
        record_key, source_record_id, event_unique_id, dataset_slug, occ_date,
        division, premises_type, offence, csi_category, hood_158,
        neighbourhood_158, lat, lng, mappable
      FROM incidents
      ${mapWhere}
      ORDER BY sample_rank, dataset_slug, source_record_id
      LIMIT ?
    `).all(...where.params, mapLimit) as IncidentRow[];
    mapRecords = rows.map(toMapIncident);
  }

  return {
    summary: { total, mappable, nonMappable: total - mappable },
    records,
    mapRecords,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    mapLimit,
  };
}
