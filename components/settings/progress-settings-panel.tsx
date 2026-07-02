"use client"

import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionResetDialog } from "@/components/settings/typed-confirm-dialog"
import { useUserSettings } from "@/lib/settings/use-user-settings"
import type { ResetSection } from "@/lib/user-state/reset"

const SECTIONS: { id: ResetSection; label: string; description: string }[] = [
  {
    id: "paths",
    label: "Learning Paths",
    description: "Lessons, quizzes, and path progress",
  },
  {
    id: "book-lab",
    label: "Trading Library",
    description: "Book concepts, quizzes, and practice",
  },
  {
    id: "flashcards",
    label: "Flashcards",
    description: "Card mastery and review history",
  },
  {
    id: "chart-lab",
    label: "Chart Lab",
    description: "Chart drill sessions",
  },
  {
    id: "trend-spotter",
    label: "Trend Spotter",
    description: "Lessons, exercises, and challenges",
  },
  {
    id: "strategy-wiki",
    label: "Strategy Wiki",
    description: "Strategy lessons and practice",
  },
  {
    id: "simulator",
    label: "Trading Simulator",
    description: "Simulator stages and sessions",
  },
  {
    id: "trader-readiness",
    label: "Trader Readiness",
    description: "Assessment results and pillar scores",
  },
]

export function ProgressSettingsPanel() {
  const { state, progression, hydrated, resetSectionProgress } = useUserState()
  const { logReset } = useUserSettings()
  const stats = progression.stats

  function exportJson() {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tradetrainer-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleReset(section: ResetSection) {
    resetSectionProgress(section)
    await logReset(section)
  }

  const lastActive =
    state.progress.lastActivityDate ??
    state.activityLog[state.activityLog.length - 1]?.dateKey ??
    "—"

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Your progress snapshot</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          {[
            ["Lifetime XP", hydrated ? progression.xp.toLocaleString() : "—"],
            ["Trader rank", hydrated ? progression.rank.rank.title : "—"],
            ["Competency", hydrated ? `${progression.competency.score}/100` : "—"],
            ["Lessons completed", stats.lessonsCompleted],
            ["Quizzes completed", stats.quizzesCompleted],
            ["Books completed", stats.booksCompleted],
            ["Simulations", stats.simulationsCompleted],
            ["Journal entries", state.journalEntries.length],
            ["Last active", lastActive],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-2 rounded-lg border border-border/40 px-3 py-2"
            >
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Export</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Download a JSON copy of your full learning state.
          </p>
          <Button variant="outline" onClick={exportJson}>
            Export my progress
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Reset sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SECTIONS.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-border/40 p-4"
            >
              <div>
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.description}</p>
              </div>
              <SectionResetDialog
                label={s.label}
                description={`This clears all ${s.label} progress. Your account stays active.`}
                onConfirm={() => handleReset(s.id)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Targeted data deletion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(
            [
              ["journal", "Journal entries only"],
              ["flashcards", "Flashcard history only"],
              ["simulator", "Simulator history only"],
            ] as const
          ).map(([id, label]) => (
            <div
              key={id}
              className="flex items-center justify-between gap-4 rounded-xl border border-border/40 p-4"
            >
              <p className="text-sm font-medium">{label}</p>
              <SectionResetDialog
                label={label}
                description={`Deletes ${label.toLowerCase()}. Other progress is kept.`}
                onConfirm={() => handleReset(id)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
