import { computeBehavioralCompetence } from "@/lib/competence/behavioral-scoring"
import { computeSkillProfile, countChartsAnalysed } from "@/lib/skills/engine"
import { computeExecutionStats } from "@/lib/user-state/execution-lab"
import { computeAllLibraryBookStats } from "@/lib/user-state/library"
import { levelFromXP } from "@/lib/progression/levels"
import { getTierForXp } from "@/lib/progression/ranks"
import { getInitialGamificationState } from "@/lib/user-state/types"
import type { UserState } from "@/lib/user-state/types"

export type AchievementCategory =
  | "milestone"
  | "knowledge"
  | "consistency"
  | "mastery"
  | "competition"

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  bonusXp: number
  category: AchievementCategory
  /** Evaluated against a derived context; competition ones earn elsewhere. */
  predicate: (ctx: AchievementContext) => boolean
}

interface AchievementContext {
  lessonsCompleted: number
  quizzesPassed: number
  quizAttempts: number
  perfectQuiz: boolean
  conceptsCompleted: number
  booksCompleted: number
  coursesCompleted: number
  streak: number
  simStagesCompleted: number
  simSessions: number
  flashcardsReviewed: number
  rankTier: number
  reflections: number
  riskScore: number
  psychologyScore: number
  chartScore: number
  chartsAnalysed: number
  practiceStreak: number
  marketReadingScore: number
  executionAttempts: number
  averageExecutionScore: number
}

function buildContext(state: UserState): AchievementContext {
  const courseQuizPassed = state.quizAttempts.filter((a) => a.passed).length
  const bookQuizPassed = state.bookLab.quizAttempts.filter((a) => a.passed).length
  const perfectQuiz =
    state.quizAttempts.some((a) => a.score >= 100) ||
    state.bookLab.quizAttempts.some((a) => a.score >= 100)

  const bookStats = computeAllLibraryBookStats(state)
  const booksCompleted = Object.values(bookStats).filter(
    (b) => b.completed
  ).length

  const coursesCompleted = Object.values(state.progress.pathProgress).filter(
    (p) => p >= 100
  ).length

  const competence = computeBehavioralCompetence(state)
  const skillProfile = computeSkillProfile(state)
  const executionStats = computeExecutionStats(state)

  return {
    lessonsCompleted: state.lessonProgress.length,
    quizzesPassed: courseQuizPassed + bookQuizPassed,
    quizAttempts: state.quizAttempts.length + state.bookLab.quizAttempts.length,
    perfectQuiz,
    conceptsCompleted: state.bookLab.completedConceptIds.length,
    booksCompleted,
    coursesCompleted,
    streak: state.progress.streak,
    simStagesCompleted: state.simulator.completedStageIds.length,
    simSessions: state.simulator.attempts.length,
    flashcardsReviewed: state.flashcards.sessions.reduce(
      (sum, s) => sum + (s.cardsReviewed ?? 0),
      0
    ),
    rankTier: getTierForXp(state.progress.xp),
    reflections: state.bookLab.reflections.length,
    riskScore: competence.riskScore,
    psychologyScore: competence.psychologyScore,
    chartScore: competence.chartScore,
    chartsAnalysed: countChartsAnalysed(state),
    practiceStreak: state.progress.practiceStreak ?? 0,
    marketReadingScore: skillProfile.marketReadingScore,
    executionAttempts: executionStats.attempts,
    averageExecutionScore: executionStats.averageScore,
  }
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-first-lesson",
    name: "First Lesson",
    description: "Complete your first lesson",
    icon: "🌱",
    bonusXp: 50,
    category: "milestone",
    predicate: (c) => c.lessonsCompleted >= 1 || c.conceptsCompleted >= 1,
  },
  {
    id: "ach-first-book",
    name: "First Book",
    description: "Complete an entire book",
    icon: "📕",
    bonusXp: 300,
    category: "milestone",
    predicate: (c) => c.booksCompleted >= 1,
  },
  {
    id: "ach-quiz-100",
    name: "Quiz Centurion",
    description: "Complete 100 quizzes",
    icon: "💯",
    bonusXp: 250,
    category: "knowledge",
    predicate: (c) => c.quizAttempts >= 100,
  },
  {
    id: "ach-perfect-quiz",
    name: "Perfect Quiz",
    description: "Score 100% on a quiz",
    icon: "🎯",
    bonusXp: 100,
    category: "knowledge",
    predicate: (c) => c.perfectQuiz,
  },
  {
    id: "ach-30-day-streak",
    name: "30 Day Streak",
    description: "Maintain a 30-day learning streak",
    icon: "🔥",
    bonusXp: 500,
    category: "consistency",
    predicate: (c) => c.streak >= 30,
  },
  {
    id: "ach-bookworm",
    name: "Bookworm",
    description: "Complete 50 lessons across the library",
    icon: "📚",
    bonusXp: 300,
    category: "knowledge",
    predicate: (c) => c.conceptsCompleted >= 50,
  },
  {
    id: "ach-psychology-master",
    name: "Psychology Master",
    description: "Reach 80%+ trading psychology competence",
    icon: "🧠",
    bonusXp: 400,
    category: "mastery",
    predicate: (c) => c.psychologyScore >= 80,
  },
  {
    id: "ach-chart-master",
    name: "Chart Master",
    description: "Reach 85%+ chart reading competence",
    icon: "📊",
    bonusXp: 400,
    category: "mastery",
    predicate: (c) => c.chartScore >= 85,
  },
  {
    id: "ach-risk-manager",
    name: "Risk Manager",
    description: "Reach 90%+ risk management competence",
    icon: "🛡️",
    bonusXp: 400,
    category: "mastery",
    predicate: (c) => c.riskScore >= 90,
  },
  {
    id: "ach-discipline-champion",
    name: "Discipline Champion",
    description: "Maintain a 14-day streak",
    icon: "⚔️",
    bonusXp: 250,
    category: "consistency",
    predicate: (c) => c.streak >= 14,
  },
  {
    id: "ach-simulation-expert",
    name: "Simulation Expert",
    description: "Complete all simulator stages",
    icon: "🎮",
    bonusXp: 600,
    category: "mastery",
    predicate: (c) => c.simStagesCompleted >= 5,
  },
  {
    id: "ach-strategy-specialist",
    name: "Strategy Specialist",
    description: "Reach 70%+ trade selection competence",
    icon: "🎓",
    bonusXp: 300,
    category: "mastery",
    predicate: (c) => c.simSessions >= 10,
  },
  {
    id: "ach-rank-promotion",
    name: "Rank Promotion",
    description: "Earn your first rank promotion",
    icon: "⬆️",
    bonusXp: 100,
    category: "milestone",
    predicate: (c) => c.rankTier >= 2,
  },
  {
    id: "ach-book-collector",
    name: "Book Collector",
    description: "Complete 2 different books",
    icon: "📖",
    bonusXp: 500,
    category: "milestone",
    predicate: (c) => c.booksCompleted >= 2,
  },
  {
    id: "ach-course-collector",
    name: "Course Collector",
    description: "Complete a full learning path",
    icon: "🏅",
    bonusXp: 500,
    category: "milestone",
    predicate: (c) => c.coursesCompleted >= 1,
  },
  {
    id: "ach-reflective-trader",
    name: "Reflective Trader",
    description: "Write 10 reflection journals",
    icon: "📝",
    bonusXp: 150,
    category: "consistency",
    predicate: (c) => c.reflections >= 10,
  },
  // ---- New achievements for the expanded academy ----
  {
    id: "ach-forex-graduate",
    name: "Forex Graduate",
    description: "Complete the Forex Basics path",
    icon: "💱",
    bonusXp: 300,
    category: "milestone",
    predicate: (c) => c.coursesCompleted >= 2,
  },
  {
    id: "ach-risk-graduate",
    name: "Risk Architect",
    description: "Complete the Risk Management Mastery path",
    icon: "🛡️",
    bonusXp: 400,
    category: "milestone",
    predicate: (c) => c.riskScore >= 70,
  },
  {
    id: "ach-probability-master",
    name: "Probability Master",
    description: "Complete the Trading Psychology path",
    icon: "🧩",
    bonusXp: 400,
    category: "mastery",
    predicate: (c) => c.psychologyScore >= 70,
  },
  {
    id: "ach-no-trade-champion",
    name: "No-Trade Champion",
    description: "Complete 50 flashcards in a single session",
    icon: "⏸️",
    bonusXp: 200,
    category: "consistency",
    predicate: (c) => c.flashcardsReviewed >= 50,
  },
  {
    id: "ach-consistency-builder",
    name: "Consistency Builder",
    description: "Maintain a 7-day learning streak",
    icon: "📆",
    bonusXp: 100,
    category: "consistency",
    predicate: (c) => c.streak >= 7,
  },
  {
    id: "ach-quiz-master",
    name: "Quiz Master",
    description: "Pass 20 quizzes across any paths",
    icon: "🏆",
    bonusXp: 200,
    category: "knowledge",
    predicate: (c) => c.quizzesPassed >= 20,
  },
  {
    id: "ach-full-academy",
    name: "Academy Complete",
    description: "Complete 5 or more learning paths",
    icon: "🎓",
    bonusXp: 1000,
    category: "milestone",
    predicate: (c) => c.coursesCompleted >= 5,
  },
  {
    id: "ach-100-charts",
    name: "100 Charts Analysed",
    description: "Analyse 100 charts through practice drills",
    icon: "📈",
    bonusXp: 200,
    category: "milestone",
    predicate: (c) => c.chartsAnalysed >= 100,
  },
  {
    id: "ach-500-charts",
    name: "500 Charts Analysed",
    description: "Analyse 500 charts — serious deliberate practice",
    icon: "🔭",
    bonusXp: 500,
    category: "mastery",
    predicate: (c) => c.chartsAnalysed >= 500,
  },
  {
    id: "ach-replay-master",
    name: "Replay Master",
    description: "Maintain a 7-day practice streak",
    icon: "🔁",
    bonusXp: 300,
    category: "consistency",
    predicate: (c) => c.practiceStreak >= 7,
  },
  {
    id: "ach-market-reader",
    name: "Market Reader",
    description: "Reach 75%+ overall market reading score",
    icon: "👁️",
    bonusXp: 400,
    category: "mastery",
    predicate: (c) => c.marketReadingScore >= 75,
  },
  {
    id: "ach-first-trade",
    name: "First Trade",
    description: "Complete your first simulated execution",
    icon: "🎯",
    bonusXp: 75,
    category: "milestone",
    predicate: (c) => c.executionAttempts >= 1,
  },
  {
    id: "ach-execution-master",
    name: "Execution Master",
    description: "Maintain 80%+ average execution score over 10+ trades",
    icon: "⚡",
    bonusXp: 350,
    category: "mastery",
    predicate: (c) =>
      c.executionAttempts >= 10 && c.averageExecutionScore >= 80,
  },
]

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}

export interface AchievementEvaluation {
  state: UserState
  newlyEarned: Achievement[]
}

/**
 * Evaluate all achievements against the current state. Newly earned ones are
 * recorded and their bonus XP is granted exactly once. Pure and idempotent.
 */
export function evaluateAchievements(state: UserState): AchievementEvaluation {
  const gamification = state.gamification ?? getInitialGamificationState()
  const earned = new Set(gamification.earnedAchievementIds)
  const ctx = buildContext(state)

  const newlyEarned: Achievement[] = []
  for (const achievement of ACHIEVEMENTS) {
    if (earned.has(achievement.id)) continue
    if (achievement.predicate(ctx)) {
      earned.add(achievement.id)
      newlyEarned.push(achievement)
    }
  }

  if (newlyEarned.length === 0) {
    return { state: { ...state, gamification }, newlyEarned: [] }
  }

  const bonus = newlyEarned.reduce((sum, a) => sum + a.bonusXp, 0)
  const xp = state.progress.xp + bonus

  return {
    state: {
      ...state,
      progress: { ...state.progress, xp, level: levelFromXP(xp) },
      gamification: {
        ...gamification,
        earnedAchievementIds: [...earned],
        bonusXp: gamification.bonusXp + bonus,
      },
    },
    newlyEarned,
  }
}

export interface AchievementView extends Achievement {
  earned: boolean
}

export function getAchievementViews(state: UserState): AchievementView[] {
  const earned = new Set(
    (state.gamification ?? getInitialGamificationState()).earnedAchievementIds
  )
  return ACHIEVEMENTS.map((a) => ({ ...a, earned: earned.has(a.id) }))
}
