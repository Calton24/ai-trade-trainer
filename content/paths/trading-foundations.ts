import type { LearningPathContent } from "@/lib/course/types"

const PATH_ID = "trading-foundations"

export const tradingFoundationsPath: LearningPathContent = {
  id: PATH_ID,
  slug: PATH_ID,
  title: "Trading Foundations",
  description:
    "Learn the absolute basics of trading, chart reading, market structure, and risk — with real lessons, quizzes, and your first chart drill.",
  level: "beginner",
  category: "foundations",
  order: 1,
  isFree: true,
  status: "available",
  locked: false,
  skillsYouGain: [
    "Read candlestick charts",
    "Identify market structure",
    "Understand risk/reward basics",
    "Build beginner trading rules",
  ],
  whatYouLearn: [
    "What trading is and how markets move",
    "How to read candlesticks",
    "Trends, swings, and ranges",
    "Basic risk management principles",
  ],
  relatedPathSlugs: ["price-action", "risk-management"],
  estimatedMinutes: 0,
  stats: {
    moduleCount: 0,
    lessonCount: 0,
    quizCount: 0,
    drillCount: 0,
    reflectionCount: 0,
  },
  modules: [
    {
      id: "tf-m1",
      pathId: PATH_ID,
      title: "Trading Basics",
      description: "Understand what trading is, what moves price, and how beginners should approach practice.",
      order: 1,
      estimatedMinutes: 0,
      lessons: [
        {
          id: "tf-m1-what-is-trading",
          moduleId: "tf-m1",
          pathId: PATH_ID,
          slug: "what-is-trading",
          title: "What is Trading?",
          description: "Understand markets, price, and why people trade.",
          lessonType: "reading",
          difficulty: "beginner",
          order: 1,
          xpReward: 40,
          prerequisites: [],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "What is Trading?",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "Trading is the act of buying and selling financial instruments — like currency pairs, stocks, or crypto — with the aim of benefiting from price movement. Unlike long-term investing, traders usually focus on shorter timeframes: minutes, hours, or days.",
            },
            {
              id: "def-market",
              type: "definition",
              content: "A place where buyers and sellers meet to exchange assets at prices they agree on.",
              metadata: { term: "Market" },
            },
            {
              id: "def-buyer",
              type: "definition",
              content: "A participant who wants to purchase an asset, often hoping price will rise after they buy.",
              metadata: { term: "Buyer" },
            },
            {
              id: "def-seller",
              type: "definition",
              content: "A participant who wants to sell an asset, often hoping price will fall or that they can sell at a higher price than they paid.",
              metadata: { term: "Seller" },
            },
            {
              id: "ex1",
              type: "example",
              content:
                "If gold moves from 4200 to 4210, the price has increased by 10 points. A trader who bought near 4200 and sold near 4210 would benefit from that move — before costs and fees.",
            },
            {
              id: "callout-key",
              type: "callout",
              content:
                "Beginners should focus on understanding price movement before trying to predict it.",
              metadata: { variant: "key-idea" },
            },
            {
              id: "callout-mistake",
              type: "callout",
              content:
                "Assuming trading is easy money because of social media highlights. Most beginners lose money when they skip education and practice.",
              metadata: { variant: "mistake" },
            },
            {
              id: "safety",
              type: "safety-note",
              content:
                "This is for education only. Do not place real trades based on this lesson. TradeTrainer AI is a simulator.",
            },
            {
              id: "check1",
              type: "checklist",
              content: "Before moving on, make sure you can say:",
              metadata: {
                items: [
                  "I understand trading means buying and selling",
                  "I understand price can move up or down",
                  "I understand beginners should practise before risking money",
                ],
              },
            },
            {
              id: "sum1",
              type: "summary",
              content:
                "Trading is about participating in price movement. Markets exist because buyers and sellers disagree on value. Your first job as a beginner is to learn how price behaves — not to chase profits.",
            },
          ],
        },
        {
          id: "tf-m1-what-moves-price",
          moduleId: "tf-m1",
          pathId: PATH_ID,
          slug: "what-moves-price",
          title: "What Moves Price?",
          description: "Learn why prices rise, fall, and sometimes go nowhere.",
          lessonType: "reading",
          difficulty: "beginner",
          order: 2,
          xpReward: 40,
          prerequisites: ["tf-m1-what-is-trading"],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "What Moves Price?",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "Price moves when the balance between buyers and sellers shifts. If more people want to buy than sell, price tends to rise. If more people want to sell than buy, price tends to fall.",
            },
            {
              id: "def-supply",
              type: "definition",
              content: "How much of an asset is available to sell at a given time.",
              metadata: { term: "Supply" },
            },
            {
              id: "def-demand",
              type: "definition",
              content: "How much buying interest exists for an asset at a given time.",
              metadata: { term: "Demand" },
            },
            {
              id: "ex1",
              type: "example",
              content:
                "Imagine a popular game console launches with limited stock. High demand and low supply can push resale prices up. Markets work similarly — scarcity and desire affect price.",
            },
            {
              id: "callout-key",
              type: "callout",
              content:
                "You do not need to know why news happened — beginners start by observing how price reacts.",
              metadata: { variant: "key-idea" },
            },
            {
              id: "callout-mistake",
              type: "callout",
              content:
                "Thinking one headline always makes price move one way. The same news can produce different reactions depending on context.",
              metadata: { variant: "mistake" },
            },
            {
              id: "chart1",
              type: "chart-example",
              content:
                "On a candlestick chart, rising price shows periods where buyers were stronger. Falling price shows sellers were stronger. Flat sections show balance — a range.",
            },
            {
              id: "sum1",
              type: "summary",
              content:
                "Price is a conversation between buyers and sellers. Your charts show the result of that conversation over time.",
            },
          ],
        },
        {
          id: "tf-m1-quiz-basics",
          moduleId: "tf-m1",
          pathId: PATH_ID,
          slug: "trading-basics-check",
          title: "Trading Basics Check",
          description: "Quick quiz on markets, price, and beginner mindset.",
          lessonType: "quiz",
          difficulty: "beginner",
          order: 3,
          xpReward: 50,
          prerequisites: ["tf-m1-what-moves-price"],
          quizId: "trading-basics-check",
          estimatedMinutes: 0,
          contentBlocks: [],
        },
      ],
    },
    {
      id: "tf-m2",
      pathId: PATH_ID,
      title: "Reading Candles",
      description: "Learn to read individual candlesticks — the building blocks of every chart.",
      order: 2,
      estimatedMinutes: 0,
      lessons: [
        {
          id: "tf-m2-candle-anatomy",
          moduleId: "tf-m2",
          pathId: PATH_ID,
          slug: "candlestick-anatomy",
          title: "Candlestick Anatomy",
          description: "Open, high, low, close, body, and wicks explained simply.",
          lessonType: "reading",
          difficulty: "beginner",
          order: 1,
          xpReward: 45,
          prerequisites: ["tf-m1-quiz-basics"],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "Candlestick Anatomy",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "Each candlestick shows price action for one time period — like 15 minutes or 1 hour. It tells you four prices: open, high, low, and close (often called OHLC).",
            },
            {
              id: "def-body",
              type: "definition",
              content: "The thick part of the candle between open and close.",
              metadata: { term: "Body" },
            },
            {
              id: "def-wick",
              type: "definition",
              content: "The thin lines above and below the body showing the highest and lowest prices reached.",
              metadata: { term: "Wick (or shadow)" },
            },
            {
              id: "ex1",
              type: "example",
              content:
                "If a 1-hour candle opens at 100, drops to 95, rallies to 105, and closes at 103 — the body spans 100 to 103, the lower wick reaches 95, and the upper wick reaches 105.",
            },
            {
              id: "callout-key",
              type: "callout",
              content: "Read one candle at a time before trying to read whole patterns.",
              metadata: { variant: "key-idea" },
            },
            {
              id: "chart1",
              type: "chart-demo",
              scenarioId: "demo-candlestick-anatomy",
              content:
                "Identify the body and wicks on these candles. Notice how long wicks show prices that were rejected.",
            },
            {
              id: "sum1",
              type: "summary",
              content:
                "Every candle is a mini story: where price started, how far it travelled, and where it ended.",
            },
          ],
        },
        {
          id: "tf-m2-bullish-bearish",
          moduleId: "tf-m2",
          pathId: PATH_ID,
          slug: "bullish-vs-bearish-candles",
          title: "Bullish vs Bearish Candles",
          description: "Tell whether buyers or sellers controlled the period.",
          lessonType: "reading",
          difficulty: "beginner",
          order: 2,
          xpReward: 45,
          prerequisites: ["tf-m2-candle-anatomy"],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "Bullish vs Bearish Candles",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "A bullish (green) candle closes higher than it opened — buyers pushed price up. A bearish (red) candle closes lower than it opened — sellers pushed price down.",
            },
            {
              id: "def-bullish",
              type: "definition",
              content: "A candle where close > open, showing buyer control for that period.",
              metadata: { term: "Bullish candle" },
            },
            {
              id: "def-bearish",
              type: "definition",
              content: "A candle where close < open, showing seller control for that period.",
              metadata: { term: "Bearish candle" },
            },
            {
              id: "callout-mistake",
              type: "callout",
              content:
                "Assuming one green candle means price will keep going up. Single candles are clues, not guarantees.",
              metadata: { variant: "mistake" },
            },
            {
              id: "callout-key",
              type: "callout",
              content: "Context matters — the same green candle means different things in an uptrend vs a downtrend.",
              metadata: { variant: "key-idea" },
            },
            {
              id: "chart1",
              type: "chart-demo",
              scenarioId: "demo-bullish-bearish",
              content:
                "Count the consecutive green vs red bodies. Which side controlled this move?",
            },
            {
              id: "sum1",
              type: "summary",
              content:
                "Colour tells you who won that period. Structure tells you who is winning overall — you'll learn that next.",
            },
          ],
        },
        {
          id: "tf-m2-quiz-candles",
          moduleId: "tf-m2",
          pathId: PATH_ID,
          slug: "candlestick-basics-quiz",
          title: "Candlestick Basics",
          description: "Quiz on reading individual candles.",
          lessonType: "quiz",
          difficulty: "beginner",
          order: 3,
          xpReward: 50,
          prerequisites: ["tf-m2-bullish-bearish"],
          quizId: "candlestick-basics",
          estimatedMinutes: 0,
          contentBlocks: [],
        },
      ],
    },
    {
      id: "tf-m3",
      pathId: PATH_ID,
      title: "Market Structure",
      description: "See how swing highs, swing lows, trends, and ranges form on a chart.",
      order: 3,
      estimatedMinutes: 0,
      lessons: [
        {
          id: "tf-m3-swing-highs-lows",
          moduleId: "tf-m3",
          pathId: PATH_ID,
          slug: "swing-highs-and-lows",
          title: "Swing Highs and Swing Lows",
          description: "Find the turning points that define structure.",
          lessonType: "reading",
          difficulty: "beginner",
          order: 1,
          xpReward: 45,
          prerequisites: ["tf-m2-quiz-candles"],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "Swing Highs and Swing Lows",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "A swing high is a peak where price turned down. A swing low is a valley where price turned up. These points help you see whether price is trending or ranging.",
            },
            {
              id: "def-swing-high",
              type: "definition",
              content: "A local peak — higher than the candles on either side.",
              metadata: { term: "Swing high" },
            },
            {
              id: "def-swing-low",
              type: "definition",
              content: "A local valley — lower than the candles on either side.",
              metadata: { term: "Swing low" },
            },
            {
              id: "ex1",
              type: "example",
              content:
                "In an uptrend, swing lows often stay above the previous swing low. That rising floor is a sign buyers are stepping in at higher prices.",
            },
            {
              id: "callout-key",
              type: "callout",
              content: "Mark swings on the chart — structure becomes clearer when you draw it.",
              metadata: { variant: "key-idea" },
            },
            {
              id: "chart-demo",
              type: "chart-demo",
              scenarioId: "demo-swing-high-low",
              content:
                "Here a few swing highs and lows are labelled for you. Notice the rising lows.",
            },
            {
              id: "chart-lab",
              type: "interactive-chart-question",
              scenarioId: "task-mark-swing-high",
              content: "Now prove you can see it — mark the swing high yourself.",
            },
            {
              id: "sum1",
              type: "summary",
              content: "Swings are the skeleton of the chart. Trends and ranges are built from them.",
            },
          ],
        },
        {
          id: "tf-m3-trends-ranges",
          moduleId: "tf-m3",
          pathId: PATH_ID,
          slug: "trends-vs-ranges",
          title: "Trends vs Ranges",
          description: "Tell when price is directional vs stuck in a box.",
          lessonType: "reading",
          difficulty: "beginner",
          order: 2,
          xpReward: 45,
          prerequisites: ["tf-m3-swing-highs-lows"],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "Trends vs Ranges",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "An uptrend makes higher highs and higher lows. A downtrend makes lower highs and lower lows. A range moves sideways between similar highs and lows.",
            },
            {
              id: "def-uptrend",
              type: "definition",
              content: "Series of higher swing highs and higher swing lows.",
              metadata: { term: "Uptrend" },
            },
            {
              id: "def-range",
              type: "definition",
              content: "Price oscillates between support and resistance without clear direction.",
              metadata: { term: "Range" },
            },
            {
              id: "callout-mistake",
              type: "callout",
              content: "Calling every small bounce a new uptrend. Wait for a pattern of swings.",
              metadata: { variant: "mistake" },
            },
            {
              id: "chart1",
              type: "chart-demo",
              scenarioId: "demo-trend-range",
              content:
                "This chart is ranging — the highs and lows are level. Compare it to a trend in your head.",
            },
            {
              id: "chart-lab",
              type: "interactive-chart-question",
              scenarioId: "task-spot-trend",
              content:
                "Now an uptrend — mark the higher low that keeps the trend alive.",
            },
            {
              id: "sum1",
              type: "summary",
              content:
                "Knowing the environment — trend or range — helps you choose how to practise next.",
            },
          ],
        },
        {
          id: "tf-m3-drill-trend",
          moduleId: "tf-m3",
          pathId: PATH_ID,
          slug: "spot-the-trend",
          title: "Spot the Trend",
          description: "Your first chart drill — mark trend direction on a replay chart.",
          lessonType: "chart-drill",
          difficulty: "beginner",
          order: 3,
          xpReward: 60,
          prerequisites: ["tf-m3-trends-ranges"],
          drillId: "spot-the-trend",
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "p1",
              type: "paragraph",
              content:
                "Open the chart drill, mark the trend based on swing structure, and submit for instant feedback. This is practice — not a live trade.",
            },
            {
              id: "safety",
              type: "safety-note",
              content: "Simulated chart only. No real money is involved.",
            },
          ],
        },
      ],
    },
    {
      id: "tf-m4",
      pathId: PATH_ID,
      title: "Risk Basics",
      description: "Understand risk, reward, and why protection matters before profit.",
      order: 4,
      estimatedMinutes: 0,
      lessons: [
        {
          id: "tf-m4-what-is-risk",
          moduleId: "tf-m4",
          pathId: PATH_ID,
          slug: "what-is-risk",
          title: "What is Risk?",
          description: "Why every trade can lose — and why that is normal.",
          lessonType: "reading",
          difficulty: "beginner",
          order: 1,
          xpReward: 45,
          prerequisites: ["tf-m3-drill-trend"],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "What is Risk?",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "Risk is the amount you could lose if a trade goes against you. Every trade has risk — even good setups fail sometimes. Professionals focus on managing risk first.",
            },
            {
              id: "def-risk",
              type: "definition",
              content: "The potential loss on a trade, usually defined before you enter.",
              metadata: { term: "Risk" },
            },
            {
              id: "callout-key",
              type: "callout",
              content: "Surviving long enough to learn matters more than one big win.",
              metadata: { variant: "key-idea" },
            },
            {
              id: "callout-mistake",
              type: "callout",
              content: "Risking money you cannot afford to lose. Practice in simulators first.",
              metadata: { variant: "mistake" },
            },
            {
              id: "safety",
              type: "safety-note",
              content: "Never risk rent money, emergency savings, or borrowed funds on trading.",
            },
            {
              id: "sum1",
              type: "summary",
              content: "Risk is not optional — it is part of trading. Managing it is a skill you can learn.",
            },
          ],
        },
        {
          id: "tf-m4-risk-reward",
          moduleId: "tf-m4",
          pathId: PATH_ID,
          slug: "risk-reward-explained",
          title: "Risk/Reward Explained",
          description: "Compare potential loss to potential gain before taking a setup.",
          lessonType: "reading",
          difficulty: "beginner",
          order: 2,
          xpReward: 45,
          prerequisites: ["tf-m4-what-is-risk"],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "Risk/Reward Explained",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "Risk/reward (R:R) compares how much you might lose to how much you might gain. If you risk £10 to make £20, that is a 1:2 ratio.",
            },
            {
              id: "def-rr",
              type: "definition",
              content: "The ratio of potential loss to potential profit on a setup.",
              metadata: { term: "Risk/Reward ratio" },
            },
            {
              id: "ex1",
              type: "example",
              content:
                "Entry at 100, stop at 95 (risk 5 points), target at 110 (reward 10 points) → 1:2 risk/reward.",
            },
            {
              id: "callout-key",
              type: "callout",
              content: "You can be wrong often and still learn — if losses stay small and controlled.",
              metadata: { variant: "key-idea" },
            },
            {
              id: "chart-demo",
              type: "chart-demo",
              scenarioId: "demo-risk-reward",
              content:
                "Entry, stop, and target shown. The reward distance is far larger than the risk distance.",
            },
            {
              id: "chart-lab",
              type: "interactive-chart-question",
              scenarioId: "task-risk-reward",
              content:
                "Your turn — place an entry, stop, and target with at least a 1:2 risk/reward.",
            },
            {
              id: "sum1",
              type: "summary",
              content: "Always know your stop (risk) and target (reward) before clicking — even in practice.",
            },
          ],
        },
        {
          id: "tf-m4-interactive-rr",
          moduleId: "tf-m4",
          pathId: PATH_ID,
          slug: "calculate-risk-reward",
          title: "Calculate Risk/Reward",
          description: "Interactive exercise — work out R:R from a simple setup.",
          lessonType: "interactive",
          difficulty: "beginner",
          order: 3,
          xpReward: 55,
          prerequisites: ["tf-m4-risk-reward"],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "Calculate Risk/Reward",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "Work through this setup: Entry 50,000 · Stop 49,500 · Target 51,000. Risk = 500 points. Reward = 1,000 points. Ratio = 1:2.",
            },
            {
              id: "iq1",
              type: "interactive-question",
              content:
                "If entry is 200, stop is 195, and target is 210 — what is the risk/reward ratio?",
              metadata: {
                answer: "1:2",
                hint: "Risk = 5, Reward = 10",
              },
            },
            {
              id: "callout-mistake",
              type: "callout",
              content: "Taking trades with tiny reward and huge risk because they feel safe.",
              metadata: { variant: "mistake" },
            },
            {
              id: "sum1",
              type: "summary",
              content: "Calculate R:R before every practise setup until it becomes automatic.",
            },
          ],
        },
      ],
    },
    {
      id: "tf-m5",
      pathId: PATH_ID,
      title: "First Reflection",
      description: "Turn what you learned into personal beginner rules.",
      order: 5,
      estimatedMinutes: 0,
      lessons: [
        {
          id: "tf-m5-reflection",
          moduleId: "tf-m5",
          pathId: PATH_ID,
          slug: "beginner-trading-rules",
          title: "Build Your Beginner Trading Rules",
          description: "Reflect on what you will do — and avoid — as you keep learning.",
          lessonType: "reflection",
          difficulty: "beginner",
          order: 1,
          xpReward: 50,
          prerequisites: ["tf-m4-interactive-rr"],
          reflectionPrompt:
            "Write 3 beginner rules for yourself. Examples: 'I will practise on simulators first', 'I will define my risk before marking a setup', 'I will not chase trades after missing an entry.'",
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "p1",
              type: "paragraph",
              content:
                "Good traders write simple rules and follow them. This reflection saves to your practice journal when you complete it.",
            },
            {
              id: "callout-key",
              type: "callout",
              content: "Rules protect you from emotional decisions — especially after a losing drill.",
              metadata: { variant: "key-idea" },
            },
          ],
        },
      ],
    },
  ],
}
