/**
 * Jurisdiction model for the future Canada-wide organism.
 *
 * Toronto is the only ACTIVE jurisdiction in V1. All others are future nodes
 * with a readiness status and NO data. The /canada concept route renders these
 * honestly as "not live" — no fabricated records or statistics.
 */

export type JurisdictionStatus =
  | "active"
  | "planned"
  | "researching"
  | "not_started";

export interface Jurisdiction {
  id: string;
  city: string;
  province: string;
  agency: string;
  status: JurisdictionStatus;
  /** Acquisition priority order from DATA_SOURCE_PLAN (1 = next). */
  priority: number | null;
  /** Approx position for the schematic organism map (0–100 in each axis). */
  pos: { x: number; y: number };
  note: string;
}

export const JURISDICTIONS: Jurisdiction[] = [
  {
    id: "toronto-tps",
    city: "Toronto",
    province: "ON",
    agency: "Toronto Police Service",
    status: "active",
    priority: 0,
    pos: { x: 62, y: 70 },
    note: "V1 live jurisdiction. Six Major Crime Open Data datasets in the public incident layer.",
  },
  {
    id: "calgary-cps",
    city: "Calgary",
    province: "AB",
    agency: "Calgary Police Service",
    status: "planned",
    priority: 1,
    pos: { x: 30, y: 58 },
    note: "Next planned source. Public dashboard / open data. Not ingested.",
  },
  {
    id: "peel-prp",
    city: "Peel",
    province: "ON",
    agency: "Peel Regional Police",
    status: "planned",
    priority: 2,
    pos: { x: 60, y: 68 },
    note: "Crime statistics / maps. Not ingested.",
  },
  {
    id: "edmonton-eps",
    city: "Edmonton",
    province: "AB",
    agency: "Edmonton Police Service",
    status: "researching",
    priority: 3,
    pos: { x: 31, y: 48 },
    note: "Community Safety Data Portal. Source review only.",
  },
  {
    id: "vancouver-vpd",
    city: "Vancouver",
    province: "BC",
    agency: "Vancouver Police Department",
    status: "researching",
    priority: 4,
    pos: { x: 14, y: 56 },
    note: "VPD GeoDASH / open data. Source review only.",
  },
  {
    id: "winnipeg-wps",
    city: "Winnipeg",
    province: "MB",
    agency: "Winnipeg Police Service",
    status: "not_started",
    priority: 5,
    pos: { x: 44, y: 60 },
    note: "Crime / calls-for-service maps. Not started.",
  },
  {
    id: "statcan",
    city: "Statistics Canada",
    province: "National",
    agency: "Statistics Canada",
    status: "not_started",
    priority: 6,
    pos: { x: 70, y: 40 },
    note: "National crime/justice data. Later phase.",
  },
];

export const JURISDICTION_STATUS_LABEL: Record<JurisdictionStatus, string> = {
  active: "Active",
  planned: "Planned",
  researching: "Researching source",
  not_started: "Not started",
};
