import type { TradingExperience } from "@/lib/auth/types"
import type { SubscriptionPlan } from "@/lib/subscription/types"

export type StudyIntensity = "casual" | "consistent" | "locked-in"
export type LearningPlan = "casual" | "six-month" | "locked-in"
export type BillingPlan = SubscriptionPlan

export const TRADING_GOAL_OPTIONS = [
  { id: "learn-safely", label: "Learn safely" },
  { id: "consistent-profit", label: "Become consistently profitable" },
  { id: "funded-challenge", label: "Pass a funded challenge" },
  { id: "psychology", label: "Improve psychology" },
  { id: "master-strategy", label: "Master one strategy" },
] as const

export type TradingGoalId = (typeof TRADING_GOAL_OPTIONS)[number]["id"]

export interface ProfileSettings {
  displayName: string
  username: string
  avatarUrl: string | null
  country: string
  tradingExperience: TradingExperience | null
  tradingGoals: TradingGoalId[]
  preferredMarket: string
  studyIntensity: StudyIntensity
  weeklyTargetDays: number
  learningPlan: LearningPlan
}

export interface PrivacySettings {
  leaderboardVisible: boolean
  showCountryOnLeaderboard: boolean
  showStreakPublicly: boolean
  showTraderRankPublicly: boolean
  showUsernamePublicly: boolean
  friendLeaderboardVisible: boolean
}

export interface NotificationPreferences {
  dailyReminder: boolean
  weeklyTargetReminder: boolean
  streakReminder: boolean
  challengeReminder: boolean
  newContentUpdates: boolean
  leaderboardUpdates: boolean
}

export interface UserSettingsBundle {
  profile: ProfileSettings
  privacy: PrivacySettings
  notifications: NotificationPreferences
  billingPlan: BillingPlan
  updatedAt: string
}

export type SettingsSection = keyof Pick<
  UserSettingsBundle,
  "profile" | "privacy" | "notifications"
>
