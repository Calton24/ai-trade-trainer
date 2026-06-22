import type { LearningPathContent } from "@/lib/course/types"

const previewModule = (
  pathId: string,
  id: string,
  title: string,
  description: string,
  order: number
) => ({
  id,
  pathId,
  title,
  description,
  order,
  estimatedMinutes: 0,
  lessons: [
    {
      id: `${id}-preview`,
      moduleId: id,
      pathId,
      slug: `${id}-preview`,
      title: `${title} — Preview`,
      description: "Full lesson content coming soon.",
      lessonType: "reading" as const,
      difficulty: "beginner" as const,
      order: 1,
      xpReward: 0,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        {
          id: "preview",
          type: "callout" as const,
          content: "This module is a preview. Complete Trading Foundations first.",
          metadata: { variant: "tip" },
        },
      ],
    },
  ],
})

export const forexBasicsPath: LearningPathContent = {
  id: "forex-basics",
  slug: "forex-basics",
  title: "Forex Basics",
  description:
    "Preview syllabus for currency pairs, pips, sessions, and forex terminology.",
  level: "beginner",
  category: "forex",
  order: 3,
  isFree: true,
  status: "preview",
  locked: false,
  skillsYouGain: ["Read currency pairs", "Understand pips and spreads"],
  whatYouLearn: ["What forex is", "Major pairs", "Session times"],
  relatedPathSlugs: ["trading-foundations", "price-action"],
  estimatedMinutes: 0,
  stats: { moduleCount: 0, lessonCount: 0, quizCount: 0, drillCount: 0, reflectionCount: 0 },
  modules: [
    previewModule("forex-basics", "fx-m1", "What is Forex?", "Introduction to currency markets", 1),
    previewModule("forex-basics", "fx-m2", "Pips & Pairs", "Reading EUR/USD and friends", 2),
  ],
}

export const iccStrategyPath: LearningPathContent = {
  id: "icc-strategy",
  slug: "icc-strategy",
  title: "ICC Strategy Path",
  description: "Preview syllabus for Indication, Correction, Continuation framework.",
  level: "intermediate",
  category: "icc",
  order: 4,
  isFree: false,
  status: "preview",
  locked: false,
  skillsYouGain: ["Identify ICC phases", "Mark continuation entries"],
  whatYouLearn: ["Indication", "Correction", "Continuation"],
  relatedPathSlugs: ["price-action"],
  estimatedMinutes: 0,
  stats: { moduleCount: 0, lessonCount: 0, quizCount: 0, drillCount: 0, reflectionCount: 0 },
  modules: [
    previewModule("icc-strategy", "icc-m1", "ICC Overview", "Three-phase framework", 1),
  ],
}

export const riskManagementPath: LearningPathContent = {
  id: "risk-management",
  slug: "risk-management",
  title: "Risk Management Mastery",
  description: "Coming soon — position sizing, drawdown rules, and discipline systems.",
  level: "intermediate",
  category: "risk",
  order: 5,
  isFree: false,
  status: "coming_soon",
  locked: true,
  skillsYouGain: ["Size positions safely", "Manage drawdown"],
  whatYouLearn: ["Position sizing", "Risk per trade", "Recovery plans"],
  relatedPathSlugs: ["trading-foundations"],
  estimatedMinutes: 0,
  stats: { moduleCount: 0, lessonCount: 0, quizCount: 0, drillCount: 0, reflectionCount: 0 },
  modules: [],
}

export const tradingPsychologyPath: LearningPathContent = {
  id: "trading-psychology",
  slug: "trading-psychology",
  title: "Trading Psychology",
  description: "Coming soon — emotions, discipline, and building consistent habits.",
  level: "beginner",
  category: "psychology",
  order: 6,
  isFree: false,
  status: "coming_soon",
  locked: true,
  skillsYouGain: ["Manage FOMO", "Build discipline"],
  whatYouLearn: ["Emotional triggers", "Journaling habits", "Patience"],
  relatedPathSlugs: ["trading-foundations"],
  estimatedMinutes: 0,
  stats: { moduleCount: 0, lessonCount: 0, quizCount: 0, drillCount: 0, reflectionCount: 0 },
  modules: [],
}
