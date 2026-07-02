import type { TradingExperience } from "@/lib/auth/types"
import type { LearningPlan, StudyIntensity, TradingGoalId } from "@/lib/settings/types"

export type OnboardingStep = 1 | 2 | 3 | 4

export const ONBOARDING_STEP_COUNT = 4

export interface OnboardingData {
  displayName: string
  username: string
  country: string
  optInLeaderboard: boolean
  experienceLevel: TradingExperience
  tradingGoals: TradingGoalId[]
  preferredMarket: string
  studyIntensity: StudyIntensity
  learningPlan: LearningPlan
  weeklyTargetDays: number
}

export interface OnboardingState extends OnboardingData {
  step: OnboardingStep
  onboardingCompleted: boolean
  updatedAt: string | null
}

export interface OnboardingDraftEnvelope {
  userId: string
  data: OnboardingData
  step: OnboardingStep
  savedAt: string
}

export const DEFAULT_ONBOARDING_DATA: OnboardingData = {
  displayName: "",
  username: "",
  country: "",
  optInLeaderboard: false,
  experienceLevel: "complete-beginner",
  tradingGoals: [],
  preferredMarket: "",
  studyIntensity: "consistent",
  learningPlan: "six-month",
  weeklyTargetDays: 3,
}

export const STEP_LABELS: Record<OnboardingStep, string> = {
  1: "Profile",
  2: "Experience",
  3: "Study plan",
  4: "Confirm",
}

export const PREFERRED_MARKET_OPTIONS = [
  { value: "", label: "No preference" },
  { value: "forex", label: "Forex" },
  { value: "stocks", label: "Stocks" },
  { value: "crypto", label: "Crypto" },
  { value: "indices", label: "Indices / futures" },
  { value: "commodities", label: "Commodities" },
] as const
