import { buildZoneConcept } from "@/content/library/trading-in-the-zone/build"
import type { BookLabConcept } from "@/lib/book-lab/types"

const SECTION = "tz-foundations"

export const foundationsConcepts: BookLabConcept[] = [
  buildZoneConcept({
    slug: "why-most-traders-lose",
    sectionId: SECTION,
    title: "Why Most Traders Lose",
    summary:
      "Most traders fail not from a lack of market knowledge, but from a mindset that can't handle uncertainty.",
    difficulty: "beginner",
    explanation:
      "Analysis is not the edge most beginners think it is. You can know patterns, indicators, and setups and still lose, because the real battle is internal. Losing traders treat every trade as a prediction that must be right, so each loss feels like a personal failure. That triggers fear, hesitation, and rule-breaking. The market exposes whatever you haven't resolved about being wrong, losing money, and missing out. Winning traders shift from 'being right' to 'executing a process with an edge over many trades.'",
    whyMatters:
      "If you believe more analysis will fix your results, you'll keep adding indicators instead of fixing the mental errors that actually drain your account.",
    commonMistake:
      "Blaming losses on the strategy or the market and searching for a 'better' system instead of examining how you respond to risk and being wrong.",
    reflectionPrompt:
      "Think of your last painful loss. Was the setup wrong, or was your reaction to it the real problem?",
    relatedConceptSlugs: ["the-nature-of-uncertainty", "thinking-in-probabilities"],
    quizQuestions: [
      {
        question: "According to this lesson, the main reason most traders lose is:",
        options: [
          { id: "a", text: "They lack a mindset that can handle uncertainty" },
          { id: "b", text: "They don't have enough indicators" },
          { id: "c", text: "They trade the wrong markets" },
          { id: "d", text: "They use the wrong broker" },
        ],
        correctAnswer: "a",
        explanation:
          "Knowledge is rarely the bottleneck — the inability to operate under uncertainty is.",
      },
      {
        question: "A winning mindset focuses on:",
        options: [
          { id: "a", text: "Executing an edge consistently over many trades" },
          { id: "b", text: "Being right on the next trade" },
          { id: "c", text: "Never taking a loss" },
          { id: "d", text: "Predicting every move correctly" },
        ],
        correctAnswer: "a",
        explanation: "Process over prediction is the core shift.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "the-nature-of-uncertainty",
    sectionId: SECTION,
    title: "The Nature of Uncertainty",
    summary:
      "Anything can happen on any single trade. The market has no obligation to do what your analysis expects.",
    difficulty: "beginner",
    explanation:
      "At any moment, another trader can enter and move price against you, regardless of how perfect your setup looks. Because there are unknown participants with unknown intentions, the outcome of any individual trade is fundamentally uncertain. This isn't a flaw to be solved — it's the permanent condition of trading. Once you truly accept that uncertainty is built in, a single loss stops feeling like a mistake and starts feeling like a normal, expected cost of doing business.",
    whyMatters:
      "If you expect certainty, every loss feels like betrayal and you start fighting the market instead of flowing with it.",
    commonMistake:
      "Treating a high-probability setup as a guarantee, then feeling cheated and revenge trading when it fails.",
    reflectionPrompt:
      "Write one sentence accepting that your very next trade could lose even if you do everything right.",
    relatedConceptSlugs: ["why-most-traders-lose", "every-trade-is-unique"],
    quizQuestions: [
      {
        question: "The outcome of any single trade is:",
        options: [
          { id: "a", text: "Fundamentally uncertain" },
          { id: "b", text: "Guaranteed by a good setup" },
          { id: "c", text: "Determined by your indicators" },
          { id: "d", text: "Predictable with enough analysis" },
        ],
        correctAnswer: "a",
        explanation: "Unknown participants make each outcome uncertain.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "thinking-in-probabilities",
    sectionId: SECTION,
    title: "Thinking in Probabilities",
    summary:
      "Your edge gives you favorable odds across a series of trades — never a promise on any one of them.",
    difficulty: "intermediate",
    explanation:
      "A casino doesn't know the result of the next hand, yet it profits reliably because it has a small edge played over thousands of hands. Traders work the same way. When you think in probabilities, you hold two truths at once: each trade has a random, unknown outcome, and the aggregate of many trades produces consistent results if your edge is real. This frees you to take every valid signal without attachment, because you're playing the series, not the single trade.",
    whyMatters:
      "Probabilistic thinking removes the emotional weight from any one trade, which is what lets you follow your rules under pressure.",
    commonMistake:
      "Abandoning a strategy after a few losses because you judged it on a tiny sample instead of a large series.",
    reflectionPrompt:
      "How many trades does your edge need before its win rate becomes meaningful?",
    relatedConceptSlugs: ["the-nature-of-uncertainty", "trading-like-a-casino"],
    quizQuestions: [
      {
        question: "Thinking in probabilities means accepting that:",
        options: [
          { id: "a", text: "Outcomes are random per trade but consistent over a series" },
          { id: "b", text: "Every trade should win" },
          { id: "c", text: "Edges guarantee individual results" },
          { id: "d", text: "Sample size doesn't matter" },
        ],
        correctAnswer: "a",
        explanation: "Random individually, reliable in aggregate.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "every-trade-is-unique",
    sectionId: SECTION,
    title: "Every Trade Is Unique",
    summary:
      "This trade is not the last one. The market doesn't remember your previous result and neither should you.",
    difficulty: "intermediate",
    explanation:
      "Even when two setups look identical, the participants behind them are different, so the outcomes are independent. The danger is carrying emotional residue: after a loss you hesitate, after a win you get reckless. Both reactions assume the new trade is connected to the old one. It isn't. Treating each trade as a fresh, independent event keeps your execution clean and stops one bad trade from becoming five.",
    whyMatters:
      "Linking trades emotionally is how a single loss snowballs into a revenge-driven losing streak.",
    commonMistake:
      "Sizing up to 'make back' the previous loss, or freezing because the last identical setup failed.",
    reflectionPrompt:
      "What will you tell yourself to reset emotionally before placing your next trade?",
    relatedConceptSlugs: ["the-nature-of-uncertainty", "letting-go-of-individual-trades"],
    quizQuestions: [
      {
        question: "Treating each trade as unique helps you:",
        options: [
          { id: "a", text: "Avoid carrying emotional residue between trades" },
          { id: "b", text: "Predict the next outcome" },
          { id: "c", text: "Guarantee a win after a loss" },
          { id: "d", text: "Justify bigger size after a loss" },
        ],
        correctAnswer: "a",
        explanation: "Independent events deserve a clean emotional slate.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "the-market-is-neutral",
    sectionId: SECTION,
    title: "The Market Is Neutral",
    summary:
      "Price isn't doing anything to you. The market generates information; you supply the meaning and the emotion.",
    difficulty: "beginner",
    explanation:
      "It feels personal when price stops you out and reverses, but the market has no awareness of you or your position. It simply produces a stream of neutral information. The fear, anger, or euphoria you feel is generated by your beliefs and expectations meeting that information — not by the market itself. When you stop personalizing price action, you can observe what's actually happening instead of reacting to an imagined opponent.",
    whyMatters:
      "Personalizing the market turns neutral data into emotional threats, which corrupts your decisions.",
    commonMistake:
      "Saying 'the market is out to get me' and trading to prove a point instead of reading information objectively.",
    reflectionPrompt:
      "Recall a moment you felt the market was 'against you.' What belief created that feeling?",
    relatedConceptSlugs: ["how-beliefs-shape-decisions", "eliminating-emotional-bias"],
    quizQuestions: [
      {
        question: "The emotion you feel during a trade is generated by:",
        options: [
          { id: "a", text: "Your beliefs and expectations meeting neutral information" },
          { id: "b", text: "The market targeting you" },
          { id: "c", text: "Your broker" },
          { id: "d", text: "Other traders' opinions of you" },
        ],
        correctAnswer: "a",
        explanation: "The market is neutral; meaning comes from you.",
      },
    ],
  }),
]
