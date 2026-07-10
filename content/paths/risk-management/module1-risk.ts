import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "risk-management"
const MODULE_ID = "rm-m1"

/** Module 1 — Understanding Risk: why traders fail, risk of ruin, percentage risk. */
export const understandingRiskModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Understanding Risk",
  description:
    "Why most traders fail, the mathematics of ruin, and why capital protection comes before profit.",
  order: 1,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "rm-m1-why-traders-fail",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "why-traders-fail",
      title: "Why Traders Fail",
      description: "It's almost never the analysis — it's the risk.",
      lessonType: "reading",
      difficulty: "intermediate",
      order: 1,
      xpReward: 45,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Real Killer Isn't Bad Analysis" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Most failed traders could read charts reasonably well. What killed their accounts was risk: positions too large, stops moved or removed, losses doubled-down on, and one bad day allowed to erase fifty good ones. Analysis determines how OFTEN you win; risk management determines whether you SURVIVE long enough for winning to matter.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "Trader A wins 60% of trades but risks 10% per trade — a normal 5-loss streak costs 41% of the account, and panic does the rest. Trader B wins only 45% but risks 1% with 2:1 reward — mathematically profitable and emotionally survivable. B outlives and outearns A.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "You can be right 6 times out of 10 and still go broke. You can be wrong 6 times out of 10 and still grow. Risk settings decide which.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "This path teaches the complete professional risk toolkit: percentage risk, position sizing, logical stops, reward-to-risk, drawdown control, and the rules that make it all stick under pressure. Everything else in your trading sits on top of this foundation.",
        },
        {
          id: "safety1",
          type: "safety-note",
          content:
            "Educational simulator only. Not financial advice. Risk management reduces the damage of losses; it cannot eliminate them.",
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Accounts die from oversized risk, not imperfect analysis. Survival is the first goal; profit is what survival eventually allows.",
        },
      ],
    },
    {
      id: "rm-m1-risk-of-ruin",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "risk-of-ruin",
      title: "Risk of Ruin",
      description: "The brutal math of losing streaks and recovery.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 2,
      xpReward: 50,
      prerequisites: ["rm-m1-why-traders-fail"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Drawdown Math Is Not Symmetrical" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Lose 10% and you need 11% to recover. Lose 25% → need 33%. Lose 50% → need 100%. Lose 90% → need 900%. The deeper the hole, the exponentially harder the climb. This asymmetry is why professionals obsess about limiting each loss — small losses are recoverable noise; large ones are mathematical traps.",
        },
        {
          id: "def1",
          type: "definition",
          content:
            "The probability that a trading approach eventually loses so much capital that recovery (or continuing) becomes impossible. Driven by risk per trade, win rate, and discipline.",
          metadata: { term: "Risk of ruin" },
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "match-pairs",
            prompt: "Match each drawdown to the gain required to recover it.",
            pairs: [
              { left: "Lose 10%", right: "Need +11%" },
              { left: "Lose 25%", right: "Need +33%" },
              { left: "Lose 50%", right: "Need +100%" },
              { left: "Lose 75%", right: "Need +300%" },
            ],
          },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Losing streaks are guaranteed, even with an edge. A 50% win rate produces a 5-loss streak roughly every 32 sequences — several times a year for an active trader. At 1% risk that streak costs ~5%. At 10% risk it costs ~41% and requires a 69% gain to repair.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Plan for the losing streak you WILL have, not the winning streak you hope for. Your risk per trade should make the inevitable 5–8 loss run boring.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Losses compound against you asymmetrically. Keep each one small enough that a normal streak is an inconvenience, never a catastrophe.",
        },
      ],
    },
    {
      id: "rm-m1-percentage-risk",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "percentage-risk",
      title: "Percentage Risk",
      description: "The 1% rule — fixed fraction risk that scales with your account.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 3,
      xpReward: 50,
      prerequisites: ["rm-m1-risk-of-ruin"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Risk a Fraction, Not a Feeling" },
        {
          id: "def1",
          type: "definition",
          content:
            "Risking a fixed percentage of current account balance on every trade — professionally, 1% or less. The dollar amount scales down in drawdowns and up in growth automatically.",
          metadata: { term: "Percentage risk" },
        },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Fixed-dollar risk ('I risk $100 per trade') breaks in drawdowns: as the account shrinks, $100 becomes a larger and larger fraction. Percentage risk self-corrects — 1% of a shrinking account shrinks with it, extending your survival dramatically. Twenty consecutive 1% losses leave you with 82% of your account. Twenty $100 losses on a $2,000 account leave you with nothing.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "Account $10,000, risk 1% = $100 per trade. After a rough month the account is $9,000 — 1% is now $90. After a good quarter it's $12,000 — 1% is $120. The risk breathes with the account.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "Check the risk maths.",
            options: ["$50", "$100", "$150"],
            scenarios: [
              {
                situation: "Account $10,000. Risk 1%. How much is at risk per trade?",
                correct: "$100",
                coaching: "1% of $10,000 = $100. Simple — and non-negotiable.",
              },
              {
                situation: "Account dropped to $5,000. Risk 1%. Dollar risk now?",
                correct: "$50",
                coaching: "1% of $5,000 = $50. In drawdown, percentage risk automatically gets defensive.",
              },
              {
                situation: "Account grew to $15,000. Risk 1%. Dollar risk now?",
                correct: "$150",
                coaching: "1% of $15,000 = $150. Growth compounds — without ever increasing the percentage.",
              },
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Increasing risk percentage after wins ('I'm hot right now') and after losses ('I need to recover') are the two classic paths to ruin. The percentage NEVER moves on emotion.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Risk 1% of current balance per trade. It scales down in losses, up in growth, and turns losing streaks into survivable noise.",
        },
      ],
    },
    {
      id: "rm-m1-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "understanding-risk-check",
      title: "Understanding Risk Check",
      description: "Test ruin math and percentage risk.",
      lessonType: "quiz",
      difficulty: "intermediate",
      order: 4,
      xpReward: 50,
      prerequisites: ["rm-m1-percentage-risk"],
      estimatedMinutes: 0,
      quizId: "understanding-risk-check",
      contentBlocks: [],
    },
  ],
}
