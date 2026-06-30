/**
 * Honest "not live data" marker. Used anywhere the UI shows a number or view
 * derived from synthetic preview data rather than ingested TPS records.
 */

interface PreviewBadgeProps {
  /** Override the default label, e.g. "Concept" or "Coming soon". */
  label?: string;
  tone?: "amber" | "violet";
  className?: string;
}

export function PreviewBadge({
  label = "Preview · not live data",
  tone = "amber",
  className = "",
}: PreviewBadgeProps) {
  const tones = {
    amber: "border-amber/40 bg-amber/10 text-amber",
    violet: "border-violet/40 bg-violet/10 text-violet",
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.62rem] font-medium uppercase tracking-wide ${tones[tone]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-dot" />
      {label}
    </span>
  );
}
