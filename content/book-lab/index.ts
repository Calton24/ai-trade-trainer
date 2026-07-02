import { dayTradingFoundationsConcepts } from "@/content/book-lab/concepts/day-trading-foundations"
import { toolsAndMarketAccessConcepts } from "@/content/book-lab/concepts/tools-and-market-access"
import { stocksInPlayConcepts } from "@/content/book-lab/concepts/stocks-in-play"
import { riskMoneyManagementConcepts } from "@/content/book-lab/concepts/risk-money-management"
import { tradePlanningConcepts } from "@/content/book-lab/concepts/trade-planning"
import { coreStrategiesConcepts } from "@/content/book-lab/concepts/core-strategies"
import { executionConcepts } from "@/content/book-lab/concepts/execution"
import { psychologyDisciplineConcepts } from "@/content/book-lab/concepts/psychology-discipline"
import { journalingReviewConcepts } from "@/content/book-lab/concepts/journaling-review"
import type { BookLabConcept, BookLabSection } from "@/lib/book-lab/types"
import { DEFAULT_BOOK_ID } from "@/content/book-lab/concept-builder"

export const BOOK_LAB_DISCLAIMER =
  "This is an original educational companion inspired by widely taught trading concepts. It does not reproduce copyrighted book content and does not provide financial advice, trading signals, live recommendations, or profit guarantees."

const SECTION_DEFS: Omit<BookLabSection, "concepts" | "bookId">[] = [
  {
    id: "bl-day-trading-foundations",
    slug: "day-trading-foundations",
    title: "Day Trading Foundations",
    description: "What day trading is, how it differs from investing, and why discipline beats prediction.",
    order: 1,
  },
  {
    id: "bl-tools-and-market-access",
    slug: "tools-and-market-access",
    title: "Tools & Market Access",
    description: "Brokers, platforms, charts, Level 2, and why tools never replace skill.",
    order: 2,
  },
  {
    id: "bl-stocks-in-play",
    slug: "stocks-in-play",
    title: "Stocks In Play / Market Selection",
    description: "Finding active names with volume, catalysts, and liquidity.",
    order: 3,
  },
  {
    id: "bl-risk-money-management",
    slug: "risk-money-management",
    title: "Risk & Money Management",
    description: "Risk per trade, stops, targets, sizing, and protecting the account.",
    order: 4,
  },
  {
    id: "bl-trade-planning",
    slug: "trade-planning",
    title: "Trade Planning",
    description: "Pre-market prep, watchlists, entries, exits, and confirmation.",
    order: 5,
  },
  {
    id: "bl-core-strategies",
    slug: "core-strategies",
    title: "Core Day Trading Strategies",
    description: "Momentum, flags, VWAP, support/resistance, and breakouts.",
    order: 6,
  },
  {
    id: "bl-execution",
    slug: "execution",
    title: "Trade Execution",
    description: "Entries, scaling, partials, stops, and avoiding chase.",
    order: 7,
  },
  {
    id: "bl-psychology-discipline",
    slug: "psychology-discipline",
    title: "Psychology & Discipline",
    description: "FOMO, revenge trading, consistency, and honest review.",
    order: 8,
  },
  {
    id: "bl-journaling-review",
    slug: "journaling-review",
    title: "Journaling & Review",
    description: "Recording trades, tagging mistakes, and measuring setups.",
    order: 9,
  },
]

const CONCEPTS_BY_SECTION: Record<string, BookLabConcept[]> = {
  "bl-day-trading-foundations": dayTradingFoundationsConcepts,
  "bl-tools-and-market-access": toolsAndMarketAccessConcepts,
  "bl-stocks-in-play": stocksInPlayConcepts,
  "bl-risk-money-management": riskMoneyManagementConcepts,
  "bl-trade-planning": tradePlanningConcepts,
  "bl-core-strategies": coreStrategiesConcepts,
  "bl-execution": executionConcepts,
  "bl-psychology-discipline": psychologyDisciplineConcepts,
  "bl-journaling-review": journalingReviewConcepts,
}

export const BOOK_LAB_SECTIONS: BookLabSection[] = SECTION_DEFS.map((s) => ({
  ...s,
  bookId: DEFAULT_BOOK_ID,
  concepts: CONCEPTS_BY_SECTION[s.id] ?? [],
}))

const ALL_CONCEPTS = BOOK_LAB_SECTIONS.flatMap((s) => s.concepts)
const CONCEPT_MAP = new Map(ALL_CONCEPTS.map((c) => [c.slug, c]))
const CONCEPT_ID_MAP = new Map(ALL_CONCEPTS.map((c) => [c.id, c]))

export function getAllBookLabSections(): BookLabSection[] {
  return BOOK_LAB_SECTIONS
}

export function getBookLabSection(slug: string): BookLabSection | undefined {
  return BOOK_LAB_SECTIONS.find((s) => s.slug === slug)
}

export function getAllBookLabConcepts(): BookLabConcept[] {
  return ALL_CONCEPTS
}

export function getBookLabConcept(slug: string): BookLabConcept | undefined {
  return CONCEPT_MAP.get(slug)
}

export function getBookLabConceptById(id: string): BookLabConcept | undefined {
  return CONCEPT_ID_MAP.get(id)
}

export function getBookLabSectionForConcept(
  concept: BookLabConcept
): BookLabSection | undefined {
  return BOOK_LAB_SECTIONS.find((s) => s.id === concept.sectionId)
}

export function getRelatedBookLabConcepts(
  concept: BookLabConcept
): BookLabConcept[] {
  return concept.relatedConceptSlugs
    .map((slug) => getBookLabConcept(slug))
    .filter((c): c is BookLabConcept => c !== undefined)
}

export function getRecommendedBookConceptSlug(
  completedIds: string[]
): string {
  const completed = new Set(completedIds)
  const next = ALL_CONCEPTS.find((c) => !completed.has(c.id))
  return next?.slug ?? ALL_CONCEPTS[0]?.slug ?? "what-is-day-trading"
}

export function getBookLabConceptProgress(
  concept: BookLabConcept,
  completedIds: string[]
): number {
  if (completedIds.includes(concept.id)) return 100
  return 0
}

export function getBookLabSectionStats(section: BookLabSection, completedIds: string[]) {
  const total = section.concepts.length
  const done = section.concepts.filter((c) => completedIds.includes(c.id)).length
  const minutes = section.concepts.reduce((sum, c) => sum + c.estimatedMinutes, 0)
  const quizzes = section.concepts.reduce((sum, c) => sum + c.quizQuestions.length, 0)
  const drills = section.concepts.filter(
    (c) => c.practiceDrill || c.chartPracticeId
  ).length
  return {
    conceptCount: total,
    completedCount: done,
    progressPercent: total > 0 ? Math.round((done / total) * 100) : 0,
    estimatedMinutes: minutes,
    quizCount: quizzes,
    drillCount: drills,
  }
}
