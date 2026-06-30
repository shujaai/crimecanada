import type { TypedLayer } from "@/lib/datasets";
import { LAYER_LABELS } from "@/lib/datasets";

interface DatasetBadgeProps {
  layer: TypedLayer;
  className?: string;
}

const LAYER_TONE: Record<TypedLayer, string> = {
  public_incident_records: "border-cyan/40 bg-cyan/10 text-cyan",
  sensitive_incident_records: "border-red/40 bg-red/10 text-red-soft",
  traffic_ksi_records: "border-amber/40 bg-amber/10 text-amber",
  calls_for_service_crisis_records: "border-violet/40 bg-violet/10 text-violet",
  aggregate_metric_tables: "border-line bg-panel-2 text-muted",
  reference_geography_datasets: "border-green/40 bg-green/10 text-green",
  future_article_context_links: "border-violet/40 bg-violet/10 text-violet",
};

export function DatasetBadge({ layer, className = "" }: DatasetBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[0.62rem] ${LAYER_TONE[layer]} ${className}`}
      title={layer}
    >
      {LAYER_LABELS[layer]}
    </span>
  );
}
