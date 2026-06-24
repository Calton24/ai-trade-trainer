"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  JOURNAL_MISTAKE_OPTIONS,
  JOURNAL_PATTERN_OPTIONS,
} from "@/content/trader-readiness"
import type { JournalAnalysisScenario } from "@/lib/trader-readiness/types"
import { scoreJournalAnalysis } from "@/lib/trader-readiness/scoring"
import { cn } from "@/lib/utils"

interface JournalAnalysisSectionProps {
  scenario: JournalAnalysisScenario
  onComplete: (score: number) => void
}

export function JournalAnalysisSection({
  scenario,
  onComplete,
}: JournalAnalysisSectionProps) {
  const [mistakes, setMistakes] = useState<string[]>([])
  const [patterns, setPatterns] = useState<string[]>([])
  const [improvement, setImprovement] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const toggle = (
    list: string[],
    setList: (v: string[]) => void,
    item: string
  ) => {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    )
  }

  const handleSubmit = () => {
    const result = scoreJournalAnalysis(scenario, mistakes, patterns, improvement)
    setScore(result.percent)
    setSubmitted(true)
    onComplete(result.percent)
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-5">
        <p className="font-medium">Journal Analysis — {score}%</p>
        <p className="text-sm text-muted-foreground">{scenario.explanation}</p>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Key improvements:</p>
          <ul className="list-inside list-disc text-muted-foreground">
            {scenario.improvementAreas.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-muted-foreground">
        Review this sample trade journal and identify mistakes, patterns, and
        improvements.
      </p>

      <div className="overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              <th className="px-4 py-2 text-left font-medium">Date</th>
              <th className="px-4 py-2 text-left font-medium">Setup</th>
              <th className="px-4 py-2 text-left font-medium">Result</th>
              <th className="px-4 py-2 text-left font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {scenario.entries.map((entry) => (
              <tr key={entry.id} className="border-b border-border/40">
                <td className="px-4 py-2">{entry.date}</td>
                <td className="px-4 py-2">{entry.setup}</td>
                <td className="px-4 py-2">{entry.result}</td>
                <td className="px-4 py-2 text-muted-foreground">{entry.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">What mistakes do you notice?</p>
        <div className="flex flex-wrap gap-2">
          {JOURNAL_MISTAKE_OPTIONS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggle(mistakes, setMistakes, m)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                mistakes.includes(m)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/40"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">What patterns appear?</p>
        <div className="flex flex-wrap gap-2">
          {JOURNAL_PATTERN_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => toggle(patterns, setPatterns, p)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                patterns.includes(p)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/40"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">What should improve?</label>
        <Textarea
          value={improvement}
          onChange={(e) => setImprovement(e.target.value)}
          placeholder="Describe actionable improvements..."
          rows={3}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={
          mistakes.length === 0 || patterns.length === 0 || improvement.length < 10
        }
      >
        Submit journal analysis
      </Button>
    </div>
  )
}
