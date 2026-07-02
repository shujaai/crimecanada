/**
 * Bronze database loader for CrimeCanada.io.
 * Reads DATA_COLLECTION_MASTER_CATALOG.csv and loads non-archive files into SQLite.
 *
 * Usage: node scripts/load-bronze-database.mjs [--dry-run] [--limit N] [--skip-processed]
 */

import {
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import readline from "node:readline";
import { DatabaseSync } from "node:sqlite";

const ROOT = process.cwd();
const CATALOG_PATH = join(ROOT, "data", "DATA_COLLECTION_MASTER_CATALOG.csv");
const BRONZE_DIR = join(ROOT, "data", "bronze");
const DATABASE_PATH = join(BRONZE_DIR, "crimecanada-bronze.sqlite");
const MANIFEST_PATH = join(BRONZE_DIR, "bronze-load-manifest.json");

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const SKIP_PROCESSED = args.has("--skip-processed");
const LIMIT = (() => {
  const idx = process.argv.indexOf("--limit");
  return idx >= 0 ? Number(process.argv[idx + 1]) : Infinity;
})();

import { pathToFileURL } from "node:url";

function stripBom(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

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

function readCatalogCsv(filePath) {
  const content = readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/).filter((line) => line.length > 0);
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    /** @type {Record<string, string>} */
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? "";
    });
    return row;
  });
}

function sanitizeIdentifier(value, maxLen = 110) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, maxLen);
}

function bronzeTableName(row) {
  const parts = [
    "bronze",
    row.jurisdiction_id,
    row.dataset_group || "dataset",
    row.source_file || row.catalog_id,
  ]
    .map((part) => sanitizeIdentifier(part, 40))
    .filter(Boolean);
  return parts.join("__");
}

function quoteIdent(name) {
  return `"${name.replaceAll('"', '""')}"`;
}

const PROVENANCE_COLUMNS = [
  "_bronze_catalog_id",
  "_bronze_jurisdiction_id",
  "_bronze_source_path",
  "_bronze_loaded_at_utc",
  "_bronze_ingestion_status",
];

async function streamCsvRows(filePath) {
  const stream = createReadStream(filePath, { encoding: "utf8" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  /** @type {string[]} */
  let headers = [];
  /** @type {AsyncGenerator<Record<string, string>>} */
  async function* generator() {
    for await (const line of rl) {
      if (!headers.length) {
        headers = parseCsvLine(line);
        continue;
      }
      const values = parseCsvLine(line);
      const record = {};
      headers.forEach((header, idx) => {
        record[header] = values[idx] ?? "";
      });
      yield record;
    }
  }
  return { headers: () => headers, rows: generator() };
}

function loadCsvIntoBronze(database, row, loadedAt) {
  const filePath = join(ROOT, row.load_file_path);
  const tableName = bronzeTableName(row);

  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath, { encoding: "utf8" });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
    /** @type {string[]} */
    let sourceHeaders = [];
    /** @type {string[]} */
    let dataColumns = [];
    let inserted = 0;
    /** @type {import("node:sqlite").StatementSync | null} */
    let insertStmt = null;

    rl.on("line", (line) => {
      if (!sourceHeaders.length) {
        sourceHeaders = parseCsvLine(line);
        const allColumns = [
          ...PROVENANCE_COLUMNS,
          ...sourceHeaders.map((h) => sanitizeIdentifier(h, 80)),
        ];
        const uniqueColumns = [];
        const seen = new Set();
        for (const col of allColumns) {
          let name = col || "col";
          let suffix = 1;
          while (seen.has(name)) {
            name = `${col}_${suffix}`;
            suffix += 1;
          }
          seen.add(name);
          uniqueColumns.push(name);
        }
        dataColumns = uniqueColumns.slice(PROVENANCE_COLUMNS.length);

        database.exec(`DROP TABLE IF EXISTS ${quoteIdent(tableName)}`);
        const colDefs = uniqueColumns.map((col) => `${quoteIdent(col)} TEXT`).join(", ");
        database.exec(`CREATE TABLE ${quoteIdent(tableName)} (${colDefs})`);

        const placeholders = uniqueColumns.map(() => "?").join(", ");
        insertStmt = database.prepare(
          `INSERT INTO ${quoteIdent(tableName)} (${uniqueColumns.map(quoteIdent).join(", ")}) VALUES (${placeholders})`,
        );
        return;
      }

      const values = parseCsvLine(line);
      const rowValues = [
        row.catalog_id,
        row.jurisdiction_id,
        row.load_file_path,
        loadedAt,
        row.ingestion_status,
        ...sourceHeaders.map((header, idx) => values[idx] ?? ""),
      ];
      insertStmt.run(...rowValues);
      inserted += 1;
    });

    rl.on("close", () => resolve({ tableName, inserted }));
    rl.on("error", reject);
  });
}

function loadGeoJsonIntoBronze(database, row, loadedAt) {
  const filePath = join(ROOT, row.load_file_path);
  const parsed = JSON.parse(stripBom(readFileSync(filePath, "utf8")));
  const features = Array.isArray(parsed.features) ? parsed.features : [];
  const tableName = bronzeTableName(row);

  /** @type {Set<string>} */
  const propertyKeys = new Set();
  for (const feature of features) {
    const props = feature?.properties ?? {};
    for (const key of Object.keys(props)) {
      propertyKeys.add(sanitizeIdentifier(key, 80));
    }
  }

  const dataColumns = [...propertyKeys, "_raw_geometry"];
  const allColumns = [...PROVENANCE_COLUMNS, ...dataColumns];
  database.exec(`DROP TABLE IF EXISTS ${quoteIdent(tableName)}`);
  const colDefs = allColumns.map((col) => `${quoteIdent(col)} TEXT`).join(", ");
  database.exec(`CREATE TABLE ${quoteIdent(tableName)} (${colDefs})`);

  const placeholders = allColumns.map(() => "?").join(", ");
  const insertStmt = database.prepare(
    `INSERT INTO ${quoteIdent(tableName)} (${allColumns.map(quoteIdent).join(", ")}) VALUES (${placeholders})`,
  );

  let inserted = 0;
  for (const feature of features) {
    const props = feature?.properties ?? {};
    const valuesByCol = {};
    for (const [key, value] of Object.entries(props)) {
      valuesByCol[sanitizeIdentifier(key, 80)] =
        value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
    }
    const rowValues = [
      row.catalog_id,
      row.jurisdiction_id,
      row.load_file_path,
      loadedAt,
      row.ingestion_status,
      ...dataColumns.slice(0, -1).map((col) => valuesByCol[col] ?? ""),
      JSON.stringify(feature?.geometry ?? null),
    ];
    insertStmt.run(...rowValues);
    inserted += 1;
  }

  return { tableName, inserted };
}

function sqlString(value) {
  return `'${String(value ?? "").replaceAll("'", "''")}'`;
}

function loadSqliteIntoBronze(database, row, loadedAt) {
  const filePath = join(ROOT, row.load_file_path);
  const tableName = bronzeTableName(row);
  const attachAlias = "source_db";

  try {
    database.exec(`DETACH DATABASE ${attachAlias}`);
  } catch {
    // ignore if not attached
  }
  database.exec(`ATTACH DATABASE ${JSON.stringify(filePath)} AS ${attachAlias}`);

  const tables = database
    .prepare(
      `SELECT name FROM ${attachAlias}.sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%'`,
    )
    .all();

  let inserted = 0;
  const targetTable = tableName;

  database.exec(`DROP TABLE IF EXISTS ${quoteIdent(targetTable)}`);

  for (const { name } of tables) {
    const columns = database
      .prepare(`PRAGMA ${attachAlias}.table_info(${JSON.stringify(name)})`)
      .all()
      .map((col) => col.name);

    const allColumns = [...PROVENANCE_COLUMNS, ...columns.map((c) => sanitizeIdentifier(c, 80))];
    const colDefs = allColumns.map((col) => `${quoteIdent(col)} TEXT`).join(", ");
    database.exec(`CREATE TABLE ${quoteIdent(targetTable)} (${colDefs})`);

    const selectCols = columns
      .map((col, idx) => `${quoteIdent(col)} AS ${quoteIdent(allColumns[PROVENANCE_COLUMNS.length + idx])}`)
      .join(", ");

    database.exec(`
      INSERT INTO ${quoteIdent(targetTable)} (${allColumns.map(quoteIdent).join(", ")})
      SELECT
        ${sqlString(row.catalog_id)},
        ${sqlString(row.jurisdiction_id)},
        ${sqlString(row.load_file_path)},
        ${sqlString(loadedAt)},
        ${sqlString(row.ingestion_status)},
        ${selectCols}
      FROM ${attachAlias}.${quoteIdent(name)}
    `);

    inserted += database.prepare(`SELECT COUNT(*) AS c FROM ${quoteIdent(targetTable)}`).get().c;
    break;
  }

  database.exec(`DETACH DATABASE ${attachAlias}`);
  return { tableName: targetTable, inserted };
}

async function main() {
  if (!existsSync(CATALOG_PATH)) {
    throw new Error(`Catalog not found: ${rel(CATALOG_PATH)}. Run audit script first.`);
  }

  const catalog = readCatalogCsv(CATALOG_PATH);
  let candidates = catalog.filter(
    (row) => row.ingestion_status !== "archive_only_do_not_load_as_incidents",
  );

  if (SKIP_PROCESSED) {
    candidates = candidates.filter((row) => row.source_type !== "sqlite");
  }

  if (Number.isFinite(LIMIT)) {
    candidates = candidates.slice(0, LIMIT);
  }

  if (DRY_RUN) {
    process.stdout.write(`Dry run: would load ${candidates.length} catalog rows.\n`);
    return;
  }

  mkdirSync(BRONZE_DIR, { recursive: true });
  const database = new DatabaseSync(DATABASE_PATH);
  database.exec("PRAGMA journal_mode = WAL");
  database.exec("PRAGMA synchronous = NORMAL");

  database.exec(`
    CREATE TABLE IF NOT EXISTS bronze_catalog (
      catalog_id TEXT PRIMARY KEY,
      jurisdiction_id TEXT,
      source_file TEXT,
      load_file_path TEXT,
      ingestion_status TEXT,
      bronze_table TEXT,
      rows_loaded INTEGER,
      load_status TEXT,
      error_message TEXT,
      loaded_at_utc TEXT
    )
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS bronze_load_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      catalog_id TEXT,
      load_file_path TEXT,
      bronze_table TEXT,
      rows_loaded INTEGER,
      load_status TEXT,
      error_message TEXT,
      loaded_at_utc TEXT
    )
  `);

  const loadedAt = new Date().toISOString();
  /** @type {Array<Record<string, unknown>>} */
  const manifestEntries = [];
  /** @type {string[]} */
  const skipped = [];
  /** @type {Array<{catalog_id: string, error: string}>} */
  const errors = [];
  /** @type {Array<{table: string, rows: number}>} */
  const tableCounts = [];

  const insertCatalog = database.prepare(`
    INSERT OR REPLACE INTO bronze_catalog (
      catalog_id, jurisdiction_id, source_file, load_file_path,
      ingestion_status, bronze_table, rows_loaded, load_status, error_message, loaded_at_utc
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertLog = database.prepare(`
    INSERT INTO bronze_load_log (
      catalog_id, load_file_path, bronze_table, rows_loaded, load_status, error_message, loaded_at_utc
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const row of candidates) {
    const filePath = row.load_file_path ? join(ROOT, row.load_file_path) : "";
    if (!row.load_file_path || !existsSync(filePath)) {
      skipped.push(`${row.catalog_id}: missing file ${row.load_file_path}`);
      insertCatalog.run(
        row.catalog_id,
        row.jurisdiction_id,
        row.source_file,
        row.load_file_path,
        row.ingestion_status,
        "",
        0,
        "skipped_missing_file",
        "load_file_path missing or not found",
        loadedAt,
      );
      continue;
    }

    const sourceType = row.source_type;
    if (sourceType === "json") {
      skipped.push(`${row.catalog_id}: json not loaded as tabular bronze`);
      insertCatalog.run(
        row.catalog_id,
        row.jurisdiction_id,
        row.source_file,
        row.load_file_path,
        row.ingestion_status,
        "",
        0,
        "skipped_json",
        "JSON files are catalog-only unless tabular",
        loadedAt,
      );
      continue;
    }

    try {
      let result;
      if (sourceType === "csv") {
        result = await loadCsvIntoBronze(database, row, loadedAt);
      } else if (sourceType === "geojson") {
        result = loadGeoJsonIntoBronze(database, row, loadedAt);
      } else if (sourceType === "sqlite") {
        result = loadSqliteIntoBronze(database, row, loadedAt);
      } else {
        skipped.push(`${row.catalog_id}: unsupported source_type ${sourceType}`);
        continue;
      }

      insertCatalog.run(
        row.catalog_id,
        row.jurisdiction_id,
        row.source_file,
        row.load_file_path,
        row.ingestion_status,
        result.tableName,
        result.inserted,
        "loaded",
        "",
        loadedAt,
      );
      insertLog.run(
        row.catalog_id,
        row.load_file_path,
        result.tableName,
        result.inserted,
        "loaded",
        "",
        loadedAt,
      );

      tableCounts.push({ table: result.tableName, rows: result.inserted });
      manifestEntries.push({
        catalog_id: row.catalog_id,
        jurisdiction_id: row.jurisdiction_id,
        source_file: row.source_file,
        load_file_path: row.load_file_path,
        ingestion_status: row.ingestion_status,
        bronze_table: result.tableName,
        rows_loaded: result.inserted,
        load_status: "loaded",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push({ catalog_id: row.catalog_id, error: message });
      insertCatalog.run(
        row.catalog_id,
        row.jurisdiction_id,
        row.source_file,
        row.load_file_path,
        row.ingestion_status,
        "",
        0,
        "error",
        message,
        loadedAt,
      );
      insertLog.run(
        row.catalog_id,
        row.load_file_path,
        "",
        0,
        "error",
        message,
        loadedAt,
      );
    }
  }

  database.close();

  const manifest = {
    generatedAt: loadedAt,
    databaseFile: rel(DATABASE_PATH),
    catalogFile: rel(CATALOG_PATH),
    candidateRows: candidates.length,
    loadedRows: manifestEntries.length,
    skippedCount: skipped.length,
    errorCount: errors.length,
    tableCounts,
    skipped,
    errors,
    entries: manifestEntries,
  };

  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  process.stdout.write("\n=== Bronze Load Summary ===\n");
  process.stdout.write(`Database: ${rel(DATABASE_PATH)}\n`);
  process.stdout.write(`Manifest: ${rel(MANIFEST_PATH)}\n`);
  process.stdout.write(`Candidate catalog rows: ${candidates.length}\n`);
  process.stdout.write(`Loaded tables: ${manifestEntries.length}\n`);
  process.stdout.write(`Skipped: ${skipped.length}\n`);
  process.stdout.write(`Errors: ${errors.length}\n`);
  process.stdout.write(`Total rows loaded: ${tableCounts.reduce((sum, t) => sum + t.rows, 0)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
