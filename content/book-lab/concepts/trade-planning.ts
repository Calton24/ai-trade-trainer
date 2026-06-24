import { buildConcept } from "@/content/book-lab/concept-builder"
import type { BookLabConcept } from "@/lib/book-lab/types"

const SECTION = "bl-trade-planning"

export const tradePlanningConcepts: BookLabConcept[] = [
  buildConcept({
    slug: "pre-market-preparation",
    sectionId: SECTION,
    title: "Pre-Market Preparation",
    summary: "Review catalysts, levels, and bias before the bell — not after FOMO hits.",
    explanation:
      "Pre-market prep includes scanning gap movers, noting key levels from prior day, and deciding max trades and loss limit. A five-minute checklist beats improvising at the open.",
    whyMatters: "Unprepared traders react; prepared traders select.",
    commonMistake: "Starting the platform at 9:30 with no watchlist.",
    reflectionPrompt: "What three items are on your pre-market checklist?",
    relatedConceptSlugs: ["watchlist-building", "entry-plan"],
    quizQuestions: [{
      question: "Pre-market prep should include:",
      options: [
        { id: "a", text: "Catalysts, levels, and daily rules" },
        { id: "b", text: "Random social media tips only" },
        { id: "c", text: "Removing stop losses" },
        { id: "d", text: "Maximum leverage settings" },
      ],
      correctAnswer: "a",
      explanation: "Structure before the open reduces impulsive trades.",
    }],
  }),
  buildConcept({
    slug: "watchlist-building",
    sectionId: SECTION,
    title: "Watchlist Building",
    summary: "Narrow the universe to a handful of names in play with clear levels.",
    explanation:
      "Build a focused list: gap leaders, high RVOL, clean charts. Five good names beat fifty distractions. Note entry zone, stop, and target ideas before price arrives.",
    whyMatters: "Watchlists prevent chasing random tickers mid-session.",
    commonMistake: "Adding every scanner alert without filtering quality.",
    reflectionPrompt: "How many names will you allow on your list?",
    relatedConceptSlugs: ["pre-market-preparation", "stocks-in-play"],
    quizQuestions: [{
      question: "A good watchlist is:",
      options: [
        { id: "a", text: "Small, filtered, with planned levels" },
        { id: "b", text: "Every stock on the exchange" },
        { id: "c", text: "Built only after losses" },
        { id: "d", text: "Ignored once market opens" },
      ],
      correctAnswer: "a",
      explanation: "Focus and planning beat quantity.",
    }],
  }),
  buildConcept({
    slug: "entry-plan",
    sectionId: SECTION,
    title: "Entry Plan",
    summary: "Define trigger, price zone, and size before price gets there.",
    explanation:
      "Write: 'Long if price holds VWAP retest with volume.' Include invalidation and max risk. No trigger means no click.",
    whyMatters: "Planned entries reduce chasing and hesitation.",
    commonMistake: "Buying because a candle 'looks strong' with no trigger written.",
    reflectionPrompt: "What exact trigger will you wait for tomorrow?",
    relatedConceptSlugs: ["exit-plan", "wait-for-confirmation"],
    quizQuestions: [{
      question: "An entry plan specifies:",
      options: [
        { id: "a", text: "Trigger, zone, size, and invalidation" },
        { id: "b", text: "Only the ticker symbol" },
        { id: "c", text: "Hope and luck" },
        { id: "d", text: "Maximum size always" },
      ],
      correctAnswer: "a",
      explanation: "Complete plans cover trigger through invalidation.",
    }],
  }),
  buildConcept({
    slug: "exit-plan",
    sectionId: SECTION,
    title: "Exit Plan",
    summary: "Know where you take profit and where you admit defeat before entry.",
    explanation:
      "Exits include stop, target, time stop, and trailing rules. Partial exits at first target reduce emotional attachment on runners.",
    whyMatters: "Entries get attention; exits determine P&L.",
    commonMistake: "Exiting only when anxiety spikes.",
    reflectionPrompt: "Will you scale out or exit all at once?",
    relatedConceptSlugs: ["stop-loss-plan", "partial-profits"],
    quizQuestions: [{
      question: "Exit plan should be set:",
      options: [
        { id: "a", text: "Before or at entry, not in panic later" },
        { id: "b", text: "Only after a big loss" },
        { id: "c", text: "Never — hold forever" },
        { id: "d", text: "By random price levels" },
      ],
      correctAnswer: "a",
      explanation: "Pre-planned exits reduce emotional decisions.",
    }],
  }),
  buildConcept({
    slug: "stop-loss-plan",
    sectionId: SECTION,
    title: "Stop-Loss Plan",
    summary: "Document stop location and size impact before the trade.",
    explanation:
      "Your stop plan ties to structure and dollar risk. If stop hits, journal why — was plan wrong or execution sloppy?",
    whyMatters: "Written stops resist moving when under pressure.",
    commonMistake: "Widening stop mid-trade without updating risk math.",
    chartDemoId: "demo-support",
    reflectionPrompt: "Will you use hard stops or manual discipline?",
    relatedConceptSlugs: ["exit-plan", "good-vs-bad-stop"],
    quizQuestions: [{
      question: "Stop-loss plan includes:",
      options: [
        { id: "a", text: "Price level and dollar risk if hit" },
        { id: "b", text: "Only hope price recovers" },
        { id: "c", text: "Nothing until red P&L" },
        { id: "d", text: "Double down level" },
      ],
      correctAnswer: "a",
      explanation: "Plan level and dollar impact together.",
    }],
  }),
  buildConcept({
    slug: "trade-invalidation",
    sectionId: SECTION,
    title: "Trade Invalidation",
    summary: "The condition that cancels the setup — not just the stop price.",
    explanation:
      "Invalidation might be 'lose VWAP on volume' or 'break below opening range low.' When invalidation triggers, the idea is dead even if stop not hit yet.",
    whyMatters: "Clear invalidation prevents holding dead trades.",
    commonMistake: "Ignoring changed context because stop not touched.",
    reflectionPrompt: "What non-price signal would cancel your setup?",
    relatedConceptSlugs: ["entry-plan", "good-vs-bad-stop"],
    quizQuestions: [{
      question: "Invalidation means:",
      options: [
        { id: "a", text: "The setup premise no longer holds" },
        { id: "b", text: "You must add size" },
        { id: "c", text: "Remove the stop" },
        { id: "d", text: "Trade more tickers" },
      ],
      correctAnswer: "a",
      explanation: "Context change can kill a trade before stop.",
    }],
  }),
  buildConcept({
    slug: "avoid-random-entries",
    sectionId: SECTION,
    title: "Avoid Random Entries",
    summary: "If you cannot explain the setup in one sentence, do not click.",
    explanation:
      "Random entries come from boredom, FOMO, and tips. Your journal should always answer: setup name, trigger, stop, target.",
    whyMatters: "Random trades teach random lessons.",
    commonMistake: "Trading the same ticker five different ways in one day.",
    practiceDrill: {
      type: "trade-or-skip",
      title: "Trade or skip?",
      prompt: "No written trigger, no stop, strong green candle — what do you do?",
      options: [
        { id: "skip", text: "Skip — no plan means no trade", correct: true, feedback: "Waiting preserves capital and focus." },
        { id: "buy", text: "Buy full size immediately", correct: false, feedback: "Chasing without a plan is a common beginner leak." },
      ],
      correctFeedback: "You protected process over impulse.",
      riskyFeedback: "Impulse entries rarely have defined risk.",
      improvementTip: "Write trigger and stop before any click.",
    },
    reflectionPrompt: "What sentence will you require before every entry?",
    relatedConceptSlugs: ["wait-for-confirmation", "entry-plan"],
    quizQuestions: [{
      question: "Best response to 'no setup, big move':",
      options: [
        { id: "a", text: "Skip and wait for your plan" },
        { id: "b", text: "Market buy max size" },
        { id: "c", text: "Remove daily loss limit" },
        { id: "d", text: "Trade a different market blindly" },
      ],
      correctAnswer: "a",
      explanation: "No plan, no trade.",
    }],
  }),
  buildConcept({
    slug: "wait-for-confirmation",
    sectionId: SECTION,
    title: "Wait for Confirmation",
    summary: "Let price prove your thesis — candle close, volume, retest hold.",
    explanation:
      "Confirmation reduces fakeouts. Examples: breakout candle closes above level; pullback holds support on volume. Patience filters low-quality entries.",
    whyMatters: "Early entries pay wider stops and more whipsaw.",
    commonMistake: "Entering on the first touch without close or volume.",
    chartDemoId: "demo-break-retest",
    chartPracticeId: "task-break-retest",
    reflectionPrompt: "What confirmation will you require on your next setup?",
    relatedConceptSlugs: ["entry-plan", "avoid-random-entries"],
    quizQuestions: [{
      question: "Confirmation helps you:",
      options: [
        { id: "a", text: "Reduce false entries and fakeouts" },
        { id: "b", text: "Eliminate all losses" },
        { id: "c", text: "Trade more often" },
        { id: "d", text: "Skip stop losses" },
      ],
      correctAnswer: "a",
      explanation: "Confirmation improves entry quality, not win rate to 100%.",
    }],
  }),
]
