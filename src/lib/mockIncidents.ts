/**
 * Illustrative preview incidents for the UI foundation.
 *
 * IMPORTANT: These are SYNTHETIC, deterministically generated records used only
 * to shape the explorer UI before real TPS ingestion (Phase 3b). Every record
 * carries `preview: true`. No CSV is read here and none should ever be loaded
 * into the client. Any count derived from this set is a preview, not live data.
 *
 * Field names mirror the V1 Major Crime 31-column family so components can be
 * swapped to real records with minimal change.
 */

import { OFFENCE_GROUPS, DIVISIONS, NEIGHBOURHOODS, PREMISES_TYPES } from "./toronto";

export interface PreviewIncident {
  /** Synthetic source_record_id (maps to OBJECTID). */
  sourceRecordId: number;
  eventUniqueId: string;
  datasetSlug: string;
  offence: string;
  csiCategory: string;
  reportDate: string;
  occDate: string;
  occYear: number;
  occMonth: string;
  occDow: string;
  occHour: number;
  division: string;
  premisesType: string;
  locationType: string;
  hood158: string;
  neighbourhood158: string;
  /** 0 indicates a non-mappable record (excluded from map markers only). */
  lat: number;
  lng: number;
  mappable: boolean;
  preview: true;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const LOCATION_TYPES = [
  "Single Home, House",
  "Apartment (Rooming House, Condo)",
  "Streets, Roads, Highways",
  "Commercial / Retail",
  "Parking Lots",
  "Transit",
];

/** Tiny deterministic PRNG (mulberry32) for stable, hydration-safe output. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildPreviewIncidents(count: number): PreviewIncident[] {
  const rand = mulberry32(20260630);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const incidents: PreviewIncident[] = [];

  for (let i = 0; i < count; i++) {
    const group = pick(OFFENCE_GROUPS);
    const hood = pick(NEIGHBOURHOODS);
    const year = 2021 + Math.floor(rand() * 5); // 2021–2025
    const monthIdx = Math.floor(rand() * 12);
    const day = 1 + Math.floor(rand() * 28);
    const hour = Math.floor(rand() * 24);
    const occ = new Date(Date.UTC(year, monthIdx, day, hour));
    const reported = new Date(occ.getTime() + Math.floor(rand() * 5) * 86400000);

    // ~6% of records are non-mappable (0,0), mirroring the real corpus pattern.
    const mappable = rand() > 0.06;
    const jitter = () => (rand() - 0.5) * 0.018;

    incidents.push({
      sourceRecordId: i + 1,
      eventUniqueId: `GO-${year}${String(1000000 + Math.floor(rand() * 8999999))}`,
      datasetSlug: group.datasetSlug,
      offence: pick(group.exampleOffences),
      csiCategory: group.csiCategory,
      reportDate: reported.toISOString().slice(0, 10),
      occDate: occ.toISOString().slice(0, 10),
      occYear: year,
      occMonth: MONTHS[monthIdx],
      occDow: DOW[occ.getUTCDay()],
      occHour: hour,
      division: pick(DIVISIONS),
      premisesType: pick(PREMISES_TYPES),
      locationType: pick(LOCATION_TYPES),
      hood158: hood.code,
      neighbourhood158: hood.name,
      lat: mappable ? +(hood.lat + jitter()).toFixed(6) : 0,
      lng: mappable ? +(hood.lng + jitter()).toFixed(6) : 0,
      mappable,
      preview: true,
    });
  }

  return incidents;
}

/** Stable set of ~84 preview incidents. */
export const PREVIEW_INCIDENTS: PreviewIncident[] = buildPreviewIncidents(84);

export const PREVIEW_MAPPABLE = PREVIEW_INCIDENTS.filter((r) => r.mappable);
export const PREVIEW_NON_MAPPABLE = PREVIEW_INCIDENTS.filter((r) => !r.mappable);
