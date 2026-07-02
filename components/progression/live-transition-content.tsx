"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CircleIcon,
  LockIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
} from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { CompetenceScoreCard } from "@/components/progression/competence-score-card"
import { useUserState } from "@/components/providers/user-state-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  evaluateGoLiveGate,
  evaluateLivePrepGate,
  evaluateSimulatedGate,
  getNextPhaseAction,
  PHASE_LABELS,
} from "@/lib/competence"
import type { LiveTradingPhase } from "@/lib/competence/types"
import { cn } from "@/lib/utils"

const PHASE_ORDER: LiveTradingPhase[] = [
  "education",
  "simulated",
  "live_prep",
  "go_live",
  "live_active",
]

const RISK_QUIZ = {
  question:
    "You have a $10,000 account and risk 1% per trade. What is your maximum dollar risk per trade?",
  options: ["$50", "$100", "$200", "$500"],
  correct: 1,
}

const LOSING_STREAK = {
  question:
    "After 3 consecutive losses, your best response is:",
  options: [
    "Double position size to recover faster",
    "Take a break, review journal, stick to plan",
    "Switch to a completely new strategy",
    "Skip journaling until you're winning again",
  ],
  correct: 1,
}

const STRATEGY_CLARITY = {
  question:
    "Before going live, you must be able to clearly define:",
  options: [
    "Only your profit target",
    "Entry, exit, stop, and invalidation rules",
    "Which stocks are trending on social media",
    "Your broker's commission structure only",
  ],
  correct: 1,
}

function PhaseStepper({ current }: { current: LiveTradingPhase }) {
  const currentIdx = PHASE_ORDER.indexOf(current)

  return (
    <div className="flex flex-wrap gap-2">
      {PHASE_ORDER.map((phase, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
        return (
          <div
            key={phase}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs",
              done && "border-emerald-500/40 bg-emerald-500/10 text-emerald-700",
              active && "border-primary bg-primary/10 font-medium",
              !done && !active && "border-border text-muted-foreground"
            )}
          >
            {done ? (
              <CheckCircle2Icon className="size-3.5" />
            ) : active ? (
              <TrendingUpIcon className="size-3.5" />
            ) : (
              <LockIcon className="size-3.5" />
            )}
            {PHASE_LABELS[phase]}
          </div>
        )
      })}
    </div>
  )
}

function GateRequirements({
  requirements,
  unlocked,
}: {
  requirements: { label: string; met: boolean; detail?: string }[]
  unlocked: boolean
}) {
  return (
    <ul className="space-y-2">
      {requirements.map((req) => (
        <li
          key={req.label}
          className="flex items-start gap-2 text-sm"
        >
          {req.met ? (
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          ) : (
            <CircleIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          )}
          <span className={cn(!req.met && "text-muted-foreground")}>
            {req.label}
            {req.detail && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({req.detail})
              </span>
            )}
          </span>
        </li>
      ))}
      {unlocked && (
        <li className="pt-2 text-sm font-medium text-emerald-600">
          All requirements met — ready to advance
        </li>
      )}
    </ul>
  )
}

function MiniQuiz({
  title,
  quiz,
  passed,
  onPass,
}: {
  title: string
  quiz: { question: string; options: string[]; correct: number }
  passed: boolean
  onPass: () => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  if (passed) {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
          <CheckCircle2Icon className="size-4" />
          {title} — Passed
        </div>
      </div>
    )
  }

  const submit = () => {
    if (selected === null) return
    if (selected === quiz.correct) {
      setFeedback("Correct — discipline checkpoint passed.")
      onPass()
    } else {
      setFeedback("Incorrect. Review risk and psychology modules, then retry.")
    }
  }

  return (
    <div className="rounded-lg border border-border/60 bg-card/50 p-4 space-y-3">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{quiz.question}</p>
      <div className="flex flex-col gap-2">
        {quiz.options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            onClick={() => setSelected(i)}
            className={cn(
              "rounded-md border px-3 py-2 text-left text-sm transition-colors",
              selected === i
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/40"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      {feedback && (
        <p
          className={cn(
            "text-sm",
            feedback.startsWith("Correct")
              ? "text-emerald-600"
              : "text-amber-600"
          )}
        >
          {feedback}
        </p>
      )}
      <Button size="sm" onClick={submit} disabled={selected === null}>
        Submit
      </Button>
    </div>
  )
}

export function LiveTransitionContent() {
  const {
    state,
    competenceScores,
    unlockSimulated,
    unlockLivePrepPhase,
    passGoLiveCheck,
  } = useUserState()

  const phase = state.liveTradingPhase
  const simulatedGate = evaluateSimulatedGate(state, competenceScores)
  const livePrepGate = evaluateLivePrepGate(state, competenceScores)
  const goLiveGate = evaluateGoLiveGate(state, phase, competenceScores)
  const nextAction = getNextPhaseAction(state, phase)

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-600">
            <ShieldCheckIcon className="size-5" />
            <span className="text-sm font-medium">Competence Progression</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Education → Simulated → Live
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            This platform measures behaviour, not just content consumption.
            Advance only when competence scores and discipline checkpoints are
            met.
          </p>
        </div>

        <PhaseStepper current={phase.currentPhase} />

        <CompetenceScoreCard scores={competenceScores} phase={phase} />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-card/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Phase 1: Simulated Trading</h2>
              {phase.simulatedUnlockedAt ? (
                <Badge className="bg-emerald-600">Unlocked</Badge>
              ) : (
                <Badge variant="outline">Locked</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Paper trading with forced 1% max risk and mandatory journaling
              after each trade.
            </p>
            <GateRequirements
              requirements={simulatedGate.requirements}
              unlocked={simulatedGate.unlocked}
            />
            {!phase.simulatedUnlockedAt && simulatedGate.unlocked && (
              <Button onClick={unlockSimulated}>
                Unlock Simulated Trading
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            )}
            {phase.simulatedUnlockedAt && (
              <Button variant="outline" render={<Link href="/training" />}>
                Open Training Mode
              </Button>
            )}
          </div>

          <div className="rounded-xl border border-border/60 bg-card/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Phase 2: Live Preparation</h2>
              {phase.livePrepUnlockedAt ? (
                <Badge className="bg-emerald-600">Unlocked</Badge>
              ) : (
                <Badge variant="outline">Locked</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Prove consistent risk management, journaling discipline, and
              emotional control before live capital.
            </p>
            <GateRequirements
              requirements={livePrepGate.requirements}
              unlocked={livePrepGate.unlocked}
            />
            {phase.simulatedUnlockedAt &&
              !phase.livePrepUnlockedAt &&
              livePrepGate.unlocked && (
                <Button onClick={unlockLivePrepPhase}>
                  Enter Live Preparation
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              )}
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Phase 3: Go Live Gate</h2>
            {phase.currentPhase === "live_active" ? (
              <Badge className="bg-emerald-600">Live Ready</Badge>
            ) : phase.goLiveUnlockedAt ? (
              <Badge variant="outline">Checklist in progress</Badge>
            ) : (
              <Badge variant="outline">Locked</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Final checkpoints before risking real capital. Fail any gate and
            you&apos;re routed back to your weakest module.
          </p>

          {phase.livePrepUnlockedAt && (
            <>
              <GateRequirements
                requirements={goLiveGate.requirements}
                unlocked={goLiveGate.unlocked}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <MiniQuiz
                  title="Risk Quiz"
                  quiz={RISK_QUIZ}
                  passed={phase.riskQuizPassed}
                  onPass={() => passGoLiveCheck("riskQuizPassed")}
                />
                <MiniQuiz
                  title="Losing Streak Scenario"
                  quiz={LOSING_STREAK}
                  passed={phase.losingStreakScenarioPassed}
                  onPass={() => passGoLiveCheck("losingStreakScenarioPassed")}
                />
                <MiniQuiz
                  title="Strategy Clarity"
                  quiz={STRATEGY_CLARITY}
                  passed={phase.strategyClarityPassed}
                  onPass={() => passGoLiveCheck("strategyClarityPassed")}
                />
              </div>
            </>
          )}

          {!phase.livePrepUnlockedAt && (
            <p className="text-sm text-muted-foreground">
              Complete Live Preparation requirements to access go-live
              checkpoints.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <p className="text-sm font-medium text-primary">Recommended next step</p>
          <p className="mt-1 text-lg font-semibold">{nextAction.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{nextAction.reason}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button render={<Link href={nextAction.href} />}>
              Continue
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            {competenceScores.weakestArea && (
              <Button
                variant="outline"
                render={<Link href={competenceScores.recommendedNextModule} />}
              >
                Strengthen weakest area
              </Button>
            )}
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Overall competence</span>
              <span>{competenceScores.overallScore}%</span>
            </div>
            <Progress value={competenceScores.overallScore} className="h-2" />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
