"use client"

import { useCallback, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, ArrowRightIcon, CheckCircle2Icon } from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { ChartReadingSection } from "@/components/trader-readiness/chart-reading-section"
import { JournalAnalysisSection } from "@/components/trader-readiness/journal-analysis-section"
import { KnowledgeSection } from "@/components/trader-readiness/knowledge-section"
import { PsychologySection } from "@/components/trader-readiness/psychology-section"
import { RiskManagementSection } from "@/components/trader-readiness/risk-management-section"
import { StrategyMasterySection } from "@/components/trader-readiness/strategy-mastery-section"
import { TradeSelectionSection } from "@/components/trader-readiness/trade-selection-section"
import { useUserState } from "@/components/providers/user-state-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  getAssessmentPillars,
  getChartReadingExercise,
  getJournalAnalysisScenario,
  getPillarById,
  getTradeSelectionScenario,
  getStrategyMasteryQuestions,
  MARKET_KNOWLEDGE_QUESTIONS,
  PSYCHOLOGY_SCENARIOS,
  RISK_SCENARIOS,
  TRADER_READINESS_DISCLAIMER,
} from "@/content/trader-readiness"
import type { ReadinessPillarId } from "@/lib/trader-readiness/types"
import { detectWeaknesses } from "@/lib/trader-readiness/recommendations"

export function ReadinessAssessmentWorkspace() {
  const router = useRouter()
  const { state, recordReadinessAssessment } = useUserState()
  const recordedRef = useRef(false)

  const strategyCompleted =
    state.strategyWiki.completedStrategyIds.length >= 1
  const pillars = getAssessmentPillars(strategyCompleted)

  const [pillarIndex, setPillarIndex] = useState(0)
  const [pillarScores, setPillarScores] = useState<
    Partial<Record<ReadinessPillarId, number>>
  >({})
  const [allWeaknesses, setAllWeaknesses] = useState<string[]>([])
  const [sectionComplete, setSectionComplete] = useState(false)
  const [assessmentDone, setAssessmentDone] = useState(false)

  const currentPillar = pillars[pillarIndex]
  const progressPercent = Math.round(
    ((pillarIndex + (sectionComplete ? 1 : 0)) / pillars.length) * 100
  )

  const finishAssessment = useCallback(
    (scores: Partial<Record<ReadinessPillarId, number>>) => {
      if (recordedRef.current) return
      recordedRef.current = true

      const filled = {
        "market-knowledge": scores["market-knowledge"] ?? 0,
        "chart-reading": scores["chart-reading"] ?? 0,
        "trade-selection": scores["trade-selection"] ?? 0,
        "risk-management": scores["risk-management"] ?? 0,
        psychology: scores.psychology ?? 0,
        "journal-analysis": scores["journal-analysis"] ?? 0,
        "strategy-mastery": scores["strategy-mastery"] ?? 0,
      }

      const weaknesses = detectWeaknesses(filled, allWeaknesses)
      const overall = Math.round(
        Object.values(scores).reduce((a, b) => (a ?? 0) + (b ?? 0), 0)! /
          Object.values(scores).length
      )

      const sessionId = recordReadinessAssessment({
        pillarScores: scores as Record<ReadinessPillarId, number>,
        detectedWeaknesses: weaknesses,
        xpEarned: Math.round(overall / 2),
      })

      setAssessmentDone(true)
      router.push(`/trader-readiness/results/${sessionId}`)
    },
    [allWeaknesses, recordReadinessAssessment, router]
  )

  const handlePillarComplete = useCallback(
    (pillarId: ReadinessPillarId, score: number, weaknesses: string[] = []) => {
      const updated = { ...pillarScores, [pillarId]: score }
      setPillarScores(updated)
      setAllWeaknesses((w) => [...w, ...weaknesses])
      setSectionComplete(true)

      if (pillarIndex >= pillars.length - 1) {
        finishAssessment(updated)
      }
    },
    [pillarScores, pillarIndex, pillars.length, finishAssessment]
  )

  const goToNextPillar = () => {
    if (pillarIndex < pillars.length - 1) {
      setPillarIndex((i) => i + 1)
      setSectionComplete(false)
    }
  }

  if (!currentPillar) return null

  const pillarDef = getPillarById(currentPillar.id)

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit"
          render={<Link href="/trader-readiness" />}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Trader Readiness
        </Button>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{pillarDef.icon}</span>
              <h1 className="text-xl font-semibold">{pillarDef.title}</h1>
            </div>
            <Badge variant="outline">
              Pillar {pillarIndex + 1} of {pillars.length}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{pillarDef.description}</p>
          <Progress value={progressPercent} className="h-2" />
          <p className="text-xs text-muted-foreground">{TRADER_READINESS_DISCLAIMER}</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          {currentPillar.id === "market-knowledge" && !sectionComplete && (
            <KnowledgeSection
              questions={MARKET_KNOWLEDGE_QUESTIONS}
              onComplete={(score, weaknesses) =>
                handlePillarComplete("market-knowledge", score, weaknesses)
              }
            />
          )}

          {currentPillar.id === "chart-reading" && !sectionComplete && (
            <ChartReadingSection
              exercise={getChartReadingExercise()}
              onComplete={(score) =>
                handlePillarComplete("chart-reading", score)
              }
            />
          )}

          {currentPillar.id === "trade-selection" && !sectionComplete && (
            <TradeSelectionSection
              scenario={getTradeSelectionScenario()}
              onComplete={(score) =>
                handlePillarComplete("trade-selection", score)
              }
            />
          )}

          {currentPillar.id === "risk-management" && !sectionComplete && (
            <RiskManagementSection
              scenarios={RISK_SCENARIOS}
              onComplete={(score) =>
                handlePillarComplete("risk-management", score)
              }
            />
          )}

          {currentPillar.id === "psychology" && !sectionComplete && (
            <PsychologySection
              scenarios={PSYCHOLOGY_SCENARIOS}
              onComplete={(score) => handlePillarComplete("psychology", score)}
            />
          )}

          {currentPillar.id === "journal-analysis" && !sectionComplete && (
            <JournalAnalysisSection
              scenario={getJournalAnalysisScenario()}
              onComplete={(score) =>
                handlePillarComplete("journal-analysis", score)
              }
            />
          )}

          {currentPillar.id === "strategy-mastery" && !sectionComplete && (
            <StrategyMasterySection
              questions={getStrategyMasteryQuestions(
                state.strategyWiki.completedStrategyIds
              )}
              onComplete={(score) =>
                handlePillarComplete("strategy-mastery", score)
              }
            />
          )}

          {sectionComplete && !assessmentDone && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle2Icon className="size-10 text-primary" />
              <p className="font-medium">
                {pillarDef.title} complete —{" "}
                {pillarScores[currentPillar.id]}%
              </p>
              {pillarIndex < pillars.length - 1 ? (
                <Button onClick={goToNextPillar}>
                  Next pillar: {getPillarById(pillars[pillarIndex + 1].id).title}
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Generating your readiness report...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
