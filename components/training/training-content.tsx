"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { BookOpenIcon, InfoIcon, LayersIcon, LineChartIcon } from "lucide-react"

import { getChartScenario, getInteractiveScenarios } from "@/content/chart-scenarios"
import { getDrillById as getCourseDrill } from "@/content/registry"

import { AppShell } from "@/components/layout/app-shell"
import { ChartLabWorkspace } from "@/components/chart-lab/chart-lab-workspace"
import { useUserState } from "@/components/providers/user-state-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type {
  ChartScoreResult,
  MarkerTool,
  UserMarker,
} from "@/lib/charts/types"
import type { AIReview, TradeMark, TradeMarkType } from "@/lib/types"
import type { StoredDrillSession } from "@/lib/user-state/types"

const TOOL_TO_MARK: Partial<Record<MarkerTool, TradeMarkType>> = {
  support: "support",
  resistance: "resistance",
  "swing-high": "trend",
  "swing-low": "trend",
  trendline: "trend",
  break: "break",
  retest: "retest",
  entry: "entry",
  "stop-loss": "stop_loss",
  "take-profit": "take_profit",
}

function markersToTradeMarks(markers: UserMarker[]): TradeMark[] {
  return markers
    .map((m) => {
      const type = TOOL_TO_MARK[m.tool]
      if (!type) return null
      return { type, price: m.price, index: m.index }
    })
    .filter((m): m is TradeMark => m !== null)
}

function resultToReview(result: ChartScoreResult): AIReview {
  return {
    score: result.score,
    summary: result.summary,
    strengths: result.correct,
    mistakes: result.improvements,
    improvement: result.tip,
    recommendation: result.passed ? "take" : "skip",
    beginnerExplanation: result.tip,
  }
}

function marksSummary(markers: UserMarker[]): string {
  if (markers.length === 0) return "No markers placed"
  return markers
    .map((m) => `${m.tool.replace("-", " ")} at ${m.price.toLocaleString()}`)
    .join(", ")
}

export function TrainingContent() {
  const searchParams = useSearchParams()
  const courseDrillId = searchParams.get("drill")
  const linkedLessonId = searchParams.get("lesson")

  const { state, recordDrillSession, addJournalEntry } = useUserState()
  const scenarios = useMemo(() => getInteractiveScenarios(), [])
  const courseDrill = courseDrillId ? getCourseDrill(courseDrillId) : null

  const initialScenarioId = useMemo(() => {
    if (courseDrill?.lessonId) {
      // Prefer a scenario tied to the same concept when arriving from a drill.
      const match = scenarios.find((s) => s.id.includes(courseDrill.drillType))
      if (match) return match.id
    }
    return scenarios[0]?.id ?? ""
  }, [courseDrill, scenarios])

  const [selectedId, setSelectedId] = useState(initialScenarioId)
  const [lastResult, setLastResult] = useState<{
    result: ChartScoreResult
    markers: UserMarker[]
  } | null>(null)
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [personalNote, setPersonalNote] = useState("")
  const [journalSaved, setJournalSaved] = useState(false)

  const scenario = getChartScenario(selectedId) ?? scenarios[0]

  const handleSelect = (id: string) => {
    setSelectedId(id)
    setLastResult(null)
    setPersonalNote("")
    setJournalSaved(false)
  }

  const handleComplete = (result: ChartScoreResult, markers: UserMarker[]) => {
    setLastResult({ result, markers })
    setJournalSaved(false)

    const session: Omit<StoredDrillSession, "id" | "completedAt"> = {
      drillType: scenario.concept,
      drillTitle: scenario.title,
      marks: markersToTradeMarks(markers),
      review: resultToReview(result),
      score: result.score,
    }
    recordDrillSession(session, linkedLessonId ?? courseDrill?.lessonId)
  }

  const handleSaveJournal = () => {
    if (!lastResult) return
    addJournalEntry({
      setupPracticed: scenario.title,
      marksSummary: marksSummary(lastResult.markers),
      aiFeedbackSummary: lastResult.result.summary,
      confidenceRating: confidence,
      mistakeTag: lastResult.result.improvements[0] ?? "None noted",
      personalNote: personalNote.trim() || "No personal note added.",
    })
    setJournalSaved(true)
  }

  const hasHistory = state.drillSessions.length > 0

  if (!scenario) {
    return (
      <AppShell>
        <p className="text-muted-foreground">No drills available yet.</p>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <LineChartIcon className="size-5" />
            <span className="text-sm font-medium">Chart Lab Drills</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Practice reading the chart
          </h1>
          <p className="text-muted-foreground">
            Read the concept, then prove you can see it on the chart. Pick a
            drill, mark the structure or trade it asks for, and get instant
            feedback.
          </p>
        </div>

        {/* Scenario / drill selector */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Choose a drill</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelect(s.id)}
                aria-pressed={s.id === selectedId}
                className={
                  "flex flex-col gap-1 rounded-lg border px-4 py-3 text-left transition-colors " +
                  (s.id === selectedId
                    ? "border-primary/30 bg-primary/10 ring-1 ring-primary/20"
                    : "border-border/60 bg-card/50 hover:border-primary/20 hover:bg-muted/30")
                }
              >
                <span className="flex items-center justify-between gap-2 text-sm font-medium">
                  {s.title}
                  <Badge variant="secondary" className="text-[10px] capitalize">
                    {s.difficulty}
                  </Badge>
                </span>
                <span className="text-xs text-muted-foreground">
                  {s.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* The Chart Lab itself */}
        <div className="rounded-xl border border-border/60 bg-card/50 p-4">
          <ChartLabWorkspace
            key={scenario.id}
            scenario={scenario}
            variant="full"
            onComplete={handleComplete}
          />
        </div>

        {lastResult && lastResult.result.score < 70 && (
          <div className="rounded-xl border border-border/60 bg-card/50 p-5">
            <div className="flex items-center gap-2 text-primary">
              <LayersIcon className="size-4" />
              <p className="text-sm font-medium">Review chart flashcards</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Practise support, resistance, and structure with interactive chart
              flashcards.
            </p>
            <Button
              className="mt-3"
              size="sm"
              render={<Link href="/flashcards/session?mode=chart" />}
            >
              Review chart flashcards
            </Button>
          </div>
        )}

        {/* Journal reflection save */}
        {lastResult && !journalSaved && (
          <div className="rounded-xl border border-border/60 bg-card/50 p-5">
            <p className="text-sm font-medium">Save a reflection to your journal</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Writing down what you saw is how chart reading sticks.
            </p>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <Label className="text-xs">Confidence (1–5)</Label>
                <div className="mt-2 flex gap-2">
                  {([1, 2, 3, 4, 5] as const).map((n) => (
                    <Button
                      key={n}
                      type="button"
                      size="sm"
                      variant={confidence === n ? "default" : "outline"}
                      onClick={() => setConfidence(n)}
                    >
                      {n}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="training-note" className="text-xs">
                  Personal note
                </Label>
                <Textarea
                  id="training-note"
                  className="mt-2"
                  placeholder="What did this drill teach you about reading the chart?"
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  rows={3}
                />
              </div>
              <Button className="w-fit" onClick={handleSaveJournal}>
                Save Reflection
              </Button>
            </div>
          </div>
        )}

        {journalSaved && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
            <p className="font-medium text-primary">Saved to journal</p>
            <Button
              className="mt-3"
              size="sm"
              variant="outline"
              render={<Link href="/journal" />}
            >
              <BookOpenIcon data-icon="inline-start" />
              View Journal
            </Button>
          </div>
        )}

        {hasHistory && (
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <h2 className="font-medium">Your drill history</h2>
            <div className="mt-4 flex flex-col gap-2">
              {state.drillSessions.slice(0, 5).map((session: StoredDrillSession) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 text-sm"
                >
                  <span>{session.drillTitle}</span>
                  <span className="text-muted-foreground">
                    {session.score}/100 ·{" "}
                    {new Date(session.completedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground/70">
          <InfoIcon className="mt-0.5 size-3 shrink-0" />
          Educational simulation only. Not financial advice or a trade
          recommendation.
        </p>
      </div>
    </AppShell>
  )
}
