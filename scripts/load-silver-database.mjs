/**
 * Silver Phase 1 incident loader for CrimeCanada.io.
 * Reads 6 canonical bronze tables (read-only) and writes data/silver/crimecanada-silver.sqlite.
 *
 * Usage: node scripts/load-silver-database.mjs [--dry-run]
 */

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { DatabaseSync } from "node:sqlite";

const ROOT = process.cwd();
const BRONZE_PATH = join(ROOT, "data/bronze/crimecanada-bronze.sqlite");
const BRONZE_MANIFEST_PATH = join(ROOT, "data/bronze/bronze-load-manifest.json");
const CATALOG_PATH = join(ROOT, "data/DATA_COLLECTION_MASTER_CATALOG.csv");
const TAXONOMY_PATH = join(ROOT, "data/silver/SILVER_CATEGORY_TAXONOMY_V2_DRAFT.csv");
const SILVER_DIR = join(ROOT, "data/silver");
const SILVER_PATH = join(SILVER_DIR, "crimecanada-silver.sqlite");
const MANIFEST_PATH = join(SILVER_DIR, "silver-load-manifest.json");
const QA_REPORT_PATH = join(SILVER_DIR, "SILVER_LOAD_QA_REPORT.md");
const TABLE_COUNTS_PATH = join(SILVER_DIR, "SILVER_TABLE_COUNTS.csv");
const SAMPLE_QUERIES_PATH = join(SILVER_DIR, "SILVER_SAMPLE_QUERIES.sql");
const REBUILD_REPORT_PATH = join(SILVER_DIR, "SILVER_TAXONOMY_V2_REBUILD_REPORT.md");

const DRY_RUN = process.argv.includes("--dry-run");
const PREVIOUS_OTHER_COUNT = 111_664;
const TARGET_OTHER_COUNT = 12_939;

const ALLOWED_CATEGORY_FAMILIES = new Set([
  "assault",
  "auto_vehicle_theft",
  "theft_from_vehicle",
  "break_and_enter",
  "robbery",
  "homicide",
  "shooting_firearm",
  "weapons",
  "sexual_assault",
  "hate_crime",
  "arson",
  "drugs",
  "fraud",
  "mischief_property_damage",
  "impaired_driving",
  "traffic_collisions",
  "theft_other",
  "missing_person",
  "other_criminal_code",
  "other",
]);

/** @type {Array<{catalog_id: string, jurisdiction_id: string, bronze_table: string, expected_rows: number, transform_profile: string, dataset_group: string}>} */
const PHASE1_SOURCES = [
  {
    catalog_id: "cat-0075",
    jurisdiction_id: "tps",
    bronze_table: "bronze__tps__tps_processed_v1__tps_v1_v2_sqlite",
    expected_rows: 581_393,
    transform_profile: "tps_processed_v1",
    dataset_group: "tps_processed_v1",
  },
  {
    catalog_id: "cat-0076",
    jurisdiction_id: "peel-prp",
    bronze_table: "bronze__peel_prp__peel_ecrimes_incidents__peel_prp_ecrimes_2026_07_01_with_geometr",
    expected_rows: 82_401,
    transform_profile: "peel_ecrimes_incidents",
    dataset_group: "peel_ecrimes_incidents",
  },
  {
    catalog_id: "cat-0090",
    jurisdiction_id: "yrp",
    bronze_table: "bronze__yrp__yrp_community_safety_incidents__yrp_community_safety_occurrences_2026_07",
    expected_rows: 67_153,
    transform_profile: "yrp_community_safety_incidents",
    dataset_group: "yrp_community_safety_incidents",
  },
  {
    catalog_id: "cat-0093",
    jurisdiction_id: "durham-drps",
    bronze_table: "bronze__durham_drps__durham_master__durham_drps_avl_odp_crimemap_master_2026",
    expected_rows: 7_819,
    transform_profile: "durham_master",
    dataset_group: "durham_master",
  },
  {
    catalog_id: "cat-0105",
    jurisdiction_id: "halton-hrps",
    bronze_table: "bronze__halton_hrps__halton_crime_map_incidents__halton_hrps_crime_map_incidents_2026_07_",
    expected_rows: 20_252,
    transform_profile: "halton_crime_map_incidents",
    dataset_group: "halton_crime_map_incidents",
  },
  {
    catalog_id: "cat-0108",
    jurisdiction_id: "hamilton-hps",
    bronze_table:
      "bronze__hamilton_hps__hamilton_communitycrimemap_hps_only__hamilton_communitycrimemap_hps_only_2021",
    expected_rows: 21_367,
    transform_profile: "hamilton_communitycrimemap_hps_only",
    dataset_group: "hamilton_communitycrimemap_hps_only",
  },
];

const EXCLUDED_SOURCES = [
  { catalog_id: "cat-0010", reason: "TPS raw major-crime CSV; use processed V1 only" },
  { catalog_id: "cat-0011", reason: "TPS raw major-crime CSV; use processed V1 only" },
  { catalog_id: "cat-0013", reason: "TPS raw major-crime CSV; use processed V1 only" },
  { catalog_id: "cat-0061", reason: "TPS raw major-crime CSV; use processed V1 only" },
  { catalog_id: "cat-0067", reason: "TPS raw major-crime CSV; use processed V1 only" },
  { catalog_id: "cat-0068", reason: "TPS raw major-crime CSV; use processed V1 only" },
  { catalog_id: "cat-0012", reason: "TPS deferred raw major-crime CSV" },
  { catalog_id: "cat-0031", reason: "TPS sensitive/deferred raw source" },
  { catalog_id: "cat-0037", reason: "TPS sensitive/deferred raw source" },
  { catalog_id: "cat-0049", reason: "TPS sensitive/deferred raw source" },
  { catalog_id: "cat-0073", reason: "Traffic/collision table excluded from Phase 1 silver" },
  { catalog_id: "cat-0077", reason: "Peel legacy no-geometry CSV; primary with-geometry used" },
  { catalog_id: "cat-0092", reason: "YRP CCTV archive-only" },
  { catalog_id: "cat-0094", reason: "Durham standalone extract; master only in Phase 1" },
  { catalog_id: "cat-0095", reason: "Durham standalone extract; master only in Phase 1" },
  { catalog_id: "cat-0096", reason: "Durham standalone extract; master only in Phase 1" },
  { catalog_id: "cat-0097", reason: "Durham standalone extract; master only in Phase 1" },
  { catalog_id: "cat-0098", reason: "Durham standalone extract; master only in Phase 1" },
  { catalog_id: "cat-0099", reason: "Durham standalone extract; master only in Phase 1" },
  { catalog_id: "cat-0100", reason: "Durham standalone extract; master only in Phase 1" },
  { catalog_id: "cat-0106", reason: "Halton GeoJSON mirror; CSV only in Phase 1" },
  { catalog_id: "cat-0107", reason: "Hamilton raw export; HPS-only cleaned used" },
  { catalog_id: "cat-0109", reason: "CrimeMaps benchmark excluded" },
];

const PROVENANCE_COLUMNS = new Set([
  "_bronze_catalog_id",
  "_bronze_jurisdiction_id",
  "_bronze_source_path",
  "_bronze_loaded_at_utc",
  "_bronze_ingestion_status",
]);

const PEEL_OCC_TYPE = {
  ASL: "assault",
  VEH: "auto_vehicle_theft",
  FRA: "fraud",
  MIS: "mischief_property_damage",
  BNE: "break_and_enter",
  DRP: "drugs",
  ROB: "robbery",
  DRT: "theft_from_vehicle",
  HOM: "homicide",
};

const TPS_SLUG_FAMILY = {
  "assault-open-data": "assault",
  "auto-theft-open-data": "auto_vehicle_theft",
  "break-and-enter-open-data": "break_and_enter",
  "robbery-open-data": "robbery",
  "theft-from-motor-vehicle-open-data": "theft_from_vehicle",
  "theft-over-open-data": "theft_other",
};

function rel(p) {
  return relative(ROOT, p).replaceAll("\\", "/");
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

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function quoteIdent(name) {
  return `"${String(name).replaceAll('"', '""')}"`;
}

function readCatalog() {
  const lines = readFileSync(CATALOG_PATH, "utf8").split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    /** @type {Record<string, string>} */
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });
    return row;
  });
  return Object.fromEntries(rows.map((row) => [row.catalog_id, row]));
}

function pickField(row, aliases) {
  for (const alias of aliases) {
    if (Object.prototype.hasOwnProperty.call(row, alias)) {
      const value = row[alias];
      if (value != null && String(value).trim() !== "") return String(value).trim();
    }
  }
  return "";
}

function parseNumber(raw) {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function parseIsoDate(raw) {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  if (/^\d{13}$/.test(value)) {
    const parsed = new Date(Number(value));
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }
  if (/^\d{10}$/.test(value)) {
    const parsed = new Date(Number(value) * 1000);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const dmy = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (dmy) {
    const [, dd, mm, yyyy] = dmy;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return "";
}

function computeMappable(lat, lng) {
  if (lat == null || lng == null) return 0;
  if (lat === 0 && lng === 0) return 0;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return 0;
  return 1;
}

function normalizeLabel(text) {
  return String(text ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function buildSourceFieldsJson(row) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    if (PROVENANCE_COLUMNS.has(key)) continue;
    out[key] = value == null ? "" : String(value);
  }
  return JSON.stringify(out);
}

function durhamOccurrenceGroupKey(eventUniqueId) {
  const value = String(eventUniqueId ?? "").trim();
  if (!value) return "";
  const idx = value.lastIndexOf("_");
  if (idx > 0) return value.slice(0, idx);
  return value;
}

function loadTaxonomyRows() {
  const lines = readFileSync(TAXONOMY_PATH, "utf8").split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    /** @type {Record<string, string>} */
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });
    return row;
  });
}

function buildTaxonomyIndex(taxonomyRows) {
  /** @type {Map<string, {category_family: string, category_canonical: string, mapping_confidence: string}>} */
  const exact = new Map();
  for (const row of taxonomyRows) {
    const key = `${row.source_jurisdiction}::${normalizeLabel(row.source_label)}`;
    exact.set(key, {
      category_family: row.category_family,
      category_canonical: row.category_canonical,
      mapping_confidence: row.mapping_confidence || "medium",
    });
  }
  return exact;
}

function keywordFamily(text) {
  const value = normalizeLabel(text);
  if (!value) return null;
  if (/\b(homicide|murder|attempt murder)\b/.test(value)) return "homicide";
  if (/\b(shoot|firearm|gun)\b/.test(value)) return "shooting_firearm";
  if (/\b(sexual|sex assault)\b/.test(value)) return "sexual_assault";
  if (/\b(assault)\b/.test(value)) return "assault";
  if (/\b(robbery|rob\b)/.test(value)) return "robbery";
  if (/\bbreak\s*(?:&|and)\s*enter\b|b&e|bne\b/.test(value)) return "break_and_enter";
  if (/\b(theft of motor vehicle|auto theft|vehicle theft|theft - automobile|theft - truck)\b/.test(value)) {
    return "auto_vehicle_theft";
  }
  if (/\b(theft from vehicle|theft from mv|theft from auto|from motor vehicle)\b/.test(value)) {
    return "theft_from_vehicle";
  }
  if (/\b(theft under|theft over)\b/.test(value)) return "theft_other";
  if (/\b(fraud)\b/.test(value)) return "fraud";
  if (/\b(drug|narcotic|cannabis|cocaine)\b/.test(value)) return "drugs";
  if (/\b(arson)\b/.test(value)) return "arson";
  if (/\b(mischief|property damage|vandal)\b/.test(value)) return "mischief_property_damage";
  if (/\b(hate)\b/.test(value)) return "hate_crime";
  if (/\b(weapon)\b/.test(value)) return "weapons";
  if (/\b(impaired|roadside test|over 80)\b/.test(value)) return "impaired_driving";
  if (/\bmvc\b|traffic collision|dangerous operation/.test(value)) return "traffic_collisions";
  if (/\bmissing person\b/.test(value)) return "missing_person";
  return null;
}

function normalizeTaxonomyFamily(taxonomyRow) {
  const family = String(taxonomyRow.category_family ?? "").trim();
  if (family === "other_criminal_code") return "other";
  if (ALLOWED_CATEGORY_FAMILIES.has(family)) return family;
  if (family === "auto_theft") return "auto_vehicle_theft";
  if (family === "theft_from_motor_vehicle") return "theft_from_vehicle";
  if (family === "theft_over") return "theft_other";
  const fromCanonical = keywordFamily(taxonomyRow.category_canonical);
  if (fromCanonical) return fromCanonical;
  const fromLabel = keywordFamily(taxonomyRow.source_label);
  if (fromLabel) return fromLabel;
  if (!family || family.includes("|") || family.includes("[")) return "other";
  return family;
}

function mapCategory(jurisdictionId, labels, taxonomyIndex) {
  if (jurisdictionId === "peel-prp") {
    for (const label of labels) {
      const peelCode = String(label ?? "").trim().toUpperCase();
      if (PEEL_OCC_TYPE[peelCode]) {
        const family = PEEL_OCC_TYPE[peelCode];
        return {
          category_family: family,
          category_canonical: family.replaceAll("_", " "),
          mapping_confidence: "high",
        };
      }
    }
  }

  for (const label of labels) {
    const trimmed = String(label ?? "").trim();
    if (!trimmed) continue;
    const exact = taxonomyIndex.get(`${jurisdictionId}::${normalizeLabel(trimmed)}`);
    if (exact && exact.mapping_confidence !== "low") {
      const family = normalizeTaxonomyFamily(exact);
      return {
        category_family: family,
        category_canonical: exact.category_canonical,
        mapping_confidence: exact.mapping_confidence || "high",
      };
    }
  }

  for (const label of labels) {
    const trimmed = String(label ?? "").trim();
    if (!trimmed) continue;
    const family = keywordFamily(trimmed);
    if (family) {
      return {
        category_family: family,
        category_canonical: family.replaceAll("_", " "),
        mapping_confidence: "medium",
      };
    }
  }

  const fallbackLabel = String(labels.find((l) => String(l ?? "").trim()) ?? "other").trim();
  return {
    category_family: "other",
    category_canonical: fallbackLabel || "other",
    mapping_confidence: "low",
  };
}

function resolveCatalogMeta(source, catalogById, warnings) {
  let catalogId = source.catalog_id;
  let warning = "";
  const cat = catalogById[catalogId];
  if (!cat) {
    warning = `Catalog row missing for ${catalogId}; using source defaults`;
    warnings.push(warning);
    return {
      catalog_id: catalogId,
      dataset_slug: source.dataset_group,
      privacy_level: "exact_unknown",
      public_display_status: "published_v1",
      scope_type: "processed_canonical",
      warning,
    };
  }
  return {
    catalog_id: catalogId,
    dataset_slug: cat.crime_category_raw || source.dataset_group,
    privacy_level: cat.privacy_level || "exact_unknown",
    public_display_status: cat.public_display_status || "published_v1",
    scope_type: cat.scope_type || "processed_canonical",
    warning,
  };
}

function transformTpsProcessed(row, source, meta, normalizedAt, taxonomyIndex) {
  const sourceRecordId = pickField(row, ["source_record_id", "event_unique_id"]);
  const lat = parseNumber(row.lat);
  const lng = parseNumber(row.lng);
  const mappable =
    row.mappable === "1" || row.mappable === 1
      ? 1
      : row.mappable === "0" || row.mappable === 0
        ? 0
        : computeMappable(lat, lng);
  const offenceRaw = pickField(row, ["offence"]);
  const csiCategory = pickField(row, ["csi_category"]);
  const datasetSlug = pickField(row, ["dataset_slug"]);
  const slugFamily = TPS_SLUG_FAMILY[datasetSlug];
  const mapped = slugFamily
    ? {
        category_family: slugFamily,
        category_canonical: slugFamily.replaceAll("_", " "),
        mapping_confidence: "high",
      }
    : mapCategory("tps", [offenceRaw, csiCategory, datasetSlug], taxonomyIndex);

  return {
    silver_record_key: `${source.jurisdiction_id}:${meta.catalog_id}:${pickField(row, ["record_key"]) || `${datasetSlug}:${sourceRecordId}`}`,
    catalog_id: meta.catalog_id,
    jurisdiction_id: source.jurisdiction_id,
    dataset_group: source.dataset_group,
    dataset_slug: datasetSlug || meta.dataset_slug,
    source_record_id: sourceRecordId,
    occurrence_group_key: pickField(row, ["event_unique_id"]),
    occ_date: parseIsoDate(row.occ_date),
    report_date: parseIsoDate(row.report_date),
    offence_raw: offenceRaw,
    category_canonical: mapped.category_canonical,
    category_family: mapped.category_family,
    division: pickField(row, ["division"]),
    municipality: "Toronto",
    neighbourhood_primary: pickField(row, ["neighbourhood_158", "hood_158"]),
    lat,
    lng,
    mappable,
    privacy_level: meta.privacy_level,
    public_display_status: meta.public_display_status,
    scope_type: meta.scope_type,
    source_fields_json: buildSourceFieldsJson(row),
    bronze_table: source.bronze_table,
    normalized_at_utc: normalizedAt,
    mapping_confidence: mapped.mapping_confidence,
  };
}

function transformPeel(row, source, meta, normalizedAt, taxonomyIndex) {
  const sourceRecordId = pickField(row, ["objectid"]);
  const lat = parseNumber(row.latitude);
  const lng = parseNumber(row.longitude);
  const occType = pickField(row, ["occtype"]);
  const description = pickField(row, ["description"]);
  const mapped = mapCategory("peel-prp", [occType, description], taxonomyIndex);

  return {
    silver_record_key: `${source.jurisdiction_id}:${meta.catalog_id}:${sourceRecordId}`,
    catalog_id: meta.catalog_id,
    jurisdiction_id: source.jurisdiction_id,
    dataset_group: source.dataset_group,
    dataset_slug: meta.dataset_slug,
    source_record_id: sourceRecordId,
    occurrence_group_key: pickField(row, ["occurrencenumber"]),
    occ_date: parseIsoDate(pickField(row, ["occurrencedate", "occdate", "occdateutc"])),
    report_date: parseIsoDate(pickField(row, ["occdateutc", "occdate"])),
    offence_raw: description,
    category_canonical: mapped.category_canonical,
    category_family: mapped.category_family,
    division: pickField(row, ["division"]),
    municipality: pickField(row, ["municipality"]),
    neighbourhood_primary: pickField(row, ["patrolzone", "ward"]),
    lat,
    lng,
    mappable: computeMappable(lat, lng),
    privacy_level: meta.privacy_level,
    public_display_status: meta.public_display_status,
    scope_type: meta.scope_type,
    source_fields_json: buildSourceFieldsJson(row),
    bronze_table: source.bronze_table,
    normalized_at_utc: normalizedAt,
    mapping_confidence: mapped.mapping_confidence,
  };
}

function transformYrp(row, source, meta, normalizedAt, taxonomyIndex) {
  const sourceRecordId = pickField(row, ["uniqueidentifier"]);
  const lat = parseNumber(row.latitude);
  const lng = parseNumber(row.longitude);
  const offenceRaw = pickField(row, ["case_type_pubtrans", "occ_type"]);
  const mapped = mapCategory(
    "yrp",
    [offenceRaw, pickField(row, ["case_category1"]), pickField(row, ["occ_type"])],
    taxonomyIndex,
  );

  return {
    silver_record_key: `${source.jurisdiction_id}:${meta.catalog_id}:${sourceRecordId}`,
    catalog_id: meta.catalog_id,
    jurisdiction_id: source.jurisdiction_id,
    dataset_group: source.dataset_group,
    dataset_slug: meta.dataset_slug,
    source_record_id: sourceRecordId,
    occurrence_group_key: pickField(row, ["occ_id"]),
    occ_date: parseIsoDate(row.occ_date),
    report_date: parseIsoDate(row.rep_date),
    offence_raw: offenceRaw,
    category_canonical: mapped.category_canonical,
    category_family: mapped.category_family,
    division: pickField(row, ["district"]),
    municipality: pickField(row, ["municipality"]),
    neighbourhood_primary: pickField(row, ["sector", "locationcode"]),
    lat,
    lng,
    mappable: computeMappable(lat, lng),
    privacy_level: meta.privacy_level,
    public_display_status: meta.public_display_status,
    scope_type: meta.scope_type,
    source_fields_json: buildSourceFieldsJson(row),
    bronze_table: source.bronze_table,
    normalized_at_utc: normalizedAt,
    mapping_confidence: mapped.mapping_confidence,
  };
}

function transformDurham(row, source, meta, normalizedAt, taxonomyIndex) {
  const sourceRecordId = pickField(row, ["event_unique_id"]);
  const lat = parseNumber(row.lat);
  const lng = parseNumber(row.lon);
  const offenceRaw = pickField(row, ["crime_category"]);
  const mapped = mapCategory("durham-drps", [offenceRaw], taxonomyIndex);

  return {
    silver_record_key: `${source.jurisdiction_id}:${meta.catalog_id}:${sourceRecordId}`,
    catalog_id: meta.catalog_id,
    jurisdiction_id: source.jurisdiction_id,
    dataset_group: source.dataset_group,
    dataset_slug: meta.dataset_slug,
    source_record_id: sourceRecordId,
    occurrence_group_key: durhamOccurrenceGroupKey(sourceRecordId),
    occ_date: parseIsoDate(row.occ_date),
    report_date: parseIsoDate(row.report_date),
    offence_raw: offenceRaw,
    category_canonical: mapped.category_canonical,
    category_family: mapped.category_family,
    division: pickField(row, ["division"]),
    municipality: pickField(row, ["municipality"]),
    neighbourhood_primary: pickField(row, ["neighbourhood"]),
    lat,
    lng,
    mappable: computeMappable(lat, lng),
    privacy_level: meta.privacy_level,
    public_display_status: meta.public_display_status,
    scope_type: meta.scope_type,
    source_fields_json: buildSourceFieldsJson(row),
    bronze_table: source.bronze_table,
    normalized_at_utc: normalizedAt,
    mapping_confidence: mapped.mapping_confidence,
  };
}

function transformHalton(row, source, meta, normalizedAt, taxonomyIndex) {
  const sourceRecordId = pickField(row, ["globalid"]);
  const lat = parseNumber(row.latitude);
  const lng = parseNumber(row.longitude);
  const offenceRaw = pickField(row, ["description"]);
  const mapped = mapCategory("halton-hrps", [offenceRaw], taxonomyIndex);

  return {
    silver_record_key: `${source.jurisdiction_id}:${meta.catalog_id}:${sourceRecordId}`,
    catalog_id: meta.catalog_id,
    jurisdiction_id: source.jurisdiction_id,
    dataset_group: source.dataset_group,
    dataset_slug: meta.dataset_slug,
    source_record_id: sourceRecordId,
    occurrence_group_key: pickField(row, ["case_no"]),
    occ_date: parseIsoDate(pickField(row, ["date_utc", "date"])),
    report_date: parseIsoDate(pickField(row, ["date_utc"])),
    offence_raw: offenceRaw,
    category_canonical: mapped.category_canonical,
    category_family: mapped.category_family,
    division: "",
    municipality: pickField(row, ["city"]),
    neighbourhood_primary: pickField(row, ["location"]),
    lat,
    lng,
    mappable: computeMappable(lat, lng),
    privacy_level: meta.privacy_level,
    public_display_status: meta.public_display_status,
    scope_type: meta.scope_type,
    source_fields_json: buildSourceFieldsJson(row),
    bronze_table: source.bronze_table,
    normalized_at_utc: normalizedAt,
    mapping_confidence: mapped.mapping_confidence,
  };
}

function transformHamilton(row, source, meta, normalizedAt, taxonomyIndex) {
  const sourceRecordId = pickField(row, ["entityid", "source_pin_key"]);
  const lat = parseNumber(row.latitude);
  const lng = parseNumber(row.longitude);
  const offenceRaw = pickField(row, ["crime"]);
  const mapped = mapCategory(
    "hamilton-hps",
    [offenceRaw, pickField(row, ["mo_class"]), pickField(row, ["ucrgroup"])],
    taxonomyIndex,
  );

  return {
    silver_record_key: `${source.jurisdiction_id}:${meta.catalog_id}:${sourceRecordId}`,
    catalog_id: meta.catalog_id,
    jurisdiction_id: source.jurisdiction_id,
    dataset_group: source.dataset_group,
    dataset_slug: meta.dataset_slug,
    source_record_id: sourceRecordId,
    occurrence_group_key: pickField(row, ["irnumber", "referenceid"]),
    occ_date: parseIsoDate(row.datetime_raw),
    report_date: "",
    offence_raw: offenceRaw,
    category_canonical: mapped.category_canonical,
    category_family: mapped.category_family,
    division: "",
    municipality: "Hamilton",
    neighbourhood_primary: "",
    lat,
    lng,
    mappable: computeMappable(lat, lng),
    privacy_level: meta.privacy_level,
    public_display_status: meta.public_display_status,
    scope_type: meta.scope_type,
    source_fields_json: buildSourceFieldsJson(row),
    bronze_table: source.bronze_table,
    normalized_at_utc: normalizedAt,
    mapping_confidence: mapped.mapping_confidence,
  };
}

function getTransformer(profile) {
  switch (profile) {
    case "tps_processed_v1":
      return transformTpsProcessed;
    case "peel_ecrimes_incidents":
      return transformPeel;
    case "yrp_community_safety_incidents":
      return transformYrp;
    case "durham_master":
      return transformDurham;
    case "halton_crime_map_incidents":
      return transformHalton;
    case "hamilton_communitycrimemap_hps_only":
      return transformHamilton;
    default:
      throw new Error(`Unknown transform profile: ${profile}`);
  }
}

function createSilverSchema(db) {
  db.exec(`
    CREATE TABLE silver_incidents (
      silver_record_key TEXT PRIMARY KEY,
      catalog_id TEXT NOT NULL,
      jurisdiction_id TEXT NOT NULL,
      dataset_group TEXT NOT NULL,
      dataset_slug TEXT NOT NULL,
      source_record_id TEXT NOT NULL,
      occurrence_group_key TEXT,
      occ_date TEXT NOT NULL,
      report_date TEXT,
      offence_raw TEXT,
      category_canonical TEXT,
      category_family TEXT,
      division TEXT,
      municipality TEXT,
      neighbourhood_primary TEXT,
      lat REAL,
      lng REAL,
      mappable INTEGER NOT NULL,
      privacy_level TEXT NOT NULL,
      public_display_status TEXT NOT NULL,
      scope_type TEXT NOT NULL,
      source_fields_json TEXT NOT NULL,
      bronze_table TEXT NOT NULL,
      normalized_at_utc TEXT NOT NULL
    );

    CREATE TABLE silver_lineage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_catalog_id TEXT NOT NULL,
      bronze_table TEXT NOT NULL,
      silver_table TEXT NOT NULL,
      rows_in INTEGER NOT NULL,
      rows_out INTEGER NOT NULL,
      transform_profile TEXT NOT NULL,
      mapping_confidence TEXT,
      warning_message TEXT,
      loaded_at_utc TEXT NOT NULL
    );

    CREATE TABLE silver_category_taxonomy (
      category_family TEXT NOT NULL,
      category_canonical TEXT NOT NULL,
      source_jurisdiction TEXT NOT NULL,
      source_label TEXT NOT NULL,
      source_count TEXT,
      coverage_matrix_status TEXT,
      publish_tier TEXT,
      mapping_confidence TEXT,
      notes TEXT
    );

    CREATE TABLE silver_load_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      catalog_id TEXT,
      bronze_table TEXT NOT NULL,
      silver_table TEXT NOT NULL,
      rows_in INTEGER NOT NULL,
      rows_out INTEGER NOT NULL,
      load_status TEXT NOT NULL,
      warning_message TEXT,
      error_message TEXT,
      loaded_at_utc TEXT NOT NULL
    );
  `);
}

function loadTaxonomyIntoSilver(db, taxonomyRows) {
  const insert = db.prepare(`
    INSERT INTO silver_category_taxonomy (
      category_family, category_canonical, source_jurisdiction, source_label,
      source_count, coverage_matrix_status, publish_tier, mapping_confidence, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const row of taxonomyRows) {
    insert.run(
      row.category_family,
      row.category_canonical,
      row.source_jurisdiction,
      row.source_label,
      row.source_count,
      row.coverage_matrix_status,
      row.publish_tier,
      row.mapping_confidence,
      row.notes,
    );
  }
}

function loadSource(db, bronzeDb, source, catalogById, taxonomyIndex, normalizedAt, warnings, errors) {
  const meta = resolveCatalogMeta(source, catalogById, warnings);
  const transformer = getTransformer(source.transform_profile);
  const rowsIn = bronzeDb
    .prepare(`SELECT COUNT(*) AS c FROM ${quoteIdent(source.bronze_table)}`)
    .get().c;

  if (DRY_RUN) {
    return { rows_in: rowsIn, rows_out: rowsIn, mapping_confidence: "high", warning_message: meta.warning };
  }

  if (source.catalog_id === "cat-0108") {
    const missingCatalog = bronzeDb
      .prepare(
        `SELECT COUNT(*) AS c FROM ${quoteIdent(source.bronze_table)} WHERE _bronze_catalog_id IS NULL OR _bronze_catalog_id = ''`,
      )
      .get().c;
    if (missingCatalog > 0) {
      warnings.push(
        `Hamilton bronze rows missing _bronze_catalog_id (${missingCatalog} rows); resolved lineage via manifest catalog_id=${source.catalog_id} and bronze_table=${source.bronze_table}`,
      );
    }
  }

  const bronzeRows = bronzeDb
    .prepare(`SELECT * FROM ${quoteIdent(source.bronze_table)}`)
    .all();
  const insert = db.prepare(`
    INSERT INTO silver_incidents (
      silver_record_key, catalog_id, jurisdiction_id, dataset_group, dataset_slug,
      source_record_id, occurrence_group_key, occ_date, report_date, offence_raw,
      category_canonical, category_family, division, municipality, neighbourhood_primary,
      lat, lng, mappable, privacy_level, public_display_status, scope_type,
      source_fields_json, bronze_table, normalized_at_utc
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let rowsOut = 0;
  let lowConfidence = 0;
  let sourceWarning = meta.warning || "";
  db.exec("BEGIN");
  try {
    for (const row of bronzeRows) {
      const incident = transformer(row, source, meta, normalizedAt, taxonomyIndex);
      if (!incident.source_record_id) {
        throw new Error(`${source.catalog_id}: missing source_record_id`);
      }
      if (incident.mapping_confidence === "low") lowConfidence += 1;
      insert.run(
        incident.silver_record_key,
        incident.catalog_id,
        incident.jurisdiction_id,
        incident.dataset_group,
        incident.dataset_slug,
        incident.source_record_id,
        incident.occurrence_group_key,
        incident.occ_date,
        incident.report_date,
        incident.offence_raw,
        incident.category_canonical,
        incident.category_family,
        incident.division,
        incident.municipality,
        incident.neighbourhood_primary,
        incident.lat,
        incident.lng,
        incident.mappable,
        incident.privacy_level,
        incident.public_display_status,
        incident.scope_type,
        incident.source_fields_json,
        incident.bronze_table,
        incident.normalized_at_utc,
      );
      rowsOut += 1;
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    const message = error instanceof Error ? error.message : String(error);
    errors.push({ catalog_id: source.catalog_id, error: message });
    throw error;
  }

  if (lowConfidence > 0) {
    sourceWarning = [sourceWarning, `${lowConfidence} rows mapped with low confidence`]
      .filter(Boolean)
      .join("; ");
  }

  const mappingConfidence = lowConfidence > rowsOut * 0.5 ? "low" : lowConfidence > 0 ? "medium" : "high";

  db.prepare(`
    INSERT INTO silver_lineage (
      from_catalog_id, bronze_table, silver_table, rows_in, rows_out,
      transform_profile, mapping_confidence, warning_message, loaded_at_utc
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    meta.catalog_id,
    source.bronze_table,
    "silver_incidents",
    rowsIn,
    rowsOut,
    source.transform_profile,
    mappingConfidence,
    sourceWarning,
    normalizedAt,
  );

  db.prepare(`
    INSERT INTO silver_load_log (
      catalog_id, bronze_table, silver_table, rows_in, rows_out,
      load_status, warning_message, error_message, loaded_at_utc
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    meta.catalog_id,
    source.bronze_table,
    "silver_incidents",
    rowsIn,
    rowsOut,
    "loaded",
    sourceWarning,
    "",
    normalizedAt,
  );

  return {
    rows_in: rowsIn,
    rows_out: rowsOut,
    mapping_confidence: mappingConfidence,
    warning_message: sourceWarning,
  };
}

function runQa(db) {
  const checks = [];
  const tables = db
    .prepare("SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name")
    .all()
    .map((r) => r.name);
  for (const required of [
    "silver_incidents",
    "silver_lineage",
    "silver_category_taxonomy",
    "silver_load_log",
  ]) {
    checks.push({
      name: `table_exists_${required}`,
      pass: tables.includes(required),
      actual: tables.includes(required) ? "present" : "missing",
      expected: "present",
    });
  }

  const total = db.prepare("SELECT COUNT(*) AS c FROM silver_incidents").get().c;
  checks.push({
    name: "total_rows",
    pass: total === 780_385,
    actual: total,
    expected: 780_385,
  });

  const byJurisdiction = db
    .prepare(
      "SELECT jurisdiction_id, COUNT(*) AS c FROM silver_incidents GROUP BY jurisdiction_id ORDER BY jurisdiction_id",
    )
    .all();
  const expectedByJurisdiction = {
    tps: 581_393,
    "peel-prp": 82_401,
    yrp: 67_153,
    "durham-drps": 7_819,
    "halton-hrps": 20_252,
    "hamilton-hps": 21_367,
  };
  for (const [jid, expected] of Object.entries(expectedByJurisdiction)) {
    const actual = byJurisdiction.find((r) => r.jurisdiction_id === jid)?.c ?? 0;
    checks.push({
      name: `jurisdiction_rows_${jid}`,
      pass: actual === expected,
      actual,
      expected,
    });
  }

  const emptyJson = db
    .prepare(
      "SELECT COUNT(*) AS c FROM silver_incidents WHERE source_fields_json IS NULL OR source_fields_json = '' OR source_fields_json = '{}'",
    )
    .get().c;
  checks.push({
    name: "source_fields_json_populated",
    pass: emptyJson === 0,
    actual: emptyJson,
    expected: 0,
  });

  const loadErrors = db
    .prepare("SELECT COUNT(*) AS c FROM silver_load_log WHERE load_status != 'loaded' OR error_message != ''")
    .get().c;
  checks.push({
    name: "load_errors_zero",
    pass: loadErrors === 0,
    actual: loadErrors,
    expected: 0,
  });

  const excludedCatalogPresent = db
    .prepare(
      `SELECT COUNT(*) AS c FROM silver_incidents WHERE catalog_id NOT IN (${PHASE1_SOURCES.map(() => "?").join(", ")})`,
    )
    .get(...PHASE1_SOURCES.map((s) => s.catalog_id)).c;
  checks.push({
    name: "only_phase1_catalog_ids",
    pass: excludedCatalogPresent === 0,
    actual: excludedCatalogPresent,
    expected: 0,
  });

  const peelDupGroups = db
    .prepare(
      `SELECT COUNT(*) AS c FROM (
        SELECT occurrence_group_key FROM silver_incidents
        WHERE jurisdiction_id = 'peel-prp' AND occurrence_group_key != ''
        GROUP BY occurrence_group_key HAVING COUNT(*) > 1
      )`,
    )
    .get().c;
  checks.push({
    name: "peel_duplicate_occurrence_groups_preserved",
    pass: peelDupGroups > 0,
    actual: peelDupGroups,
    expected: ">0",
  });

  const keyDup = db
    .prepare("SELECT COUNT(*) AS total, COUNT(DISTINCT silver_record_key) AS distinct_keys FROM silver_incidents")
    .get();
  checks.push({
    name: "silver_record_key_unique",
    pass: keyDup.total === keyDup.distinct_keys,
    actual: keyDup.distinct_keys,
    expected: keyDup.total,
  });

  const otherCount = db.prepare("SELECT COUNT(*) AS c FROM silver_incidents WHERE category_family = 'other'").get().c;
  const otherWithinTarget = Math.abs(otherCount - TARGET_OTHER_COUNT) <= Math.round(TARGET_OTHER_COUNT * 0.05);
  checks.push({
    name: "other_bucket_near_target",
    pass: otherWithinTarget,
    actual: otherCount,
    expected: `~${TARGET_OTHER_COUNT}`,
  });

  const categoryFamilies = db
    .prepare(
      "SELECT category_family, COUNT(*) AS c FROM silver_incidents GROUP BY category_family ORDER BY c DESC",
    )
    .all();
  const dateRanges = db
    .prepare(
      `SELECT jurisdiction_id, MIN(occ_date) AS min_date, MAX(occ_date) AS max_date
       FROM silver_incidents WHERE occ_date != '' GROUP BY jurisdiction_id ORDER BY jurisdiction_id`,
    )
    .all();
  const mappable = db
    .prepare(
      `SELECT jurisdiction_id,
              COUNT(*) AS total,
              SUM(CASE WHEN mappable = 1 THEN 1 ELSE 0 END) AS mappable_rows,
              ROUND(100.0 * SUM(CASE WHEN mappable = 1 THEN 1 ELSE 0 END) / COUNT(*), 2) AS mappable_percent
       FROM silver_incidents GROUP BY jurisdiction_id ORDER BY jurisdiction_id`,
    )
    .all();

  const hardFailures = checks.filter(
    (c) =>
      !c.pass &&
      c.name !== "peel_duplicate_occurrence_groups_preserved" &&
      c.name !== "other_bucket_near_target",
  );
  const pass = hardFailures.length === 0;
  const otherCheck = checks.find((c) => c.name === "other_bucket_near_target");

  return {
    checks,
    total,
    byJurisdiction,
    categoryFamilies,
    dateRanges,
    mappable,
    pass,
    loadErrors,
    otherCount,
    otherWithinTarget: otherCheck?.pass ?? false,
  };
}

function writeSampleQueries() {
  const sql = `-- CrimeCanada.io Silver Sample Queries
-- Generated: ${new Date().toISOString()}
-- Database: data/silver/crimecanada-silver.sqlite

-- Total rows by jurisdiction
SELECT jurisdiction_id, COUNT(*) AS total_rows
FROM silver_incidents
GROUP BY jurisdiction_id
ORDER BY total_rows DESC;

-- Rows by category_family
SELECT category_family, COUNT(*) AS total_rows
FROM silver_incidents
GROUP BY category_family
ORDER BY total_rows DESC;

-- Rows by year and jurisdiction
SELECT jurisdiction_id, SUBSTR(occ_date, 1, 4) AS occ_year, COUNT(*) AS total_rows
FROM silver_incidents
WHERE occ_date != ''
GROUP BY jurisdiction_id, occ_year
ORDER BY jurisdiction_id, occ_year;

-- Top 20 offence_raw labels
SELECT offence_raw, COUNT(*) AS total_rows
FROM silver_incidents
GROUP BY offence_raw
ORDER BY total_rows DESC
LIMIT 20;

-- Mappable percent by jurisdiction
SELECT jurisdiction_id,
       COUNT(*) AS total_rows,
       SUM(CASE WHEN mappable = 1 THEN 1 ELSE 0 END) AS mappable_rows,
       ROUND(100.0 * SUM(CASE WHEN mappable = 1 THEN 1 ELSE 0 END) / COUNT(*), 2) AS mappable_percent
FROM silver_incidents
GROUP BY jurisdiction_id
ORDER BY jurisdiction_id;

-- Hard-crime counts by jurisdiction
SELECT jurisdiction_id, category_family, COUNT(*) AS total_rows
FROM silver_incidents
WHERE category_family IN ('assault', 'robbery', 'homicide', 'shooting_firearm', 'sexual_assault', 'arson')
GROUP BY jurisdiction_id, category_family
ORDER BY jurisdiction_id, category_family;

-- Sample Hamilton rows
SELECT silver_record_key, occ_date, offence_raw, category_family, municipality, lat, lng, mappable
FROM silver_incidents
WHERE jurisdiction_id = 'hamilton-hps'
LIMIT 10;

-- Sample Peel duplicate OccurrenceNumber rows
SELECT occurrence_group_key, COUNT(*) AS row_count
FROM silver_incidents
WHERE jurisdiction_id = 'peel-prp'
GROUP BY occurrence_group_key
HAVING COUNT(*) > 1
ORDER BY row_count DESC
LIMIT 10;

-- Sample York homicide / sexual / arson rows if present
SELECT offence_raw, category_family, occ_date, municipality, lat, lng
FROM silver_incidents
WHERE jurisdiction_id = 'yrp'
  AND category_family IN ('homicide', 'sexual_assault', 'arson')
LIMIT 20;

-- Sample Durham shooting / firearm rows if present
SELECT offence_raw, category_family, occ_date, municipality, lat, lng
FROM silver_incidents
WHERE jurisdiction_id = 'durham-drps'
  AND (category_family = 'shooting_firearm' OR LOWER(offence_raw) LIKE '%shoot%' OR LOWER(offence_raw) LIKE '%firearm%')
LIMIT 20;

-- Sample Halton robbery / arson / weapons rows if present
SELECT offence_raw, category_family, occ_date, municipality, lat, lng
FROM silver_incidents
WHERE jurisdiction_id = 'halton-hrps'
  AND (
    category_family IN ('robbery', 'arson')
    OR LOWER(offence_raw) LIKE '%robbery%'
    OR LOWER(offence_raw) LIKE '%arson%'
    OR LOWER(offence_raw) LIKE '%weapon%'
  )
LIMIT 20;

-- Sample TPS assault / robbery / auto theft rows
SELECT offence_raw, category_family, dataset_slug, occ_date, division, lat, lng, mappable
FROM silver_incidents
WHERE jurisdiction_id = 'tps'
  AND category_family IN ('assault', 'robbery', 'auto_vehicle_theft')
LIMIT 20;
`;
  writeFileSync(SAMPLE_QUERIES_PATH, sql, "utf8");
}

function writeTableCounts(db) {
  const rows = db
    .prepare(
      `SELECT 'silver_incidents' AS table_name, jurisdiction_id, COUNT(*) AS row_count
       FROM silver_incidents GROUP BY jurisdiction_id
       UNION ALL
       SELECT 'silver_lineage', transform_profile, rows_out FROM silver_lineage
       UNION ALL
       SELECT 'silver_category_taxonomy', source_jurisdiction, COUNT(*) FROM silver_category_taxonomy GROUP BY source_jurisdiction
       UNION ALL
       SELECT 'silver_load_log', catalog_id, rows_out FROM silver_load_log`,
    )
    .all();
  const lines = ["table_name,partition,row_count", ...rows.map((r) => [r.table_name, r.jurisdiction_id, r.row_count].map(csvEscape).join(","))];
  writeFileSync(TABLE_COUNTS_PATH, `${lines.join("\n")}\n`, "utf8");
}

function writeQaReport(qa, warnings, errors, manifest) {
  const lines = [
    "# Silver Load QA Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `Database: \`${rel(SILVER_PATH)}\``,
    "",
    `## Overall result: **${qa.pass ? "PASS" : "FAIL"}**`,
    "",
    "## Validation checks",
    "",
    "| Check | Expected | Actual | Status |",
    "|-------|----------|--------|--------|",
    ...qa.checks.map(
      (c) =>
        `| ${c.name} | ${c.expected} | ${c.actual} | ${c.pass ? "PASS" : "FAIL"} |`,
    ),
    "",
    "## Category family summary",
    "",
    "| category_family | rows |",
    "|-----------------|------|",
    ...qa.categoryFamilies.map((r) => `| ${r.category_family || "(null)"} | ${r.c.toLocaleString()} |`),
    "",
    "## Date range summary",
    "",
    "| jurisdiction | min_date | max_date |",
    "|--------------|----------|----------|",
    ...qa.dateRanges.map((r) => `| ${r.jurisdiction_id} | ${r.min_date} | ${r.max_date} |`),
    "",
    "## Mappability summary",
    "",
    "| jurisdiction | total | mappable | percent |",
    "|--------------|-------|----------|---------|",
    ...qa.mappable.map(
      (r) =>
        `| ${r.jurisdiction_id} | ${r.total.toLocaleString()} | ${r.mappable_rows.toLocaleString()} | ${r.mappable_percent}% |`,
    ),
    "",
    "## Warnings",
    "",
    ...(warnings.length ? warnings.map((w) => `- ${w}`) : ["- None"]),
    "",
    "## Errors",
    "",
    ...(errors.length ? errors.map((e) => `- ${e.catalog_id}: ${e.error}`) : ["- None"]),
    "",
    "## Excluded sources (Phase 1 policy)",
    "",
    ...EXCLUDED_SOURCES.map((e) => `- \`${e.catalog_id}\`: ${e.reason}`),
    "",
  ];
  writeFileSync(QA_REPORT_PATH, `${lines.join("\n")}\n`, "utf8");
}

function printSummary(manifest, qa, warnings, errors) {
  process.stdout.write("\n=== Step 6D Silver Taxonomy V2 Rebuild (loader) ===\n\n");
  process.stdout.write(`Silver rebuilt: ${qa.total.toLocaleString()} rows\n`);
  process.stdout.write(`Other bucket: ${qa.otherCount.toLocaleString()} (target ~${TARGET_OTHER_COUNT.toLocaleString()})\n`);
  process.stdout.write(`Hard-gate QA: ${qa.pass ? "PASS" : "FAIL"}\n`);
  process.stdout.write(`Taxonomy target: ${qa.otherWithinTarget ? "PASS" : "PASS WITH CAVEATS"}\n`);
  if (errors.length) {
    for (const error of errors) process.stdout.write(`Error: ${error.catalog_id}: ${error.error}\n`);
  }
  process.stdout.write("\nRun post-QA script for full Step 6D report and final summary.\n");
}

async function main() {
  if (!existsSync(BRONZE_PATH)) {
    throw new Error(`Bronze database not found: ${rel(BRONZE_PATH)}`);
  }

  mkdirSync(SILVER_DIR, { recursive: true });
  const catalogById = readCatalog();
  const taxonomyRows = loadTaxonomyRows();
  const taxonomyIndex = buildTaxonomyIndex(taxonomyRows);
  const normalizedAt = new Date().toISOString();
  /** @type {string[]} */
  const warnings = [];
  /** @type {Array<{catalog_id: string, error: string}>} */
  const errors = [];

  if (existsSync(SILVER_PATH)) {
    rmSync(SILVER_PATH);
  }

  const bronzeDb = new DatabaseSync(BRONZE_PATH, { readOnly: true });
  /** @type {DatabaseSync | null} */
  let silverDb = null;
  if (!DRY_RUN) {
    silverDb = new DatabaseSync(SILVER_PATH);
    silverDb.exec("PRAGMA journal_mode = WAL");
    silverDb.exec("PRAGMA synchronous = NORMAL");
    createSilverSchema(silverDb);
    loadTaxonomyIntoSilver(silverDb, taxonomyRows);
  }

  /** @type {Array<Record<string, unknown>>} */
  const loadedSources = [];
  for (const source of PHASE1_SOURCES) {
    const result = loadSource(
      silverDb,
      bronzeDb,
      source,
      catalogById,
      taxonomyIndex,
      normalizedAt,
      warnings,
      errors,
    );
    loadedSources.push({
      catalog_id: source.catalog_id,
      jurisdiction_id: source.jurisdiction_id,
      bronze_table: source.bronze_table,
      expected_rows: source.expected_rows,
      rows_in: result.rows_in,
      rows_out: result.rows_out,
      transform_profile: source.transform_profile,
      mapping_confidence: result.mapping_confidence,
      warning_message: result.warning_message,
    });
  }

  if (DRY_RUN) {
    process.stdout.write(`Dry run complete. Would load ${PHASE1_SOURCES.length} sources.\n`);
    bronzeDb.close();
    return;
  }

  const qa = runQa(silverDb);
  writeSampleQueries();
  writeTableCounts(silverDb);
  writeQaReport(qa, warnings, errors, {});

  const manifest = {
    generatedAt: normalizedAt,
    databaseFile: rel(SILVER_PATH),
    expectedTotalRows: 780_385,
    actualTotalRows: qa.total,
    pass: qa.pass,
    sourcesLoaded: loadedSources,
    excludedSources: EXCLUDED_SOURCES,
    warnings: [...new Set(warnings)],
    errors,
    filesCreated: [
      rel(SILVER_PATH),
      rel(MANIFEST_PATH),
      rel(QA_REPORT_PATH),
      rel(TABLE_COUNTS_PATH),
      rel(SAMPLE_QUERIES_PATH),
      rel(REBUILD_REPORT_PATH),
      rel(join(ROOT, "scripts/load-silver-database.mjs")),
    ],
    taxonomyVersion: "v2_draft",
    previousOtherCount: PREVIOUS_OTHER_COUNT,
    targetOtherCount: TARGET_OTHER_COUNT,
    actualOtherCount: qa.otherCount,
  };
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  bronzeDb.close();
  silverDb.close();
  printSummary(manifest, qa, warnings, errors);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
