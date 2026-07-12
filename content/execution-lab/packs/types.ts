import type { ScenarioKind } from "@/lib/charts/generate-scenario"
import type {
  ExecutionCategory,
  ExecutionPackId,
  StrategyChoice,
  TradeDirection,
} from "@/lib/execution-lab/types"
import type { MarketReadingLevel } from "@/lib/skills/types"
import type { SkillId } from "@/lib/skills/types"

import type { ScenarioMeta } from "../scenarios"
import { buildExecutionScenario } from "../scenarios"
import type { ExecutionScenario } from "@/lib/execution-lab/types"

export interface PackScenarioDef {
  id: string
  title: string
  description: string
  symbol: string
  kind: ScenarioKind
  seed: string
  category: ExecutionCategory
  difficulty: MarketReadingLevel
  correctTrend: "uptrend" | "downtrend" | "range"
  bestStrategy: StrategyChoice
  strategyOptions: StrategyChoice[]
  idealDirection: TradeDirection
  behaviour: string
  subcategory: string
  tags: string[]
  session: string
  hints: string[]
  commonMistakes: string[]
  journalPrompt: string
  pauseFraction?: number
  reversalGrade?: ExecutionScenario["reversalGrade"]
  timeframe?: string
}

const SYMBOL_DEFAULTS: Record<string, { pipSize: number; pipValue: number }> = {
  EURUSD: { pipSize: 0.0001, pipValue: 10 },
  GBPUSD: { pipSize: 0.0001, pipValue: 10 },
  USDJPY: { pipSize: 0.01, pipValue: 9 },
  XAUUSD: { pipSize: 0.01, pipValue: 1 },
}

export function defsToMeta(
  packId: ExecutionPackId,
  defs: PackScenarioDef[]
): ScenarioMeta[] {
  return defs.map((d) => {
    const sym = SYMBOL_DEFAULTS[d.symbol] ?? SYMBOL_DEFAULTS.EURUSD
    return {
      id: d.id,
      title: d.title,
      description: d.description,
      symbol: d.symbol,
      market: d.symbol,
      kind: d.kind,
      seed: d.seed,
      category: d.category,
      difficulty: d.difficulty,
      correctTrend: d.correctTrend,
      bestStrategy: d.bestStrategy,
      strategyOptions: d.strategyOptions,
      idealDirection: d.idealDirection,
      pipSize: sym.pipSize,
      pipValuePerLot: sym.pipValue,
      defaultAccount: 10000,
      pauseFraction: d.pauseFraction ?? 0.72,
      hints: d.hints,
      behaviour: d.behaviour,
      subcategory: d.subcategory,
      tags: d.tags,
      session: d.session,
      journalPrompt: d.journalPrompt,
      commonMistakes: d.commonMistakes,
      reversalGrade: d.reversalGrade,
      timeframe: d.timeframe ?? "15M",
      packId,
    }
  })
}

export function buildPackFromDefs(
  packId: ExecutionPackId,
  defs: PackScenarioDef[]
): ExecutionScenario[] {
  return defsToMeta(packId, defs).map(buildExecutionScenario)
}

export interface ExecutionPackDefinition {
  id: ExecutionPackId
  title: string
  description: string
  learningObjective: string
  skillIds: SkillId[]
  scenarioIdPrefix: string
  scenarios: ExecutionScenario[]
  href: string
}

export function tagScenariosWithPack(
  scenarios: ExecutionScenario[],
  packId: ExecutionPackId
): ExecutionScenario[] {
  return scenarios.map((s) => ({ ...s, packId }))
}
