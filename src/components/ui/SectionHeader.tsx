import type { ReactNode } from "react";

interface SectionHeaderProps {
  kicker?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  kicker,
  title,
  description,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div className="max-w-2xl">
        {kicker ? <p className="kicker mb-2 text-cyan">{kicker}</p> : null}
        <h2 className="text-balance text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
