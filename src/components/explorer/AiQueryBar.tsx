"use client";

import { useState } from "react";
import { PreviewBadge } from "@/components/ui/PreviewBadge";

const EXAMPLES = [
  "Show assault records in 14 Division in 2025",
  "Compare auto theft by month",
  "What records are not mappable?",
  "Explain the Break and Enter dataset",
];

interface AiQueryBarProps {
  /** Compact variant for embedding on the homepage / hub. */
  compact?: boolean;
}

export function AiQueryBar({ compact = false }: AiQueryBarProps) {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint">
          <span className="kicker">AI</span>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask the data — e.g. “robberies in Scarborough in 2025”"
          aria-label="Ask the data (preview, not functional)"
          className="w-full rounded-lg border border-line bg-base py-3 pl-11 pr-32 text-sm text-ink outline-none placeholder:text-faint focus:border-violet/50"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          <PreviewBadge label="Coming soon" tone="violet" />
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setValue(ex)}
            className="rounded-full border border-line bg-panel-2 px-3 py-1 text-xs text-muted transition-colors hover:border-violet/40 hover:text-violet"
          >
            {ex}
          </button>
        ))}
      </div>

      {!compact ? (
        <p className="text-xs leading-relaxed text-faint">
          The AI co-pilot is a future, source-bound feature. It will convert
          questions into structured filters, cite datasets, record counts, and
          update dates, link to a reproducible explorer view, and refuse
          unsupported or safety-recommendation questions. It does not answer yet.
        </p>
      ) : null}
    </div>
  );
}
