import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "trading-psychology"
const MODULE_ID = "tp-m1"

/** Module 1 — Thinking in Probabilities: edge, expectancy, randomness, process vs outcome. */
export const probabilitiesModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Thinking in Probabilities",
  description:
    "Edge, random distribution of outcomes, and why process beats any single result.",
  order: 1,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "tp-m1-probabilities",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "trading-is-a-probability-game",
      title: "Trading Is a Probability Game",
      description: "Any trade can lose. Any series with an edge tends to win.",
      lessonType: "reading",
      difficulty: "intermediate",
      order: 1,
      xpReward: 45,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Casino's Secret" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "A casino doesn't know which spin of the roulette wheel it will win — and doesn't care. It knows that over thousands of spins, its small mathematical edge is certain to show up. Professional traders think identically: any INDIVIDUAL trade is a coin flip weighted slightly in their favour; the SERIES is where the profit lives.",
        },
        {
          id: "def1",
          type: "definition",
          content:
            "A repeatable condition under which your wins, over many occurrences, outweigh your losses. Edge lives in the series, never in the single trade.",
          metadata: { term: "Edge" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "This one idea dissolves most trading emotions. Why fear a loss? It's an expected, budgeted event — the casino doesn't panic when a gambler wins a hand. Why be euphoric after a win? It proves nothing — one outcome carries no information about your edge. Emotions attach to single results; professionals attach to the distribution.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "A trader with a genuine 55% edge flips through outcomes: L L W L W W L W W W. The early losses FEEL like failure. Over 500 trades, the same edge is a smooth upward curve. Nothing changed except the sample size.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "You can do everything right and lose. You can do everything wrong and win. Individual outcomes lie — only samples tell the truth.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Trade like the casino: small edge, endless repetitions, zero emotional attachment to any single spin.",
        },
      ],
    },
    {
      id: "tp-m1-coin-flip",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "experience-randomness",
      title: "Experience Randomness",
      description: "Flip the coin. Watch streaks appear from pure 50/50 chance.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 2,
      xpReward: 50,
      prerequisites: ["tp-m1-probabilities"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Streaks Are Not Signals" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Run the simulator below. Flip 20, then 20 more. You will see streaks — four, five, six identical results in a row — from a process that is EXACTLY 50/50. Your trading results stream from a similar generator. A losing streak does not mean your edge died; a winning streak does not mean you've 'figured it out'.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: { kind: "coin-flip" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "The danger isn't the streak — it's your INTERPRETATION of it. Traders abandon profitable systems during normal losing runs and triple size during normal winning runs. Both reactions replace math with feelings, and both destroy the edge they're reacting to.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Before changing anything about your system, ask: is this result outside what randomness would produce? Five losses at a 50% win rate is NORMAL. Change nothing.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Random processes produce streaks. Expect them, budget for them, and never let a streak redesign your system mid-flight.",
        },
      ],
    },
    {
      id: "tp-m1-process",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "process-over-outcome",
      title: "Process Over Outcome",
      description: "Grade decisions by their quality, not their result.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 3,
      xpReward: 50,
      prerequisites: ["tp-m1-coin-flip"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Good Decisions, Bad Outcomes" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "In poker they call it 'resulting' — judging a decision by its outcome. Calling an all-in with the best possible hand and losing to a lucky river card was still the RIGHT call. Trading is identical: a rule-following trade that loses was a good trade; a rule-breaking trade that wins was a bad trade that got lucky — and luck teaches the worst lessons.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "Grade the DECISION, ignore the outcome.",
            options: ["Good decision", "Bad decision"],
            scenarios: [
              {
                situation:
                  "Followed every rule — context, structure stop, 1% risk. The trade hit the stop. −1R.",
                correct: "Good decision",
                coaching:
                  "Perfect process, negative variance. Repeat this decision 100 times and the edge pays. This loss was a business expense.",
              },
              {
                situation:
                  "No setup existed, but boredom won. Entered without a stop 'just for a quick scalp'. Made +2R.",
                correct: "Bad decision",
                coaching:
                  "The win is the WORST part — it rewards behaviour that will eventually produce a catastrophic loss. Lucky and wrong.",
              },
              {
                situation:
                  "Setup appeared but news was 20 minutes away. Skipped. The move would have won +3R.",
                correct: "Good decision",
                coaching:
                  "Skipping into news is correct EVERY time, including the times the trade would have worked. The missed profit is the cost of a sound rule.",
              },
              {
                situation:
                  "Hit the daily loss limit, stopped, journaled, closed the laptop. Missed a winning setup an hour later.",
                correct: "Good decision",
                coaching:
                  "Limits only protect you if they're unconditional. This 'missed win' bought you protection from every future tilt spiral.",
              },
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "If you grade yourself by outcomes, the market will train you into a gambler. If you grade by process, it will train you into a professional.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Decisions are gradeable the moment you make them; outcomes need hundreds of repetitions to mean anything. Grade what you control.",
        },
      ],
    },
    {
      id: "tp-m1-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "probabilities-check",
      title: "Probabilities Check",
      description: "Test edge, randomness, and process thinking.",
      lessonType: "quiz",
      difficulty: "intermediate",
      order: 4,
      xpReward: 50,
      prerequisites: ["tp-m1-process"],
      estimatedMinutes: 0,
      quizId: "probabilities-check",
      contentBlocks: [],
    },
  ],
}
