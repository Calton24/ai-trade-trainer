import type {
  Flashcard,
  FlashcardSource,
  FlashcardType,
} from "@/lib/flashcards/types"
import type { Difficulty } from "@/lib/types"

interface BaseInput {
  deckId: string
  slug: string
  front: string
  back: string
  explanation: string
  tags?: string[]
  difficulty?: Difficulty
  source?: FlashcardSource
  conceptId?: string
  relatedConcept?: string
}

export function buildBasicCard(input: BaseInput): Flashcard {
  return {
    id: `fc-${input.deckId}-${input.slug}`,
    deckId: input.deckId,
    conceptId: input.conceptId,
    source: input.source ?? "flashcards",
    type: "basic",
    front: input.front,
    back: input.back,
    explanation: input.explanation,
    tags: input.tags ?? [],
    difficulty: input.difficulty ?? "beginner",
    xpReward: 5,
    relatedConcept: input.relatedConcept,
  }
}

export function buildMcCard(
  input: BaseInput & {
    options: { id: string; text: string }[]
    correctAnswer: string
  }
): Flashcard {
  return {
    ...buildBasicCard(input),
    type: "multiple-choice",
    options: input.options,
    correctAnswer: input.correctAnswer,
  }
}

export function buildTfCard(
  input: BaseInput & { correctAnswer: "true" | "false" }
): Flashcard {
  return {
    ...buildBasicCard(input),
    type: "true-false",
    correctAnswer: input.correctAnswer,
  }
}

export function buildScenarioCard(input: BaseInput): Flashcard {
  return { ...buildBasicCard(input), type: "scenario" }
}

export function buildChartCard(
  input: BaseInput & { chartScenarioId: string }
): Flashcard {
  return {
    ...buildBasicCard(input),
    type: "chart",
    chartScenarioId: input.chartScenarioId,
    source: "chart-lab",
  }
}

export function buildInteractiveChartCard(
  input: BaseInput & {
    chartScenarioId: string
    interactiveTask: string
  }
): Flashcard {
  return {
    ...buildBasicCard(input),
    type: "interactive-chart",
    chartScenarioId: input.chartScenarioId,
    interactiveTask: input.interactiveTask,
    source: "chart-lab",
    xpReward: 10,
  }
}
