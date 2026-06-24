import {
  generateScenario,
  type ScenarioKind,
} from "@/lib/charts/generate-scenario"
import type {
  ChartConcept,
  ChartScenario,
  MarkerTool,
  Timeframe,
} from "@/lib/charts/types"
import type { CourseLevel } from "@/lib/course/types"
import type { ChartDrillType } from "@/lib/course/types"

interface ScenarioMeta {
  id: string
  kind: ScenarioKind
  seed: string
  title: string
  description: string
  concept: ChartConcept
  symbol?: string
  timeframe?: Timeframe
  base?: number
  difficulty?: CourseLevel
  estimatedMinutes?: number
  /** Interactive (lab) vs read-only (demo). */
  interactive?: boolean
  task?: string
  tools?: MarkerTool[]
  hints: string[]
  explanation: string
  /**
   * For demos: only keep these generated annotation ids. Lets one generated
   * pattern power several phase-focused demos (e.g. ICC indication only).
   */
  keepAnnotationIds?: string[]
}

function build(meta: ScenarioMeta): ChartScenario {
  const generated = generateScenario({
    kind: meta.kind,
    seed: meta.seed,
    base: meta.base ?? 2350,
  })
  const annotations = meta.keepAnnotationIds
    ? generated.annotations.filter((a) => meta.keepAnnotationIds!.includes(a.id))
    : generated.annotations
  return {
    id: meta.id,
    title: meta.title,
    description: meta.description,
    symbol: meta.symbol ?? "XAUUSD Practice",
    timeframe: meta.timeframe ?? "15M",
    concept: meta.concept,
    candles: generated.candles,
    annotations,
    expectedAnswer: meta.interactive ? generated.expectedAnswer : undefined,
    task: meta.interactive ? (meta.task ?? generated.defaultTask) : undefined,
    tools: meta.interactive ? (meta.tools ?? generated.tools) : undefined,
    hints: meta.hints,
    explanation: meta.explanation,
    difficulty: meta.difficulty ?? "beginner",
    estimatedMinutes: meta.estimatedMinutes ?? 3,
  }
}

const SCENARIO_META: ScenarioMeta[] = [
  // ---- Demos (read-only, annotated) ----
  {
    id: "demo-candlestick-anatomy",
    kind: "uptrend",
    seed: "candlestick-anatomy",
    title: "Anatomy of a candle",
    description:
      "Each candle shows the open, close, and the high/low wicks for one period.",
    concept: "candlesticks",
    explanation:
      "The body spans the open and close. The thin wicks show how far price stretched before settling. Green means price closed higher than it opened; red means it closed lower.",
    hints: ["Look at where each body starts and ends versus its wicks."],
  },
  {
    id: "demo-bullish-bearish",
    kind: "uptrend",
    seed: "bullish-bearish",
    title: "Bullish vs bearish candles",
    description: "Green candles close up, red candles close down.",
    concept: "candlesticks",
    explanation:
      "A run of green candles with small lower wicks shows buyers in control. Red candles with small upper wicks show sellers in control.",
    hints: ["Count consecutive green vs red bodies to read momentum."],
  },
  {
    id: "demo-swing-high-low",
    kind: "uptrend",
    seed: "swing-demo",
    title: "Swing highs and swing lows",
    description: "The peaks and valleys that build market structure.",
    concept: "swing-high-low",
    explanation:
      "A swing high is a local peak where price turned down; a swing low is a local valley where price turned up. Rising swing lows signal an uptrend.",
    hints: ["A swing high has lower candles on both sides of it."],
  },
  {
    id: "demo-trend-range",
    kind: "ranging",
    seed: "trend-range",
    title: "Trend vs range",
    description: "Directional structure versus a sideways box.",
    concept: "trend",
    explanation:
      "When price oscillates between a clear ceiling and floor without making new highs, it is ranging rather than trending.",
    hints: ["If highs and lows are roughly level, it's a range."],
  },
  {
    id: "demo-support",
    kind: "support-bounce",
    seed: "support-demo",
    title: "Support",
    description: "A floor buyers repeatedly defend.",
    concept: "support",
    explanation:
      "Support is a price area where buying pressure has repeatedly stopped a decline. The more clean touches, the more obvious the level.",
    hints: ["Find the price where the lows line up."],
  },
  {
    id: "demo-resistance",
    kind: "resistance-rejection",
    seed: "resistance-demo",
    title: "Resistance",
    description: "A ceiling sellers repeatedly defend.",
    concept: "resistance",
    explanation:
      "Resistance is a price area where selling pressure has repeatedly capped a rally.",
    hints: ["Find the price where the highs line up."],
  },
  {
    id: "demo-breakout",
    kind: "breakout",
    seed: "breakout-demo",
    title: "Breakout",
    description: "Price closes decisively through a level.",
    concept: "breakout",
    explanation:
      "A breakout happens when price closes beyond a level it previously respected, often with a larger candle.",
    hints: ["A real breakout closes beyond the level, not just wicks through it."],
  },
  {
    id: "demo-fakeout",
    kind: "fakeout",
    seed: "fakeout-demo",
    title: "Fakeout",
    description: "A break that fails and snaps back.",
    concept: "fakeout",
    explanation:
      "A fakeout spikes past a level then closes back inside it, trapping traders who chased the move.",
    hints: ["Watch where the candle closes, not just where the wick reached."],
  },
  {
    id: "demo-break-retest",
    kind: "break-retest",
    seed: "break-retest-demo",
    title: "Break and retest",
    description: "Old resistance becomes new support.",
    concept: "break-retest",
    explanation:
      "After price breaks a level, it often returns to test it from the other side before continuing. Broken resistance can act as support.",
    hints: ["The retest touches the old level from above before price continues."],
  },
  {
    id: "demo-icc-bullish",
    kind: "icc-bullish",
    seed: "icc-bull-demo",
    title: "ICC bullish setup",
    description: "Indication, correction, continuation.",
    concept: "icc-continuation",
    explanation:
      "A strong bullish push (indication) is followed by a pullback (correction). When buyers step back in from the correction zone, the continuation begins.",
    hints: ["The entry is inside the correction zone, after the push."],
  },
  {
    id: "demo-icc-indication",
    kind: "icc-bullish",
    seed: "icc-bull-demo",
    title: "Indication: the market push",
    description: "Step 1 — a strong, decisive move that shows intent.",
    concept: "icc-indication",
    explanation:
      "The indication is the first strong push in a direction. It tells you where the bigger players are pressing — large bodies, little hesitation. You don't enter here; you note the direction it's signalling.",
    hints: ["Look for the strongest, most decisive leg on the chart."],
    keepAnnotationIds: ["ind"],
  },
  {
    id: "demo-icc-correction",
    kind: "icc-bullish",
    seed: "icc-bull-demo",
    title: "Correction: the pullback",
    description: "Step 2 — price pauses and pulls back against the push.",
    concept: "icc-correction",
    explanation:
      "After the indication, price drifts back the other way. This correction is where patient traders wait — it builds the discount zone you'll watch for a continuation. A correction is slower and shallower than the indication that came before it.",
    hints: [
      "The correction moves against the push, on smaller candles.",
      "The shaded zone is where the next entry is likely to form.",
    ],
    keepAnnotationIds: ["ind", "corr"],
  },
  {
    id: "demo-icc-continuation",
    kind: "icc-bullish",
    seed: "icc-bull-demo",
    title: "Continuation: the entry zone",
    description: "Step 3 — buyers step back in and the trend resumes.",
    concept: "icc-continuation",
    explanation:
      "The continuation is the resumption of the original push. When price reacts out of the correction zone in the direction of the indication, that reaction is your entry trigger — stop below the zone, target beyond the prior high.",
    hints: ["The entry forms where price leaves the correction zone in the push direction."],
    keepAnnotationIds: ["ind", "corr", "cont"],
  },
  {
    id: "demo-risk-reward",
    kind: "risk-reward",
    seed: "rr-demo",
    title: "Risk/reward",
    description: "Entry, stop, and target define your R multiple.",
    concept: "risk-reward",
    explanation:
      "Risk is the distance from entry to stop. Reward is the distance from entry to target. A 1:2 setup risks one unit to make two.",
    hints: ["Reward distance should be at least twice the risk distance."],
  },
  {
    id: "demo-bull-flag",
    kind: "icc-bullish",
    seed: "bull-flag-demo",
    title: "Bull flag pattern",
    description: "A sharp push up, then a tight sideways flag before continuation.",
    concept: "icc-continuation",
    explanation:
      "A bull flag shows strong momentum (the pole), a brief pause or drift (the flag), then a breakout continuation. Stops often sit below the flag low.",
    hints: [
      "The flag should be tighter and shallower than the initial push.",
      "Look for the continuation after price leaves the flag.",
    ],
    keepAnnotationIds: ["ind", "corr", "cont"],
  },
  {
    id: "demo-vwap-bounce",
    kind: "support-bounce",
    seed: "vwap-bounce-demo",
    title: "VWAP bounce (educational)",
    description: "Price pulls back to a session average zone and buyers step in.",
    concept: "support",
    explanation:
      "On active tickers, VWAP acts like a dynamic average. A bounce off VWAP with volume can signal buyers defending — but context matters; dead charts rarely respect it.",
    hints: ["The bounce should show rejection wicks and a green follow-through candle."],
  },
  {
    id: "demo-vwap-rejection",
    kind: "resistance-rejection",
    seed: "vwap-reject-demo",
    title: "VWAP rejection (educational)",
    description: "Price rallies into VWAP from below and gets sold into.",
    concept: "resistance",
    explanation:
      "When price is below VWAP, a rally into it can fail as sellers defend the average. Rejection wicks and red closes are clues — not guarantees.",
    hints: ["Look for upper wicks and failure to hold above the level."],
  },
  {
    id: "demo-relative-volume",
    kind: "breakout",
    seed: "rel-vol-demo",
    title: "High relative volume move",
    description: "A breakout with unusually active participation.",
    concept: "breakout",
    explanation:
      "Relative volume compares today's activity to the recent average. Spikes often accompany news, gaps, and breakouts — the kind of action day traders watch.",
    hints: ["Volume expansion often accompanies the breakout candle."],
  },
  {
    id: "demo-chasing-late-entry",
    kind: "uptrend",
    seed: "chase-demo",
    title: "Chasing a late entry",
    description: "Price already extended — poor R:R for new longs.",
    concept: "trend",
    explanation:
      "After a large vertical move, entries far from support offer tight stops and poor reward. Patient traders wait for pullbacks or skip.",
    hints: [
      "Notice how far price is from the last higher low.",
      "Late entries often have stops inside normal noise.",
    ],
  },
  {
    id: "demo-opening-range",
    kind: "breakout",
    seed: "orb-demo",
    title: "Opening range breakout",
    description: "Price breaks the first minutes' high or low with volume.",
    concept: "breakout",
    explanation:
      "The opening range is the high/low of the first 5–15 minutes. A clean break with volume can start a trend day — failed breaks often reverse fast.",
    hints: ["Mark the range high before the breakout candle."],
  },

  // ---- Interactive lab tasks ----
  {
    id: "task-mark-swing-high",
    kind: "uptrend",
    seed: "task-swing-high",
    title: "Mark the swing high",
    description: "Click the most obvious swing high on this chart.",
    concept: "swing-high-low",
    interactive: true,
    tools: ["swing-high"],
    task: "Mark the most recent swing high — the clearest peak where price turned down.",
    difficulty: "beginner",
    explanation:
      "A swing high is a local peak with lower candles on both sides. Marking them is how you read structure.",
    hints: [
      "A swing high is higher than the candles immediately around it.",
      "Look for the peak before price rolled over.",
    ],
  },
  {
    id: "task-mark-swing-low",
    kind: "downtrend",
    seed: "task-swing-low",
    title: "Mark the swing low",
    description: "Click the most obvious swing low on this chart.",
    concept: "swing-high-low",
    interactive: true,
    tools: ["swing-low"],
    task: "Mark the most recent swing low — the clearest valley where price turned up.",
    difficulty: "beginner",
    explanation:
      "A swing low is a local valley with higher candles on both sides.",
    hints: ["A swing low is lower than the candles immediately around it."],
  },
  {
    id: "task-identify-support",
    kind: "support-bounce",
    seed: "task-support",
    title: "Draw the support level",
    description: "Mark the floor price keeps bouncing from.",
    concept: "support",
    interactive: true,
    tools: ["support"],
    difficulty: "beginner",
    explanation:
      "Support connects the lows that buyers have defended more than once.",
    hints: ["Line your level up with the lowest bounces."],
  },
  {
    id: "task-identify-resistance",
    kind: "resistance-rejection",
    seed: "task-resistance",
    title: "Draw the resistance level",
    description: "Mark the ceiling price keeps rejecting from.",
    concept: "resistance",
    interactive: true,
    tools: ["resistance"],
    difficulty: "beginner",
    explanation:
      "Resistance connects the highs that sellers have defended more than once.",
    hints: ["Line your level up with the highest rejections."],
  },
  {
    id: "task-spot-trend",
    kind: "uptrend",
    seed: "task-trend",
    title: "Spot the trend",
    description: "Mark the latest higher low that confirms the uptrend.",
    concept: "trend",
    interactive: true,
    tools: ["swing-low"],
    task: "This is an uptrend. Mark the most recent higher low that keeps the trend intact.",
    difficulty: "beginner",
    explanation:
      "Uptrends are built from higher highs and higher lows. The latest higher low is where buyers defended.",
    hints: ["Find the valley that sits higher than the previous valley."],
  },
  {
    id: "task-mark-breakout",
    kind: "breakout",
    seed: "task-breakout",
    title: "Mark the breakout",
    description: "Draw the resistance, then mark the breakout candle.",
    concept: "breakout",
    interactive: true,
    tools: ["resistance", "break"],
    difficulty: "intermediate",
    explanation:
      "Mark the level being defended, then the candle that closes decisively beyond it.",
    hints: [
      "First draw the resistance the highs share.",
      "Then mark the candle that closed above it.",
    ],
  },
  {
    id: "task-break-retest",
    kind: "break-retest",
    seed: "task-break-retest",
    title: "Mark the break and retest",
    description: "Mark the level, the break, and the retest.",
    concept: "break-retest",
    interactive: true,
    tools: ["resistance", "break", "retest"],
    difficulty: "intermediate",
    explanation:
      "Break-and-retest: mark the old level, the breakout, and the pullback that retests it as support.",
    hints: [
      "The retest taps the old resistance from above.",
      "Place markers in order: level, break, retest.",
    ],
  },
  {
    id: "task-icc-bullish",
    kind: "icc-bullish",
    seed: "task-icc-bull",
    title: "Trade the bullish continuation",
    description: "Place entry, stop, and target after the correction.",
    concept: "icc-continuation",
    interactive: true,
    tools: ["entry", "stop-loss", "take-profit"],
    difficulty: "intermediate",
    explanation:
      "After the bullish indication and correction, enter in the zone, stop below it, and target beyond the prior high.",
    hints: [
      "Entry goes inside the correction zone.",
      "Stop sits below the zone; target sits above the last high.",
    ],
  },
  {
    id: "task-icc-bearish",
    kind: "icc-bearish",
    seed: "task-icc-bear",
    title: "Trade the bearish continuation",
    description: "Place a short entry, stop, and target after the correction.",
    concept: "icc-continuation",
    interactive: true,
    tools: ["entry", "stop-loss", "take-profit"],
    difficulty: "intermediate",
    explanation:
      "After the bearish indication and correction, short from the zone, stop above it, and target beyond the prior low.",
    hints: [
      "Entry goes inside the correction zone.",
      "Stop sits above the zone; target sits below the last low.",
    ],
  },
  {
    id: "task-risk-reward",
    kind: "risk-reward",
    seed: "task-rr",
    title: "Build a 1:2 risk/reward trade",
    description: "Place entry, stop, and target with good R.",
    concept: "risk-reward",
    interactive: true,
    tools: ["entry", "stop-loss", "take-profit"],
    difficulty: "intermediate",
    explanation:
      "A good beginner rule: only take trades where the target is at least twice as far as the stop.",
    hints: ["Measure: target distance should be 2x your stop distance or more."],
  },
]

const SCENARIOS: ChartScenario[] = SCENARIO_META.map(build)
const SCENARIO_MAP = new Map(SCENARIOS.map((s) => [s.id, s]))

export function getChartScenario(id: string): ChartScenario | undefined {
  return SCENARIO_MAP.get(id)
}

export function getAllChartScenarios(): ChartScenario[] {
  return SCENARIOS
}

export function getInteractiveScenarios(): ChartScenario[] {
  return SCENARIOS.filter((s) => s.expectedAnswer)
}

/** Map a course drill type to its interactive chart scenario. */
const DRILL_SCENARIO_MAP: Record<ChartDrillType, string> = {
  "identify-support": "task-identify-support",
  "identify-resistance": "task-identify-resistance",
  "spot-trend": "task-spot-trend",
  "mark-break": "task-mark-breakout",
  "mark-retest": "task-break-retest",
  "entry-stop-target": "task-risk-reward",
  "icc-indication": "task-icc-bullish",
  "icc-correction": "task-icc-bullish",
  "icc-continuation": "task-icc-bullish",
}

export function getScenarioForDrillType(
  drillType: ChartDrillType
): ChartScenario | undefined {
  return getChartScenario(DRILL_SCENARIO_MAP[drillType])
}
