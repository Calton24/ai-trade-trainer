"use client"

import { useId, useMemo, useState, useSyncExternalStore } from "react"
import {
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  LightbulbIcon,
  RotateCcwIcon,
} from "lucide-react"

import { ChartCanvas } from "@/components/chart-lab/chart-canvas"
import { ChartFeedback } from "@/components/chart-lab/chart-feedback"
import { ChartToolbar } from "@/components/chart-lab/chart-toolbar"
import { Button } from "@/components/ui/button"
import { scoreScenario } from "@/lib/charts/scoring"
import {
  getChartLabScore,
  saveChartLabSession,
  subscribeChartLabSessions,
} from "@/lib/charts/storage"
import { TIMEFRAMES, type Timeframe } from "@/lib/charts/types"
import type {
  ChartPoint,
  ChartScenario,
  ChartScoreResult,
  MarkerTool,
  UserMarker,
} from "@/lib/charts/types"
import { cn } from "@/lib/utils"

export const CHART_DISCLAIMER =
  "Educational simulation only. Not financial advice or a trade recommendation."

interface ChartLabWorkspaceProps {
  scenario: ChartScenario
  variant?: "embed" | "full"
  onComplete?: (result: ChartScoreResult, markers: UserMarker[]) => void
}

let markerCounter = 0
const nextId = () => `m${++markerCounter}`

export function ChartLabWorkspace({
  scenario,
  variant = "embed",
  onComplete,
}: ChartLabWorkspaceProps) {
  const tools = scenario.tools ?? []
  const interactive = Boolean(scenario.expectedAnswer)
  const idBase = useId()

  const [markers, setMarkers] = useState<UserMarker[]>([])
  const [activeTool, setActiveTool] = useState<MarkerTool>(tools[0] ?? "pointer")
  const [result, setResult] = useState<ChartScoreResult | null>(null)
  const [showCorrect, setShowCorrect] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [viewTimeframe, setViewTimeframe] = useState<Timeframe>(
    scenario.timeframe
  )

  // Read the last saved score from localStorage in a hydration-safe way:
  // the server snapshot is always null, and the client re-reads after mount
  // and whenever a new attempt is saved.
  const savedScore = useSyncExternalStore(
    subscribeChartLabSessions,
    () => (interactive ? getChartLabScore(scenario.id) : null),
    () => null
  )

  const fullHeight = variant === "full" ? 460 : 300

  const placePoint = (point: ChartPoint) => {
    const marker: UserMarker = { id: nextId(), tool: activeTool, ...point }
    setMarkers((prev) => [...prev.filter((m) => m.tool !== activeTool), marker])
    setResult(null)
  }

  const placeLine = (from: ChartPoint, to: ChartPoint) => {
    const marker: UserMarker = {
      id: nextId(),
      tool: "trendline",
      index: from.index,
      price: from.price,
      to,
    }
    setMarkers((prev) => [...prev.filter((m) => m.tool !== "trendline"), marker])
    setResult(null)
  }

  const handleReset = () => {
    setMarkers([])
    setResult(null)
    setShowCorrect(false)
  }

  const handleSubmit = () => {
    const scored = scoreScenario(scenario, markers)
    setResult(scored)
    saveChartLabSession({
      scenarioId: scenario.id,
      markers,
      score: scored.score,
      passed: scored.passed,
      summary: scored.summary,
    })
    onComplete?.(scored, markers)
  }

  const visibleAnnotations = useMemo(() => {
    if (!interactive) return scenario.annotations
    return showCorrect ? scenario.annotations : []
  }, [interactive, scenario.annotations, showCorrect])

  const lastClose = scenario.candles[scenario.candles.length - 1]?.close ?? 0
  const firstClose = scenario.candles[0]?.close ?? lastClose
  const priceChange = lastClose - firstClose
  const priceChangePct = firstClose ? (priceChange / firstClose) * 100 : 0
  const priceUp = priceChange >= 0
  const priceDecimals = lastClose >= 100 ? 2 : 4
  const fmtPrice = (n: number) => n.toFixed(priceDecimals)
  const showTimeframes = variant === "full"

  const chart = (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40">
      <div className="flex flex-col gap-2 border-b border-border/60 px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-sm font-medium">{scenario.symbol}</span>
            <span
              className={cn(
                "font-mono text-sm font-semibold",
                priceUp ? "text-emerald-400" : "text-red-400"
              )}
            >
              {fmtPrice(lastClose)}
            </span>
            <span
              className={cn(
                "font-mono text-[11px]",
                priceUp ? "text-emerald-400" : "text-red-400"
              )}
            >
              {priceUp ? "+" : ""}
              {fmtPrice(priceChange)} ({priceUp ? "+" : ""}
              {priceChangePct.toFixed(2)}%)
            </span>
          </div>
          {interactive && activeTool !== "pointer" && (
            <span className="shrink-0 text-xs text-primary">
              Click to place a marker
            </span>
          )}
        </div>
        {showTimeframes && (
          <div className="flex items-center gap-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                type="button"
                aria-pressed={tf === viewTimeframe}
                onClick={() => setViewTimeframe(tf)}
                className={cn(
                  "rounded px-2 py-0.5 font-mono text-[11px] font-medium transition-colors",
                  tf === viewTimeframe
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tf}
              </button>
            ))}
            <span className="ml-auto text-[10px] text-muted-foreground/70">
              Generated practice data · not live
            </span>
          </div>
        )}
      </div>
      <ChartCanvas
        candles={scenario.candles}
        annotations={visibleAnnotations}
        userMarkers={markers}
        activeTool={activeTool}
        interactive={interactive}
        onPlacePoint={placePoint}
        onPlaceLine={placeLine}
        height={fullHeight}
      />
    </div>
  )

  if (!interactive) {
    return (
      <div className="flex flex-col gap-3">
        {chart}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {scenario.explanation}
        </p>
        <Disclaimer />
      </div>
    )
  }

  const taskPanel = (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          Your task
        </p>
        <p className="mt-1 text-sm leading-relaxed">{scenario.task}</p>
      </div>

      {scenario.hints.length > 0 && !result && (
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <LightbulbIcon className="size-4 text-primary" />
            Hint
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {scenario.hints[Math.min(hintIndex, scenario.hints.length - 1)]}
          </p>
          {hintIndex < scenario.hints.length - 1 && (
            <Button
              variant="ghost"
              size="xs"
              className="mt-2"
              onClick={() => setHintIndex((i) => i + 1)}
            >
              Show another hint
            </Button>
          )}
        </div>
      )}

      {result && <ChartFeedback result={result} />}

      <div className="flex flex-wrap gap-2">
        {!result ? (
          <Button onClick={handleSubmit} disabled={markers.length === 0}>
            Submit answer
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcwIcon data-icon="inline-start" />
              Try again
            </Button>
            <Button variant="outline" onClick={() => setShowCorrect((s) => !s)}>
              {showCorrect ? (
                <EyeOffIcon data-icon="inline-start" />
              ) : (
                <EyeIcon data-icon="inline-start" />
              )}
              {showCorrect ? "Hide answer" : "Show correct answer"}
            </Button>
          </>
        )}
        {!result && markers.length > 0 && (
          <Button variant="ghost" onClick={handleReset}>
            Clear
          </Button>
        )}
      </div>

      {savedScore !== null && !result && (
        <p className="text-xs text-muted-foreground">Last attempt: {savedScore}%</p>
      )}

      <MarkerList markers={markers} />
      <Disclaimer />
    </div>
  )

  if (variant === "full") {
    return (
      <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[180px_1fr_340px] lg:gap-4">
        <ChartToolbar
          key={`${idBase}-tb`}
          tools={tools}
          activeTool={activeTool}
          onSelect={setActiveTool}
          className="lg:flex-col"
        />
        {chart}
        <div className="lg:max-h-[70vh] lg:overflow-y-auto">{taskPanel}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <ChartToolbar tools={tools} activeTool={activeTool} onSelect={setActiveTool} />
      {chart}
      {taskPanel}
    </div>
  )
}

function MarkerList({ markers }: { markers: UserMarker[] }) {
  if (markers.length === 0) return null
  return (
    <div className="rounded-lg border border-border/60 bg-muted/10 p-3">
      <p className="text-xs font-medium text-muted-foreground">
        Your markers ({markers.length})
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {markers.map((m) => (
          <li
            key={m.id}
            className="rounded-md bg-muted/40 px-2 py-1 text-[11px] capitalize text-muted-foreground"
          >
            {m.tool.replace("-", " ")} @ {m.price}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Disclaimer() {
  return (
    <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground/70">
      <InfoIcon className="mt-0.5 size-3 shrink-0" />
      {CHART_DISCLAIMER}
    </p>
  )
}
