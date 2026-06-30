export interface TorontoIncident {
  recordKey: string;
  sourceRecordId: string;
  eventUniqueId: string;
  datasetSlug: string;
  reportDate: string;
  occDate: string;
  occYear: number;
  occMonth: string;
  occDow: string;
  occHour: number;
  division: string;
  locationType: string;
  premisesType: string;
  offence: string;
  csiCategory: string;
  hood158: string;
  neighbourhood158: string;
  hood140: string;
  neighbourhood140: string;
  lat: number;
  lng: number;
  mappable: boolean;
  sourceFieldsJson: Record<string, string>;
}

export type TorontoMapIncident = Omit<
  TorontoIncident,
  "reportDate" | "occYear" | "occMonth" | "occDow" | "occHour" | "locationType" | "hood140" | "neighbourhood140" | "sourceFieldsJson"
>;

export interface TorontoSummary {
  total: number;
  mappable: number;
  nonMappable: number;
}

export interface TorontoFacetNeighbourhood {
  code: string;
  name: string;
}

export interface TorontoFacets {
  divisions: string[];
  neighbourhoods: TorontoFacetNeighbourhood[];
}

export interface TpsProcessedDataset {
  slug: string;
  name: string;
  sourceFile: string;
  processedFile: string;
  rowCount: number;
  nonMappableCount: number;
  duplicateEventIdRows: number;
  minOccDate: string;
  maxOccDate: string;
}

export interface TpsProcessedManifest {
  schemaVersion: number;
  generatedAt: string;
  ingestionDate: string;
  sourceDirectory: string;
  databaseFile: string;
  sourceHeaders: string[];
  totalRows: number;
  nonMappableRows: number;
  datasets: TpsProcessedDataset[];
  facets: TorontoFacets;
}

export interface TorontoQueryResult {
  summary: TorontoSummary;
  records: TorontoIncident[];
  mapRecords: TorontoMapIncident[];
  page: number;
  pageSize: number;
  pageCount: number;
  mapLimit: number;
}
