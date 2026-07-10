import type { LearningPathContent } from "@/lib/course/types"

import { probabilitiesModule } from "./module1-probabilities"
import { emotionsModule } from "./module2-emotions"
import { habitsModule } from "./module3-habits"
import { professionalMindsetModule } from "./module4-professional-mindset"
import { decisionFrameworkModule } from "./module5-decision-framework"

const PATH_ID = "trading-psychology"

/** Trading Psychology — the full course (replaces coming_soon stub). */
export const tradingPsychologyPath: LearningPathContent = {
  id: PATH_ID,
  slug: PATH_ID,
  title: "Trading Psychology",
  description:
    "The mental game, taught as timeless principles: probabilities, emotional patterns, routines, the professional mindset, and the trade-wait-skip discipline — with simulators and scenario training throughout.",
  level: "intermediate",
  category: "psychology",
  order: 6,
  isFree: false,
  status: "available",
  locked: false,
  skillsYouGain: [
    "Think in probabilities and samples, not single outcomes",
    "Recognise fear, greed, FOMO, hope, revenge, and overconfidence live",
    "Run a daily routine that pre-makes emotional decisions",
    "Journal and review to find your personal failure patterns",
    "Deliver trade / wait / skip verdicts with discipline",
    "Write personal trading principles that actually hold",
  ],
  whatYouLearn: [
    "Why edge lives in the series and never in one trade",
    "How randomness produces streaks — and how traders misread them",
    "Process over outcome: grading decisions instead of results",
    "The six emotions and their specific antidotes",
    "Sleep, stress, and state as risk parameters",
    "The decision framework that links psychology to the professional workflow",
  ],
  relatedPathSlugs: ["risk-management", "trading-foundations", "professional-forex"],
  estimatedMinutes: 0,
  stats: {
    moduleCount: 0,
    lessonCount: 0,
    quizCount: 0,
    drillCount: 0,
    reflectionCount: 0,
  },
  modules: [
    probabilitiesModule,
    emotionsModule,
    habitsModule,
    professionalMindsetModule,
    decisionFrameworkModule,
  ],
}
