"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const PRIMARY_NAV = [
  { href: "/toronto", label: "Toronto" },
  { href: "/toronto/ask", label: "Ask the record" },
  { href: "/data/sources", label: "Sources" },
  { href: "/data/layers", label: "Layers" },
  { href: "/pricing", label: "Pricing" },
  { href: "/api", label: "API" },
];

const CONCEPT_NAV = [
  { href: "/vision", label: "Vision" },
  { href: "/canada", label: "Canada" },
  { href: "/ai", label: "AI copilot (concept)" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/toronto") {
    // "Ask the record" has its own nav entry, so the Toronto hub tab
    // should not also light up while on /toronto/ask.
    return pathname === "/toronto" || (pathname.startsWith("/toronto/") && !pathname.startsWith("/toronto/ask"));
  }
  if (href === "/data/sources") return pathname === "/data/sources";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="relative flex h-6 w-6 items-center justify-center rounded-md border border-cyan/50 bg-cyan/10">
            <span className="h-2 w-2 rounded-full bg-cyan animate-pulse-dot" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-ink">
            CrimeCanada<span className="text-cyan">.io</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                isActive(pathname, item.href)
                  ? "bg-cyan/10 text-cyan"
                  : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px bg-line" />
          {CONCEPT_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                isActive(pathname, item.href)
                  ? "bg-violet/10 text-violet"
                  : "text-faint hover:text-violet"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/toronto"
            className="hidden rounded-md border border-cyan/40 bg-cyan/10 px-3 py-1.5 text-sm font-medium text-cyan transition-colors hover:bg-cyan/20 sm:inline-flex"
          >
            Explore data
          </Link>
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted md:hidden"
          >
            <span className="text-lg leading-none">{open ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-line bg-base px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col">
            {[...PRIMARY_NAV, ...CONCEPT_NAV].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm ${
                  isActive(pathname, item.href) ? "text-cyan" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
