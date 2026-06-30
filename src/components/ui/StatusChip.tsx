import type { ReactNode } from "react";

export type ChipTone = "cyan" | "amber" | "red" | "green" | "violet" | "neutral";

interface StatusChipProps {
  children: ReactNode;
  tone?: ChipTone;
  /** Show a leading status dot. */
  dot?: boolean;
  className?: string;
}

const TONES: Record<ChipTone, string> = {
  cyan: "border-cyan/40 bg-cyan/10 text-cyan",
  amber: "border-amber/40 bg-amber/10 text-amber",
  red: "border-red/40 bg-red/10 text-red-soft",
  green: "border-green/40 bg-green/10 text-green",
  violet: "border-violet/40 bg-violet/10 text-violet",
  neutral: "border-line bg-panel-2 text-muted",
};

export function StatusChip({
  children,
  tone = "neutral",
  dot = false,
  className = "",
}: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
