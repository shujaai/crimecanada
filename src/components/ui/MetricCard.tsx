import type { ReactNode } from "react";
import { GlassPanel } from "./GlassPanel";
import { PreviewBadge } from "./PreviewBadge";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  /** Marks the value as derived from synthetic preview data. */
  preview?: boolean;
  /** Accent for the value text. */
  tone?: "ink" | "cyan" | "amber" | "red";
  icon?: ReactNode;
  className?: string;
}

const VALUE_TONE = {
  ink: "text-ink",
  cyan: "text-cyan text-glow-cyan",
  amber: "text-amber",
  red: "text-red-soft",
} as const;

export function MetricCard({
  label,
  value,
  hint,
  preview = false,
  tone = "ink",
  icon,
  className = "",
}: MetricCardProps) {
  return (
    <GlassPanel className={`flex flex-col gap-2 p-4 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="kicker">{label}</span>
        {icon ? <span className="text-faint">{icon}</span> : null}
      </div>
      <div className={`nums text-2xl font-semibold tracking-tight sm:text-3xl ${VALUE_TONE[tone]}`}>
        {value}
      </div>
      <div className="flex items-center justify-between gap-2">
        {hint ? <span className="text-xs text-muted">{hint}</span> : <span />}
        {preview ? <PreviewBadge /> : null}
      </div>
    </GlassPanel>
  );
}
