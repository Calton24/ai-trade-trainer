import type { TrendSpotterScenario } from "@/lib/trend-spotter/types"

export const TREND_SPOTTER_DISCLAIMER =
  "Trend Spotter uses generated educational charts. It does not provide financial advice, live trading signals, or profit guarantees."

export const TREND_SCENARIOS: TrendSpotterScenario[] = [
  {
    id: "ts-clean-uptrend",
    slug: "clean-uptrend",
    title: "Clean uptrend",
    description: "Higher highs and higher lows with orderly pullbacks.",
    chartScenarioId: "task-spot-trend",
    classification: "uptrend",
    bias: "bullish",
    tradeDecision: "trade",
    explanation:
      "Price makes higher highs and higher lows. Each pullback holds above the prior swing low.",
    improvementTip: "Connect swing lows to see the rising floor.",
    difficulty: "beginner",
    moduleSlug: "trend-basics",
  },
  {
    id: "ts-clean-downtrend",
    slug: "clean-downtrend",
    title: "Clean downtrend",
    description: "Lower highs and lower lows in sequence.",
    chartScenarioId: "task-mark-swing-low",
    classification: "downtrend",
    bias: "bearish",
    tradeDecision: "trade",
    explanation:
      "Sellers control — each rally fails below the prior swing high.",
    improvementTip: "Mark lower highs to confirm bearish structure.",
    difficulty: "beginner",
    moduleSlug: "trend-basics",
  },
  {
    id: "ts-sideways-range",
    slug: "sideways-range",
    title: "Sideways range",
    description: "Price oscillates between a ceiling and floor.",
    chartScenarioId: "demo-trend-range",
    classification: "range",
    bias: "neutral",
    tradeDecision: "skip",
    explanation:
      "No new highs or lows — price rejects the same upper and lower bounds.",
    improvementTip: "Wait for a break with follow-through before picking a side.",
    difficulty: "beginner",
    moduleSlug: "trend-basics",
  },
  {
    id: "ts-choppy-range",
    slug: "choppy-range",
    title: "Choppy / messy chart",
    description: "Overlapping candles with no readable structure.",
    chartScenarioId: "demo-chasing-late-entry",
    classification: "messy",
    bias: "neutral",
    tradeDecision: "skip",
    explanation:
      "Structure is unclear — overlapping swings and no clean bias.",
    improvementTip: "When in doubt, skip. Messy charts punish impulsive entries.",
    difficulty: "beginner",
    moduleSlug: "trade-or-skip",
  },
  {
    id: "ts-pullback-uptrend",
    slug: "pullback-uptrend",
    title: "Pullback in uptrend",
    description: "Temporary dip within a rising structure.",
    chartScenarioId: "demo-break-retest",
    classification: "uptrend",
    bias: "bullish",
    tradeDecision: "trade",
    explanation:
      "The overall trend is up; the dip is a pullback, not a reversal.",
    improvementTip: "Pullbacks in trends often retest prior breakout levels.",
    difficulty: "intermediate",
    moduleSlug: "trend-quality",
  },
  {
    id: "ts-possible-reversal",
    slug: "possible-reversal",
    title: "Possible bearish reversal",
    description: "Failed breakout after an extended move.",
    chartScenarioId: "demo-fakeout",
    classification: "range",
    bias: "neutral",
    tradeDecision: "skip",
    explanation:
      "A failed breakout often leads to range or reversal — wait for confirmation.",
    improvementTip: "Fakeouts trap traders who chase breakouts without retest.",
    difficulty: "intermediate",
    moduleSlug: "reversal-continuation",
  },
  {
    id: "ts-weak-uptrend",
    slug: "weak-uptrend",
    title: "Weak uptrend",
    description: "Shallow higher lows with overlapping candles.",
    chartScenarioId: "demo-swing-high-low",
    classification: "uptrend",
    bias: "bullish",
    tradeDecision: "skip",
    explanation:
      "Technically an uptrend but choppy — low confidence for new entries.",
    improvementTip: "Trend quality matters as much as direction.",
    difficulty: "intermediate",
    moduleSlug: "trend-quality",
  },
  {
    id: "ts-structure-break",
    slug: "structure-break",
    title: "Structure break",
    description: "Prior uptrend loses its last higher low.",
    chartScenarioId: "task-mark-breakout",
    classification: "downtrend",
    bias: "bearish",
    tradeDecision: "trade",
    explanation:
      "Breaking the last higher low shifts bias from bullish to bearish.",
    improvementTip: "Structure breaks invalidate the prior trend thesis.",
    difficulty: "intermediate",
    moduleSlug: "market-structure",
  },
  {
    id: "ts-continuation-pullback",
    slug: "continuation-pullback",
    title: "Continuation after pullback",
    description: "Trend resumes after a shallow correction.",
    chartScenarioId: "demo-icc-continuation",
    classification: "uptrend",
    bias: "bullish",
    tradeDecision: "trade",
    explanation: "Buyers return after a controlled pullback — trend continues.",
    improvementTip: "Continuation setups need clear prior trend context.",
    difficulty: "intermediate",
    moduleSlug: "reversal-continuation",
  },
  {
    id: "ts-exhaustion",
    slug: "trend-exhaustion",
    title: "Trend exhaustion",
    description: "Extended move with shrinking follow-through.",
    chartScenarioId: "demo-bullish-bearish",
    classification: "range",
    bias: "neutral",
    tradeDecision: "skip",
    explanation:
      "Momentum fades — extended trends often pause or reverse.",
    improvementTip: "Do not assume a trend runs forever.",
    difficulty: "intermediate",
    moduleSlug: "trend-quality",
  },
  {
    id: "ts-resistance-rejection",
    slug: "resistance-rejection",
    title: "Resistance rejection",
    description: "Repeated failures at the same ceiling.",
    chartScenarioId: "demo-resistance",
    classification: "range",
    bias: "neutral",
    tradeDecision: "skip",
    explanation: "Price cannot break resistance — range until proven otherwise.",
    improvementTip: "Mark the ceiling where sellers keep appearing.",
    difficulty: "beginner",
    moduleSlug: "market-structure",
  },
  {
    id: "ts-support-bounce",
    slug: "support-bounce",
    title: "Support bounce in uptrend",
    description: "Buyers defend a rising support line.",
    chartScenarioId: "demo-support",
    classification: "uptrend",
    bias: "bullish",
    tradeDecision: "trade",
    explanation: "Higher lows hold at support — bullish structure intact.",
    improvementTip: "Support in an uptrend is where pullbacks often end.",
    difficulty: "beginner",
    moduleSlug: "market-structure",
  },
  {
    id: "ts-weak-downtrend",
    slug: "weak-downtrend",
    title: "Weak downtrend",
    description: "Lower highs with shallow, overlapping swings.",
    chartScenarioId: "task-icc-bearish",
    classification: "downtrend",
    bias: "bearish",
    tradeDecision: "skip",
    explanation:
      "Structure leans bearish but momentum is choppy — low confidence for entries.",
    improvementTip: "Weak trends need extra confirmation before committing bias.",
    difficulty: "intermediate",
    moduleSlug: "trend-quality",
  },
  {
    id: "ts-fake-reversal",
    slug: "fake-reversal",
    title: "Fake reversal",
    description: "A sharp counter-move that fails to break structure.",
    chartScenarioId: "demo-fakeout",
    classification: "uptrend",
    bias: "bullish",
    tradeDecision: "skip",
    explanation:
      "The dip looked like a reversal but price held above the last higher low — trend intact.",
    improvementTip: "Wait for a structure break before flipping bias on a reversal.",
    difficulty: "intermediate",
    moduleSlug: "reversal-continuation",
  },
  {
    id: "ts-htf-uptrend-ltf-pullback",
    slug: "htf-uptrend-ltf-pullback",
    title: "HTF uptrend, LTF pullback",
    description: "Higher-timeframe bullish structure with a local dip.",
    chartScenarioId: "demo-icc-correction",
    classification: "uptrend",
    bias: "bullish",
    tradeDecision: "trade",
    explanation:
      "The broader trend is up; the lower-timeframe dip is a correction, not a reversal.",
    improvementTip: "Zoom out first — local pullbacks often resolve with the HTF trend.",
    difficulty: "advanced",
    moduleSlug: "reversal-continuation",
  },
  {
    id: "ts-htf-downtrend-ltf-correction",
    slug: "htf-downtrend-ltf-correction",
    title: "HTF downtrend, LTF correction",
    description: "Bearish structure with a temporary relief rally.",
    chartScenarioId: "demo-icc-indication",
    classification: "downtrend",
    bias: "bearish",
    tradeDecision: "trade",
    explanation:
      "The higher-timeframe trend is down; the bounce is a correction within bearish structure.",
    improvementTip: "Relief rallies in downtrends often fail at prior lower highs.",
    difficulty: "advanced",
    moduleSlug: "reversal-continuation",
  },
]

const SCENARIO_MAP = new Map(TREND_SCENARIOS.map((s) => [s.id, s]))
const SCENARIO_SLUG_MAP = new Map(TREND_SCENARIOS.map((s) => [s.slug, s]))

export function getAllTrendScenarios(): TrendSpotterScenario[] {
  return TREND_SCENARIOS
}

export function getTrendScenario(idOrSlug: string): TrendSpotterScenario | undefined {
  return SCENARIO_MAP.get(idOrSlug) ?? SCENARIO_SLUG_MAP.get(idOrSlug)
}

export function getChallengeDeck(count = 10): TrendSpotterScenario[] {
  return shuffle([...TREND_SCENARIOS]).slice(0, Math.min(count, TREND_SCENARIOS.length))
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
