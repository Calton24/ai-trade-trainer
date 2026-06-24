import { buildConcept } from "@/content/book-lab/concept-builder"
import type { BookLabConcept } from "@/lib/book-lab/types"

const SECTION = "bl-stocks-in-play"

export const stocksInPlayConcepts: BookLabConcept[] = [
  buildConcept({
    slug: "stocks-in-play",
    sectionId: SECTION,
    title: "What 'Stocks in Play' Means",
    summary: "Names with unusual activity, volume, and movement worth a day trader's attention.",
    explanation:
      "A stock 'in play' has enough volume and volatility for short-term trades. Dead, wide-spread names waste attention. Scanners highlight gap movers, news names, and relative volume leaders.",
    whyMatters: "Trading illiquid charts means poor fills and random spikes.",
    commonMistake: "Forcing trades on boring tickers because you like the company story.",
    chartDemoId: "demo-bullish-bearish",
    practiceDrill: {
      type: "in-play-check",
      title: "Is this chart in play?",
      prompt: "Would you add this synthetic mover to a day-trading watchlist?",
      options: [
        { id: "yes", text: "Yes — volume and range look active", correct: true, feedback: "Active bodies and range suggest participation." },
        { id: "no", text: "No — too flat and quiet", correct: false, feedback: "Flat, low-range charts are hard to day trade." },
      ],
      correctFeedback: "You spotted activity worth watching.",
      riskyFeedback: "Quiet charts often mean poor liquidity for scalps.",
      improvementTip: "Filter for volume and range before building a watchlist.",
    },
    reflectionPrompt: "What two filters will you use to find names in play?",
    relatedConceptSlugs: ["relative-volume", "avoid-dead-charts"],
    quizQuestions: [{
      question: "A stock 'in play' usually has:",
      options: [
        { id: "a", text: "Elevated volume and meaningful intraday range" },
        { id: "b", text: "Zero volume all day" },
        { id: "c", text: "Guaranteed uptrend" },
        { id: "d", text: "No news ever" },
      ],
      correctAnswer: "a",
      explanation: "Activity and range matter for day trading.",
    }],
  }),
  buildConcept({
    slug: "relative-volume",
    sectionId: SECTION,
    title: "Relative Volume",
    summary: "Today's volume compared with its typical volume — high RVOL means unusual interest.",
    explanation:
      "Relative volume (RVOL) compares current volume to average. 3x RVOL means three times normal participation. High RVOL often accompanies news, gaps, and cleaner trends for intraday setups.",
    whyMatters: "Low RVOL names chop randomly; high RVOL names move with purpose.",
    commonMistake: "Trading low-volume spikes that fade instantly.",
    chartDemoId: "demo-relative-volume",
    reflectionPrompt: "What RVOL threshold will you note on your scanner?",
    relatedConceptSlugs: ["stocks-in-play", "catalysts-and-news"],
    quizQuestions: [{
      question: "High relative volume suggests:",
      options: [
        { id: "a", text: "More participants than usual" },
        { id: "b", text: "The stock cannot drop" },
        { id: "c", text: "You should skip risk management" },
        { id: "d", text: "Earnings are always tomorrow" },
      ],
      correctAnswer: "a",
      explanation: "RVOL flags unusual participation, not direction.",
    }],
  }),
  buildConcept({
    slug: "catalysts-and-news",
    sectionId: SECTION,
    title: "Catalysts & News",
    summary: "Events that change supply/demand today — earnings, FDA, upgrades, macro headlines.",
    explanation:
      "Catalysts explain why a name might stay in play. Day traders react to how price accepts news, not to the headline alone. Always check time of release and whether move is extended.",
    whyMatters: "Trading without knowing the catalyst invites chasing exhausted moves.",
    commonMistake: "Buying after a 40% gap with no plan because 'news is good'.",
    reflectionPrompt: "How will you note catalysts on your watchlist?",
    relatedConceptSlugs: ["gappers", "relative-volume"],
    quizQuestions: [{
      question: "A catalyst is:",
      options: [
        { id: "a", text: "An event that can drive today's volume and volatility" },
        { id: "b", text: "A guarantee of profit" },
        { id: "c", text: "Only interest rate news" },
        { id: "d", text: "Something to ignore" },
      ],
      correctAnswer: "a",
      explanation: "Catalysts explain activity; they do not guarantee direction.",
    }],
  }),
  buildConcept({
    slug: "gappers",
    sectionId: SECTION,
    title: "Gappers",
    summary: "Stocks that open far above or below yesterday's close.",
    explanation:
      "Gaps show overnight repricing. Gap-and-go traders look for continuation; fade traders look for exhaustion. Either way, pre-market volume and catalyst context matter.",
    whyMatters: "Gap names dominate many day-trading watchlists.",
    commonMistake: "Shorting a gap-up leader with no plan because 'it went too far'.",
    chartDemoId: "demo-breakout",
    reflectionPrompt: "Will you trade gap continuation, fade, or both — and why?",
    relatedConceptSlugs: ["catalysts-and-news", "opening-range-breakout"],
    quizQuestions: [{
      question: "A gap occurs when:",
      options: [
        { id: "a", text: "Open price is far from prior close" },
        { id: "b", text: "Volume is always zero" },
        { id: "c", text: "Stops are illegal" },
        { id: "d", text: "Charts stop working" },
      ],
      correctAnswer: "a",
      explanation: "Gaps are overnight price discontinuities.",
    }],
  }),
  buildConcept({
    slug: "float",
    sectionId: SECTION,
    title: "Float",
    summary: "Shares available to trade — low float can mean faster, wilder moves.",
    explanation:
      "Float is shares freely tradable. Low float names can squeeze on volume but also reverse violently. Higher float names often behave more smoothly for beginners learning structure.",
    whyMatters: "Float affects how fast price moves and how wide spreads get.",
    commonMistake: "Oversizing on low-float runners without partial profit rules.",
    reflectionPrompt: "Will you start with higher or lower float names while learning?",
    relatedConceptSlugs: ["volume-and-liquidity", "stocks-in-play"],
    quizQuestions: [{
      question: "Lower float often means:",
      options: [
        { id: "a", text: "Potentially faster, more volatile moves" },
        { id: "b", text: "Guaranteed slow charts" },
        { id: "c", text: "No need for stops" },
        { id: "d", text: "Free commissions" },
      ],
      correctAnswer: "a",
      explanation: "Less supply can amplify moves — up and down.",
    }],
  }),
  buildConcept({
    slug: "price-range",
    sectionId: SECTION,
    title: "Price Range",
    summary: "Stocks need enough intraday range to cover spread, fees, and your target.",
    explanation:
      "If a $5 stock moves five cents all day, there may be no room after costs. Day traders filter for names with enough average true range to fit their stop and target.",
    whyMatters: "Tight range + wide spread = negative expectancy even if direction is right.",
    commonMistake: "Scalping penny-range names with large relative stops.",
    reflectionPrompt: "What minimum range will you require before trading?",
    relatedConceptSlugs: ["volume-and-liquidity", "avoid-dead-charts"],
    quizQuestions: [{
      question: "Why filter for intraday range?",
      options: [
        { id: "a", text: "Room for stop and target after costs" },
        { id: "b", text: "To avoid all losses" },
        { id: "c", text: "Charts become unnecessary" },
        { id: "d", text: "Brokers require it" },
      ],
      correctAnswer: "a",
      explanation: "Range must fit your plan and fees.",
    }],
  }),
  buildConcept({
    slug: "volume-and-liquidity",
    sectionId: SECTION,
    title: "Volume & Liquidity",
    summary: "Volume shows participation; liquidity means you can enter and exit without huge slippage.",
    explanation:
      "Thick volume at your price level means tighter spreads and cleaner fills. Thin books gap through stops. Beginners should prefer liquid leaders over obscure tickers.",
    whyMatters: "Illiquid names turn good analysis into bad fills.",
    commonMistake: "Chasing a low-volume spike with full size.",
    reflectionPrompt: "How will you check liquidity before clicking buy?",
    relatedConceptSlugs: ["relative-volume", "float"],
    quizQuestions: [{
      question: "Liquidity helps you:",
      options: [
        { id: "a", text: "Enter and exit with less slippage" },
        { id: "b", text: "Remove all risk" },
        { id: "c", text: "Predict earnings" },
        { id: "d", text: "Skip stop losses" },
      ],
      correctAnswer: "a",
      explanation: "Liquidity improves execution quality.",
    }],
  }),
  buildConcept({
    slug: "avoid-dead-charts",
    sectionId: SECTION,
    title: "Avoid Dead Charts",
    summary: "Flat, low-volume names waste focus — wait for names in play.",
    explanation:
      "Dead charts chop in tiny ranges, stop you out randomly, and offer poor reward. Professional day traders spend more time selecting the right ticker than forcing trades on quiet symbols.",
    whyMatters: "Market selection is half the battle for intraday traders.",
    commonMistake: "Trading boredom — clicking because nothing else is open.",
    chartDemoId: "demo-trend-range",
    reflectionPrompt: "What will you do when your watchlist has no setups?",
    relatedConceptSlugs: ["stocks-in-play", "volume-and-liquidity"],
    quizQuestions: [{
      question: "A 'dead chart' is:",
      options: [
        { id: "a", text: "Low volume, tight range, little follow-through" },
        { id: "b", text: "Any red candle day" },
        { id: "c", text: "A chart with a stop loss" },
        { id: "d", text: "Always the best to trade" },
      ],
      correctAnswer: "a",
      explanation: "Quiet charts lack follow-through for day trades.",
    }],
  }),
]
