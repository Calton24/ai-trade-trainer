export type TradeMarkType =
  | "support"
  | "resistance"
  | "trend"
  | "break"
  | "retest"
  | "entry"
  | "stop_loss"
  | "take_profit"

export type DrillType =
  | "identify_support"
  | "identify_resistance"
  | "spot_trend"
  | "mark_break"
  | "mark_retest"
  | "place_entry_sl_tp"

export type Difficulty = "beginner" | "intermediate" | "advanced"

export type SyllabusItemType =
  | "lesson"
  | "quiz"
  | "drill"
  | "reflection"
  | "exercise"

export type QuizQuestionType =
  | "multiple_choice"
  | "true_false"
  | "scenario"
  | "best_answer"

export type TradeRecommendation = "take" | "skip"

export interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
}

export interface TradeMark {
  type: TradeMarkType
  price: number
  index: number
}

export interface LearningPath {
  id: string
  title: string
  description: string
  difficulty: Difficulty | "beginner-intermediate"
  estimatedHours: number
  moduleCount: number
  quizCount: number
  drillCount: number
  progressPercent: number
  locked: boolean
  skillsYouGain: string[]
  whatYouLearn: string[]
  relatedPathIds: string[]
}

export interface SyllabusItem {
  id: string
  pathId: string
  order: number
  title: string
  type: SyllabusItemType
  estimatedMinutes: number
  locked: boolean
  completed: boolean
  linkedId?: string
}

export interface QuizOption {
  id: string
  text: string
  correct: boolean
}

export interface QuizQuestion {
  id: string
  type?: QuizQuestionType
  question: string
  options: QuizOption[]
  explanation: string
  chartPlaceholder?: boolean
}

export interface Quiz {
  id: string
  pathId: string
  title: string
  description: string
  questions: QuizQuestion[]
  xpReward: number
  passingScore: number
}

export interface QuizResult {
  quizId: string
  score: number
  passed: boolean
  correctCount: number
  totalQuestions: number
  xpEarned: number
}

export interface Module {
  id: string
  order: number
  title: string
  description: string
  difficulty: Difficulty
  estimatedMinutes: number
  completionPercent: number
  locked: boolean
  lessonIds: string[]
  category?: string
}

export interface Lesson {
  id: string
  moduleId: string
  pathId?: string
  title: string
  subtitle: string
  difficulty: Difficulty
  estimatedMinutes: number
  xpReward: number
  category: string
  isPro?: boolean
  sections: LessonSection[]
  keyIdea: string
  quiz: QuizQuestion[]
  nextLessonId: string | null
}

export interface LessonSection {
  heading: string
  content: string
}

export interface Drill {
  id: string
  type: DrillType
  title: string
  description: string
  difficulty: Difficulty
  requiredMarks: TradeMarkType[]
  instructions: string
}

export interface AIReview {
  score: number
  summary: string
  strengths: string[]
  mistakes: string[]
  improvement: string
  recommendation: TradeRecommendation
  riskRewardFeedback?: string
  beginnerExplanation?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: string
}

export interface UserProgress {
  level: number
  xp: number
  xpForCurrentLevel: number
  xpForNextLevel: number
  streak: number
  lessonsCompleted: number
  totalLessons: number
  drillsCompleted: number
  quizzesCompleted: number
  quizAverageScore: number
  accuracy: number
  weakestSkill: string
  recommendedLessonId: string
  activePathId: string
  pathProgressPercent: number
  nextSyllabusItemId: string
  recommendedAction: string
  badgeIds: string[]
}

export interface JournalEntry {
  id: string
  setupPracticed: string
  marksSummary: string
  aiFeedbackSummary: string
  confidenceRating: 1 | 2 | 3 | 4 | 5
  mistakeTag: string
  personalNote: string
  createdAt: string
  source?: "book-lab" | "training" | "reflection" | "course" | "strategy-wiki"
  conceptTitle?: string
  drillType?: string
}

export interface CommunityPost {
  id: string
  author: string
  avatarInitials: string
  content: string
  type: "drill_share" | "mistake_discussion" | "challenge" | "general"
  likes: number
  createdAt: string
}

export interface PricingTier {
  id: string
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
}

export interface ProgressStats {
  weeklyDrills: number
  weeklyDrillsGoal: number
  setupAccuracy: number
  disciplineScore: number
  mistakesBreakdown: { label: string; count: number }[]
  bestHabit: string
  worstHabit: string
}

export interface QuizDiscussionPrompt {
  id: string
  label: string
}

export interface QuizDiscussionResponse {
  promptId: string
  response: string
}
