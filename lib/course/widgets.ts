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
