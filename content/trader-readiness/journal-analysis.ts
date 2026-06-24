import type { JournalAnalysisScenario } from "@/lib/trader-readiness/types"

export const JOURNAL_ANALYSIS_SCENARIOS: JournalAnalysisScenario[] = [
  {
    id: "ja-1",
    title: "Week of overtrading",
    entries: [
      {
        id: "j1",
        date: "Mon",
        setup: "Breakout long",
        result: "-1R",
        notes: "Entered late, chased price",
        mistake: "FOMO",
      },
      {
        id: "j2",
        date: "Mon",
        setup: "Pullback long",
        result: "-1R",
        notes: "Revenge trade after morning loss",
        mistake: "Revenge trading",
      },
      {
        id: "j3",
        date: "Tue",
        setup: "Range fade",
        result: "-0.5R",
        notes: "No clear trend, forced trade",
        mistake: "Overtrading",
      },
      {
        id: "j4",
        date: "Wed",
        setup: "Trend continuation",
        result: "+2R",
        notes: "Clean setup, followed plan",
      },
      {
        id: "j5",
        date: "Thu",
        setup: "Breakout long",
        result: "-1R",
        notes: "Took 4th trade of the day, tired",
        mistake: "Overtrading",
      },
    ],
    correctMistakes: [
      "Overtrading",
      "Revenge trading",
      "FOMO",
      "Poor risk-reward",
      "Ignoring trend",
    ],
    correctPatterns: [
      "Multiple trades per day beyond plan",
      "Losses followed by immediate re-entry",
      "Chasing price on breakouts",
    ],
    improvementAreas: [
      "Set max trades per day (e.g. 2)",
      "Mandatory 30-min break after 2 consecutive losses",
      "Only trade A+ setups from the watchlist",
    ],
    explanation:
      "This trader's only winner came from a planned trend continuation. All losses share a pattern: impulsive entries outside the plan.",
  },
]

export function getJournalAnalysisScenario(
  id?: string
): JournalAnalysisScenario {
  return (
    JOURNAL_ANALYSIS_SCENARIOS.find((s) => s.id === id) ??
    JOURNAL_ANALYSIS_SCENARIOS[0]
  )
}

export const JOURNAL_MISTAKE_OPTIONS = [
  "Overtrading",
  "Revenge trading",
  "FOMO",
  "Poor risk-reward",
  "Ignoring trend",
  "Moving stops",
  "Taking profits early",
]

export const JOURNAL_PATTERN_OPTIONS = [
  "Multiple trades per day beyond plan",
  "Losses followed by immediate re-entry",
  "Chasing price on breakouts",
  "Trading outside planned hours",
  "Increasing size after losses",
]
