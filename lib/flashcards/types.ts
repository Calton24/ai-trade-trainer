import type { Difficulty } from "@/lib/types"

export type FlashcardType =
  | "basic"
  | "multiple-choice"
  | "true-false"
  | "scenario"
  | "chart"
  | "interactive-chart"

export type FlashcardSource =
  | "paths"
  | "book-lab"
  | "chart-lab"
  | "quiz"
  | "flashcards"
  | "trend-spotter"

export type FlashcardConfidence = "missed" | "nearly" | "got_it"

export interface FlashcardDeck {
  id: string
  slug: string
  title: string
  description: string
  category: string
  difficulty: Difficulty
  cardIds: string[]
}

export interface Flashcard {
  id: string
  deckId: string
  conceptId?: string
  source: FlashcardSource
  type: FlashcardType
  front: string
  back: string
  explanation: string
  options?: { id: string; text: string }[]
  correctAnswer?: string
  chartScenarioId?: string
  interactiveTask?: string
  tags: string[]
  difficulty: Difficulty
  xpReward: number
  relatedConcept?: string
}

export interface FlashcardProgress {
  cardId: string
  timesSeen: number
  timesCorrect: number
  lastReviewedAt: string | null
  nextReviewAt: string | null
  confidence: FlashcardConfidence | null
  mastered: boolean
}

export interface StoredFlashcardSession {
  id: string
  deckId: string
  mode: string
  cardsReviewed: number
  gotIt: number
  nearly: number
  missed: number
  score: number
  xpEarned: number
  completedAt: string
}

export interface StoredFlashcardState {
  cardProgress: Record<string, FlashcardProgress>
  sessions: StoredFlashcardSession[]
  totalCardsReviewed: number
}

export interface FlashcardStats {
  totalCards: number
  masteredCount: number
  dueCount: number
  weakCount: number
  sessionsCompleted: number
  totalReviewed: number
}

export function getInitialFlashcardState(): StoredFlashcardState {
  return {
    cardProgress: {},
    sessions: [],
    totalCardsReviewed: 0,
  }
}
