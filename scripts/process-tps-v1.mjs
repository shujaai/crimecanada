import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { once } from "node:events";
import path from "node:path";
import readline from "node:readline";
import { createGzip } from "node:zlib";

const ROOT = process.cwd();
const RAW_DIR = path.join(ROOT, "data", "raw", "tps", "_downloads", "2026-06-30");
const OUTPUT_DIR = path.join(ROOT, "data", "processed", "tps", "v1");
const MANIFEST_PATH = path.join(OUTPUT_DIR, "manifest.json");
const DATABASE_FILE = "tps-v1-v2.sqlite";

const EXPECTED_HEADERS = [
  "OBJECTID",
  "EVENT_UNIQUE_ID",
  "REPORT_DATE",
  "OCC_DATE",
  "REPORT_YEAR",
  "REPORT_MONTH",
  "REPORT_DAY",
  "REPORT_DOY",
  "REPORT_DOW",
  "REPORT_HOUR",
  "OCC_YEAR",
  "OCC_MONTH",
  "OCC_DAY",
  "OCC_DOY",
  "OCC_DOW",
  "OCC_HOUR",
  "DIVISION",
  "LOCATION_TYPE",
  "PREMISES_TYPE",
  "UCR_CODE",
  "UCR_EXT",
  "OFFENCE",
  "CSI_CATEGORY",
  "HOOD_158",
  "NEIGHBOURHOOD_158",
  "HOOD_140",
  "NEIGHBOURHOOD_140",
  "LONG_WGS84",
  "LAT_WGS84",
  "x",
  "y",
];

const DATASETS = [
  {
    slug: "assault-open-data",
    name: "Assault Open Data",
    input: "Assault_Open_Data_4176353985444773481.csv",
    output: "assault-open-data.ndjson.gz",
    expectedRows: 254_378,
    expectedNonMappable: 4_125,
  },
  {
    slug: "auto-theft-open-data",
    name: "Auto Theft Open Data",
    input: "Auto_Theft_Open_Data_4481082360476864088.csv",
    output: "auto-theft-open-data.ndjson.gz",
    expectedRows: 78_714,
    expectedNonMappable: 858,
  },
  {
    slug: "break-and-enter-open-data",
    name: "Break and Enter Open Data",
    input: "Break_and_Enter_Open_Data_9198768316349412680.csv",
    output: "break-and-enter-open-data.ndjson.gz",
    expectedRows: 84_689,
    expectedNonMappable: 569,
  },
  {
    slug: "robbery-open-data",
    name: "Robbery Open Data",
    input: "Robbery_Open_Data_2226832258065309099.csv",
    output: "robbery-open-data.ndjson.gz",
    expectedRows: 40_248,
    expectedNonMappable: 1_105,
  },
  {
    slug: "theft-from-motor-vehicle-open-data",
    name: "Theft From Motor Vehicle Open Data",
    input: "Theft_From_Motor_Vehicle_Open_Data_4636805822324249695.csv",
    output: "theft-from-motor-vehicle-open-data.ndjson.gz",
    expectedRows: 106_574,
    expectedNonMappable: 1_250,
  },
  {
    slug: "theft-over-open-data",
    name: "Theft Over Open Data",
    input: "Theft_Over_Open_Data_-309556416197554984.csv",
    output: "theft-over-open-data.ndjson.gz",
    expectedRows: 16_790,
    expectedNonMappable: 295,
  },
];

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (quoted) {
      if (char === '"') {
        if (line[index + 1] === '"') {
          value += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        value += char;
      }
    } else if (char === '"' && value.length === 0) {
      quoted = true;
    } else if (char === ",") {
      values.push(value);
      value = "";
    } else {
      value += char;
    }
  }

  if (quoted) throw new Error("CSV row contains an unterminated quoted field");
  values.push(value);
  return values;
}

function parseNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseInteger(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isoDate(yearValue, monthValue, dayValue) {
  const year = parseInteger(yearValue);
  const day = parseInteger(dayValue);
  const months = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };
  const month = months[monthValue];
  if (!year || !month || !day) return "";
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function sameHeaders(actual) {
  return actual.length === EXPECTED_HEADERS.length
    && actual.every((header, index) => header === EXPECTED_HEADERS[index]);
}

function normalizeRecord(datasetSlug, row) {
  const sourceFieldsJson = Object.fromEntries(
    EXPECTED_HEADERS.map((header, index) => [header, row[index]]),
  );
  const lat = parseNumber(sourceFieldsJson.LAT_WGS84);
  const lng = parseNumber(sourceFieldsJson.LONG_WGS84);
  const sourceRecordId = sourceFieldsJson.OBJECTID;
  let sampleRank = 2_166_136_261;
  for (const char of `${datasetSlug}:${sourceRecordId}`) {
    sampleRank ^= char.charCodeAt(0);
    sampleRank = Math.imul(sampleRank, 16_777_619);
  }

  return {
    recordKey: `${datasetSlug}:${sourceRecordId}`,
    sourceRecordId,
    eventUniqueId: sourceFieldsJson.EVENT_UNIQUE_ID,
    datasetSlug,
    reportDate: isoDate(
      sourceFieldsJson.REPORT_YEAR,
      sourceFieldsJson.REPORT_MONTH,
      sourceFieldsJson.REPORT_DAY,
    ),
    occDate: isoDate(
      sourceFieldsJson.OCC_YEAR,
      sourceFieldsJson.OCC_MONTH,
      sourceFieldsJson.OCC_DAY,
    ),
    occYear: parseInteger(sourceFieldsJson.OCC_YEAR),
    occMonth: sourceFieldsJson.OCC_MONTH.trim(),
    occDow: sourceFieldsJson.OCC_DOW.trim(),
    occHour: parseInteger(sourceFieldsJson.OCC_HOUR),
    division: sourceFieldsJson.DIVISION.trim(),
    locationType: sourceFieldsJson.LOCATION_TYPE.trim(),
    premisesType: sourceFieldsJson.PREMISES_TYPE.trim(),
    offence: sourceFieldsJson.OFFENCE.trim(),
    csiCategory: sourceFieldsJson.CSI_CATEGORY.trim(),
    hood158: sourceFieldsJson.HOOD_158.trim(),
    neighbourhood158: sourceFieldsJson.NEIGHBOURHOOD_158.trim(),
    hood140: sourceFieldsJson.HOOD_140.trim(),
    neighbourhood140: sourceFieldsJson.NEIGHBOURHOOD_140.trim(),
    lat,
    lng,
    mappable: !(lat === 0 && lng === 0),
    sampleRank: sampleRank >>> 0,
    sourceFieldsJson,
  };
}

async function writeLine(stream, line) {
  if (!stream.write(line)) await once(stream, "drain");
}

async function processDataset(dataset, facets, insertRecord) {
  const inputPath = path.join(RAW_DIR, dataset.input);
  const outputPath = path.join(OUTPUT_DIR, dataset.output);
  const tempPath = `${outputPath}.tmp`;
  const input = createReadStream(inputPath, { encoding: "utf8" });
  const lines = readline.createInterface({ input, crlfDelay: Infinity });
  const gzip = createGzip({ level: 6 });
  const output = createWriteStream(tempPath);
  gzip.pipe(output);

  let rowCount = 0;
  let nonMappableCount = 0;
  let minOccDate = "";
  let maxOccDate = "";
  let headerSeen = false;
  let duplicateEventIdRows = 0;
  const eventIds = new Set();

  try {
    for await (const line of lines) {
      if (!headerSeen) {
        const headers = parseCsvLine(line.replace(/^\uFEFF/, ""));
        if (!sameHeaders(headers)) {
          throw new Error(`${dataset.input}: expected the shared 31-column TPS schema`);
        }
        headerSeen = true;
        continue;
      }

      if (!line) continue;
      const row = parseCsvLine(line);
      if (row.length !== EXPECTED_HEADERS.length) {
        throw new Error(
          `${dataset.input}:${rowCount + 2}: expected ${EXPECTED_HEADERS.length} fields, found ${row.length}`,
        );
      }

      const record = normalizeRecord(dataset.slug, row);
      rowCount += 1;
      if (!record.mappable) nonMappableCount += 1;
      if (record.occDate) {
        if (!minOccDate || record.occDate < minOccDate) minOccDate = record.occDate;
        if (!maxOccDate || record.occDate > maxOccDate) maxOccDate = record.occDate;
      }
      facets.divisions.add(record.division);
      const existingName = facets.neighbourhoods.get(record.hood158);
      if (existingName && existingName !== record.neighbourhood158) {
        throw new Error(
          `${dataset.input}: HOOD_158 ${record.hood158} has conflicting names (${existingName} / ${record.neighbourhood158})`,
        );
      }
      facets.neighbourhoods.set(record.hood158, record.neighbourhood158);
      if (eventIds.has(record.eventUniqueId)) duplicateEventIdRows += 1;
      eventIds.add(record.eventUniqueId);
      insertRecord.run(
        record.recordKey,
        record.sourceRecordId,
        record.eventUniqueId,
        record.datasetSlug,
        record.reportDate,
        record.occDate,
        record.occYear,
        record.occMonth,
        record.occDow,
        record.occHour,
        record.division,
        record.locationType,
        record.premisesType,
        record.offence,
        record.csiCategory,
        record.hood158,
        record.neighbourhood158,
        record.hood140,
        record.neighbourhood140,
        record.lat,
        record.lng,
        record.mappable ? 1 : 0,
        record.sampleRank,
        JSON.stringify(record.sourceFieldsJson),
      );
      await writeLine(gzip, `${JSON.stringify(record)}\n`);
    }

    if (!headerSeen) throw new Error(`${dataset.input}: missing CSV header`);
    gzip.end();
    await once(output, "close");

    if (rowCount !== dataset.expectedRows) {
      throw new Error(`${dataset.input}: expected ${dataset.expectedRows} rows, found ${rowCount}`);
    }
    if (nonMappableCount !== dataset.expectedNonMappable) {
      throw new Error(
        `${dataset.input}: expected ${dataset.expectedNonMappable} non-mappable rows, found ${nonMappableCount}`,
      );
    }

    await rm(outputPath, { force: true });
    await rename(tempPath, outputPath);
    return {
      slug: dataset.slug,
      name: dataset.name,
      sourceFile: dataset.input,
      processedFile: dataset.output,
      rowCount,
      nonMappableCount,
      duplicateEventIdRows,
      minOccDate,
      maxOccDate,
    };
  } catch (error) {
    gzip.destroy();
    output.destroy();
    await rm(tempPath, { force: true });
    throw error;
  }
}

async function main() {
  const { DatabaseSync } = await import("node:sqlite");
  await mkdir(OUTPUT_DIR, { recursive: true });
  const facets = { divisions: new Set(), neighbourhoods: new Map() };
  const datasets = [];
  const databasePath = path.join(OUTPUT_DIR, DATABASE_FILE);
  const tempDatabasePath = `${databasePath}.tmp`;
  await rm(tempDatabasePath, { force: true });
  const database = new DatabaseSync(tempDatabasePath);
  database.exec(`
    PRAGMA journal_mode = OFF;
    PRAGMA synchronous = OFF;
    CREATE TABLE incidents (
      record_key TEXT PRIMARY KEY,
      source_record_id TEXT NOT NULL,
      event_unique_id TEXT NOT NULL,
      dataset_slug TEXT NOT NULL,
      report_date TEXT NOT NULL,
      occ_date TEXT NOT NULL,
      occ_year INTEGER NOT NULL,
      occ_month TEXT NOT NULL,
      occ_dow TEXT NOT NULL,
      occ_hour INTEGER NOT NULL,
      division TEXT NOT NULL,
      location_type TEXT NOT NULL,
      premises_type TEXT NOT NULL,
      offence TEXT NOT NULL,
      csi_category TEXT NOT NULL,
      hood_158 TEXT NOT NULL,
      neighbourhood_158 TEXT NOT NULL,
      hood_140 TEXT NOT NULL,
      neighbourhood_140 TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      mappable INTEGER NOT NULL CHECK (mappable IN (0, 1)),
      sample_rank INTEGER NOT NULL,
      source_fields_json TEXT NOT NULL
    );
    BEGIN;
  `);
  const insertRecord = database.prepare(`
    INSERT INTO incidents VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  try {
    for (const dataset of DATASETS) {
      process.stdout.write(`Processing ${dataset.name}... `);
      const result = await processDataset(dataset, facets, insertRecord);
      datasets.push(result);
      process.stdout.write(`${result.rowCount.toLocaleString("en-CA")} rows\n`);
    }
    database.exec(`
      COMMIT;
      CREATE INDEX incidents_dataset_idx ON incidents (dataset_slug);
      CREATE INDEX incidents_occ_date_idx ON incidents (occ_date);
      CREATE INDEX incidents_hood_158_idx ON incidents (hood_158);
      CREATE INDEX incidents_division_idx ON incidents (division);
      CREATE INDEX incidents_mappable_idx ON incidents (mappable);
      CREATE INDEX incidents_table_order_idx
        ON incidents (dataset_slug, source_record_id);
      CREATE INDEX incidents_mappable_table_order_idx
        ON incidents (mappable, dataset_slug, source_record_id);
      CREATE INDEX incidents_map_sample_idx ON incidents (mappable, sample_rank);
      CREATE INDEX incidents_filter_idx
        ON incidents (dataset_slug, occ_date, hood_158, division, mappable);
      PRAGMA optimize;
    `);
    database.close();
    await rm(databasePath, { force: true });
    await rename(tempDatabasePath, databasePath);
  } catch (error) {
    try {
      database.exec("ROLLBACK");
    } catch {
      // A failure before BEGIN completes leaves no active transaction to roll back.
    }
    database.close();
    await rm(tempDatabasePath, { force: true });
    throw error;
  }

  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    ingestionDate: "2026-06-30",
    sourceDirectory: "data/raw/tps/_downloads/2026-06-30",
    databaseFile: DATABASE_FILE,
    sourceHeaders: EXPECTED_HEADERS,
    totalRows: datasets.reduce((sum, dataset) => sum + dataset.rowCount, 0),
    nonMappableRows: datasets.reduce(
      (sum, dataset) => sum + dataset.nonMappableCount,
      0,
    ),
    datasets,
    facets: {
      divisions: [...facets.divisions].filter(Boolean).sort(),
      neighbourhoods: [...facets.neighbourhoods]
        .map(([code, name]) => ({ code, name }))
        .sort((a, b) => a.code.localeCompare(b.code, "en-CA", { numeric: true })),
    },
  };

  if (manifest.totalRows !== 581_393 || manifest.nonMappableRows !== 8_202) {
    throw new Error(
      `Corpus totals failed validation: ${manifest.totalRows} rows, ${manifest.nonMappableRows} non-mappable`,
    );
  }

  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  const persisted = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  if (persisted.datasets.length !== DATASETS.length) {
    throw new Error("Manifest persistence check failed");
  }

  process.stdout.write(
    `Wrote ${manifest.totalRows.toLocaleString("en-CA")} rows; ${manifest.nonMappableRows.toLocaleString("en-CA")} are 0,0.\n`,
  );
}

if (process.argv.includes("--check-sqlite")) {
  import("node:sqlite")
    .then(() => process.stdout.write(`${process.version} sqlite-ok\n`))
    .catch((error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
} else {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
