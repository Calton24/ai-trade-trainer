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
  concepts: BookLabConcept[]
}

export interface BookLabConcept {
  id: string
  slug: string
  sectionId: string
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
