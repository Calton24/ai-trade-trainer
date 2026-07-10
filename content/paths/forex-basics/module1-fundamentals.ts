import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "forex-basics"
const MODULE_ID = "fxb-m1"

/** Module 1 — Forex Fundamentals: pairs, pips, lots, leverage, margin, spread, swap. */
export const forexFundamentalsModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Forex Fundamentals",
  description:
    "The language of the currency market: pairs, pips, lots, leverage, margin, spread, and swap.",
  order: 1,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "fxb-m1-what-is-forex",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "what-is-forex",
      title: "What Is Forex?",
      description: "The world's largest market — and why currencies trade in pairs.",
      lessonType: "reading",
      difficulty: "beginner",
      order: 1,
      xpReward: 40,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "What Is Forex?" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Forex (foreign exchange) is the market where currencies are traded against each other. It's the largest financial market in the world — over $7 trillion changes hands every day, dwarfing every stock market combined. It runs 24 hours a day, five days a week, following the sun from Sydney to Tokyo to London to New York.",
        },
        {
          id: "def1",
          type: "definition",
          content:
            "The global market where one currency is exchanged for another. Every trade is simultaneously buying one currency and selling another.",
          metadata: { term: "Forex (FX)" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "You already understand forex better than you think. If you've ever exchanged money for a holiday, you've made a forex transaction. You handed over pounds and received euros at a quoted rate. Traders do exactly the same thing — they just do it to profit from the rate changing, not to buy ice cream in Spain.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "You exchange £1,000 into euros at a rate of 1.20, receiving €1,200. A month later the rate drops to 1.10 and you convert back, receiving £1,090. You just made £90 profit from a currency move — that is forex trading in its simplest form.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Currencies always trade in pairs because you can't buy 'the euro' in isolation — you buy euros WITH another currency. Every price is a relationship between two currencies.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "safety1",
          type: "safety-note",
          content:
            "Educational simulator only. Not financial advice. Most retail traders lose money — this course teaches concepts and practice, not profit promises.",
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Forex is the world's largest market, open 24/5, where currencies trade against each other in pairs. Profit and loss come from the exchange rate moving after you enter.",
        },
      ],
    },
    {
      id: "fxb-m1-currency-pairs",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "how-currency-pairs-work",
      title: "How Currency Pairs Work",
      description: "Base vs quote currency — reading EUR/USD like a professional.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 2,
      xpReward: 45,
      prerequisites: ["fxb-m1-what-is-forex"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Base vs Quote" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Every pair has two parts. EUR/USD = 1.0850 reads as: one euro costs 1.0850 US dollars. The first currency (EUR) is the base — the thing being priced. The second (USD) is the quote — the currency used to express the price.",
        },
        {
          id: "def1",
          type: "definition",
          content: "The first currency in a pair — the one being bought or sold. The price always refers to ONE unit of the base.",
          metadata: { term: "Base currency" },
        },
        {
          id: "def2",
          type: "definition",
          content: "The second currency in a pair — the currency the price is expressed in.",
          metadata: { term: "Quote currency" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "When you BUY EUR/USD you are buying euros and paying with dollars — you profit if the euro strengthens against the dollar (price rises). When you SELL EUR/USD you are selling euros for dollars — you profit if the euro weakens (price falls).",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "match-pairs",
            prompt: "Match each statement to the correct concept.",
            pairs: [
              { left: "First currency in EUR/USD", right: "Base currency" },
              { left: "Second currency in EUR/USD", right: "Quote currency" },
              { left: "Buy EUR/USD", right: "Profit if price rises" },
              { left: "Sell EUR/USD", right: "Profit if price falls" },
              { left: "EUR/USD = 1.0850", right: "1 euro costs $1.0850" },
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Reading pairs backwards is the most common beginner confusion. GBP/JPY = 190.00 means one POUND costs 190 yen — not the other way round.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Base first, quote second. The price is always the cost of one unit of base, expressed in the quote. Buying profits from rises; selling profits from falls.",
        },
      ],
    },
    {
      id: "fxb-m1-pair-types",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "majors-minors-exotics",
      title: "Majors, Minors & Exotics",
      description: "The three families of currency pairs — and which ones beginners should touch.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 3,
      xpReward: 45,
      prerequisites: ["fxb-m1-currency-pairs"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Three Families of Pairs" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Majors always include the US dollar and are the most-traded pairs on earth: EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, NZD/USD. Tight spreads, deep liquidity, cleaner technical behaviour.",
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Minors (crosses) pair two major currencies WITHOUT the dollar — EUR/GBP, GBP/JPY, EUR/JPY, AUD/NZD. Still liquid, slightly wider spreads, sometimes strong trends. Exotics pair a major with an emerging-market currency — USD/TRY, USD/ZAR, EUR/PLN. Wide spreads, thin liquidity, violent moves. Professionals mostly avoid them; beginners always should.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "sort-buckets",
            prompt: "Sort each pair into its family.",
            buckets: ["Major", "Minor", "Exotic"],
            items: [
              { label: "EUR/USD", bucket: "Major", explain: "The world's most-traded pair." },
              { label: "USD/JPY", bucket: "Major", explain: "Dollar + yen — a classic major." },
              { label: "GBP/JPY", bucket: "Minor", explain: "Two majors, no USD — a cross." },
              { label: "EUR/GBP", bucket: "Minor", explain: "Euro vs pound — no dollar involved." },
              { label: "USD/TRY", bucket: "Exotic", explain: "Turkish lira — wide spreads, wild moves." },
              { label: "AUD/USD", bucket: "Major", explain: "Aussie dollar vs USD — a major." },
              { label: "USD/ZAR", bucket: "Exotic", explain: "South African rand — an exotic." },
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Start with majors only. They have the tightest spreads, the most liquidity, and the most educational material. Exotics can gap through your stop loss.",
          metadata: { variant: "tip" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Majors contain USD and are the most liquid. Minors cross two majors without USD. Exotics involve emerging-market currencies and are best avoided while learning.",
        },
      ],
    },
    {
      id: "fxb-m1-pips",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "pips",
      title: "Pips",
      description: "The unit of measurement for every forex move.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 4,
      xpReward: 45,
      prerequisites: ["fxb-m1-pair-types"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Pips — the Ruler of Forex" },
        {
          id: "def1",
          type: "definition",
          content:
            "The standard unit of price movement: 0.0001 for most pairs, 0.01 for JPY pairs. If EUR/USD moves from 1.0850 to 1.0870, it moved 20 pips.",
          metadata: { term: "Pip" },
        },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Traders speak in pips, not prices. 'EURUSD dropped 40 pips' communicates the size of the move instantly regardless of where price started. Your stop loss, your target, and your risk are all measured in pips first, money second.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "GBP/USD moves from 1.2500 to 1.2545 — that's 45 pips. USD/JPY moves from 148.00 to 148.45 — also 45 pips, because JPY pairs use two decimal places (0.01 per pip).",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: { kind: "pip-calculator" },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Most platforms also show a fifth decimal — a 'pipette' or tenth of a pip. 1.08503 to 1.08513 is one pip, not ten.",
          metadata: { variant: "tip" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "A pip is the standard price step: 0.0001 for most pairs, 0.01 for JPY pairs. All risk and reward planning starts in pips.",
        },
      ],
    },
    {
      id: "fxb-m1-lots",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "lots-and-position-size",
      title: "Lots & Position Size",
      description: "Standard, mini, micro — how trade size converts pips into money.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 5,
      xpReward: 45,
      prerequisites: ["fxb-m1-pips"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Lots — How Big Is Your Trade?" },
        {
          id: "def1",
          type: "definition",
          content:
            "The standardised unit of trade volume. 1 standard lot = 100,000 units of base currency. 0.1 (mini) = 10,000 units. 0.01 (micro) = 1,000 units.",
          metadata: { term: "Lot" },
        },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Lot size converts pips into money. On EUR/USD, one standard lot makes each pip worth roughly $10. A mini lot: $1 per pip. A micro lot: $0.10 per pip. Same 20-pip move — $200, $20, or $2 depending on your size.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "match-pairs",
            prompt: "Match lot size to its pip value on EUR/USD.",
            pairs: [
              { left: "1.00 lot (standard)", right: "$10 per pip" },
              { left: "0.10 lot (mini)", right: "$1 per pip" },
              { left: "0.01 lot (micro)", right: "$0.10 per pip" },
              { left: "0.50 lot", right: "$5 per pip" },
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Lot size is your risk dial, and it's the one beginners set carelessly. Trading 1.0 lots on a $500 account means a 50-pip move wipes out the entire account.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Lots determine how much each pip is worth. Standard = $10/pip, mini = $1/pip, micro = $0.10/pip on EUR/USD. Position size is the primary risk control — a theme we return to in Risk Management Mastery.",
        },
      ],
    },
    {
      id: "fxb-m1-spread",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "spread-and-swap",
      title: "Spread & Swap",
      description: "The two costs of trading — one you pay instantly, one overnight.",
      lessonType: "reading",
      difficulty: "beginner",
      order: 6,
      xpReward: 40,
      prerequisites: ["fxb-m1-lots"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Spread: the Entry Cost" },
        {
          id: "def1",
          type: "definition",
          content:
            "The difference between the bid (sell) price and the ask (buy) price. You buy at the higher ask and sell at the lower bid — the gap is the broker's fee.",
          metadata: { term: "Spread" },
        },
        {
          id: "p1",
          type: "paragraph",
          content:
            "If EUR/USD shows bid 1.08500 / ask 1.08512, the spread is 1.2 pips. The moment you enter, you're 1.2 pips 'down' — price must move that far in your favour just to break even. Majors during London hours: often under 1 pip. Exotics or news spikes: 5–20+ pips.",
        },
        { id: "h2", type: "heading", content: "Swap: the Overnight Cost" },
        {
          id: "def2",
          type: "definition",
          content:
            "Interest paid or earned for holding a position overnight, based on the interest-rate difference between the two currencies.",
          metadata: { term: "Swap (rollover)" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Hold a position past 5pm New York and swap applies. It can be negative (a cost) or occasionally positive (you earn), depending on the pair and direction. Day traders who close before rollover never pay it; swing traders must factor it in.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "You buy GBP/JPY and hold for five nights. If the swap is -£1.50 per night per mini lot, the position quietly cost £7.50 on top of the spread — enough to turn a small winner into a scratch.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Spread is why scalping tiny moves is hard: a 3-pip target with a 1-pip spread gives away a third of the edge before the trade starts.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Spread is the instant cost of entry (buy at ask, sell at bid). Swap is the overnight holding cost. Both silently eat into results — factor them into every plan.",
        },
      ],
    },
    {
      id: "fxb-m1-leverage",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "leverage-and-margin",
      title: "Leverage & Margin",
      description: "Borrowed buying power — the tool that helps professionals and destroys beginners.",
      lessonType: "reading",
      difficulty: "beginner",
      order: 7,
      xpReward: 45,
      prerequisites: ["fxb-m1-spread"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Leverage: Amplification" },
        {
          id: "def1",
          type: "definition",
          content:
            "Broker-provided buying power that lets you control a large position with a small deposit. 1:30 leverage means $1,000 controls $30,000 of currency.",
          metadata: { term: "Leverage" },
        },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Leverage multiplies both gains AND losses. It doesn't change the market — it changes your exposure to it. A 1% move on a 1:30 leveraged position is a 30% move on your money. This is exactly why most blown accounts die: not from bad analysis, but from oversized exposure.",
        },
        {
          id: "def2",
          type: "definition",
          content:
            "The deposit locked as collateral to keep a leveraged position open. If losses approach your margin, the broker issues a margin call or force-closes positions.",
          metadata: { term: "Margin" },
        },
        {
          id: "ex1",
          type: "example",
          content:
            "Two traders each have $1,000. Trader A uses low effective leverage — 0.01 lots. A 100-pip loss costs $10 (1%). Trader B maxes out at 0.50 lots. The same 100-pip move costs $500 — half the account on ONE trade.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Leverage is not a bonus to be maximised — it's a tool to be minimised. Professionals think in risk per trade (1%), never in 'how big can I go?'",
          metadata: { variant: "key-idea" },
        },
        {
          id: "callout2",
          type: "callout",
          content:
            "\"More leverage = faster profits\" is the most expensive myth in retail trading. It equals faster ruin with mathematical certainty when combined with normal losing streaks.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Leverage multiplies exposure; margin is the collateral behind it. Survival depends on using far less than the maximum offered. Risk Management Mastery covers exactly how much.",
        },
      ],
    },
    {
      id: "fxb-m1-buy-sell-sim",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "your-first-simulated-trade",
      title: "Your First Simulated Trade",
      description: "Put it together: buy, sell, spread, pips, profit and loss.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 8,
      xpReward: 50,
      prerequisites: ["fxb-m1-leverage"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Anatomy of a Trade" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Every trade ticket has the same parts: direction (buy/sell), size (lots), entry price, stop loss, and take profit. The platform shows two prices — you buy at the ask, sell at the bid, and the spread between them is your starting cost.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "order-steps",
            prompt: "Put the steps of placing a trade in the professional order.",
            steps: [
              "Analyse the chart and decide direction",
              "Identify the invalidation point for the stop loss",
              "Calculate position size from your risk limit",
              "Place the order with stop and target attached",
              "Record the trade in your journal",
            ],
          },
        },
        {
          id: "w2",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "Read each fill and decide: is this position in profit or loss?",
            options: ["In profit", "In loss"],
            scenarios: [
              {
                situation:
                  "You BOUGHT EUR/USD at 1.0850. Price is now 1.0885.",
                correct: "In profit",
                coaching: "Bought and price rose 35 pips — a long position profits when price goes up.",
              },
              {
                situation:
                  "You SOLD GBP/USD at 1.2600. Price is now 1.2640.",
                correct: "In loss",
                coaching: "Sold and price rose 40 pips against you — shorts lose when price rises.",
              },
              {
                situation:
                  "You SOLD USD/JPY at 148.50. Price is now 147.90.",
                correct: "In profit",
                coaching: "Sold and price fell 60 pips — shorts profit when price falls.",
              },
              {
                situation:
                  "You BOUGHT EUR/USD at 1.0850 and price is exactly 1.0850, spread 1 pip.",
                correct: "In loss",
                coaching: "At your entry price you're still down the spread — you buy at ask and close at the lower bid.",
              },
            ],
          },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Buy = profit from rises, sell = profit from falls, and the spread means every trade starts slightly negative. Direction, size, stop, target, journal — every time.",
        },
      ],
    },
    {
      id: "fxb-m1-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "forex-fundamentals-check",
      title: "Forex Fundamentals Check",
      description: "Test pairs, pips, lots, leverage, spread, and swap.",
      lessonType: "quiz",
      difficulty: "beginner",
      order: 9,
      xpReward: 50,
      prerequisites: ["fxb-m1-buy-sell-sim"],
      estimatedMinutes: 0,
      quizId: "forex-fundamentals-check",
      contentBlocks: [],
    },
  ],
}
