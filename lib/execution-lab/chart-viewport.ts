/** Chart viewport math for zoom/pan in Execution Lab. */

export interface ChartViewport {
  /** First visible candle index (inclusive) */
  startIndex: number
  /** Last visible candle index (inclusive) */
  endIndex: number
  /** Manual price bounds; null = auto-fit from visible candles */
  priceMin: number | null
  priceMax: number | null
}

export const DEFAULT_VIEWPORT: ChartViewport = {
  startIndex: 0,
  endIndex: -1,
  priceMin: null,
  priceMax: null,
}

export function resolveViewport(
  viewport: ChartViewport,
  candleCount: number
): { startIndex: number; endIndex: number } {
  const end =
    viewport.endIndex < 0 ? candleCount - 1 : Math.min(viewport.endIndex, candleCount - 1)
  const start = Math.max(0, Math.min(viewport.startIndex, end))
  return { startIndex: start, endIndex: end }
}

export function fitViewport(candleCount: number): ChartViewport {
  return {
    startIndex: 0,
    endIndex: candleCount - 1,
    priceMin: null,
    priceMax: null,
  }
}

export function zoomViewport(
  viewport: ChartViewport,
  candleCount: number,
  factor: number,
  anchorRatio = 0.5
): ChartViewport {
  const { startIndex, endIndex } = resolveViewport(viewport, candleCount)
  const visible = endIndex - startIndex + 1
  const nextVisible = Math.max(8, Math.min(candleCount, Math.round(visible * factor)))
  const anchor = startIndex + Math.round(visible * anchorRatio)
  let newStart = Math.round(anchor - nextVisible * anchorRatio)
  let newEnd = newStart + nextVisible - 1
  if (newStart < 0) {
    newEnd -= newStart
    newStart = 0
  }
  if (newEnd >= candleCount) {
    newStart -= newEnd - (candleCount - 1)
    newEnd = candleCount - 1
  }
  newStart = Math.max(0, newStart)
  return {
    ...viewport,
    startIndex: newStart,
    endIndex: newEnd,
  }
}

export function panViewport(
  viewport: ChartViewport,
  candleCount: number,
  deltaCandles: number,
  priceDeltaRatio = 0
): ChartViewport {
  const { startIndex, endIndex } = resolveViewport(viewport, candleCount)
  const visible = endIndex - startIndex + 1
  let newStart = startIndex + deltaCandles
  let newEnd = endIndex + deltaCandles
  if (newStart < 0) {
    newEnd -= newStart
    newStart = 0
  }
  if (newEnd >= candleCount) {
    newStart -= newEnd - (candleCount - 1)
    newEnd = candleCount - 1
  }
  newStart = Math.max(0, newStart)

  let priceMin = viewport.priceMin
  let priceMax = viewport.priceMax
  if (priceDeltaRatio !== 0 && priceMin !== null && priceMax !== null) {
    const range = priceMax - priceMin
    const shift = range * priceDeltaRatio
    priceMin += shift
    priceMax += shift
  }

  return {
    startIndex: newStart,
    endIndex: Math.min(candleCount - 1, newStart + visible - 1),
    priceMin,
    priceMax,
  }
}

export function zoomPriceViewport(
  viewport: ChartViewport,
  factor: number,
  autoMin: number,
  autoMax: number
): ChartViewport {
  const min = viewport.priceMin ?? autoMin
  const max = viewport.priceMax ?? autoMax
  const mid = (min + max) / 2
  const half = ((max - min) / 2) * factor
  return {
    ...viewport,
    priceMin: mid - half,
    priceMax: mid + half,
  }
}
