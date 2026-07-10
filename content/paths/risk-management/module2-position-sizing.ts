import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "risk-management"
const MODULE_ID = "rm-m2"

/** Module 2 — Position Sizing: the formula connecting account, risk, stop, and lots. */
export const positionSizingModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Position Sizing",
  description:
    "The formula that connects account size, risk percentage, stop distance, and pip value into one correct lot size.",
  order: 2,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "rm-m2-sizing-formula",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "the-position-sizing-formula",
      title: "The Position Sizing Formula",
      description: "Lots = risk amount ÷ (stop pips × pip value).",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 1,
      xpReward: 50,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Size Is an Output, Not a Choice" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Beginners pick a lot size, then hope. Professionals derive it: decide the risk (1% of account), find the stop distance the CHART demands, then calculate the only lot size that makes those two numbers true simultaneously. Size is the last variable, never the first.",
        },
        {
          id: "def1",
          type: "definition",
          content:
            "Lots = (Account × Risk%) ÷ (Stop distance in pips × Pip value per lot). Example: ($10,000 × 1%) ÷ (25 pips × $10) = 0.40 lots.",
          metadata: { term: "Position sizing formula" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Notice what the formula implies: a wider stop means a SMALLER position, not more risk. A 50-pip stop and a 10-pip stop can carry identical dollar risk — the size adjusts. This is how professionals trade volatile and quiet markets with the same account impact.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: { kind: "position-size-calculator" },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Same setup, same stop, same account → same size, every time. If your lot sizes vary with your mood, you don't have a risk system yet.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Risk % and stop distance are decided first; the lot size is calculated from them. Wider stop = smaller size at identical risk.",
        },
      ],
    },
    {
      id: "rm-m2-sizing-practice",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "position-sizing-practice",
      title: "Position Sizing Practice",
      description: "Calculate lot sizes manually across graded scenarios, then verify.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 2,
      xpReward: 60,
      prerequisites: ["rm-m2-sizing-formula"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Do the Math by Hand" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Calculators are convenient, but the math must live in your head — you'll size positions live, under time pressure, sometimes on a phone. Work each scenario manually: risk amount first, then divide by (stop × pip value). Then verify.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "position-size-calculator",
            scenarios: [
              {
                label: "Standard day trade",
                account: 10000,
                riskPercent: 1,
                stopPips: 20,
                pipValuePerLot: 10,
              },
              {
                label: "Wider swing stop",
                account: 10000,
                riskPercent: 1,
                stopPips: 50,
                pipValuePerLot: 10,
              },
              {
                label: "Small account, tight stop",
                account: 2000,
                riskPercent: 1,
                stopPips: 10,
                pipValuePerLot: 10,
              },
              {
                label: "Half-percent risk in drawdown",
                account: 8000,
                riskPercent: 0.5,
                stopPips: 25,
                pipValuePerLot: 10,
              },
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Scenario 2 has the same account and risk as Scenario 1 but half the position size — because the stop is 2.5× wider. If that surprises you, re-run the formula until it doesn't.",
          metadata: { variant: "tip" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Risk amount ÷ (stop pips × pip value) = lots. Practise until it takes ten seconds — the market won't wait longer.",
        },
      ],
    },
    {
      id: "rm-m2-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "position-sizing-check",
      title: "Position Sizing Check",
      description: "Test the formula under different scenarios.",
      lessonType: "quiz",
      difficulty: "intermediate",
      order: 3,
      xpReward: 50,
      prerequisites: ["rm-m2-sizing-practice"],
      estimatedMinutes: 0,
      quizId: "position-sizing-check",
      contentBlocks: [],
    },
  ],
}
