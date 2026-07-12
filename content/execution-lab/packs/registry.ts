import { REVERSAL_EXECUTION_SCENARIOS } from "../reversal-scenarios"
import { CONTINUATION_ACADEMY_SCENARIOS } from "./continuation-academy"
import { EOD_ACADEMY_SCENARIOS } from "./eod-academy"
import { PATIENCE_ACADEMY_SCENARIOS } from "./patience-academy"
import {
  type ExecutionPackDefinition,
  tagScenariosWithPack,
} from "./types"
import type { ExecutionPackId, ExecutionScenario } from "@/lib/execution-lab/types"

export const REVERSAL_ACADEMY_SCENARIOS = tagScenariosWithPack(
  REVERSAL_EXECUTION_SCENARIOS,
  "reversal"
)

export const EXECUTION_PACKS: ExecutionPackDefinition[] = [
  {
    id: "continuation",
    title: "Continuation Academy",
    description:
      "Recognise healthy trends, time pullbacks, and avoid buying too early. 20 deliberate continuation drills.",
    learningObjective:
      "Recognise when the trend is healthy. Know when to wait. Know when NOT to buy too early.",
    skillIds: ["continuation", "trend-detection", "decision-quality", "replay-accuracy"],
    scenarioIdPrefix: "pack-cont-",
    scenarios: CONTINUATION_ACADEMY_SCENARIOS,
    href: "/execution-lab?pack=continuation",
  },
  {
    id: "reversal",
    title: "Reversal Academy",
    description:
      "Never confuse a pullback with a reversal. Early signals, confirmed reversals, traps, and session reversals.",
    learningObjective: "Never confuse a pullback with a reversal.",
    skillIds: ["reversal", "continuation", "liquidity", "decision-quality"],
    scenarioIdPrefix: "rev-",
    scenarios: REVERSAL_ACADEMY_SCENARIOS,
    href: "/execution-lab?pack=reversal",
  },
  {
    id: "patience",
    title: "Patience Academy",
    description:
      "Professional traders wait. Range, chop, fake breakouts, poor R:R — learn when NO TRADE is the A+ decision.",
    learningObjective:
      "Professional traders spend a lot of time waiting. Standing aside is a skill.",
    skillIds: ["trade-or-skip", "discipline", "decision-quality", "risk-reward"],
    scenarioIdPrefix: "pack-pat-",
    scenarios: PATIENCE_ACADEMY_SCENARIOS,
    href: "/execution-lab?pack=patience",
  },
  {
    id: "eod",
    title: "EOD Academy",
    description:
      "Daily context first, execution second. Continuation into close, exhaustion fades, liquidity sweeps, and HTF rejection.",
    learningObjective: "Teach daily context first. Execution second.",
    skillIds: ["market-context", "reversal", "continuation", "decision-quality"],
    scenarioIdPrefix: "pack-eod-",
    scenarios: EOD_ACADEMY_SCENARIOS,
    href: "/execution-lab?pack=eod",
  },
]

export const PROFESSIONAL_PACK_SCENARIOS: ExecutionScenario[] = EXECUTION_PACKS.flatMap(
  (p) => p.scenarios
)

export function getExecutionPack(id: ExecutionPackId): ExecutionPackDefinition | undefined {
  return EXECUTION_PACKS.find((p) => p.id === id)
}

export function getPackForScenario(scenarioId: string): ExecutionPackDefinition | undefined {
  return EXECUTION_PACKS.find((p) =>
    p.scenarios.some((s) => s.id === scenarioId)
  )
}

export function getPackScenarios(packId: ExecutionPackId): ExecutionScenario[] {
  return getExecutionPack(packId)?.scenarios ?? []
}

export function getNextPackScenario(
  packId: ExecutionPackId,
  completedIds: Set<string>
): ExecutionScenario | null {
  const pack = getExecutionPack(packId)
  if (!pack) return null
  return pack.scenarios.find((s) => !completedIds.has(s.id)) ?? null
}
