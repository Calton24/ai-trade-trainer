import { breakRetestStrategy } from "./break-retest"
import {
  resistanceRejectionStrategy,
  supportBounceStrategy,
  trendPullbackStrategy,
} from "./beginner-strategies"
import {
  bearFlagStrategy,
  bullFlagStrategy,
  highOfDayBreakoutStrategy,
  iccStrategy,
  movingAverageTrendStrategy,
  openingRangeBreakoutStrategy,
  reversalStrategy,
  vwapBounceStrategy,
} from "./intermediate-strategies"
import {
  advancedReversalSwingStrategy,
  bollyBreakoutBandStrategy,
  eodContinuationStrategy,
  eodReversalStrategy,
  momentumBounceStrategy,
} from "./professional-forex-strategies"
import {
  continuationConfirmationStrategy,
  eodReversalBehaviourStrategy,
  falseReversalFilterStrategy,
  intradayReversalStrategy,
  trendContinuationBehaviourStrategy,
} from "./market-behaviour-strategies"
import type { StrategyCategory, TradingStrategy } from "@/lib/strategy-wiki/types"

export const ALL_STRATEGIES: TradingStrategy[] = [
  intradayReversalStrategy,
  eodReversalBehaviourStrategy,
  trendContinuationBehaviourStrategy,
  falseReversalFilterStrategy,
  continuationConfirmationStrategy,
  breakRetestStrategy,
  supportBounceStrategy,
  resistanceRejectionStrategy,
  trendPullbackStrategy,
  openingRangeBreakoutStrategy,
  vwapBounceStrategy,
  bullFlagStrategy,
  bearFlagStrategy,
  reversalStrategy,
  iccStrategy,
  movingAverageTrendStrategy,
  highOfDayBreakoutStrategy,
  eodContinuationStrategy,
  eodReversalStrategy,
  momentumBounceStrategy,
  advancedReversalSwingStrategy,
  bollyBreakoutBandStrategy,
]

export const STRATEGY_CATEGORIES: StrategyCategory[] = [
  "Market Behaviour",
  "Price Action",
  "Trend Following",
  "Momentum",
  "Reversal",
  "Day Trading",
  "Structure",
  "Professional Forex",
]

export function getStrategyBySlug(slug: string): TradingStrategy | undefined {
  return ALL_STRATEGIES.find((s) => s.slug === slug)
}

export function getStrategyById(id: string): TradingStrategy | undefined {
  return ALL_STRATEGIES.find((s) => s.id === id)
}

export function getFeaturedStrategies(): TradingStrategy[] {
  return ALL_STRATEGIES.filter((s) => s.featured)
}

export function getStrategiesByCategory(
  category: StrategyCategory
): TradingStrategy[] {
  return ALL_STRATEGIES.filter((s) => s.category === category)
}

export {
  breakRetestStrategy,
  supportBounceStrategy,
  resistanceRejectionStrategy,
  trendPullbackStrategy,
  openingRangeBreakoutStrategy,
  vwapBounceStrategy,
  bullFlagStrategy,
  bearFlagStrategy,
  reversalStrategy,
  iccStrategy,
  movingAverageTrendStrategy,
  highOfDayBreakoutStrategy,
  eodContinuationStrategy,
  eodReversalStrategy,
  momentumBounceStrategy,
  advancedReversalSwingStrategy,
  bollyBreakoutBandStrategy,
}
