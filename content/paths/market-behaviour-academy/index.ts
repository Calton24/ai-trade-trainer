import type { LearningPathContent } from "@/lib/course/types"

import { eodReversalModule } from "./module2-eod"
import { reversalAcademyModule } from "./module1-reversal"

const PATH_ID = "market-behaviour-academy"

export const marketBehaviourAcademyPath: LearningPathContent = {
  id: PATH_ID,
  slug: PATH_ID,
  title: "Market Behaviour Academy",
  description:
    "Learn how markets actually behave — not indicators. Reversal Academy is the flagship module: pullback vs reversal, four-point rule, institutional confirmation, and EOD workflow.",
  level: "intermediate",
  category: "price-action",
  order: 1,
  isFree: true,
  status: "available",
  locked: false,
  skillsYouGain: [
    "Distinguish pullbacks from real reversals",
    "Apply the four-point rule under pressure",
    "Grade reversal quality (A+ to D)",
    "Run institutional confirmation checklists",
    "Execute EOD reversal workflow",
    "Know when NOT to trade",
  ],
  whatYouLearn: [
    "What a reversal actually is — a process, not a candle",
    "Pullback vs reversal with side-by-side replay",
    "Structure break and continuation traps",
    "Reversal quality grading",
    "Institutional confluence (DXY, HTF, sessions)",
    "EOD reversal professional workflow",
    "20+ Execution Lab reversal scenarios",
  ],
  relatedPathSlugs: [
    "market-structure-mastery",
    "professional-forex",
    "risk-management",
  ],
  estimatedMinutes: 0,
  stats: {
    moduleCount: 0,
    lessonCount: 0,
    quizCount: 0,
    drillCount: 0,
    reflectionCount: 0,
  },
  modules: [reversalAcademyModule, eodReversalModule],
}
