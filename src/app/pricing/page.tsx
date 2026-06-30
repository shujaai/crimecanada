import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusChip } from "@/components/ui/StatusChip";
import { PreviewBadge } from "@/components/ui/PreviewBadge";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "The Toronto explorer is free. Future ethical paid features are previewed here. We never charge to remove, hide, or clean up public records.",
};

const FREE_FEATURES = [
  "Search, filter, map, and table the six Major Crime datasets",
  "Source citation on every record",
  "Shareable, reproducible filtered URLs",
  "Full transparency ledger and field glossary",
];

const FUTURE_PAID = [
  { title: "Data exports", body: "CSV / JSON / GeoJSON downloads of filtered results." },
  { title: "Saved searches", body: "Store and revisit your filter sets." },
  { title: "Alerts", body: "Notifications when new records match a saved filter." },
  { title: "AI search", body: "Source-bound natural-language querying with citations." },
  { title: "API access", body: "Keyed, rate-limited machine access to published data." },
  { title: "Custom dashboards", body: "Composable panels for ongoing monitoring." },
];

const FORBIDDEN = [
  "Record removal",
  "Hiding or paywalling specific public records",
  "Reputation cleanup",
  "Private personal profiles",
];

export default function Pricing() {
  return (
    <>
      <PageHero
        kicker="Pricing"
        badge={<StatusChip tone="cyan" dot>Explorer is free</StatusChip>}
        title="Free to explore. Ethical by design."
        description="V1 has no login, no billing, and no API keys. The pricing below is a preview of future paid features — and a hard line on what we will never sell."
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Free tier */}
          <GlassPanel className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="kicker text-cyan">Free</p>
                <p className="mt-1 text-3xl font-semibold text-ink">
                  $0<span className="text-base font-normal text-faint"> / forever for V1</span>
                </p>
              </div>
              <StatusChip tone="cyan" dot>Live now</StatusChip>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-cyan">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/toronto"
              className="mt-2 inline-flex w-fit rounded-md border border-cyan/40 bg-cyan/15 px-5 py-2.5 text-sm font-medium text-cyan transition-colors hover:bg-cyan/25"
            >
              Start exploring
            </Link>
          </GlassPanel>

          {/* Future paid */}
          <GlassPanel soft className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="kicker text-amber">Future paid tiers</p>
                <p className="mt-1 text-xl font-semibold text-ink">Coming after V1</p>
              </div>
              <PreviewBadge label="Not available yet" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {FUTURE_PAID.map((f) => (
                <div key={f.title} className="rounded-lg border border-line bg-base/50 p-3">
                  <p className="text-sm font-medium text-ink">{f.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{f.body}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-faint">No checkout, no accounts, no API keys exist in V1.</p>
          </GlassPanel>
        </div>

        {/* Forbidden forever */}
        <section className="mt-10">
          <GlassPanel className="border-red/25 p-6">
            <SectionHeader
              kicker="Forbidden forever"
              title="What we will never sell"
              description="If a feature could be read as “pay to make the data go away,” it is rejected. Permanently."
              className="mb-4"
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {FORBIDDEN.map((f) => (
                <div key={f} className="flex items-center gap-2 rounded-lg border border-red/20 bg-red/[0.05] px-3 py-2.5">
                  <span className="text-red-soft">✕</span>
                  <span className="text-sm text-ink">{f}</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </section>
      </div>
    </>
  );
}
