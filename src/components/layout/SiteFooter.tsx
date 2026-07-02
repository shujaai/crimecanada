import Link from "next/link";
import { DisclaimerBlock } from "@/components/ui/DisclaimerBlock";

const FOOTER_LINKS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { href: "/toronto", label: "Toronto hub" },
      { href: "/toronto/map", label: "Map" },
      { href: "/toronto/table", label: "Table" },
      { href: "/toronto/search", label: "Search" },
      { href: "/toronto/ask", label: "Ask the record" },
    ],
  },
  {
    heading: "Data",
    links: [
      { href: "/data/sources", label: "Sources & licence" },
      { href: "/data/layers", label: "Source layers" },
      { href: "/api", label: "API (waitlist)" },
    ],
  },
  {
    heading: "Concept",
    links: [
      { href: "/vision", label: "Vision" },
      { href: "/canada", label: "Canada organism" },
      { href: "/ai", label: "AI copilot (concept)" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-base/80">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md border border-cyan/50 bg-cyan/10">
                <span className="h-2 w-2 rounded-full bg-cyan" />
              </span>
              <span className="text-sm font-semibold tracking-tight text-ink">
                CrimeCanada<span className="text-cyan">.io</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted">
              Official public crime data, searchable. A neutral, source-backed
              transparency portal. Toronto Police Service open data is the V1
              starting point.
            </p>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <p className="kicker mb-3">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-xs text-muted transition-colors hover:text-cyan"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <DisclaimerBlock variant="full" />
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            Data © Toronto Police Service, used under the Open Government Licence.
            CrimeCanada.io is not affiliated with any police service.
          </p>
          <p className="text-faint">
            CrimeCanada.io is a separate product from CrimeInToronto.com.
          </p>
        </div>
      </div>
    </footer>
  );
}
