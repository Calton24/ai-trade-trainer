import { buildConcept } from "@/content/book-lab/concept-builder"
import type { BookLabConcept } from "@/lib/book-lab/types"

const SECTION = "bl-journaling-review"

export const journalingReviewConcepts: BookLabConcept[] = [
  buildConcept({
    slug: "why-journaling-matters",
    sectionId: SECTION,
    title: "Why Journaling Matters",
    summary: "Memory lies; journals show patterns in setups, mistakes, and emotions.",
    explanation:
      "Without records you repeat the same leaks. Journals connect entries, exits, screenshots, and feelings into data you can improve weekly.",
    whyMatters: "Improvement requires feedback loops.",
    commonMistake: "Trading for months with no written review.",
    reflectionPrompt: "What is one pattern you want your journal to reveal?",
    relatedConceptSlugs: ["recording-entry-reason", "weekly-pattern-review"],
    quizQuestions: [{
      question: "Journaling helps you:",
      options: [
        { id: "a", text: "Spot recurring mistakes and improve" },
        { id: "b", text: "Guarantee profits" },
        { id: "c", text: "Skip risk management" },
        { id: "d", text: "Trade more randomly" },
      ],
      correctAnswer: "a",
      explanation: "Journals enable pattern recognition.",
    }],
  }),
  buildConcept({
    slug: "screenshot-before-after",
    sectionId: SECTION,
    title: "Screenshot Before & After",
    summary: "Capture chart at entry and exit — context beats memory.",
    explanation:
      "Before: levels, trigger, plan. After: outcome, what changed. Screenshots make weekly review visual and honest.",
    whyMatters: "You cannot fix what you cannot see.",
    commonMistake: "Journaling P&L only with no chart context.",
    reflectionPrompt: "Where will you store screenshots with each trade?",
    relatedConceptSlugs: ["why-journaling-matters", "recording-exit-reason"],
    quizQuestions: [{
      question: "Before/after screenshots show:",
      options: [
        { id: "a", text: "Plan vs outcome on the chart" },
        { id: "b", text: "Tomorrow's price" },
        { id: "c", text: "Broker marketing" },
        { id: "d", text: "Nothing useful" },
      ],
      correctAnswer: "a",
      explanation: "Visual context improves review quality.",
    }],
  }),
  buildConcept({
    slug: "recording-entry-reason",
    sectionId: SECTION,
    title: "Recording Entry Reason",
    summary: "Write setup name and trigger in one sentence before or at entry.",
    explanation:
      "Example: 'ORB long — break of 5m high on volume, stop below range.' If you cannot write it, skip the trade.",
    whyMatters: "Forces clarity and enables stats by setup type.",
    commonMistake: "Vague notes like 'looked good'.",
    reflectionPrompt: "What fields will your entry note always include?",
    relatedConceptSlugs: ["recording-exit-reason", "tagging-mistakes"],
    quizQuestions: [{
      question: "Entry reason should include:",
      options: [
        { id: "a", text: "Setup name and trigger" },
        { id: "b", text: "Only P&L hope" },
        { id: "c", text: "Random emoji" },
        { id: "d", text: "Nothing" },
      ],
      correctAnswer: "a",
      explanation: "Specific setup + trigger = reviewable data.",
    }],
  }),
  buildConcept({
    slug: "recording-exit-reason",
    sectionId: SECTION,
    title: "Recording Exit Reason",
    summary: "Note whether exit was plan-based, emotional, or invalidation.",
    explanation:
      "Tag: target hit, stop hit, manual fear exit, time stop, invalidation. Patterns emerge — e.g. many 'fear exits' before target.",
    whyMatters: "Exit quality often matters more than entry.",
    commonMistake: "Only logging wins, not early exits.",
    reflectionPrompt: "Which exit tags will you use?",
    relatedConceptSlugs: ["recording-entry-reason", "tagging-mistakes"],
    quizQuestions: [{
      question: "Exit reason helps identify:",
      options: [
        { id: "a", text: "Whether you followed the exit plan" },
        { id: "b", text: "Future stock prices" },
        { id: "c", text: "Tax rates" },
        { id: "d", text: "Broker bonuses" },
      ],
      correctAnswer: "a",
      explanation: "Exit tags reveal discipline leaks.",
    }],
  }),
  buildConcept({
    slug: "tagging-mistakes",
    sectionId: SECTION,
    title: "Tagging Mistakes",
    summary: "Use consistent tags: chased, no stop, oversize, FOMO, revenge, early exit.",
    explanation:
      "Tags turn journal into statistics. Weekly count of 'chased' tags shows whether rules are sticking.",
    whyMatters: "Quantified mistakes beat vague guilt.",
    commonMistake: "Using 'bad luck' for every loss.",
    reflectionPrompt: "List your top three mistake tags.",
    relatedConceptSlugs: ["weekly-pattern-review", "review-without-ego"],
    quizQuestions: [{
      question: "Mistake tags help:",
      options: [
        { id: "a", text: "Count recurring behavior patterns" },
        { id: "b", text: "Avoid all losses" },
        { id: "c", text: "Skip review" },
        { id: "d", text: "Increase size" },
      ],
      correctAnswer: "a",
      explanation: "Tags make patterns visible.",
    }],
  }),
  buildConcept({
    slug: "weekly-pattern-review",
    sectionId: SECTION,
    title: "Reviewing Weekly Patterns",
    summary: "Once a week, tally tags, best setup, worst leak, one rule for next week.",
    explanation:
      "Weekly review: trades taken vs plan, win rate by setup, average R, top mistake tag. Pick one focus rule — not ten.",
    whyMatters: "Daily noise hides weekly trends.",
    commonMistake: "Never reviewing — only live trading.",
    reflectionPrompt: "What day/time is your weekly review?",
    relatedConceptSlugs: ["measuring-strategy-performance", "building-consistency"],
    quizQuestions: [{
      question: "Weekly review should identify:",
      options: [
        { id: "a", text: "Repeating mistakes and best setups" },
        { id: "b", text: "Only winning trades to celebrate" },
        { id: "c", text: "Reasons to abandon all rules" },
        { id: "d", text: "Random new strategies daily" },
      ],
      correctAnswer: "a",
      explanation: "Weekly review finds patterns and focus.",
    }],
  }),
  buildConcept({
    slug: "measuring-strategy-performance",
    sectionId: SECTION,
    title: "Measuring Strategy Performance",
    summary: "Track stats per setup: count, win rate, average R, mistake rate.",
    explanation:
      "Separate ORB from bull flag from VWAP bounce. Kill setups that bleed after 30+ samples; double down process on what works.",
    whyMatters: "Not all setups deserve equal size or attention.",
    commonMistake: "Judging a strategy on three trades.",
    reflectionPrompt: "Which setup will you track first?",
    relatedConceptSlugs: ["weekly-pattern-review", "why-journaling-matters"],
    quizQuestions: [{
      question: "Strategy stats need:",
      options: [
        { id: "a", text: "Enough samples and consistent tagging" },
        { id: "b", text: "One trade only" },
        { id: "c", text: "No journal" },
        { id: "d", text: "Maximum leverage" },
      ],
      correctAnswer: "a",
      explanation: "Stats require sample size and consistent labels.",
    }],
  }),
]
