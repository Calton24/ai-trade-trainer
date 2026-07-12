import { SKILL_LABELS } from "@/lib/skills/definitions"
import { computeSkillProfile } from "@/lib/skills/engine"
import type { SkillId } from "@/lib/skills/types"
import type { UserState } from "@/lib/user-state/types"

import {
  EXECUTION_PACKS,
  getExecutionPack,
  getPackForScenario,
} from "@/content/execution-lab/packs/registry"
import type { ExecutionPackId, PackProgress, PackProgressTier } from "./types"

export type { PackProgress, PackProgressTier }

const PASS_SCORE = 70

function tierFromProgress(
  completed: number,
  total: number,
  averageScore: number
): PackProgressTier {
  if (completed === 0) return "none"
  const pct = completed / total
  if (pct >= 1 && averageScore >= 85) return "master"
  if (pct >= 0.75 && averageScore >= 75) return "gold"
  if (pct >= 0.5 && averageScore >= 70) return "silver"
  if (completed >= 1 && averageScore >= 60) return "bronze"
  return "none"
}

export const PACK_TIER_LABELS: Record<PackProgressTier, string> = {
  none: "Not started",
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  master: "Master",
}

export function computePackProgress(
  state: UserState,
  packId: ExecutionPackId
): PackProgress {
  const pack = getExecutionPack(packId)
  if (!pack) {
    return {
      packId,
      completed: 0,
      total: 0,
      attempted: 0,
      bestScore: 0,
      averageScore: 0,
      weakestSkill: null,
      tier: "none",
      nextScenarioId: null,
    }
  }

  const scenarioIds = new Set(pack.scenarios.map((s) => s.id))
  const attempts = state.executionAttempts.filter((a) => scenarioIds.has(a.scenarioId))

  const bestByScenario = new Map<string, number>()
  for (const a of attempts) {
    const prev = bestByScenario.get(a.scenarioId) ?? 0
    if (a.executionScore > prev) bestByScenario.set(a.scenarioId, a.executionScore)
  }

  const passedIds = new Set(
    [...bestByScenario.entries()]
      .filter(([, score]) => score >= PASS_SCORE)
      .map(([id]) => id)
  )

  const scores = [...bestByScenario.values()]
  const averageScore =
    scores.length > 0
      ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length)
      : 0
  const bestScore = scores.length > 0 ? Math.max(...scores) : 0

  const profile = computeSkillProfile(state)
  const packSkillScores = pack.skillIds
    .map((id) => ({ id, score: profile.skills[id].score }))
    .sort((a, b) => a.score - b.score)
  const weakestSkillId = packSkillScores[0]?.id ?? pack.skillIds[0] ?? null

  const nextScenario =
    pack.scenarios.find((s) => !passedIds.has(s.id)) ?? null

  return {
    packId,
    completed: passedIds.size,
    total: pack.scenarios.length,
    attempted: bestByScenario.size,
    bestScore,
    averageScore,
    weakestSkill: weakestSkillId ? SKILL_LABELS[weakestSkillId] : null,
    tier: tierFromProgress(passedIds.size, pack.scenarios.length, averageScore),
    nextScenarioId: nextScenario?.id ?? null,
  }
}

export function computeAllPackProgress(state: UserState): PackProgress[] {
  return EXECUTION_PACKS.map((p) => computePackProgress(state, p.id))
}

export function getPackTierLabel(tier: PackProgressTier): string {
  return PACK_TIER_LABELS[tier]
}

export { getPackForScenario }
