import type { SimulatorStageMeta } from "@/lib/simulator/types"

export const SIMULATOR_STAGES: SimulatorStageMeta[] = [
  {
    id: "chart-reading",
    order: 1,
    title: "Chart Reading",
    description: "Identify the trend before making any trade decision.",
    xpReward: 25,
    estimatedMinutes: 5,
  },
  {
    id: "support-resistance",
    order: 2,
    title: "Support & Resistance",
    description: "Mark key levels, breakouts, and retests on live charts.",
    xpReward: 30,
    estimatedMinutes: 8,
  },
  {
    id: "trade-selection",
    order: 3,
    title: "Trade Selection",
    description: "Filter three setups — only take the highest-probability trade.",
    xpReward: 35,
    estimatedMinutes: 6,
  },
  {
    id: "trade-planning",
    order: 4,
    title: "Trade Planning",
    description: "Define entry, stop, target, and risk-reward before submitting.",
    xpReward: 40,
    estimatedMinutes: 10,
  },
  {
    id: "trade-management",
    order: 5,
    title: "Trade Management",
    description: "Replay a trade candle-by-candle. Hold, close, or move your stop.",
    xpReward: 50,
    estimatedMinutes: 12,
  },
]

export function getSimulatorStage(id: string) {
  return SIMULATOR_STAGES.find((s) => s.id === id)
}

export function getNextStageId(
  completedIds: string[]
): string | null {
  for (const stage of SIMULATOR_STAGES) {
    if (!completedIds.includes(stage.id)) return stage.id
  }
  return null
}
