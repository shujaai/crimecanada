import type { ReactNode } from "react";

interface PageHeroProps {
  kicker?: string;
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  /** Show the faint blueprint grid backdrop. */
  grid?: boolean;
  className?: string;
}

export function PageHero({
  kicker,
  title,
  description,
  badge,
  actions,
  grid = false,
  className = "",
}: PageHeroProps) {
  return (
    <section
      className={`relative overflow-hidden border-b border-line ${grid ? "grid-overlay" : ""} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {kicker ? <span className="kicker text-cyan">{kicker}</span> : null}
            {badge}
          </div>
          <h1 className="max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-base leading-relaxed text-muted">
              {description}
            </p>
          ) : null}
          {actions ? <div className="mt-2 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
