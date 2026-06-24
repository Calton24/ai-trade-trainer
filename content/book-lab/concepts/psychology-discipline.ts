import { buildConcept } from "@/content/book-lab/concept-builder"
import type { BookLabConcept } from "@/lib/book-lab/types"

const SECTION = "bl-psychology-discipline"

export const psychologyDisciplineConcepts: BookLabConcept[] = [
  buildConcept({
    slug: "fear-of-missing-out",
    sectionId: SECTION,
    title: "Fear of Missing Out (FOMO)",
    summary: "The urge to jump in because others are profiting — not because your plan triggered.",
    explanation:
      "FOMO feels urgent but violates process. The market opens every day. Missing one move beats forcing a bad entry that hits your daily loss limit.",
    whyMatters: "FOMO drives chasing, oversizing, and rule breaks.",
    commonMistake: "Increasing size after watching someone else win on social media.",
    reflectionPrompt: "What phrase will you say when FOMO appears?",
    relatedConceptSlugs: ["avoid-chasing", "overtrading"],
    quizQuestions: [{
      question: "FOMO often leads to:",
      options: [
        { id: "a", text: "Unplanned entries and poor R:R" },
        { id: "b", text: "Better discipline" },
        { id: "c", text: "Guaranteed profits" },
        { id: "d", text: "Smaller position sizes" },
      ],
      correctAnswer: "a",
      explanation: "FOMO bypasses the plan.",
    }],
  }),
  buildConcept({
    slug: "revenge-trading",
    sectionId: SECTION,
    title: "Revenge Trading",
    summary: "Trading to win back losses immediately — usually with bigger size and no plan.",
    explanation:
      "After a stop, emotions spike. Revenge trades ignore rules and compound losses. The fix: daily loss limit, break, journal the stop.",
    whyMatters: "Revenge sessions cause the worst drawdowns.",
    commonMistake: "Re-entering same ticker seconds after stop with double size.",
    reflectionPrompt: "What will you do in the first 5 minutes after a stop?",
    relatedConceptSlugs: ["daily-loss-limit", "overtrading"],
    quizQuestions: [{
      question: "Revenge trading is:",
      options: [
        { id: "a", text: "Emotional trading to recover losses fast" },
        { id: "b", text: "Following your written plan" },
        { id: "c", text: "Taking scheduled breaks" },
        { id: "d", text: "Journaling calmly" },
      ],
      correctAnswer: "a",
      explanation: "Revenge = emotion over process.",
    }],
  }),
  buildConcept({
    slug: "overtrading",
    sectionId: SECTION,
    title: "Overtrading",
    summary: "Too many trades, too much size, too little edge — often from boredom or tilt.",
    explanation:
      "Quality beats quantity. Set max trades per day. If nothing meets A+ criteria, zero trades is a win.",
    whyMatters: "Fees and mistakes scale with click count.",
    commonMistake: "Trading chop because 'I need action'.",
    reflectionPrompt: "What is your max trades per day while learning?",
    relatedConceptSlugs: ["revenge-trading", "building-consistency"],
    quizQuestions: [{
      question: "Overtrading often happens when:",
      options: [
        { id: "a", text: "Boredom or tilt replaces selectivity" },
        { id: "b", text: "You follow a strict watchlist" },
        { id: "c", text: "You hit daily loss limit and stop" },
        { id: "d", text: "You journal every trade" },
      ],
      correctAnswer: "a",
      explanation: "Boredom and tilt drive excess clicks.",
    }],
  }),
  buildConcept({
    slug: "cut-winners-early",
    sectionId: SECTION,
    title: "Cutting Winners Too Early",
    summary: "Exiting green trades from fear before target because 'something might happen'.",
    explanation:
      "Early exits cap upside and force higher win rate to stay profitable. Use written targets and partials instead of panic exits.",
    whyMatters: "Kills R:R even when direction was right.",
    commonMistake: "Flattening at +0.2R then watching +3R without you.",
    reflectionPrompt: "What rule stops you from exiting before target one?",
    relatedConceptSlugs: ["partial-profits", "holding-losers"],
    quizQuestions: [{
      question: "Cutting winners early is driven by:",
      options: [
        { id: "a", text: "Fear of giving back profit" },
        { id: "b", text: "Written target plan" },
        { id: "c", text: "Partial profit rules" },
        { id: "d", text: "Trailing stop discipline" },
      ],
      correctAnswer: "a",
      explanation: "Fear exits shrink reward.",
    }],
  }),
  buildConcept({
    slug: "holding-losers",
    sectionId: SECTION,
    title: "Holding Losers Too Long",
    summary: "Hope replaces stop — small loss becomes large loss.",
    explanation:
      "Losers should hit planned stop or invalidation. Holding 'until breakeven' ties up capital and violates risk math.",
    whyMatters: "Large losses need many small wins to recover.",
    commonMistake: "Removing stop when down because 'it will bounce'.",
    reflectionPrompt: "What hard rule ends a losing trade?",
    relatedConceptSlugs: ["stop-loss", "revenge-trading"],
    quizQuestions: [{
      question: "Holding losers too long:",
      options: [
        { id: "a", text: "Increases average loss size" },
        { id: "b", text: "Improves win rate automatically" },
        { id: "c", text: "Removes need for journal" },
        { id: "d", text: "Is required for success" },
      ],
      correctAnswer: "a",
      explanation: "Letting losers run inflates drawdowns.",
    }],
  }),
  buildConcept({
    slug: "rules-when-emotional",
    sectionId: SECTION,
    title: "Following Rules When Emotional",
    summary: "Your plan is written for the moments you cannot think clearly.",
    explanation:
      "Emotion peaks after wins and losses. Pre-written rules — max loss, max trades, mandatory break — protect you when willpower fails.",
    whyMatters: "Discipline is tested most when P&L swings.",
    commonMistake: "Changing rules mid-session after one outcome.",
    reflectionPrompt: "Which rule is non-negotiable for you?",
    relatedConceptSlugs: ["daily-loss-limit", "building-consistency"],
    quizQuestions: [{
      question: "Rules matter most when:",
      options: [
        { id: "a", text: "Emotions are high after P&L swings" },
        { id: "b", text: "Everything is calm" },
        { id: "c", text: "You never trade" },
        { id: "d", text: "Charts are closed" },
      ],
      correctAnswer: "a",
      explanation: "Rules are for emotional moments.",
    }],
  }),
  buildConcept({
    slug: "building-consistency",
    sectionId: SECTION,
    title: "Building Consistency",
    summary: "Repeat the same process daily — selection, plan, risk, review.",
    explanation:
      "Consistency is boring: same prep, same risk, same journal. Results vary daily; process should not.",
    whyMatters: "Random process cannot be improved or measured.",
    commonMistake: "Changing strategy every week based on one day.",
    reflectionPrompt: "What one habit will you repeat every session?",
    relatedConceptSlugs: ["review-without-ego", "rules-when-emotional"],
    quizQuestions: [{
      question: "Consistency means:",
      options: [
        { id: "a", text: "Same repeatable process regardless of P&L" },
        { id: "b", text: "Winning every day" },
        { id: "c", text: "Trading maximum tickers" },
        { id: "d", text: "Removing all rules" },
      ],
      correctAnswer: "a",
      explanation: "Process consistency enables learning.",
    }],
  }),
  buildConcept({
    slug: "review-without-ego",
    sectionId: SECTION,
    title: "Reviewing Mistakes Without Ego",
    summary: "Journal losses neutrally — what broke: plan, execution, or market?",
    explanation:
      "Ego says 'market was wrong.' Growth says 'did I follow rules?' Review screenshots and tags without shame — data for tomorrow.",
    whyMatters: "Honest review is the fastest skill upgrade.",
    commonMistake: "Deleting losing trades from journal.",
    reflectionPrompt: "How will you label a mistake without self-attack?",
    relatedConceptSlugs: ["why-journaling-matters", "building-consistency"],
    quizQuestions: [{
      question: "Healthy review focuses on:",
      options: [
        { id: "a", text: "Process and rule adherence" },
        { id: "b", text: "Blaming the market" },
        { id: "c", text: "Hiding losses" },
        { id: "d", text: "Increasing size tomorrow" },
      ],
      correctAnswer: "a",
      explanation: "Review process, not ego.",
    }],
  }),
]
