import { TYPED_LAYERS, LAYER_STATUS_LABEL, type LayerStatus } from "@/lib/layers";
import { StatusChip, type ChipTone } from "@/components/ui/StatusChip";

const STATUS_TONE: Record<LayerStatus, ChipTone> = {
  live: "cyan",
  deferred: "amber",
  reference: "green",
  future: "violet",
};

interface DataLayerStackProps {
  /** Compact list for sidebars; full shows blurb + note. */
  variant?: "full" | "compact";
}

export function DataLayerStack({ variant = "full" }: DataLayerStackProps) {
  return (
    <div className="flex flex-col gap-2">
      {TYPED_LAYERS.map((layer, i) => (
        <div
          key={layer.id}
          className="relative rounded-lg border border-line bg-panel/50 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="nums text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-sm font-semibold text-ink">{layer.label}</h3>
              <span className="nums rounded border border-line bg-base px-1.5 py-0.5 text-[0.62rem] text-faint">
                {layer.fileCount} file{layer.fileCount === 1 ? "" : "s"}
              </span>
            </div>
            <StatusChip tone={STATUS_TONE[layer.status]} dot>
              {LAYER_STATUS_LABEL[layer.status]}
            </StatusChip>
          </div>
          {variant === "full" ? (
            <>
              <p className="mt-2 text-xs leading-relaxed text-muted">{layer.blurb}</p>
              <p className="mt-1.5 text-[0.68rem] leading-relaxed text-faint">{layer.note}</p>
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}
