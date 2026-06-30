import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusChip } from "@/components/ui/StatusChip";
import { DisclaimerBlock } from "@/components/ui/DisclaimerBlock";
import {
  V1_DATASETS,
  V1_TOTAL_RECORDS,
  V1_NON_MAPPABLE_RECORDS,
  TOTAL_CORPUS_FILES,
} from "@/lib/datasets";

export default function Home() {
  return (
    <>
      <PageHero
        grid
        kicker="Official public crime data, searchable"
        badge={<StatusChip tone="cyan" dot>Toronto · V1 live first</StatusChip>}
        title={
          <>
            A living atlas of Canada&apos;s{" "}
            <span className="text-cyan text-glow-cyan">public crime data</span> —
            mapped, filtered, and cited.
          </>
        }
        description="Search, map, and verify official police open data with a source citation on every record. V1 covers Toronto Police Service Major Crime open data. No safety scores. No news feed. No name search."
        actions={
          <>
            <Link
              href="/toronto"
              className="rounded-md border border-cyan/40 bg-cyan/15 px-5 py-2.5 text-sm font-medium text-cyan transition-colors hover:bg-cyan/25"
            >
              Explore Toronto data
            </Link>
            <Link
              href="/data/sources"
              className="rounded-md border border-line bg-panel-2 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-cyan/30"
            >
              See data sources
            </Link>
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Animated dashboard preview + fast search */}
        <section className="-mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <GlassPanel className="relative overflow-hidden p-5">
            <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyan/[0.05] to-transparent animate-sweep" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="kicker text-cyan">Toronto · Major Crime open data</span>
                <StatusChip tone="amber" dot>V1 ingestion target</StatusChip>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <PreviewTile label="Published datasets" value={String(V1_DATASETS.length)} tone="cyan" />
                <PreviewTile label="Source records" value={V1_TOTAL_RECORDS.toLocaleString("en-CA")} />
                <PreviewTile label="Non-mappable (0,0)" value={V1_NON_MAPPABLE_RECORDS.toLocaleString("en-CA")} tone="amber" />
                <PreviewTile label="Corpus files held" value={String(TOTAL_CORPUS_FILES)} />
              </div>
              <p className="mt-4 text-xs leading-relaxed text-faint">
                Dataset-level totals are factual counts from the committed TPS
                inventory. Live explorer figures appear once ingestion is wired
                and are clearly marked as preview until then.
              </p>
            </div>
          </GlassPanel>

          <GlassPanel soft className="flex flex-col justify-between gap-4 p-5">
            <div>
              <span className="kicker mb-2 block">Fast search</span>
              <Link
                href="/toronto/search"
                className="flex items-center gap-3 rounded-lg border border-line bg-base px-3 py-3 text-sm text-faint transition-colors hover:border-cyan/40"
              >
                <span className="text-cyan">⌕</span>
                Search Toronto public crime data…
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Assault", "Robbery", "Auto theft", "Break & enter"].map((t) => (
                <Link
                  key={t}
                  href="/toronto/search"
                  className="rounded-full border border-line bg-panel-2 px-3 py-1 text-xs text-muted transition-colors hover:border-cyan/30 hover:text-ink"
                >
                  {t}
                </Link>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-faint">
              Structured filters only — there is no free-text search for people,
              names, or profiles.
            </p>
          </GlassPanel>
        </section>

        {/* Trust strip */}
        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <TrustCard
            title="Official sources only"
            body="V1 uses Toronto Police Service public/open data, downloaded directly from the official portal."
          />
          <TrustCard
            title="A citation on every record"
            body="Dataset name, source URL, licence, update date, and ingestion date travel with the data."
          />
          <TrustCard
            title="No safety scores"
            body="We present neutral counts and locations. No safe/unsafe labels, danger rankings, or predictions."
          />
        </section>

        {/* Three cards */}
        <section className="mt-12">
          <SectionHeader
            kicker="Three ways in"
            title="Map it, table it, or trace the source"
            description="Every view shares one filter state, so any result is shareable and reproducible."
          />
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <EntryCard
              href="/toronto/map"
              title="Map"
              body="Neutral incident markers on a filterable map. Records at 0,0 stay searchable but off the map."
              glyph="◎"
            />
            <EntryCard
              href="/toronto/table"
              title="Table"
              body="Dense, sortable records with an expandable source citation on every row."
              glyph="▤"
            />
            <EntryCard
              href="/data/sources"
              title="Sources"
              body="The full transparency ledger: published, deferred, and the complete 74-file corpus."
              glyph="✦"
            />
          </div>
        </section>

        {/* Future organism teaser */}
        <section className="mt-12">
          <GlassPanel className="relative overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" />
            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <span className="kicker text-violet">The bigger picture</span>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                  Built to connect Canadian city datasets — with provenance.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  CrimeCanada.io is designed as a federated, provenance-aware
                  system: jurisdictions, datasets, ingestion runs, and typed
                  source layers. Toronto is live first; Calgary, Peel, Edmonton,
                  Vancouver, and Winnipeg are designed to plug in later — never
                  with fabricated data.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/vision" className="rounded-md border border-violet/40 bg-violet/10 px-4 py-2 text-sm font-medium text-violet transition-colors hover:bg-violet/20">
                  Read the vision
                </Link>
                <Link href="/canada" className="rounded-md border border-line bg-panel-2 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-violet/30">
                  Canada organism
                </Link>
              </div>
            </div>
          </GlassPanel>
        </section>

        <section className="mb-16 mt-10">
          <DisclaimerBlock />
        </section>
      </div>
    </>
  );
}

function PreviewTile({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "cyan" | "amber";
}) {
  const toneClass = { ink: "text-ink", cyan: "text-cyan", amber: "text-amber" }[tone];
  return (
    <div className="rounded-lg border border-line bg-base/60 p-3">
      <p className="kicker mb-1.5">{label}</p>
      <p className={`nums text-lg font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function TrustCard({ title, body }: { title: string; body: string }) {
  return (
    <GlassPanel soft className="p-4">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">{body}</p>
    </GlassPanel>
  );
}

function EntryCard({
  href,
  title,
  body,
  glyph,
}: {
  href: string;
  title: string;
  body: string;
  glyph: string;
}) {
  return (
    <Link href={href} className="group">
      <GlassPanel interactive className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="text-2xl text-cyan">{glyph}</span>
          <span className="text-faint transition-transform group-hover:translate-x-0.5">→</span>
        </div>
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <p className="text-sm leading-relaxed text-muted">{body}</p>
      </GlassPanel>
    </Link>
  );
}
