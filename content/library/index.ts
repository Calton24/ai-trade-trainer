import {
  BOOK_LAB_SECTIONS,
  BOOK_LAB_DISCLAIMER,
} from "@/content/book-lab"
import { DEFAULT_BOOK_ID } from "@/content/book-lab/concept-builder"
import { TRADING_IN_THE_ZONE_SECTIONS } from "@/content/library/trading-in-the-zone"
import { TRADING_IN_THE_ZONE_BOOK_ID } from "@/content/library/trading-in-the-zone/build"
import type {
  BookLabConcept,
  BookLabSection,
  LibraryBook,
} from "@/lib/book-lab/types"

export const LIBRARY_DISCLAIMER = BOOK_LAB_DISCLAIMER

function sumMinutes(sections: BookLabSection[]): number {
  return sections.reduce(
    (total, s) =>
      total + s.concepts.reduce((m, c) => m + c.estimatedMinutes, 0),
    0
  )
}

const DAY_TRADING_BOOK: LibraryBook = {
  id: DEFAULT_BOOK_ID,
  slug: "day-trading-for-a-living",
  title: "How to Day Trade for a Living",
  author: "Andrew Aziz",
  category: "Day Trading",
  assetType: "book",
  cover: "📘",
  coverGradient: "from-sky-500/25 via-blue-500/10 to-transparent",
  description:
    "An interactive companion to the mechanics of day trading — tools, stocks in play, risk management, strategies, execution, and review.",
  theme: "Mastering the mechanics of day trading.",
  difficulty: "beginner",
  estimatedHours: Math.max(1, Math.round(sumMinutes(BOOK_LAB_SECTIONS) / 60)),
  sections: BOOK_LAB_SECTIONS,
}

const TRADING_IN_THE_ZONE_BOOK: LibraryBook = {
  id: TRADING_IN_THE_ZONE_BOOK_ID,
  slug: "trading-in-the-zone",
  title: "Trading in the Zone",
  author: "Mark Douglas",
  category: "Trading Psychology",
  assetType: "book",
  cover: "📗",
  coverGradient: "from-emerald-500/25 via-green-500/10 to-transparent",
  description:
    "Master the mental side of trading: probabilities, beliefs, discipline, and the consistent, fear-free mindset of a professional.",
  theme: "Mastering the mental side of trading.",
  difficulty: "intermediate",
  estimatedHours: Math.max(
    1,
    Math.round(sumMinutes(TRADING_IN_THE_ZONE_SECTIONS) / 60)
  ),
  sections: TRADING_IN_THE_ZONE_SECTIONS,
}

/**
 * Registry of every learning asset in the Trading Library. Add a new book by
 * appending its `LibraryBook` object here — no page or component changes needed.
 */
export const LIBRARY_BOOKS: LibraryBook[] = [
  DAY_TRADING_BOOK,
  TRADING_IN_THE_ZONE_BOOK,
]

const BOOK_BY_SLUG = new Map(LIBRARY_BOOKS.map((b) => [b.slug, b]))
const BOOK_BY_ID = new Map(LIBRARY_BOOKS.map((b) => [b.id, b]))

const ALL_CONCEPTS: BookLabConcept[] = LIBRARY_BOOKS.flatMap((b) =>
  b.sections.flatMap((s) => s.concepts)
)
const CONCEPT_BY_ID = new Map(ALL_CONCEPTS.map((c) => [c.id, c]))

export function getAllBooks(): LibraryBook[] {
  return LIBRARY_BOOKS
}

export function getBook(slug: string): LibraryBook | undefined {
  return BOOK_BY_SLUG.get(slug)
}

export function getBookById(id: string): LibraryBook | undefined {
  return BOOK_BY_ID.get(id)
}

export function getAllLibraryConcepts(): BookLabConcept[] {
  return ALL_CONCEPTS
}

export function getLibraryConceptById(id: string): BookLabConcept | undefined {
  return CONCEPT_BY_ID.get(id)
}

export function getBookConcepts(bookId: string): BookLabConcept[] {
  const book = BOOK_BY_ID.get(bookId)
  if (!book) return []
  return book.sections.flatMap((s) => s.concepts)
}

export function getBookForConceptId(id: string): LibraryBook | undefined {
  const concept = CONCEPT_BY_ID.get(id)
  return concept ? BOOK_BY_ID.get(concept.bookId) : undefined
}

export function getBookForConcept(concept: BookLabConcept): LibraryBook | undefined {
  return BOOK_BY_ID.get(concept.bookId)
}

/** Resolve a concept within a specific book by its slug. */
export function getLibraryConcept(
  bookSlug: string,
  conceptSlug: string
): { book: LibraryBook; concept: BookLabConcept } | undefined {
  const book = BOOK_BY_SLUG.get(bookSlug)
  if (!book) return undefined
  const concept = book.sections
    .flatMap((s) => s.concepts)
    .find((c) => c.slug === conceptSlug)
  if (!concept) return undefined
  return { book, concept }
}

export function getSectionForConcept(
  concept: BookLabConcept
): BookLabSection | undefined {
  const book = BOOK_BY_ID.get(concept.bookId)
  return book?.sections.find((s) => s.id === concept.sectionId)
}

export function getRelatedConcepts(concept: BookLabConcept): BookLabConcept[] {
  const bookConcepts = getBookConcepts(concept.bookId)
  return concept.relatedConceptSlugs
    .map((slug) => bookConcepts.find((c) => c.slug === slug))
    .filter((c): c is BookLabConcept => c !== undefined)
}

/** First incomplete concept in a book (linear section order). */
export function getRecommendedConceptSlug(
  bookId: string,
  completedIds: string[]
): string | null {
  const completed = new Set(completedIds)
  const next = getBookConcepts(bookId).find((c) => !completed.has(c.id))
  return next?.slug ?? null
}

/**
 * The canonical route to a concept within the library, e.g.
 * `/library/trading-in-the-zone/why-most-traders-lose`.
 */
export function getConceptHref(concept: BookLabConcept): string {
  const book = BOOK_BY_ID.get(concept.bookId)
  return `/library/${book?.slug ?? "day-trading-for-a-living"}/${concept.slug}`
}

export function getBookHref(book: LibraryBook): string {
  return `/library/${book.slug}`
}

/**
 * Resolve a legacy `/book-lab/[conceptSlug]` slug to its canonical library
 * href. Prefers the day-trading book (where all legacy links originated).
 */
export function findConceptHrefBySlug(conceptSlug: string): string | null {
  const preferred = getLibraryConcept("day-trading-for-a-living", conceptSlug)
  if (preferred) return getConceptHref(preferred.concept)
  const match = ALL_CONCEPTS.find((c) => c.slug === conceptSlug)
  return match ? getConceptHref(match) : null
}

export interface BookSectionStats {
  conceptCount: number
  completedCount: number
  progressPercent: number
  estimatedMinutes: number
  quizCount: number
  drillCount: number
}

export function getLibrarySectionStats(
  section: BookLabSection,
  completedIds: string[]
): BookSectionStats {
  const total = section.concepts.length
  const done = section.concepts.filter((c) =>
    completedIds.includes(c.id)
  ).length
  const minutes = section.concepts.reduce(
    (sum, c) => sum + c.estimatedMinutes,
    0
  )
  const quizzes = section.concepts.reduce(
    (sum, c) => sum + c.quizQuestions.length,
    0
  )
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
