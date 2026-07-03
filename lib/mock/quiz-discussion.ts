import type { QuizDiscussionPrompt, QuizDiscussionResponse } from "@/lib/types"

/**
 * Canned "AI coach" discussion responses shown after a quiz.
 * This is placeholder copy, not user progress/state — safe to keep until
 * a real AI discussion endpoint is wired up.
 */
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

export function getDiscussionResponse(quizId: string, promptId: string) {
  const responses =
    quizDiscussionResponses[quizId] ?? quizDiscussionResponses.default
  return responses.find((r) => r.promptId === promptId)?.response ??
    quizDiscussionResponses.default.find((r) => r.promptId === promptId)
      ?.response ??
    "I'm here to help you understand this concept better. Try re-reading the explanation and attempt the quiz again."
}
