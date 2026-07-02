import type {
  BookLabConcept,
  BookLabContentBlock,
  BookLabPracticeDrill,
  BookLabQuizQuestion,
} from "@/lib/book-lab/types"
import type { Difficulty } from "@/lib/types"

export interface ConceptInput {
  slug: string
  sectionId: string
  title: string
  summary: string
  difficulty?: Difficulty
  explanation: string
  whyMatters: string
  commonMistake: string
  chartDemoId?: string
  chartPracticeId?: string
  practiceDrill?: Omit<BookLabPracticeDrill, "id">
  quizQuestions: Omit<BookLabQuizQuestion, "id">[]
  reflectionPrompt: string
  relatedConceptSlugs?: string[]
}

/** Default read-only chart demos for concepts that don't set chartDemoId explicitly. */
const SLUG_CHART_DEMOS: Partial<Record<string, string>> = {
  "relative-volume": "demo-relative-volume",
  "catalysts-and-news": "demo-breakout",
  gappers: "demo-breakout",
  float: "demo-trend-range",
  "price-range": "demo-trend-range",
  "volume-and-liquidity": "demo-bullish-bearish",
  "avoid-dead-charts": "demo-trend-range",
  "momentum-trading": "demo-bullish-bearish",
  "bull-flag": "demo-bull-flag",
  "reversal-trading": "demo-fakeout",
  "moving-average-trend": "demo-trend-range",
  "vwap-strategy": "demo-vwap-bounce",
  "support-resistance-strategy": "demo-support",
  "opening-range-breakout": "demo-opening-range",
  "high-of-day-breakout": "demo-breakout",
  "avoid-chasing": "demo-chasing-late-entry",
  "avoid-late-entries": "demo-chasing-late-entry",
  "reading-entry-candles": "demo-candlestick-anatomy",
  "wait-for-confirmation": "demo-break-retest",
  "trade-invalidation": "demo-fakeout",
  "fear-of-missing-out": "demo-chasing-late-entry",
  "revenge-trading": "demo-risk-reward",
  overtrading: "demo-trend-range",
  "screenshot-before-after": "demo-risk-reward",
  "tagging-mistakes": "demo-fakeout",
}

/** Interactive chart tasks matched to concept slugs when not set explicitly. */
const SLUG_CHART_PRACTICE: Partial<Record<string, string>> = {
  "stop-loss": "task-identify-support",
  "profit-target": "task-risk-reward",
  "position-sizing": "task-risk-reward",
  "risk-reward-ratio": "task-risk-reward",
  "good-vs-bad-stop": "task-risk-reward",
  "relative-volume": "task-mark-breakout",
  "catalysts-and-news": "task-mark-breakout",
  gappers: "task-mark-breakout",
  float: "task-spot-trend",
  "price-range": "task-spot-trend",
  "volume-and-liquidity": "task-identify-support",
  "avoid-dead-charts": "task-spot-trend",
  "momentum-trading": "task-spot-trend",
  "bull-flag": "task-icc-bullish",
  "reversal-trading": "task-identify-resistance",
  "moving-average-trend": "task-spot-trend",
  "vwap-strategy": "task-identify-support",
  "support-resistance-strategy": "task-identify-support",
  "opening-range-breakout": "task-mark-breakout",
  "high-of-day-breakout": "task-mark-breakout",
  "wait-for-confirmation": "task-break-retest",
  "trade-invalidation": "task-identify-resistance",
  "avoid-chasing": "task-spot-trend",
  "avoid-late-entries": "task-spot-trend",
  "reading-entry-candles": "task-mark-swing-high",
  "partial-profits": "task-risk-reward",
  "scaling-in-out": "task-risk-reward",
  "entry-plan": "task-risk-reward",
  "exit-plan": "task-risk-reward",
  "stop-loss-plan": "task-risk-reward",
  "fear-of-missing-out": "task-spot-trend",
  "revenge-trading": "task-risk-reward",
  overtrading: "task-spot-trend",
  "screenshot-before-after": "task-risk-reward",
  "tagging-mistakes": "task-identify-resistance",
}

const DEMO_TO_PRACTICE: Partial<Record<string, string>> = {
  "demo-support": "task-identify-support",
  "demo-resistance": "task-identify-resistance",
  "demo-breakout": "task-mark-breakout",
  "demo-fakeout": "task-identify-resistance",
  "demo-risk-reward": "task-risk-reward",
  "demo-trend-range": "task-spot-trend",
  "demo-bull-flag": "task-icc-bullish",
  "demo-vwap-bounce": "task-identify-support",
  "demo-vwap-rejection": "task-identify-resistance",
  "demo-relative-volume": "task-mark-breakout",
  "demo-chasing-late-entry": "task-spot-trend",
  "demo-opening-range": "task-mark-breakout",
  "demo-break-retest": "task-break-retest",
  "demo-bullish-bearish": "task-spot-trend",
  "demo-icc-bullish": "task-icc-bullish",
}

export interface BuildConceptOptions {
  /** Prefix for the generated concept id (defaults to "bl"). */
  idPrefix?: string
  /** Library book this concept belongs to. */
  bookId?: string
  /** Skip the day-trading chart auto-mapping (for non-chart books). */
  disableChartDefaults?: boolean
}

export const DEFAULT_BOOK_ID = "day-trading-for-a-living"

export function buildConcept(
  input: ConceptInput,
  options: BuildConceptOptions = {}
): BookLabConcept {
  const idPrefix = options.idPrefix ?? "bl"
  const bookId = options.bookId ?? DEFAULT_BOOK_ID
  const id = `${idPrefix}-${input.slug}`
  const chartDemoId = options.disableChartDefaults
    ? input.chartDemoId
    : input.chartDemoId ?? SLUG_CHART_DEMOS[input.slug]
  const chartPracticeId = options.disableChartDefaults
    ? input.chartPracticeId
    : input.chartPracticeId ??
      SLUG_CHART_PRACTICE[input.slug] ??
      (chartDemoId ? DEMO_TO_PRACTICE[chartDemoId] : undefined)

  const quizQuestions: BookLabQuizQuestion[] = input.quizQuestions.map(
    (q, i) => ({
      ...q,
      id: `${id}-q${i + 1}`,
    })
  )

  const contentBlocks: BookLabContentBlock[] = [
    {
      type: "key-idea",
      heading: "Key idea",
      content: input.summary,
      variant: "idea",
    },
    { type: "text", heading: "Read", content: input.explanation },
    { type: "text", heading: "Why this matters", content: input.whyMatters },
    {
      type: "callout",
      heading: "Common beginner mistake",
      content: input.commonMistake,
      variant: "mistake",
    },
  ]

  const hasChart = Boolean(chartDemoId)
  const hasPractice = Boolean(chartPracticeId || input.practiceDrill)
  const readMinutes = Math.max(
    3,
    Math.ceil(
      (input.explanation.length + input.whyMatters.length) / 600
    )
  )
  const estimatedMinutes =
    readMinutes +
    quizQuestions.length +
    (hasChart ? 2 : 0) +
    (hasPractice ? 4 : 0)

  const practiceDrill = input.practiceDrill
    ? { ...input.practiceDrill, id: `${id}-practice` }
    : chartPracticeId
      ? {
          id: `${id}-practice`,
          type: "mark-entry" as const,
          title: "Chart practice",
          prompt:
            "Use the chart lab to mark what the concept describes, then submit for feedback.",
          chartScenarioId: chartPracticeId,
          correctFeedback:
            "Nice work — you applied the concept on a synthetic chart.",
          riskyFeedback: "Some marks were off. Review the hints and try again.",
          improvementTip:
            "Slow down and define your plan before placing markers.",
        }
      : {
          id: `${id}-practice`,
          type: "journal-idea" as const,
          title: "Apply this concept",
          prompt: input.reflectionPrompt,
          options: [
            {
              id: "ready",
              text: "I can explain this idea in my own words before my next session",
              correct: true,
              feedback:
                "Being able to explain a concept is the first step to trading it with discipline.",
            },
            {
              id: "review",
              text: "I need to re-read this concept before moving on",
              correct: false,
              feedback:
                "Take another pass through the explanation — rushing breeds random entries.",
            },
          ],
          correctFeedback:
            "Reflection builds the habit of thinking before clicking.",
          riskyFeedback:
            "Skipping reflection makes it easier to repeat the same mistakes.",
          improvementTip:
            "Write one sentence in your journal using your own words.",
        }

  return {
    id,
    slug: input.slug,
    sectionId: input.sectionId,
    bookId,
    title: input.title,
    summary: input.summary,
    difficulty: input.difficulty ?? "beginner",
    estimatedMinutes,
    xpReward: 25,
    explanation: input.explanation,
    whyMatters: input.whyMatters,
    commonMistake: input.commonMistake,
    contentBlocks,
    quizQuestions,
    chartDemoId,
    chartPracticeId,
    practiceDrill,
    reflectionPrompt: input.reflectionPrompt,
    relatedConceptSlugs: input.relatedConceptSlugs ?? [],
  }
}
