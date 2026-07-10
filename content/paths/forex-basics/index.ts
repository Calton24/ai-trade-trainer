import type { LearningPathContent } from "@/lib/course/types"

import { forexFundamentalsModule } from "./module1-fundamentals"
import { tradingSessionsModule } from "./module2-sessions"
import { choosingPairsModule } from "./module3-pairs"
import { economicNewsModule } from "./module4-news"

const PATH_ID = "forex-basics"

/** Forex Basics — the full beginner course (replaces the old preview). */
export const forexBasicsPath: LearningPathContent = {
  id: PATH_ID,
  slug: PATH_ID,
  title: "Forex Basics",
  description:
    "Everything a beginner needs before trading currencies: pairs, pips, lots, leverage, sessions, pair selection, and economic news — taught interactively.",
  level: "beginner",
  category: "forex",
  order: 3,
  isFree: true,
  status: "available",
  locked: false,
  skillsYouGain: [
    "Read any currency pair and price quote",
    "Calculate pips and understand lot sizes",
    "Use leverage and margin safely",
    "Trade the right pairs at the right session times",
    "Check DXY, currency strength, and correlations",
    "Plan around high-impact economic news",
  ],
  whatYouLearn: [
    "What forex is and how pairs, pips, and lots work",
    "Spread, swap, leverage, and margin — the real costs of trading",
    "The four trading sessions and the London–New York overlap",
    "Why professionals specialise in 3–5 pairs",
    "FOMC, CPI, NFP, and using the economic calendar",
    "When NOT to trade — the most underrated skill",
  ],
  relatedPathSlugs: ["trading-foundations", "price-action", "risk-management"],
  estimatedMinutes: 0,
  stats: {
    moduleCount: 0,
    lessonCount: 0,
    quizCount: 0,
    drillCount: 0,
    reflectionCount: 0,
  },
  modules: [
    forexFundamentalsModule,
    tradingSessionsModule,
    choosingPairsModule,
    economicNewsModule,
  ],
}
