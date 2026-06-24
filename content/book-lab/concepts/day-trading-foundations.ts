import { buildConcept } from "@/content/book-lab/concept-builder"
import type { BookLabConcept } from "@/lib/book-lab/types"

const SECTION = "bl-day-trading-foundations"

export const dayTradingFoundationsConcepts: BookLabConcept[] = [
  buildConcept({
    slug: "what-is-day-trading",
    sectionId: SECTION,
    title: "What Day Trading Is",
    summary:
      "Day trading means opening and closing trades within the same session — no overnight holds.",
    explanation:
      "Day traders aim to capture short-term price moves during regular market hours. Positions are opened and closed the same day, so exposure to overnight news gaps is reduced compared with swing or investing styles. The focus is on process, risk control, and repeatable setups — not on guessing every tick.",
    whyMatters:
      "If you do not know what day trading actually is, you may hold trades too long, size too large, or expect investing-style returns from minute-by-minute decisions.",
    commonMistake:
      "Treating day trading like long-term investing — holding losers overnight because 'it might come back'.",
    reflectionPrompt:
      "In your own words, how is day trading different from buying and holding for months?",
    relatedConceptSlugs: ["day-trading-vs-investing", "reality-of-risk"],
    quizQuestions: [
      {
        question: "Which best describes day trading?",
        options: [
          { id: "a", text: "Closing all positions before the session ends" },
          { id: "b", text: "Only trading on Mondays" },
          { id: "c", text: "Guaranteed daily profits" },
          { id: "d", text: "Never using a stop loss" },
        ],
        correctAnswer: "a",
        explanation:
          "Day traders typically flatten before the close. The other options are myths or bad habits.",
      },
    ],
  }),
  buildConcept({
    slug: "day-trading-vs-investing",
    sectionId: SECTION,
    title: "Day Trading vs Investing",
    summary:
      "Investing builds wealth over years; day trading manages intraday risk and small edges.",
    explanation:
      "Investors care about business quality, dividends, and multi-year trends. Day traders care about liquidity, volatility, and whether today's price action offers a defined setup. Time horizon, position size, and risk rules are completely different.",
    whyMatters:
      "Mixing the two mindsets leads to holding day trades like investments or cutting investments like scalps.",
    commonMistake:
      "Using investing news to justify holding a losing day trade past your stop.",
    reflectionPrompt:
      "Which mindset do you catch yourself using when a trade goes against you?",
    relatedConceptSlugs: ["what-is-day-trading", "why-practice-first"],
    quizQuestions: [
      {
        question: "A key difference between investing and day trading is:",
        options: [
          { id: "a", text: "Time horizon and how risk is managed" },
          { id: "b", text: "Day traders never use charts" },
          { id: "c", text: "Investors always use leverage" },
          { id: "d", text: "There is no difference" },
        ],
        correctAnswer: "a",
        explanation: "Horizon and risk process separate the two styles.",
      },
    ],
  }),
  buildConcept({
    slug: "reality-of-risk",
    sectionId: SECTION,
    title: "The Reality of Risk",
    summary:
      "Most day traders lose money at first. Risk of ruin is real without rules.",
    explanation:
      "Markets are competitive. Fees, slippage, and emotional mistakes eat edge quickly. Beginners should assume losses while learning — that is why simulators and small size exist. Success means surviving long enough to improve, not winning every day.",
    whyMatters:
      "Underestimating risk leads to oversized accounts blow-ups and quitting before skills develop.",
    commonMistake:
      "Funding a live account before proving discipline in practice.",
    chartDemoId: "demo-risk-reward",
    reflectionPrompt:
      "What maximum daily loss would you accept while still learning?",
    relatedConceptSlugs: ["why-practice-first", "discipline-over-prediction"],
    quizQuestions: [
      {
        question: "Why do most beginners lose money early?",
        options: [
          { id: "a", text: "They lack process, size control, and experience" },
          { id: "b", text: "The market is rigged against everyone" },
          { id: "c", text: "Charts never work" },
          { id: "d", text: "Brokers hide all winning setups" },
        ],
        correctAnswer: "a",
        explanation:
          "Skill and discipline take time. Blaming external forces avoids fixing habits.",
      },
    ],
  }),
  buildConcept({
    slug: "why-practice-first",
    sectionId: SECTION,
    title: "Practice Before Real Money",
    summary:
      "Simulators and replay let you build habits without paying tuition to the market.",
    explanation:
      "Paper trading and chart labs let you rehearse entries, stops, and journaling with zero capital at risk. Real money adds pressure that makes beginners skip rules. Practice until your process is boring and repeatable.",
    whyMatters:
      "Real money too early turns every mistake into a financial and emotional setback.",
    commonMistake:
      "Switching to live because paper 'feels easy' — live fills and emotions differ.",
    reflectionPrompt:
      "What three rules will you follow in practice before going live?",
    relatedConceptSlugs: ["reality-of-risk", "discipline-over-prediction"],
    quizQuestions: [
      {
        question: "Best reason to practice first:",
        options: [
          { id: "a", text: "Build habits without risking capital" },
          { id: "b", text: "Paper trading guarantees live profits" },
          { id: "c", text: "Brokers require 10 years of paper" },
          { id: "d", text: "Charts only work in simulators" },
        ],
        correctAnswer: "a",
        explanation: "Practice builds process; it does not guarantee live results.",
      },
    ],
  }),
  buildConcept({
    slug: "discipline-over-prediction",
    sectionId: SECTION,
    title: "Discipline Over Prediction",
    summary:
      "You cannot control tomorrow's headline. You can control risk and whether you follow your plan.",
    explanation:
      "Profitable day traders focus on executing a tested plan with consistent size and stops — not on calling every move. Discipline means taking only A+ setups, honoring stops, and stopping when rules say stop.",
    whyMatters:
      "Chasing predictions creates random entries and oversized bets on opinions.",
    commonMistake:
      "Increasing size after a win because you feel you 'read the market'.",
    reflectionPrompt:
      "What is one rule you will follow even when you feel confident?",
    relatedConceptSlugs: ["reality-of-risk", "what-is-day-trading"],
    quizQuestions: [
      {
        question: "What matters more for beginners?",
        options: [
          { id: "a", text: "Following a written plan and risk rules" },
          { id: "b", text: "Predicting every candle correctly" },
          { id: "c", text: "Trading as many tickers as possible" },
          { id: "d", text: "Removing stop losses to avoid whipsaw" },
        ],
        correctAnswer: "a",
        explanation: "Process and risk control beat prediction.",
      },
    ],
  }),
]
