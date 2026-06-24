import { getAllFlashcards } from "@/content/flashcards"
import type {
  FlashcardConfidence,
  FlashcardStats,
  StoredFlashcardSession,
  StoredFlashcardState,
} from "@/lib/flashcards/types"
import { getInitialFlashcardState } from "@/lib/flashcards/types"
import { recordFlashcardAnswer } from "@/lib/flashcards/spaced-repetition"

import { recordLearningActivity } from "./activity"
import type { UserState } from "./types"

export type { StoredFlashcardSession, StoredFlashcardState }
export { getInitialFlashcardState }

export function recordFlashcardReview(
  state: UserState,
  cardId: string,
  confidence: FlashcardConfidence
): UserState {
  const existing = state.flashcards.cardProgress[cardId]
  const updated = recordFlashcardAnswer(existing, cardId, confidence)
  return {
    ...state,
    flashcards: {
      ...state.flashcards,
      cardProgress: {
        ...state.flashcards.cardProgress,
        [cardId]: updated,
      },
      totalCardsReviewed: state.flashcards.totalCardsReviewed + 1,
    },
  }
}

export function completeFlashcardSession(
  state: UserState,
  session: Omit<StoredFlashcardSession, "id" | "completedAt">
): { state: UserState; countsAsActivity: boolean } {
  const fullSession: StoredFlashcardSession = {
    ...session,
    id: crypto.randomUUID(),
    completedAt: new Date().toISOString(),
  }

  let next: UserState = {
    ...state,
    flashcards: {
      ...state.flashcards,
      sessions: [fullSession, ...state.flashcards.sessions].slice(0, 100),
    },
  }

  const countsAsActivity =
    session.cardsReviewed >= 5 || session.mode === "game10"

  if (countsAsActivity) {
    const { state: withActivity } = recordLearningActivity(next, {
      type: "flashcard-session",
      source: "flashcards",
      title: `Flashcard review (${session.gotIt}/${session.cardsReviewed})`,
      entityId: session.deckId,
      xpAwarded: session.xpEarned,
    })
    next = withActivity
  }

  return { state: next, countsAsActivity }
}

export function computeFlashcardStats(state: UserState): FlashcardStats {
  const all = getAllFlashcards()
  const progress = state.flashcards.cardProgress
  const now = new Date().toISOString()

  let dueCount = 0
  let weakCount = 0
  let masteredCount = 0

  for (const card of all) {
    const p = progress[card.id]
    if (p?.mastered) masteredCount++
    if (p && !p.mastered && p.nextReviewAt && p.nextReviewAt <= now) dueCount++
    if (p?.confidence === "missed" || p?.confidence === "nearly") weakCount++
  }

  return {
    totalCards: all.length,
    masteredCount,
    dueCount,
    weakCount,
    sessionsCompleted: state.flashcards.sessions.length,
    totalReviewed: state.flashcards.totalCardsReviewed,
  }
}
