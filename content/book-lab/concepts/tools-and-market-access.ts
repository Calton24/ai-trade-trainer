import { buildConcept } from "@/content/book-lab/concept-builder"
import type { BookLabConcept } from "@/lib/book-lab/types"

const SECTION = "bl-tools-and-market-access"

export const toolsAndMarketAccessConcepts: BookLabConcept[] = [
  buildConcept({
    slug: "brokers-and-platforms",
    sectionId: SECTION,
    title: "Brokers & Trading Platforms",
    summary: "Your broker connects you to the market; your platform is where you decide and execute.",
    explanation:
      "A broker holds your account and routes orders. A platform shows charts, news, and order tickets. Beginners need reliability, clear fees, and practice mode — not the flashiest layout.",
    whyMatters: "Bad tools or hidden fees erode small edges before strategy even matters.",
    commonMistake: "Choosing a broker only for social media hype, ignoring commissions and stability.",
    reflectionPrompt: "What three features matter most in a platform for learning?",
    relatedConceptSlugs: ["direct-access-brokers", "charts-and-level-2"],
    quizQuestions: [{
      question: "A trading platform primarily helps you:",
      options: [
        { id: "a", text: "See price, place orders, and manage risk" },
        { id: "b", text: "Guarantee winning trades" },
        { id: "c", text: "Avoid all losses" },
        { id: "d", text: "Replace a trading plan" },
      ],
      correctAnswer: "a",
      explanation: "Platforms are tools for execution and analysis.",
    }],
  }),
  buildConcept({
    slug: "direct-access-brokers",
    sectionId: SECTION,
    title: "Direct-Access Brokers",
    summary: "Direct routing can reduce delay between your click and the exchange.",
    explanation:
      "Direct-access brokers focus on fast order routing for active traders. For learning, speed matters less than understanding fills, fees, and risk controls. Speed without skill still loses money faster.",
    whyMatters: "Beginners often overpay for speed they cannot use safely.",
    commonMistake: "Assuming a faster broker fixes bad entries.",
    reflectionPrompt: "Would faster fills help you if your plan is not defined yet?",
    relatedConceptSlugs: ["brokers-and-platforms", "hotkeys-and-speed"],
    quizQuestions: [{
      question: "Direct-access brokers mainly improve:",
      options: [
        { id: "a", text: "Order routing speed and control" },
        { id: "b", text: "Your win rate automatically" },
        { id: "c", text: "Market direction" },
        { id: "d", text: "Taxes owed" },
      ],
      correctAnswer: "a",
      explanation: "They optimize execution, not edge by themselves.",
    }],
  }),
  buildConcept({
    slug: "charts-and-level-2",
    sectionId: SECTION,
    title: "Charts & Level 2 Basics",
    summary: "Charts show history; Level 2 shows resting orders in the book.",
    explanation:
      "Candlestick charts summarize open, high, low, and close per period. Level 2 displays bid/ask queues at different prices — useful for seeing liquidity pockets, not for predicting every tick.",
    whyMatters: "Misreading Level 2 creates false confidence in thin or manipulated names.",
    commonMistake: "Chasing every flicker on Level 2 without a chart plan.",
    chartDemoId: "demo-candlestick-anatomy",
    reflectionPrompt: "What will you look at first — chart structure or order book?",
    relatedConceptSlugs: ["time-and-sales", "tools-dont-replace-skill"],
    quizQuestions: [{
      question: "Level 2 primarily shows:",
      options: [
        { id: "a", text: "Bid and ask size at price levels" },
        { id: "b", text: "Guaranteed support and resistance" },
        { id: "c", text: "Tomorrow's earnings" },
        { id: "d", text: "Your future P&L" },
      ],
      correctAnswer: "a",
      explanation: "It is an order book view, not a crystal ball.",
    }],
  }),
  buildConcept({
    slug: "time-and-sales",
    sectionId: SECTION,
    title: "Time & Sales Basics",
    summary: "The tape prints each trade — size, price, and time.",
    explanation:
      "Time and sales (the tape) shows executed transactions. Large prints at key levels can confirm interest, but beginners should anchor decisions to chart levels and risk first.",
    whyMatters: "Tape reading without context leads to overtrading noise.",
    commonMistake: "Buying every green print without a setup.",
    reflectionPrompt: "When would tape confirm a chart setup for you?",
    relatedConceptSlugs: ["charts-and-level-2", "hotkeys-and-speed"],
    quizQuestions: [{
      question: "Time and sales shows:",
      options: [
        { id: "a", text: "Executed trades as they happen" },
        { id: "b", text: "Only your own orders" },
        { id: "c", text: "Future prices" },
        { id: "d", text: "Company balance sheets" },
      ],
      correctAnswer: "a",
      explanation: "It is a live print log of transactions.",
    }],
  }),
  buildConcept({
    slug: "hotkeys-and-speed",
    sectionId: SECTION,
    title: "Hotkeys & Execution Speed",
    summary: "Hotkeys reduce clicks; they do not replace planning.",
    explanation:
      "Predefined buy, sell, and flatten keys help when a setup triggers. They are dangerous without position limits and stop discipline — speed amplifies both good and bad habits.",
    whyMatters: "Fat-finger errors and revenge clicks hurt more with hotkeys.",
    commonMistake: "Enabling hotkeys before practicing size and stops.",
    reflectionPrompt: "What safety rule will you set before using hotkeys?",
    relatedConceptSlugs: ["direct-access-brokers", "tools-dont-replace-skill"],
    quizQuestions: [{
      question: "Hotkeys are useful when:",
      options: [
        { id: "a", text: "You already have a clear entry/exit plan" },
        { id: "b", text: "You want random entries" },
        { id: "c", text: "You removed stop losses" },
        { id: "d", text: "You trade without a watchlist" },
      ],
      correctAnswer: "a",
      explanation: "Speed helps execution of a plan, not invention of one.",
    }],
  }),
  buildConcept({
    slug: "tools-dont-replace-skill",
    sectionId: SECTION,
    title: "Tools Don't Replace Skill",
    summary: "Fancy software cannot fix missing risk rules or untested strategy.",
    explanation:
      "Indicators, scanners, and AI overlays are assistants. Edge comes from selecting liquid movers, waiting for your setup, sizing correctly, and reviewing mistakes — not from widget count.",
    whyMatters: "Tool shopping procrastinates the hard work of journaling and repetition.",
    commonMistake: "Buying new indicators after every losing week.",
    reflectionPrompt: "Which habit — not which tool — would help you most this week?",
    relatedConceptSlugs: ["brokers-and-platforms", "discipline-over-prediction"],
    quizQuestions: [{
      question: "The main edge for beginners is:",
      options: [
        { id: "a", text: "Risk control and repeatable process" },
        { id: "b", text: "The most expensive data feed" },
        { id: "c", text: "Trading 50 stocks at once" },
        { id: "d", text: "Ignoring stops" },
      ],
      correctAnswer: "a",
      explanation: "Process and risk beat gadgets.",
    }],
  }),
]
