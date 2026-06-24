import type {
  FlashcardConfidence,
  FlashcardProgress,
} from "@/lib/flashcards/types"

export function scheduleNextReview(
  confidence: FlashcardConfidence,
  timesCorrect: number,
  from = new Date()
): string {
  const d = new Date(from)
  if (confidence === "missed") {
    d.setHours(23, 59, 59, 999)
    return d.toISOString()
  }
  if (confidence === "nearly") {
    d.setDate(d.getDate() + 1)
    return d.toISOString()
  }
  if (timesCorrect >= 5) {
    d.setDate(d.getDate() + 14)
    return d.toISOString()
  }
  if (timesCorrect >= 3) {
    d.setDate(d.getDate() + 7)
    return d.toISOString()
  }
  d.setDate(d.getDate() + 3)
  return d.toISOString()
}

export function calculateFlashcardMastery(
  progress: FlashcardProgress
): boolean {
  return progress.timesCorrect >= 5 && progress.confidence === "got_it"
}

export function recordFlashcardAnswer(
  existing: FlashcardProgress | undefined,
  cardId: string,
  confidence: FlashcardConfidence
): FlashcardProgress {
  const timesSeen = (existing?.timesSeen ?? 0) + 1
  const timesCorrect =
    (existing?.timesCorrect ?? 0) + (confidence === "got_it" ? 1 : 0)
  const next: FlashcardProgress = {
    cardId,
    timesSeen,
    timesCorrect,
    lastReviewedAt: new Date().toISOString(),
    confidence,
    nextReviewAt: scheduleNextReview(confidence, timesCorrect),
    mastered: false,
  }
  next.mastered = calculateFlashcardMastery(next)
  return next
}

export function getFlashcardMasteryPercent(
  progress: Record<string, FlashcardProgress>,
  totalCards: number
): number {
  if (totalCards === 0) return 0
  const mastered = Object.values(progress).filter((p) => p.mastered).length
  return Math.round((mastered / totalCards) * 100)
}
