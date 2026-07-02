"use client";

import { setResearcherModeEnabled, useResearcherMode } from "./researcherMode";

/**
 * Off by default. Shows technical field names/codes that already exist in
 * the filter UI (e.g. neighbourhood codes) instead of plain-language text.
 * Does not fetch or reveal any field that isn't already present in the DOM.
 */
export function ResearcherModeToggle() {
  const enabled = useResearcherMode();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => setResearcherModeEnabled(!enabled)}
      title="Researcher mode: show technical field names already present in this view (e.g. neighbourhood codes). Off by default."
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        enabled
          ? "border-cyan/50 bg-cyan/10 text-cyan"
          : "border-line bg-panel-2 text-muted hover:text-ink"
      }`}
    >
      <span
        className={`relative inline-flex h-3.5 w-6 shrink-0 items-center rounded-full transition-colors ${
          enabled ? "bg-cyan/60" : "bg-line"
        }`}
      >
        <span
          className={`inline-block h-2.5 w-2.5 transform rounded-full bg-base transition-transform ${
            enabled ? "translate-x-3" : "translate-x-0.5"
          }`}
        />
      </span>
      Researcher mode
    </button>
  );
}
