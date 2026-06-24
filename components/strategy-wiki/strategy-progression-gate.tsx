"use client"

import { ProgressionGate } from "@/components/learning-map/progression-gate"
import { useUserState } from "@/components/providers/user-state-provider"
import {
  getStrategyChallengeNodeId,
  getStrategyPracticeFeatureId,
  getStrategyPracticeNodeId,
} from "@/lib/learning-map/strategy-gates"
import type { TradingStrategy } from "@/lib/strategy-wiki/types"

interface StrategyProgressionGateProps {
  strategy: TradingStrategy
  mode: "practice" | "challenge"
  children: React.ReactNode
}

export function StrategyProgressionGate({
  strategy,
  mode,
  children,
}: StrategyProgressionGateProps) {
  const { getFeatureAccessLevel, getContentLockInfo, getNodeAccess } =
    useUserState()

  if (mode === "practice") {
    const nodeId = getStrategyPracticeNodeId(strategy.slug)
    const featureId = getStrategyPracticeFeatureId(strategy.slug)
    const nodeAccess = getNodeAccess(nodeId)
    const featureAccess = featureId
      ? getFeatureAccessLevel(featureId)
      : "unlocked"
    const access =
      nodeAccess === "unlocked" || featureAccess === "unlocked"
        ? "unlocked"
        : nodeAccess === "preview" || featureAccess === "preview"
          ? "preview"
          : "locked"
    const lockInfo = getContentLockInfo(nodeId)

    return (
      <ProgressionGate
        access={access}
        title={`${strategy.title} — Practice`}
        lockInfo={lockInfo}
        previewContent={
          <p className="text-sm text-muted-foreground">
            You can read the full strategy overview. Complete Support &amp;
            Resistance on the Learning Map to unlock interactive practice markup.
          </p>
        }
      >
        {children}
      </ProgressionGate>
    )
  }

  const challengeNodeId = getStrategyChallengeNodeId(strategy.slug)
  if (!challengeNodeId) {
    const access = getFeatureAccessLevel("feature-strategy-wiki-practice")
    const lockInfo = getContentLockInfo("node-strategy-break-retest-practice")
    return (
      <ProgressionGate
        access={access}
        title={`${strategy.title} — Challenge`}
        lockInfo={lockInfo}
      >
        {children}
      </ProgressionGate>
    )
  }

  const access = getNodeAccess(challengeNodeId)
  const lockInfo = getContentLockInfo(challengeNodeId)

  return (
    <ProgressionGate
      access={access}
      title={`${strategy.title} — 10-Scenario Challenge`}
      lockInfo={lockInfo}
      previewContent={
        <p className="text-sm text-muted-foreground">
          Complete strategy practice on the Learning Map before running timed
          challenges.
        </p>
      }
    >
      {children}
    </ProgressionGate>
  )
}
