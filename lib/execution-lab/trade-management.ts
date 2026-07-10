import type { ScenarioCandle } from "@/lib/charts/types"

import type { ExecutionScenario, ExecutionTradePlan } from "./types"

export type TradePhase = "planning" | "managing" | "complete"

export type RuleViolationType =
  | "moved-stop-early"
  | "closed-winner-early"
  | "held-through-invalidation"
  | "over-risked"
  | "against-bias"
  | "forced-trade"

export interface RuleViolation {
  type: RuleViolationType
  message: string
}

export interface ActiveTrade {
  direction: "buy" | "sell"
  entry: number
  stop: number
  target: number
  lots: number
  entryIndex: number
  status: "open" | "closed"
  closeIndex: number | null
  closePrice: number | null
  closeReason: "tp" | "sl" | "manual" | "breakeven" | "end" | null
  movedToBreakeven: boolean
  closedEarly: boolean
  violations: RuleViolation[]
}

export interface ManagementResult {
  outcome: "win" | "loss" | "breakeven" | "manual" | "open"
  exitIndex: number | null
  exitPrice: number | null
  violations: RuleViolation[]
  managementScore: number
}

export function checkCandleExit(
  trade: ActiveTrade,
  candle: ScenarioCandle,
  index: number
): { hit: boolean; reason: "tp" | "sl" | null; price: number | null } {
  if (trade.status === "closed") return { hit: false, reason: null, price: null }
  if (trade.direction === "buy") {
    if (candle.low <= trade.stop) return { hit: true, reason: "sl", price: trade.stop }
    if (candle.high >= trade.target) return { hit: true, reason: "tp", price: trade.target }
  } else {
    if (candle.high >= trade.stop) return { hit: true, reason: "sl", price: trade.stop }
    if (candle.low <= trade.target) return { hit: true, reason: "tp", price: trade.target }
  }
  return { hit: false, reason: null, price: null }
}

export function moveStopToBreakeven(trade: ActiveTrade): ActiveTrade {
  const violations = [...trade.violations]
  if (!trade.movedToBreakeven) {
    violations.push({
      type: "moved-stop-early",
      message: "Stop moved to breakeven — note whether structure justified it.",
    })
  }
  return {
    ...trade,
    stop: trade.entry,
    movedToBreakeven: true,
    violations,
  }
}

export function closeTradeEarly(
  trade: ActiveTrade,
  candle: ScenarioCandle,
  index: number,
  pipSize = 0.0001
): ActiveTrade {
  const pips =
    trade.direction === "buy"
      ? (candle.close - trade.entry) / pipSize
      : (trade.entry - candle.close) / pipSize
  const targetPips = Math.abs(trade.target - trade.entry) / pipSize
  const violations = [...trade.violations]
  if (pips > 0 && targetPips - pips > 5) {
    violations.push({
      type: "closed-winner-early",
      message: "Closed a winner before target — review whether patience would have paid.",
    })
  }
  return {
    ...trade,
    status: "closed",
    closeIndex: index,
    closePrice: candle.close,
    closeReason: "manual",
    closedEarly: true,
    violations,
  }
}

export function detectPlanningViolations(
  scenario: ExecutionScenario,
  plan: ExecutionTradePlan
): RuleViolation[] {
  const violations: RuleViolation[] = []
  const idealNoTrade =
    scenario.idealDirection === "no-trade" || scenario.idealDirection === "wait"

  if (idealNoTrade && plan.direction !== "no-trade" && plan.direction !== "wait") {
    violations.push({
      type: "forced-trade",
      message: "Took a trade when no-trade was the professional decision.",
    })
  }

  if (plan.riskPercent > 2) {
    violations.push({
      type: "over-risked",
      message: `Risked ${plan.riskPercent}% — prop firms cap at 1–2%.`,
    })
  }

  const againstBias =
    (plan.direction === "buy" && scenario.idealDirection === "sell") ||
    (plan.direction === "sell" && scenario.idealDirection === "buy")
  if (againstBias) {
    violations.push({
      type: "against-bias",
      message: "Traded against the scenario's structural bias.",
    })
  }

  return violations
}

export function scoreManagement(
  trade: ActiveTrade | null,
  outcome: "win" | "loss" | "skipped" | "open" | "breakeven" | "manual" | null
): number {
  if (!trade) return outcome === "skipped" ? 90 : 70
  let score = 75
  if (outcome === "win" && !trade.closedEarly) score += 15
  if (outcome === "loss" && trade.movedToBreakeven) score += 5
  if (trade.closedEarly && outcome === "win") score -= 10
  score -= trade.violations.length * 8
  return Math.max(20, Math.min(100, score))
}

/** Check if pending order would fill on this candle. */
export function checkPendingFill(
  pendingType: string,
  entry: number,
  candle: ScenarioCandle
): boolean {
  switch (pendingType) {
    case "buy-limit":
      return candle.low <= entry
    case "sell-limit":
      return candle.high >= entry
    case "buy-stop":
      return candle.high >= entry
    case "sell-stop":
      return candle.low <= entry
    default:
      return false
  }
}
