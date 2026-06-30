import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface Lens {
  title: string;
  blurb: string;
  href: string;
  glyph: string;
}

const LENSES: Lens[] = [
  {
    title: "By offence",
    blurb: "Filter the six Major Crime datasets by offence type.",
    href: "/toronto/search",
    glyph: "◇",
  },
  {
    title: "By neighbourhood",
    blurb: "Reported records matching a 158-system neighbourhood.",
    href: "/toronto/search",
    glyph: "⬡",
  },
  {
    title: "By division",
    blurb: "Scope records to one of 16 TPS police divisions.",
    href: "/toronto/search",
    glyph: "▦",
  },
  {
    title: "By time",
    blurb: "Date range, year, month, weekday, hour-of-day rhythm.",
    href: "/toronto/table",
    glyph: "◷",
  },
  {
    title: "By dataset",
    blurb: "See which datasets are published, deferred, or reference-only.",
    href: "/data/sources",
    glyph: "▤",
  },
  {
    title: "By source quality",
    blurb: "Mappable vs non-mappable, provenance, and limitations.",
    href: "/data/sources",
    glyph: "✦",
  },
];

export function DataLensCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {LENSES.map((lens) => (
        <Link key={lens.title} href={lens.href} className="group">
          <GlassPanel interactive className="flex h-full flex-col gap-2 p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg text-cyan">{lens.glyph}</span>
              <span className="text-faint transition-transform group-hover:translate-x-0.5">→</span>
            </div>
            <h3 className="text-sm font-semibold text-ink">{lens.title}</h3>
            <p className="text-xs leading-relaxed text-muted">{lens.blurb}</p>
          </GlassPanel>
        </Link>
      ))}
    </div>
  );
}
