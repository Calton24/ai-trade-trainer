import type {
  StrategyChartExample,
  StrategyPracticeExercise,
  StrategySetupStep,
  TradingStrategy,
} from "@/lib/strategy-wiki/types"

const STEP_TITLES = [
  "Market Context",
  "Key Level / Structure",
  "Setup Trigger",
  "Confirmation",
  "Entry Area",
  "Invalidation / Stop Loss",
  "Target / Take Profit",
  "Trade or Skip",
  "Post-Trade Review",
] as const

export function buildSetupSteps(
  strategySlug: string,
  explanations: string[],
  tips?: (string | undefined)[]
): StrategySetupStep[] {
  return STEP_TITLES.map((title, i) => ({
    id: `${strategySlug}-step-${i + 1}`,
    title,
    explanation: explanations[i] ?? "",
    beginnerTip: tips?.[i],
  }))
}

export function buildStrategy(
  partial: Omit<TradingStrategy, "setupSteps"> & {
    setupStepExplanations: string[]
    setupStepTips?: (string | undefined)[]
  }
): TradingStrategy {
  const { setupStepExplanations, setupStepTips, ...rest } = partial
  return {
    ...rest,
    setupSteps: buildSetupSteps(
      rest.slug,
      setupStepExplanations,
      setupStepTips
    ),
  }
}

export function exercise(
  strategyId: string,
  slug: string,
  title: string,
  scenarioId: string,
  task: string,
  expected: "trade" | "skip",
  tip: string
): StrategyPracticeExercise {
  return {
    id: `${strategyId}-ex-${slug}`,
    strategyId,
    title,
    scenarioId,
    task,
    expectedTradeDecision: expected,
    improvementTip: tip,
  }
}

export function chartEx(
  strategyId: string,
  slug: string,
  chartScenarioId: string,
  variant: StrategyChartExample["variant"],
  title: string,
  caption: string
): StrategyChartExample {
  return {
    id: `${strategyId}-chart-${slug}`,
    title,
    chartScenarioId,
    variant,
    caption,
  }
}
