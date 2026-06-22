import type { CourseQuiz } from "@/lib/course/types"

export const tradingBasicsCheckQuiz: CourseQuiz = {
  id: "trading-basics-check",
  pathId: "trading-foundations",
  lessonId: "tf-m1-quiz-basics",
  title: "Trading Basics Check",
  description: "Test your understanding of markets, price, and what trading means.",
  passingScore: 70,
  xpReward: 50,
  questions: [
    {
      id: "tbq-1",
      type: "multiple-choice",
      question: "What is trading?",
      options: [
        { id: "a", text: "Buying and selling to benefit from price movement" },
        { id: "b", text: "Guaranteeing profit every day" },
        { id: "c", text: "Only holding assets for many years" },
      ],
      correctAnswer: "a",
      explanation:
        "Trading focuses on shorter-term price movement. It is not a guarantee of profit.",
      beginnerHint: "Think about buying low and selling higher — or the reverse.",
      relatedConcept: "What is Trading?",
    },
    {
      id: "tbq-2",
      type: "true-false",
      question: "Price moves because buyers and sellers disagree on value.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "true",
      explanation:
        "When more people want to buy, price tends to rise. When more want to sell, price tends to fall.",
      relatedConcept: "What Moves Price?",
    },
    {
      id: "tbq-3",
      type: "scenario",
      question:
        "A beginner sees a social media post promising '10x returns this week.' What is the best response?",
      options: [
        { id: "a", text: "Ignore it and keep learning with practice" },
        { id: "b", text: "Deposit money immediately to not miss out" },
        { id: "c", text: "Copy the trade without understanding it" },
      ],
      correctAnswer: "a",
      explanation:
        "Profit promises are a common beginner trap. Education and practice come first.",
      beginnerHint: "No serious educator promises guaranteed returns.",
      relatedConcept: "Beginner safety",
    },
  ],
}

export const candlestickBasicsQuiz: CourseQuiz = {
  id: "candlestick-basics",
  pathId: "trading-foundations",
  lessonId: "tf-m2-quiz-candles",
  title: "Candlestick Basics",
  description: "Check that you can read a single candle and understand what it shows.",
  passingScore: 70,
  xpReward: 50,
  questions: [
    {
      id: "cbq-1",
      type: "multiple-choice",
      question: "What does the body of a candlestick show?",
      options: [
        { id: "a", text: "Open and close price for that period" },
        { id: "b", text: "Only the highest price" },
        { id: "c", text: "Trading volume only" },
      ],
      correctAnswer: "a",
      explanation: "The thick body connects open to close. Wicks show the high and low.",
      relatedConcept: "Candlestick Anatomy",
    },
    {
      id: "cbq-2",
      type: "multiple-choice",
      question: "A green (bullish) candle means…",
      options: [
        { id: "a", text: "Close is higher than open" },
        { id: "b", text: "Close is lower than open" },
        { id: "c", text: "Price did not move" },
      ],
      correctAnswer: "a",
      explanation: "Bullish candles show buyers pushed price up during that period.",
      relatedConcept: "Bullish vs Bearish Candles",
    },
    {
      id: "cbq-3",
      type: "scenario",
      question:
        "You see a candle with a long lower wick and a small green body. What might that suggest?",
      options: [
        { id: "a", text: "Sellers pushed down but buyers recovered before close" },
        { id: "b", text: "Price will always go up next" },
        { id: "c", text: "The market is closed" },
      ],
      correctAnswer: "a",
      explanation:
        "Long lower wicks often show rejection of lower prices — but one candle alone is not a signal.",
      beginnerHint: "Wicks show where price was rejected during the period.",
      relatedConcept: "Candlestick Anatomy",
    },
  ],
}
