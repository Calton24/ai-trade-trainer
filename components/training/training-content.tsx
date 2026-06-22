"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { BookOpenIcon, PenLineIcon } from "lucide-react"

import { getDrillById as getCourseDrill } from "@/content/registry"

import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { EmptyState } from "@/components/shared/empty-state"
import { AiCoachPanel } from "@/components/training/ai-coach-panel"
import { DrillSelector } from "@/components/training/drill-selector"
import { MarkToolbar } from "@/components/training/mark-toolbar"
import { TrainingChart } from "@/components/training/training-chart"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { drills, generateMockCandles } from "@/lib/mock-data"
import type { StoredDrillSession } from "@/lib/user-state/types"
import type { AIReview, TradeMark, TradeMarkType } from "@/lib/types"

function formatMarksSummary(marks: TradeMark[]): string {
  if (marks.length === 0) return "No marks placed"
  return marks
    .map((m) => `${m.type.replace("_", " ")} at ${m.price.toLocaleString()}`)
    .join(", ")
}

export function TrainingContent() {
  const searchParams = useSearchParams()
  const courseDrillId = searchParams.get("drill")
  const linkedLessonId = searchParams.get("lesson")

  const { state, recordDrillSession, addJournalEntry } = useUserState()
  const candles = useMemo(() => generateMockCandles(50), [])
  const courseDrill = courseDrillId ? getCourseDrill(courseDrillId) : null

  const [selectedDrillId, setSelectedDrillId] = useState(drills[0].id)
  const selectedDrill =
    drills.find((d) => d.id === selectedDrillId) ?? drills[0]

  useEffect(() => {
    if (!courseDrill?.legacyDrillType) return
    const legacy = drills.find((d) => d.type === courseDrill.legacyDrillType)
    if (legacy) setSelectedDrillId(legacy.id)
  }, [courseDrill])

  const [marks, setMarks] = useState<TradeMark[]>([])
  const [activeMarkType, setActiveMarkType] = useState<TradeMarkType | null>(
    null
  )
  const [review, setReview] = useState<AIReview | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionSaved, setSessionSaved] = useState(false)
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [personalNote, setPersonalNote] = useState("")
  const [journalSaved, setJournalSaved] = useState(false)

  const handleDrillChange = (id: string) => {
    setSelectedDrillId(id)
    setMarks([])
    setReview(null)
    setActiveMarkType(null)
    setSessionSaved(false)
    setJournalSaved(false)
    setPersonalNote("")
  }

  const handleMark = useCallback(
    (index: number, price: number) => {
      if (!activeMarkType) return
      setMarks((prev) => {
        const filtered = prev.filter((m) => m.type !== activeMarkType)
        return [...filtered, { type: activeMarkType, price, index }]
      })
      setReview(null)
      setSessionSaved(false)
      setJournalSaved(false)
    },
    [activeMarkType]
  )

  const handleSubmit = async () => {
    setIsLoading(true)
    setReview(null)
    setSessionSaved(false)
    setJournalSaved(false)

    try {
      const response = await fetch("/api/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marks,
          drillType: selectedDrill.type,
          pair: "BTC/USDT",
        }),
      })
      const data = await response.json()
      const aiReview = data.review as AIReview
      setReview(aiReview)

      recordDrillSession(
        {
          drillType: selectedDrill.type,
          drillTitle: courseDrill?.title ?? selectedDrill.title,
          marks,
          review: aiReview,
          score: aiReview.score,
        },
        linkedLessonId ?? courseDrill?.lessonId
      )
      setSessionSaved(true)
    } catch {
      setReview({
        score: 0,
        strengths: [],
        mistakes: ["Something went wrong. Please try submitting again."],
        improvement: "Check your connection and retry.",
        recommendation: "skip",
        summary: "Review request failed.",
        beginnerExplanation:
          "We couldn't process your answer right now. Your markers are still on the chart — try again in a moment.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setMarks([])
    setReview(null)
    setActiveMarkType(null)
    setSessionSaved(false)
    setJournalSaved(false)
    setPersonalNote("")
  }

  const handleSaveJournal = () => {
    if (!review) return
    addJournalEntry({
      setupPracticed: selectedDrill.title,
      marksSummary: formatMarksSummary(marks),
      aiFeedbackSummary: review.summary,
      confidenceRating: confidence,
      mistakeTag: review.mistakes[0] ?? "None noted",
      personalNote: personalNote.trim() || "No personal note added.",
    })
    setJournalSaved(true)
  }

  const hasHistory = state.drillSessions.length > 0

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Chart Drills
          </h1>
          <p className="text-muted-foreground">
            Learn trading by doing — practice on replay charts with instant
            feedback
          </p>
        </div>

        {!hasHistory && (
          <EmptyState
            icon={PenLineIcon}
            title="You haven't completed any drills yet"
            description="Choose a drill below, mark levels on the chart, and submit for AI-style feedback."
            action={
              <Button onClick={() => document.getElementById("drill-chart")?.scrollIntoView({ behavior: "smooth" })}>
                Start your first drill
              </Button>
            }
          />
        )}

        <DrillSelector
          drills={drills}
          selectedId={selectedDrillId}
          onSelect={handleDrillChange}
        />

        <div id="drill-chart" className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card/50 ring-1 ring-white/[0.02]">
            <TrainingChart
              candles={candles}
              marks={marks}
              activeMarkType={activeMarkType}
              onMark={handleMark}
            />
            <MarkToolbar
              drill={selectedDrill}
              activeMarkType={activeMarkType}
              onSelectMark={setActiveMarkType}
              onSubmit={handleSubmit}
              onReset={handleReset}
              isSubmitting={isLoading}
              markCount={marks.length}
            />
          </div>

          <div className="flex min-h-[400px] flex-col gap-4 lg:min-h-0">
            <AiCoachPanel review={review} isLoading={isLoading} />

            {review && sessionSaved && !journalSaved && (
              <div className="rounded-xl border border-border/60 bg-card/50 p-4">
                <p className="text-sm font-medium">Save to journal</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Reflect on this drill to build your practice journal.
                </p>
                <div className="mt-4 flex flex-col gap-3">
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
                    <Label htmlFor="personal-note" className="text-xs">
                      Personal note
                    </Label>
                    <Textarea
                      id="personal-note"
                      className="mt-2"
                      placeholder="What did you learn from this drill?"
                      value={personalNote}
                      onChange={(e) => setPersonalNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleSaveJournal}>Save Reflection</Button>
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
          </div>
        </div>

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
      </div>
    </AppShell>
  )
}
