import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "trading-psychology"
const MODULE_ID = "tp-m5"

/** Module 5 — The Decision Framework: trade / wait / skip, plus the journal-review capstone. */
export const decisionFrameworkModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "The Decision Framework",
  description:
    "Trade, wait, or skip — discipline as a practised decision, ending with the journal-review capstone.",
  order: 5,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "tp-m5-trade-wait-skip",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "trade-wait-skip",
      title: "Trade, Wait, Skip",
      description: "Three verdicts, no execution — pure decision training.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 1,
      xpReward: 55,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Discipline Is a Decision You Can Drill" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Every chart resolves into one of three verdicts. TRADE: the setup fully qualifies right now. WAIT: the idea is forming but incomplete — price hasn't reached the zone, the candle hasn't closed, news is minutes away. SKIP: something disqualifies it — messy structure, conflicting context, or your own degraded state. Beginners know only TRADE; the other two verdicts are where professionals make their money.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "Deliver the verdict. Decision only — no execution.",
            scenarios: [
              {
                situation:
                  "Uptrend confirmed on daily and 4H. Price pulling back toward your zone but still 25 pips above it. No news today.",
                correct: "Wait",
                coaching:
                  "Everything qualifies EXCEPT price location. Entering early 'so you don't miss it' surrenders the exact edge the zone provides. Set an alert; walk away.",
              },
              {
                situation:
                  "Price reached the zone, printed a rejection candle, structure clean, risk 1%, stop fits behind the zone, calendar clear.",
                correct: "Trade",
                coaching:
                  "Full qualification: context, location, trigger, risk, calendar. When the checklist completes, execution should be immediate and unemotional.",
              },
              {
                situation:
                  "Beautiful setup forming — but you slept 4 hours, argued with your partner this morning, and feel a strong need to 'make today count'.",
                correct: "Skip",
                coaching:
                  "The chart qualifies; the trader doesn't. 'Making today count' is emotional urgency — the exact state that turns good setups into bad trades.",
              },
              {
                situation:
                  "Range-bound chart, overlapping candles, no clear swing structure. But you haven't traded in three days and feel rusty.",
                correct: "Skip",
                coaching:
                  "Boredom is not a setup. Messy structure fails the filter no matter how long you've waited — the drought ends when the market provides, not when you're impatient.",
              },
              {
                situation:
                  "Setup 90% complete on GBP/USD — waiting on the current 4H candle to close for confirmation. 40 minutes remain.",
                correct: "Wait",
                coaching:
                  "Confirmation pending = wait, by definition. Entering before the close trades a DIFFERENT, unconfirmed setup with worse odds.",
              },
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Count your verdicts weekly. A healthy week might be 3 trades, 6 waits, 11 skips. If trades dominate, your filter isn't filtering.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Trade only on full qualification. Wait when incomplete. Skip on any disqualifier — including your own state. Three verdicts, drilled until automatic.",
        },
      ],
    },
    {
      id: "tp-m5-capstone",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "capstone-journal-review",
      title: "Capstone: The Week in Review",
      description: "Audit a full week's trading journal — find the mistakes, credit the discipline.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 2,
      xpReward: 70,
      prerequisites: ["tp-m5-trade-wait-skip"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Audit This Trader's Week" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Below is a week of journal entries from a developing trader. Your job is the weekly review: label each entry for what it really is. This is the exact skill you'll apply to your own journal every week from now on.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "journal-review",
            prompt: "Label each journal entry.",
            entries: [
              {
                summary:
                  "Mon: Long EUR/USD at the zone after rejection candle. 1% risk, stop behind structure. Hit 2R target. Felt calm throughout.",
                options: ["Good process", "Emotional mistake", "Rule break"],
                correct: "Good process",
                explain:
                  "Qualified setup, correct risk, calm execution, planned exit. The win is nice; the PROCESS is the point.",
              },
              {
                summary:
                  "Tue: Stopped out on GBP/USD (−1R). Re-entered same pair 4 minutes later at 2% risk because 'the level was even better now'. Lost again.",
                options: ["Good process", "Revenge trade", "Bad luck"],
                correct: "Revenge trade",
                explain:
                  "Four minutes after a loss, double risk, rationalised re-entry — textbook revenge anatomy. The second loss was structurally predictable.",
              },
              {
                summary:
                  "Wed: Saw a strong setup on USD/JPY but CPI was 15 minutes away. Skipped. The trade would have made 3R.",
                options: ["Missed opportunity", "Good process", "Fear-based skip"],
                correct: "Good process",
                explain:
                  "Skipping into red news is correct every single time — including when the trade would have won. Outcome bias says 'missed 3R'; process says 'rule followed'.",
              },
              {
                summary:
                  "Thu: Long AUD/USD, went against me. Removed the stop because it was 'about to bounce'. Ended −2.8R when I finally closed.",
                options: ["Bad luck", "Rule break: removed stop", "Good process"],
                correct: "Rule break: removed stop",
                explain:
                  "The moment the stop came off, this stopped being a trade and became a hope. −1R was the plan; −2.8R was the hope tax.",
              },
              {
                summary:
                  "Fri: Three qualifying setups appeared. Took the two where DXY agreed; skipped the one against it. One win (+2R), one loss (−1R). Journaled all three.",
                options: ["Overtrading", "Good process", "Fear-based hesitation"],
                correct: "Good process",
                explain:
                  "Selective execution with a context filter, normal risk, complete journaling. A +1R day — and more importantly, an A-grade process day.",
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
            prompt: "The weekly verdict: what should this trader work on next week?",
            options: [
              "Post-loss behaviour (cooling-off rule)",
              "Finding more setups",
              "Increasing position size",
            ],
            scenarios: [
              {
                situation:
                  "Summary: Mon good, Tue revenge trade, Wed good skip, Thu removed a stop after a position went red, Fri good. Both major failures happened AFTER losses.",
                correct: "Post-loss behaviour (cooling-off rule)",
                coaching:
                  "Exactly. The pattern isn't setup quality — it's what happens in the 30 minutes after a loss. A written cooling-off principle ('no orders for 30 minutes after any stop-out') targets the actual leak.",
              },
            ],
          },
        },
        {
          id: "safety1",
          type: "safety-note",
          content:
            "Educational simulator only. Not financial advice. Journal review builds self-awareness — the trader in these entries is fictional but the patterns are universal.",
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Weekly review finds the pattern behind the trades. This trader's edge isn't broken — their post-loss window is. Yours will have its own signature: find it.",
        },
      ],
    },
    {
      id: "tp-m5-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "trading-psychology-assessment",
      title: "Trading Psychology Assessment",
      description: "The path milestone — probabilities, emotions, habits, and decisions.",
      lessonType: "quiz",
      difficulty: "intermediate",
      order: 3,
      xpReward: 100,
      prerequisites: ["tp-m5-capstone"],
      estimatedMinutes: 0,
      quizId: "trading-psychology-assessment",
      contentBlocks: [],
    },
  ],
}
