import type { LearningPathContent } from "@/lib/course/types"
import { marketContextModule } from "./stage13-context"
import { positioningModule } from "./stage14-positioning"
import { strategySelectionModule } from "./stage15-strategy-selection"
import { watchlistModule } from "./stage16-watchlist"
import { operatingSystemModule } from "./stage17-operating-system"
import { dailyWorkflowModule } from "./stage18-daily-workflow"

const PATH_ID = "professional-forex"

/**
 * Professional Forex Workflow — the advanced track (learning map Stages 13–17)
 * that follows Intermediate Chart Mastery. Teaches the professional decision
 * system: market context, positioning, strategy selection, watchlists, and
 * the daily trading operating system.
 */
export const professionalForexPath: LearningPathContent = {
  id: PATH_ID,
  slug: PATH_ID,
  title: "Professional Forex Workflow",
  description:
    "Trade like a professional operates: read market context, confirm positioning, select the right strategy for the market in front of you, build a filtered watchlist, and run a repeatable daily process — including knowing when not to trade.",
  level: "advanced",
  category: "professional-forex",
  order: 7,
  isFree: false,
  status: "available",
  locked: false,
  skillsYouGain: [
    "Build a daily market bias from context, DXY, and sentiment",
    "Confirm positioning with timeframe agreement and trend phases",
    "Classify the market and select the matching strategy framework",
    "Filter 28 pairs down to a scored watchlist of 4–5",
    "Run the trade-or-skip decision engine before every entry",
    "Operate a professional daily routine with risk rules and weekly review",
  ],
  whatYouLearn: [
    "Why context comes before entries — and how to check it daily",
    "Daily direction, DXY, and risk-on/risk-off sentiment",
    "Phase 1 vs Phase 2, four-point trend confirmation, EMA positioning",
    "Continuation, reversal, and breakout frameworks — and when each applies",
    "Watchlist building, pair scoring, and the maximum-3-positions rule",
    "Pip targets as training objectives, professional risk rules, and review habits",
  ],
  relatedPathSlugs: ["icc-strategy", "price-action", "risk-management"],
  estimatedMinutes: 0,
  stats: {
    moduleCount: 0,
    lessonCount: 0,
    quizCount: 0,
    drillCount: 0,
    reflectionCount: 0,
  },
  modules: [
    marketContextModule,
    positioningModule,
    strategySelectionModule,
    watchlistModule,
    operatingSystemModule,
    dailyWorkflowModule,
  ],
}
