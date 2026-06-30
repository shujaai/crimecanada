import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-panel/40 px-6 py-12 text-center ${className}`}
    >
      {icon ? <div className="text-faint">{icon}</div> : null}
      <p className="text-sm font-medium text-ink">{title}</p>
      {description ? (
        <p className="max-w-sm text-xs leading-relaxed text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
