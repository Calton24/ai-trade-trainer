import { buildBasicCard, buildMcCard } from "@/content/flashcards/card-builder"
import type { Flashcard } from "@/lib/flashcards/types"

const D = "book-lab"

export const bookLabCards: Flashcard[] = [
  buildBasicCard({ deckId: D, slug: "stocks-in-play", front: "Stocks in play?", back: "Names with unusual volume and volatility worth day-trading attention.", explanation: "Active stocks offer movement; dead charts waste time.", tags: ["book-lab"], source: "book-lab" }),
  buildBasicCard({ deckId: D, slug: "relative-volume", front: "Relative volume?", back: "Today's volume compared to average — high RVOL means unusual activity.", explanation: "RVOL helps filter in-play names.", tags: ["book-lab"], source: "book-lab" }),
  buildBasicCard({ deckId: D, slug: "gappers", front: "Gappers?", back: "Stocks that open far from prior close due to news or catalysts.", explanation: "Gaps create momentum and volatility.", tags: ["book-lab"], source: "book-lab" }),
  buildBasicCard({ deckId: D, slug: "float", front: "Float?", back: "Shares available for public trading — low float can mean faster moves.", explanation: "Float affects how quickly price can move.", tags: ["book-lab"], source: "book-lab" }),
  buildBasicCard({ deckId: D, slug: "catalyst", front: "Catalyst?", back: "News or event that drives traders into a stock.", explanation: "Earnings, FDA, macro headlines can catalyse moves.", tags: ["book-lab"], source: "book-lab" }),
  buildBasicCard({ deckId: D, slug: "vwap", front: "VWAP?", back: "Volume-weighted average price — intraday fair-value reference.", explanation: "Many day traders use VWAP for bias and entries.", tags: ["book-lab"], source: "book-lab" }),
  buildBasicCard({ deckId: D, slug: "ma-trend", front: "Moving average trend?", back: "Price respecting a moving average as dynamic support/resistance.", explanation: "Common on 9/20 EMA for momentum names.", tags: ["book-lab"], source: "book-lab" }),
  buildBasicCard({ deckId: D, slug: "bull-flag", front: "Bull flag?", back: "Sharp rally (pole) then tight downward drift (flag) before continuation.", explanation: "Classic momentum continuation pattern.", tags: ["book-lab"], source: "book-lab" }),
  buildBasicCard({ deckId: D, slug: "orb", front: "Opening range breakout?", back: "Trade break of the first X minutes' high/low.", explanation: "ORB captures early session momentum.", tags: ["book-lab"], source: "book-lab" }),
  buildBasicCard({ deckId: D, slug: "reversal", front: "Reversal trading?", back: "Fading an extended move when exhaustion signals appear.", explanation: "Higher risk — needs tight risk control.", tags: ["book-lab"], source: "book-lab" }),
]
