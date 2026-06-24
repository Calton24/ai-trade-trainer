import { buildConcept } from "@/content/book-lab/concept-builder"
import type { BookLabConcept } from "@/lib/book-lab/types"

const SECTION = "bl-execution"

export const executionConcepts: BookLabConcept[] = [
  buildConcept({
    slug: "enter-with-plan",
    sectionId: SECTION,
    title: "Entering With a Plan",
    summary: "Every click should trace back to a written trigger, stop, and target.",
    explanation:
      "Execution is the last step, not the first decision. If prep is done, entry is calm — click when trigger hits, size is calculated, stops are live.",
    whyMatters: "Impulsive entries destroy R:R and journaling clarity.",
    commonMistake: "Partial plan — entry yes, stop 'later'.",
    reflectionPrompt: "What will you read aloud before each entry?",
    relatedConceptSlugs: ["avoid-chasing", "reading-entry-candles"],
    quizQuestions: [{
      question: "Before entering you should know:",
      options: [
        { id: "a", text: "Trigger, stop, target, and size" },
        { id: "b", text: "Only the ticker" },
        { id: "c", text: "Nothing — react fast" },
        { id: "d", text: "Maximum leverage only" },
      ],
      correctAnswer: "a",
      explanation: "Complete plan before execution.",
    }],
  }),
  buildConcept({
    slug: "scaling-in-out",
    sectionId: SECTION,
    title: "Scaling In & Out",
    summary: "Add or reduce size in pieces instead of one all-or-nothing clip.",
    explanation:
      "Scaling out locks partial profit at first target. Scaling in adds only if plan allows and total risk stays within limit. Beginners should master single entry/exit first.",
    whyMatters: "Scaling manages emotion and smooths P&L path.",
    commonMistake: "Adding to losers without updating total risk.",
    reflectionPrompt: "Will you scale out at first target?",
    relatedConceptSlugs: ["partial-profits", "moving-stop-carefully"],
    quizQuestions: [{
      question: "Scaling out means:",
      options: [
        { id: "a", text: "Selling part of position at planned levels" },
        { id: "b", text: "Removing stop losses" },
        { id: "c", text: "Doubling size when red" },
        { id: "d", text: "Ignoring targets" },
      ],
      correctAnswer: "a",
      explanation: "Partials reduce risk on winners.",
    }],
  }),
  buildConcept({
    slug: "partial-profits",
    sectionId: SECTION,
    title: "Taking Partial Profits",
    summary: "Bank some gain at first target; let runner work with stop at breakeven.",
    explanation:
      "Partials reduce regret when runners reverse. Move stop to breakeven only after meaningful progress and according to plan — not instantly on every tick.",
    whyMatters: "Green-to-red trades hurt confidence and stats.",
    commonMistake: "Taking partials randomly with no written rule.",
    reflectionPrompt: "What percent will you sell at first target?",
    relatedConceptSlugs: ["scaling-in-out", "exit-plan"],
    quizQuestions: [{
      question: "Partial profits help:",
      options: [
        { id: "a", text: "Lock gain while leaving room for more" },
        { id: "b", text: "Eliminate all losing trades" },
        { id: "c", text: "Skip stop losses" },
        { id: "d", text: "Avoid journaling" },
      ],
      correctAnswer: "a",
      explanation: "Partials balance certainty and upside.",
    }],
  }),
  buildConcept({
    slug: "moving-stop-carefully",
    sectionId: SECTION,
    title: "Moving Stop Loss Carefully",
    summary: "Trail stops with structure — never widen risk to avoid pain.",
    explanation:
      "Only move stops in your favor: breakeven after target one, trail below higher low. Widening stops increases risk and breaks math.",
    whyMatters: "Stop moves are common leak for beginners.",
    commonMistake: "Moving stop farther away when price approaches it.",
    chartDemoId: "demo-risk-reward",
    reflectionPrompt: "When are you allowed to move a stop?",
    relatedConceptSlugs: ["stop-loss", "partial-profits"],
    quizQuestions: [{
      question: "Acceptable stop move:",
      options: [
        { id: "a", text: "Trail stop up after new structure forms" },
        { id: "b", text: "Move stop farther from entry when losing" },
        { id: "c", text: "Remove stop entirely" },
        { id: "d", text: "Move stop randomly" },
      ],
      correctAnswer: "a",
      explanation: "Only reduce risk or lock profit — never widen.",
    }],
  }),
  buildConcept({
    slug: "avoid-chasing",
    sectionId: SECTION,
    title: "Avoid Chasing",
    summary: "If price already ran without you, wait for next setup — don't market buy the top.",
    explanation:
      "Chasing extended candles with tight stops and poor R:R loses over time. Missed trades cost nothing; bad entries cost capital.",
    whyMatters: "FOMO entries are a top beginner leak.",
    commonMistake: "Jumping in after 3 green candles with no pullback plan.",
    chartDemoId: "demo-chasing-late-entry",
    practiceDrill: {
      type: "spot-mistake",
      title: "Spot the chase",
      prompt: "Price extended far from support with long upper wicks — best action?",
      chartScenarioId: "demo-chasing-late-entry",
      options: [
        { id: "wait", text: "Wait for pullback or skip", correct: true, feedback: "Late entries often offer poor R:R." },
        { id: "chase", text: "Market buy immediately", correct: false, feedback: "Chasing extended moves is a common mistake." },
      ],
      correctFeedback: "Patience beats FOMO.",
      riskyFeedback: "Chasing increases risk without planned stop room.",
      improvementTip: "Define entry zone before the move happens.",
    },
    reflectionPrompt: "What will you do when you miss a breakout?",
    relatedConceptSlugs: ["avoid-late-entries", "fear-of-missing-out"],
    quizQuestions: [{
      question: "Chasing usually means:",
      options: [
        { id: "a", text: "Entering late after a large move without plan" },
        { id: "b", text: "Waiting for retest" },
        { id: "c", text: "Using a defined stop" },
        { id: "d", text: "Skipping extended names" },
      ],
      correctAnswer: "a",
      explanation: "Late impulsive entries = chasing.",
    }],
  }),
  buildConcept({
    slug: "avoid-late-entries",
    sectionId: SECTION,
    title: "Avoid Late Entries",
    summary: "If R:R is gone, the trade is gone — there will be another.",
    explanation:
      "Late entries often mean stop far away or target too close. Check distance to structure before clicking. No edge means no trade.",
    whyMatters: "Late entries turn winners into coin flips.",
    commonMistake: "Entering because 'it might keep going' with 0.3R left.",
    reflectionPrompt: "What max extension from VWAP will you allow?",
    relatedConceptSlugs: ["avoid-chasing", "risk-reward-ratio"],
    quizQuestions: [{
      question: "Late entry problem:",
      options: [
        { id: "a", text: "Poor R:R and stop placement" },
        { id: "b", text: "Guaranteed profit" },
        { id: "c", text: "Better fills always" },
        { id: "d", text: "No need for stops" },
      ],
      correctAnswer: "a",
      explanation: "Late entries compress reward vs risk.",
    }],
  }),
  buildConcept({
    slug: "reading-entry-candles",
    sectionId: SECTION,
    title: "Reading Candles Near Entry",
    summary: "Watch wicks, closes, and volume at your trigger — not just color.",
    explanation:
      "A strong entry candle closes near its high with volume. Doji or long upper wick at resistance warns rejection. Let candles confirm, not hype.",
    whyMatters: "Micro structure at entry improves timing.",
    commonMistake: "Buying green hammer at resistance without volume.",
    chartDemoId: "demo-candlestick-anatomy",
    reflectionPrompt: "What candle shape confirms your setup?",
    relatedConceptSlugs: ["wait-for-confirmation", "enter-with-plan"],
    quizQuestions: [{
      question: "Strong long entry candle often:",
      options: [
        { id: "a", text: "Closes near high with volume" },
        { id: "b", text: "Has long upper wick at resistance" },
        { id: "c", text: "Always guarantees next day gap" },
        { id: "d", text: "Removes need for stops" },
      ],
      correctAnswer: "a",
      explanation: "Close and volume matter at trigger.",
    }],
  }),
]
