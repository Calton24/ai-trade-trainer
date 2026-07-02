export type TradingExperience =
  | "complete-beginner"
  | "beginner"
  | "intermediate"
  | "advanced"

export interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  tradingExperience: TradingExperience | null
  createdAt: string
  currentLevel: number
  totalXP: number
  streakDays: number
  weeklyTarget: number | null
  lessonsCompleted: number
  quizzesCompleted: number
  drillsCompleted: number
  strongestSkill: string | null
  weakestSkill: string | null
  onboardingCompleted?: boolean
  username?: string | null
  tradingGoals?: string[] | null
  preferredMarket?: string | null
  studyIntensity?: string | null
  learningPlan?: string | null
  country?: string | null
  publicLeaderboard?: boolean | null
}

export const TRADING_EXPERIENCE_OPTIONS: {
  value: TradingExperience
  label: string
}[] = [
  { value: "complete-beginner", label: "Complete Beginner" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]

export const ENROLLABLE_FEATURES = [
  {
    id: "trading-foundations",
    title: "Trading Foundations",
    href: "/paths/trading-foundations",
  },
  {
    id: "price-action",
    title: "Price Action Fundamentals",
    href: "/paths/price-action",
  },
  { id: "book-lab", title: "Trading Library", href: "/library" },
  { id: "chart-lab", title: "Chart Lab", href: "/chart-lab" },
  { id: "trend-spotter", title: "Trend Spotter", href: "/trend-spotter" },
  { id: "strategy-wiki", title: "Strategy Wiki", href: "/strategy-wiki" },
] as const

export type EnrollableFeatureId = (typeof ENROLLABLE_FEATURES)[number]["id"]
