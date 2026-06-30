import type { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  /** Use the lighter, lower-contrast glass treatment. */
  soft?: boolean;
  /** Add hover lift + cyan edge for clickable cards. */
  interactive?: boolean;
  as?: "div" | "section" | "article" | "aside";
}

export function GlassPanel({
  children,
  className = "",
  soft = false,
  interactive = false,
  as: Tag = "div",
}: GlassPanelProps) {
  return (
    <Tag
      className={[
        soft ? "glass-2" : "glass",
        interactive ? "card-hover" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
