import { foundationsConcepts } from "@/content/library/trading-in-the-zone/concepts/foundations"
import { beliefsMindsetConcepts } from "@/content/library/trading-in-the-zone/concepts/beliefs-mindset"
import { consistencyConcepts } from "@/content/library/trading-in-the-zone/concepts/consistency"
import { disciplineConcepts } from "@/content/library/trading-in-the-zone/concepts/discipline"
import { professionalThinkingConcepts } from "@/content/library/trading-in-the-zone/concepts/professional-thinking"
import { advancedPsychologyConcepts } from "@/content/library/trading-in-the-zone/concepts/advanced-psychology"
import { TRADING_IN_THE_ZONE_BOOK_ID } from "@/content/library/trading-in-the-zone/build"
import type { BookLabConcept, BookLabSection } from "@/lib/book-lab/types"

const SECTION_DEFS: Omit<BookLabSection, "concepts" | "bookId">[] = [
  {
    id: "tz-foundations",
    slug: "foundations",
    title: "Foundations",
    description:
      "Why most traders lose, the nature of uncertainty, and thinking in probabilities.",
    order: 1,
  },
  {
    id: "tz-beliefs-mindset",
    slug: "beliefs-mindset",
    title: "Beliefs & Mindset",
    description:
      "How beliefs shape decisions, and trading free of fear, hope, and emotional bias.",
    order: 2,
  },
  {
    id: "tz-consistency",
    slug: "consistency",
    title: "Consistency",
    description:
      "Trusting your edge, accepting random outcomes, and becoming process focused.",
    order: 3,
  },
  {
    id: "tz-discipline",
    slug: "discipline",
    title: "Discipline",
    description:
      "Following rules, avoiding impulse, and handling winning and losing streaks.",
    order: 4,
  },
  {
    id: "tz-professional-thinking",
    slug: "professional-thinking",
    title: "Professional Trader Thinking",
    description:
      "The Five Fundamental Truths, risk acceptance, and thinking like the house.",
    order: 5,
  },
  {
    id: "tz-advanced-psychology",
    slug: "advanced-psychology",
    title: "Advanced Psychology",
    description:
      "Flow state, self-awareness, removing ego, and becoming the consistent trader.",
    order: 6,
  },
]

const CONCEPTS_BY_SECTION: Record<string, BookLabConcept[]> = {
  "tz-foundations": foundationsConcepts,
  "tz-beliefs-mindset": beliefsMindsetConcepts,
  "tz-consistency": consistencyConcepts,
  "tz-discipline": disciplineConcepts,
  "tz-professional-thinking": professionalThinkingConcepts,
  "tz-advanced-psychology": advancedPsychologyConcepts,
}

export const TRADING_IN_THE_ZONE_SECTIONS: BookLabSection[] = SECTION_DEFS.map(
  (s) => ({
    ...s,
    bookId: TRADING_IN_THE_ZONE_BOOK_ID,
    concepts: CONCEPTS_BY_SECTION[s.id] ?? [],
  })
)
