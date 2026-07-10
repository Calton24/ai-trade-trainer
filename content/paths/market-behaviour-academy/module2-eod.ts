import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "market-behaviour-academy"
const MODULE_ID = "mba-eod"

export const eodReversalModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "EOD Reversal Academy",
  description:
    "Professional end-of-day reversal workflow — daily bias, exhaustion, structure, liquidity, execution.",
  order: 2,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "mba-eod-workflow",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "eod-reversal-workflow",
      title: "EOD Reversal Workflow",
      description: "Walk the full professional checklist every time.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 10,
      xpReward: 50,
      prerequisites: ["mba-reversal-quiz"],
      estimatedMinutes: 0,
      contentBlocks: [
        {

          id: "b1",
          type: "paragraph",
          content:
            "EOD reversals are not intraday scalps. You read daily context, exhaustion, structure, then execute with patience.",
        },
        {

          id: "b2",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "order-steps",
            prompt: "Order the EOD reversal workflow correctly.",
            steps: [
              "Daily trend & bias",
              "Market phase (premium / discount / mid)",
              "Trend exhaustion signals",
              "Four-point structure read",
              "Has structure broken?",
              "Liquidity sweep check",
              "Daily + 4H agreement",
              "DXY / correlation check",
              "Execution",
              "Journal & review",
            ],
          },
        },
      ],
    },
    {
      id: "mba-eod-bias",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "eod-daily-bias",
      title: "Daily Bias & Market Phase",
      description: "Where is price within the daily range?",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 11,
      xpReward: 50,
      prerequisites: ["mba-eod-workflow"],
      estimatedMinutes: 0,
      contentBlocks: [
        {

          id: "b3",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "EOD decision checkpoints.",
            options: ["Bullish", "Bearish", "Neutral", "Wait"],
            scenarios: [
              {
                situation: "Daily close rejected from range high with long upper wick",
                correct: "Bearish",
                coaching: "Exhaustion at premium — favours EOD reversal down.",
              },
              {
                situation: "Price mid-range, no clear daily rejection",
                correct: "Neutral",
                coaching: "No edge — wait for clearer behaviour.",
              },
              {
                situation: "Strong close at daily low after liquidity sweep",
                correct: "Bullish",
                coaching: "Sweep + rejection — reversal long setup.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "mba-eod-execution",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "eod-execution",
      title: "EOD Execution Lab",
      description: "Trade EOD continuation and reversal scenarios.",
      lessonType: "reading",
      difficulty: "intermediate",
      order: 12,
      xpReward: 30,
      prerequisites: ["mba-eod-bias"],
      estimatedMinutes: 0,
      contentBlocks: [
        {

          id: "b4",
          type: "paragraph",
          content:
            "In Execution Lab, filter for EOD scenarios: `rev-eur-eod-rev`, `rev-eur-eod-cont`, `rev-gbp-eod-rev`. Use Academy Mode for full coaching.",
        },
      ],
    },
    {
      id: "mba-eod-journal",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "eod-journal",
      title: "EOD Journal Review",
      description: "Reflect on session timing and checklist adherence.",
      lessonType: "reflection",
      difficulty: "advanced",
      order: 13,
      xpReward: 50,
      prerequisites: ["mba-eod-execution"],
      estimatedMinutes: 0,
      reflectionPrompt:
        "After your last EOD scenario: Did you follow the full checklist? Which confirmation was strongest? What would you do differently?",
      contentBlocks: [],
    },
  ],
}
