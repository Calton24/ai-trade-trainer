import type { Lesson } from "@/lib/types"

export const lessons: Lesson[] = [
  {
    id: "what-is-trading",
    moduleId: "mod-0",
    title: "What is Trading?",
    subtitle: "Understand markets, price, and why people trade",
    difficulty: "beginner",
    estimatedMinutes: 15,
    xpReward: 40,
    category: "forex",
    pathId: "trading-foundations",
    keyIdea: "Trading is buying and selling financial instruments to profit from price movement — in this app, you practice on simulated charts, not live money.",
    sections: [
      {
        heading: "What is trading?",
        content: "Trading means buying or selling an asset — like a currency pair or crypto — hoping to profit when the price moves in your favour. Unlike investing (holding for years), traders focus on shorter-term price moves.",
      },
      {
        heading: "How do markets move?",
        content: "Prices move because buyers and sellers disagree on value. When more people want to buy, price rises. When more want to sell, price falls. Charts show this history as candlesticks over time.",
      },
      {
        heading: "Simulation vs live trading",
        content: "TradeTrainer AI is an educational simulator. You practice reading charts and marking setups without risking real money. Learn the skills first — live trading comes much later.",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the main goal of trading?",
        options: [
          { id: "a", text: "Profit from price movement", correct: true },
          { id: "b", text: "Guarantee daily income", correct: false },
          { id: "c", text: "Avoid all risk entirely", correct: false },
        ],
        explanation: "Traders aim to profit from price moves, but losses are always possible — which is why practice matters.",
      },
    ],
    nextLessonId: "candlesticks-101",
  },
  {
    id: "candlesticks-101",
    moduleId: "mod-1",
    title: "Reading Candlesticks",
    subtitle: "Your first step to understanding price charts",
    difficulty: "beginner",
    estimatedMinutes: 15,
    xpReward: 50,
    category: "candlesticks",
    pathId: "trading-foundations",
    keyIdea: "Each candle shows the open, high, low, and close price for a time period. Green means price went up; red means it went down.",
    sections: [
      {
        heading: "What is a candlestick?",
        content: "A candlestick is a visual snapshot of price movement over a set time (like 15 minutes or 1 hour). The thick part (body) shows where price opened and closed. The thin lines (wicks) show the highest and lowest prices during that period.",
      },
      {
        heading: "Green vs red candles",
        content: "A green (bullish) candle means the closing price was higher than the opening price — buyers were in control. A red (bearish) candle means the closing price was lower — sellers pushed price down.",
      },
      {
        heading: "Why wicks matter",
        content: "Long wicks show that price tried to move in one direction but was rejected. A long lower wick means sellers pushed price down, but buyers stepped in and pushed it back up before the candle closed.",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "What does a green candle tell you?",
        options: [
          { id: "a", text: "Price closed higher than it opened", correct: true },
          { id: "b", text: "Price closed lower than it opened", correct: false },
          { id: "c", text: "Price did not move", correct: false },
        ],
        explanation: "Green candles mean buyers pushed price up during that period.",
      },
    ],
    nextLessonId: "market-structure-101",
  },
  {
    id: "market-structure-101",
    moduleId: "mod-2",
    title: "Understanding Trends",
    subtitle: "How to see if price is going up, down, or sideways",
    difficulty: "beginner",
    estimatedMinutes: 20,
    xpReward: 50,
    category: "price-action",
    pathId: "trading-foundations",
    keyIdea: "An uptrend makes higher highs and higher lows. A downtrend makes lower highs and lower lows. Trade with the trend, not against it.",
    sections: [
      {
        heading: "What is a trend?",
        content: "A trend is the general direction price is moving. In an uptrend, each swing high is higher than the last, and each swing low is higher too. In a downtrend, the opposite happens.",
      },
      {
        heading: "Why trends matter for beginners",
        content: "Beginners often try to predict reversals too early. It's easier to practice setups that align with the current trend. Think of the trend as the 'wind direction' — it's easier to sail with the wind.",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "In an uptrend, swing lows should be…",
        options: [
          { id: "a", text: "Higher than the previous swing low", correct: true },
          { id: "b", text: "Lower than the previous swing low", correct: false },
          { id: "c", text: "Exactly the same", correct: false },
        ],
        explanation: "Higher lows are a defining feature of an uptrend.",
      },
    ],
    nextLessonId: "support-resistance-101",
  },
  {
    id: "support-resistance-101",
    moduleId: "mod-3",
    title: "Support & Resistance Levels",
    subtitle: "The price zones where reactions happen",
    difficulty: "beginner",
    estimatedMinutes: 20,
    xpReward: 75,
    category: "price-action",
    pathId: "price-action",
    keyIdea: "Support is a price floor where buyers tend to step in. Resistance is a price ceiling where sellers tend to appear.",
    sections: [
      {
        heading: "Support explained simply",
        content: "Support is a price level where price has bounced up multiple times. Think of it as a floor — when price drops to this area, buyers often show up and push price back up.",
      },
      {
        heading: "Resistance explained simply",
        content: "Resistance is where price has struggled to go higher. It's a ceiling — sellers often appear here and push price back down.",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "Resistance acts like a…",
        options: [
          { id: "a", text: "Ceiling where price struggles to rise", correct: true },
          { id: "b", text: "Floor where price bounces up", correct: false },
          { id: "c", text: "Random line with no meaning", correct: false },
        ],
        explanation: "Resistance is a zone where selling pressure tends to appear.",
      },
    ],
    nextLessonId: "breakouts-fakeouts-101",
  },
  {
    id: "breakouts-fakeouts-101",
    moduleId: "mod-4",
    title: "Breakouts vs Fakeouts",
    subtitle: "Real breaks vs traps that catch beginners",
    difficulty: "beginner",
    estimatedMinutes: 25,
    xpReward: 75,
    category: "price-action",
    pathId: "price-action",
    keyIdea: "A breakout is when price closes beyond a key level with conviction. A fakeout breaks the level briefly, then reverses — trapping traders who entered too early.",
    sections: [
      {
        heading: "What is a breakout?",
        content: "A breakout happens when price pushes through a support or resistance level and closes beyond it. This can signal that the level has changed roles — old resistance may become new support.",
      },
      {
        heading: "What is a fakeout?",
        content: "A fakeout looks like a breakout but quickly reverses. Price pokes above resistance, triggers buy orders, then falls back below. Beginners often chase these moves and get stopped out.",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "A fakeout is when price…",
        options: [
          { id: "a", text: "Breaks a level then quickly reverses", correct: true },
          { id: "b", text: "Stays inside a range forever", correct: false },
          { id: "c", text: "Always goes up after breaking resistance", correct: false },
        ],
        explanation: "Fakeouts trap traders who enter on the initial break without confirmation.",
      },
    ],
    nextLessonId: "break-retest-101",
  },
  {
    id: "break-retest-101",
    moduleId: "mod-5",
    title: "What is a Break & Retest?",
    subtitle: "The setup beginners practice most on TradeTrainer AI",
    difficulty: "beginner",
    estimatedMinutes: 30,
    xpReward: 100,
    category: "price-action",
    pathId: "price-action",
    keyIdea: "Price breaks above a key level, returns to test that level as new support, and traders look for confirmation before entering. If price falls back through the level, the setup is invalid.",
    sections: [
      {
        heading: "Step 1: Price breaks above a key level",
        content: "First, identify a clear resistance level where price has been rejected multiple times. A break happens when price closes above this level with a strong candle — not just a quick wick above it.",
      },
      {
        heading: "Step 2: Price returns to test that level",
        content: "After breaking, price often pulls back to the same level. This is the 'retest' — the old resistance is now being tested as new support. Patient traders wait for this instead of chasing the initial break.",
      },
      {
        heading: "Step 3: Look for confirmation before entry",
        content: "Before entering, look for signs that buyers are defending the level: a bullish candle closing above it, a rejection wick, or reduced selling volume. Entering without confirmation is a common beginner mistake.",
      },
      {
        heading: "Step 4: Know your invalidation",
        content: "If price falls back through the level and closes below it, the setup is invalid. Your stop loss should go below this level — that's where your idea is proven wrong.",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "In a bullish Break & Retest, old resistance becomes…",
        options: [
          { id: "a", text: "New support after the break", correct: true },
          { id: "b", text: "Stronger resistance", correct: false },
          { id: "c", text: "Irrelevant to the trade", correct: false },
        ],
        explanation: "After a break, the level often flips from resistance to support on the retest.",
      },
      {
        id: "q2",
        question: "When is a Break & Retest setup invalid?",
        options: [
          { id: "a", text: "When price closes back below the broken level", correct: true },
          { id: "b", text: "When price retests the level", correct: false },
          { id: "c", text: "When you set a stop loss", correct: false },
        ],
        explanation: "Closing back below the level means buyers failed to hold support.",
      },
    ],
    nextLessonId: "risk-reward-101",
  },
  {
    id: "risk-reward-101",
    moduleId: "mod-6",
    title: "Risk/Reward Basics",
    subtitle: "Plan how much you could lose vs how much you could gain",
    difficulty: "beginner",
    estimatedMinutes: 20,
    xpReward: 75,
    category: "risk",
    pathId: "risk-management",
    isPro: true,
    keyIdea: "Before every trade, know your entry, stop loss, and take profit. Aim for at least 2:1 reward-to-risk — you should stand to gain at least twice what you could lose.",
    sections: [
      {
        heading: "What is risk/reward?",
        content: "Risk is the distance from your entry to your stop loss. Reward is the distance from your entry to your take profit. A 2:1 ratio means your target is twice as far as your stop.",
      },
      {
        heading: "Why beginners need this",
        content: "You don't need to win every trade to learn. With good risk/reward, even being right half the time can work. Without a plan, one bad trade can wipe out several good ones.",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "A 2:1 risk/reward ratio means…",
        options: [
          { id: "a", text: "Potential profit is 2× the potential loss", correct: true },
          { id: "b", text: "You risk £2 for every £1 profit", correct: false },
          { id: "c", text: "You always win 2 trades in a row", correct: false },
        ],
        explanation: "2:1 means your take profit distance is twice your stop loss distance.",
      },
    ],
    nextLessonId: "journaling-101",
  },
  {
    id: "journaling-101",
    moduleId: "mod-7",
    title: "Why Journal Your Practice",
    subtitle: "Turn every drill into a learning moment",
    difficulty: "beginner",
    estimatedMinutes: 15,
    xpReward: 50,
    category: "psychology",
    pathId: "trading-psychology",
    isPro: true,
    keyIdea: "Writing down what you practiced, what you got wrong, and how confident you felt helps you improve faster than repeating drills without reflection.",
    sections: [
      {
        heading: "Journal for learning, not profit tracking",
        content: "On TradeTrainer AI, your journal is a learning log — not a live trading record. Note what setup you practiced, what the AI coach said, and what you'd do differently next time.",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "A practice journal helps you…",
        options: [
          { id: "a", text: "Spot repeating mistakes over time", correct: true },
          { id: "b", text: "Guarantee profits in live markets", correct: false },
          { id: "c", text: "Skip the learning lessons", correct: false },
        ],
        explanation: "Journaling reveals patterns in your decision-making.",
      },
    ],
    nextLessonId: "psychology-101",
  },
  {
    id: "psychology-101",
    moduleId: "mod-8",
    title: "Psychology & Discipline",
    subtitle: "The skills that separate consistent learners from frustrated beginners",
    difficulty: "beginner",
    estimatedMinutes: 20,
    xpReward: 75,
    category: "psychology",
    pathId: "trading-psychology",
    isPro: true,
    keyIdea: "Patience and rule-following matter more than finding the 'perfect' setup. Wait for your criteria, accept being wrong, and focus on process over outcomes.",
    sections: [
      {
        heading: "FOMO and early entries",
        content: "Fear of missing out makes beginners enter before confirmation. In drills, practice waiting — if you miss a move, another setup will come. There is always another chart.",
      },
      {
        heading: "Build discipline through drills",
        content: "Each drill is a chance to follow your rules without real money at stake. The habit you build here carries into how you think about trading — even in simulation.",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "Discipline in trading means…",
        options: [
          { id: "a", text: "Following your plan even when it's hard to wait", correct: true },
          { id: "b", text: "Taking every setup you see", correct: false },
          { id: "c", text: "Never using a stop loss", correct: false },
        ],
        explanation: "Discipline is sticking to your rules, especially when emotions run high.",
      },
    ],
    nextLessonId: null,
  },
]

export function getLessonById(id: string) {
  return lessons.find((l) => l.id === id)
}

export function getLessonsByModuleId(moduleId: string) {
  return lessons.filter((l) => l.moduleId === moduleId)
}
