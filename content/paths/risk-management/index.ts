import type { LearningPathContent } from "@/lib/course/types"

import { understandingRiskModule } from "./module1-risk"
import { positionSizingModule } from "./module2-position-sizing"
import { stopLossModule } from "./module3-stops"
import { riskRewardModule } from "./module4-risk-reward"
import { professionalRulesModule } from "./module5-rules"

const PATH_ID = "risk-management"

/** Risk Management Mastery — the full intermediate course (replaces coming_soon stub). */
export const riskManagementPath: LearningPathContent = {
  id: PATH_ID,
  slug: PATH_ID,
  title: "Risk Management Mastery",
  description:
    "The system that keeps traders alive: percentage risk, position sizing, logical stops, expectancy, loss limits, and the professional rulebook — with calculators and graded scenarios throughout.",
  level: "intermediate",
  category: "risk",
  order: 5,
  isFree: false,
  status: "available",
  locked: false,
  skillsYouGain: [
    "Calculate position size from risk and stop distance",
    "Place stops at invalidation, behind structure, beyond ATR noise",
    "Think in R-multiples and compute expectancy",
    "Set and respect daily and weekly loss limits",
    "Identify and stop revenge trading and streak sizing",
    "Follow the eight-rule professional risk rulebook",
  ],
  whatYouLearn: [
    "Why traders actually fail — and the asymmetric math of drawdowns",
    "The 1% percentage-risk model and why it self-corrects",
    "The position sizing formula, practised by hand",
    "Logical stop placement: invalidation, structure, and volatility",
    "Expectancy: how win rate and reward ratio combine into profit or ruin",
    "Loss limits, revenge trading, and the rules professionals never break",
  ],
  relatedPathSlugs: ["trading-foundations", "forex-basics", "trading-psychology"],
  estimatedMinutes: 0,
  stats: {
    moduleCount: 0,
    lessonCount: 0,
    quizCount: 0,
    drillCount: 0,
    reflectionCount: 0,
  },
  modules: [
    understandingRiskModule,
    positionSizingModule,
    stopLossModule,
    riskRewardModule,
    professionalRulesModule,
  ],
}
