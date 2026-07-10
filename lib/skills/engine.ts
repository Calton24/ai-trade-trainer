import { computeBehavioralCompetence } from "@/lib/competence/behavioral-scoring"
import { calculateDailyStreak, getDateKey, getWeekKey } from "@/lib/user-state/activity"
import type { StoredPatternAttempt } from "@/lib/user-state/pattern-recognition"
import type { UserState } from "@/lib/user-state/types"

import {
  ALL_SKILL_IDS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  PRACTICE_DRILLS,
  SKILL_CATEGORIES,
  SKILL_LABELS,
  SKILL_PRACTICE_ROUTES,
  scoreToLevel,
} from "./definitions"
import type {
  AdaptiveRecommendation,
  CategoryScore,
  DailyChallenge,
  DailyTrainingItem,
  DailyTrainingPlan,
  SkillId,
  SkillProfile,
  SkillScore,
} from "./types"

interface ScoredAttempt {
  score: number
  completedAt: string
  skillId: SkillId
}

const PATTERN_TO_SKILL: Record<string, SkillId> = {
  "trend-detection": "trend-detection",
  continuation: "continuation",
  reversal: "reversal",
  "trend-building": "trend-detection",
  "support-resistance": "support-resistance",
}

function weightedAvg(
  attempts: { score: number; completedAt: string }[],
  halfLifeDays = 14
): number {
  if (attempts.length === 0) return 0
  const now = Date.now()
  let sum = 0
  let wTotal = 0
  for (const a of attempts) {
    const ageDays = (now - new Date(a.completedAt).getTime()) / 86_400_000
    const w = Math.exp(-ageDays / halfLifeDays)
    sum += a.score * w
    wTotal += w
  }
  return Math.round(sum / wTotal)
}

function weekTrend(
  attempts: { score: number; completedAt: string }[]
): number {
  const now = new Date()
  const thisWeek = getWeekKey(now)
  const lastWeekDate = new Date(now)
  lastWeekDate.setDate(lastWeekDate.getDate() - 7)
  const lastWeek = getWeekKey(lastWeekDate)

  const avgForWeek = (weekKey: string) => {
    const scores = attempts
      .filter((a) => getWeekKey(new Date(a.completedAt)) === weekKey)
      .map((a) => a.score)
    if (scores.length === 0) return null
    return Math.round(scores.reduce((s, v) => s + v, 0) / scores.length)
  }

  const current = avgForWeek(thisWeek)
  const previous = avgForWeek(lastWeek)
  if (current === null || previous === null) return 0
  return current - previous
}

function collectAttempts(state: UserState): ScoredAttempt[] {
  const out: ScoredAttempt[] = []

  for (const a of state.patternAttempts) {
    const skillId = PATTERN_TO_SKILL[a.category] ?? "trend-detection"
    out.push({ score: a.score, completedAt: a.completedAt, skillId })
    if (a.widgetKind === "structure-replay") {
      out.push({ score: a.score, completedAt: a.completedAt, skillId: "replay-accuracy" })
    }
  }

  for (const d of state.drillSessions) {
    const text = `${d.drillType} ${d.drillTitle}`.toLowerCase()
    if (/risk|position|sizing|lot/.test(text)) {
      out.push({
        score: d.score,
        completedAt: d.completedAt,
        skillId: "position-sizing",
      })
    }
    if (/stop|sl\b/.test(text)) {
      out.push({ score: d.score, completedAt: d.completedAt, skillId: "stop-placement" })
    }
    if (/risk.reward|rr|r:r/.test(text)) {
      out.push({ score: d.score, completedAt: d.completedAt, skillId: "risk-reward" })
    }
    if (/support|resistance|sr/.test(text)) {
      out.push({
        score: d.score,
        completedAt: d.completedAt,
        skillId: "support-resistance",
      })
    }
    if (/break|retest/.test(text)) {
      out.push({ score: d.score, completedAt: d.completedAt, skillId: "break-retest" })
    }
    if (/liquidity|sweep/.test(text)) {
      out.push({ score: d.score, completedAt: d.completedAt, skillId: "liquidity" })
    }
  }

  for (const a of state.trendSpotter.exerciseAttempts) {
    out.push({
      score: a.chartScore,
      completedAt: a.completedAt,
      skillId: "trend-detection",
    })
  }
  for (const a of state.trendSpotter.challengeAttempts) {
    const pct = Math.round((a.score / Math.max(1, a.total)) * 100)
    out.push({
      score: pct,
      completedAt: a.completedAt,
      skillId: "trend-detection",
    })
  }

  for (const a of state.strategyWiki.practiceAttempts) {
    out.push({
      score: a.totalScore,
      completedAt: a.completedAt,
      skillId: "trade-or-skip",
    })
    out.push({
      score: a.totalScore,
      completedAt: a.completedAt,
      skillId: "decision-quality",
    })
  }

  for (const a of state.simulator.attempts) {
    out.push({
      score: a.score,
      completedAt: a.completedAt,
      skillId: "replay-accuracy",
    })
    out.push({
      score: a.score,
      completedAt: a.completedAt,
      skillId: "decision-quality",
    })
  }

  for (const a of state.executionAttempts) {
    out.push({
      score: a.executionScore,
      completedAt: a.completedAt,
      skillId: "position-sizing",
    })
    out.push({
      score: a.executionScore,
      completedAt: a.completedAt,
      skillId: "stop-placement",
    })
    out.push({
      score: a.executionScore,
      completedAt: a.completedAt,
      skillId: "risk-reward",
    })
    out.push({
      score: a.executionScore,
      completedAt: a.completedAt,
      skillId: "decision-quality",
    })
    if (a.direction === "wait" || a.direction === "no-trade") {
      out.push({
        score: a.executionScore,
        completedAt: a.completedAt,
        skillId: "trade-or-skip",
      })
    }
    if (a.confidence > 0) {
      out.push({
        score: a.executionScore,
        completedAt: a.completedAt,
        skillId: "confidence-calibration",
      })
    }
  }

  const competence = computeBehavioralCompetence(state)
  const now = new Date().toISOString()
  if (competence.psychologyScore > 0) {
    out.push({
      score: competence.psychologyScore,
      completedAt: now,
      skillId: "discipline",
    })
  }
  if (competence.riskScore > 0) {
    out.push({
      score: competence.riskScore,
      completedAt: now,
      skillId: "position-sizing",
    })
  }

  if (state.journalEntries.length > 0) {
    const withTags = state.journalEntries.filter(
      (j) => j.mistakeTag && j.mistakeTag.length > 0
    ).length
    const journalScore = Math.min(
      100,
      Math.round((withTags / state.journalEntries.length) * 60 + 20)
    )
    const lastJournal = state.journalEntries[state.journalEntries.length - 1]
    out.push({
      score: journalScore,
      completedAt: lastJournal?.createdAt ?? now,
      skillId: "journal-quality",
    })
  }

  if (state.bookLab.reflections.length > 0) {
    const avgConf =
      state.bookLab.reflections.reduce((s, r) => s + r.confidenceRating, 0) /
      state.bookLab.reflections.length
    out.push({
      score: Math.round(avgConf * 20),
      completedAt:
        state.bookLab.reflections[state.bookLab.reflections.length - 1]
          ?.completedAt ?? now,
      skillId: "discipline",
    })
  }

  return out
}

function buildSkillScore(skillId: SkillId, attempts: ScoredAttempt[]): SkillScore {
  const skillAttempts = attempts.filter((a) => a.skillId === skillId)
  const score = weightedAvg(skillAttempts)
  const last = skillAttempts[skillAttempts.length - 1]?.completedAt ?? null
  return {
    id: skillId,
    label: SKILL_LABELS[skillId],
    category: SKILL_CATEGORIES[skillId],
    score,
    level: scoreToLevel(score),
    attemptCount: skillAttempts.length,
    chartsAnalysed: skillAttempts.length,
    lastPracticeAt: last,
    weekTrend: weekTrend(skillAttempts),
  }
}

function computeConfidenceAccuracy(state: UserState): number {
  const withConf: { confidence: number; score: number }[] = []

  for (const a of state.patternAttempts) {
    const conf = (a as StoredPatternAttempt & { confidence?: number }).confidence
    if (typeof conf === "number") {
      withConf.push({ confidence: conf, score: a.score })
    }
  }

  for (const a of state.executionAttempts) {
    if (a.confidence > 0) {
      withConf.push({ confidence: a.confidence, score: a.executionScore })
    }
  }

  if (withConf.length === 0) return 0

  let calibrationSum = 0
  for (const a of withConf) {
    const actual = a.score >= 70 ? 100 : 0
    calibrationSum += 100 - Math.abs(a.confidence - actual)
  }
  return Math.round(calibrationSum / withConf.length)
}

export function countChartsAnalysed(state: UserState): number {
  return (
    state.patternAttempts.length +
    state.drillSessions.length +
    state.trendSpotter.exerciseAttempts.length +
    state.trendSpotter.challengeAttempts.length +
    state.executionAttempts.length +
    state.simulator.attempts.filter(
      (a) => a.stageId === "chart-reading" || a.stageId === "support-resistance"
    ).length
  )
}

export function countReplaySessions(state: UserState): number {
  return (
    state.patternAttempts.filter((a) => a.widgetKind === "structure-replay")
      .length + state.simulator.attempts.length
  )
}

export function computeSkillProfile(state: UserState): SkillProfile {
  const attempts = collectAttempts(state)
  const skills = Object.fromEntries(
    ALL_SKILL_IDS.map((id) => [id, buildSkillScore(id, attempts)])
  ) as Record<SkillId, SkillScore>

  const categories: CategoryScore[] = CATEGORY_ORDER.map((catId) => {
    const catSkills = ALL_SKILL_IDS.filter(
      (id) => SKILL_CATEGORIES[id] === catId
    ).map((id) => skills[id])
    const scored = catSkills.filter((s) => s.score > 0)
    const score =
      scored.length > 0
        ? Math.round(scored.reduce((sum, s) => sum + s.score, 0) / scored.length)
        : 0
    return {
      id: catId,
      label: CATEGORY_LABELS[catId],
      score,
      level: scoreToLevel(score),
      skills: catSkills,
    }
  })

  const patternSkills = [
    skills["trend-detection"],
    skills.continuation,
    skills.reversal,
    skills["support-resistance"],
    skills["break-retest"],
    skills["replay-accuracy"],
    skills["decision-quality"],
  ].filter((s) => s.score > 0)

  const marketReadingScore =
    patternSkills.length > 0
      ? Math.round(
          patternSkills.reduce((sum, s) => sum + s.score, 0) / patternSkills.length
        )
      : 0

  const ranked = ALL_SKILL_IDS.map((id) => skills[id])
    .filter((s) => s.attemptCount > 0)
    .sort((a, b) => a.score - b.score)

  return {
    marketReadingScore,
    marketReadingLevel: scoreToLevel(marketReadingScore),
    confidenceAccuracy: computeConfidenceAccuracy(state),
    chartsAnalysed: countChartsAnalysed(state),
    replaySessions: countReplaySessions(state),
    categories,
    skills,
    weakestSkill: ranked[0]?.id ?? null,
    strongestSkill: ranked[ranked.length - 1]?.id ?? null,
    practiceStreak: state.progress.practiceStreak ?? 0,
    learningStreak: calculateDailyStreak(state),
  }
}

const DAILY_TRAINING_TEMPLATES: Record<
  SkillId,
  Omit<DailyTrainingItem, "completed">
> = {
  "trend-detection": {
    id: "dt-trend",
    label: "Trend Detective",
    description: "Label swings and classify trends",
    count: 5,
    href: "/paths/market-structure-mastery/lessons/higher-highs-and-higher-lows",
    skillId: "trend-detection",
    estimatedMinutes: 8,
  },
  reversal: {
    id: "dt-reversal",
    label: "Reversal Detection",
    description: "Spot pullbacks vs real reversals in Reversal Academy",
    count: 3,
    href: "/paths/market-behaviour-academy/lessons/pullback-vs-reversal",
    skillId: "reversal",
    estimatedMinutes: 8,
  },
  continuation: {
    id: "dt-continuation",
    label: "Continuation Predictor",
    description: "Predict continuation vs reversal before the next swing",
    count: 3,
    href: "/paths/market-behaviour-academy/lessons/continuation-trap",
    skillId: "continuation",
    estimatedMinutes: 6,
  },
  "support-resistance": {
    id: "dt-sr",
    label: "Support & Resistance",
    description: "Mark key levels on chart scenarios",
    count: 3,
    href: "/chart-lab/task-support-bounce",
    skillId: "support-resistance",
    estimatedMinutes: 10,
  },
  "break-retest": {
    id: "dt-br",
    label: "Break & Retest",
    description: "Identify breakout and retest setups",
    count: 2,
    href: "/chart-lab/task-break-retest",
    skillId: "break-retest",
    estimatedMinutes: 8,
  },
  liquidity: {
    id: "dt-liq",
    label: "Liquidity Zones",
    description: "Spot liquidity sweeps",
    count: 2,
    href: "/chart-lab",
    skillId: "liquidity",
    estimatedMinutes: 8,
  },
  "position-sizing": {
    id: "dt-risk",
    label: "Risk Calculation",
    description: "Calculate position size from risk %",
    count: 5,
    href: "/execution-lab",
    skillId: "position-sizing",
    estimatedMinutes: 10,
  },
  "stop-placement": {
    id: "dt-stop",
    label: "Stop Placement",
    description: "Place logical stop losses",
    count: 3,
    href: "/execution-lab",
    skillId: "stop-placement",
    estimatedMinutes: 8,
  },
  "risk-reward": {
    id: "dt-rr",
    label: "Risk/Reward",
    description: "Set targets with minimum 1:2 RR",
    count: 3,
    href: "/execution-lab",
    skillId: "risk-reward",
    estimatedMinutes: 8,
  },
  discipline: {
    id: "dt-discipline",
    label: "Psychology Reflection",
    description: "Reflect on a recent trading decision",
    count: 1,
    href: "/paths/trading-psychology/lessons/discipline-and-process",
    skillId: "discipline",
    estimatedMinutes: 5,
  },
  "confidence-calibration": {
    id: "dt-confidence",
    label: "Confidence Calibration",
    description: "Replay with confidence ratings",
    count: 3,
    href: "/paths/market-structure-mastery/lessons/structure-replay",
    skillId: "confidence-calibration",
    estimatedMinutes: 8,
  },
  "journal-quality": {
    id: "dt-journal",
    label: "Journal Review",
    description: "Review and tag a past trade",
    count: 1,
    href: "/journal",
    skillId: "journal-quality",
    estimatedMinutes: 8,
  },
  "market-context": {
    id: "dt-context",
    label: "Market Context",
    description: "Run the daily professional checklist",
    count: 1,
    href: "/paths/professional-forex-workflow/lessons/daily-checklist",
    skillId: "market-context",
    estimatedMinutes: 5,
  },
  "pair-selection": {
    id: "dt-pairs",
    label: "Pair Selection",
    description: "Build a focused watchlist",
    count: 1,
    href: "/paths/professional-forex-workflow/lessons/build-your-watchlist",
    skillId: "pair-selection",
    estimatedMinutes: 8,
  },
  "trade-or-skip": {
    id: "dt-skip",
    label: "Trade or Skip",
    description: "Decide if setups are worth taking",
    count: 3,
    href: "/strategy-wiki",
    skillId: "trade-or-skip",
    estimatedMinutes: 12,
  },
  "post-trade-review": {
    id: "dt-review",
    label: "Post-Trade Review",
    description: "Analyse a completed trade",
    count: 1,
    href: "/journal",
    skillId: "post-trade-review",
    estimatedMinutes: 8,
  },
  "replay-accuracy": {
    id: "dt-replay",
    label: "Structure Replay",
    description: "Read candles as they print",
    count: 3,
    href: "/paths/market-structure-mastery/lessons/structure-replay",
    skillId: "replay-accuracy",
    estimatedMinutes: 10,
  },
  "decision-quality": {
    id: "dt-decision",
    label: "Execution Lab",
    description: "Place entry, stop, and target on a live chart",
    count: 1,
    href: "/execution-lab",
    skillId: "decision-quality",
    estimatedMinutes: 15,
  },
}

export function getDailyTrainingPlan(state: UserState): DailyTrainingPlan {
  const profile = computeSkillProfile(state)
  const dateKey = getDateKey()
  const completedIds = new Set(
    state.dailyTraining?.dateKey === dateKey
      ? state.dailyTraining.completedItemIds
      : []
  )

  const prioritySkills: SkillId[] = []
  if (profile.weakestSkill) prioritySkills.push(profile.weakestSkill)

  const lowSkills = ALL_SKILL_IDS.filter(
    (id) => profile.skills[id].score > 0 && profile.skills[id].score < 70
  )
    .sort((a, b) => profile.skills[a].score - profile.skills[b].score)
    .slice(0, 2)
  for (const id of lowSkills) {
    if (!prioritySkills.includes(id)) prioritySkills.push(id)
  }

  if (prioritySkills.length === 0) {
    prioritySkills.push("trend-detection", "replay-accuracy", "position-sizing")
  }

  const defaultItems: SkillId[] = ["trend-detection", "replay-accuracy"]
  for (const id of defaultItems) {
    if (!prioritySkills.includes(id)) prioritySkills.push(id)
  }

  const uniqueSkills = [...new Set(prioritySkills)].slice(0, 4)
  const items: DailyTrainingItem[] = uniqueSkills.map((skillId) => {
    const template = DAILY_TRAINING_TEMPLATES[skillId]
    return {
      ...template,
      completed: completedIds.has(template.id),
    }
  })

  const estimatedMinutes = items.reduce((s, i) => s + i.estimatedMinutes, 0)
  const completedCount = items.filter((i) => i.completed).length

  return {
    dateKey,
    items,
    estimatedMinutes,
    completedCount,
    allComplete: completedCount === items.length && items.length > 0,
    bonusClaimed:
      state.dailyTraining?.dateKey === dateKey
        ? state.dailyTraining.bonusClaimed
        : false,
    bonusXp: 100,
  }
}

export function getAdaptiveRecommendations(
  state: UserState,
  limit = 3
): AdaptiveRecommendation[] {
  const profile = computeSkillProfile(state)
  const candidates = ALL_SKILL_IDS.map((id) => profile.skills[id])
    .filter((s) => s.attemptCount === 0 || s.score < 80)
    .sort((a, b) => {
      if (a.attemptCount === 0 && b.attemptCount > 0) return -1
      if (b.attemptCount === 0 && a.attemptCount > 0) return 1
      return a.score - b.score
    })

  return candidates.slice(0, limit).map((s, i) => ({
    skillId: s.id,
    label: SKILL_LABELS[s.id],
    reason:
      s.attemptCount === 0
        ? "Not practised yet — highest ROI starting point."
        : s.score < 60
          ? `Accuracy at ${s.score}% — targeted reps will move this fastest.`
          : `At ${s.score}% — sharpen before it becomes a blind spot.`,
    href: SKILL_PRACTICE_ROUTES[s.id],
    priority: limit - i,
  }))
}

const DAILY_CHALLENGE_POOL: Omit<DailyChallenge, "id" | "dateKey" | "completed">[] =
  [
    {
      title: "Read this trend",
      description: "Classify the trend on 3 Structure Replay drills.",
      href: "/paths/market-structure-mastery/lessons/structure-replay",
      skillId: "trend-detection",
      xpReward: 80,
    },
    {
      title: "Predict continuation",
      description: "Complete 3 Continuation Predictor exercises.",
      href: "/paths/market-structure-mastery/lessons/continuation-vs-reversal",
      skillId: "continuation",
      xpReward: 80,
    },
    {
      title: "Calculate position size",
      description: "Run 5 position sizing calculations.",
      href: "/paths/risk-management/lessons/position-sizing-basics",
      skillId: "position-sizing",
      xpReward: 60,
    },
    {
      title: "Spot the reversal",
      description: "Complete 2 Reversal Academy replay drills.",
      href: "/paths/market-behaviour-academy/lessons/pullback-vs-reversal",
      skillId: "reversal",
      xpReward: 80,
    },
    {
      title: "Complete workflow",
      description: "Run the professional daily checklist.",
      href: "/paths/professional-forex-workflow/lessons/daily-checklist",
      skillId: "market-context",
      xpReward: 50,
    },
  ]

export function getSkillDailyChallenge(state: UserState): DailyChallenge {
  const dateKey = getDateKey()
  const seed = dateKey.split("-").reduce((s, p) => s + Number(p), 0)
  const pick = DAILY_CHALLENGE_POOL[seed % DAILY_CHALLENGE_POOL.length]
  const todayAttempts = state.patternAttempts.filter(
    (a) => a.completedAt.slice(0, 10) === dateKey
  ).length
  const completed = todayAttempts >= 3

  return {
    id: `daily-challenge-${dateKey}`,
    dateKey,
    completed,
    ...pick,
  }
}

export function getPracticeDrillsFiltered(
  difficulty?: string
): typeof PRACTICE_DRILLS {
  if (!difficulty || difficulty === "all") return PRACTICE_DRILLS
  return PRACTICE_DRILLS.filter((d) => d.difficulty === difficulty)
}

export { PRACTICE_DRILLS }
