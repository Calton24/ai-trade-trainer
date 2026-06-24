
export type LearningNodeType =
  | "stage"
  | "lesson"
  | "quiz"
  | "chart-drill"
  | "flashcard-deck"
  | "strategy"
  | "book-concept"
  | "trend-lesson"
  | "challenge"
  | "journal"
  | "feature"

export type LearningLevel =
  | "beginner"
  | "beginner-plus"
  | "intermediate"
  | "advanced"

export type StageType =
  | "foundation"
  | "visual"
  | "practice"
  | "strategy"
  | "psychology"
  | "mastery"

export type AccessLevel = "unlocked" | "preview" | "locked"

export interface LearningNode {
  id: string
  slug: string
  title: string
  type: LearningNodeType
  level: LearningLevel
  /** Registry id: lesson id, quiz id, concept id, etc. */
  refId?: string
  href: string
  prerequisites: string[]
  unlocks: string[]
  xpReward: number
  stageId?: string
  previewHref?: string
}

export interface LearningStage {
  id: string
  slug: string
  title: string
  description: string
  order: number
  level: LearningLevel
  stageType: StageType
  prerequisiteStageIds: string[]
  requiredNodeIds: string[]
  optionalNodeIds: string[]
  unlockNodeIds: string[]
  unlockFeatureIds: string[]
  skillsGained: string[]
  estimatedMinutes: number
  href: string
}

export interface StageProgress {
  stageId: string
  completedCount: number
  totalRequired: number
  progressPercent: number
  status: "locked" | "unlocked" | "in_progress" | "completed"
  accessLevel: AccessLevel
}

export interface LearningMapStats {
  currentStageId: string | null
  currentStageTitle: string | null
  currentStageOrder: number
  totalStages: number
  stagesCompleted: number
  foundationComplete: boolean
  foundationProgressPercent: number
  nextActionTitle: string
  nextActionHref: string
  nextActionReason: string
  nextLockedStageTitle: string | null
  nextUnlockPreview: string | null
  recentlyUnlocked: string[]
}

import type { StoredLearningMapState } from "@/lib/user-state/types"

export type { StoredLearningMapState }

export interface LockInfo {
  accessLevel: AccessLevel
  reason: string
  missingPrerequisites: { id: string; title: string; href: string }[]
  previewHref?: string
  ctaHref?: string
}
