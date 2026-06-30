/**
 * Static Toronto reference vocabularies for filters and display.
 *
 * Offence groups map to the six V1 datasets. Neighbourhood names are real
 * Toronto neighbourhoods (158-system); the codes here are illustrative for
 * the preview UI and will be replaced by exact HOOD_158 values at ingestion.
 * Divisions are the 16 real TPS division identifiers.
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

/** The 16 TPS police divisions. */
export const DIVISIONS: string[] = [
  "D11", "D12", "D13", "D14",
  "D22", "D23",
  "D31", "D32", "D33",
  "D41", "D42", "D43",
  "D51", "D52", "D53", "D55",
];

export interface Neighbourhood {
  /** Illustrative HOOD_158 code (preview); exact codes set at ingestion. */
  code: string;
  name: string;
  /** Approx centroid used only for preview marker placement. */
  lat: number;
  lng: number;
}

/** A representative sample of Toronto 158-system neighbourhoods. */
export const NEIGHBOURHOODS: Neighbourhood[] = [
  { code: "170", name: "Yonge-Bay Corridor", lat: 43.6539, lng: -79.3835 },
  { code: "168", name: "Downtown Yonge East", lat: 43.6565, lng: -79.3789 },
  { code: "164", name: "Wellington Place", lat: 43.6427, lng: -79.4001 },
  { code: "165", name: "Harbourfront-CityPlace", lat: 43.6404, lng: -79.3884 },
  { code: "163", name: "Junction-Wallace Emerson", lat: 43.6645, lng: -79.4448 },
  { code: "095", name: "Annex", lat: 43.6710, lng: -79.4040 },
  { code: "075", name: "Church-Wellesley", lat: 43.6649, lng: -79.3817 },
  { code: "078", name: "Kensington-Chinatown", lat: 43.6536, lng: -79.4001 },
  { code: "077", name: "Waterfront Communities-The Island", lat: 43.6408, lng: -79.3817 },
  { code: "014", name: "Islington-City Centre West", lat: 43.6315, lng: -79.5365 },
  { code: "027", name: "York University Heights", lat: 43.7686, lng: -79.4995 },
  { code: "001", name: "West Humber-Clairville", lat: 43.7167, lng: -79.6011 },
  { code: "131", name: "Rouge", lat: 43.8200, lng: -79.1857 },
  { code: "137", name: "Woburn North", lat: 43.7715, lng: -79.2330 },
  { code: "118", name: "Tam O'Shanter-Sullivan", lat: 43.7799, lng: -79.2997 },
  { code: "126", name: "Dorset Park", lat: 43.7561, lng: -79.2773 },
  { code: "121", name: "Oakridge", lat: 43.6919, lng: -79.2780 },
  { code: "070", name: "South Riverdale", lat: 43.6592, lng: -79.3398 },
  { code: "072", name: "Regent Park", lat: 43.6595, lng: -79.3613 },
  { code: "073", name: "Moss Park", lat: 43.6543, lng: -79.3713 },
  { code: "093", name: "Dovercourt Village", lat: 43.6646, lng: -79.4310 },
  { code: "085", name: "South Parkdale", lat: 43.6383, lng: -79.4321 },
  { code: "088", name: "High Park-Swansea", lat: 43.6465, lng: -79.4637 },
  { code: "041", name: "Bridle Path-Sunnybrook-York Mills", lat: 43.7287, lng: -79.3754 },
  { code: "151", name: "Beechborough-Greenbrook", lat: 43.6952, lng: -79.4760 },
];

export const PREMISES_TYPES: string[] = [
  "Apartment",
  "House",
  "Commercial",
  "Educational",
  "Transit",
  "Outside",
  "Other",
];

/** Bounding box used only to constrain preview marker placement. */
export const TORONTO_BOUNDS = {
  minLat: 43.58,
  maxLat: 43.85,
  minLng: -79.64,
  maxLng: -79.12,
};
