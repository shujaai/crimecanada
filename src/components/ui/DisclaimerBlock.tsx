/**
 * Legal/safety disclaimers required by docs/LEGAL_GUARDRAILS.md.
 * Shown on explorer pages and (compact form) in the footer.
 */

interface DisclaimerBlockProps {
  variant?: "full" | "compact";
  className?: string;
}

export const DISCLAIMERS: string[] = [
  "Data is sourced from official Toronto Police Service public/open datasets.",
  "CrimeCanada.io does not independently verify individual incidents beyond what TPS publishes.",
  "Data is not real-time and is not suitable for emergency use. Call 911 for emergencies.",
  "CrimeCanada.io does not provide safety ratings, rankings, or recommendations.",
];

export function DisclaimerBlock({
  variant = "full",
  className = "",
}: DisclaimerBlockProps) {
  if (variant === "compact") {
    return (
      <p className={`text-xs leading-relaxed text-faint ${className}`}>
        Reported incidents from official TPS open data. Not real-time; not for
        emergencies (call 911). No safety scores or rankings.
      </p>
    );
  }

  return (
    <div
      className={`rounded-xl border border-amber/25 bg-amber/[0.06] p-4 ${className}`}
    >
      <p className="kicker mb-2 text-amber">Data limitations &amp; disclaimer</p>
      <ul className="space-y-1.5 text-xs leading-relaxed text-muted">
        {DISCLAIMERS.map((d) => (
          <li key={d} className="flex gap-2">
            <span aria-hidden className="mt-0.5 text-amber">•</span>
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
