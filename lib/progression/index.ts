import { computeAllLibraryBookStats } from "@/lib/user-state/library"
import { computeSimulatorStats } from "@/lib/user-state/simulator"
import type { UserState } from "@/lib/user-state/types"

import { getAchievementViews } from "./achievements"
import { getAllChallenges } from "./challenges"
import { computeCompetencyScore } from "./competency"
import { getRankByTier, getRankProgress, getTierForXp } from "./ranks"
import type { RankProgress } from "./ranks"

export * from "./levels"
export * from "./ranks"
export * from "./xp-engine"
export * from "./competency"
export * from "./achievements"
export * from "./challenges"

export interface ProgressionStats {
  totalXP: number
  bonusXP: number
  dailyStreak: number
  longestStreak: number
  lessonsCompleted: number
  booksCompleted: number
  coursesCompleted: number
  quizzesCompleted: number
  quizAccuracy: number
  simulationsCompleted: number
}

export interface ProgressionSnapshot {
  xp: number
  /** Display rank honours the monotonic highest tier ever reached. */
  rank: RankProgress
  competency: ReturnType<typeof computeCompetencyScore>
  challenges: ReturnType<typeof getAllChallenges>
  achievements: ReturnType<typeof getAchievementViews>
  achievementsEarned: number
  stats: ProgressionStats
}

function computeLongestStreak(state: UserState): number {
  const days = [...new Set(state.activityLog.map((a) => a.dateKey))].sort()
  if (days.length === 0) return 0
  let longest = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(`${days[i - 1]}T12:00:00`)
    const curr = new Date(`${days[i]}T12:00:00`)
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (diffDays === 1) {
      run += 1
      longest = Math.max(longest, run)
    } else {
      run = 1
    }
  }
  return longest
}

export function getProgressionSnapshot(state: UserState): ProgressionSnapshot {
  const xp = state.progress.xp
  const liveTier = getTierForXp(xp)
  const highestTier = Math.max(
    state.gamification?.highestRankTier ?? 1,
    liveTier
  )

  // Rank progress from XP, but display title from the monotonic highest tier.
  const rankProgress = getRankProgress(xp)
  const displayRank: RankProgress =
    highestTier > rankProgress.tier
      ? {
          ...rankProgress,
          tier: highestTier,
          rank: getRankByTier(highestTier),
          nextRank: rankProgress.nextRank,
        }
      : rankProgress

  const bookStats = computeAllLibraryBookStats(state)
  const booksCompleted = Object.values(bookStats).filter(
    (b) => b.completed
  ).length
  const coursesCompleted = Object.values(state.progress.pathProgress).filter(
    (p) => p >= 100
  ).length

  const courseQuiz = state.quizAttempts.map((a) => a.score)
  const bookQuiz = state.bookLab.quizAttempts.map((a) => a.score)
  const allQuiz = [...courseQuiz, ...bookQuiz]
  const quizAccuracy =
    allQuiz.length > 0
      ? Math.round(allQuiz.reduce((a, b) => a + b, 0) / allQuiz.length)
      : 0

  const sim = computeSimulatorStats(state)
  const achievements = getAchievementViews(state)

  return {
    xp,
    rank: displayRank,
    competency: computeCompetencyScore(state),
    challenges: getAllChallenges(state),
    achievements,
    achievementsEarned: achievements.filter((a) => a.earned).length,
    stats: {
      totalXP: xp,
      bonusXP: state.gamification?.bonusXp ?? 0,
      dailyStreak: state.progress.streak,
      longestStreak: computeLongestStreak(state),
      lessonsCompleted:
        state.lessonProgress.length + state.bookLab.completedConceptIds.length,
      booksCompleted,
      coursesCompleted,
      quizzesCompleted: allQuiz.length,
      quizAccuracy,
      simulationsCompleted: sim.sessionsCompleted,
    },
  }
}
