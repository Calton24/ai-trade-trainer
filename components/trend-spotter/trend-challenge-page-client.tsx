"use client"

import { ProgressionGate } from "@/components/learning-map/progression-gate"
import { useUserState } from "@/components/providers/user-state-provider"
import { TrendChallenge } from "@/components/trend-spotter/trend-challenge"

export function TrendChallengePageClient() {
  const { getFeatureAccessLevel, getContentLockInfo } = useUserState()
  const access = getFeatureAccessLevel("feature-trend-spotter-challenge")
  const lockInfo = getContentLockInfo("node-trend-challenge")

  return (
    <ProgressionGate
      access={access}
      title="10-Chart Trend Challenge"
      lockInfo={lockInfo}
      previewContent={
        <p className="text-sm text-muted-foreground">
          Preview the Trend Spotter hub and lessons while you finish Trend Basics on the Learning Map.
        </p>
      }
    >
      <TrendChallenge />
    </ProgressionGate>
  )
}
