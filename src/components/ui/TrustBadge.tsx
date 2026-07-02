/**
 * Standardized trust/roadmap signal used across CrimeCanada.io.
 *
 * A small, fixed vocabulary so "is this real or a concept?" always reads the
 * same way wherever it appears. Reuses the existing StatusChip/PreviewBadge
 * color tokens — no new color system.
 */

export type TrustBadgeLabel =
  | "Live source data"
  | "Local corpus"
  | "Aggregate only"
  | "Coming soon"
  | "Source-backed"
  | "Concept";

type TrustBadgeTone = "cyan" | "amber" | "violet" | "green";

const TONE_BY_LABEL: Record<TrustBadgeLabel, TrustBadgeTone> = {
  "Live source data": "cyan",
  "Local corpus": "green",
  "Aggregate only": "amber",
  "Coming soon": "violet",
  "Source-backed": "cyan",
  Concept: "violet",
};

const TONE_CLASS: Record<TrustBadgeTone, string> = {
  cyan: "border-cyan/40 bg-cyan/10 text-cyan",
  amber: "border-amber/40 bg-amber/10 text-amber",
  violet: "border-violet/40 bg-violet/10 text-violet",
  green: "border-green/40 bg-green/10 text-green",
};

interface TrustBadgeProps {
  label: TrustBadgeLabel;
  className?: string;
}

export function TrustBadge({ label, className = "" }: TrustBadgeProps) {
  const tone = TONE_BY_LABEL[label];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.62rem] font-medium uppercase tracking-wide ${TONE_CLASS[tone]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-dot" />
      {label}
    </span>
  );
}
