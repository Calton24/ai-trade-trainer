import type { Difficulty } from "@/lib/types"

export type BookLabContentBlockType = "text" | "callout" | "key-idea"

export interface BookLabContentBlock {
  type: BookLabContentBlockType
  heading?: string
  content: string
  variant?: "mistake" | "tip" | "idea"
}

export interface BookLabQuizQuestion {
  id: string
  question: string
  options: { id: string; text: string }[]
  correctAnswer: string
  explanation: string
}

export interface BookLabPracticeDrill {
  id: string
  type:
    | "identify-setup"
    | "mark-entry"
    | "mark-stop"
    | "mark-target"
    | "risk-reward-check"
    | "in-play-check"
    | "spot-mistake"
    | "trade-or-skip"
    | "journal-idea"
  title: string
  prompt: string
  chartScenarioId?: string
  options?: { id: string; text: string; correct: boolean; feedback: string }[]
  correctFeedback: string
  riskyFeedback: string
  improvementTip: string
}

export interface BookLabSection {
  id: string
  slug: string
  title: string
  description: string
  order: number
  /** Which library book this section belongs to. */
  bookId: string
  concepts: BookLabConcept[]
}

export interface BookLabConcept {
  id: string
  slug: string
  sectionId: string
  /** Which library book this concept belongs to. */
  bookId: string
  title: string
  summary: string
  difficulty: Difficulty
  estimatedMinutes: number
  xpReward: number
  explanation: string
  whyMatters: string
  commonMistake: string
  contentBlocks: BookLabContentBlock[]
  quizQuestions: BookLabQuizQuestion[]
  chartDemoId?: string
  chartPracticeId?: string
  practiceDrill?: BookLabPracticeDrill
  reflectionPrompt: string
  relatedConceptSlugs: string[]
}

/** A learning asset in the Trading Library (book, paper, guide, etc.). */
export type LibraryAssetType =
  | "book"
  | "research-paper"
  | "psychology-guide"
  | "playbook"
  | "strategy-manual"
  | "course"
  | "case-study"

export interface LibraryBook {
  id: string
  slug: string
  title: string
  author: string
  category: string
  assetType: LibraryAssetType
  /** Emoji used as the cover placeholder. */
  cover: string
  /** Tailwind gradient classes for the cover background. */
  coverGradient: string
  description: string
  theme: string
  difficulty: Difficulty
  estimatedHours: number
  sections: BookLabSection[]
}

export interface LibraryBookStats {
  bookId: string
  conceptsCompleted: number
  totalConcepts: number
  progressPercent: number
  xpEarned: number
  quizAverage: number
  bookmarks: number
  notes: number
  completed: boolean
  nextConceptSlug: string | null
  nextConceptTitle: string | null
  currentSectionTitle: string | null
}

export interface LibraryStats {
  booksOwned: number
  booksCompleted: number
  lessonsCompleted: number
  totalLessons: number
  totalXP: number
  averageQuizScore: number
  readingProgressPercent: number
  estimatedReadingHours: number
}

export interface BookLabProgressSnapshot {
  completedConceptIds: string[]
  bookLabXP: number
}

export interface BookLabStats {
  conceptsCompleted: number
  totalConcepts: number
  currentSectionTitle: string
  nextConceptSlug: string | null
  nextConceptTitle: string | null
  quizAverage: number
  practiceDrillsCompleted: number
  bookLabXP: number
}
