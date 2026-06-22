"use client"

import { useMemo } from "react"

import type { Candle, TradeMark } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TrainingChartProps {
  candles: Candle[]
  marks?: TradeMark[]
  activeMarkType?: TradeMark["type"] | null
  onMark?: (index: number, price: number) => void
  readOnly?: boolean
  className?: string
}

const MARK_COLORS: Record<TradeMark["type"], string> = {
  support: "#3b82f6",
  resistance: "#f97316",
  trend: "#8b5cf6",
  break: "#22c55e",
  retest: "#06b6d4",
  entry: "#a855f7",
  stop_loss: "#ef4444",
  take_profit: "#eab308",
}

const MARK_LABELS: Record<TradeMark["type"], string> = {
  support: "Support",
  resistance: "Resistance",
  trend: "Trend",
  break: "Break",
  retest: "Retest",
  entry: "Entry",
  stop_loss: "SL",
  take_profit: "TP",
}

export function TrainingChart({
  candles,
  marks = [],
  activeMarkType,
  onMark,
  readOnly = false,
  className,
}: TrainingChartProps) {
  const { minPrice, maxPrice } = useMemo(() => {
    const lows = candles.map((c) => c.low)
    const highs = candles.map((c) => c.high)
    const min = Math.min(...lows)
    const max = Math.max(...highs)
    const pad = (max - min) * 0.08
    return { minPrice: min - pad, maxPrice: max + pad }
  }, [candles])

  const chartHeight = 320
  const chartWidth = 800
  const candleWidth = Math.min(12, (chartWidth - 40) / candles.length - 2)
  const gap = 2

  const priceToY = (price: number) => {
    const range = maxPrice - minPrice
    return chartHeight - 20 - ((price - minPrice) / range) * (chartHeight - 40)
  }

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (readOnly || !activeMarkType || !onMark) return

    const svg = event.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * chartWidth
    const y = ((event.clientY - rect.top) / rect.height) * chartHeight

    const index = Math.round((x - 20) / (candleWidth + gap))
    const clampedIndex = Math.max(0, Math.min(candles.length - 1, index))

    const range = maxPrice - minPrice
    const price =
      minPrice + ((chartHeight - 20 - y) / (chartHeight - 40)) * range

    onMark(clampedIndex, Math.round(price * 100) / 100)
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">BTC/USDT</span>
          <span className="text-xs text-muted-foreground">15m · Replay</span>
        </div>
        {!readOnly && activeMarkType && (
          <span className="text-xs text-primary">
            Click chart to place: {MARK_LABELS[activeMarkType]}
          </span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className={cn(
          "w-full bg-[oklch(0.12_0.005_260)]",
          !readOnly && activeMarkType && "cursor-crosshair"
        )}
        onClick={handleClick}
        role="img"
        aria-label="Candlestick chart for Break and Retest training"
      >
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = 20 + (i * (chartHeight - 40)) / 4
          const price =
            maxPrice - (i * (maxPrice - minPrice)) / 4
          return (
            <g key={i}>
              <line
                x1={20}
                y1={y}
                x2={chartWidth - 10}
                y2={y}
                stroke="oklch(1 0 0 / 6%)"
                strokeDasharray="4 4"
              />
              <text
                x={chartWidth - 8}
                y={y + 4}
                textAnchor="end"
                fill="oklch(0.6 0 0)"
                fontSize="10"
                fontFamily="var(--font-mono)"
              >
                {price.toFixed(0)}
              </text>
            </g>
          )
        })}

        {/* Candles */}
        {candles.map((candle, i) => {
          const x = 20 + i * (candleWidth + gap)
          const isGreen = candle.close >= candle.open
          const color = isGreen ? "#22c55e" : "#ef4444"
          const bodyTop = priceToY(Math.max(candle.open, candle.close))
          const bodyBottom = priceToY(Math.min(candle.open, candle.close))
          const bodyHeight = Math.max(1, bodyBottom - bodyTop)

          return (
            <g key={candle.time}>
              <line
                x1={x + candleWidth / 2}
                y1={priceToY(candle.high)}
                x2={x + candleWidth / 2}
                y2={priceToY(candle.low)}
                stroke={color}
                strokeWidth={1}
              />
              <rect
                x={x}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={color}
                rx={1}
              />
            </g>
          )
        })}

        {/* Horizontal mark lines */}
        {marks.map((mark, i) => {
          const y = priceToY(mark.price)
          const color = MARK_COLORS[mark.type]
          return (
            <g key={`${mark.type}-${i}`}>
              <line
                x1={20}
                y1={y}
                x2={chartWidth - 10}
                y2={y}
                stroke={color}
                strokeWidth={1.5}
                strokeDasharray="6 4"
                opacity={0.8}
              />
              <rect
                x={22}
                y={y - 10}
                width={52}
                height={18}
                fill={color}
                rx={4}
                opacity={0.9}
              />
              <text
                x={48}
                y={y + 3}
                textAnchor="middle"
                fill="white"
                fontSize="9"
                fontWeight="600"
              >
                {MARK_LABELS[mark.type]}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
