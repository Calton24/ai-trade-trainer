import type { ExecutionScenario } from "@/lib/execution-lab/types"

import type { BehaviourAnswer, EvidenceTag, GuidedStep } from "./types"

const TREND_LABELS = {
  uptrend: "Higher highs & higher lows (uptrend)",
  downtrend: "Lower highs & lower lows (downtrend)",
  range: "Overlapping highs and lows (range)",
  transition: "Structure in transition",
} as const

export function expectedBehaviour(scenario: ExecutionScenario): BehaviourAnswer {
  if (scenario.bestStrategy === "no-trade" || scenario.idealDirection === "wait") {
    return "no-trade"
  }
  if (scenario.behaviour === "reversal" || scenario.bestStrategy === "reversal") {
    return "reversal"
  }
  if (scenario.behaviour === "continuation" || scenario.category === "continuation") {
    return "continuation"
  }
  if (scenario.subcategory === "pullback" || scenario.behaviour === "fakeout") {
    return "pullback"
  }
  if (scenario.subcategory === "eod-reversal" || scenario.tags?.includes("exhaustion")) {
    return "exhaustion"
  }
  if (scenario.correctTrend === "range") {
    return "range"
  }
  return "trend"
}

export function expectedEvidence(scenario: ExecutionScenario): EvidenceTag[] {
  const behaviour = expectedBehaviour(scenario)
  const tags: EvidenceTag[] = []

  if (behaviour === "continuation" || behaviour === "pullback" || behaviour === "trend") {
    tags.push("hh-hl-intact")
  }
  if (behaviour === "reversal" || behaviour === "exhaustion") {
    tags.push("structure-break", "lh-ll-break", "momentum-weakening")
  }
  if (scenario.category === "liquidity" || scenario.tags?.includes("liquidity")) {
    tags.push("liquidity-sweep")
  }
  if (scenario.tags?.includes("london") || scenario.tags?.includes("new-york")) {
    tags.push("session-active")
  }
  if (scenario.subcategory?.includes("eod") || scenario.timeframe === "1D") {
    tags.push("htf-agreement")
  }
  if (behaviour === "range" || scenario.correctTrend === "range") {
    tags.push("overlap-swings")
  }
  if (tags.length === 0) {
    tags.push("hh-hl-intact")
  }
  return tags
}

export function buildGuidedSteps(scenario: ExecutionScenario): GuidedStep[] {
  const trendLabel = TREND_LABELS[scenario.correctTrend] ?? TREND_LABELS.uptrend
  const behaviour = expectedBehaviour(scenario)

  return [
    {
      id: "market",
      title: "Identify the market",
      prompt: `What instrument is on this chart?`,
      skillLabel: "Market Reading",
      hints: [
        "Check the ticket header and price scale.",
        `Price is quoted around ${scenario.chart.candles[scenario.pauseIndex]?.close.toFixed(scenario.symbol.includes("JPY") ? 2 : scenario.symbol.includes("XAU") ? 0 : 4)}.`,
        `This is a major FX or metals pair — look at the decimal precision.`,
        `The correct answer is ${scenario.symbol}.`,
      ],
      revealAnswer: scenario.symbol,
    },
    {
      id: "timeframe",
      title: "Confirm the timeframe",
      prompt: "What timeframe are we analysing?",
      skillLabel: "Professional Workflow",
      hints: [
        "Each candle represents a fixed time window.",
        "Count how many candles span a typical session.",
        "Intermediate timeframes balance noise and structure.",
        `This chart is ${scenario.timeframe}.`,
      ],
      revealAnswer: scenario.timeframe,
    },
    {
      id: "trend",
      title: "Read the trend",
      prompt: "What is the overall market structure?",
      skillLabel: "Trend Detection",
      hints: [
        "Start from the left and label swing highs and swing lows.",
        scenario.correctTrend === "uptrend"
          ? "Notice consecutive higher highs and higher lows."
          : scenario.correctTrend === "downtrend"
            ? "Notice consecutive lower highs and lower lows."
            : "Swings overlap — price is not trending cleanly.",
        "Follow the sequence: HH → HL → HH → HL (or the bearish mirror).",
        trendLabel,
      ],
      revealAnswer: trendLabel,
    },
    {
      id: "swing-highs",
      title: "Mark swing highs",
      prompt: "Click the candles that formed significant swing highs.",
      skillLabel: "Structure Reading",
      hints: [
        "A swing high is the highest point before price pulls back.",
        "Look for peaks with lower highs on both sides.",
        "Focus on the most obvious peaks in the visible structure.",
        "Mark the clearest peaks — you need at least one correct swing high.",
      ],
      revealAnswer: "Click peaks where price reversed downward.",
    },
    {
      id: "swing-lows",
      title: "Mark swing lows",
      prompt: "Click the candles that formed significant swing lows.",
      skillLabel: "Structure Reading",
      hints: [
        "A swing low is the lowest point before price bounces.",
        "Look for troughs with higher lows on both sides.",
        "Connect the lows — do they rise or fall?",
        "Mark the clearest troughs in the pullback zones.",
      ],
      revealAnswer: "Click troughs where price reversed upward.",
    },
    {
      id: "behaviour",
      title: "Market behaviour",
      prompt: "What behaviour is the market showing right now?",
      skillLabel: "Decision Quality",
      hints: [
        "Is structure intact or broken?",
        "Pullback keeps HH/HL — continuation behaviour.",
        "LH + LL after uptrend — reversal behaviour.",
        scenario.bestStrategy === "no-trade"
          ? "Sometimes the professional answer is no trade."
          : `Best read: ${behaviour.replace("-", " ")}.`,
      ],
      revealAnswer: behaviour.replace("-", " "),
    },
    {
      id: "evidence",
      title: "Supporting evidence",
      prompt: "What evidence supports your behaviour read? Select all that apply.",
      skillLabel: "Structure Reading",
      hints: [
        "Look at the most recent swing.",
        "Has the previous higher low broken?",
        "Compare momentum before and after the pullback.",
        "Would a professional already trade this?",
      ],
      revealAnswer: "Select structural and contextual clues that match your read.",
    },
    {
      id: "zones",
      title: "Mark key zones",
      prompt: "Click support, resistance, or the level that matters most.",
      skillLabel: "Support & Resistance",
      hints: [
        "Where has price reacted multiple times?",
        "Look for horizontal levels that held or broke.",
        "In a range, mark the ceiling and floor.",
        "Mark the level you'd reference for invalidation.",
      ],
      revealAnswer: "Place your marker on the nearest obvious horizontal level.",
    },
    {
      id: "strategy",
      title: "Choose the best setup",
      prompt: "What strategy best matches this chart?",
      skillLabel: "Trade Selection",
      hints: [
        "Match the strategy to structure — don't force a favourite setup.",
        `Category tag: ${scenario.category.replace("-", " ")}.`,
        scenario.bestStrategy === "no-trade"
          ? "If there's no edge, professionals pass."
          : "Eliminate strategies that fight the higher-timeframe bias.",
        `Highest probability: ${scenario.bestStrategy.replace("-", " ")}.`,
      ],
      revealAnswer: scenario.bestStrategy.replace("-", " "),
    },
    {
      id: "execution",
      title: "Plan the trade",
      prompt: "Set direction, entry, stop, target, and size the position.",
      skillLabel: "Execution",
      hints: [
        "Replay to the decision candle if you haven't already.",
        "Place stop beyond invalidation — not inside noise.",
        "Aim for at least 1.5:1 reward-to-risk.",
        "Risk 1% or less and rate your confidence before submitting.",
      ],
      revealAnswer: "Use the ticket and drag lines on the chart.",
    },
    {
      id: "outcome",
      title: "Review the outcome",
      prompt: "Watch the replay and review your execution report.",
      skillLabel: "Post-Trade Review",
      hints: [
        "Let the candles play out — did price reach target or stop first?",
        "Compare your plan to what actually happened.",
        "Note one thing you'd repeat and one to improve.",
      ],
      revealAnswer: "Study the execution summary below.",
    },
  ]
}

export const MARKET_OPTIONS = [
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "XAUUSD",
  "NAS100",
  "GBPJPY",
] as const

export const TIMEFRAME_OPTIONS = ["5M", "15M", "1H", "4H", "1D"] as const

export const TREND_OPTIONS = [
  { id: "uptrend" as const, label: "HH / HL — Uptrend" },
  { id: "downtrend" as const, label: "LH / LL — Downtrend" },
  { id: "range" as const, label: "Range" },
  { id: "transition" as const, label: "Transition" },
]

export const BEHAVIOUR_OPTIONS = [
  { id: "trend" as const, label: "Trend" },
  { id: "continuation" as const, label: "Continuation" },
  { id: "pullback" as const, label: "Pullback" },
  { id: "exhaustion" as const, label: "Exhaustion" },
  { id: "reversal" as const, label: "Reversal" },
  { id: "range" as const, label: "Range" },
  { id: "no-trade" as const, label: "No Trade" },
]

export const EVIDENCE_OPTIONS: { id: EvidenceTag; label: string }[] = [
  { id: "hh-hl-intact", label: "HH/HL (or LH/LL) intact" },
  { id: "lh-ll-break", label: "LH/LL structure break" },
  { id: "momentum-weakening", label: "Momentum weakening" },
  { id: "liquidity-sweep", label: "Liquidity sweep" },
  { id: "htf-agreement", label: "HTF agreement" },
  { id: "session-active", label: "Active session (London/NY)" },
  { id: "structure-break", label: "Clean structure break (BOS)" },
  { id: "overlap-swings", label: "Overlapping swings" },
]

/** @deprecated Use BEHAVIOUR_OPTIONS */
export const STRUCTURE_OPTIONS = BEHAVIOUR_OPTIONS.filter((o) =>
  ["continuation", "reversal", "range", "no-trade"].includes(o.id)
)
