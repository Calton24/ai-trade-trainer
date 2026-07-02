import { buildZoneConcept } from "@/content/library/trading-in-the-zone/build"
import type { BookLabConcept } from "@/lib/book-lab/types"

const SECTION = "tz-professional-thinking"

export const professionalThinkingConcepts: BookLabConcept[] = [
  buildZoneConcept({
    slug: "the-five-fundamental-truths",
    sectionId: SECTION,
    title: "The Five Fundamental Truths",
    summary:
      "Five core truths form the foundation of a probabilistic, fear-free trading mindset.",
    difficulty: "intermediate",
    explanation:
      "The five truths are: (1) anything can happen; (2) you don't need to know what will happen next to make money; (3) wins and losses are randomly distributed for any given edge; (4) an edge is simply a higher probability of one outcome over another; and (5) every moment in the market is unique. Internalizing these dissolves the need to be right and the fear of being wrong. When you operate from these truths, hesitation, revenge, and over-sizing lose their grip, because you've accepted the real nature of the game.",
    whyMatters:
      "These truths are the operating system for the carefree, disciplined state that produces consistency.",
    commonMistake:
      "Memorizing the truths intellectually but still trading as if you must predict the next move.",
    reflectionPrompt:
      "Which of the five truths is hardest for you to truly accept, and why?",
    relatedConceptSlugs: ["thinking-in-probabilities", "risk-acceptance"],
    quizQuestions: [
      {
        question: "Which is one of the five fundamental truths?",
        options: [
          { id: "a", text: "You don't need to know what happens next to make money" },
          { id: "b", text: "Good setups always win" },
          { id: "c", text: "Losses mean your edge is broken" },
          { id: "d", text: "Certainty is achievable with analysis" },
        ],
        correctAnswer: "a",
        explanation: "An edge gives odds, not predictions.",
      },
      {
        question: "An edge is best defined as:",
        options: [
          { id: "a", text: "A higher probability of one outcome over another" },
          { id: "b", text: "A guarantee of profit" },
          { id: "c", text: "A way to predict the next candle" },
          { id: "d", text: "A risk-free signal" },
        ],
        correctAnswer: "a",
        explanation: "Edges are probabilistic, not certain.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "risk-acceptance",
    sectionId: SECTION,
    title: "Risk Acceptance",
    summary:
      "Truly accepting risk means being at peace with the loss before you enter — emotionally, not just intellectually.",
    difficulty: "advanced",
    explanation:
      "Most traders 'know' they could lose but haven't actually accepted it. The difference shows up the moment price moves against them: the unaccepted risk produces fear, the accepted risk produces calm. Real acceptance means you've pre-decided the loss is a normal cost of doing business and you're fine with it. From that place, you can let trades work, honor stops without flinching, and avoid the defensive maneuvers that destroy a plan. Risk acceptance is the gateway to fearless execution.",
    whyMatters:
      "Without genuine risk acceptance, fear and hope will override every rule you set.",
    commonMistake:
      "Saying 'I accept the risk' while secretly expecting the trade to win and panicking when it doesn't.",
    reflectionPrompt:
      "On your next trade, sit with the full loss amount until you genuinely feel okay with it.",
    relatedConceptSlugs: ["trading-without-fear", "the-five-fundamental-truths"],
    quizQuestions: [
      {
        question: "Genuine risk acceptance means:",
        options: [
          { id: "a", text: "Being emotionally at peace with the loss before entering" },
          { id: "b", text: "Knowing intellectually you might lose" },
          { id: "c", text: "Expecting to win every time" },
          { id: "d", text: "Using no stop loss" },
        ],
        correctAnswer: "a",
        explanation: "Acceptance is emotional, not just intellectual.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "confidence-vs-certainty",
    sectionId: SECTION,
    title: "Confidence vs Certainty",
    summary:
      "Confidence is trusting yourself to follow your process; certainty is demanding the market obey you.",
    difficulty: "advanced",
    explanation:
      "The market can never offer certainty, so any attempt to find it leads to frustration and paralysis. What you can have is confidence — not that this trade will win, but that you will execute your edge correctly and manage risk no matter the outcome. Confident traders are comfortable being uncertain about results because they're certain about their behavior. Shifting your need for certainty from the market to yourself is a turning point in trading psychology.",
    whyMatters:
      "Demanding certainty from the market guarantees disappointment; confidence in your process produces calm execution.",
    commonMistake:
      "Waiting for a 'sure thing' setup that never comes, and missing every valid probabilistic trade.",
    reflectionPrompt:
      "Where are you seeking certainty from the market that you should be seeking from yourself?",
    relatedConceptSlugs: ["risk-acceptance", "thinking-like-a-professional"],
    quizQuestions: [
      {
        question: "Confidence in trading means being certain about:",
        options: [
          { id: "a", text: "Your own behavior, not the market's outcome" },
          { id: "b", text: "The result of the next trade" },
          { id: "c", text: "Where price will go" },
          { id: "d", text: "That you'll never lose" },
        ],
        correctAnswer: "a",
        explanation: "Certainty belongs to your process, not the market.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "trading-like-a-casino",
    sectionId: SECTION,
    title: "Trading Like a Casino",
    summary:
      "Be the house, not the gambler: play a small edge consistently over a large number of trades.",
    difficulty: "intermediate",
    explanation:
      "A casino doesn't care about the result of any single bet because it knows the math works over thousands of bets. It never deviates from its edge, never chases a loss, and never gets euphoric on a win. Trading like a casino means accepting the outcome of each trade with indifference while religiously executing your edge again and again. The gambler needs each bet to win; the house only needs to keep playing its edge. Choose to be the house.",
    whyMatters:
      "The casino mindset removes outcome anxiety and anchors you to the only thing that compounds: repeated edge execution.",
    commonMistake:
      "Acting like a gambler — needing each trade to win and abandoning the edge after a few losses.",
    reflectionPrompt:
      "Are you currently playing like the house or the gambler? What would change if you were the house?",
    relatedConceptSlugs: ["thinking-in-probabilities", "accepting-random-outcomes"],
    quizQuestions: [
      {
        question: "Trading like a casino means:",
        options: [
          { id: "a", text: "Executing a small edge consistently over many trades" },
          { id: "b", text: "Betting big to win fast" },
          { id: "c", text: "Chasing losses" },
          { id: "d", text: "Needing every trade to win" },
        ],
        correctAnswer: "a",
        explanation: "Be the house: indifferent to one bet, faithful to the edge.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "thinking-like-a-professional",
    sectionId: SECTION,
    title: "Thinking Like a Professional",
    summary:
      "Professionals trade from a state of relaxed focus, treating trading as a probabilities business.",
    difficulty: "advanced",
    explanation:
      "Amateurs ride emotional highs and lows tied to each result; professionals run a business with known expenses (losses) and known revenue drivers (their edge). The professional has nothing to prove, no need to be right, and complete acceptance of risk. This lets them act decisively, cut losers without ego, and let winners run without fear. Professional thinking is less about secret strategies and more about a stable, accountable, probability-based relationship with the market.",
    whyMatters:
      "Professional thinking is the difference between a trader who survives decades and one who flames out in months.",
    commonMistake:
      "Treating trading like gambling for excitement instead of running it like a disciplined business.",
    reflectionPrompt:
      "If you ran your trading like a business, what is one thing you'd immediately do differently?",
    relatedConceptSlugs: ["becoming-process-focused", "the-five-fundamental-truths"],
    quizQuestions: [
      {
        question: "A professional trader treats losses as:",
        options: [
          { id: "a", text: "A normal business expense" },
          { id: "b", text: "A personal failure" },
          { id: "c", text: "Proof the edge is broken" },
          { id: "d", text: "Something to immediately recover" },
        ],
        correctAnswer: "a",
        explanation: "Losses are a cost of doing business.",
      },
    ],
  }),
]
