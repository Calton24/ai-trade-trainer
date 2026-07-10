import type { ChartPoint } from "@/lib/charts/types"
import type { ScenarioCandle } from "@/lib/charts/types"

export type DrawingTool =
  | "cursor"
  | "hline"
  | "trendline"
  | "rectangle"
  | "arrow"
  | "text"
  | "risk"

export interface DrawingBase {
  id: string
  color?: string
}

export interface HLineDrawing extends DrawingBase {
  type: "hline"
  price: number
}

export interface TrendLineDrawing extends DrawingBase {
  type: "trendline"
  p1: ChartPoint
  p2: ChartPoint
}

export interface RectangleDrawing extends DrawingBase {
  type: "rectangle"
  p1: ChartPoint
  p2: ChartPoint
}

export interface ArrowDrawing extends DrawingBase {
  type: "arrow"
  p1: ChartPoint
  p2: ChartPoint
}

export interface TextDrawing extends DrawingBase {
  type: "text"
  point: ChartPoint
  text: string
}

export interface RiskDrawing extends DrawingBase {
  type: "risk"
  entry: ChartPoint
  stop: ChartPoint
  target: ChartPoint
}

export type ChartDrawing =
  | HLineDrawing
  | TrendLineDrawing
  | RectangleDrawing
  | ArrowDrawing
  | TextDrawing
  | RiskDrawing

export function createDrawingId(): string {
  return `d-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/** Snap price to nearest candle high/low when magnet is on. */
export function snapPrice(
  price: number,
  index: number,
  candles: ScenarioCandle[],
  magnet: boolean
): number {
  if (!magnet) return price
  const c = candles[index]
  if (!c) return price
  const distHigh = Math.abs(price - c.high)
  const distLow = Math.abs(price - c.low)
  const distClose = Math.abs(price - c.close)
  const min = Math.min(distHigh, distLow, distClose)
  if (min === distHigh) return c.high
  if (min === distLow) return c.low
  return c.close
}

export const DRAWING_TOOL_LABELS: Record<DrawingTool, string> = {
  cursor: "Select",
  hline: "Horizontal",
  trendline: "Trend Line",
  rectangle: "Zone",
  arrow: "Arrow",
  text: "Note",
  risk: "Risk/Reward",
}
