import type { UserState } from "@/lib/user-state/types"

import { SKILL_LABELS } from "./definitions"
import type { JournalInsight } from "./types"

export function analyzeJournal(state: UserState): JournalInsight[] {
  const entries = state.journalEntries
  if (entries.length < 3) {
    return [
      {
        id: "need-more",
        message:
          "Log at least 3 trades to unlock journal intelligence coaching.",
        severity: "info",
      },
    ]
  }

  const insights: JournalInsight[] = []

  const lowConfidence = entries.filter((e) => e.confidenceRating <= 2).length
  if (lowConfidence >= Math.ceil(entries.length * 0.4)) {
    insights.push({
      id: "low-confidence",
      message:
        "Many entries show low confidence ratings. Run Structure Replay to build conviction before live decisions.",
      severity: "warning",
    })
  }

  const tagged = entries.filter((e) => e.mistakeTag && e.mistakeTag.length > 0)
  if (tagged.length >= 2) {
    const trendMistakes = tagged.filter((e) =>
      /trend|against|counter|reversal/i.test(e.mistakeTag)
    ).length
    if (trendMistakes >= 2) {
      insights.push({
        id: "against-trend",
        message: `${trendMistakes} journal entries tagged with trend-related mistakes. Run Trend Detective before your next session.`,
        severity: "warning",
      })
    } else {
      insights.push({
        id: "awareness",
        message: `${tagged.length} trades tagged with mistakes — strong self-awareness builds faster improvement.`,
        severity: "positive",
      })
    }
  }

  const continuationSetups = entries.filter((e) =>
    /continuation|trend|with|pullback/i.test(e.setupPracticed)
  ).length
  const reversalSetups = entries.filter((e) =>
    /reversal|counter|against|fade/i.test(e.setupPracticed)
  ).length
  if (continuationSetups >= 2 && reversalSetups >= 2) {
    insights.push({
      id: "setup-mix",
      message:
        continuationSetups > reversalSetups
          ? "Your journal leans toward continuation setups — lean into what you practise most."
          : "You journal more reversal setups than continuations. Check if that matches your edge.",
      severity: "info",
    })
  }

  const recentReflections = state.bookLab.reflections.length
  if (recentReflections >= 3) {
    insights.push({
      id: "reflection-habit",
      message:
        "Consistent psychology reflections detected. Discipline scores improve with this habit.",
      severity: "positive",
    })
  }

  if (insights.length === 0) {
    insights.push({
      id: "keep-logging",
      message:
        "Keep journaling — more data unlocks personalised coaching on timing, setup quality, and discipline.",
      severity: "info",
    })
  }

  return insights.slice(0, 4)
}

export function getJournalCoachingSummary(state: UserState): string {
  const insights = analyzeJournal(state)
  const primary = insights.find((i) => i.severity === "warning") ?? insights[0]
  return primary?.message ?? "Start journaling to unlock coaching insights."
}

export function formatWeakestSkillLabel(skillId: string | null): string {
  if (!skillId) return "Structure Replay"
  return SKILL_LABELS[skillId as keyof typeof SKILL_LABELS] ?? skillId
}
