import type { Quiz, QuizDiscussionPrompt, QuizDiscussionResponse } from "@/lib/types"

export const quizzes: Quiz[] = [
  {
    id: "candlestick-basics-quiz",
    pathId: "trading-foundations",
    title: "Candlestick Basics Quiz",
    description: "Test your understanding of candlestick reading fundamentals.",
    xpReward: 50,
    passingScore: 70,
    questions: [
      {
        id: "cb-q1",
        type: "multiple_choice",
        question: "What does a bullish candle usually mean?",
        options: [
          { id: "a", text: "Price closed higher than it opened", correct: true },
          { id: "b", text: "Price closed lower than it opened", correct: false },
          { id: "c", text: "Price did not move at all", correct: false },
          { id: "d", text: "Buyers and sellers were equal", correct: false },
        ],
        explanation:
          "A bullish (green) candle shows buyers pushed price above the opening price by the close.",
      },
      {
        id: "cb-q2",
        type: "multiple_choice",
        question: "What does the candle wick show?",
        options: [
          { id: "a", text: "The highest and lowest price reached during that candle", correct: true },
          { id: "b", text: "Only the closing price", correct: false },
          { id: "c", text: "The volume traded", correct: false },
          { id: "d", text: "The next candle's direction", correct: false },
        ],
        explanation:
          "Wicks show price rejection or movement beyond the open/close body during that period.",
        chartPlaceholder: true,
      },
      {
        id: "cb-q3",
        type: "true_false",
        question: "One candle alone is always enough to enter a trade.",
        options: [
          { id: "true", text: "True", correct: false },
          { id: "false", text: "False", correct: true },
        ],
        explanation:
          "Beginners should use candles together with structure, key levels, and risk rules — never a single candle in isolation.",
      },
    ],
  },
  {
    id: "break-retest-quiz",
    pathId: "price-action",
    title: "Break & Retest Quiz",
    description: "Check your understanding of the Break & Retest setup.",
    xpReward: 75,
    passingScore: 70,
    questions: [
      {
        id: "br-q1",
        type: "multiple_choice",
        question: "What happens first in a break and retest setup?",
        options: [
          { id: "a", text: "Price breaks through a key level", correct: true },
          { id: "b", text: "Price retests the level", correct: false },
          { id: "c", text: "You enter the trade", correct: false },
          { id: "d", text: "Price forms a range", correct: false },
        ],
        explanation: "The break comes first — price must close beyond a key support or resistance level.",
      },
      {
        id: "br-q2",
        type: "multiple_choice",
        question: "What is the retest?",
        options: [
          { id: "a", text: "Price returns to the broken level to test it as support or resistance", correct: true },
          { id: "b", text: "Price breaks the level again", correct: false },
          { id: "c", text: "Price moves to take profit", correct: false },
          { id: "d", text: "The stop loss gets hit", correct: false },
        ],
        explanation:
          "After breaking, price often pulls back to the same level — the old resistance is now tested as new support.",
      },
      {
        id: "br-q3",
        type: "scenario",
        question: "What invalidates a bullish break and retest?",
        options: [
          { id: "a", text: "Price falls back below the broken level and fails to hold", correct: true },
          { id: "b", text: "Price retests the level", correct: false },
          { id: "c", text: "You set a stop loss", correct: false },
          { id: "d", text: "Volume increases on the break", correct: false },
        ],
        explanation:
          "If price closes back below the broken level, buyers failed to hold support — the setup is invalid.",
        chartPlaceholder: true,
      },
    ],
  },
  {
    id: "icc-beginner-quiz",
    pathId: "icc-strategy",
    title: "ICC Beginner Quiz",
    description: "Test your knowledge of Indication, Correction, and Continuation.",
    xpReward: 100,
    passingScore: 70,
    questions: [
      {
        id: "icc-q1",
        type: "multiple_choice",
        question: "What is the Indication phase?",
        options: [
          { id: "a", text: "A strong move that breaks a meaningful swing high or low", correct: true },
          { id: "b", text: "A sideways range", correct: false },
          { id: "c", text: "The entry point", correct: false },
          { id: "d", text: "The stop loss placement", correct: false },
        ],
        explanation: "Indication is the initial strong push that signals a potential new direction.",
      },
      {
        id: "icc-q2",
        type: "true_false",
        question: "Should you enter during the Indication phase?",
        options: [
          { id: "true", text: "True", correct: false },
          { id: "false", text: "False", correct: true },
        ],
        explanation:
          "No — breakouts during Indication can trap early traders. Wait for the Correction and Continuation.",
      },
      {
        id: "icc-q3",
        type: "multiple_choice",
        question: "What is the Correction phase?",
        options: [
          { id: "a", text: "A pullback against the initial move", correct: true },
          { id: "b", text: "The strongest part of the trend", correct: false },
          { id: "c", text: "When you close the trade", correct: false },
          { id: "d", text: "A fakeout", correct: false },
        ],
        explanation: "Correction is the healthy pullback that resets momentum before continuation.",
      },
      {
        id: "icc-q4",
        type: "best_answer",
        question: "What confirms the Continuation phase?",
        options: [
          { id: "a", text: "Price moves again in the original direction with lower timeframe confirmation", correct: true },
          { id: "b", text: "Price breaks the opposite direction", correct: false },
          { id: "c", text: "Volume drops to zero", correct: false },
          { id: "d", text: "A single red candle appears", correct: false },
        ],
        explanation:
          "Continuation is confirmed when price resumes the Indication direction, ideally with LTF structure confirmation.",
      },
    ],
  },
  {
    id: "risk-reward-quiz",
    pathId: "risk-management",
    title: "Risk/Reward Quiz",
    description: "Test your risk management knowledge.",
    xpReward: 75,
    passingScore: 70,
    questions: [
      {
        id: "rr-q1",
        type: "multiple_choice",
        question: "If you risk £10 to make £20, what is the risk/reward ratio?",
        options: [
          { id: "a", text: "1:2", correct: true },
          { id: "b", text: "2:1", correct: false },
          { id: "c", text: "1:1", correct: false },
          { id: "d", text: "3:1", correct: false },
        ],
        explanation: "You risk £1 for every £2 of potential reward — that's a 1:2 risk/reward ratio.",
      },
      {
        id: "rr-q2",
        type: "best_answer",
        question: "Why should beginners define stop loss before entering?",
        options: [
          { id: "a", text: "To know the risk before taking the trade", correct: true },
          { id: "b", text: "To guarantee a profit", correct: false },
          { id: "c", text: "To avoid using take profit", correct: false },
          { id: "d", text: "Because the broker requires it", correct: false },
        ],
        explanation:
          "Knowing your stop loss before entry means you know exactly how much you could lose — that's responsible trading.",
      },
      {
        id: "rr-q3",
        type: "true_false",
        question: "A high win rate matters more than risk management.",
        options: [
          { id: "true", text: "True", correct: false },
          { id: "false", text: "False", correct: true },
        ],
        explanation:
          "Even with a high win rate, poor risk management can wipe out an account. Risk management comes first.",
      },
    ],
  },
  {
    id: "foundations-final-quiz",
    pathId: "trading-foundations",
    title: "Foundations Final Quiz",
    description: "Final assessment for the Trading Foundations path.",
    xpReward: 100,
    passingScore: 70,
    questions: [
      {
        id: "ff-q1",
        type: "multiple_choice",
        question: "What is market structure?",
        options: [
          { id: "a", text: "The pattern of swing highs and lows that define trends", correct: true },
          { id: "b", text: "The broker's fee schedule", correct: false },
          { id: "c", text: "The number of traders in a market", correct: false },
          { id: "d", text: "A type of candlestick pattern", correct: false },
        ],
        explanation: "Market structure refers to the sequence of highs and lows that reveal trend direction.",
      },
      {
        id: "ff-q2",
        type: "true_false",
        question: "Support is a price level where buying pressure tends to appear.",
        options: [
          { id: "true", text: "True", correct: true },
          { id: "false", text: "False", correct: false },
        ],
        explanation: "Support acts as a floor — buyers often step in when price reaches this zone.",
      },
    ],
  },
  {
    id: "forex-terms-quiz",
    pathId: "forex-basics",
    title: "Forex Terms Quiz",
    description: "Test your forex vocabulary and concepts.",
    xpReward: 50,
    passingScore: 70,
    questions: [
      {
        id: "ft-q1",
        type: "multiple_choice",
        question: "What is a pip in forex?",
        options: [
          { id: "a", text: "The smallest standard price move in a currency pair", correct: true },
          { id: "b", text: "The spread charged by brokers", correct: false },
          { id: "c", text: "A type of chart pattern", correct: false },
          { id: "d", text: "The daily profit target", correct: false },
        ],
        explanation: "A pip (percentage in point) is the standard unit measuring price movement in forex.",
      },
    ],
  },
  {
    id: "forex-final-quiz",
    pathId: "forex-basics",
    title: "Forex Basics Final Quiz",
    description: "Final assessment for the Forex Basics path.",
    xpReward: 100,
    passingScore: 70,
    questions: [
      {
        id: "fxf-q1",
        type: "multiple_choice",
        question: "Which session typically has the highest forex volume?",
        options: [
          { id: "a", text: "London / New York overlap", correct: true },
          { id: "b", text: "Asia session only", correct: false },
          { id: "c", text: "Weekend trading", correct: false },
          { id: "d", text: "Holiday periods", correct: false },
        ],
        explanation: "The London-New York overlap sees the most liquidity and volatility in forex markets.",
      },
    ],
  },
  {
    id: "psychology-quiz",
    pathId: "trading-psychology",
    title: "Psychology Scenario Quiz",
    description: "Scenario-based questions about trading psychology.",
    xpReward: 75,
    passingScore: 70,
    questions: [
      {
        id: "pq-q1",
        type: "scenario",
        question: "You just lost 3 trades in a row. What should you do?",
        options: [
          { id: "a", text: "Take a break and review your journal before trading again", correct: true },
          { id: "b", text: "Double your position size to recover losses", correct: false },
          { id: "c", text: "Take every setup you see to make it back", correct: false },
          { id: "d", text: "Remove your stop loss to avoid more losses", correct: false },
        ],
        explanation:
          "After a losing streak, step away. Revenge trading is one of the fastest ways beginners blow up accounts.",
      },
    ],
  },
  {
    id: "psychology-final-quiz",
    pathId: "trading-psychology",
    title: "Discipline Final Review",
    description: "Final review of trading psychology and discipline concepts.",
    xpReward: 100,
    passingScore: 70,
    questions: [
      {
        id: "pf-q1",
        type: "true_false",
        question: "Following a written trading plan helps reduce emotional decisions.",
        options: [
          { id: "true", text: "True", correct: true },
          { id: "false", text: "False", correct: false },
        ],
        explanation: "A written plan gives you rules to follow when emotions run high.",
      },
    ],
  },
]

export const quizDiscussionPrompts: QuizDiscussionPrompt[] = [
  { id: "explain-new", label: "Explain this like I'm brand new" },
  { id: "why-wrong", label: "Why was my answer wrong?" },
  { id: "simple-example", label: "Give me a simple example" },
  { id: "real-chart", label: "How does this apply to a real chart?" },
  { id: "study-next", label: "What should I study next?" },
]

export const quizDiscussionResponses: Record<string, QuizDiscussionResponse[]> = {
  "break-retest-quiz": [
    {
      promptId: "explain-new",
      response:
        "Think of a break and retest like a door. Price breaks through a door (resistance), walks away, then comes back to check if the door now holds from the other side. That check is the retest. If the door holds, buyers are defending it — that's your potential entry zone.",
    },
    {
      promptId: "why-wrong",
      response:
        "If you got the retest question wrong, you might have confused the break with the retest. The break happens first — price pushes through the level. The retest comes after — price returns to that same level. Order matters in this setup.",
    },
    {
      promptId: "simple-example",
      response:
        "Imagine resistance at £100. Price pushes to £105 (break). Then it drops back to £100-£102 (retest). If price bounces up from £100, the old resistance is now acting as support. That's a bullish break and retest.",
    },
    {
      promptId: "real-chart",
      response:
        "On a real chart, look for a clear horizontal level where price was rejected 2-3 times. Watch for a strong candle closing above it (break). Then wait for price to pull back to that level and show a bullish reaction (retest). Never enter on the break alone.",
    },
    {
      promptId: "study-next",
      response:
        "Great next steps: complete the 'Mark the Break and Retest' chart drill, then review the Risk/Reward lesson. Understanding where to place your stop loss below the retest level is the natural next skill.",
    },
  ],
  "candlestick-basics-quiz": [
    {
      promptId: "explain-new",
      response:
        "A candlestick is like a mini story of price during one time period. The body shows where price opened and closed. The wicks show how far price traveled before settling. Green = buyers won. Red = sellers won. Simple as that.",
    },
    {
      promptId: "why-wrong",
      response:
        "If you thought one candle is enough to trade, remember: a single candle is one data point. Professionals look at candles in context — near support, in a trend, after a break. Context is everything.",
    },
    {
      promptId: "simple-example",
      response:
        "A candle with a long lower wick and a green body tells you: sellers pushed price down, but buyers fought back and closed higher. That's buyer strength — but only meaningful if it happens at a key support level.",
    },
    {
      promptId: "real-chart",
      response:
        "On a 15-minute chart, zoom out first. Find the overall trend, then look at individual candles near key levels. A bullish candle at support means more than the same candle in the middle of nowhere.",
    },
    {
      promptId: "study-next",
      response:
        "Next up: the Market Structure Basics lesson. You'll learn how swing highs and lows connect to form trends — which gives your candle reading much more context.",
    },
  ],
  default: [
    {
      promptId: "explain-new",
      response:
        "Let me break this down simply. Trading concepts build on each other like steps on a ladder. Each quiz question tests one rung. If you missed one, go back to the related lesson and re-read the 'Key idea' section.",
    },
    {
      promptId: "why-wrong",
      response:
        "Wrong answers are learning opportunities, not failures. Read the explanation carefully, then try to explain the correct answer in your own words. That act of explaining is what makes it stick.",
    },
    {
      promptId: "simple-example",
      response:
        "Think of the market like a conversation between buyers and sellers. Each concept you learn helps you understand what they're 'saying' on the chart. The quiz tests whether you can hear that conversation.",
    },
    {
      promptId: "real-chart",
      response:
        "Open the chart drill page and look for the concept you just quizzed on. Mark it on the chart. Seeing it visually connects the theory to practice — that's when learning really clicks.",
    },
    {
      promptId: "study-next",
      response:
        "Check your learning path syllabus for the next incomplete item. Consistent small steps beat cramming. Your dashboard also shows a recommended next action tailored to your progress.",
    },
  ],
}

export function getQuizById(id: string) {
  return quizzes.find((q) => q.id === id)
}

export function getQuizzesByPathId(pathId: string) {
  return quizzes.filter((q) => q.pathId === pathId)
}

export function getDiscussionResponse(quizId: string, promptId: string) {
  const responses =
    quizDiscussionResponses[quizId] ?? quizDiscussionResponses.default
  return responses.find((r) => r.promptId === promptId)?.response ??
    quizDiscussionResponses.default.find((r) => r.promptId === promptId)
      ?.response ??
    "I'm here to help you understand this concept better. Try re-reading the explanation and attempt the quiz again."
}
