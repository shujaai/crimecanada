import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { ExplorerShell } from "@/components/explorer/ExplorerShell";
import { TorontoMap } from "@/components/explorer/TorontoMap";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceReceipt } from "@/components/ui/SourceReceipt";
import { StatusChip } from "@/components/ui/StatusChip";
import { parseAskQuestion, type AskParseResult } from "@/lib/askParser";
import {
  EMPTY_FILTERS,
  activeFilterCount,
  buildExplorerUrl,
} from "@/lib/filters";
import { getV1DatasetsBySlug } from "@/lib/datasets";
import type { TorontoIncident, TorontoQueryResult } from "@/lib/tps";
import {
  getTorontoFacets,
  getTorontoLegacyNeighbourhoods,
  queryTorontoIncidents,
} from "@/lib/tpsQuery";

export const metadata: Metadata = {
  title: "Ask Toronto's public record",
  description:
    "Turn a plain-language question into a transparent, reproducible query of Toronto Police Service open data.",
};

const EXAMPLES = [
  "break-ins in Rouge in 2024",
  "auto theft in 2023",
  "robbery in D32",
  "assaults in Waterfront Communities",
];

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export default async function TorontoAsk({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const rawQuestion = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const question = rawQuestion?.trim().slice(0, 200) ?? "";

  let parsed: AskParseResult | undefined;
  let result: TorontoQueryResult | undefined;
  let unavailableMessage: string | undefined;

  if (question) {
    try {
      const [facets, legacyNeighbourhoods] = await Promise.all([
        getTorontoFacets(),
        getTorontoLegacyNeighbourhoods(),
      ]);
      parsed = parseAskQuestion(question, {
        divisions: facets.divisions,
        neighbourhoods: facets.neighbourhoods,
        legacyNeighbourhoods,
      });

      if (activeFilterCount(parsed.filters) > 0) {
        result = await queryTorontoIncidents(parsed.filters, {
          includeRecords: true,
          pageSize: 5,
          includeMapRecords: true,
          mapLimit: 300,
        });
      }
    } catch (error) {
      if (
        error instanceof Error
        && error.message.startsWith("TPS V1 processed data is unavailable")
      ) {
        unavailableMessage = error.message;
      } else {
        throw error;
      }
    }
  }

  return (
    <>
      <PageHero
        kicker="Toronto · Living Answer prototype"
        badge={<StatusChip tone="cyan" dot>Deterministic · no AI</StatusChip>}
        title="Ask the public record."
        description="Type a simple question. We will show exactly which filters were understood, query the real local TPS record, and keep the answer reproducible."
        grid
      />

      <ExplorerShell view="ask" filters={parsed?.filters ?? EMPTY_FILTERS}>
        <GlassPanel className="p-5 sm:p-6">
          <form action="/toronto/ask" method="get" className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="ask-question" className="sr-only">
              Ask a question about Toronto public safety records
            </label>
            <input
              id="ask-question"
              name="q"
              type="text"
              required
              maxLength={200}
              defaultValue={question}
              placeholder="Try: break-ins in Rouge in 2024"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-lg border border-line bg-base px-4 py-3 text-base text-ink outline-none placeholder:text-faint focus:border-cyan/60 focus:ring-2 focus:ring-cyan/10"
            />
            <button
              type="submit"
              className="rounded-lg border border-cyan/50 bg-cyan/15 px-6 py-3 text-sm font-semibold text-cyan transition-colors hover:bg-cyan/25"
            >
              Ask the record
            </button>
          </form>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="kicker">Examples</span>
            {EXAMPLES.map((example) => (
              <Link
                key={example}
                href={{ pathname: "/toronto/ask", query: { q: example } }}
                className="rounded-full border border-line bg-panel-2 px-2.5 py-1 text-xs text-muted transition-colors hover:border-cyan/30 hover:text-ink"
              >
                {example}
              </Link>
            ))}
          </div>
        </GlassPanel>

        {!question ? <WelcomeState /> : null}
        {unavailableMessage ? <UnavailableState message={unavailableMessage} /> : null}
        {parsed ? (
          <LivingAnswer question={question} parsed={parsed} result={result} />
        ) : null}
      </ExplorerShell>
    </>
  );
}

function WelcomeState() {
  return (
    <GlassPanel soft className="mt-6 p-6">
      <p className="kicker mb-2 text-cyan">How this prototype works</p>
      <p className="max-w-3xl text-sm leading-relaxed text-muted">
        This is a small rules-based compiler, not a chatbot. It recognizes the
        six published offence groups, years, TPS divisions, and neighbourhood
        names, then turns them into the same filters used by the Toronto map and
        table.
      </p>
    </GlassPanel>
  );
}

function UnavailableState({ message }: { message: string }) {
  return (
    <GlassPanel className="mt-6 border-amber/30 p-6">
      <p className="kicker mb-2 text-amber">Local TPS data unavailable</p>
      <p className="text-sm leading-relaxed text-muted">{message}</p>
      <p className="mt-3 font-mono text-xs text-ink">
        node scripts/process-tps-v1.mjs
      </p>
    </GlassPanel>
  );
}

function LivingAnswer({
  question,
  parsed,
  result,
}: {
  question: string;
  parsed: AskParseResult;
  result?: TorontoQueryResult;
}) {
  const hasFilters = activeFilterCount(parsed.filters) > 0;

  return (
    <div className="mt-6 flex flex-col gap-6">
      <GlassPanel className="p-5">
        <SectionHeader
          kicker="Visible compile"
          title="What we understood"
          description={`From “${question}”`}
          className="mb-4"
        />
        <div className="flex flex-wrap gap-2">
          {parsed.understood.map((item) => (
            <StatusChip key={item} tone="cyan" dot>{item}</StatusChip>
          ))}
          {!parsed.understood.length ? (
            <StatusChip tone="neutral">No supported filters found</StatusChip>
          ) : null}
        </div>

        {parsed.notUsed.length ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
            <span className="kicker text-amber">Not used</span>
            {parsed.notUsed.map((item) => (
              <span
                key={item}
                className="rounded-full border border-amber/30 bg-amber/[0.06] px-2.5 py-1 text-xs text-amber"
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </GlassPanel>

      {!hasFilters ? (
        <GlassPanel soft className="p-6 text-center">
          <p className="text-sm font-medium text-ink">
            We could not turn that question into a supported filter.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            No broad “all records” answer was run. Try an offence, year,
            neighbourhood, or TPS division from the examples above.
          </p>
        </GlassPanel>
      ) : null}

      {result ? (
        <ResultContent question={question} parsed={parsed} result={result} />
      ) : null}
    </div>
  );
}

function ResultContent({
  question,
  parsed,
  result,
}: {
  question: string;
  parsed: AskParseResult;
  result: TorontoQueryResult;
}) {
  const { summary } = result;
  const mapUrl = buildExplorerUrl("map", parsed.filters);
  const tableUrl = buildExplorerUrl("table", parsed.filters);
  const askUrl = `/toronto/ask?${new URLSearchParams({ q: question }).toString()}`;
  const selectedDatasets = getV1DatasetsBySlug(parsed.filters.offence);

  return (
    <>
      <GlassPanel className="p-5">
        <p className="text-lg leading-relaxed text-ink">
          <span className="nums font-semibold text-cyan">
            {summary.total.toLocaleString("en-CA")}
          </span>{" "}
          TPS open-data record{summary.total === 1 ? "" : "s"} match this
          question; {summary.mappable.toLocaleString("en-CA")} can be shown as
          map markers.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={mapUrl} className="rounded-md border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan hover:bg-cyan/20">
            Open same result in map
          </Link>
          <Link href={tableUrl} className="rounded-md border border-line bg-panel-2 px-4 py-2 text-sm font-medium text-ink hover:border-cyan/30">
            Open full table
          </Link>
        </div>
      </GlassPanel>

      {summary.total === 0 ? (
        <GlassPanel soft className="p-8 text-center">
          <p className="text-sm font-medium text-ink">No records match these filters.</p>
          <p className="mt-2 text-xs text-muted">
            The query is valid and reproducible; the local TPS dataset simply
            returned an empty result.
          </p>
        </GlassPanel>
      ) : (
        <>
          <section>
            <SectionHeader
              kicker="Living map"
              title="Real result preview"
              description="A deterministic preview of matching records with valid TPS coordinates."
              className="mb-4"
            />
            <TorontoMap
              incidents={result.mapRecords}
              totalMappableCount={summary.mappable}
              nonMappableCount={summary.nonMappable}
              mapLimit={result.mapLimit}
            />
          </section>

          <section>
            <SectionHeader
              kicker="Record preview"
              title="First five matching rows"
              action={<Link href={tableUrl} className="text-sm text-cyan hover:underline">Full table →</Link>}
              className="mb-4"
            />
            <RecordPreview incidents={result.records} />
          </section>
        </>
      )}

      <SourceReceipt
        datasets={selectedDatasets}
        recordCount={summary.total}
        filters={parsed.understood}
        reproUrl={askUrl}
      />
    </>
  );
}

function RecordPreview({ incidents }: { incidents: TorontoIncident[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-panel/40">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              {[
                "Occurrence",
                "Offence",
                "Neighbourhood",
                "Division",
                "Source record",
              ].map((column) => (
                <th key={column} className="kicker whitespace-nowrap px-4 py-2.5 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {incidents.map((record) => (
              <tr key={record.recordKey} className="border-b border-line/50 last:border-0">
                <td className="nums whitespace-nowrap px-4 py-2.5 text-muted">{record.occDate || "Unknown"}</td>
                <td className="px-4 py-2.5 text-ink">{record.offence}</td>
                <td className="px-4 py-2.5 text-muted">{record.neighbourhood158}</td>
                <td className="nums px-4 py-2.5 text-muted">{record.division}</td>
                <td className="nums px-4 py-2.5 text-faint">#{record.sourceRecordId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
