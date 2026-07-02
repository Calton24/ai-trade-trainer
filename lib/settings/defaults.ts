import type { UserSettingsBundle } from "./types"

export function getDefaultSettings(): UserSettingsBundle {
  return {
    profile: {
      displayName: "",
      username: "",
      avatarUrl: null,
      country: "",
      tradingExperience: null,
      tradingGoals: [],
      preferredMarket: "",
      studyIntensity: "casual",
      weeklyTargetDays: 3,
      learningPlan: "casual",
    },
    privacy: {
      leaderboardVisible: false,
      showCountryOnLeaderboard: false,
      showStreakPublicly: true,
      showTraderRankPublicly: true,
      showUsernamePublicly: true,
      friendLeaderboardVisible: false,
    },
    notifications: {
      dailyReminder: true,
      weeklyTargetReminder: true,
      streakReminder: true,
      challengeReminder: true,
      newContentUpdates: true,
      leaderboardUpdates: false,
    },
    billingPlan: "free",
    updatedAt: new Date().toISOString(),
  }
}
