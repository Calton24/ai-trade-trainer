import type { ScenarioCandle } from "@/lib/charts/types"
import type { ReplaySpeed } from "./types"

export const REPLAY_INTERVAL_MS: Record<ReplaySpeed, number> = {
  1: 600,
  2: 300,
  5: 120,
}

export function sliceVisibleCandles(
  candles: ScenarioCandle[],
  currentIndex: number
): ScenarioCandle[] {
  if (candles.length === 0) return []
  const idx = Math.max(0, Math.min(currentIndex, candles.length - 1))
  return candles.slice(0, idx + 1)
}

export function canAdvance(currentIndex: number, maxIndex: number): boolean {
  return currentIndex < maxIndex
}

export function canRewind(currentIndex: number, minIndex: number): boolean {
  return currentIndex > minIndex
}

export function nextCandleIndex(currentIndex: number, maxIndex: number): number {
  return Math.min(maxIndex, currentIndex + 1)
}

export function prevCandleIndex(currentIndex: number, minIndex: number): number {
  return Math.max(minIndex, currentIndex - 1)
}
