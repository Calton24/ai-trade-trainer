/**
 * Typed configs for interactive lesson widgets rendered inside content
 * blocks (type: "interactive-widget"). Each widget is a small, reusable,
 * self-grading exercise — the building blocks of Codecademy-style lessons.
 */

export interface SortBucketsWidget {
  kind: "sort-buckets"
  prompt: string
  buckets: string[]
  items: { label: string; bucket: string; explain?: string }[]
}

export interface MatchPairsWidget {
  kind: "match-pairs"
  prompt: string
  pairs: { left: string; right: string }[]
}

export interface OrderStepsWidget {
  kind: "order-steps"
  prompt: string
  /** Steps listed in the correct order. Presented shuffled. */
  steps: string[]
}

export interface DecisionScenariosWidget {
  kind: "decision-scenarios"
  prompt: string
  /** Defaults to ["Trade", "Wait", "Skip"]. */
  options?: string[]
  scenarios: { situation: string; correct: string; coaching: string }[]
}

export interface PipCalculatorWidget {
  kind: "pip-calculator"
}

export interface PositionSizeScenario {
  label: string
  account: number
  riskPercent: number
  stopPips: number
  /** Pip value per standard lot in account currency. */
  pipValuePerLot: number
}

export interface PositionSizeCalculatorWidget {
  kind: "position-size-calculator"
  /** Graded scenarios: the student calculates lots manually, then verifies. */
  scenarios?: PositionSizeScenario[]
}

export interface ExpectancySimulatorWidget {
  kind: "expectancy-simulator"
}

export interface CoinFlipWidget {
  kind: "coin-flip"
}

export interface SessionClockWidget {
  kind: "session-clock"
}

export interface WatchlistPairCard {
  pair: string
  trend: "up" | "down" | "range" | "messy"
  withDxy: boolean
  cleanStructure: boolean
  newsRisk: boolean
  goodPick: boolean
  explain: string
}

export interface WatchlistBuilderWidget {
  kind: "watchlist-builder"
  prompt: string
  pairs: WatchlistPairCard[]
  maxPicks: number
}

export interface DailyChecklistWidget {
  kind: "daily-checklist"
  title: string
  items: string[]
}

export interface JournalReviewEntry {
  summary: string
  options: string[]
  /** The option that correctly labels this entry. */
  correct: string
  explain: string
}

export interface JournalReviewWidget {
  kind: "journal-review"
  prompt: string
  entries: JournalReviewEntry[]
}

export interface WeeklyPlannerWidget {
  kind: "weekly-planner"
  prompt: string
  days: {
    day: string
    situation: string
    correct: "trade" | "wait" | "skip"
    coaching: string
  }[]
}

// ---- Market Structure widgets ----

export type SwingLabel = "HH" | "HL" | "LH" | "LL"

/** A swing point on a normalised 0–100 chart grid (x left→right, y is price). */
export interface SwingPoint {
  /** 0–100 horizontal position (chronological order). */
  x: number
  /** 0–100 vertical position — HIGHER number = HIGHER price (rendered inverted). */
  y: number
  /** Whether this point is a swing high (peak) or swing low (trough). */
  type: "high" | "low"
  /** The correct structure label for this point relative to the previous same-type swing. */
  label: SwingLabel
}

/**
 * Trend Detective: a zig-zag line drawn through swing points. The student
 * labels each swing HH/HL/LH/LL, then classifies the resulting trend.
 */
export interface SwingLabelerWidget {
  kind: "swing-labeler"
  prompt: string
  points: SwingPoint[]
  /** The correct overall trend classification. */
  trend: "Uptrend" | "Downtrend" | "Range" | "Transition"
  trendExplain: string
}

/**
 * Continuation Predictor: a chart pauses after a sequence of swings; the
 * student predicts what the market most likely does next.
 */
export interface ContinuationPredictorWidget {
  kind: "continuation-predictor"
  prompt: string
  points: SwingPoint[]
  options?: string[]
  correct: string
  explain: string
}

/**
 * Trend Builder: the student places swing points to construct a target
 * structure (e.g. a clean uptrend). Graded on the HH/HL (or LH/LL) pattern.
 */
export interface TrendBuilderWidget {
  kind: "trend-builder"
  prompt: string
  target: "Uptrend" | "Downtrend"
  /** Number of swing points the student must place (alternating high/low). */
  pointCount: number
}

export type LessonWidget =
  | SortBucketsWidget
  | MatchPairsWidget
  | OrderStepsWidget
  | DecisionScenariosWidget
  | PipCalculatorWidget
  | PositionSizeCalculatorWidget
  | ExpectancySimulatorWidget
  | CoinFlipWidget
  | SessionClockWidget
  | WatchlistBuilderWidget
  | DailyChecklistWidget
  | JournalReviewWidget
  | WeeklyPlannerWidget
  | SwingLabelerWidget
  | ContinuationPredictorWidget
  | TrendBuilderWidget
