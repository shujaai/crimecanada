import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DatasetBadge } from "@/components/ui/DatasetBadge";
import { StatusChip } from "@/components/ui/StatusChip";
import { DisclaimerBlock } from "@/components/ui/DisclaimerBlock";
import {
  V1_DATASETS,
  DEFERRED_DATASETS,
  TOTAL_CORPUS_FILES,
  LAYER_LABELS,
  type DatasetMeta,
  type TypedLayer,
} from "@/lib/datasets";

export const metadata: Metadata = {
  title: "Data sources & licence",
  description:
    "Full transparency: published datasets, deferred-but-classified datasets, the complete 74-file TPS corpus, field glossary, citation requirements, and limitations.",
};

const FIELD_GLOSSARY: { field: string; meaning: string }[] = [
  { field: "OBJECTID", meaning: "Unique row id within a file → stored as source_record_id." },
  { field: "EVENT_UNIQUE_ID", meaning: "TPS event id. Stored, but NOT used to deduplicate (not unique)." },
  { field: "REPORT_DATE / OCC_DATE", meaning: "Date the incident was reported / occurred." },
  { field: "DIVISION", meaning: "TPS police division (e.g. D51)." },
  { field: "OFFENCE", meaning: "Specific offence label within the dataset." },
  { field: "CSI_CATEGORY", meaning: "Crime severity index grouping." },
  { field: "HOOD_158 / NEIGHBOURHOOD_158", meaning: "Primary neighbourhood code/name (158 system)." },
  { field: "HOOD_140 / NEIGHBOURHOOD_140", meaning: "Legacy 140-system fields, preserved as source fields." },
  { field: "LAT_WGS84 / LONG_WGS84", meaning: "Coordinates that power the map. 0,0 = excluded from markers." },
  { field: "PREMISES_TYPE / LOCATION_TYPE", meaning: "Where the incident occurred (categorical)." },
];

const EXCLUDED_FIELDS = [
  "Suspect names",
  "Victim names",
  "Mugshots or photos of individuals",
  "Any personal identifier flagged during inventory",
  "CrimeInToronto article micro-data",
];

function groupByLayer(datasets: DatasetMeta[]) {
  const groups = new Map<TypedLayer, DatasetMeta[]>();
  for (const d of datasets) {
    const arr = groups.get(d.layer) ?? [];
    arr.push(d);
    groups.set(d.layer, arr);
  }
  return [...groups.entries()];
}

export default function DataSources() {
  return (
    <>
      <PageHero
        kicker="Transparency ledger"
        badge={<StatusChip tone="amber" dot>Provenance pending ingestion</StatusChip>}
        title="Data sources & licence"
        description="Every dataset we hold, what is published in V1, what is deferred, and the full corpus we have inventoried but not yet released. No hidden datasets."
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Published */}
        <section>
          <SectionHeader
            kicker="Published in V1"
            title="Six Major Crime open datasets"
            description="The public_incident_records layer. Each will carry source URL, licence, update date, and ingestion date once ingested."
          />
          <div className="mt-5 overflow-hidden rounded-xl border border-line">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line bg-panel/60 text-left">
                  <th className="kicker px-4 py-2.5 font-medium">Dataset</th>
                  <th className="kicker px-4 py-2.5 font-medium">Records</th>
                  <th className="kicker px-4 py-2.5 font-medium">Non-mappable</th>
                  <th className="kicker px-4 py-2.5 font-medium">Source / licence</th>
                </tr>
              </thead>
              <tbody>
                {V1_DATASETS.map((d) => (
                  <tr key={d.slug} className="border-b border-line/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink">{d.name}</div>
                      <div className="mt-1"><DatasetBadge layer={d.layer} /></div>
                    </td>
                    <td className="nums px-4 py-3 text-muted">{d.rowCount.toLocaleString("en-CA")}</td>
                    <td className="nums px-4 py-3 text-amber">{(d.nonMappableCount ?? 0).toLocaleString("en-CA")}</td>
                    <td className="px-4 py-3 text-xs">
                      <a href={d.sourceUrl} className="block text-cyan hover:underline" target="_blank" rel="noopener noreferrer">
                        TPS portal ↗
                      </a>
                      <a href={d.licenceUrl} className="block text-muted hover:text-ink" target="_blank" rel="noopener noreferrer">
                        {d.licenceName}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Deferred */}
        <section className="mt-12">
          <SectionHeader
            kicker="Deferred but classified"
            title="Held, classified, not yet published"
            description="A representative slice of the full corpus, grouped by typed source layer. Deferred does not mean ignored."
          />
          <div className="mt-5 flex flex-col gap-6">
            {groupByLayer(DEFERRED_DATASETS).map(([layer, datasets]) => (
              <div key={layer}>
                <div className="mb-2 flex items-center gap-2">
                  <DatasetBadge layer={layer} />
                  <span className="text-sm font-medium text-ink">{LAYER_LABELS[layer]}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {datasets.map((d) => (
                    <GlassPanel key={d.slug} soft className="flex flex-col gap-2 p-4">
                      <h3 className="text-sm font-medium text-ink">{d.name}</h3>
                      <p className="text-xs leading-relaxed text-muted">{d.deferredReason}</p>
                    </GlassPanel>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Full inventory */}
        <section className="mt-12">
          <GlassPanel className="p-6">
            <SectionHeader
              kicker="Full corpus"
              title={`All ${TOTAL_CORPUS_FILES} TPS files are inventoried and classified`}
              description="The complete bulk download is preserved unmodified and assigned to typed layers. V1 publishes only the six Major Crime datasets; everything else is acknowledged here even when unpublished."
              action={
                <Link href="/data/layers" className="text-sm text-cyan hover:underline">
                  View source layers →
                </Link>
              }
            />
          </GlassPanel>
        </section>

        {/* Field glossary + excluded fields */}
        <section className="mt-12 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <SectionHeader kicker="Field glossary" title="The 31-column family" className="mb-4" />
            <GlassPanel className="divide-y divide-line/60 p-2">
              {FIELD_GLOSSARY.map((f) => (
                <div key={f.field} className="flex flex-col gap-0.5 px-3 py-2.5 sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="nums shrink-0 font-mono text-xs text-cyan sm:w-56">{f.field}</span>
                  <span className="text-xs leading-relaxed text-muted">{f.meaning}</span>
                </div>
              ))}
            </GlassPanel>
          </div>
          <div>
            <SectionHeader kicker="Never ingested" title="Excluded fields" className="mb-4" />
            <GlassPanel soft className="p-4">
              <ul className="space-y-2 text-xs text-muted">
                {EXCLUDED_FIELDS.map((e) => (
                  <li key={e} className="flex gap-2">
                    <span className="text-red-soft">✕</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-line pt-3 text-[0.68rem] leading-relaxed text-faint">
                The V1 datasets contain no personal-name columns (verified during
                inventory). If TPS ever publishes a personal identifier, it is
                excluded at ingestion and documented here.
              </p>
            </GlassPanel>
          </div>
        </section>

        {/* Citation + separation */}
        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <GlassPanel className="p-5">
            <p className="kicker mb-2 text-cyan">Citation requirements</p>
            <p className="text-sm leading-relaxed text-muted">
              Every displayed record links to its dataset name, source URL,
              licence URL, TPS update date, and our ingestion date. Aggregate
              counts are only shown when they are computable from ingested
              records and verifiable by drilling into the table.
            </p>
          </GlassPanel>
          <GlassPanel className="p-5">
            <p className="kicker mb-2 text-violet">Separation from CrimeInToronto</p>
            <p className="text-sm leading-relaxed text-muted">
              CrimeCanada.io is the official public-data product. CrimeInToronto.com
              is a separate article/news product. No CrimeInToronto article data is
              blended into TPS records in V1. Any future article context would
              enter through a clearly labelled external_context_links layer — never
              as official data.
            </p>
          </GlassPanel>
        </section>

        <section className="mb-12 mt-10">
          <DisclaimerBlock />
        </section>
      </div>
    </>
  );
}
