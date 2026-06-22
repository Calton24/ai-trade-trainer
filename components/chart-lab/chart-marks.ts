import type { AnnotationType, MarkerTool } from "@/lib/charts/types"

/** Design-system colours for every mark type (annotations + tools). */
export const MARK_COLORS: Record<string, string> = {
  "swing-high": "#eab308",
  "swing-low": "#eab308",
  support: "#eab308",
  resistance: "#eab308",
  trendline: "#a855f7",
  line: "#a855f7",
  break: "#22c55e",
  retest: "#06b6d4",
  entry: "#22c55e",
  "stop-loss": "#ef4444",
  "take-profit": "#3b82f6",
  label: "#94a3b8",
  arrow: "#94a3b8",
  zone: "#eab308",
}

export const MARK_LABELS: Record<MarkerTool, string> = {
  pointer: "Pointer",
  "swing-high": "Swing High",
  "swing-low": "Swing Low",
  support: "Support",
  resistance: "Resistance",
  trendline: "Trendline",
  break: "Break",
  retest: "Retest",
  entry: "Entry",
  "stop-loss": "Stop Loss",
  "take-profit": "Take Profit",
}

export const SHORT_LABELS: Record<MarkerTool, string> = {
  pointer: "",
  "swing-high": "SH",
  "swing-low": "SL",
  support: "Support",
  resistance: "Resistance",
  trendline: "Trend",
  break: "Break",
  retest: "Retest",
  entry: "Entry",
  "stop-loss": "Stop",
  "take-profit": "Target",
}

/** Tools rendered as a horizontal price level rather than a point. */
export const LEVEL_TYPES = new Set<AnnotationType | MarkerTool>([
  "support",
  "resistance",
  "entry",
  "stop-loss",
  "take-profit",
])

export function markColor(type: string, override?: string): string {
  return override ?? MARK_COLORS[type] ?? "#94a3b8"
}
