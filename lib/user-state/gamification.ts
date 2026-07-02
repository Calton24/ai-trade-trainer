import { evaluateAchievements } from "@/lib/progression/achievements"
import { getChallengeById } from "@/lib/progression/challenges"
import { XP_REWARDS } from "@/lib/progression/levels"
import { getRankByTier, getTierForXp } from "@/lib/progression/ranks"
import { levelFromXP } from "@/lib/progression/levels"

import { getDateKey } from "./activity"
import { getInitialGamificationState } from "./types"
import type { MotivationEvent, UserState } from "./types"

function ensureGamification(state: UserState): UserState {
  if (state.gamification) return state
  return { ...state, gamification: getInitialGamificationState() }
}

/**
 * Run after any learning persist. Grants newly-earned achievements (with bonus
 * XP), applies monotonic rank progression and returns the reward events to
 * surface as notifications. Pure and idempotent.
 */
export function finalizeProgression(input: UserState): {
  state: UserState
  events: MotivationEvent[]
} {
  let state = ensureGamification(input)
  const events: MotivationEvent[] = []

  const { state: afterAchievements, newlyEarned } = evaluateAchievements(state)
  state = afterAchievements
  for (const achievement of newlyEarned) {
    events.push({
      type: "achievement-unlocked",
      achievementId: achievement.id,
      name: achievement.name,
      icon: achievement.icon,
      bonusXp: achievement.bonusXp,
    })
  }

  // Monotonic rank — never demote, even if thresholds rise with new content.
  const currentTier = getTierForXp(state.progress.xp)
  const previousTier = state.gamification.highestRankTier
  if (currentTier > previousTier) {
    const rank = getRankByTier(currentTier)
    state = {
      ...state,
      gamification: { ...state.gamification, highestRankTier: currentTier },
    }
    events.push({
      type: "rank-up",
      tier: currentTier,
      title: rank.title,
      insignia: rank.insignia,
    })
  }

  return { state, events }
}

/** Award the daily login bonus at most once per calendar day. */
export function recordDailyLogin(input: UserState): {
  state: UserState
  events: MotivationEvent[]
} {
  const state = ensureGamification(input)
  const today = getDateKey()
  if (state.gamification.lastLoginDate === today) {
    return { state, events: [] }
  }

  const xp = state.progress.xp + XP_REWARDS.dailyLogin
  return {
    state: {
      ...state,
      progress: { ...state.progress, xp, level: levelFromXP(xp) },
      gamification: { ...state.gamification, lastLoginDate: today },
    },
    events: [
      {
        type: "xp-awarded",
        amount: XP_REWARDS.dailyLogin,
        reason: "Daily login bonus",
      },
    ],
  }
}

/** Claim the reward for a completed challenge set. */
export function claimChallengeReward(
  input: UserState,
  challengeId: string
): { state: UserState; events: MotivationEvent[] } {
  const state = ensureGamification(input)
  const challenge = getChallengeById(state, challengeId)
  if (!challenge || !challenge.claimable) {
    return { state, events: [] }
  }

  const xp = state.progress.xp + challenge.rewardXp
  return {
    state: {
      ...state,
      progress: { ...state.progress, xp, level: levelFromXP(xp) },
      gamification: {
        ...state.gamification,
        claimedChallengeIds: [
          ...state.gamification.claimedChallengeIds,
          challengeId,
        ],
      },
    },
    events: [
      {
        type: "challenge-complete",
        period: challenge.period,
        rewardXp: challenge.rewardXp,
      },
    ],
  }
}
