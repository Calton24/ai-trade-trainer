"use client"

import { LightbulbIcon, EyeIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { GuidedStep } from "@/lib/execution-lab/guided/types"
import { cn } from "@/lib/utils"

interface GuidedStepPanelProps {
  steps: GuidedStep[]
  stepIndex: number
  currentStep: GuidedStep
  hintLevel: number
  revealed: boolean
  feedback: string | null
  feedbackOk: boolean | null
  onHint: () => void
  onReveal: () => void
  onContinue: () => void
  canContinue: boolean
  todayGoal?: string
}

export function GuidedStepPanel({
  steps,
  stepIndex,
  currentStep,
  hintLevel,
  revealed,
  feedback,
  feedbackOk,
  onHint,
  onReveal,
  onContinue,
  canContinue,
  todayGoal = "Complete a guided trade from analysis to execution",
}: GuidedStepPanelProps) {
  const progressPct = Math.round(((stepIndex + (canContinue ? 1 : 0)) / steps.length) * 100)
  const maxHints = currentStep.hints.length
  const canHint = hintLevel < maxHints
  const canReveal = hintLevel >= maxHints && !revealed

  return (
    <div className="flex h-full flex-col rounded-xl border border-border/60 bg-card/80">
      <div className="border-b border-border/60 px-4 py-3">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Academy Mode
        </p>
        <p className="mt-1 text-sm font-medium">{todayGoal}</p>
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Step {stepIndex + 1} / {steps.length}
            </span>
            <span>{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-1.5" />
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div>
          <p className="text-xs text-primary">{currentStep.skillLabel}</p>
          <h2 className="mt-1 text-base font-semibold">{currentStep.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{currentStep.prompt}</p>
        </div>

        {(hintLevel > 0 || revealed) && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <p className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
              <LightbulbIcon className="size-3.5" />
              {revealed ? "Answer revealed" : `Hint ${hintLevel} of ${maxHints}`}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {revealed
                ? currentStep.revealAnswer
                : currentStep.hints[hintLevel - 1]}
            </p>
          </div>
        )}

        {feedback && (
          <div
            className={cn(
              "rounded-lg border p-3 text-sm",
              feedbackOk
                ? "border-primary/30 bg-primary/5 text-primary"
                : "border-destructive/30 bg-destructive/5 text-destructive"
            )}
          >
            {feedback}
          </div>
        )}
      </div>

      <div className="space-y-2 border-t border-border/60 p-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={!canHint}
            onClick={onHint}
          >
            <LightbulbIcon data-icon="inline-start" />
            Hint
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={!canReveal}
            onClick={onReveal}
          >
            <EyeIcon data-icon="inline-start" />
            Reveal
          </Button>
        </div>
        {canContinue && (
          <Button className="w-full" size="sm" onClick={onContinue}>
            Continue
            <ChevronRightIcon data-icon="inline-end" />
          </Button>
        )}
      </div>
    </div>
  )
}
