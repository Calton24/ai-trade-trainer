"use client"

import { useMemo, useRef, useState } from "react"

import {
  LEVEL_TYPES,
  markColor,
  SHORT_LABELS,
} from "@/components/chart-lab/chart-marks"
import type {
  ChartAnnotation,
  ChartPoint,
  MarkerTool,
  ScenarioCandle,
  UserMarker,
} from "@/lib/charts/types"
import { cn } from "@/lib/utils"

const VB_WIDTH = 900
const PAD_TOP = 16
const PAD_RIGHT = 60
const PAD_BOTTOM = 26
const PAD_LEFT = 12

interface ChartCanvasProps {
  candles: ScenarioCandle[]
  annotations?: ChartAnnotation[]
  userMarkers?: UserMarker[]
  activeTool?: MarkerTool
  /** When set, a pending trendline start point is shown. */
  interactive?: boolean
  onPlacePoint?: (point: ChartPoint) => void
  onPlaceLine?: (from: ChartPoint, to: ChartPoint) => void
  height?: number
  className?: string
}

export function ChartCanvas({
  candles,
  annotations = [],
  userMarkers = [],
  activeTool = "pointer",
  interactive = false,
  onPlacePoint,
  onPlaceLine,
  height = 360,
  className,
}: ChartCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [pendingLine, setPendingLine] = useState<ChartPoint | null>(null)
  const [hover, setHover] = useState<{ x: number; y: number; price: number } | null>(
    null
  )

  const VB_HEIGHT = height

  const { minPrice, maxPrice } = useMemo(() => {
    const lows = candles.map((c) => c.low)
    const highs = candles.map((c) => c.high)
    const extraPrices: number[] = []
    for (const a of annotations) {
      if (a.price !== undefined) extraPrices.push(a.price)
      if (a.priceLow !== undefined) extraPrices.push(a.priceLow)
      if (a.priceHigh !== undefined) extraPrices.push(a.priceHigh)
      if (a.from) extraPrices.push(a.from.price)
      if (a.to) extraPrices.push(a.to.price)
    }
    const min = Math.min(...lows, ...extraPrices)
    const max = Math.max(...highs, ...extraPrices)
    const pad = (max - min) * 0.08 || 1
    return { minPrice: min - pad, maxPrice: max + pad }
  }, [candles, annotations])

  const plotW = VB_WIDTH - PAD_LEFT - PAD_RIGHT
  const plotH = VB_HEIGHT - PAD_TOP - PAD_BOTTOM
  const step = plotW / candles.length
  const candleWidth = Math.max(2, Math.min(14, step - 2))

  const indexToX = (i: number) => PAD_LEFT + i * step + step / 2
  const priceToY = (price: number) => {
    const range = maxPrice - minPrice || 1
    return PAD_TOP + (1 - (price - minPrice) / range) * plotH
  }
  const yToPrice = (y: number) => {
    const range = maxPrice - minPrice || 1
    return minPrice + (1 - (y - PAD_TOP) / plotH) * range
  }
  const xToIndex = (x: number) =>
    Math.max(0, Math.min(candles.length - 1, Math.round((x - PAD_LEFT) / step - 0.5)))

  const toViewBox = (clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width) * VB_WIDTH,
      y: ((clientY - rect.top) / rect.height) * VB_HEIGHT,
    }
  }

  const decimals = maxPrice - minPrice < 5 ? 4 : maxPrice < 100 ? 2 : 0
  const fmt = (n: number) => n.toFixed(decimals)

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive || activeTool === "pointer") return
    const { x, y } = toViewBox(e.clientX, e.clientY)
    const index = xToIndex(x)
    const price = Math.round(yToPrice(y) * 10000) / 10000
    const point: ChartPoint = { index, price }

    if (activeTool === "trendline") {
      if (!pendingLine) {
        setPendingLine(point)
      } else {
        onPlaceLine?.(pendingLine, point)
        setPendingLine(null)
      }
      return
    }
    onPlacePoint?.(point)
  }

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive || activeTool === "pointer") {
      if (hover) setHover(null)
      return
    }
    const { x, y } = toViewBox(e.clientX, e.clientY)
    setHover({ x, y, price: yToPrice(y) })
  }

  const gridLines = 5

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
      className={cn(
        "w-full select-none bg-[oklch(0.12_0.005_260)]",
        interactive && activeTool !== "pointer" && "cursor-crosshair",
        className
      )}
      onClick={handleClick}
      onMouseMove={handleMove}
      onMouseLeave={() => setHover(null)}
      role="img"
      aria-label="Educational candlestick chart"
    >
      {/* Horizontal grid + price axis */}
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const y = PAD_TOP + (i * plotH) / gridLines
        const price = maxPrice - (i * (maxPrice - minPrice)) / gridLines
        return (
          <g key={`grid-${i}`}>
            <line
              x1={PAD_LEFT}
              y1={y}
              x2={VB_WIDTH - PAD_RIGHT}
              y2={y}
              stroke="oklch(1 0 0 / 6%)"
              strokeDasharray="3 4"
            />
            <text
              x={VB_WIDTH - PAD_RIGHT + 6}
              y={y + 3}
              fill="oklch(0.6 0 0)"
              fontSize="10"
              fontFamily="var(--font-mono, monospace)"
            >
              {fmt(price)}
            </text>
          </g>
        )
      })}

      {/* Time axis ticks */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const idx = Math.round(t * (candles.length - 1))
        const x = indexToX(idx)
        return (
          <text
            key={`time-${i}`}
            x={x}
            y={VB_HEIGHT - 8}
            textAnchor="middle"
            fill="oklch(0.5 0 0)"
            fontSize="9"
            fontFamily="var(--font-mono, monospace)"
          >
            {idx}
          </text>
        )
      })}

      {/* Zone annotations (drawn under candles) */}
      {annotations
        .filter((a) => a.type === "zone")
        .map((a) => {
          const x1 = indexToX(a.fromIndex ?? 0) - step / 2
          const x2 = indexToX(a.toIndex ?? candles.length - 1) + step / 2
          const yTop = priceToY(a.priceHigh ?? maxPrice)
          const yBottom = priceToY(a.priceLow ?? minPrice)
          const color = markColor("zone", a.color)
          return (
            <g key={a.id}>
              <rect
                x={x1}
                y={yTop}
                width={Math.max(0, x2 - x1)}
                height={Math.max(0, yBottom - yTop)}
                fill={color}
                opacity={0.1}
                stroke={color}
                strokeOpacity={0.4}
                strokeDasharray="4 4"
              />
              {a.text && (
                <text x={x1 + 6} y={yTop + 14} fill={color} fontSize="10" opacity={0.9}>
                  {a.text}
                </text>
              )}
            </g>
          )
        })}

      {/* Candles */}
      {candles.map((candle, i) => {
        const x = indexToX(i)
        const isGreen = candle.close >= candle.open
        const color = isGreen ? "#22c55e" : "#ef4444"
        const bodyTop = priceToY(Math.max(candle.open, candle.close))
        const bodyBottom = priceToY(Math.min(candle.open, candle.close))
        return (
          <g key={candle.time}>
            <line
              x1={x}
              y1={priceToY(candle.high)}
              x2={x}
              y2={priceToY(candle.low)}
              stroke={color}
              strokeWidth={1}
            />
            <rect
              x={x - candleWidth / 2}
              y={bodyTop}
              width={candleWidth}
              height={Math.max(1, bodyBottom - bodyTop)}
              fill={color}
              rx={1}
            />
          </g>
        )
      })}

      {/* Annotations (demo / correct overlay) */}
      {annotations.map((a) => {
        if (a.type === "zone") return null
        const color = markColor(a.type, a.color)

        if (LEVEL_TYPES.has(a.type) && a.price !== undefined) {
          return renderLevel(a.id, a.price, color, a.text ?? "", {
            priceToY,
            fmt,
          })
        }

        if ((a.type === "trendline" || a.type === "line") && a.from && a.to) {
          return (
            <g key={a.id}>
              <line
                x1={indexToX(a.from.index)}
                y1={priceToY(a.from.price)}
                x2={indexToX(a.to.index)}
                y2={priceToY(a.to.price)}
                stroke={color}
                strokeWidth={2}
                strokeDasharray="2 0"
                opacity={0.85}
              />
            </g>
          )
        }

        // Point markers: swing-high, swing-low, break, retest, arrow, label
        if (a.index !== undefined && a.price !== undefined) {
          return renderPoint(a.id, a.index, a.price, color, a.text ?? "", a.type, {
            indexToX,
            priceToY,
          })
        }
        return null
      })}

      {/* User markers */}
      {userMarkers.map((m) => {
        const color = markColor(m.tool)
        if (m.tool === "trendline" && m.to) {
          return (
            <line
              key={m.id}
              x1={indexToX(m.index)}
              y1={priceToY(m.price)}
              x2={indexToX(m.to.index)}
              y2={priceToY(m.to.price)}
              stroke={color}
              strokeWidth={2.5}
            />
          )
        }
        if (LEVEL_TYPES.has(m.tool)) {
          return renderLevel(m.id, m.price, color, SHORT_LABELS[m.tool], {
            priceToY,
            fmt,
            solid: true,
          })
        }
        return renderPoint(m.id, m.index, m.price, color, SHORT_LABELS[m.tool], m.tool, {
          indexToX,
          priceToY,
          emphasized: true,
        })
      })}

      {/* Pending trendline start */}
      {pendingLine && (
        <circle
          cx={indexToX(pendingLine.index)}
          cy={priceToY(pendingLine.price)}
          r={4}
          fill="#a855f7"
        />
      )}

      {/* Hover crosshair */}
      {hover && (
        <g pointerEvents="none">
          <line
            x1={PAD_LEFT}
            y1={hover.y}
            x2={VB_WIDTH - PAD_RIGHT}
            y2={hover.y}
            stroke="oklch(1 0 0 / 18%)"
            strokeDasharray="2 3"
          />
          <rect
            x={VB_WIDTH - PAD_RIGHT}
            y={hover.y - 8}
            width={PAD_RIGHT}
            height={16}
            fill="#1f2937"
          />
          <text
            x={VB_WIDTH - PAD_RIGHT + 6}
            y={hover.y + 3}
            fill="#e5e7eb"
            fontSize="10"
            fontFamily="var(--font-mono, monospace)"
          >
            {fmt(hover.price)}
          </text>
        </g>
      )}
    </svg>
  )
}

function renderLevel(
  key: string,
  price: number,
  color: string,
  label: string,
  opts: {
    priceToY: (p: number) => number
    fmt: (n: number) => string
    solid?: boolean
  }
) {
  const y = opts.priceToY(price)
  return (
    <g key={key}>
      <line
        x1={PAD_LEFT}
        y1={y}
        x2={VB_WIDTH - PAD_RIGHT}
        y2={y}
        stroke={color}
        strokeWidth={opts.solid ? 1.75 : 1.5}
        strokeDasharray={opts.solid ? "6 3" : "5 5"}
        opacity={0.9}
      />
      {label && (
        <>
          <rect x={PAD_LEFT + 2} y={y - 9} width={label.length * 6 + 10} height={16} rx={3} fill={color} />
          <text x={PAD_LEFT + 7} y={y + 3} fill="#0b0f17" fontSize="9" fontWeight={600}>
            {label}
          </text>
        </>
      )}
    </g>
  )
}

function renderPoint(
  key: string,
  index: number,
  price: number,
  color: string,
  label: string,
  type: string,
  opts: {
    indexToX: (i: number) => number
    priceToY: (p: number) => number
    emphasized?: boolean
  }
) {
  const x = opts.indexToX(index)
  const y = opts.priceToY(price)
  const above = type === "swing-high" || type === "arrow"
  const labelY = above ? y - 12 : y + 20
  return (
    <g key={key}>
      <circle cx={x} cy={y} r={opts.emphasized ? 5 : 4} fill={color} stroke="#0b0f17" strokeWidth={1} />
      {label && (
        <text
          x={x}
          y={labelY}
          textAnchor="middle"
          fill={color}
          fontSize="10"
          fontWeight={600}
        >
          {label}
        </text>
      )}
    </g>
  )
}
