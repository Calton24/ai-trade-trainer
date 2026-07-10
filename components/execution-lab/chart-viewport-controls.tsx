"use client"

import { memo } from "react"
import { Maximize2Icon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChartViewportControlsProps {
  onFit: () => void
  onReset: () => void
  className?: string
}

export const ChartViewportControls = memo(function ChartViewportControls({
  onFit,
  onReset,
  className,
}: ChartViewportControlsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={onFit} title="Fit chart (R)">
        <Maximize2Icon className="size-3.5" />
        <span className="ml-1 hidden sm:inline">Fit</span>
      </Button>
      <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={onReset} title="Reset view">
        <RotateCcwIcon className="size-3.5" />
        <span className="ml-1 hidden sm:inline">Reset</span>
      </Button>
    </div>
  )
})
