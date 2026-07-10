"use client"

import { memo } from "react"

import { Progress } from "@/components/ui/progress"
import type { SkillProfile } from "@/lib/skills/types"

const SKILL_GROUPS = [
  {
    label: "Market Reading",
    keys: ["trend-detection", "continuation", "reversal", "replay-accuracy"] as const,
  },
  {
    label: "Execution",
    keys: ["position-sizing", "stop-placement", "risk-reward", "decision-quality"] as const,
  },
  {
    label: "Risk",
    keys: ["position-sizing", "risk-reward", "stop-placement"] as const,
  },
  {
    label: "Psychology",
    keys: ["discipline", "confidence-calibration"] as const,
  },
  {
    label: "Patience",
    keys: ["trade-or-skip", "decision-quality"] as const,
  },
  {
    label: "Journaling",
    keys: ["journal-quality", "post-trade-review"] as const,
  },
] as const

function avgScore(
  profile: SkillProfile,
  keys: readonly (keyof SkillProfile["skills"])[]
): number {
  const scores = keys
    .map((k) => profile.skills[k]?.score ?? 0)
    .filter((s) => s > 0)
  if (scores.length === 0) return 0
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

export const SkillTreePanel = memo(function SkillTreePanel({
  profile,
}: {
  profile: SkillProfile
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="text-sm font-medium">Skill Tree</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Every drill updates measurable competencies — practice what moves the needle.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SKILL_GROUPS.map((group) => {
          const score = avgScore(profile, group.keys)
          return (
            <div key={group.label}>
              <div className="flex items-center justify-between text-sm">
                <span>{group.label}</span>
                <span className="font-mono tabular-nums text-muted-foreground">
                  {score > 0 ? `${score}%` : "—"}
                </span>
              </div>
              <Progress value={score} className="mt-2 h-2" />
            </div>
          )
        })}
      </div>
    </div>
  )
})
