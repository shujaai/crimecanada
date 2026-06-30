import { readFile } from "node:fs/promises";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const root = process.cwd();
const processedDir = path.join(root, "data", "processed", "tps", "v1");
const manifest = JSON.parse(
  await readFile(path.join(processedDir, "manifest.json"), "utf8"),
);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(manifest.datasets.length === 6, "Expected exactly six datasets");
assert(manifest.totalRows === 581_393, "Unexpected manifest row count");
assert(manifest.nonMappableRows === 8_202, "Unexpected manifest 0,0 count");
assert(manifest.sourceHeaders.length === 31, "Expected 31 source fields");

const startedAt = performance.now();
const database = new DatabaseSync(
  path.join(processedDir, manifest.databaseFile),
  { readOnly: true },
);

const totals = database.prepare(`
  SELECT
    COUNT(*) AS total,
    SUM(CASE WHEN lat = 0 AND lng = 0 THEN 1 ELSE 0 END) AS non_mappable,
    SUM(mappable) AS mappable
  FROM incidents
`).get();

assert(totals.total === 581_393, "Database row count mismatch");
assert(totals.non_mappable === 8_202, "Database 0,0 count mismatch");
assert(totals.mappable === 573_191, "Database mappable count mismatch");

const duplicateEvent = database.prepare(`
  SELECT event_unique_id, COUNT(*) AS records
  FROM incidents
  GROUP BY event_unique_id
  HAVING COUNT(*) > 1
  ORDER BY records DESC
  LIMIT 1
`).get();
assert(duplicateEvent?.records > 1, "Expected retained duplicate EVENT_UNIQUE_ID rows");

const nonMappable = database.prepare(`
  SELECT source_record_id, dataset_slug, source_fields_json, lat, lng, mappable
  FROM incidents
  WHERE mappable = 0
  ORDER BY dataset_slug, source_record_id
  LIMIT 1
`).get();
assert(nonMappable?.lat === 0 && nonMappable?.lng === 0, "Expected a retained 0,0 row");
assert(nonMappable?.mappable === 0, "0,0 row must be map-excluded");
assert(
  Object.keys(JSON.parse(nonMappable.source_fields_json)).length === 31,
  "source_fields_json must preserve all 31 fields",
);

const leakedMapRows = database.prepare(`
  SELECT COUNT(*) AS records
  FROM incidents
  WHERE mappable = 1 AND lat = 0 AND lng = 0
`).get();
assert(leakedMapRows.records === 0, "A 0,0 row leaked into the mappable set");

const page = database.prepare(`
  SELECT record_key
  FROM incidents
  WHERE dataset_slug = ? AND hood_158 = ? AND mappable = 1
  ORDER BY dataset_slug, source_record_id
  LIMIT 25 OFFSET 25
`).all("assault-open-data", "001");
assert(page.length === 25, "Filtered second page did not return 25 rows");

database.close();

process.stdout.write(`${JSON.stringify({
  datasets: manifest.datasets.length,
  totalRows: totals.total,
  mappableRows: totals.mappable,
  nonMappableRows: totals.non_mappable,
  retainedDuplicateEvent: duplicateEvent,
  sourceFieldCount: 31,
  filteredSecondPageRows: page.length,
  validationMs: Math.round(performance.now() - startedAt),
}, null, 2)}\n`);

const routeUrl = process.argv.find((argument) => argument.startsWith("http://"));
if (routeUrl) {
  const requestStartedAt = performance.now();
  const response = await fetch(routeUrl, { signal: AbortSignal.timeout(30_000) });
  const html = await response.text();
  if (!response.ok) {
    throw new Error(`Route returned HTTP ${response.status}: ${html.slice(-4_000)}`);
  }
  assert(html.includes("8,202"), "Route did not render the expected real-data count");
  process.stdout.write(`${JSON.stringify({
    routeUrl,
    status: response.status,
    responseBytes: html.length,
    responseMs: Math.round(performance.now() - requestStartedAt),
  }, null, 2)}\n`);
}
