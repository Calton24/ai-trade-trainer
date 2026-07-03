import {
  getAllLibraryConcepts,
  getLibraryConceptById,
  getSectionForConcept,
} from "@/content/library"
import type { BookLabStats } from "@/lib/book-lab/types"
import type { JournalEntry } from "@/lib/types"

import type {
  StoredBookLabProgress,
  StoredBookPracticeDrill,
  StoredBookQuizAttempt,
  StoredBookReflection,
  UserState,
} from "./types"
import { recordLearningActivity } from "./activity"

export function isBookConceptCompleted(
  state: UserState,
  conceptId: string
): boolean {
  return state.bookLab.completedConceptIds.includes(conceptId)
}

export function completeBookConcept(
  state: UserState,
  conceptId: string,
  xpReward = 25
): UserState {
  if (state.bookLab.completedConceptIds.includes(conceptId)) return state

  const concept = getLibraryConceptById(conceptId)
  const xp = concept?.xpReward ?? xpReward

  let next: UserState = {
    ...state,
    bookLab: {
      ...state.bookLab,
      completedConceptIds: [...state.bookLab.completedConceptIds, conceptId],
      bookLabXP: state.bookLab.bookLabXP + xp,
    },
  }

  const { state: withActivity } = recordLearningActivity(next, {
    type: "book-concept-complete",
    source: "book-lab",
    title: concept?.title ?? "Book Lab concept",
    entityId: conceptId,
    xpAwarded: xp,
  })

  return withActivity
}

export function recordBookQuizAttempt(
  state: UserState,
  attempt: Omit<StoredBookQuizAttempt, "id" | "completedAt">,
  markCompleteOnPass = true
): UserState {
  let next: UserState = {
    ...state,
    bookLab: {
      ...state.bookLab,
      quizAttempts: [
        ...state.bookLab.quizAttempts,
        {
          ...attempt,
          id: crypto.randomUUID(),
          completedAt: new Date().toISOString(),
        },
      ],
    },
  }

  if (markCompleteOnPass && attempt.passed) {
    next = completeBookConcept(next, attempt.conceptId, 0)
  } else {
    const concept = getLibraryConceptById(attempt.conceptId)
    const { state: withActivity } = recordLearningActivity(next, {
      type: "quiz-complete",
      source: "book-lab",
      title: `${concept?.title ?? "Concept"} quiz`,
      entityId: attempt.conceptId,
      xpAwarded: 0,
      score: attempt.score,
    })
    next = withActivity
  }

  return next
}

export function recordBookPracticeDrill(
  state: UserState,
  drill: Omit<StoredBookPracticeDrill, "id" | "completedAt">,
  markComplete = true
): UserState {
  let next: UserState = {
    ...state,
    bookLab: {
      ...state.bookLab,
      practiceDrills: [
        ...state.bookLab.practiceDrills,
        {
          ...drill,
          id: crypto.randomUUID(),
          completedAt: new Date().toISOString(),
        },
      ],
    },
  }

  if (markComplete && drill.score >= 60) {
    next = completeBookConcept(next, drill.conceptId, 0)
  } else {
    const concept = getLibraryConceptById(drill.conceptId)
    const { state: withActivity } = recordLearningActivity(next, {
      type: "practice-complete",
      source: "book-lab",
      title: `${concept?.title ?? "Concept"} practice`,
      entityId: drill.drillId,
      xpAwarded: 0,
    })
    next = withActivity
  }

  return next
}

export function saveBookReflection(
  state: UserState,
  reflection: Omit<StoredBookReflection, "id" | "completedAt">,
  journalEntry?: Omit<JournalEntry, "id" | "createdAt">
): UserState {
  let next: UserState = {
    ...state,
    bookLab: {
      ...state.bookLab,
      reflections: [
        ...state.bookLab.reflections,
        {
          ...reflection,
          id: crypto.randomUUID(),
          completedAt: new Date().toISOString(),
        },
      ],
    },
  }

  next = completeBookConcept(next, reflection.conceptId, 10)

  if (journalEntry) {
    next = {
      ...next,
      journalEntries: [
        {
          ...journalEntry,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        },
        ...next.journalEntries,
      ],
    }
  }

  return next
}

export function computeBookLabStats(state: UserState): BookLabStats {
  const all = getAllLibraryConcepts()
  const completed = state.bookLab.completedConceptIds
  const completedSet = new Set(completed)

  const quizScores = state.bookLab.quizAttempts.map((a) => a.score)
  const quizAverage =
    quizScores.length > 0
      ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
      : 0

  const nextConcept = all.find((c) => !completedSet.has(c.id))

  let currentSectionTitle = "Trading Library"
  if (completed.length > 0) {
    const lastCompleted = getLibraryConceptById(completed[completed.length - 1])
    if (lastCompleted) {
      currentSectionTitle =
        getSectionForConcept(lastCompleted)?.title ?? currentSectionTitle
    }
  }

  return {
    conceptsCompleted: completed.length,
    totalConcepts: all.length,
    currentSectionTitle,
    nextConceptSlug: nextConcept?.slug ?? null,
    nextConceptTitle: nextConcept?.title ?? null,
    quizAverage,
    practiceDrillsCompleted: state.bookLab.practiceDrills.length,
    bookLabXP: state.bookLab.bookLabXP,
  }
}

export function getBookLabConceptProgressPercent(
  state: UserState,
  conceptId: string
): number {
  return isBookConceptCompleted(state, conceptId) ? 100 : 0
}

export function getInitialBookLabFromState(
  bookLab?: StoredBookLabProgress
): StoredBookLabProgress {
  return (
    bookLab ?? {
      completedConceptIds: [],
      quizAttempts: [],
      practiceDrills: [],
      reflections: [],
      bookLabXP: 0,
    }
  )
}
