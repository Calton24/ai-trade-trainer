"use client"

import { memo } from "react"
import {
  ArrowUpRightIcon,
  EraserIcon,
  MagnetIcon,
  MinusIcon,
  MousePointer2Icon,
  SquareIcon,
  TargetIcon,
  TrendingUpIcon,
  TypeIcon,
  Undo2Icon,
} from "lucide-react"

import type { ChartDrawing, DrawingTool } from "@/lib/execution-lab/drawings"
import { DRAWING_TOOL_LABELS } from "@/lib/execution-lab/drawings"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const TOOL_ICONS: Record<DrawingTool, typeof MousePointer2Icon> = {
  cursor: MousePointer2Icon,
  hline: MinusIcon,
  trendline: TrendingUpIcon,
  rectangle: SquareIcon,
  arrow: ArrowUpRightIcon,
  text: TypeIcon,
  risk: TargetIcon,
}

interface ChartDrawingToolbarProps {
  activeTool: DrawingTool
  magnet: boolean
  drawings: ChartDrawing[]
  onToolChange: (tool: DrawingTool) => void
  onMagnetToggle: () => void
  onUndo: () => void
  onClear: () => void
  className?: string
  compact?: boolean
}

export const ChartDrawingToolbar = memo(function ChartDrawingToolbar({
  activeTool,
  magnet,
  drawings,
  onToolChange,
  onMagnetToggle,
  onUndo,
  onClear,
  className,
  compact,
}: ChartDrawingToolbarProps) {
  const tools: DrawingTool[] = [
    "cursor",
    "hline",
    "trendline",
    "rectangle",
    "arrow",
    "text",
    "risk",
  ]

  return (
    <div
      className={cn(
        "flex gap-1 rounded-lg border border-border/60 bg-card/90 p-1",
        compact ? "flex-row flex-wrap" : "flex-col",
        className
      )}
    >
      {tools.map((tool) => {
        const Icon = TOOL_ICONS[tool]
        return (
          <Button
            key={tool}
            type="button"
            size="sm"
            variant={activeTool === tool ? "default" : "ghost"}
            className={cn("h-8", compact ? "w-8 px-0" : "w-full justify-start gap-2 px-2")}
            onClick={() => onToolChange(tool)}
            title={DRAWING_TOOL_LABELS[tool]}
          >
            <Icon className="size-4 shrink-0" />
            {!compact && <span className="text-xs">{DRAWING_TOOL_LABELS[tool]}</span>}
          </Button>
        )
      })}
      <div className={cn("border-border/60", compact ? "mx-1 w-px self-stretch border-l" : "my-1 border-t")} />
      <Button
        type="button"
        size="sm"
        variant={magnet ? "default" : "ghost"}
        className={cn("h-8", compact ? "w-8 px-0" : "w-full justify-start gap-2 px-2")}
        onClick={onMagnetToggle}
        title="Magnet — snap to candle high/low"
      >
        <MagnetIcon className="size-4" />
        {!compact && <span className="text-xs">Magnet</span>}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className={cn("h-8", compact ? "w-8 px-0" : "w-full justify-start gap-2 px-2")}
        onClick={onUndo}
        disabled={drawings.length === 0}
        title="Undo last drawing"
      >
        <Undo2Icon className="size-4" />
        {!compact && <span className="text-xs">Undo</span>}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className={cn("h-8", compact ? "w-8 px-0" : "w-full justify-start gap-2 px-2")}
        onClick={onClear}
        disabled={drawings.length === 0}
        title="Clear all drawings"
      >
        <EraserIcon className="size-4" />
        {!compact && <span className="text-xs">Clear</span>}
      </Button>
    </div>
  )
})
