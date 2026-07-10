import type { LearningPathContent } from "@/lib/course/types"

import { marketStructureModule } from "./module1-structure"

const PATH_ID = "market-structure-mastery"

/**
 * Market Structure Mastery — the interactive pattern-recognition path that
 * teaches HH/HL/LH/LL, the four-point rule, trend detection, continuation vs
 * reversal, phases, and the trade/wait/skip decision. Sits between Price
 * Action Fundamentals and Forex Basics.
 */
export const marketStructureMasteryPath: LearningPathContent = {
  id: PATH_ID,
  slug: PATH_ID,
  title: "Market Structure Mastery",
  description:
    "Read charts like a professional through hundreds of reps: label swings, apply the four-point rule, classify trends, and decide continuation vs reversal — all with interactive click-the-chart drills.",
  level: "beginner",
  category: "price-action",
  order: 2,
  isFree: true,
  status: "available",
  locked: false,
  skillsYouGain: [
    "Identify Higher Highs, Higher Lows, Lower Highs, and Lower Lows",
    "Apply the four-point rule to read any chart fast",
    "Classify uptrend, downtrend, range, and transition",
    "Distinguish continuation from reversal",
    "Read Phase 1 (impulse) vs Phase 2 (pullback)",
    "Grade trend quality and decide trade / wait / skip",
  ],
  whatYouLearn: [
    "What market structure is and why every strategy depends on it",
    "Bullish and bearish structure — labeled by you on live drills",
    "The four-point rule professionals use to read charts instantly",
    "Continuation vs reversal — what the market is attempting next",
    "Phase 1 and Phase 2, and why you only trade one of them",
    "Trend quality grading and the full read-the-chart workflow",
  ],
  relatedPathSlugs: ["price-action", "icc-strategy", "professional-forex"],
  estimatedMinutes: 0,
  stats: {
    moduleCount: 0,
    lessonCount: 0,
    quizCount: 0,
    drillCount: 0,
    reflectionCount: 0,
  },
  modules: [marketStructureModule],
}
