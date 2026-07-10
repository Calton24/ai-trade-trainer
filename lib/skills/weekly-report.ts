import { getWeekDayKeys, getWeekKey } from "@/lib/user-state/activity"
import type { UserState } from "@/lib/user-state/types"

import { computeSkillProfile, countChartsAnalysed } from "./engine"
import { SKILL_LABELS } from "./definitions"
import type { WeeklyReport } from "./types"

export function computeWeeklyReport(state: UserState): WeeklyReport {
  const weekKey = getWeekKey()
  const dayKeys = getWeekDayKeys(weekKey)
  const profile = computeSkillProfile(state)

  const weekAttempts = state.patternAttempts.filter(
    (a) => getWeekKey(new Date(a.completedAt)) === weekKey
  )
  const weekDrills = state.drillSessions.filter(
    (d) => getWeekKey(new Date(d.completedAt)) === weekKey
  )
  const weekSim = state.simulator.attempts.filter(
    (a) => getWeekKey(new Date(a.completedAt)) === weekKey
  )

  const chartsThisWeek =
    weekAttempts.length + weekDrills.length + weekSim.length

  const replayScores = [
    ...weekAttempts.filter((a) => a.widgetKind === "structure-replay"),
    ...weekSim,
  ].map((a) => ("score" in a ? a.score : 0))
  const replayAccuracy =
    replayScores.length > 0
      ? Math.round(replayScores.reduce((s, v) => s + v, 0) / replayScores.length)
      : profile.skills["replay-accuracy"].score

  const activityMinutes =
    (weekAttempts.length * 2 +
      weekDrills.length * 5 +
      weekSim.length * 10 +
      state.activityLog.filter((a) => dayKeys.includes(a.dateKey)).length * 3) /
    60

  const dailyActivity = dayKeys.map((dayKey, i) => {
    const charts =
      state.patternAttempts.filter(
        (a) => a.completedAt.slice(0, 10) === dayKey
      ).length +
      state.drillSessions.filter((d) => d.completedAt.slice(0, 10) === dayKey)
        .length
    return {
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      charts,
    }
  })

  const weakest = profile.weakestSkill
  const recommendedFocus = weakest
    ? `Focus on ${SKILL_LABELS[weakest]} — your lowest-rated skill this week.`
    : "Start with Structure Replay to establish your baseline."

  const improvement = profile.categories.reduce(
    (sum, c) => sum + c.skills.reduce((s, sk) => s + sk.weekTrend, 0),
    0
  )

  return {
    weekKey,
    hoursTrained: Math.round(activityMinutes * 10) / 10,
    chartsAnalysed: chartsThisWeek || countChartsAnalysed(state),
    replayAccuracy,
    weakestSkill: profile.weakestSkill,
    strongestSkill: profile.strongestSkill,
    improvement: Math.round(improvement / Math.max(1, profile.categories.length)),
    recommendedFocus,
    dailyActivity,
  }
}
