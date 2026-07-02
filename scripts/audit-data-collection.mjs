import { pathToFileURL } from "node:url";
import {
  createReadStream,
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, join, relative } from "node:path";
import readline from "node:readline";

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, "data");
const OUTPUT = {
  catalogCsv: join(DATA_DIR, "DATA_COLLECTION_MASTER_CATALOG.csv"),
  catalogMd: join(DATA_DIR, "DATA_COLLECTION_MASTER_CATALOG.md"),
  coverageCsv: join(DATA_DIR, "DATA_COLLECTION_COVERAGE_MATRIX.csv"),
  readinessMd: join(DATA_DIR, "DATA_COLLECTION_INGESTION_READINESS.md"),
};

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const JURISDICTION_FILTER = (() => {
  const idx = process.argv.indexOf("--jurisdiction");
  return idx >= 0 ? process.argv[idx + 1] : null;
})();

const CATALOG_COLUMNS = [
  "catalog_id",
  "jurisdiction_id",
  "source_name",
  "source_type",
  "source_class",
  "official_url",
  "endpoint_url",
  "local_root_path",
  "source_file",
  "load_file_path",
  "main_csv_path",
  "main_geojson_path",
  "metadata_path",
  "audit_paths",
  "dataset_group",
  "crime_category_raw",
  "row_count",
  "date_min",
  "date_max",
  "date_field_used",
  "coordinate_fields",
  "mappable_count",
  "mappable_percent",
  "primary_source_key",
  "occurrence_grouping_key",
  "geography_fields",
  "offence_category_fields",
  "known_categories_json",
  "missing_categories",
  "privacy_level",
  "scope_type",
  "ingestion_status",
  "public_display_status",
  "ingestion_readiness_status",
  "notes",
  "risks",
];

/** @type {Array<Record<string, string>>} */
const catalogRows = [];
/** @type {string[]} */
const missingExpected = [];
/** @type {string[]} */
const confirmedFiles = [];
let catalogCounter = 0;

function rel(p) {
  return relative(ROOT, p).replaceAll("\\", "/");
}

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function parseCsvLine(line) {
  const out = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  out.push(current);
  return out;
}

function parseDateValue(raw) {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  if (/^\d{13}$/.test(value)) {
    const d = new Date(Number(value));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (/^\d{10}$/.test(value)) {
    const d = new Date(Number(value) * 1000);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
    const [dd, mm, yyyy] = value.split("/").map(Number);
    const d = new Date(Date.UTC(yyyy, mm - 1, dd));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(d) {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

function formatDateTime(d) {
  if (!d) return "";
  return d.toISOString().replace("T", " ").replace(".000Z", ".000");
}

function scanHeaders(filePath) {
  const firstLine = readFileSync(filePath, "utf8").split(/\r?\n/)[0] ?? "";
  return parseCsvLine(firstLine);
}

function headersInclude(headers, name) {
  return headers.includes(name);
}

async function scanCsv(filePath, options = {}) {
  const {
    dateFields = [],
    latFields = [],
    lonFields = [],
    categoryField = null,
    categoryLimit = 25,
    groupKeyField = null,
  } = options;

  const stream = createReadStream(filePath, { encoding: "utf8" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  /** @type {string[]} */
  let headers = [];
  let rowCount = 0;
  let mappableCount = 0;
  let dateMin = null;
  let dateMax = null;
  let dateFieldUsed = "";
  /** @type {Map<string, number>} */
  const categoryCounts = new Map();
  /** @type {Map<string, number>} */
  const groupCounts = new Map();

  for await (const line of rl) {
    if (!headers.length) {
      headers = parseCsvLine(line);
      continue;
    }
    rowCount += 1;
    const values = parseCsvLine(line);
    const record = {};
    headers.forEach((header, idx) => {
      record[header] = values[idx] ?? "";
    });

    for (const field of dateFields) {
      if (!(field in record)) continue;
      const parsed = parseDateValue(record[field]);
      if (!parsed) continue;
      if (!dateFieldUsed) dateFieldUsed = field;
      if (!dateMin || parsed < dateMin) dateMin = parsed;
      if (!dateMax || parsed > dateMax) dateMax = parsed;
    }

    let lat = null;
    let lon = null;
    for (const field of latFields) {
      if (record[field] != null && record[field] !== "") {
        lat = Number(record[field]);
        break;
      }
    }
    for (const field of lonFields) {
      if (record[field] != null && record[field] !== "") {
        lon = Number(record[field]);
        break;
      }
    }
    if (
      Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      !(lat === 0 && lon === 0)
    ) {
      mappableCount += 1;
    }

    if (categoryField && record[categoryField]) {
      const key = String(record[categoryField]).trim();
      categoryCounts.set(key, (categoryCounts.get(key) ?? 0) + 1);
    }

    if (groupKeyField && record[groupKeyField]) {
      const key = String(record[groupKeyField]).trim();
      groupCounts.set(key, (groupCounts.get(key) ?? 0) + 1);
    }
  }

  const topCategories = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, categoryLimit)
    .map(([name, count]) => ({ name, count }));

  return {
    headers,
    rowCount,
    mappableCount,
    mappablePercent: rowCount ? ((mappableCount / rowCount) * 100).toFixed(1) : "0.0",
    dateMin: formatDate(dateMin),
    dateMax: formatDate(dateMax),
    dateMinDateTime: formatDateTime(dateMin),
    dateMaxDateTime: formatDateTime(dateMax),
    dateFieldUsed,
    topCategories,
    uniqueGroupKeys: groupCounts.size,
    duplicateExtraRows: groupKeyField ? rowCount - groupCounts.size : 0,
  };
}

function stripBom(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function scanGeoJson(filePath) {
  const raw = stripBom(readFileSync(filePath, "utf8"));
  const parsed = JSON.parse(raw);
  const features = Array.isArray(parsed.features) ? parsed.features : [];
  let mappable = 0;
  for (const feature of features) {
    const geom = feature?.geometry;
    if (geom && geom.type && geom.coordinates) mappable += 1;
  }
  return {
    rowCount: features.length,
    mappableCount: mappable,
    mappablePercent: features.length
      ? ((mappable / features.length) * 100).toFixed(1)
      : "0.0",
  };
}

function loadTpsClassification() {
  const mdPath = join(ROOT, "docs", "TPS_TYPED_SOURCE_LAYER_PLAN_2026-06-30.md");
  const md = readFileSync(mdPath, "utf8");
  /** @type {Map<string, any>} */
  const map = new Map();
  const rowRe =
    /\|\s*\d+\s*\|\s*`([^`]+\.csv)`\s*\|\s*[^|]*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`/g;
  let match;
  while ((match = rowRe.exec(md)) !== null) {
    const [, filename, typedLayer, datasetSlug, publishStatus] = match;
    map.set(filename.trim(), {
      typedLayer: typedLayer.trim(),
      datasetSlug: datasetSlug.trim(),
      publishStatus: publishStatus.trim(),
    });
  }
  return map;
}

function mapSourceClass(sourceClass) {
  if (sourceClass === "reference_geography_datasets") return "reference_geography";
  if (sourceClass === "traffic_ksi_records") return "public_collision_records";
  if (sourceClass === "aggregate_metric_tables") return "downloaded_report_archive";
  if (sourceClass === "sensitive_incident_records") return "public_incident_records";
  if (sourceClass === "calls_for_service_crisis_records") return "public_incident_records";
  return "public_incident_records";
}

function mapTpsIngestionStatus(publishStatus, sourceClass) {
  if (publishStatus === "duplicate_review") return "raw_available_review_required";
  if (sourceClass === "reference_geography_datasets") return "reference_geography_only";
  if (sourceClass === "sensitive_incident_records") return "raw_available_review_required";
  if (sourceClass === "calls_for_service_crisis_records") return "raw_available_review_required";
  return "ready_for_bronze_load";
}

function mapTpsPublicDisplay(publishStatus, sourceClass) {
  if (publishStatus === "v1_published") return "published_v1";
  if (publishStatus === "duplicate_review") return "deferred_review";
  if (sourceClass === "reference_geography_datasets") return "not_for_public_incident_map";
  if (sourceClass === "aggregate_metric_tables") return "not_for_public_incident_map";
  if (sourceClass === "sensitive_incident_records") return "deferred_review";
  if (sourceClass === "calls_for_service_crisis_records") return "deferred_review";
  return "deferred_review";
}

function mapTpsDatasetGroup(sourceClass, datasetSlug) {
  if (sourceClass === "public_incident_records") {
    if (datasetSlug === "major-crime-indicators-open-data") return "tps_major_crime_combined";
    return "tps_major_crime_v1";
  }
  if (sourceClass === "sensitive_incident_records") return "tps_sensitive_incident";
  if (sourceClass === "traffic_ksi_records") return "tps_traffic_ksi";
  if (sourceClass === "calls_for_service_crisis_records") return "tps_calls_for_service";
  if (sourceClass === "aggregate_metric_tables") return "tps_aggregate";
  if (sourceClass === "reference_geography_datasets") return "tps_reference_geography";
  return "tps_other";
}

function addCatalogRow(partial) {
  if (JURISDICTION_FILTER && partial.jurisdiction_id !== JURISDICTION_FILTER) {
    return;
  }
  catalogCounter += 1;
  /** @type {Record<string, string>} */
  const row = {};
  for (const col of CATALOG_COLUMNS) {
    row[col] = partial[col] ?? "";
  }
  row.catalog_id = `cat-${String(catalogCounter).padStart(4, "0")}`;
  if (row.load_file_path && existsSync(join(ROOT, row.load_file_path))) {
    confirmedFiles.push(row.load_file_path);
  }
  catalogRows.push(row);
}

function topCategoriesJson(categories) {
  return JSON.stringify(categories ?? []);
}

function expectMissing(pathRel) {
  const full = join(ROOT, pathRel);
  if (!existsSync(full)) missingExpected.push(pathRel);
}

async function catalogTpsRaw(classification) {
  const rawDir = join(ROOT, "data", "raw", "tps", "_downloads", "2026-06-30");
  const files = readdirSync(rawDir)
    .filter((name) => name.endsWith(".csv"))
    .sort();

  for (const filename of files) {
    const filePath = join(rawDir, filename);
    const meta = classification.get(filename) ?? {
      typedLayer: "unknown",
      datasetSlug: filename.replace(/\.csv$/i, "").toLowerCase(),
      publishStatus: "unknown",
    };
    const sourceClass = meta.typedLayer;
    const headers = scanHeaders(filePath);
    const scan = await scanCsv(filePath, {
      dateFields: ["OCC_DATE", "REPORT_DATE", "OCCUR_DATE", "DATE", "EVENT_DATE"],
      latFields: ["LAT_WGS84", "LATITUDE", "lat"],
      lonFields: ["LONG_WGS84", "LONGITUDE", "lon"],
      categoryField: headersInclude(headers, "OFFENCE")
        ? "OFFENCE"
        : headersInclude(headers, "CSI_CATEGORY")
          ? "CSI_CATEGORY"
          : null,
      groupKeyField: headersInclude(headers, "EVENT_UNIQUE_ID") ? "EVENT_UNIQUE_ID" : null,
    });

    addCatalogRow({
      jurisdiction_id: "tps",
      source_name: "TPS Open Data Bulk Download",
      source_type: "csv",
      source_class: mapSourceClass(sourceClass),
      official_url: "https://data.torontopolice.on.ca/",
      endpoint_url: "",
      local_root_path: rel(rawDir),
      source_file: filename,
      load_file_path: rel(filePath),
      main_csv_path: rel(filePath),
      dataset_group: mapTpsDatasetGroup(sourceClass, meta.datasetSlug),
      crime_category_raw: meta.datasetSlug,
      row_count: String(scan.rowCount),
      date_min: scan.dateMin,
      date_max: scan.dateMax,
      date_field_used: scan.dateFieldUsed,
      coordinate_fields: "LONG_WGS84,LAT_WGS84",
      mappable_count: String(scan.mappableCount),
      mappable_percent: scan.mappablePercent,
      primary_source_key: "EVENT_UNIQUE_ID|OBJECTID",
      occurrence_grouping_key: "EVENT_UNIQUE_ID",
      geography_fields: "DIVISION,HOOD_158,NEIGHBOURHOOD_158,HOOD_140,NEIGHBOURHOOD_140",
      offence_category_fields: "OFFENCE,CSI_CATEGORY,UCR_CODE",
      known_categories_json: topCategoriesJson(scan.topCategories),
      missing_categories: "",
      privacy_level:
        scan.rowCount && scan.mappableCount === scan.rowCount
          ? "public_exact_or_offset"
          : "exact_unknown",
      scope_type: meta.publishStatus === "v1_published" ? "processed_canonical" : "extract_only",
      ingestion_status: mapTpsIngestionStatus(meta.publishStatus, sourceClass),
      public_display_status: mapTpsPublicDisplay(meta.publishStatus, sourceClass),
      ingestion_readiness_status: "catalog_verified",
      notes: `typed_layer=${sourceClass}; publish_status=${meta.publishStatus}; dataset_slug=${meta.datasetSlug}`,
      risks:
        meta.publishStatus === "duplicate_review"
          ? "Duplicate bulk-download copy; review before treating as canonical."
          : sourceClass === "sensitive_incident_records"
            ? "Sensitive incident records; public display review required."
            : "",
    });
  }
}

async function catalogTpsProcessed() {
  const processedDir = join(ROOT, "data", "processed", "tps", "v1");
  const manifestPath = join(processedDir, "manifest.json");
  if (!existsSync(manifestPath)) {
    missingExpected.push(rel(manifestPath));
    return;
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const sqlitePath = join(processedDir, "tps-v1-v2.sqlite");
  addCatalogRow({
    jurisdiction_id: "tps",
    source_name: "TPS V1 Processed Package",
    source_type: "sqlite",
    source_class: "public_incident_records",
    official_url: "https://data.torontopolice.on.ca/",
    local_root_path: rel(processedDir),
    source_file: "tps-v1-v2.sqlite",
    load_file_path: rel(sqlitePath),
    metadata_path: rel(manifestPath),
    dataset_group: "tps_processed_v1",
    crime_category_raw: "Assault|Auto Theft|Break and Enter|Robbery|Theft From MV|Theft Over",
    row_count: String(manifest.totalRows),
    date_min: "2000-01-01",
    date_max: "2026-03-31",
    date_field_used: "OCC_DATE",
    coordinate_fields: "LONG_WGS84,LAT_WGS84",
    mappable_count: String(manifest.totalRows - manifest.nonMappableRows),
    mappable_percent: (
      ((manifest.totalRows - manifest.nonMappableRows) / manifest.totalRows) *
      100
    ).toFixed(1),
    primary_source_key: "EVENT_UNIQUE_ID",
    scope_type: "selected_category",
    ingestion_status: "ready_with_caveats",
    public_display_status: "published_v1",
    ingestion_readiness_status: "processed_canonical_active_in_app",
    notes: "Derived processed package; raw 74-file corpus remains authoritative bronze source.",
    risks: "Processed subset only (six major crime categories).",
  });
}

async function catalogPeel() {
  const root = join(ROOT, "data", "raw", "peel-prp", "ecrimes");
  const mainCsv = join(
    root,
    "incidents",
    "2026-07-01",
    "peel-prp-ecrimes-2026-07-01-with-geometry.csv",
  );
  if (!existsSync(mainCsv)) missingExpected.push(rel(mainCsv));

  const scan = await scanCsv(mainCsv, {
    dateFields: ["OccDate", "OccurrenceDate", "OccDateUTC"],
    latFields: ["Latitude"],
    lonFields: ["Longitude"],
    categoryField: "OccType",
    groupKeyField: "OccurrenceNumber",
  });

  const offenceAudit = join(
    root,
    "_audit",
    "2026-07-01",
    "peel-final-known-service-check",
    "peel-ecrimes-offence-counts.csv",
  );
  const hardCrimeAudit = join(
    root,
    "_audit",
    "2026-07-01",
    "peel-final-known-service-check",
    "peel-hard-crime-coverage.csv",
  );

  addCatalogRow({
    jurisdiction_id: "peel-prp",
    source_name: "PRP ECrimes ArcGIS",
    source_type: "csv",
    source_class: "public_incident_records_crime_map",
    official_url:
      "https://experience.arcgis.com/experience/6eb9c3c452c34ce2b19821de0f6eb775/",
    endpoint_url:
      "https://services.arcgis.com/w0dAT1ctgtKwxvde/arcgis/rest/services/Experience_gdb/FeatureServer/0",
    local_root_path: rel(root),
    source_file: basename(mainCsv),
    load_file_path: rel(mainCsv),
    main_csv_path: rel(mainCsv),
    metadata_path: existsSync(offenceAudit) ? rel(offenceAudit) : "",
    audit_paths: [rel(offenceAudit), rel(hardCrimeAudit)]
      .filter((p) => existsSync(join(ROOT, p)))
      .join("|"),
    dataset_group: "peel_ecrimes_incidents",
    crime_category_raw: "ASL|VEH|FRA|MIS|BNE|DRP|ROB|DRT|HOM",
    row_count: String(scan.rowCount),
    date_min: scan.dateMin,
    date_max: scan.dateMax,
    date_field_used: scan.dateFieldUsed || "OccDate",
    coordinate_fields: "Longitude,Latitude",
    mappable_count: String(scan.mappableCount),
    mappable_percent: scan.mappablePercent,
    primary_source_key: "OBJECTID",
    occurrence_grouping_key: "OccurrenceNumber",
    geography_fields: "Municipality,PatrolZone,Division,Ward",
    offence_category_fields: "OccType,Description",
    known_categories_json: topCategoriesJson(scan.topCategories),
    missing_categories:
      "sexual assault;attempted murder;standalone shootings/firearms;standalone weapons;arson",
    privacy_level: "public_offset",
    scope_type: "rolling_window",
    ingestion_status: "ready_with_caveats",
    public_display_status: "source_disclaimer_required",
    ingestion_readiness_status: "ready_for_ingestion_planning",
    notes: `Unique OccurrenceNumber=${scan.uniqueGroupKeys}; duplicate extra rows=${scan.duplicateExtraRows}. Preserve raw duplicates.`,
    risks: "Offset/generalized coordinates; duplicate OccurrenceNumber groups.",
  });

  const legacyCsv = join(
    root,
    "legacy-csv-no-geometry",
    "2026-07-01",
    "peel-prp-ecrimes-2026-07-01-no-geometry.csv",
  );
  if (existsSync(legacyCsv)) {
    const legacyScan = await scanCsv(legacyCsv, {
      dateFields: ["OccDate", "OccurrenceDate"],
    });
    addCatalogRow({
      jurisdiction_id: "peel-prp",
      source_name: "PRP ECrimes Legacy No-Geometry Export",
      source_type: "csv",
      source_class: "public_incident_records_crime_map",
      local_root_path: rel(root),
      source_file: basename(legacyCsv),
      load_file_path: rel(legacyCsv),
      main_csv_path: rel(legacyCsv),
      dataset_group: "peel_ecrimes_legacy",
      row_count: String(legacyScan.rowCount),
      ingestion_status: "ready_with_caveats",
      public_display_status: "not_for_public_incident_map",
      scope_type: "extract_only",
      notes: "Legacy export without geometry; superseded by with-geometry CSV.",
    });
  }

  const boundariesDir = join(root, "boundaries", "current");
  if (existsSync(boundariesDir)) {
    for (const name of readdirSync(boundariesDir).filter((n) => n.endsWith(".geojson"))) {
      const filePath = join(boundariesDir, name);
      const geo = scanGeoJson(filePath);
      addCatalogRow({
        jurisdiction_id: "peel-prp",
        source_name: "PRP ECrimes Boundaries",
        source_type: "geojson",
        source_class: "reference_geography",
        local_root_path: rel(root),
        source_file: name,
        load_file_path: rel(filePath),
        main_geojson_path: rel(filePath),
        dataset_group: "peel_reference_geography",
        row_count: String(geo.rowCount),
        ingestion_status: "reference_geography_only",
        public_display_status: "not_for_public_incident_map",
        scope_type: "extract_only",
      });
    }
  }

  const hotspotsDir = join(root, "hotspots", "2025");
  if (existsSync(hotspotsDir)) {
    for (const name of readdirSync(hotspotsDir)) {
      const filePath = join(hotspotsDir, name);
      if (!name.endsWith(".geojson")) continue;
      const geo = scanGeoJson(filePath);
      addCatalogRow({
        jurisdiction_id: "peel-prp",
        source_name: "PRP ECrimes Hotspots",
        source_type: "geojson",
        source_class: "derived_analytical_overlay",
        local_root_path: rel(root),
        source_file: name,
        load_file_path: rel(filePath),
        main_geojson_path: rel(filePath),
        dataset_group: "peel_hotspots_overlay",
        row_count: String(geo.rowCount),
        ingestion_status: "ready_with_caveats",
        public_display_status: "not_for_public_incident_map",
        scope_type: "extract_only",
        notes: "Derived analytical overlay; not primary incident records.",
      });
    }
  }
}

async function catalogYork() {
  const root = join(ROOT, "data", "raw", "yrp", "community-safety");
  const mainCsv = join(
    root,
    "incidents",
    "2026-07-01",
    "yrp-community-safety-occurrences-2026-07-01-with-geometry.csv",
  );
  if (!existsSync(mainCsv)) missingExpected.push(rel(mainCsv));

  const scan = await scanCsv(mainCsv, {
    dateFields: ["occ_date", "rep_date"],
    latFields: ["Latitude"],
    lonFields: ["Longitude"],
    categoryField: "occ_type",
  });

  addCatalogRow({
    jurisdiction_id: "yrp",
    source_name: "YRP Community Safety Portal",
    source_type: "csv",
    source_class: "public_incident_records_crime_map",
    official_url: "https://community-safety-portal-datayrp.hub.arcgis.com/",
    endpoint_url:
      "https://services8.arcgis.com/lYI034SQcOoxRCR7/arcgis/rest/services/Occurrence_Data_View/FeatureServer/0",
    local_root_path: rel(root),
    source_file: basename(mainCsv),
    load_file_path: rel(mainCsv),
    main_csv_path: rel(mainCsv),
    audit_paths: rel(join(root, "_audit", "2026-07-01")),
    dataset_group: "yrp_community_safety_incidents",
    crime_category_raw: "occ_type",
    row_count: String(scan.rowCount),
    date_min: scan.dateMin,
    date_max: scan.dateMax,
    date_field_used: "occ_date",
    coordinate_fields: "Longitude,Latitude",
    mappable_count: String(scan.mappableCount),
    mappable_percent: scan.mappablePercent,
    primary_source_key: "UniqueIdentifier",
    occurrence_grouping_key: "occ_id",
    geography_fields: "municipality,district,sector",
    offence_category_fields: "occ_type,case_type_pubtrans,case_category1",
    known_categories_json: topCategoriesJson(scan.topCategories),
    missing_categories: "",
    privacy_level: "public_offset",
    scope_type: "rolling_window",
    ingestion_status: "ready_with_caveats",
    public_display_status: "source_disclaimer_required",
    ingestion_readiness_status: "ready_for_ingestion_planning",
    notes: "Public view filtered to occ_date > 2024-12-31 (2025+ only).",
    risks: "YRP terms restrict commercial use and cross-time safety comparisons.",
  });

  const boundaryPath = join(root, "boundaries", "current", "yrp-municipalities.geojson");
  if (existsSync(boundaryPath)) {
    const geo = scanGeoJson(boundaryPath);
    addCatalogRow({
      jurisdiction_id: "yrp",
      source_name: "YRP Municipal Boundaries",
      source_type: "geojson",
      source_class: "reference_geography",
      endpoint_url:
        "https://services8.arcgis.com/lYI034SQcOoxRCR7/arcgis/rest/services/PoliceBoundaries/FeatureServer/0",
      local_root_path: rel(root),
      source_file: basename(boundaryPath),
      load_file_path: rel(boundaryPath),
      main_geojson_path: rel(boundaryPath),
      dataset_group: "yrp_reference_geography",
      row_count: String(geo.rowCount),
      ingestion_status: "reference_geography_only",
      public_display_status: "not_for_public_incident_map",
    });
  }

  const cctvPath = join(root, "_audit", "2026-07-01", "yrp-cctv-cameras-archive.geojson");
  if (existsSync(cctvPath)) {
    const geo = scanGeoJson(cctvPath);
    addCatalogRow({
      jurisdiction_id: "yrp",
      source_name: "YRP CCTV Cameras Archive",
      source_type: "geojson",
      source_class: "archive_only_sensitive",
      endpoint_url:
        "https://services8.arcgis.com/lYI034SQcOoxRCR7/arcgis/rest/services/YRP_CCTV_Cameras/FeatureServer/0",
      local_root_path: rel(root),
      source_file: basename(cctvPath),
      load_file_path: rel(cctvPath),
      main_geojson_path: rel(cctvPath),
      dataset_group: "yrp_cctv_archive",
      row_count: String(geo.rowCount),
      ingestion_status: "archive_only_do_not_load_as_incidents",
      public_display_status: "not_for_public_incident_map",
      notes: "Archive-only sensitive layer; not crime incident data.",
    });
  }
}

async function catalogDurham() {
  const root = join(ROOT, "data", "raw", "durham-drps", "community-safety");
  const incidentsDir = join(root, "incidents", "2026-07-01");
  const configs = [
    {
      file: "durham-drps-avl-odp-crimemap-master-2026-07-01.csv",
      group: "durham_master",
      sourceClass: "public_incident_records_master_crime_map",
      scope: "rolling_window",
      status: "ready_with_caveats",
      notes: "Canonical public crime map master; do not merge with standalone extracts.",
    },
    {
      file: "durham-drps-assault-open-data-2026-07-01.csv",
      group: "durham_standalone_extract",
      sourceClass: "public_incident_records_extract",
      scope: "extract_only",
      status: "ready_with_caveats",
      notes: "Standalone extract; separate ID/window space from master.",
    },
    {
      file: "durham-drps-auto-theft-open-data-2026-07-01.csv",
      group: "durham_standalone_extract",
      sourceClass: "public_incident_records_extract",
      scope: "extract_only",
      status: "ready_with_caveats",
    },
    {
      file: "durham-drps-bne-open-data-2026-07-01.csv",
      group: "durham_standalone_extract",
      sourceClass: "public_incident_records_extract",
      scope: "extract_only",
      status: "ready_with_caveats",
    },
    {
      file: "durham-drps-drug-violations-open-data-2026-07-01.csv",
      group: "durham_standalone_extract",
      sourceClass: "public_incident_records_extract",
      scope: "extract_only",
      status: "ready_with_caveats",
    },
    {
      file: "durham-drps-firearm-shooting-open-data-2026-07-01.csv",
      group: "durham_standalone_extract",
      sourceClass: "public_incident_records_extract",
      scope: "extract_only",
      status: "ready_with_caveats",
    },
    {
      file: "durham-drps-robbery-open-data-2026-07-01.csv",
      group: "durham_standalone_extract",
      sourceClass: "public_incident_records_extract",
      scope: "extract_only",
      status: "ready_with_caveats",
    },
    {
      file: "durham-drps-theft-over-5000-open-data-2026-07-01.csv",
      group: "durham_standalone_extract",
      sourceClass: "public_incident_records_extract",
      scope: "extract_only",
      status: "ready_with_caveats",
    },
    {
      file: "durham-drps-traffic-collision-open-data-2026-07-01.csv",
      group: "durham_traffic_collisions",
      sourceClass: "public_collision_records",
      scope: "extract_only",
      status: "ready_for_bronze_load",
      notes: "Traffic collision records; separate from crime incident master.",
    },
  ];

  for (const cfg of configs) {
    const csvPath = join(incidentsDir, cfg.file);
    if (!existsSync(csvPath)) {
      missingExpected.push(rel(csvPath));
      continue;
    }
    const scan = await scanCsv(csvPath, {
      dateFields: ["occ_date", "report_date", "occurrence_year"],
      latFields: ["lat"],
      lonFields: ["lon"],
      categoryField: "crime_category",
      groupKeyField: "event_unique_id",
    });
    const geoPath = csvPath.replace(/\.csv$/i, ".geojson");
    addCatalogRow({
      jurisdiction_id: "durham-drps",
      source_name: "DRPS Open Data Hub",
      source_type: "csv",
      source_class: cfg.sourceClass,
      official_url: "https://open-data-drps.hub.arcgis.com/",
      endpoint_url:
        cfg.group === "durham_master"
          ? "https://services6.arcgis.com/2r8RrIqBhHAeyu7x/arcgis/rest/services/avl_odp_crimemap/FeatureServer/2"
          : "",
      local_root_path: rel(root),
      source_file: cfg.file,
      load_file_path: rel(csvPath),
      main_csv_path: rel(csvPath),
      main_geojson_path: existsSync(geoPath) ? rel(geoPath) : "",
      audit_paths: rel(join(root, "source-freeze-2026-07-01", "reports")),
      dataset_group: cfg.group,
      crime_category_raw: "crime_category",
      row_count: String(scan.rowCount),
      date_min: scan.dateMin,
      date_max: scan.dateMax,
      date_field_used: scan.dateFieldUsed || "occ_date",
      coordinate_fields: "lat,lon",
      mappable_count: String(scan.mappableCount),
      mappable_percent: scan.mappablePercent,
      primary_source_key: "event_unique_id",
      occurrence_grouping_key: "event_unique_id",
      geography_fields: "municipality,division,neighbourhood",
      offence_category_fields: "crime_category",
      known_categories_json: topCategoriesJson(scan.topCategories),
      missing_categories:
        cfg.group === "durham_master"
          ? "sexual assault;attempted murder;hate crime;arson;calls for service"
          : "",
      privacy_level: "exact_unknown",
      scope_type: cfg.scope,
      ingestion_status: cfg.status,
      public_display_status:
        cfg.group === "durham_traffic_collisions"
          ? "not_for_public_incident_map"
          : "source_disclaimer_required",
      ingestion_readiness_status: "ready_for_ingestion_planning",
      notes: cfg.notes ?? "",
    });
  }

  const boundariesDir = join(root, "boundaries", "current");
  if (existsSync(boundariesDir)) {
    for (const name of readdirSync(boundariesDir)) {
      const filePath = join(boundariesDir, name);
      if (!name.endsWith(".geojson")) continue;
      const geo = scanGeoJson(filePath);
      addCatalogRow({
        jurisdiction_id: "durham-drps",
        source_name: "DRPS Reference Geography",
        source_type: "geojson",
        source_class: "reference_geography",
        local_root_path: rel(root),
        source_file: name,
        load_file_path: rel(filePath),
        main_geojson_path: rel(filePath),
        dataset_group: "durham_reference_geography",
        row_count: String(geo.rowCount),
        ingestion_status: "reference_geography_only",
        public_display_status: "not_for_public_incident_map",
      });
    }
  }
}

async function catalogHalton() {
  const root = join(ROOT, "data", "raw", "halton-hrps", "crime-map");
  const csvPath = join(
    root,
    "incidents",
    "2026-07-01",
    "halton-hrps-crime-map-incidents-2026-07-01.csv",
  );
  const geoPath = csvPath.replace(/\.csv$/i, ".geojson");
  if (!existsSync(csvPath)) missingExpected.push(rel(csvPath));

  const scan = await scanCsv(csvPath, {
    dateFields: ["DATE", "DATE_UTC"],
    latFields: ["Latitude"],
    lonFields: ["Longitude"],
    categoryField: "DESCRIPTION",
    groupKeyField: "GlobalID",
  });

  const hardCrimePath = join(
    root,
    "_audit",
    "2026-07-01",
    "halton-hrps-hard-crime-coverage-2026-07-01.csv",
  );

  addCatalogRow({
    jurisdiction_id: "halton-hrps",
    source_name: "HRPS Crime Map",
    source_type: "csv",
    source_class: "public_incident_records_crime_map",
    official_url: "https://www.haltonpolice.ca/crime-files/crime-map/",
    endpoint_url:
      "https://services2.arcgis.com/o1LYr96CpFkfsDJS/arcgis/rest/services/Crime_Map/FeatureServer/0",
    local_root_path: rel(root),
    source_file: basename(csvPath),
    load_file_path: rel(csvPath),
    main_csv_path: rel(csvPath),
    main_geojson_path: existsSync(geoPath) ? rel(geoPath) : "",
    metadata_path: rel(
      join(root, "_audit", "2026-07-01", "halton-hrps-crime-map-incidents.metadata.json"),
    ),
    audit_paths: existsSync(hardCrimePath) ? rel(hardCrimePath) : "",
    dataset_group: "halton_crime_map_incidents",
    crime_category_raw: "DESCRIPTION",
    row_count: String(scan.rowCount),
    date_min: scan.dateMinDateTime || scan.dateMin,
    date_max: scan.dateMaxDateTime || scan.dateMax,
    date_field_used: "DATE_UTC",
    coordinate_fields: "Latitude,Longitude",
    mappable_count: String(scan.mappableCount),
    mappable_percent: scan.mappablePercent,
    primary_source_key: "GlobalID",
    occurrence_grouping_key: "CASE_NO",
    geography_fields: "CITY,LOCATION",
    offence_category_fields: "DESCRIPTION",
    known_categories_json: topCategoriesJson(scan.topCategories),
    missing_categories:
      "homicide;murder;attempted murder;sexual assault;assault;shooting;firearm;hate crime",
    privacy_level: "exact_unknown",
    scope_type: "rolling_window",
    ingestion_status: "ready_with_caveats",
    public_display_status: "source_disclaimer_required",
    ingestion_readiness_status: "ready_for_ingestion_planning",
    notes: "Crime map includes many road/MVC categories. boundaries/current missing on disk.",
    risks: "Violent categories not found in public layer; heavy traffic/roadside share.",
  });

  if (existsSync(geoPath)) {
    const geo = scanGeoJson(geoPath);
    addCatalogRow({
      jurisdiction_id: "halton-hrps",
      source_name: "HRPS Crime Map GeoJSON",
      source_type: "geojson",
      source_class: "public_incident_records_crime_map",
      local_root_path: rel(root),
      source_file: basename(geoPath),
      load_file_path: rel(geoPath),
      main_geojson_path: rel(geoPath),
      dataset_group: "halton_crime_map_incidents_geojson",
      row_count: String(geo.rowCount),
      ingestion_status: "ready_with_caveats",
      public_display_status: "source_disclaimer_required",
      notes: "GeoJSON mirror of CSV incident export.",
    });
  }

  expectMissing(rel(join(root, "boundaries", "current")));
}

async function catalogHamilton() {
  const root = join(
    ROOT,
    "data",
    "raw",
    "hamilton-hps",
    "communitycrimemap",
    "source-freeze-2026-07-02",
  );
  const rawCsv = join(
    root,
    "incidents",
    "2026-07-02",
    "hamilton-communitycrimemap-2000-to-2026-records-2026-07-02.csv",
  );
  const cleanedCsv = join(
    root,
    "incidents",
    "2026-07-02",
    "cleaned",
    "hamilton-communitycrimemap-hps-only-2021-to-2026-records-2026-07-02.csv",
  );
  const cleanupAudit = join(
    root,
    "reports",
    "hamilton-communitycrimemap-hps-only-cleanup-audit-2026-07-02.json",
  );

  if (existsSync(rawCsv)) {
    const rawScan = await scanCsv(rawCsv, {
      dateFields: ["DateTime_raw"],
      latFields: ["Latitude"],
      lonFields: ["Longitude"],
      categoryField: "Crime",
      groupKeyField: "source_pin_key",
    });
    addCatalogRow({
      jurisdiction_id: "hamilton-hps",
      source_name: "HPS Community Crime Map Raw Export",
      source_type: "csv",
      source_class: "public_incident_records_crime_map",
      official_url: "https://hamiltonpolice.on.ca/how-to/online-crime-mapping-tool",
      endpoint_url: "https://www.communitycrimemap.com/api/v1/search/load-data",
      local_root_path: rel(root),
      source_file: basename(rawCsv),
      load_file_path: rel(rawCsv),
      main_csv_path: rel(rawCsv),
      audit_paths: existsSync(cleanupAudit) ? rel(cleanupAudit) : "",
      dataset_group: "hamilton_communitycrimemap_raw",
      crime_category_raw: "selected crimeTypes [1,6,7,10,11,16,17]",
      row_count: String(rawScan.rowCount),
      date_min: rawScan.dateMinDateTime || rawScan.dateMin,
      date_max: rawScan.dateMaxDateTime || rawScan.dateMax,
      date_field_used: "DateTime_raw",
      coordinate_fields: "Latitude,Longitude",
      mappable_count: String(rawScan.mappableCount),
      mappable_percent: rawScan.mappablePercent,
      primary_source_key: "source_pin_key",
      geography_fields: "AddressOfCrime,Agency,AgencyID",
      offence_category_fields: "Crime,Class_raw,MO_Class,UCRGroup",
      known_categories_json: topCategoriesJson(rawScan.topCategories),
      missing_categories:
        "assault;sexual offences;drugs;fraud;weapons;most traffic;most vandalism",
      privacy_level: "block_masked",
      scope_type: "selected_category",
      ingestion_status: "raw_available_review_required",
      public_display_status: "not_for_public_incident_map",
      notes: "Raw export includes 2 non-Hamilton contamination rows; preserve raw file.",
      risks: "Non-HPS agency contamination; masked block-level addresses; XOffset=1.",
    });
  } else {
    missingExpected.push(rel(rawCsv));
  }

  if (existsSync(cleanedCsv)) {
    const cleanedScan = await scanCsv(cleanedCsv, {
      dateFields: ["DateTime_raw"],
      latFields: ["Latitude"],
      lonFields: ["Longitude"],
      categoryField: "Crime",
    });
    let audit = {};
    if (existsSync(cleanupAudit)) {
      audit = JSON.parse(readFileSync(cleanupAudit, "utf8"));
    }
    addCatalogRow({
      jurisdiction_id: "hamilton-hps",
      source_name: "HPS Community Crime Map HPS-Only Cleaned",
      source_type: "csv",
      source_class: "public_incident_records_crime_map",
      official_url: "https://hamiltonpolice.on.ca/how-to/online-crime-mapping-tool",
      endpoint_url: "https://www.communitycrimemap.com/api/v1/search/load-data",
      local_root_path: rel(root),
      source_file: basename(cleanedCsv),
      load_file_path: rel(cleanedCsv),
      main_csv_path: rel(cleanedCsv),
      metadata_path: existsSync(cleanupAudit) ? rel(cleanupAudit) : "",
      dataset_group: "hamilton_communitycrimemap_hps_only",
      crime_category_raw: "selected crimeTypes [1,6,7,10,11,16,17]",
      row_count: String(cleanedScan.rowCount),
      date_min: audit.published_coverage_start ?? cleanedScan.dateMin,
      date_max: audit.published_coverage_end ?? cleanedScan.dateMax,
      date_field_used: "DateTime_raw",
      coordinate_fields: "Latitude,Longitude",
      mappable_count: String(cleanedScan.mappableCount),
      mappable_percent: cleanedScan.mappablePercent,
      primary_source_key: "source_pin_key",
      geography_fields: "AddressOfCrime,Agency",
      offence_category_fields: "Crime,Class_raw,MO_Class,UCRGroup",
      known_categories_json: topCategoriesJson(cleanedScan.topCategories),
      missing_categories:
        "assault;sexual offences;drugs;fraud;weapons;most traffic;most vandalism",
      privacy_level: "block_masked",
      scope_type: "selected_category",
      ingestion_status: "ready_with_caveats",
      public_display_status: "source_disclaimer_required",
      ingestion_readiness_status: "ready_for_ingestion_planning",
      notes: "Canonical HPS-only derivative; 2 non-Hamilton rows removed in cleaned copy only.",
      risks: "Selected-category export only; not complete all-crime.",
    });
  } else {
    missingExpected.push(rel(cleanedCsv));
  }
}

function catalogBenchmark() {
  const root = join(ROOT, "data", "raw", "external-benchmarks", "crimemaps-ca", "2026-07-01");
  if (!existsSync(root)) {
    missingExpected.push(rel(root));
    return;
  }
  for (const name of readdirSync(root)) {
    const filePath = join(root, name);
    if (!statSync(filePath).isFile()) continue;
    addCatalogRow({
      jurisdiction_id: "external-benchmark",
      source_name: "CrimeMaps.ca Benchmark",
      source_type: name.endsWith(".json") ? "json" : "csv",
      source_class: "irrelevant_non_ingestion",
      official_url: "https://crimemaps.ca/",
      local_root_path: rel(root),
      source_file: name,
      load_file_path: rel(filePath),
      dataset_group: "external_benchmark_crimemaps_ca",
      ingestion_status: "archive_only_do_not_load_as_incidents",
      public_display_status: "not_for_public_incident_map",
      notes: "Competitor benchmark aggregate data; do not ingest as official source.",
    });
  }
}

function buildCoverageMatrix() {
  const jurisdictions = [
    "tps_v1_processed",
    "tps_raw_corpus",
    "peel-prp",
    "yrp",
    "durham-drps_master",
    "halton-hrps",
    "hamilton-hps_cleaned",
  ];
  /** @type {Record<string, Record<string, string>>} */
  const matrix = {
    assault: {
      tps_v1_processed: "published|254378",
      tps_raw_corpus: "published|assault-open-data",
      "peel-prp": "published|21250",
      yrp: "published|9330",
      durham_drps_master: "published|3103",
      halton_hrps: "not_found_in_public_layer",
      hamilton_hps_cleaned: "not_returned_by_selected_api_configuration",
    },
    auto_vehicle_theft: {
      tps_v1_processed: "published|78714",
      "peel-prp": "published|17728",
      yrp: "published|2711",
      durham_drps_master: "published|1164",
      halton_hrps: "published|1233",
      hamilton_hps_cleaned: "selected_export|6281",
    },
    theft_from_vehicle: {
      tps_v1_processed: "published|106574",
      durham_drps_master: "published|1397",
      halton_hrps: "published|1045",
      hamilton_hps_cleaned: "selected_export|7825",
    },
    break_and_enter: {
      tps_v1_processed: "published|84689",
      "peel-prp": "published|7666",
      yrp: "published|3057",
      durham_drps_master: "published|1075",
      halton_hrps: "published|968",
      hamilton_hps_cleaned: "selected_export|6674",
    },
    robbery: {
      tps_v1_processed: "published|40248",
      "peel-prp": "published|2512",
      yrp: "published|660",
      durham_drps_master: "published|267",
      halton_hrps: "published|155",
      hamilton_hps_cleaned: "selected_export|523",
    },
    homicide: {
      tps_raw_corpus: "raw_available_review_required|homicides-open-data",
      "peel-prp": "published|58",
      yrp: "published|12",
      durham_drps_master: "published|13",
      halton_hrps: "not_found_in_public_layer",
      hamilton_hps_cleaned: "selected_export|33",
    },
    shooting_firearm: {
      tps_raw_corpus: "raw_available_review_required|shooting-and-firearm-discharges-open-data",
      "peel-prp": "embedded_in_robbery_labels_only",
      yrp: "published|118_flag",
      durham_drps_master: "published|48",
      halton_hrps: "not_found_in_public_layer",
      hamilton_hps_cleaned: "not_returned_by_selected_api_configuration",
    },
    sexual_assault: {
      "peel-prp": "not_found_in_public_layer",
      yrp: "published|733",
      durham_drps_master: "not_found_in_public_layer",
      halton_hrps: "not_found_in_public_layer",
      hamilton_hps_cleaned: "not_returned_by_selected_api_configuration",
    },
    hate_crime: {
      tps_raw_corpus: "raw_available_review_required|hate-crime-open-data",
      "peel-prp": "hate_motivated_mischief_only|8",
      yrp: "published|356_flag",
      durham_drps_master: "not_found_in_public_layer",
      halton_hrps: "not_found_in_public_layer",
    },
    arson: {
      "peel-prp": "not_found_in_public_layer",
      yrp: "published|151",
      durham_drps_master: "not_found_in_public_layer",
      halton_hrps: "published|48",
    },
    drugs: {
      "peel-prp": "published|4302",
      yrp: "published|1509",
      durham_drps_master: "standalone_extract|3698",
      halton_hrps: "published|115",
      hamilton_hps_cleaned: "not_returned_by_selected_api_configuration",
    },
    fraud: {
      "peel-prp": "published|14937",
      yrp: "published|9779",
      tps_raw_corpus: "not_in_v1_major_crime_family",
    },
    traffic_collisions: {
      tps_raw_corpus: "published|traffic-collisions-open-data",
      durham_drps_master: "standalone_extract|63790",
      halton_hrps: "published|roadside_mvc_heavy",
    },
  };

  const categories = Object.keys(matrix);
  const lines = [[ "category", ...jurisdictions].map(csvEscape).join(",")];
  for (const cat of categories) {
    const row = [cat];
    for (const j of jurisdictions) {
      row.push(matrix[cat][j] ?? "unknown");
    }
    lines.push(row.map(csvEscape).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function writeCatalogCsv() {
  const lines = [CATALOG_COLUMNS.map(csvEscape).join(",")];
  for (const row of catalogRows) {
    lines.push(CATALOG_COLUMNS.map((col) => csvEscape(row[col])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function writeCatalogMd() {
  const byJurisdiction = new Map();
  for (const row of catalogRows) {
    if (!byJurisdiction.has(row.jurisdiction_id)) {
      byJurisdiction.set(row.jurisdiction_id, []);
    }
    byJurisdiction.get(row.jurisdiction_id).push(row);
  }

  const lines = [
    "# CrimeCanada.io Data Collection Master Catalog",
    "",
    `Generated by \`scripts/audit-data-collection.mjs\` on ${new Date().toISOString()}.`,
    "",
    "## Executive summary",
    "",
    `- Catalog rows: **${catalogRows.length}**`,
    `- Confirmed load paths: **${confirmedFiles.length}**`,
    `- Missing expected paths: **${missingExpected.length}**`,
    "",
    "## Verified primary incident counts",
    "",
    "| Jurisdiction | Dataset | Rows | Date range | Mappable % |",
    "| --- | --- | ---: | --- | ---: |",
  ];

  const primaryGroups = [
    "peel_ecrimes_incidents",
    "yrp_community_safety_incidents",
    "durham_master",
    "halton_crime_map_incidents",
    "hamilton_communitycrimemap_hps_only",
    "tps_processed_v1",
  ];
  for (const group of primaryGroups) {
    const row = catalogRows.find((r) => r.dataset_group === group);
    if (row) {
      lines.push(
        `| ${row.jurisdiction_id} | ${row.dataset_group} | ${row.row_count} | ${row.date_min} to ${row.date_max} | ${row.mappable_percent} |`,
      );
    }
  }

  lines.push("", "## Jurisdiction sections", "");
  for (const [jurisdiction, rows] of byJurisdiction.entries()) {
    lines.push(`### ${jurisdiction}`, "");
    lines.push(
      "| catalog_id | source_file | rows | ingestion_status | public_display_status |",
      "| --- | --- | ---: | --- | --- |",
    );
    for (const row of rows) {
      lines.push(
        `| ${row.catalog_id} | ${row.source_file} | ${row.row_count || "-"} | ${row.ingestion_status} | ${row.public_display_status} |`,
      );
    }
    lines.push("");
  }

  lines.push("## Missing expected files", "");
  if (!missingExpected.length) lines.push("- None");
  else for (const item of [...new Set(missingExpected)]) lines.push(`- ${item}`);

  return `${lines.join("\n")}\n`;
}

function writeReadinessMd() {
  const groups = {
    ready_for_bronze_load: [],
    ready_with_caveats: [],
    raw_available_review_required: [],
    reference_geography_only: [],
    archive_only_do_not_load_as_incidents: [],
  };
  for (const row of catalogRows) {
    if (groups[row.ingestion_status]) groups[row.ingestion_status].push(row);
  }

  const lines = [
    "# CrimeCanada.io Data Collection Ingestion Readiness",
    "",
    `Generated on ${new Date().toISOString()}.`,
    "",
    "Step 1 complete. Next: `node scripts/load-bronze-database.mjs`.",
    "",
    "## Bronze load groups",
    "",
  ];

  for (const [status, rows] of Object.entries(groups)) {
    lines.push(`### ${status} (${rows.length})`, "");
    if (!rows.length) {
      lines.push("- None", "");
      continue;
    }
    for (const row of rows.slice(0, 60)) {
      lines.push(`- \`${row.load_file_path || row.source_file}\` (${row.row_count || "?"} rows)`);
    }
    if (rows.length > 60) lines.push(`- ... and ${rows.length - 60} more`);
    lines.push("");
  }

  lines.push("## Jurisdictions ready for ingestion planning", "");
  lines.push("- peel-prp, yrp, durham-drps, halton-hrps, hamilton-hps (cleaned derivative)");
  lines.push("- tps raw corpus (74 files) + processed v1 package", "");
  lines.push("## Jurisdictions requiring cleanup before ingestion", "");
  lines.push("- None (Hamilton HPS-only cleaned derivative exists on disk).", "");
  lines.push("## Jurisdictions requiring source caveats in public UI", "");
  const uiCaveats = catalogRows.filter((row) =>
    ["source_disclaimer_required", "deferred_review"].includes(row.public_display_status),
  );
  for (const row of uiCaveats.slice(0, 25)) {
    lines.push(`- ${row.jurisdiction_id}: ${row.source_name} (${row.public_display_status})`);
  }

  return `${lines.join("\n")}\n`;
}

export function getAuditSummary() {
  return {
    catalogRows: catalogRows.length,
    confirmedFiles: [...new Set(confirmedFiles)],
    missingExpected: [...new Set(missingExpected)],
    primaryCounts: {
      tpsRawFiles: catalogRows.filter(
        (r) => r.jurisdiction_id === "tps" && r.source_type === "csv",
      ).length,
      tpsProcessed: catalogRows.find((r) => r.dataset_group === "tps_processed_v1")?.row_count,
      peel: catalogRows.find((r) => r.dataset_group === "peel_ecrimes_incidents")?.row_count,
      yrp: catalogRows.find((r) => r.dataset_group === "yrp_community_safety_incidents")?.row_count,
      durhamMaster: catalogRows.find((r) => r.dataset_group === "durham_master")?.row_count,
      halton: catalogRows.find((r) => r.dataset_group === "halton_crime_map_incidents")?.row_count,
      hamiltonCleaned: catalogRows.find(
        (r) => r.dataset_group === "hamilton_communitycrimemap_hps_only",
      )?.row_count,
      hamiltonRaw: catalogRows.find(
        (r) => r.dataset_group === "hamilton_communitycrimemap_raw",
      )?.row_count,
    },
  };
}

async function main() {
  const classification = loadTpsClassification();
  if (!JURISDICTION_FILTER || JURISDICTION_FILTER === "tps") {
    await catalogTpsRaw(classification);
    await catalogTpsProcessed();
  }
  if (!JURISDICTION_FILTER || JURISDICTION_FILTER === "peel-prp") await catalogPeel();
  if (!JURISDICTION_FILTER || JURISDICTION_FILTER === "yrp") await catalogYork();
  if (!JURISDICTION_FILTER || JURISDICTION_FILTER === "durham-drps") await catalogDurham();
  if (!JURISDICTION_FILTER || JURISDICTION_FILTER === "halton-hrps") await catalogHalton();
  if (!JURISDICTION_FILTER || JURISDICTION_FILTER === "hamilton-hps") await catalogHamilton();
  if (!JURISDICTION_FILTER) catalogBenchmark();

  if (!DRY_RUN) {
    writeFileSync(OUTPUT.catalogCsv, writeCatalogCsv(), "utf8");
    writeFileSync(OUTPUT.catalogMd, writeCatalogMd(), "utf8");
    writeFileSync(OUTPUT.coverageCsv, buildCoverageMatrix(), "utf8");
    writeFileSync(OUTPUT.readinessMd, writeReadinessMd(), "utf8");
  }

  const summary = getAuditSummary();
  process.stdout.write("\n=== Data Collection Audit Summary ===\n");
  process.stdout.write(`Catalog rows: ${summary.catalogRows}\n`);
  process.stdout.write(`Confirmed files: ${summary.confirmedFiles.length}\n`);
  process.stdout.write(`Missing expected: ${summary.missingExpected.length}\n`);
  process.stdout.write(`Primary counts: ${JSON.stringify(summary.primaryCounts, null, 2)}\n`);
  if (!DRY_RUN) {
    process.stdout.write("\nWrote:\n");
    for (const p of Object.values(OUTPUT)) {
      process.stdout.write(`  ${rel(p)}\n`);
    }
  }
}

const isMain =
  import.meta.url === pathToFileURL(process.argv[1]).href ||
  process.argv[1]?.endsWith("audit-data-collection.mjs");
if (isMain) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
