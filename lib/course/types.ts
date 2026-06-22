export type CourseLevel = "beginner" | "intermediate" | "advanced"

export type PathStatus = "available" | "preview" | "coming_soon"

export type LessonType =
  | "reading"
  | "interactive"
  | "quiz"
  | "chart-drill"
  | "reflection"

export type ContentBlockType =
  | "heading"
  | "paragraph"
  | "callout"
  | "example"
  | "definition"
  | "checklist"
  | "image"
  | "chart-example"
  | "interactive-question"
  | "summary"
  | "safety-note"

export type QuizQuestionType = "multiple-choice" | "true-false" | "scenario"

export type ChartDrillType =
  | "identify-support"
  | "identify-resistance"
  | "spot-trend"
  | "mark-break"
  | "mark-retest"
  | "entry-stop-target"
  | "icc-indication"
  | "icc-correction"
  | "icc-continuation"

export interface ContentBlock {
  id: string
  type: ContentBlockType
  content: string
  /** For definition: term. For callout: variant key idea | mistake | tip */
  metadata?: Record<string, string | string[]>
  estimatedReadTime?: number
}

export interface CourseQuizQuestion {
  id: string
  type: QuizQuestionType
  question: string
  options: { id: string; text: string }[]
  correctAnswer: string
  explanation: string
  beginnerHint?: string
  relatedConcept?: string
}

export interface CourseQuiz {
  id: string
  lessonId?: string
  pathId: string
  title: string
  description: string
  passingScore: number
  xpReward: number
  questions: CourseQuizQuestion[]
}

export interface ChartDrillScenario {
  pair: string
  timeframe: string
  description: string
}

export interface ChartDrill {
  id: string
  lessonId?: string
  pathId: string
  title: string
  drillType: ChartDrillType
  instructions: string
  chartScenario: ChartDrillScenario
  expectedAnswer: string
  scoringRubric: string[]
  feedbackTemplates: {
    strong: string
    weak: string
    hint: string
  }
  /** Maps to legacy DrillType for API */
  legacyDrillType?: string
  xpReward: number
}

export interface CourseLesson {
  id: string
  moduleId: string
  pathId: string
  slug: string
  title: string
  description: string
  lessonType: LessonType
  difficulty: CourseLevel
  order: number
  xpReward: number
  prerequisites: string[]
  contentBlocks: ContentBlock[]
  quizId?: string
  drillId?: string
  reflectionPrompt?: string
  /** Calculated at registry build time */
  estimatedMinutes: number
}

export interface CourseModule {
  id: string
  pathId: string
  title: string
  description: string
  order: number
  lessons: CourseLesson[]
  /** Calculated at registry build time */
  estimatedMinutes: number
}

export interface LearningPathContent {
  id: string
  slug: string
  title: string
  description: string
  level: CourseLevel
  category: string
  order: number
  isFree: boolean
  status: PathStatus
  locked: boolean
  skillsYouGain: string[]
  whatYouLearn: string[]
  relatedPathSlugs: string[]
  modules: CourseModule[]
  /** Calculated at registry build time */
  estimatedMinutes: number
  stats: PathContentStats
}

export interface PathContentStats {
  moduleCount: number
  lessonCount: number
  quizCount: number
  drillCount: number
  reflectionCount: number
}

export interface PathCardData {
  id: string
  slug: string
  title: string
  description: string
  level: CourseLevel
  status: PathStatus
  locked: boolean
  estimatedMinutes: number
  estimatedTimeLabel: string
  stats: PathContentStats
  progressPercent: number
  skillsYouGain: string[]
  whatYouLearn: string[]
  relatedPathSlugs: string[]
}

export interface SyllabusLessonItem {
  lesson: CourseLesson
  module: CourseModule
  href: string
  completed: boolean
  unlocked: boolean
  ctaLabel: string
}
