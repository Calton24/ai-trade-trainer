"use client"

import { useState } from "react"
import Link from "next/link"

import { ChartLabWorkspace } from "@/components/chart-lab/chart-lab-workspace"
import { useUserState } from "@/components/providers/user-state-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getChartScenario } from "@/content/chart-scenarios"
import type { BookLabConcept, BookLabPracticeDrill } from "@/lib/book-lab/types"
import { cn } from "@/lib/utils"

interface BookLabPracticeProps {
  concept: BookLabConcept
}

export function BookLabPractice({ concept }: BookLabPracticeProps) {
  const { recordBookPractice, saveBookReflectionEntry, recordChartLabActivity } =
    useUserState()
  const drill = concept.practiceDrill
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [reflection, setReflection] = useState("")
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [savedReflection, setSavedReflection] = useState(false)

  if (!drill) {
    const scenarioId = concept.chartPracticeId
    if (!scenarioId) {
      return (
        <p className="text-sm text-muted-foreground">
          No practice drill for this concept yet.
        </p>
      )
    }
    const scenario = getChartScenario(scenarioId)
    if (!scenario) {
      return (
        <p className="text-sm text-muted-foreground">Chart scenario not found.</p>
      )
    }
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          {scenario.task ?? scenario.description}
        </p>
        <ChartLabWorkspace
          scenario={scenario}
          variant="embed"
          onComplete={(result) =>
            recordChartLabActivity(scenarioId, scenario.title, result.score)
          }
        />
        <Button
          render={<Link href={`/chart-lab/${scenarioId}`} />}
          variant="outline"
        >
          Open full Chart Lab
        </Button>
      </div>
    )
  }

  const handleSubmit = () => {
    if (!selected || submitted) return
    const option = drill.options?.find((o) => o.id === selected)
    const score = option?.correct ? 100 : 45
    recordBookPractice({
      conceptId: concept.id,
      drillId: drill.id,
      score,
    })
    setSubmitted(true)
  }

  const option = drill.options?.find((o) => o.id === selected)
  const score = submitted ? (option?.correct ? 100 : 45) : 0

  const handleSaveReflection = () => {
    if (!reflection.trim() || savedReflection) return
    saveBookReflectionEntry({
      conceptId: concept.id,
      conceptTitle: concept.title,
      note: reflection,
      confidenceRating: confidence,
      mistakeTag: option?.correct ? "None" : "Process",
      journal: {
        source: "book-lab",
        conceptTitle: concept.title,
        drillType: drill.type,
        setupPracticed: `${concept.title} — ${drill.title}`,
        marksSummary: drill.prompt,
        aiFeedbackSummary: submitted
          ? option?.correct
            ? drill.correctFeedback
            : drill.riskyFeedback
          : "",
        confidenceRating: confidence,
        mistakeTag: option?.correct ? "None" : "Process",
        personalNote: reflection,
      },
    })
    setSavedReflection(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border/60 bg-card/50 p-5">
        <Badge variant="secondary" className="mb-3 capitalize">
          Practise
        </Badge>
        <h3 className="font-medium">{drill.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{drill.prompt}</p>

        {drill.chartScenarioId && (
          <div className="mt-4">
            <ChartLabWorkspace
              scenario={getChartScenario(drill.chartScenarioId)!}
              variant="embed"
              onComplete={(result) =>
                recordChartLabActivity(
                  drill.chartScenarioId!,
                  drill.title,
                  result.score
                )
              }
            />
          </div>
        )}

        {drill.options && (
          <div className="mt-4 flex flex-col gap-2">
            {drill.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={submitted}
                onClick={() => setSelected(opt.id)}
                className={cn(
                  "rounded-lg border px-4 py-3 text-left text-sm",
                  selected === opt.id && "border-primary/30 bg-primary/10"
                )}
              >
                {opt.text}
              </button>
            ))}
          </div>
        )}

        {!submitted ? (
          <Button className="mt-4" onClick={handleSubmit} disabled={!selected}>
            Submit Answer
          </Button>
        ) : (
          <PracticeFeedback
            drill={drill}
            score={score}
            correct={option?.correct ?? false}
            optionFeedback={option?.feedback}
          />
        )}
      </div>

      {submitted && (
        <div className="rounded-xl border border-border/60 bg-card/50 p-5">
          <Label className="text-sm font-medium">Reflect</Label>
          <p className="mt-1 text-sm text-muted-foreground">
            {concept.reflectionPrompt}
          </p>
          <Textarea
            className="mt-3"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Your reflection..."
            rows={3}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <Button
                key={n}
                size="sm"
                variant={confidence === n ? "default" : "outline"}
                onClick={() => setConfidence(n)}
              >
                {n}
              </Button>
            ))}
          </div>
          <Button
            className="mt-4"
            variant="outline"
            onClick={handleSaveReflection}
            disabled={!reflection.trim() || savedReflection}
          >
            {savedReflection ? "Saved to Journal" : "Save Reflection to Journal"}
          </Button>
        </div>
      )}
    </div>
  )
}

function PracticeFeedback({
  drill,
  score,
  correct,
  optionFeedback,
}: {
  drill: BookLabPracticeDrill
  score: number
  correct: boolean
  optionFeedback?: string
}) {
  return (
    <div
      className={cn(
        "mt-4 rounded-lg border p-4",
        correct ? "border-primary/20 bg-primary/5" : "border-destructive/20 bg-destructive/5"
      )}
    >
      <p className="font-medium">Score: {score}/100</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {correct ? drill.correctFeedback : drill.riskyFeedback}
      </p>
      {optionFeedback && (
        <p className="mt-2 text-sm">{optionFeedback}</p>
      )}
      <p className="mt-2 text-sm text-primary">{drill.improvementTip}</p>
    </div>
  )
}
