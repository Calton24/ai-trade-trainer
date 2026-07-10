import type { ScenarioCandle } from "@/lib/charts/types"

export type FillOutcome = "win" | "loss" | "open"

export function detectFillOutcome({
  direction,
  entry,
  stop,
  target,
  candles,
  fromIndex,
}: {
  direction: "buy" | "sell"
  entry: number
  stop: number
  target: number
  candles: ScenarioCandle[]
  fromIndex: number
}): { outcome: FillOutcome; exitIndex: number | null; exitPrice: number | null } {
  for (let i = fromIndex + 1; i < candles.length; i++) {
    const c = candles[i]
    if (direction === "buy") {
      if (c.low <= stop) {
        return { outcome: "loss", exitIndex: i, exitPrice: stop }
      }
      if (c.high >= target) {
        return { outcome: "win", exitIndex: i, exitPrice: target }
      }
    } else {
      if (c.high >= stop) {
        return { outcome: "loss", exitIndex: i, exitPrice: stop }
      }
      if (c.low <= target) {
        return { outcome: "win", exitIndex: i, exitPrice: target }
      }
    }
  }
  return { outcome: "open", exitIndex: null, exitPrice: null }
}
