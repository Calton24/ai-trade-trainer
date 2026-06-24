"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getChartScenario } from "@/content/chart-scenarios"
import type { TradeSelectionScenario } from "@/lib/trader-readiness/types"
import { cn } from "@/lib/utils"

interface TradeSelectionSectionProps {
  scenario: TradeSelectionScenario
  onComplete: (score: number) => void
}

export function TradeSelectionSection({
  scenario,
  onComplete,
}: TradeSelectionSectionProps) {
  const [takeId, setTakeId] = useState<string | null>(null)
  const [avoidId, setAvoidId] = useState<string | null>(null)
  const [reasoning, setReasoning] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = () => {
    if (!takeId || !avoidId || reasoning.trim().length < 20) return

    let s = 0
    if (takeId === scenario.bestTakeId) s += 40
    if (avoidId === scenario.bestAvoidId) s += 40

    const text = reasoning.toLowerCase()
    const keywords = ["trend", "risk", "structure", "support", "resistance", "rr", "discipline", "quality"]
    const hits = keywords.filter((k) => text.includes(k)).length
    s += hits >= 3 ? 20 : hits >= 1 ? 12 : 5

    setScore(s)
    setSubmitted(true)
    onComplete(s)
  }

  if (submitted) {
    const takeSetup = scenario.setups.find((s) => s.id === scenario.bestTakeId)
    const avoidSetup = scenario.setups.find((s) => s.id === scenario.bestAvoidId)
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-5">
        <p className="font-medium">Trade Selection — {score}%</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Best take:</span>{" "}
            {takeSetup?.label} — {takeSetup?.explanation}
          </p>
          <p>
            <span className="font-medium text-foreground">Best avoid:</span>{" "}
            {avoidSetup?.label} — {avoidSetup?.explanation}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-muted-foreground">{scenario.prompt}</p>

      <div className="grid gap-4 lg:grid-cols-3">
        {scenario.setups.map((setup) => {
          const chart = getChartScenario(setup.chartScenarioId)
          return (
            <div
              key={setup.id}
              className="rounded-xl border border-border/60 bg-card/50 p-4"
            >
              <p className="text-sm font-medium">{setup.label}</p>
              {chart && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {chart.title} · {chart.description}
                </p>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setTakeId(setup.id)}
                  className={cn(
                    "flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors",
                    takeId === setup.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  Take
                </button>
                <button
                  type="button"
                  onClick={() => setAvoidId(setup.id)}
                  className={cn(
                    "flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors",
                    avoidId === setup.id
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border hover:border-destructive/40"
                  )}
                >
                  Avoid
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Why? Explain your trade selection reasoning (min 20 characters)
        </label>
        <Textarea
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          placeholder="Consider trend alignment, risk-reward, market structure, and discipline..."
          rows={4}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!takeId || !avoidId || reasoning.trim().length < 20}
      >
        Submit trade selection
      </Button>
    </div>
  )
}
