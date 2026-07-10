import type { ExecutionScenario, ExecutionTradePlan } from "./types"

export function createDefaultPlan(scenario: ExecutionScenario): ExecutionTradePlan {
  return {
    direction:
      scenario.idealDirection === "buy" || scenario.idealDirection === "sell"
        ? scenario.idealDirection
        : "wait",
    strategy: null,
    orderMode: "market",
    pendingType: "buy-limit",
    entry: scenario.idealEntry,
    stop: scenario.idealStop,
    target: scenario.idealTarget,
    lots: 0,
    accountSize: scenario.defaultAccount,
    riskPercent: 1,
    confidence: 0,
  }
}
