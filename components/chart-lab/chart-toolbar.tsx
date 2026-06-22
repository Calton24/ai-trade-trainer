"use client"

import {
  CrosshairIcon,
  type LucideIcon,
  MinusIcon,
  MousePointer2Icon,
  OctagonXIcon,
  RefreshCwIcon,
  TargetIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  ZapIcon,
} from "lucide-react"

import { MARK_LABELS } from "@/components/chart-lab/chart-marks"
import type { MarkerTool } from "@/lib/charts/types"
import { cn } from "@/lib/utils"

const TOOL_ICONS: Record<MarkerTool, LucideIcon> = {
  pointer: MousePointer2Icon,
  "swing-high": TrendingUpIcon,
  "swing-low": TrendingDownIcon,
  support: MinusIcon,
  resistance: MinusIcon,
  trendline: TrendingUpIcon,
  break: ZapIcon,
  retest: RefreshCwIcon,
  entry: CrosshairIcon,
  "stop-loss": OctagonXIcon,
  "take-profit": TargetIcon,
}

interface ChartToolbarProps {
  tools: MarkerTool[]
  activeTool: MarkerTool
  onSelect: (tool: MarkerTool) => void
  orientation?: "horizontal" | "vertical"
  className?: string
}

export function ChartToolbar({
  tools,
  activeTool,
  onSelect,
  orientation = "horizontal",
  className,
}: ChartToolbarProps) {
  const allTools: MarkerTool[] = ["pointer", ...tools]
  return (
    <div
      role="toolbar"
      aria-label="Chart marker tools"
      className={cn(
        "flex gap-1.5 rounded-lg border border-border/60 bg-card/60 p-1.5",
        orientation === "vertical"
          ? "flex-col"
          : "flex-row overflow-x-auto",
        className
      )}
    >
      {allTools.map((tool) => {
        const Icon = TOOL_ICONS[tool]
        const active = tool === activeTool
        return (
          <button
            key={tool}
            type="button"
            title={MARK_LABELS[tool]}
            aria-pressed={active}
            onClick={() => onSelect(tool)}
            className={cn(
              "flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-medium whitespace-nowrap transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className={cn(orientation === "horizontal" && "hidden sm:inline")}>
              {MARK_LABELS[tool]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
