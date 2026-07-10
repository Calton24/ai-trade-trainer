import { createRng, jitter, type Rng } from "@/lib/charts/rng"
import type {
  ChartAnnotation,
  ExpectedAnswer,
  MarkerTool,
  ScenarioCandle,
} from "@/lib/charts/types"

/** Pattern families the generator can synthesise. */
export type ScenarioKind =
  | "uptrend"
  | "downtrend"
  | "ranging"
  | "uptrend-reversal"
  | "downtrend-reversal"
  | "support-bounce"
  | "resistance-rejection"
  | "breakout"
  | "fakeout"
  | "break-retest"
  | "icc-bullish"
  | "icc-bearish"
  | "risk-reward"

interface Pivot {
  index: number
  price: number
  kind: "high" | "low"
}

export interface GenerateScenarioOptions {
  kind: ScenarioKind
  seed: string
  /** Total candles. Defaults to 48. */
  length?: number
  /** Base price level. Defaults to 2000. */
  base?: number
}

export interface GeneratedScenario {
  candles: ScenarioCandle[]
  annotations: ChartAnnotation[]
  expectedAnswer: ExpectedAnswer
  tools: MarkerTool[]
  defaultTask: string
}

const round2 = (n: number) => Math.round(n * 100) / 100

/**
 * Build a smooth close-price path through the given pivots. Noise is damped to
 * zero at each pivot so the pivots remain the true local extremes.
 */
function closesFromPivots(pivots: Pivot[], length: number, rng: Rng): number[] {
  const closes = new Array<number>(length).fill(0)
  const noiseAmp =
    (Math.max(...pivots.map((p) => p.price)) -
      Math.min(...pivots.map((p) => p.price))) *
    0.04

  for (let s = 0; s < pivots.length - 1; s++) {
    const a = pivots[s]
    const b = pivots[s + 1]
    const span = b.index - a.index
    for (let i = a.index; i <= b.index; i++) {
      const t = span === 0 ? 0 : (i - a.index) / span
      const base = a.price + (b.price - a.price) * t
      // Damp noise toward the pivots (t -> 0 or 1).
      const damp = Math.sin(t * Math.PI)
      closes[i] = base + jitter(rng, noiseAmp) * damp
    }
  }
  // Guarantee exact pivot prices.
  for (const p of pivots) closes[p.index] = p.price
  return closes
}

/** Convert a close-price path into candles with proportional wicks. */
function candlesFromCloses(closes: number[], rng: Rng): ScenarioCandle[] {
  const avgStep =
    closes
      .slice(1)
      .reduce((acc, c, i) => acc + Math.abs(c - closes[i]), 0) /
    Math.max(1, closes.length - 1)
  const wick = Math.max(avgStep * 0.6, 0.5)

  const candles: ScenarioCandle[] = []
  for (let i = 0; i < closes.length; i++) {
    const close = closes[i]
    const open = i === 0 ? close - (closes[1] ?? close) * 0.0008 : closes[i - 1]
    const top = Math.max(open, close)
    const bottom = Math.min(open, close)
    const high = top + Math.abs(jitter(rng, wick)) + wick * 0.2
    const low = bottom - Math.abs(jitter(rng, wick)) - wick * 0.2
    candles.push({
      time: i,
      open: round2(open),
      high: round2(high),
      low: round2(low),
      close: round2(close),
      volume: round2(50 + Math.abs(close - open) * 4 + rng() * 30),
    })
  }
  return candles
}

function swingAnnotation(
  id: string,
  kind: "high" | "low",
  candle: ScenarioCandle,
  text: string
): ChartAnnotation {
  return {
    id,
    type: kind === "high" ? "swing-high" : "swing-low",
    index: candle.time,
    price: kind === "high" ? candle.high : candle.low,
    text,
  }
}

function levelAnnotation(
  id: string,
  type: "support" | "resistance",
  price: number,
  text: string
): ChartAnnotation {
  return { id, type, price: round2(price), text }
}

/**
 * Generate a deterministic, educational chart scenario. The same seed always
 * produces the same chart so lessons are stable across reloads.
 */
export function generateScenario({
  kind,
  seed,
  length = 48,
  base = 2000,
}: GenerateScenarioOptions): GeneratedScenario {
  const rng = createRng(`${kind}:${seed}`)
  const amp = base * 0.02 // ~2% swings

  switch (kind) {
    case "uptrend": {
      const pivots: Pivot[] = [
        { index: 0, price: base, kind: "low" },
        { index: 9, price: base + amp * 1.2, kind: "high" },
        { index: 16, price: base + amp * 0.5, kind: "low" },
        { index: 26, price: base + amp * 2.0, kind: "high" },
        { index: 33, price: base + amp * 1.3, kind: "low" },
        { index: length - 1, price: base + amp * 2.9, kind: "high" },
      ]
      const candles = candlesFromCloses(
        closesFromPivots(pivots, length, rng),
        rng
      )
      const annotations: ChartAnnotation[] = [
        swingAnnotation("sl1", "low", candles[16], "Higher low"),
        swingAnnotation("sh1", "high", candles[26], "Higher high"),
        swingAnnotation("sl2", "low", candles[33], "Higher low"),
        {
          id: "tl",
          type: "trendline",
          from: { index: 0, price: candles[0].low },
          to: { index: 33, price: candles[33].low },
          text: "Rising support",
        },
      ]
      return {
        candles,
        annotations,
        tools: ["trendline", "swing-high", "swing-low"],
        defaultTask:
          "Draw the rising trendline by connecting the higher lows, then mark the most recent higher low.",
        expectedAnswer: {
          requiredMarkers: [
            {
              tool: "swing-low",
              index: 33,
              price: candles[33].low,
              toleranceIndex: 3,
              tolerancePrice: amp * 0.6,
              label: "the most recent higher low",
            },
          ],
          scoringRubric: [
            "Identified a rising series of higher lows",
            "Marked the latest higher low near the trendline",
          ],
        },
      }
    }

    case "downtrend": {
      const pivots: Pivot[] = [
        { index: 0, price: base + amp * 2.9, kind: "high" },
        { index: 9, price: base + amp * 1.6, kind: "low" },
        { index: 16, price: base + amp * 2.3, kind: "high" },
        { index: 26, price: base + amp * 0.7, kind: "low" },
        { index: 33, price: base + amp * 1.4, kind: "high" },
        { index: length - 1, price: base, kind: "low" },
      ]
      const candles = candlesFromCloses(
        closesFromPivots(pivots, length, rng),
        rng
      )
      const annotations: ChartAnnotation[] = [
        swingAnnotation("sh1", "high", candles[16], "Lower high"),
        swingAnnotation("sl1", "low", candles[26], "Lower low"),
        swingAnnotation("sh2", "high", candles[33], "Lower high"),
        {
          id: "tl",
          type: "trendline",
          from: { index: 0, price: candles[0].high },
          to: { index: 33, price: candles[33].high },
          text: "Falling resistance",
        },
      ]
      return {
        candles,
        annotations,
        tools: ["trendline", "swing-high", "swing-low"],
        defaultTask: "Mark the most recent lower high in this downtrend.",
        expectedAnswer: {
          requiredMarkers: [
            {
              tool: "swing-high",
              index: 33,
              price: candles[33].high,
              toleranceIndex: 3,
              tolerancePrice: amp * 0.6,
              label: "the most recent lower high",
            },
          ],
          scoringRubric: [
            "Recognised lower highs and lower lows",
            "Marked the latest lower high",
          ],
        },
      }
    }

    case "uptrend-reversal": {
      const pivots: Pivot[] = [
        { index: 0, price: base, kind: "low" },
        { index: 9, price: base + amp * 1.2, kind: "high" },
        { index: 16, price: base + amp * 0.5, kind: "low" },
        { index: 26, price: base + amp * 2.0, kind: "high" },
        { index: 36, price: base + amp * 0.15, kind: "low" },
        { index: length - 1, price: base + amp * 0.9, kind: "high" },
      ]
      const candles = candlesFromCloses(
        closesFromPivots(pivots, length, rng),
        rng
      )
      return {
        candles,
        annotations: [
          swingAnnotation("sh1", "high", candles[26], "Higher high"),
          swingAnnotation("sl-break", "low", candles[36], "Lower low — structure break"),
        ],
        tools: ["swing-high", "swing-low"],
        defaultTask: "The uptrend just printed a lower low. What is the market attempting?",
        expectedAnswer: { requiredMarkers: [], scoringRubric: [] },
      }
    }

    case "downtrend-reversal": {
      const pivots: Pivot[] = [
        { index: 0, price: base + amp * 2.9, kind: "high" },
        { index: 9, price: base + amp * 1.6, kind: "low" },
        { index: 16, price: base + amp * 2.3, kind: "high" },
        { index: 26, price: base + amp * 0.7, kind: "low" },
        { index: 36, price: base + amp * 2.55, kind: "high" },
        { index: length - 1, price: base + amp * 1.7, kind: "low" },
      ]
      const candles = candlesFromCloses(
        closesFromPivots(pivots, length, rng),
        rng
      )
      return {
        candles,
        annotations: [
          swingAnnotation("sl1", "low", candles[26], "Lower low"),
          swingAnnotation("sh-break", "high", candles[36], "Higher high — structure break"),
        ],
        tools: ["swing-high", "swing-low"],
        defaultTask: "The downtrend just printed a higher high. What is the market attempting?",
        expectedAnswer: { requiredMarkers: [], scoringRubric: [] },
      }
    }

    case "ranging": {
      const top = base + amp * 1.8
      const bottom = base
      const pivots: Pivot[] = [
        { index: 0, price: bottom, kind: "low" },
        { index: 8, price: top, kind: "high" },
        { index: 16, price: bottom + amp * 0.1, kind: "low" },
        { index: 24, price: top - amp * 0.1, kind: "high" },
        { index: 32, price: bottom, kind: "low" },
        { index: 40, price: top, kind: "high" },
        { index: length - 1, price: bottom + amp * 0.3, kind: "low" },
      ]
      const candles = candlesFromCloses(
        closesFromPivots(pivots, length, rng),
        rng
      )
      const annotations: ChartAnnotation[] = [
        levelAnnotation("res", "resistance", top, "Range high"),
        levelAnnotation("sup", "support", bottom, "Range low"),
      ]
      return {
        candles,
        annotations,
        tools: ["support", "resistance"],
        defaultTask:
          "Draw the range: mark the resistance ceiling and the support floor.",
        expectedAnswer: {
          requiredMarkers: [
            {
              tool: "resistance",
              price: top,
              tolerancePrice: amp * 0.5,
              label: "the range resistance",
            },
            {
              tool: "support",
              price: bottom,
              tolerancePrice: amp * 0.5,
              label: "the range support",
            },
          ],
          scoringRubric: [
            "Identified the sideways range",
            "Marked both the ceiling and the floor",
          ],
        },
      }
    }

    case "support-bounce": {
      const support = base
      const pivots: Pivot[] = [
        { index: 0, price: base + amp * 1.6, kind: "high" },
        { index: 8, price: support, kind: "low" },
        { index: 14, price: base + amp * 1.1, kind: "high" },
        { index: 22, price: support + amp * 0.05, kind: "low" },
        { index: 30, price: base + amp * 1.0, kind: "high" },
        { index: 38, price: support, kind: "low" },
        { index: length - 1, price: base + amp * 1.7, kind: "high" },
      ]
      const candles = candlesFromCloses(
        closesFromPivots(pivots, length, rng),
        rng
      )
      const annotations: ChartAnnotation[] = [
        levelAnnotation("sup", "support", support, "Support holds"),
        { id: "a1", type: "arrow", index: 8, price: candles[8].low, text: "Bounce" },
        { id: "a2", type: "arrow", index: 38, price: candles[38].low, text: "Bounce" },
      ]
      return {
        candles,
        annotations,
        tools: ["support"],
        defaultTask: "Draw the support level price keeps bouncing from.",
        expectedAnswer: {
          requiredMarkers: [
            {
              tool: "support",
              price: support,
              tolerancePrice: amp * 0.5,
              label: "the support level",
            },
          ],
          scoringRubric: [
            "Found the price floor buyers defend",
            "Level lines up with multiple bounces",
          ],
        },
      }
    }

    case "resistance-rejection": {
      const resistance = base + amp * 2
      const pivots: Pivot[] = [
        { index: 0, price: base, kind: "low" },
        { index: 8, price: resistance, kind: "high" },
        { index: 15, price: base + amp * 0.6, kind: "low" },
        { index: 23, price: resistance - amp * 0.05, kind: "high" },
        { index: 31, price: base + amp * 0.7, kind: "low" },
        { index: 39, price: resistance, kind: "high" },
        { index: length - 1, price: base + amp * 0.3, kind: "low" },
      ]
      const candles = candlesFromCloses(
        closesFromPivots(pivots, length, rng),
        rng
      )
      const annotations: ChartAnnotation[] = [
        levelAnnotation("res", "resistance", resistance, "Resistance rejects"),
        { id: "a1", type: "arrow", index: 8, price: candles[8].high, text: "Rejection" },
        { id: "a2", type: "arrow", index: 39, price: candles[39].high, text: "Rejection" },
      ]
      return {
        candles,
        annotations,
        tools: ["resistance"],
        defaultTask: "Draw the resistance level price keeps rejecting from.",
        expectedAnswer: {
          requiredMarkers: [
            {
              tool: "resistance",
              price: resistance,
              tolerancePrice: amp * 0.5,
              label: "the resistance level",
            },
          ],
          scoringRubric: [
            "Found the price ceiling sellers defend",
            "Level lines up with multiple rejections",
          ],
        },
      }
    }

    case "breakout": {
      const resistance = base + amp * 1.5
      const pivots: Pivot[] = [
        { index: 0, price: base, kind: "low" },
        { index: 8, price: resistance, kind: "high" },
        { index: 14, price: base + amp * 0.4, kind: "low" },
        { index: 20, price: resistance - amp * 0.05, kind: "high" },
        { index: 26, price: base + amp * 0.5, kind: "low" },
        { index: 34, price: resistance + amp * 1.4, kind: "high" },
        { index: length - 1, price: resistance + amp * 2.2, kind: "high" },
      ]
      const candles = candlesFromCloses(
        closesFromPivots(pivots, length, rng),
        rng
      )
      const breakIndex = 30
      const annotations: ChartAnnotation[] = [
        levelAnnotation("res", "resistance", resistance, "Resistance"),
        {
          id: "brk",
          type: "break",
          index: breakIndex,
          price: resistance,
          text: "Breakout",
        },
      ]
      return {
        candles,
        annotations,
        tools: ["resistance", "break"],
        defaultTask:
          "Mark the resistance level, then mark the candle that breaks above it.",
        expectedAnswer: {
          requiredMarkers: [
            {
              tool: "resistance",
              price: resistance,
              tolerancePrice: amp * 0.5,
              label: "the resistance before the breakout",
            },
            {
              tool: "break",
              index: breakIndex,
              price: resistance,
              toleranceIndex: 4,
              tolerancePrice: amp * 0.9,
              label: "the breakout candle",
            },
          ],
          scoringRubric: [
            "Identified the resistance ceiling",
            "Marked where price broke and held above it",
          ],
        },
      }
    }

    case "fakeout": {
      const resistance = base + amp * 1.6
      const pivots: Pivot[] = [
        { index: 0, price: base, kind: "low" },
        { index: 8, price: resistance, kind: "high" },
        { index: 14, price: base + amp * 0.5, kind: "low" },
        { index: 22, price: resistance + amp * 0.35, kind: "high" },
        { index: 30, price: base + amp * 0.3, kind: "low" },
        { index: 38, price: base - amp * 0.4, kind: "low" },
        { index: length - 1, price: base + amp * 0.2, kind: "high" },
      ]
      const candles = candlesFromCloses(
        closesFromPivots(pivots, length, rng),
        rng
      )
      const annotations: ChartAnnotation[] = [
        levelAnnotation("res", "resistance", resistance, "Resistance"),
        {
          id: "fake",
          type: "arrow",
          index: 22,
          price: candles[22].high,
          text: "Fakeout — closed back below",
          color: "#f97316",
        },
      ]
      return {
        candles,
        annotations,
        tools: ["resistance"],
        defaultTask:
          "Mark the resistance level. Notice how the spike above it failed and closed back inside.",
        expectedAnswer: {
          requiredMarkers: [
            {
              tool: "resistance",
              price: resistance,
              tolerancePrice: amp * 0.5,
              label: "the resistance that produced the fakeout",
            },
          ],
          scoringRubric: [
            "Identified the resistance level",
            "Recognised the failed break (price closed back below)",
          ],
        },
      }
    }

    case "break-retest": {
      const level = base + amp * 1.4
      const pivots: Pivot[] = [
        { index: 0, price: base, kind: "low" },
        { index: 8, price: level, kind: "high" },
        { index: 14, price: base + amp * 0.5, kind: "low" },
        { index: 20, price: level + amp * 1.0, kind: "high" },
        { index: 27, price: level + amp * 0.05, kind: "low" },
        { index: 34, price: level + amp * 1.3, kind: "high" },
        { index: length - 1, price: level + amp * 2.2, kind: "high" },
      ]
      const candles = candlesFromCloses(
        closesFromPivots(pivots, length, rng),
        rng
      )
      const annotations: ChartAnnotation[] = [
        levelAnnotation("lvl", "resistance", level, "Old resistance"),
        { id: "brk", type: "break", index: 17, price: level, text: "Break" },
        {
          id: "rt",
          type: "retest",
          index: 27,
          price: level,
          text: "Retest as support",
        },
      ]
      return {
        candles,
        annotations,
        tools: ["resistance", "break", "retest"],
        defaultTask:
          "Mark the broken level, the breakout, and the retest where old resistance became support.",
        expectedAnswer: {
          requiredMarkers: [
            {
              tool: "resistance",
              price: level,
              tolerancePrice: amp * 0.5,
              label: "the broken level",
            },
            {
              tool: "break",
              index: 17,
              price: level,
              toleranceIndex: 4,
              tolerancePrice: amp * 0.9,
              label: "the breakout",
            },
            {
              tool: "retest",
              index: 27,
              price: level,
              toleranceIndex: 4,
              tolerancePrice: amp * 0.9,
              label: "the retest",
            },
          ],
          scoringRubric: [
            "Marked the level before the break",
            "Marked the breakout candle",
            "Marked the retest where the level flipped to support",
          ],
        },
      }
    }

    case "icc-bullish": {
      // Indication (push up) -> Correction (pullback) -> Continuation (entry)
      const pivots: Pivot[] = [
        { index: 0, price: base, kind: "low" },
        { index: 10, price: base + amp * 2.2, kind: "high" },
        { index: 20, price: base + amp * 1.1, kind: "low" },
        { index: 28, price: base + amp * 1.4, kind: "high" },
        { index: 34, price: base + amp * 1.2, kind: "low" },
        { index: length - 1, price: base + amp * 3.0, kind: "high" },
      ]
      const candles = candlesFromCloses(
        closesFromPivots(pivots, length, rng),
        rng
      )
      const entryZoneLow = base + amp * 1.0
      const entryZoneHigh = base + amp * 1.35
      const annotations: ChartAnnotation[] = [
        {
          id: "ind",
          type: "arrow",
          index: 8,
          price: candles[8].high,
          text: "Indication: strong push up",
        },
        {
          id: "corr",
          type: "zone",
          fromIndex: 18,
          toIndex: 35,
          priceLow: entryZoneLow,
          priceHigh: entryZoneHigh,
          text: "Correction zone",
        },
        {
          id: "cont",
          type: "arrow",
          index: 36,
          price: candles[36].low,
          text: "Continuation entry",
        },
      ]
      return {
        candles,
        annotations,
        tools: ["entry", "stop-loss", "take-profit"],
        defaultTask:
          "After the bullish indication and correction, place your entry in the zone, a stop below it, and a take-profit above the prior high.",
        expectedAnswer: {
          requiredMarkers: [
            {
              tool: "entry",
              index: 36,
              price: (entryZoneLow + entryZoneHigh) / 2,
              toleranceIndex: 5,
              tolerancePrice: amp * 0.7,
              label: "the continuation entry in the correction zone",
            },
            {
              tool: "stop-loss",
              price: entryZoneLow - amp * 0.4,
              tolerancePrice: amp * 0.7,
              label: "a stop below the correction zone",
            },
            {
              tool: "take-profit",
              price: base + amp * 2.6,
              tolerancePrice: amp * 0.9,
              label: "a take-profit beyond the prior high",
            },
          ],
          scoringRubric: [
            "Entered in the correction zone after the bullish push",
            "Stop placed below structure",
            "Target set beyond the previous high",
          ],
        },
      }
    }

    case "icc-bearish": {
      const pivots: Pivot[] = [
        { index: 0, price: base + amp * 3.0, kind: "high" },
        { index: 10, price: base + amp * 0.8, kind: "low" },
        { index: 20, price: base + amp * 1.9, kind: "high" },
        { index: 28, price: base + amp * 1.6, kind: "low" },
        { index: 34, price: base + amp * 1.8, kind: "high" },
        { index: length - 1, price: base, kind: "low" },
      ]
      const candles = candlesFromCloses(
        closesFromPivots(pivots, length, rng),
        rng
      )
      const zoneLow = base + amp * 1.65
      const zoneHigh = base + amp * 2.0
      const annotations: ChartAnnotation[] = [
        {
          id: "ind",
          type: "arrow",
          index: 8,
          price: candles[8].low,
          text: "Indication: strong push down",
        },
        {
          id: "corr",
          type: "zone",
          fromIndex: 18,
          toIndex: 35,
          priceLow: zoneLow,
          priceHigh: zoneHigh,
          text: "Correction zone",
        },
        {
          id: "cont",
          type: "arrow",
          index: 36,
          price: candles[36].high,
          text: "Continuation entry",
        },
      ]
      return {
        candles,
        annotations,
        tools: ["entry", "stop-loss", "take-profit"],
        defaultTask:
          "After the bearish indication and correction, place a short entry in the zone, a stop above it, and a take-profit below the prior low.",
        expectedAnswer: {
          requiredMarkers: [
            {
              tool: "entry",
              index: 36,
              price: (zoneLow + zoneHigh) / 2,
              toleranceIndex: 5,
              tolerancePrice: amp * 0.7,
              label: "the continuation entry in the correction zone",
            },
            {
              tool: "stop-loss",
              price: zoneHigh + amp * 0.4,
              tolerancePrice: amp * 0.7,
              label: "a stop above the correction zone",
            },
            {
              tool: "take-profit",
              price: base + amp * 0.4,
              tolerancePrice: amp * 0.9,
              label: "a take-profit beyond the prior low",
            },
          ],
          scoringRubric: [
            "Entered in the correction zone after the bearish push",
            "Stop placed above structure",
            "Target set beyond the previous low",
          ],
        },
      }
    }

    case "risk-reward": {
      const entry = base + amp * 1.0
      const stop = base + amp * 0.4
      const target = base + amp * 2.8
      const pivots: Pivot[] = [
        { index: 0, price: base, kind: "low" },
        { index: 10, price: base + amp * 1.3, kind: "high" },
        { index: 18, price: entry, kind: "low" },
        { index: 28, price: base + amp * 1.9, kind: "high" },
        { index: 36, price: base + amp * 1.6, kind: "low" },
        { index: length - 1, price: target, kind: "high" },
      ]
      const candles = candlesFromCloses(
        closesFromPivots(pivots, length, rng),
        rng
      )
      const annotations: ChartAnnotation[] = [
        { id: "entry", type: "entry", price: entry, text: "Entry" },
        { id: "sl", type: "stop-loss", price: stop, text: "Stop loss (1R)" },
        { id: "tp", type: "take-profit", price: target, text: "Target (3R)" },
      ]
      return {
        candles,
        annotations,
        tools: ["entry", "stop-loss", "take-profit"],
        defaultTask:
          "Place an entry, a stop loss, and a take-profit that gives at least a 1:2 risk/reward.",
        expectedAnswer: {
          requiredMarkers: [
            {
              tool: "entry",
              price: entry,
              tolerancePrice: amp * 0.6,
              label: "a sensible entry",
            },
            {
              tool: "stop-loss",
              price: stop,
              tolerancePrice: amp * 0.6,
              label: "a stop that defines your risk (1R)",
            },
            {
              tool: "take-profit",
              price: target,
              tolerancePrice: amp * 1.2,
              label: "a target at least 2R away",
            },
          ],
          scoringRubric: [
            "Entry, stop, and target all placed",
            "Reward distance is at least twice the risk distance",
          ],
        },
      }
    }
  }
}
