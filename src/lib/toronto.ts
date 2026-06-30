/**
 * Static Toronto offence groups and geographic display bounds.
 * Real neighbourhood and division facets are read from the processed TPS manifest.
 */

export interface OffenceGroup {
  /** Matches a V1 dataset slug. */
  datasetSlug: string;
  label: string;
  /** CSI_CATEGORY this offence group rolls up to. */
  csiCategory: "Crimes Against the Person" | "Crimes Against Property";
  /** Example OFFENCE values seen in the dataset (for the field glossary / chips). */
  exampleOffences: string[];
}

export const OFFENCE_GROUPS: OffenceGroup[] = [
  {
    datasetSlug: "assault-open-data",
    label: "Assault",
    csiCategory: "Crimes Against the Person",
    exampleOffences: ["Assault", "Assault With Weapon", "Assault Bodily Harm"],
  },
  {
    datasetSlug: "robbery-open-data",
    label: "Robbery",
    csiCategory: "Crimes Against the Person",
    exampleOffences: ["Robbery - Mugging", "Robbery - Business", "Robbery With Weapon"],
  },
  {
    datasetSlug: "break-and-enter-open-data",
    label: "Break and Enter",
    csiCategory: "Crimes Against Property",
    exampleOffences: ["B&E", "B&E W'Intent", "Unlawfully In Dwelling-House"],
  },
  {
    datasetSlug: "auto-theft-open-data",
    label: "Auto Theft",
    csiCategory: "Crimes Against Property",
    exampleOffences: ["Theft Of Motor Vehicle", "Theft Of Vehicle Parts"],
  },
  {
    datasetSlug: "theft-from-motor-vehicle-open-data",
    label: "Theft From Motor Vehicle",
    csiCategory: "Crimes Against Property",
    exampleOffences: ["Theft From Motor Vehicle Under", "Theft From Motor Vehicle Over"],
  },
  {
    datasetSlug: "theft-over-open-data",
    label: "Theft Over",
    csiCategory: "Crimes Against Property",
    exampleOffences: ["Theft Over", "Theft Over - Shoplifting", "Theft Over - Bicycle"],
  },
];

/** Bounding box used to project source WGS84 points onto the lightweight canvas. */
export const TORONTO_BOUNDS = {
  minLat: 43.58,
  maxLat: 43.85,
  minLng: -79.64,
  maxLng: -79.12,
};
