import {
  getAllBooks,
  getAllLibraryConcepts,
  getBookById,
  getBookConcepts,
  getRecommendedConceptSlug,
  getSectionForConcept,
} from "@/content/library"
import { getLibraryConceptById } from "@/content/library"
import type {
  LibraryBook,
  LibraryBookStats,
  LibraryStats,
} from "@/lib/book-lab/types"

import type { UserState } from "./types"

/** Concept ids that belong to a given book. */
function bookConceptIdSet(bookId: string): Set<string> {
  return new Set(getBookConcepts(bookId).map((c) => c.id))
}

export function computeLibraryBookStats(
  state: UserState,
  bookId: string
): LibraryBookStats {
  const book = getBookById(bookId)
  const concepts = getBookConcepts(bookId)
  const ids = bookConceptIdSet(bookId)
  const completedIds = state.bookLab.completedConceptIds.filter((id) =>
    ids.has(id)
  )
  const completedSet = new Set(completedIds)

  const total = concepts.length
  const completedCount = completedIds.length

  const xpEarned = concepts
    .filter((c) => completedSet.has(c.id))
    .reduce((sum, c) => sum + c.xpReward, 0)

  const quizScores = state.bookLab.quizAttempts
    .filter((a) => ids.has(a.conceptId))
    .map((a) => a.score)
  const quizAverage =
    quizScores.length > 0
      ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
      : 0

  const notes = state.bookLab.reflections.filter((r) =>
    ids.has(r.conceptId)
  ).length

  const nextSlug = getRecommendedConceptSlug(bookId, completedIds)
  const nextConcept = concepts.find((c) => c.slug === nextSlug)

  let currentSectionTitle: string | null =
    book?.sections[0]?.title ?? null
  for (let i = completedIds.length - 1; i >= 0; i--) {
    const concept = getLibraryConceptById(completedIds[i])
    if (concept && concept.bookId === bookId) {
      currentSectionTitle =
        getSectionForConcept(concept)?.title ?? currentSectionTitle
      break
    }
  }

  return {
    bookId,
    conceptsCompleted: completedCount,
    totalConcepts: total,
    progressPercent: total > 0 ? Math.round((completedCount / total) * 100) : 0,
    xpEarned,
    quizAverage,
    bookmarks: 0,
    notes,
    completed: total > 0 && completedCount === total,
    nextConceptSlug: nextConcept?.slug ?? null,
    nextConceptTitle: nextConcept?.title ?? null,
    currentSectionTitle,
  }
}

export function computeAllLibraryBookStats(
  state: UserState
): Record<string, LibraryBookStats> {
  const result: Record<string, LibraryBookStats> = {}
  for (const book of getAllBooks()) {
    result[book.id] = computeLibraryBookStats(state, book.id)
  }
  return result
}

export function computeLibraryStats(state: UserState): LibraryStats {
  const books = getAllBooks()
  const allConcepts = getAllLibraryConcepts()
  const allIds = new Set(allConcepts.map((c) => c.id))

  const perBook = books.map((book) => computeLibraryBookStats(state, book.id))
  const booksCompleted = perBook.filter((b) => b.completed).length

  const completedInLibrary = state.bookLab.completedConceptIds.filter((id) =>
    allIds.has(id)
  )
  const completedSet = new Set(completedInLibrary)
  const lessonsCompleted = completedInLibrary.length
  const totalLessons = allConcepts.length

  const quizScores = state.bookLab.quizAttempts
    .filter((a) => allIds.has(a.conceptId))
    .map((a) => a.score)
  const averageQuizScore =
    quizScores.length > 0
      ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
      : 0

  const completedMinutes = allConcepts
    .filter((c) => completedSet.has(c.id))
    .reduce((sum, c) => sum + c.estimatedMinutes, 0)

  return {
    booksOwned: books.length,
    booksCompleted,
    lessonsCompleted,
    totalLessons,
    totalXP: state.bookLab.bookLabXP,
    averageQuizScore,
    readingProgressPercent:
      totalLessons > 0
        ? Math.round((lessonsCompleted / totalLessons) * 100)
        : 0,
    estimatedReadingHours: Math.round((completedMinutes / 60) * 10) / 10,
  }
}

export function getLibraryBook(bookId: string): LibraryBook | undefined {
  return getBookById(bookId)
}
