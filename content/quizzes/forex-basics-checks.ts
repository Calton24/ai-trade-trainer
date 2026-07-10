import type { CourseQuiz } from "@/lib/course/types"

const PATH_ID = "forex-basics"

/** Module 1 quiz — Forex Fundamentals. */
export const forexFundamentalsCheckQuiz: CourseQuiz = {
  id: "forex-fundamentals-check",
  lessonId: "fxb-m1-quiz",
  pathId: PATH_ID,
  title: "Forex Fundamentals Check",
  description: "Pairs, pips, lots, leverage, spread, and swap.",
  passingScore: 70,
  xpReward: 50,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "In GBP/JPY = 190.00, what does the price mean?",
      options: [
        { id: "a", text: "One yen costs 190 pounds" },
        { id: "b", text: "One pound costs 190 yen" },
        { id: "c", text: "The pair has moved 190 pips today" },
        { id: "d", text: "You need £190 margin to trade it" },
      ],
      correctAnswer: "b",
      explanation:
        "The price is always the cost of ONE unit of the base currency (GBP), expressed in the quote currency (JPY).",
      beginnerHint: "Base first, quote second — the price belongs to the base.",
      relatedConcept: "Base vs quote",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "EUR/USD moves from 1.0850 to 1.0895. How many pips is that?",
      options: [
        { id: "a", text: "4.5 pips" },
        { id: "b", text: "45 pips" },
        { id: "c", text: "450 pips" },
        { id: "d", text: "0.45 pips" },
      ],
      correctAnswer: "b",
      explanation:
        "One pip on EUR/USD is 0.0001. The move of 0.0045 equals 45 pips.",
      beginnerHint: "Count the change in the fourth decimal place.",
      relatedConcept: "Pips",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question:
        "You trade 0.10 lots (mini) on EUR/USD where a pip is worth $1. Price moves 30 pips in your favour. Your profit?",
      options: [
        { id: "a", text: "$3" },
        { id: "b", text: "$30" },
        { id: "c", text: "$300" },
        { id: "d", text: "$0.30" },
      ],
      correctAnswer: "b",
      explanation: "30 pips × $1 per pip = $30. Lot size converts pips into money.",
      relatedConcept: "Lots",
    },
    {
      id: "q4",
      type: "multiple-choice",
      question: "Which pair is an exotic?",
      options: [
        { id: "a", text: "EUR/GBP" },
        { id: "b", text: "USD/JPY" },
        { id: "c", text: "USD/TRY" },
        { id: "d", text: "AUD/USD" },
      ],
      correctAnswer: "c",
      explanation:
        "USD/TRY pairs the dollar with the Turkish lira — an emerging-market currency with wide spreads and violent moves.",
      relatedConcept: "Majors, minors, exotics",
    },
    {
      id: "q5",
      type: "true-false",
      question:
        "The spread means every trade starts slightly in loss, because you buy at the ask and can only close at the lower bid.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "true",
      explanation:
        "The bid-ask gap is the broker's fee — price must move by the spread just to reach break-even.",
      relatedConcept: "Spread",
    },
    {
      id: "q6",
      type: "scenario",
      question:
        "Two traders each have $1,000. Trader A trades 0.01 lots; Trader B trades 0.50 lots. Both lose 100 pips on EUR/USD ($0.10/pip and $5/pip respectively). What happened?",
      options: [
        { id: "a", text: "A lost $10 (1%); B lost $500 (50% of the account)" },
        { id: "b", text: "Both lost the same percentage" },
        { id: "c", text: "B lost more but leverage protected the account" },
        { id: "d", text: "A lost $100; B lost $50" },
      ],
      correctAnswer: "a",
      explanation:
        "Identical market move, wildly different outcomes — position size (not analysis) is what killed Trader B's account.",
      beginnerHint: "Multiply pips lost by pip value for each trader.",
      relatedConcept: "Leverage and position size",
    },
    {
      id: "q7",
      type: "multiple-choice",
      question: "What is swap in forex trading?",
      options: [
        { id: "a", text: "Exchanging one pair for another mid-trade" },
        { id: "b", text: "Interest paid or earned for holding a position overnight" },
        { id: "c", text: "The broker's commission on each trade" },
        { id: "d", text: "A type of pending order" },
      ],
      correctAnswer: "b",
      explanation:
        "Swap (rollover) reflects the interest-rate difference between the two currencies, applied to positions held past 5pm New York.",
      relatedConcept: "Swap",
    },
  ],
}

/** Module 2 quiz — Trading Sessions. */
export const tradingSessionsCheckQuiz: CourseQuiz = {
  id: "trading-sessions-check",
  lessonId: "fxb-m2-quiz",
  pathId: PATH_ID,
  title: "Trading Sessions Check",
  description: "Sessions, overlaps, and pair timing.",
  passingScore: 70,
  xpReward: 50,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "Which is the correct order of sessions through the trading day?",
      options: [
        { id: "a", text: "London → Sydney → Tokyo → New York" },
        { id: "b", text: "Sydney → Tokyo → London → New York" },
        { id: "c", text: "Tokyo → Sydney → New York → London" },
        { id: "d", text: "New York → London → Tokyo → Sydney" },
      ],
      correctAnswer: "b",
      explanation:
        "Trading follows the sun west: Sydney opens the week, then Tokyo, London, and New York.",
      relatedConcept: "Session order",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "Why is the London–New York overlap special?",
      options: [
        { id: "a", text: "It's when spreads are widest" },
        { id: "b", text: "Both major sessions are live — the highest volume window of the day" },
        { id: "c", text: "Only exotic pairs move during it" },
        { id: "d", text: "Markets are closed for lunch" },
      ],
      correctAnswer: "b",
      explanation:
        "With Europe and America trading simultaneously (13:00–17:00 UTC), liquidity peaks and spreads are tightest.",
      relatedConcept: "Session overlap",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "When is USD/JPY typically most active outside US hours?",
      options: [
        { id: "a", text: "Sydney session" },
        { id: "b", text: "Tokyo session" },
        { id: "c", text: "Late London afternoon only" },
        { id: "d", text: "It moves equally at all hours" },
      ],
      correctAnswer: "b",
      explanation:
        "The yen's home market is Tokyo — Japanese banks and funds transact during Asian hours.",
      relatedConcept: "Home sessions",
    },
    {
      id: "q4",
      type: "scenario",
      question:
        "A beginner can only practise 22:00–24:00 UK time and wants to trade GBP/USD. What's the honest assessment?",
      options: [
        { id: "a", text: "Perfect — GBP moves at all hours" },
        { id: "b", text: "Poor fit — GBP/USD is quiet then; consider JPY or AUD pairs, or different hours" },
        { id: "c", text: "Good, because spreads are tighter at night" },
        { id: "d", text: "It only matters which broker they use" },
      ],
      correctAnswer: "b",
      explanation:
        "That window is after New York winds down and before Tokyo peaks — GBP/USD will mostly drift. Match pairs to the session you can actually attend.",
      beginnerHint: "Whose home market is open at 22:00 UK time? Not Britain's or America's.",
      relatedConcept: "Session fit",
    },
    {
      id: "q5",
      type: "true-false",
      question:
        "Trading the same session every day makes your practice compound, because market conditions are comparable day to day.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "true",
      explanation:
        "Consistent hours mean consistent context — the fastest way to build reliable pattern recognition.",
      relatedConcept: "Consistency",
    },
  ],
}

/** Module 3 quiz — Choosing Currency Pairs. */
export const choosingPairsCheckQuiz: CourseQuiz = {
  id: "choosing-pairs-check",
  lessonId: "fxb-m3-quiz",
  pathId: PATH_ID,
  title: "Choosing Pairs Check",
  description: "Specialisation, currency strength, DXY, and correlation.",
  passingScore: 70,
  xpReward: 50,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "Why do professionals trade only 3–5 pairs?",
      options: [
        { id: "a", text: "Brokers limit the number of pairs" },
        { id: "b", text: "Deep familiarity builds pattern recognition that spreading attention 28 ways never can" },
        { id: "c", text: "Other pairs are too expensive" },
        { id: "d", text: "It's a regulatory requirement" },
      ],
      correctAnswer: "b",
      explanation:
        "Specialisation means knowing how your pairs behave per session, per news event, per market phase — the foundation of intuition.",
      relatedConcept: "Specialisation",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "DXY is rising strongly. What does this typically mean for EUR/USD?",
      options: [
        { id: "a", text: "EUR/USD tends to rise" },
        { id: "b", text: "EUR/USD tends to fall" },
        { id: "c", text: "No relationship exists" },
        { id: "d", text: "EUR/USD stops moving" },
      ],
      correctAnswer: "b",
      explanation:
        "A strengthening dollar (the quote currency) pushes EUR/USD down — the pair and DXY are strongly inversely related.",
      relatedConcept: "DXY",
    },
    {
      id: "q3",
      type: "scenario",
      question:
        "EUR is the strongest currency on the board and JPY is the weakest. Which trade best exploits this?",
      options: [
        { id: "a", text: "Sell EUR/JPY" },
        { id: "b", text: "Buy EUR/JPY" },
        { id: "c", text: "Buy USD/JPY" },
        { id: "d", text: "Skip — strength readings don't matter" },
      ],
      correctAnswer: "b",
      explanation:
        "Strongest base vs weakest quote: both forces push EUR/JPY up. Pairing extremes gives the cleanest directional edge.",
      beginnerHint: "You want to BUY strength and SELL weakness in one pair.",
      relatedConcept: "Currency strength",
    },
    {
      id: "q4",
      type: "scenario",
      question:
        "You're long EUR/USD and see a similar buy setup on GBP/USD. Adding it means:",
      options: [
        { id: "a", text: "Perfect diversification across two trades" },
        { id: "b", text: "Roughly doubling your short-dollar exposure — the pairs are positively correlated" },
        { id: "c", text: "Hedging your first position" },
        { id: "d", text: "No effect on total risk" },
      ],
      correctAnswer: "b",
      explanation:
        "Both trades are bets against the dollar. If USD strengthens, both lose together. Count risk per currency, not per pair.",
      relatedConcept: "Correlation",
    },
    {
      id: "q5",
      type: "true-false",
      question:
        "EUR/USD and USD/CHF are classically negatively correlated because the dollar sits on opposite sides of each pair.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "true",
      explanation:
        "Dollar strength lowers EUR/USD but raises USD/CHF — the classic mirror relationship.",
      relatedConcept: "Negative correlation",
    },
    {
      id: "q6",
      type: "multiple-choice",
      question: "A pair fails your watchlist filter if:",
      options: [
        { id: "a", text: "It has a clear trend and clean structure" },
        { id: "b", text: "It agrees with the dollar picture" },
        { id: "c", text: "Its chart is messy — even if everything else aligns" },
        { id: "d", text: "It has no news today" },
      ],
      correctAnswer: "c",
      explanation:
        "Structure is non-negotiable. A choppy, unreadable chart is untradeable regardless of context.",
      relatedConcept: "Watchlist filtering",
    },
  ],
}

/** Path milestone — Forex Basics Assessment. */
export const forexBasicsAssessment: CourseQuiz = {
  id: "forex-basics-assessment",
  lessonId: "fxb-m4-quiz",
  pathId: PATH_ID,
  title: "Forex Basics Assessment",
  description:
    "The milestone: apply fundamentals, sessions, pair selection, and news awareness together.",
  passingScore: 70,
  xpReward: 100,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "Which events are the classic 'big four' red-tier releases for USD pairs?",
      options: [
        { id: "a", text: "Retail sales, housing starts, PMI, trade balance" },
        { id: "b", text: "FOMC, CPI, NFP, interest rate decisions" },
        { id: "c", text: "Consumer confidence, GDP revisions, oil inventories, auctions" },
        { id: "d", text: "Elections, weather reports, earnings, dividends" },
      ],
      correctAnswer: "b",
      explanation:
        "Rate decisions and the data that shapes them (inflation, jobs) are the events that violently reprice every dollar pair.",
      relatedConcept: "High-impact news",
    },
    {
      id: "q2",
      type: "scenario",
      question:
        "It's 13:20 UTC. NFP prints at 13:30. Your GBP/USD setup just completed. The professional decision is:",
      options: [
        { id: "a", text: "Enter now before the news makes it move" },
        { id: "b", text: "Enter with double size to exploit volatility" },
        { id: "c", text: "Wait — let the release happen, then re-evaluate the setup" },
        { id: "d", text: "Enter without a stop loss so you can't get wicked out" },
      ],
      correctAnswer: "c",
      explanation:
        "Ten minutes before red news, the release decides the move — not your setup. Spreads widen and stops can gap. Wait.",
      beginnerHint: "What happens to spreads and stops during red news?",
      relatedConcept: "News timing",
    },
    {
      id: "q3",
      type: "scenario",
      question:
        "Morning plan: DXY falling for three days, EUR/USD in a clean uptrend, no red news until tomorrow, London just opened. This combination is:",
      options: [
        { id: "a", text: "A green light — context, structure, session, and calendar align" },
        { id: "b", text: "A skip — DXY falling is bad for EUR/USD" },
        { id: "c", text: "A short opportunity on EUR/USD" },
        { id: "d", text: "Meaningless — only the setup matters" },
      ],
      correctAnswer: "a",
      explanation:
        "Weak dollar supports EUR/USD longs, the trend agrees, London provides liquidity, and the calendar is clear — full alignment.",
      relatedConcept: "Morning planning",
    },
    {
      id: "q4",
      type: "multiple-choice",
      question:
        "Account $5,000. You want to risk 1% with a 25-pip stop. Pip value is $1 per mini lot. What size?",
      options: [
        { id: "a", text: "0.5 mini lots" },
        { id: "b", text: "2 mini lots ($50 ÷ 25 pips = $2/pip)" },
        { id: "c", text: "5 mini lots" },
        { id: "d", text: "10 mini lots" },
      ],
      correctAnswer: "b",
      explanation:
        "Risk = $50. $50 ÷ (25 pips × $1) = 2 mini lots. Size comes FROM risk and stop distance — never the other way round.",
      beginnerHint: "First find the dollar risk, then divide by (stop pips × pip value).",
      relatedConcept: "Position sizing",
    },
    {
      id: "q5",
      type: "scenario",
      question:
        "Your watchlist filter left you zero pairs today: charts are messy and CPI lands mid-session. What's the right conclusion?",
      options: [
        { id: "a", text: "Lower your standards so you can trade something" },
        { id: "b", text: "A zero-trade day is the system working — protect capital and return tomorrow" },
        { id: "c", text: "Trade an exotic pair instead" },
        { id: "d", text: "Trade without a watchlist" },
      ],
      correctAnswer: "b",
      explanation:
        "The filter's job is to say no on bad days. Skipping is a correct professional output, not a failure.",
      relatedConcept: "When not to trade",
    },
    {
      id: "q6",
      type: "true-false",
      question:
        "Markets react to the gap between the forecast and the actual number — not to whether the number is 'good' in absolute terms.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "true",
      explanation:
        "Expectations are already priced in. The SURPRISE is what moves price.",
      relatedConcept: "News expectations",
    },
    {
      id: "q7",
      type: "multiple-choice",
      question: "Which watchlist below shows the best construction discipline?",
      options: [
        { id: "a", text: "All 28 pairs 'to stay informed'" },
        { id: "b", text: "EUR/USD, GBP/USD, EUR/GBP, GBP/JPY — whatever looked exciting" },
        { id: "c", text: "Three pairs with clean trends that agree with DXY, checked against today's calendar" },
        { id: "d", text: "One exotic pair with a huge spread but big daily range" },
      ],
      correctAnswer: "c",
      explanation:
        "Small, filtered, context-aligned, and news-checked — every attribute of a professional list.",
      relatedConcept: "Watchlist building",
    },
  ],
}

export const FOREX_BASICS_QUIZZES: CourseQuiz[] = [
  forexFundamentalsCheckQuiz,
  tradingSessionsCheckQuiz,
  choosingPairsCheckQuiz,
  forexBasicsAssessment,
]
