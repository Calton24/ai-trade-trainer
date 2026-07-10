import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "risk-management"
const MODULE_ID = "rm-m5"

/** Module 5 — Drawdown & Professional Rules: streaks, loss limits, and the rules that stick. */
export const professionalRulesModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Drawdown & Professional Rules",
  description:
    "Daily and weekly loss limits, revenge trading, and the professional rulebook — survive first, grow second.",
  order: 5,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "rm-m5-drawdown",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "drawdown-and-loss-limits",
      title: "Drawdown & Loss Limits",
      description: "Max daily loss, max weekly loss — circuit breakers for your account.",
      lessonType: "reading",
      difficulty: "intermediate",
      order: 1,
      xpReward: 45,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Circuit Breakers" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Stock exchanges halt trading after extreme drops — because decisions made in panic are reliably terrible. Your account needs the same mechanism. A daily loss limit (commonly 2–3%, i.e. 2–3 consecutive full losses) and a weekly limit (commonly 5–6%) define in advance the moment you stop trading and walk away.",
        },
        {
          id: "def1",
          type: "definition",
          content:
            "A pre-committed maximum loss (per day or week) that, once hit, ends trading for that period — no exceptions, no 'one more trade'.",
          metadata: { term: "Loss limit" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Why limits work: losses cluster. A bad day usually means your read on the market is off, conditions changed, or your emotional state is degraded — all three predict further losses. The limit removes the decision from the person least qualified to make it: you, mid-tilt.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "Two losses by 10am (−2%). Your daily limit says stop. The frustrated version of you wants to 'win it back' — historically, that version turns −2% days into −8% days. The limit exists precisely because you know this about yourself.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Revenge trading — immediately re-entering to recover a loss — is the single most destructive behaviour in trading. Loss limits are its only reliable antidote.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Set a daily limit (2–3%) and weekly limit (5–6%) BEFORE the week starts. Hitting a limit means stopping — that's the entire point.",
        },
      ],
    },
    {
      id: "rm-m5-rulebook",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "the-professional-rulebook",
      title: "The Professional Rulebook",
      description: "Never risk over 1%. Never move the stop. Protect capital. Survive first.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 2,
      xpReward: 55,
      prerequisites: ["rm-m5-drawdown"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Rules That Don't Bend" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Every module so far compresses into a short rulebook. None of it is complicated — the difficulty is following it on the day you're euphoric, furious, or desperate. That's why rules are written down and absolute: judgment calls degrade under emotion; rules don't.",
        },
        {
          id: "checklist1",
          type: "checklist",
          content: "The professional risk rulebook:",
          metadata: {
            items: [
              "Rule #1: Protect your capital — survival comes before growth",
              "Never risk more than 1% of the account on a single trade",
              "Every trade has a stop loss, placed at invalidation, before entry",
              "Never move a stop loss away from price — not once, not ever",
              "Position size is calculated from risk and stop — never from feeling",
              "Respect daily and weekly loss limits without negotiation",
              "No revenge trades: after a loss, the next trade must qualify on its own",
              "Risk stays identical after wins and after losses — no streak sizing",
            ],
          },
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "journal-review",
            prompt: "Review these trades. Which rule did each one break?",
            entries: [
              {
                summary:
                  "EUR/USD long went against me, so I moved the stop 20 pips lower to give it room. It kept falling — lost 2.4% instead of 1%.",
                options: ["Never move the stop", "Risk over 1%", "No rule broken"],
                correct: "Never move the stop",
                explain:
                  "Moving the stop away converted a planned 1% loss into 2.4%. The original invalidation was correct — the trade WAS wrong.",
              },
              {
                summary:
                  "Lost three in a row this morning (−3%), hit my daily limit, but a perfect setup appeared so I took it at double size to recover.",
                options: [
                  "Ignored loss limit + revenge sizing",
                  "Never move the stop",
                  "No rule broken",
                ],
                correct: "Ignored loss limit + revenge sizing",
                explain:
                  "Two violations stacked: trading past the daily limit, and doubling size to 'win it back' — the classic account-killer combination.",
              },
              {
                summary:
                  "Took a textbook break-and-retest, 1% risk, stop below structure. It hit the stop. Down 1% on the day.",
                options: ["Risk over 1%", "No rule broken", "Never move the stop"],
                correct: "No rule broken",
                explain:
                  "A rule-following loss is a GOOD trade. Process was perfect; the outcome was variance. This is what professional losing looks like.",
              },
              {
                summary:
                  "Won four in a row, felt unstoppable, so I tripled my size on the fifth trade. It lost — gave back all four wins plus more.",
                options: ["Streak sizing", "No rule broken", "Ignored loss limit"],
                correct: "Streak sizing",
                explain:
                  "Winning streaks don't change the odds of the next trade. Risk stays identical after wins — euphoria sizing is revenge trading's twin.",
              },
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Grade yourself on rule adherence, not P&L. A green day that broke rules is a loss in disguise; a red day that followed every rule is a win in progress.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Eight rules, zero exceptions. Judge every trading day by how many you kept — the money follows adherence.",
        },
      ],
    },
    {
      id: "rm-m5-capstone",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "capstone-ten-trade-gauntlet",
      title: "Capstone: The Ten-Trade Gauntlet",
      description: "Size, stop, and decide across a full sequence of scenarios.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 3,
      xpReward: 70,
      prerequisites: ["rm-m5-rulebook"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Run the Full Risk Process" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Account: $10,000. Risk: 1% per trade. Daily limit: 3%. Work through the sequence — calculate sizes, judge stops, and enforce the rules as the day unfolds.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "position-size-calculator",
            scenarios: [
              {
                label: "Trade 1 — EUR/USD, 20-pip stop behind the higher low",
                account: 10000,
                riskPercent: 1,
                stopPips: 20,
                pipValuePerLot: 10,
              },
              {
                label: "Trade 2 — GBP/USD, wider 40-pip structural stop",
                account: 10000,
                riskPercent: 1,
                stopPips: 40,
                pipValuePerLot: 10,
              },
              {
                label: "Trade 3 — after two losses, account $9,800, still 1%",
                account: 9800,
                riskPercent: 1,
                stopPips: 25,
                pipValuePerLot: 10,
              },
            ],
          },
        },
        {
          id: "w2",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "The day continues. Apply the rulebook.",
            options: ["Take the trade", "Skip / stop for the day", "Move the stop"],
            scenarios: [
              {
                situation:
                  "Trade 3 also lost. You're down 3% — exactly your daily limit. A beautiful USD/JPY setup forms.",
                correct: "Skip / stop for the day",
                coaching:
                  "The limit is hit; the day is over. The quality of the next setup is irrelevant — that's what makes it a limit.",
              },
              {
                situation:
                  "Next morning: your EUR/USD long is 5 pips from the stop and 'looks like it wants to bounce'.",
                correct: "Skip / stop for the day",
                coaching:
                  "Trick question — there's nothing to DO. The stop is placed at invalidation; let it decide. Touching it is the violation.",
              },
              {
                situation:
                  "Fresh setup: clean uptrend pullback, logical stop 30 pips below at the higher low, 1:2 target at prior high, risk 1%, no news, within limits.",
                correct: "Take the trade",
                coaching:
                  "Every box ticked: structure stop, calculated size, sound ratio, limits respected. THIS is the only kind of trade you take.",
              },
            ],
          },
        },
        {
          id: "safety1",
          type: "safety-note",
          content:
            "Educational simulator only. Not financial advice. These scenarios train process — real markets add slippage, gaps, and emotion.",
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Size from the formula, stop at invalidation, limits enforced without debate. You now hold the complete professional risk toolkit.",
        },
      ],
    },
    {
      id: "rm-m5-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "risk-management-assessment",
      title: "Risk Management Assessment",
      description: "The path milestone — the full risk system under exam conditions.",
      lessonType: "quiz",
      difficulty: "intermediate",
      order: 4,
      xpReward: 100,
      prerequisites: ["rm-m5-capstone"],
      estimatedMinutes: 0,
      quizId: "risk-management-assessment",
      contentBlocks: [],
    },
  ],
}
