import type { CourseLevel } from "@/lib/course/types"

export type Timeframe = "1M" | "5M" | "15M" | "1H" | "4H"

export const TIMEFRAMES: Timeframe[] = ["1M", "5M", "15M", "1H", "4H"]

/**
 * The trading concept a scenario teaches. Drives which generator builds the
 * synthetic candles and which marker tools are relevant.
 */
export type ChartConcept =
  | "candlesticks"
  | "swing-high-low"
  | "trend"
  | "support"
  | "resistance"
  | "breakout"
  | "fakeout"
  | "break-retest"
  | "icc-indication"
  | "icc-correction"
  | "icc-continuation"
  | "risk-reward"

/** Synthetic OHLC candle. `time` is a step index, not a real timestamp. */
export interface ScenarioCandle {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

/**
 * Tools the learner can select in lab mode. Point tools drop a single marker;
 * level tools draw a horizontal line; the trendline tool connects two clicks.
 */
export type MarkerTool =
  | "pointer"
  | "swing-high"
  | "swing-low"
  | "support"
  | "resistance"
  | "trendline"
  | "break"
  | "retest"
  | "entry"
  | "stop-loss"
  | "take-profit"

export type AnnotationType =
  | "label"
  | "zone"
  | "line"
  | "arrow"
  | "swing-high"
  | "swing-low"
  | "support"
  | "resistance"
  | "trendline"
  | "break"
  | "retest"
  | "entry"
  | "stop-loss"
  | "take-profit"

/** A chart point referenced by candle index + price. */
export interface ChartPoint {
  index: number
  price: number
}

/**
 * A pre-authored annotation drawn on a scenario (for demos and correct-answer
 * overlays). Different annotation types use different positioning fields.
 */
export interface ChartAnnotation {
  id: string
  type: AnnotationType
  /** Point + arrow markers */
  index?: number
  price?: number
  /** Zones (shaded rectangles) */
  fromIndex?: number
  toIndex?: number
  priceLow?: number
  priceHigh?: number
  /** Lines / trendlines */
  from?: ChartPoint
  to?: ChartPoint
  text?: string
  color?: string
}

/** A marker placed by the learner during a lab task. */
export interface UserMarker {
  id: string
  tool: MarkerTool
  index: number
  price: number
  /** Trendline second point */
  to?: ChartPoint
}

/** A single thing the learner must mark for a correct answer. */
export interface ExpectedMarker {
  tool: MarkerTool
  /** Target candle index (for point markers / line anchors) */
  index?: number
  /** Target price (for level markers and point markers) */
  price?: number
  /** Acceptable +/- distance in candle indices */
  toleranceIndex?: number
  /** Acceptable +/- distance in price (absolute) */
  tolerancePrice?: number
  /** Human label used in feedback, e.g. "the swing high" */
  label: string
  /** Weight toward the total score (defaults to equal split) */
  weight?: number
}

export interface ExpectedAnswer {
  requiredMarkers: ExpectedMarker[]
  scoringRubric: string[]
}

export interface ChartScenario {
  id: string
  title: string
  description: string
  symbol: string
  timeframe: Timeframe
  concept: ChartConcept
  candles: ScenarioCandle[]
  /** Annotations shown in demo mode and as the correct-answer overlay */
  annotations: ChartAnnotation[]
  /** Present when the scenario is an interactive task */
  expectedAnswer?: ExpectedAnswer
  /** Task instruction shown in lab mode, e.g. "Mark the next swing high" */
  task?: string
  /** Tools offered for this task (subset of MarkerTool) */
  tools?: MarkerTool[]
  hints: string[]
  explanation: string
  difficulty: CourseLevel
  estimatedMinutes: number
}

export interface ScoredMarker {
  expected: ExpectedMarker
  matched: boolean
  userMarker?: UserMarker
  note: string
}

export interface ChartScoreResult {
  score: number
  passed: boolean
  correct: string[]
  improvements: string[]
  tip: string
  summary: string
  scored: ScoredMarker[]
}

/** Persisted lab session for localStorage (no backend). */
export interface StoredChartLabSession {
  scenarioId: string
  markers: UserMarker[]
  score: number
  passed: boolean
  summary: string
  completedAt: string
}
