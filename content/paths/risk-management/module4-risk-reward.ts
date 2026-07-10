import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "risk-management"
const MODULE_ID = "rm-m4"

/** Module 4 — Risk : Reward & Expectancy: R multiples, win rate, and the expectancy equation. */
export const riskRewardModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Risk : Reward & Expectancy",
  description:
    "R-multiples, win rates, and expectancy — the equation that decides whether a system makes money.",
  order: 4,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "rm-m4-r-multiples",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "thinking-in-r",
      title: "Thinking in R",
      description: "Measure every trade in risk units, not dollars.",
      lessonType: "reading",
      difficulty: "intermediate",
      order: 1,
      xpReward: 45,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "R Is Your Unit of Account" },
        {
          id: "def1",
          type: "definition",
          content:
            "One R = the amount risked on a trade. A trade risking $100 that makes $200 is a +2R win; one that hits the stop is a −1R loss. R-multiples make every trade comparable regardless of account size or pair.",
          metadata: { term: "R-multiple" },
        },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Thinking in R removes the emotional weight of money and exposes the geometry of a trade before entry: if the stop is 20 pips, is the realistic target 20 pips away (1:1), 40 (1:2), or 60 (1:3)? A 1:2 trade only needs to win 34% of the time to break even. A 1:1 trade needs 50%. The ratio quietly sets your required win rate.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "Ten trades at 1% risk with 1:2 reward, winning just 4 of 10: 4 wins × +2R = +8R, 6 losses × −1R = −6R. Net +2R — profitable while losing MORE OFTEN than winning.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Chasing extreme ratios backfires: a 1:10 target sounds great, but if price realistically never reaches it, your actual win rate collapses toward zero. The BEST ratio is the one the chart structure genuinely offers.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Measure trades in R. Higher reward ratios lower the win rate you need — but only targets the market actually reaches count.",
        },
      ],
    },
    {
      id: "rm-m4-expectancy",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "expectancy",
      title: "Expectancy",
      description: "Win rate × reward − loss rate × risk: the only equation that matters.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 2,
      xpReward: 55,
      prerequisites: ["rm-m4-r-multiples"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Profit Equation" },
        {
          id: "def1",
          type: "definition",
          content:
            "The average R you expect to make per trade: (Win% × average win R) − (Loss% × 1R). Positive expectancy compounds into profit; negative expectancy compounds into ruin — no matter how it feels trade to trade.",
          metadata: { term: "Expectancy" },
        },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Play with the simulator below. Watch two things: how a modest win rate becomes profitable at 2R, and how streaky the equity curve looks EVEN when expectancy is positive. That streakiness is normal — surviving it is what the earlier modules trained.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: { kind: "expectancy-simulator" },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "A system's quality is invisible over 5 trades and undeniable over 200. Judge systems on samples, never sessions.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Expectancy = (Win% × avg win) − (Loss% × avg loss). Positive expectancy plus survival equals compounding. Everything else is noise.",
        },
      ],
    },
    {
      id: "rm-m4-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "risk-reward-check",
      title: "Risk : Reward Check",
      description: "Test R-multiples and expectancy math.",
      lessonType: "quiz",
      difficulty: "intermediate",
      order: 3,
      xpReward: 50,
      prerequisites: ["rm-m4-expectancy"],
      estimatedMinutes: 0,
      quizId: "risk-reward-check",
      contentBlocks: [],
    },
  ],
}
