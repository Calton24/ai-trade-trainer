"use client"

import { memo, useCallback, useMemo, useRef, useState } from "react"

import type { ChartPoint, ScenarioCandle } from "@/lib/charts/types"
import {
  type ChartViewport,
  fitViewport,
  panViewport,
  resolveViewport,
  zoomPriceViewport,
  zoomViewport,
} from "@/lib/execution-lab/chart-viewport"
import {
  type ChartDrawing,
  type DrawingTool,
  createDrawingId,
  snapPrice,
} from "@/lib/execution-lab/drawings"
import { cn } from "@/lib/utils"

const VB_WIDTH = 900
const PAD_TOP = 24
const PAD_RIGHT = 72
const PAD_BOTTOM = 36
const PAD_LEFT = 16

export interface ExecutionLevels {
  entry: number
  stop: number
  target: number
}

export interface ChartMarker {
  index: number
  price: number
  kind: "swing-high" | "swing-low" | "zone"
}

interface ExecutionChartProps {
  candles: ScenarioCandle[]
  allCandles?: ScenarioCandle[]
  levels: ExecutionLevels
  direction: "buy" | "sell" | "wait" | "no-trade"
  onLevelsChange: (levels: ExecutionLevels) => void
  locked?: boolean
  height?: number
  className?: string
  showLevels?: boolean
  interactive?: boolean
  clickMode?: "swing-high" | "swing-low" | "zone" | null
  onChartClick?: (point: ChartPoint, candle: ScenarioCandle) => void
  markers?: ChartMarker[]
  viewport?: ChartViewport
  onViewportChange?: (v: ChartViewport) => void
  drawings?: ChartDrawing[]
  onDrawingsChange?: (d: ChartDrawing[]) => void
  activeTool?: DrawingTool
  magnet?: boolean
}

type DragLine = "entry" | "stop" | "target" | null

const CandleLayer = memo(function CandleLayer({
  candles,
  startIndex,
  indexToX,
  priceToY,
  candleWidth,
  hoverIndex,
}: {
  candles: ScenarioCandle[]
  startIndex: number
  indexToX: (i: number) => number
  priceToY: (p: number) => number
  candleWidth: number
  hoverIndex: number | null
}) {
  return (
    <>
      {candles.map((c, i) => {
        const globalIndex = startIndex + i
        const x = indexToX(globalIndex)
        const openY = priceToY(c.open)
        const closeY = priceToY(c.close)
        const highY = priceToY(c.high)
        const lowY = priceToY(c.low)
        const bullish = c.close >= c.open
        const bodyTop = Math.min(openY, closeY)
        const bodyH = Math.max(1.5, Math.abs(closeY - openY))
        const up = "#22c55e"
        const down = "#ef4444"
        const isHover = hoverIndex === globalIndex
        return (
          <g key={globalIndex} opacity={isHover ? 1 : 0.92}>
            <line x1={x} y1={highY} x2={x} y2={lowY} stroke={bullish ? up : down} strokeWidth={1.2} />
            <rect
              x={x - candleWidth / 2}
              y={bodyTop}
              width={candleWidth}
              height={bodyH}
              fill={bullish ? up : down}
              stroke={bullish ? "#16a34a" : "#dc2626"}
              strokeWidth={0.5}
              rx={0.5}
            />
          </g>
        )
      })}
    </>
  )
})

export const ExecutionChart = memo(function ExecutionChart({
  candles: visibleCandlesProp,
  allCandles,
  levels,
  direction,
  onLevelsChange,
  locked = false,
  height = 420,
  className,
  showLevels = true,
  interactive = true,
  clickMode = null,
  onChartClick,
  markers = [],
  viewport: controlledViewport,
  onViewportChange,
  drawings = [],
  onDrawingsChange,
  activeTool = "cursor",
  magnet = false,
}: ExecutionChartProps) {
  const fullCandles = allCandles ?? visibleCandlesProp
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [internalViewport, setInternalViewport] = useState<ChartViewport>(() =>
    fitViewport(fullCandles.length)
  )
  const viewport = controlledViewport ?? internalViewport
  const setViewport = onViewportChange ?? setInternalViewport

  const [dragging, setDragging] = useState<DragLine>(null)
  const [panning, setPanning] = useState(false)
  const panStart = useRef({ x: 0, y: 0, viewport: viewport })
  const [draft, setDraft] = useState<{ tool: DrawingTool; p1: ChartPoint; p2?: ChartPoint } | null>(
    null
  )
  const [hover, setHover] = useState<{
    x: number
    y: number
    index: number
    candle: ScenarioCandle
  } | null>(null)

  const VB_HEIGHT = height
  const { startIndex, endIndex } = resolveViewport(viewport, fullCandles.length)
  const visibleCandles = fullCandles.slice(startIndex, endIndex + 1)

  const { minPrice, maxPrice, decimals } = useMemo(() => {
    const source = visibleCandles.length > 0 ? visibleCandles : fullCandles
    if (source.length === 0) return { minPrice: 0, maxPrice: 1, decimals: 4 }
    let min = Math.min(...source.map((c) => c.low))
    let max = Math.max(...source.map((c) => c.high))
    for (const m of markers) {
      min = Math.min(min, m.price)
      max = Math.max(max, m.price)
    }
    if (viewport.priceMin !== null && viewport.priceMax !== null) {
      min = viewport.priceMin
      max = viewport.priceMax
    } else if (showLevels && (direction === "buy" || direction === "sell")) {
      const candleRange = max - min || 0.0001
      const levelMin = Math.min(levels.entry, levels.stop, levels.target)
      const levelMax = Math.max(levels.entry, levels.stop, levels.target)
      if (levelMax - levelMin < candleRange * 4) {
        min = Math.min(min, levelMin)
        max = Math.max(max, levelMax)
      }
    }
    const pad = (max - min) * 0.08 || 0.001
    const range = max - min
    const dec = range < 0.05 ? 5 : range < 5 ? 4 : range < 100 ? 2 : 1
    return { minPrice: min - pad, maxPrice: max + pad, decimals: dec }
  }, [visibleCandles, fullCandles, levels, direction, showLevels, markers, viewport])

  const plotW = VB_WIDTH - PAD_LEFT - PAD_RIGHT
  const plotH = VB_HEIGHT - PAD_TOP - PAD_BOTTOM
  const candleCount = endIndex - startIndex + 1
  const step = plotW / Math.max(1, candleCount)
  const candleWidth = Math.max(2, Math.min(18, step * 0.72))

  const priceToY = useCallback(
    (price: number) => {
      const range = maxPrice - minPrice || 1
      return PAD_TOP + (1 - (price - minPrice) / range) * plotH
    },
    [maxPrice, minPrice, plotH]
  )

  const yToPrice = useCallback(
    (y: number) => {
      const range = maxPrice - minPrice || 1
      const raw = minPrice + (1 - (y - PAD_TOP) / plotH) * range
      const factor = 10 ** decimals
      return Math.round(raw * factor) / factor
    },
    [maxPrice, minPrice, plotH, decimals]
  )

  const indexToX = (i: number) => PAD_LEFT + (i - startIndex) * step + step / 2
  const xToIndex = (x: number) =>
    Math.max(
      startIndex,
      Math.min(endIndex, Math.round((x - PAD_LEFT) / step - 0.5 + startIndex))
    )
  const fmt = (n: number) => n.toFixed(decimals)

  const toViewBox = (clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return { x: PAD_LEFT, y: PAD_TOP }
    const rect = svg.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width) * VB_WIDTH,
      y: ((clientY - rect.top) / rect.height) * VB_HEIGHT,
    }
  }

  const pointFromEvent = (clientX: number, clientY: number): ChartPoint => {
    const { x, y } = toViewBox(clientX, clientY)
    const index = xToIndex(x)
    const localIdx = index - startIndex
    const price = snapPrice(yToPrice(y), localIdx, visibleCandles, magnet)
    return { index, price }
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (!interactive) return
    e.preventDefault()
    const rect = containerRef.current?.getBoundingClientRect()
    const anchorRatio = rect ? (e.clientX - rect.left) / rect.width : 0.5
    if (e.shiftKey) {
      setViewport(zoomPriceViewport(viewport, e.deltaY > 0 ? 1.12 : 0.88, minPrice, maxPrice))
    } else {
      setViewport(zoomViewport(viewport, fullCandles.length, e.deltaY > 0 ? 1.15 : 0.85, anchorRatio))
    }
  }

  const handlePointerDownBg = (e: React.PointerEvent) => {
    if (dragging) return
    if (activeTool !== "cursor" && !locked && onDrawingsChange) {
      const p = pointFromEvent(e.clientX, e.clientY)
      if (activeTool === "hline") {
        onDrawingsChange([...drawings, { id: createDrawingId(), type: "hline", price: p.price }])
        return
      }
      if (activeTool === "text") {
        onDrawingsChange([...drawings, { id: createDrawingId(), type: "text", point: p, text: "Note" }])
        return
      }
      setDraft({ tool: activeTool, p1: p })
      ;(e.target as Element).setPointerCapture(e.pointerId)
      return
    }
    if (e.button === 0 && activeTool === "cursor" && !clickMode) {
      setPanning(true)
      panStart.current = { x: e.clientX, y: e.clientY, viewport }
      ;(e.target as Element).setPointerCapture(e.pointerId)
    }
  }

  const handlePointerDownLine = (line: DragLine) => (e: React.PointerEvent) => {
    if (locked || direction === "no-trade" || direction === "wait") return
    e.stopPropagation()
    setDragging(line)
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (panning) {
      const dx = e.clientX - panStart.current.x
      const dy = e.clientY - panStart.current.y
      const candleDelta = -Math.round(dx / Math.max(step, 1))
      setViewport(
        panViewport(panStart.current.viewport, fullCandles.length, candleDelta, (dy / plotH) * 0.5)
      )
      return
    }
    if (draft) {
      setDraft({ ...draft, p2: pointFromEvent(e.clientX, e.clientY) })
      return
    }
    if (dragging && !locked) {
      const { y } = toViewBox(e.clientX, e.clientY)
      onLevelsChange({ ...levels, [dragging]: yToPrice(y) })
    }
    if (interactive) {
      const { x, y } = toViewBox(e.clientX, e.clientY)
      const index = xToIndex(x)
      const candle = fullCandles[index]
      if (candle) setHover({ x, y, index, candle })
    }
  }

  const handlePointerUp = () => {
    if (draft?.p2 && onDrawingsChange) {
      const { tool, p1, p2 } = draft
      if (tool === "trendline" || tool === "arrow") {
        onDrawingsChange([...drawings, { id: createDrawingId(), type: tool, p1, p2 } as ChartDrawing])
      } else if (tool === "rectangle") {
        onDrawingsChange([...drawings, { id: createDrawingId(), type: "rectangle", p1, p2 }])
      } else if (tool === "risk") {
        const risk = Math.abs(p1.price - p2.price)
        const target = {
          index: p1.index,
          price: p1.price + (p1.price > p2.price ? risk * 2 : -risk * 2),
        }
        onDrawingsChange([
          ...drawings,
          { id: createDrawingId(), type: "risk", entry: p1, stop: p2, target },
        ])
      }
    }
    setDraft(null)
    setDragging(null)
    setPanning(false)
  }

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!clickMode || !onChartClick || locked || panning) return
    const { x, y } = toViewBox(e.clientX, e.clientY)
    const index = xToIndex(x)
    const candle = fullCandles[index]
    if (!candle) return
    const price =
      clickMode === "swing-high" ? candle.high : clickMode === "swing-low" ? candle.low : yToPrice(y)
    onChartClick({ index, price }, candle)
  }

  const renderLine = (key: keyof ExecutionLevels, label: string, color: string) => {
    const y = priceToY(levels[key])
    return (
      <g key={key}>
        <line x1={PAD_LEFT} y1={y} x2={VB_WIDTH - PAD_RIGHT} y2={y} stroke={color} strokeWidth={1.5} strokeDasharray={key === "entry" ? undefined : "5 4"} />
        <text x={PAD_LEFT + 5} y={y + 4} fill={color} fontSize="10" fontWeight="600" fontFamily="monospace">
          {label} {fmt(levels[key])}
        </text>
        {!locked && direction !== "no-trade" && direction !== "wait" && (
          <rect x={PAD_LEFT} y={y - 14} width={plotW} height={28} fill="transparent" className="cursor-ns-resize" onPointerDown={handlePointerDownLine(key as DragLine)} />
        )}
      </g>
    )
  }

  const renderDrawing = (d: ChartDrawing) => {
    if (d.type === "hline") {
      return <line key={d.id} x1={PAD_LEFT} y1={priceToY(d.price)} x2={VB_WIDTH - PAD_RIGHT} y2={priceToY(d.price)} stroke="#a78bfa" strokeDasharray="4 3" />
    }
    if (d.type === "trendline" || d.type === "arrow") {
      return (
        <line
          key={d.id}
          x1={indexToX(d.p1.index)}
          y1={priceToY(d.p1.price)}
          x2={indexToX(d.p2.index)}
          y2={priceToY(d.p2.price)}
          stroke={d.type === "arrow" ? "#fb923c" : "#38bdf8"}
          strokeWidth={1.5}
          markerEnd={d.type === "arrow" ? "url(#arrowhead)" : undefined}
        />
      )
    }
    if (d.type === "rectangle") {
      const x1 = indexToX(d.p1.index)
      const x2 = indexToX(d.p2.index)
      const y1 = priceToY(d.p1.price)
      const y2 = priceToY(d.p2.price)
      return (
        <rect key={d.id} x={Math.min(x1, x2)} y={Math.min(y1, y2)} width={Math.abs(x2 - x1)} height={Math.abs(y2 - y1)} fill="#fbbf24" fillOpacity={0.12} stroke="#fbbf24" />
      )
    }
    if (d.type === "text") {
      return <text key={d.id} x={indexToX(d.point.index)} y={priceToY(d.point.price)} fill="#e2e8f0" fontSize="11">{d.text}</text>
    }
    if (d.type === "risk") {
      return (
        <g key={d.id}>
          <line x1={PAD_LEFT} y1={priceToY(d.entry.price)} x2={VB_WIDTH - PAD_RIGHT} y2={priceToY(d.entry.price)} stroke="#60a5fa" />
          <line x1={PAD_LEFT} y1={priceToY(d.stop.price)} x2={VB_WIDTH - PAD_RIGHT} y2={priceToY(d.stop.price)} stroke="#f87171" strokeDasharray="4 3" />
          <line x1={PAD_LEFT} y1={priceToY(d.target.price)} x2={VB_WIDTH - PAD_RIGHT} y2={priceToY(d.target.price)} stroke="#4ade80" strokeDasharray="4 3" />
        </g>
      )
    }
    return null
  }

  const timeTicks = Math.min(6, Math.max(3, Math.floor(candleCount / 8)))

  return (
    <div ref={containerRef} className={cn("relative touch-none", className)} onWheel={handleWheel}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
        className={cn("w-full select-none bg-[oklch(0.1_0.01_260)]", panning && "cursor-grabbing")}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => { setDragging(null); setPanning(false); setDraft(null); setHover(null) }}
        onClick={handleClick}
        role="img"
        aria-label="Execution chart"
      >
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#fb923c" />
          </marker>
        </defs>
        <rect x={PAD_LEFT} y={PAD_TOP} width={plotW} height={plotH} fill="transparent" className="cursor-grab" onPointerDown={handlePointerDownBg} />
        {Array.from({ length: 7 }).map((_, i) => {
          const y = PAD_TOP + (i * plotH) / 6
          const price = maxPrice - (i * (maxPrice - minPrice)) / 6
          return (
            <g key={i}>
              <line x1={PAD_LEFT} y1={y} x2={VB_WIDTH - PAD_RIGHT} y2={y} stroke="oklch(1 0 0 / 4%)" strokeDasharray="3 5" />
              <text x={VB_WIDTH - PAD_RIGHT + 4} y={y + 3} fill="oklch(0.62 0 0)" fontSize="10" fontFamily="monospace">{fmt(price)}</text>
            </g>
          )
        })}
        {Array.from({ length: timeTicks }).map((_, i) => {
          const idx = startIndex + Math.round((i / Math.max(1, timeTicks - 1)) * Math.max(0, candleCount - 1))
          return <text key={i} x={indexToX(idx)} y={VB_HEIGHT - 8} textAnchor="middle" fill="oklch(0.5 0 0)" fontSize="9" fontFamily="monospace">{idx + 1}</text>
        })}
        <CandleLayer candles={visibleCandles} startIndex={startIndex} indexToX={indexToX} priceToY={priceToY} candleWidth={candleWidth} hoverIndex={hover?.index ?? null} />
        {drawings.map(renderDrawing)}
        {markers.map((m, i) => (
          <circle key={i} cx={indexToX(m.index)} cy={priceToY(m.price)} r={5} fill="#a78bfa" stroke="white" strokeWidth={1} />
        ))}
        {hover && interactive && (
          <g>
            <line x1={hover.x} y1={PAD_TOP} x2={hover.x} y2={VB_HEIGHT - PAD_BOTTOM} stroke="oklch(1 0 0 / 14%)" />
            <line x1={PAD_LEFT} y1={hover.y} x2={VB_WIDTH - PAD_RIGHT} y2={hover.y} stroke="oklch(1 0 0 / 14%)" />
            <g transform={`translate(${Math.min(hover.x + 10, VB_WIDTH - 168)}, ${PAD_TOP + 8})`}>
              <rect width={156} height={58} rx={6} fill="oklch(0.14 0.01 260 / 95%)" stroke="oklch(1 0 0 / 15%)" />
              <text x={8} y={16} fill="oklch(0.75 0 0)" fontSize="9" fontFamily="monospace">O {fmt(hover.candle.open)} H {fmt(hover.candle.high)}</text>
              <text x={8} y={30} fill="oklch(0.75 0 0)" fontSize="9" fontFamily="monospace">L {fmt(hover.candle.low)} C {fmt(hover.candle.close)}</text>
              <text x={8} y={46} fill="oklch(0.55 0 0)" fontSize="8" fontFamily="monospace">#{hover.index + 1}</text>
            </g>
          </g>
        )}
        {showLevels && direction !== "no-trade" && direction !== "wait" && (
          <>
            {renderLine("stop", "SL", "#f87171")}
            {renderLine("target", "TP", "#4ade80")}
            {renderLine("entry", "Entry", direction === "sell" ? "#f87171" : "#60a5fa")}
          </>
        )}
      </svg>
    </div>
  )
})
