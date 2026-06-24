import { FOUNDATION_NODE_IDS } from "@/content/learning-map/foundation"
import { LEARNING_STAGES } from "@/content/learning-map/stages"
import { getNodeById, LEARNING_NODES, NODE_BY_ID } from "@/content/learning-map/nodes"
import {
  FEATURE_BY_ID,
  getLockedMessage,
} from "@/content/learning-map/unlock-rules"
import { getChartLabScore } from "@/lib/charts/storage"
import type {
  AccessLevel,
  LearningMapStats,
  LockInfo,
  StageProgress,
  StoredLearningMapState,
} from "@/lib/learning-map/types"
import { isBookConceptCompleted } from "@/lib/user-state/book-lab"
import { isLessonCompleted } from "@/lib/user-state/index"
import { isTrendLessonCompleted } from "@/lib/user-state/trend-spotter"
import type { UserState } from "@/lib/user-state/types"

function chartScenarioComplete(scenarioId: string, minScore = 60): boolean {
  const score = getChartLabScore(scenarioId)
  return score !== null && score >= minScore
}

export function isNodeComplete(state: UserState, nodeId: string): boolean {
  if (state.learningMap.manuallyCompletedNodes.includes(nodeId)) return true

  const node = getNodeById(nodeId)
  if (!node) return false

  switch (node.type) {
    case "lesson":
    case "quiz":
      return isLessonCompleted(state, node.refId!)
    case "chart-drill":
      if (node.refId?.startsWith("tf-")) {
        return isLessonCompleted(state, node.refId)
      }
      return chartScenarioComplete(node.refId!)
    case "trend-lesson":
      return isTrendLessonCompleted(state, node.refId!)
    case "book-concept":
      return isBookConceptCompleted(state, node.refId!)
    case "journal":
      return state.journalEntries.length > 0
    case "strategy": {
      const slug = node.refId!
      if (slug.endsWith("-practice")) {
        const baseSlug = slug.replace(/-practice$/, "")
        const attempts = state.strategyWiki.practiceAttempts.filter(
          (a) => a.strategyId === baseSlug
        )
        return attempts.length > 0
      }
      const rec = state.strategyWiki.strategyProgress[slug]
      return Boolean(rec && (rec.lessonsCompleted > 0 || rec.practiceAttempts > 0))
    }
    case "flashcard-deck": {
      const deckSlug = node.href.split("deck=")[1]?.split("&")[0]
      if (!deckSlug) return false
      const deckId = `deck-${deckSlug}`
      return state.flashcards.sessions.some((s) => s.deckId === deckId)
    }
    case "challenge": {
      if (node.refId === "trend-10-chart") {
        return state.trendSpotter.challengeAttempts.length > 0
      }
      if (node.refId === "strategy-challenge") {
        return state.strategyWiki.challengeAttempts.length > 0
      }
      if (node.refId === "strategy-challenge-advanced") {
        return state.strategyWiki.challengeAttempts.some(
          (a) => a.hitRate >= 70 || (a.total > 0 && (a.score / a.total) * 100 >= 70)
        )
      }
      return false
    }
    default:
      return false
  }
}

export function areNodesComplete(state: UserState, nodeIds: string[]): boolean {
  return nodeIds.every((id) => isNodeComplete(state, id))
}

export function getFoundationProgress(state: UserState): {
  complete: boolean
  completedCount: number
  total: number
  progressPercent: number
} {
  const total = FOUNDATION_NODE_IDS.length
  const completedCount = FOUNDATION_NODE_IDS.filter((id) =>
    isNodeComplete(state, id)
  ).length
  return {
    complete: completedCount === total,
    completedCount,
    total,
    progressPercent: Math.round((completedCount / total) * 100),
  }
}

export function isStageCompleted(state: UserState, stageId: string): boolean {
  const stage = LEARNING_STAGES.find((s) => s.id === stageId)
  if (!stage) return false
  return stage.requiredNodeIds.every((id) => isNodeComplete(state, id))
}

export function isStageUnlocked(state: UserState, stageId: string): boolean {
  const stage = LEARNING_STAGES.find((s) => s.id === stageId)
  if (!stage) return false
  if (stage.order === 1) return true

  const prevStage = LEARNING_STAGES.find((s) => s.order === stage.order - 1)
  if (prevStage && isStageCompleted(state, prevStage.id)) return true

  if (stage.prerequisiteStageIds.length > 0) {
    return stage.prerequisiteStageIds.every((id) => isStageCompleted(state, id))
  }

  return false
}

export function getStageProgress(state: UserState, stageId: string): StageProgress {
  const stage = LEARNING_STAGES.find((s) => s.id === stageId)!
  const totalRequired = stage.requiredNodeIds.length
  const completedCount = stage.requiredNodeIds.filter((id) =>
    isNodeComplete(state, id)
  ).length
  const progressPercent =
    totalRequired > 0 ? Math.round((completedCount / totalRequired) * 100) : 0

  let status: StageProgress["status"] = "locked"
  let accessLevel: AccessLevel = "locked"

  if (isStageCompleted(state, stageId)) {
    status = "completed"
    accessLevel = "unlocked"
  } else if (isStageUnlocked(state, stageId)) {
    status = completedCount > 0 ? "in_progress" : "unlocked"
    accessLevel = "unlocked"
  } else if (
    stage.prerequisiteStageIds.some((id) => isStageUnlocked(state, id)) ||
    stage.requiredNodeIds.some((id) => {
      const node = getNodeById(id)
      return node && node.prerequisites.some((p) => isNodeComplete(state, p))
    })
  ) {
    accessLevel = "preview"
  }

  return {
    stageId,
    completedCount,
    totalRequired,
    progressPercent,
    status,
    accessLevel,
  }
}

export function getAllStageProgress(state: UserState): StageProgress[] {
  return LEARNING_STAGES.map((s) => getStageProgress(state, s.id))
}

export function getCurrentStageId(state: UserState): string | null {
  const inProgress = LEARNING_STAGES.find((s) => {
    const p = getStageProgress(state, s.id)
    return p.status === "in_progress" || p.status === "unlocked"
  })
  if (inProgress) return inProgress.id

  const firstIncomplete = LEARNING_STAGES.find(
    (s) => !isStageCompleted(state, s.id)
  )
  return firstIncomplete?.id ?? LEARNING_STAGES[LEARNING_STAGES.length - 1]?.id ?? null
}

export function getNodeAccessLevel(state: UserState, nodeId: string): AccessLevel {
  const node = getNodeById(nodeId)
  if (!node) return "locked"
  if (isNodeComplete(state, nodeId)) return "unlocked"

  const prereqsMet = node.prerequisites.every((p) => isNodeComplete(state, p))
  if (prereqsMet) return "unlocked"

  const somePrereqMet = node.prerequisites.some((p) => isNodeComplete(state, p))
  if (somePrereqMet || node.previewHref) return "preview"

  return "locked"
}

export function getLockInfo(state: UserState, nodeId: string): LockInfo {
  const node = getNodeById(nodeId)
  if (!node) {
    return {
      accessLevel: "locked",
      reason: "This content is not available.",
      missingPrerequisites: [],
    }
  }

  const accessLevel = getNodeAccessLevel(state, nodeId)
  if (accessLevel === "unlocked") {
    return { accessLevel, reason: "", missingPrerequisites: [] }
  }

  const missingPrerequisites = node.prerequisites
    .filter((p) => !isNodeComplete(state, p))
    .map((p) => {
      const prereq = NODE_BY_ID[p]
      return {
        id: p,
        title: prereq?.title ?? p,
        href: prereq?.href ?? "/learning-map",
      }
    })

  const firstMissing = missingPrerequisites[0]

  return {
    accessLevel,
    reason: getLockedMessage(nodeId),
    missingPrerequisites,
    previewHref: node.previewHref ?? node.href,
    ctaHref: firstMissing?.href ?? "/learning-map",
  }
}

export function getFeatureAccess(
  state: UserState,
  featureId: string
): AccessLevel {
  const rule = FEATURE_BY_ID[featureId]
  if (!rule) return "unlocked"
  if (rule.requiredNodeIds.length === 0) return "unlocked"
  if (areNodesComplete(state, rule.requiredNodeIds)) return "unlocked"
  if (
    rule.previewNodeIds &&
    rule.previewNodeIds.some((id) => isNodeComplete(state, id))
  ) {
    return "preview"
  }
  return "locked"
}

export function getRecommendedNextAction(state: UserState): {
  title: string
  href: string
  reason: string
  nodeId?: string
  stageId?: string
} {
  const hasActivity =
    state.lessonProgress.length > 0 ||
    state.activityLog.length > 0 ||
    state.trendSpotter.completedLessonIds.length > 0

  if (!hasActivity) {
    const first = LEARNING_NODES[0]
    return {
      title: first.title,
      href: first.href,
      reason: "Start Stage 1 — your guided journey begins here.",
      nodeId: first.id,
      stageId: "stage-market-basics",
    }
  }

  const currentStageId = getCurrentStageId(state)
  const stage = LEARNING_STAGES.find((s) => s.id === currentStageId)

  if (stage) {
    const nextNodeId = stage.requiredNodeIds.find(
      (id) => !isNodeComplete(state, id)
    )
    if (nextNodeId) {
      const node = getNodeById(nextNodeId)!
      const access = getNodeAccessLevel(state, nextNodeId)
      if (access !== "locked") {
        return {
          title: node.title,
          href: node.href,
          reason: `Stage ${stage.order} of 12 — continue ${stage.title}`,
          nodeId: nextNodeId,
          stageId: stage.id,
        }
      }
    }
  }

  const failedQuiz = state.quizAttempts.find((q) => !q.passed)
  if (failedQuiz) {
    return {
      title: "Review with flashcards",
      href: "/flashcards",
      reason: "Reinforce concepts from your last quiz attempt.",
    }
  }

  const lowDrill = state.drillSessions.find((d) => d.score < 60)
  if (lowDrill) {
    return {
      title: "Trend Spotter practice",
      href: "/trend-spotter",
      reason: "Build chart-reading confidence before moving on.",
    }
  }

  const foundation = getFoundationProgress(state)
  if (!foundation.complete) {
    const nextFoundation = FOUNDATION_NODE_IDS.find(
      (id) => !isNodeComplete(state, id)
    )
    if (nextFoundation) {
      const node = getNodeById(nextFoundation)!
      return {
        title: node.title,
        href: node.href,
        reason: `Beginner Foundation — ${foundation.completedCount}/${foundation.total} complete`,
        nodeId: nextFoundation,
      }
    }
  }

  const weekly = state.weeklyTarget
  if (weekly.daysPerWeek !== null) {
    const weekKey = getWeekKey(new Date())
    const activeDays = state.weeklyStreak.activeDaysByWeek[weekKey] ?? []
    if (activeDays.length < weekly.daysPerWeek) {
      return {
        title: "10-card flashcard review",
        href: "/flashcards/session",
        reason: "Quick session to stay on track for your weekly target.",
      }
    }
  }

  return {
    title: "Open Learning Map",
    href: "/learning-map",
    reason: "See your full guided path and what unlocks next.",
    stageId: currentStageId ?? undefined,
  }
}

function getWeekKey(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  )
  return `${d.getFullYear()}-W${week}`
}

export function computeLearningMapStats(state: UserState): LearningMapStats {
  const foundation = getFoundationProgress(state)
  const currentStageId = getCurrentStageId(state)
  const currentStage = LEARNING_STAGES.find((s) => s.id === currentStageId)
  const stagesCompleted = LEARNING_STAGES.filter((s) =>
    isStageCompleted(state, s.id)
  ).length
  const next = getRecommendedNextAction(state)

  const recentlyUnlocked: string[] = []
  for (const stage of LEARNING_STAGES) {
    if (isStageUnlocked(state, stage.id) && !isStageCompleted(state, stage.id)) {
      for (const fid of stage.unlockFeatureIds) {
        const rule = FEATURE_BY_ID[fid]
        if (rule && getFeatureAccess(state, fid) === "unlocked") {
          recentlyUnlocked.push(rule.title)
        }
      }
    }
  }

  const nextLockedStage = LEARNING_STAGES.find(
    (s) => !isStageUnlocked(state, s.id) && !isStageCompleted(state, s.id)
  )
  const nextUnlockPreview =
    nextLockedStage && currentStage
      ? `Complete ${currentStage.title} to unlock ${nextLockedStage.title}`
      : nextLockedStage
        ? `Unlocks after: ${nextLockedStage.prerequisiteStageIds
            .map((id) => LEARNING_STAGES.find((s) => s.id === id)?.title)
            .filter(Boolean)
            .join(", ") || "earlier stages"}`
        : null

  return {
    currentStageId,
    currentStageTitle: currentStage?.title ?? null,
    currentStageOrder: currentStage?.order ?? 1,
    totalStages: LEARNING_STAGES.length,
    stagesCompleted,
    foundationComplete: foundation.complete,
    foundationProgressPercent: foundation.progressPercent,
    nextActionTitle: next.title,
    nextActionHref: next.href,
    nextActionReason: next.reason,
    nextLockedStageTitle: nextLockedStage?.title ?? null,
    nextUnlockPreview,
    recentlyUnlocked: recentlyUnlocked.slice(0, 4),
  }
}

export function shouldCelebrateFoundation(
  state: UserState,
  learningMap: StoredLearningMapState
): boolean {
  return getFoundationProgress(state).complete && !learningMap.foundationCelebrated
}

export function markFoundationCelebrated(
  state: UserState
): UserState {
  return {
    ...state,
    learningMap: {
      ...state.learningMap,
      foundationCelebrated: true,
    },
  }
}

export {
  LEARNING_STAGES,
  LEARNING_NODES,
  FOUNDATION_NODE_IDS,
  FEATURE_BY_ID,
}
