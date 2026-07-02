"use client"

import { ChartCanvas } from "@/components/chart-lab/chart-canvas"
import { ChartReplayControls } from "@/components/simulator/chart-replay-controls"
import { useChartReplay } from "@/components/simulator/use-chart-replay"
import { Badge } from "@/components/ui/badge"
import { sliceVisibleCandles } from "@/lib/simulator/replay"
import type { ChartScenario, MarkerTool, UserMarker } from "@/lib/charts/types"
import { cn } from "@/lib/utils"

interface SimulatorChartPanelProps {
  scenario: ChartScenario
  symbol: string
  timeframe: string
  replayMinIndex?: number
  replayMaxIndex?: number
  interactive?: boolean
  activeTool?: MarkerTool
  userMarkers?: UserMarker[]
  onPlacePoint?: (point: { index: number; price: number }) => void
  onPlaceLine?: (
    from: { index: number; price: number },
    to: { index: number; price: number }
  ) => void
  hideReplay?: boolean
  className?: string
}

export function SimulatorChartPanel({
  scenario,
  symbol,
  timeframe,
  replayMinIndex = 0,
  replayMaxIndex,
  interactive = false,
  activeTool = "pointer",
  userMarkers = [],
  onPlacePoint,
  onPlaceLine,
  hideReplay = false,
  className,
}: SimulatorChartPanelProps) {
  const maxIdx = replayMaxIndex ?? scenario.candles.length - 1
  const replay = useChartReplay({
    minIndex: replayMinIndex,
    maxIndex: maxIdx,
    initialIndex: replayMinIndex,
  })

  const visible = sliceVisibleCandles(scenario.candles, replay.currentIndex)

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{symbol}</Badge>
          <Badge variant="outline">{timeframe}</Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">{scenario.title}</p>
      </div>

      {!hideReplay && (
        <ChartReplayControls
          isPlaying={replay.isPlaying}
          speed={replay.speed}
          currentIndex={replay.currentIndex}
          maxIndex={maxIdx}
          minIndex={replayMinIndex}
          onPlay={replay.play}
          onPause={replay.pause}
          onNext={replay.next}
          onPrev={replay.prev}
          onReset={replay.reset}
          onSpeedChange={replay.setSpeed}
        />
      )}

      <div className="overflow-hidden rounded-xl border border-border/60 bg-background/50">
        <ChartCanvas
          candles={visible}
          annotations={scenario.annotations}
          userMarkers={userMarkers.filter((m) => m.index <= replay.currentIndex)}
          activeTool={activeTool}
          interactive={interactive && !replay.isPlaying}
          onPlacePoint={onPlacePoint}
          onPlaceLine={onPlaceLine}
          height={380}
        />
      </div>
    </div>
  )
}
