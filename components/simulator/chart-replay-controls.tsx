"use client"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ReplaySpeed } from "@/lib/simulator/types"
import { cn } from "@/lib/utils"

interface ChartReplayControlsProps {
  isPlaying: boolean
  speed: ReplaySpeed
  currentIndex: number
  maxIndex: number
  minIndex?: number
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onPrev: () => void
  onReset: () => void
  onSpeedChange: (speed: ReplaySpeed) => void
  className?: string
}

const SPEEDS: ReplaySpeed[] = [1, 2, 5]

export function ChartReplayControls({
  isPlaying,
  speed,
  currentIndex,
  maxIndex,
  minIndex = 0,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  onSpeedChange,
  className,
}: ChartReplayControlsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-card/80 px-3 py-2",
        className
      )}
    >
      <Button
        size="sm"
        variant="outline"
        onClick={isPlaying ? onPause : onPlay}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onPrev}
        disabled={currentIndex <= minIndex}
        aria-label="Previous candle"
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onNext}
        disabled={currentIndex >= maxIndex}
        aria-label="Next candle"
      >
        <ChevronRightIcon className="size-4" />
      </Button>
      <Button size="sm" variant="ghost" onClick={onReset} aria-label="Reset replay">
        <RotateCcwIcon className="size-4" />
      </Button>

      <div className="ml-1 flex items-center gap-1 border-l border-border/60 pl-2">
        {SPEEDS.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={speed === s ? "default" : "ghost"}
            className="h-7 px-2 text-xs"
            onClick={() => onSpeedChange(s)}
          >
            x{s}
          </Button>
        ))}
      </div>

      <span className="ml-auto text-xs text-muted-foreground">
        Candle {currentIndex + 1} / {maxIndex + 1}
      </span>
    </div>
  )
}
