import { generateScenario } from "@/lib/charts/generate-scenario"
import type { ScenarioKind } from "@/lib/charts/generate-scenario"
import type { ScenarioCandle } from "@/lib/charts/types"

import type { ScenarioDraft } from "./types"
import { createEmptyDraft } from "./types"

export type BuilderTemplateId =
  | "continuation"
  | "reversal"
  | "no-trade"
  | "eod-reversal"

interface BuilderTemplate {
  id: BuilderTemplateId
  label: string
  description: string
  kind: ScenarioKind
  patch: Partial<ScenarioDraft>
}

export const BUILDER_TEMPLATES: BuilderTemplate[] = [
  {
    id: "continuation",
    label: "Continuation",
    description: "Pullback in trend — buy/sell with structure",
    kind: "uptrend",
    patch: {
      title: "Trend Continuation Pullback",
      description: "Clean trend with pullback to structure. Continuation or trap?",
      category: "continuation",
      behaviour: "continuation",
      subcategory: "pullback",
      tags: ["continuation", "pullback"],
      correctTrend: "uptrend",
      idealDirection: "buy",
      bestStrategy: "continuation",
      strategyOptions: ["continuation", "reversal", "range", "no-trade"],
      noTradeValid: true,
      hints: [
        "HH/HL sequence still intact on this timeframe",
        "Pullback should hold prior structure — not break it",
        "Wait for rejection before entry",
      ],
      commonMistakes: ["Chasing the impulse", "Calling reversal on one red candle"],
      journalPrompt: "Why was this continuation and not reversal?",
      session: "London",
      pauseIndex: 34,
    },
  },
  {
    id: "reversal",
    label: "Reversal",
    description: "Structure break with LH/LL or HH/HL flip",
    kind: "uptrend-reversal",
    patch: {
      title: "Structure Break Reversal",
      description: "Trend loses momentum and prints invalidation. Reversal or pause?",
      category: "reversal",
      behaviour: "reversal",
      subcategory: "structure-break",
      tags: ["reversal", "bos"],
      correctTrend: "downtrend",
      idealDirection: "sell",
      bestStrategy: "reversal",
      strategyOptions: ["reversal", "continuation", "break-retest", "no-trade"],
      noTradeValid: true,
      hints: [
        "Look for LH then LL (or HH then HL for bullish reversal)",
        "One swing break is a warning — need confirmation",
        "Retest of broken structure adds confluence",
      ],
      commonMistakes: ["Fading too early", "Ignoring higher timeframe bias"],
      journalPrompt: "Where was structure invalidated?",
      session: "London",
      reversalGrade: "A",
      pauseIndex: 36,
    },
  },
  {
    id: "no-trade",
    label: "No Trade / Range",
    description: "Overlapping structure — standing aside is correct",
    kind: "ranging",
    patch: {
      title: "Range — No Edge",
      description: "Messy overlapping highs and lows. Is there a high-probability trade?",
      category: "range",
      behaviour: "range",
      subcategory: "no-edge",
      tags: ["range", "no-trade"],
      correctTrend: "range",
      idealDirection: "no-trade",
      bestStrategy: "no-trade",
      strategyOptions: ["continuation", "reversal", "range", "no-trade"],
      noTradeValid: true,
      hints: [
        "No clear HH/HL or LH/LL sequence",
        "Standing aside is a professional decision",
        "Wait for expansion or clear break",
      ],
      commonMistakes: ["Forcing trades in chop", "Overtrading low ATR conditions"],
      journalPrompt: "What told you there was no edge?",
      session: "Asian",
      pauseIndex: 32,
    },
  },
  {
    id: "eod-reversal",
    label: "EOD Reversal",
    description: "Late session fade / exhaustion reversal",
    kind: "downtrend-reversal",
    patch: {
      title: "EOD Session Reversal",
      description: "Late session exhaustion after impulse. Fade or stay flat?",
      category: "reversal",
      behaviour: "reversal",
      subcategory: "eod-reversal",
      tags: ["reversal", "eod", "session-exhaustion"],
      correctTrend: "uptrend",
      idealDirection: "buy",
      bestStrategy: "reversal",
      strategyOptions: ["reversal", "continuation", "liquidity-sweep", "no-trade"],
      noTradeValid: true,
      hints: [
        "EOD often fades the session impulse",
        "Look for liquidity sweep then rejection",
        "Reduce size — late session volatility can spike",
      ],
      commonMistakes: ["Chasing the close", "Ignoring spread widening near EOD"],
      journalPrompt: "How did session timing affect your decision?",
      session: "New York Close",
      timeframe: "15M",
      reversalGrade: "A",
      pauseIndex: 35,
    },
  },
]

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)
}

export function applyBuilderTemplate(
  templateId: BuilderTemplateId,
  current?: ScenarioDraft
): ScenarioDraft {
  const template = BUILDER_TEMPLATES.find((t) => t.id === templateId)
  if (!template) return current ?? createEmptyDraft()

  const base = current ?? createEmptyDraft()
  const title = template.patch.title ?? base.title
  const id = `pack-${templateId}-${slugifyTitle(title).slice(0, 24)}`

  return {
    ...base,
    ...template.patch,
    id,
    title,
    annotations: [],
    candles: base.candles,
  }
}

export function generateSampleCandles(
  kind: ScenarioKind,
  symbol: string,
  seed?: string
): ScenarioCandle[] {
  const base = symbol.includes("XAU")
    ? 2350
    : symbol.includes("JPY")
      ? 148.5
      : symbol.includes("GBP")
        ? 1.265
        : 1.085
  const generated = generateScenario({
    kind,
    seed: seed ?? `builder-${kind}-${symbol}`,
    base,
    length: 48,
  })
  return generated.candles
}

export function applyTemplateWithCandles(templateId: BuilderTemplateId): ScenarioDraft {
  const template = BUILDER_TEMPLATES.find((t) => t.id === templateId)!
  const draft = applyBuilderTemplate(templateId)
  const candles = generateSampleCandles(template.kind, draft.symbol, draft.id)
  const pauseIndex = Math.min(
    draft.pauseIndex,
    candles.length - 1
  )
  const decision = candles[pauseIndex] ?? candles[candles.length - 1]

  let idealEntry = decision.close
  let idealStop = decision.close * 0.998
  let idealTarget = decision.close * 1.004

  if (draft.idealDirection === "buy") {
    const swingLow = Math.min(...candles.slice(Math.max(0, pauseIndex - 8), pauseIndex + 1).map((c) => c.low))
    idealStop = swingLow - Math.abs(decision.close - swingLow) * 0.15
    idealTarget = decision.close + (decision.close - idealStop) * 2
  } else if (draft.idealDirection === "sell") {
    const swingHigh = Math.max(...candles.slice(Math.max(0, pauseIndex - 8), pauseIndex + 1).map((c) => c.high))
    idealStop = swingHigh + Math.abs(swingHigh - decision.close) * 0.15
    idealTarget = decision.close - (idealStop - decision.close) * 2
  }

  return {
    ...draft,
    candles,
    pauseIndex,
    idealEntry: Math.round(idealEntry * 100000) / 100000,
    idealStop: Math.round(idealStop * 100000) / 100000,
    idealTarget: Math.round(idealTarget * 100000) / 100000,
  }
}
