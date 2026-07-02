import { buildZoneConcept } from "@/content/library/trading-in-the-zone/build"
import type { BookLabConcept } from "@/lib/book-lab/types"

const SECTION = "tz-consistency"

export const consistencyConcepts: BookLabConcept[] = [
  buildZoneConcept({
    slug: "the-psychology-of-consistency",
    sectionId: SECTION,
    title: "The Psychology of Consistency",
    summary:
      "Consistency is a state of mind, not a string of wins. It comes from how you think, not what the market does.",
    difficulty: "intermediate",
    explanation:
      "Consistent results are produced by a consistent mental state — one that is carefree, focused, and free of the need to be right. You can't control the market, so you can't make consistency depend on outcomes. You can control whether you show up with the same disciplined, probabilistic mindset every session. When your inner state is stable, your execution becomes stable, and consistent execution is what eventually produces consistent equity.",
    whyMatters:
      "Chasing consistent profits directly leads to forcing trades; cultivating a consistent mindset produces profits as a by-product.",
    commonMistake:
      "Judging your consistency by the day's P&L instead of by how well you followed your process.",
    reflectionPrompt:
      "Did you trade your plan today, regardless of whether you made or lost money?",
    relatedConceptSlugs: ["becoming-process-focused", "building-trust-in-your-edge"],
    quizQuestions: [
      {
        question: "Consistency primarily comes from:",
        options: [
          { id: "a", text: "A stable, disciplined state of mind" },
          { id: "b", text: "A streak of winning trades" },
          { id: "c", text: "Controlling the market" },
          { id: "d", text: "Larger position sizes" },
        ],
        correctAnswer: "a",
        explanation: "Stable mindset produces stable execution.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "building-trust-in-your-edge",
    sectionId: SECTION,
    title: "Building Trust in Your Edge",
    summary:
      "You can only execute fearlessly when you genuinely trust that your edge works over a series of trades.",
    difficulty: "intermediate",
    explanation:
      "Trust isn't blind faith — it's earned by defining your edge precisely and testing it across enough trades to see its true expectancy. Once you know your edge has a positive expectancy over a sample, individual losses stop shaking you, because you understand they're part of the distribution. Trust in your edge is what lets you pull the trigger without hesitation and hold without panic. Without it, every loss feels like proof you're broken.",
    whyMatters:
      "Without trust in your edge, you'll abandon it at the worst possible moment — right before it works.",
    commonMistake:
      "Switching strategies every week, so you never gather enough data to trust any of them.",
    reflectionPrompt:
      "Can you describe your edge in one sentence and state its expectancy over your last 50 trades?",
    relatedConceptSlugs: ["thinking-in-probabilities", "accepting-random-outcomes"],
    quizQuestions: [
      {
        question: "Trust in your edge is built by:",
        options: [
          { id: "a", text: "Defining it precisely and testing it over a sample" },
          { id: "b", text: "Hoping it works" },
          { id: "c", text: "Winning the next trade" },
          { id: "d", text: "Avoiding all losses" },
        ],
        correctAnswer: "a",
        explanation: "Earned through definition and evidence over a series.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "accepting-random-outcomes",
    sectionId: SECTION,
    title: "Accepting Random Outcomes",
    summary:
      "Wins and losses are randomly distributed within a series, even when your edge is real.",
    difficulty: "intermediate",
    explanation:
      "Imagine your edge wins 60% of the time. You still cannot know whether the next trade is one of the winners or one of the losers — and losses can cluster. Accepting random distribution means you stop reading meaning into any single result. A loss doesn't mean your edge failed; a win doesn't mean you're a genius. This acceptance is what allows you to take every signal without flinching and without overconfidence.",
    whyMatters:
      "If you can't accept randomness, a normal cluster of losses will convince you to quit a working strategy.",
    commonMistake:
      "Concluding 'the setup stopped working' after three losses that are statistically normal.",
    reflectionPrompt:
      "How would you feel after five losses in a row if you fully trusted the randomness of the series?",
    relatedConceptSlugs: ["thinking-in-probabilities", "handling-losing-streaks"],
    quizQuestions: [
      {
        question: "Within a winning edge, losses are:",
        options: [
          { id: "a", text: "Randomly distributed and can cluster" },
          { id: "b", text: "Evenly spaced out" },
          { id: "c", text: "A sign the edge is broken" },
          { id: "d", text: "Always avoidable" },
        ],
        correctAnswer: "a",
        explanation: "Random distribution means clusters are normal.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "letting-go-of-individual-trades",
    sectionId: SECTION,
    title: "Letting Go of Individual Trades",
    summary:
      "Detach from the outcome of any one trade so it can't distort the next one.",
    difficulty: "advanced",
    explanation:
      "The result of a single trade is noise; the result of your process over hundreds of trades is signal. When you cling to individual outcomes, you ride an emotional roller coaster that wrecks your judgment. Letting go means executing the trade, accepting whatever happens, and immediately returning to a neutral state for the next opportunity. This isn't indifference — it's the professional's ability to care deeply about the process while staying unattached to any single result.",
    whyMatters:
      "Attachment to single outcomes is the root of revenge trading and euphoric over-sizing.",
    commonMistake:
      "Replaying a loss for hours, then entering the next trade angry and oversized.",
    reflectionPrompt:
      "What ritual will you use to reset between trades so the last one doesn't infect the next?",
    relatedConceptSlugs: ["every-trade-is-unique", "emotional-self-control"],
    quizQuestions: [
      {
        question: "Letting go of individual trades allows you to:",
        options: [
          { id: "a", text: "Return to a neutral state for the next opportunity" },
          { id: "b", text: "Predict the next outcome" },
          { id: "c", text: "Stop caring about your process" },
          { id: "d", text: "Justify revenge trades" },
        ],
        correctAnswer: "a",
        explanation: "Detachment keeps your next decision clean.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "becoming-process-focused",
    sectionId: SECTION,
    title: "Becoming Process Focused",
    summary:
      "Measure yourself by the quality of your decisions, not the size of your P&L.",
    difficulty: "intermediate",
    explanation:
      "Outcome focus puts your self-worth at the mercy of randomness; process focus puts it under your control. A process-focused trader asks 'Did I follow my rules?' rather than 'Did I make money?' Over time, good process and a real edge produce good outcomes — but only the process is something you can repeat on demand. Grading your process daily builds the discipline loop that makes consistency inevitable.",
    whyMatters:
      "Outcome obsession rewards lucky rule-breaks and punishes disciplined losses — exactly backwards.",
    commonMistake:
      "Feeling great about a reckless trade that happened to win, and terrible about a disciplined trade that lost.",
    reflectionPrompt:
      "Design a simple A–F grade for your process today, independent of profit.",
    relatedConceptSlugs: ["the-psychology-of-consistency", "following-rules"],
    quizQuestions: [
      {
        question: "A process-focused trader primarily asks:",
        options: [
          { id: "a", text: "'Did I follow my rules?'" },
          { id: "b", text: "'Did I make money today?'" },
          { id: "c", text: "'Did I beat the market?'" },
          { id: "d", text: "'Was I right?'" },
        ],
        correctAnswer: "a",
        explanation: "Process is repeatable; outcomes are partly random.",
      },
    ],
  }),
]
