"use client"

import { StrategyChallenge } from "@/components/strategy-wiki/strategy-challenge"
import { StrategyProgressionGate } from "@/components/strategy-wiki/strategy-progression-gate"
import type { TradingStrategy } from "@/lib/strategy-wiki/types"

export function StrategyChallengePageClient({
  strategy,
}: {
  strategy: TradingStrategy
}) {
  return (
    <StrategyProgressionGate strategy={strategy} mode="challenge">
      <StrategyChallenge strategy={strategy} />
    </StrategyProgressionGate>
  )
}
