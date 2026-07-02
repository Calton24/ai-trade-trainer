import type { UserState } from "@/lib/user-state/types"
import { resetSection, type ResetSection } from "@/lib/user-state/reset"

export interface ArchiveSlice {
  section: ResetSection
  state: Partial<UserState>
  archivedAt: string
}

/** Sections where behavioral history must survive a reset. */
const BEHAVIORAL_KEYS: (keyof UserState)[] = [
  "activityLog",
  "journalEntries",
  "earnedBadgeIds",
]

function sliceForSection(
  state: UserState,
  section: ResetSection
): Partial<UserState> {
  switch (section) {
    case "book-lab":
      return { bookLab: state.bookLab }
    case "flashcards":
      return { flashcards: state.flashcards }
    case "trend-spotter":
      return { trendSpotter: state.trendSpotter }
    case "chart-lab":
      return {
        drillSessions: state.drillSessions,
      }
    case "strategy-wiki":
      return { strategyWiki: state.strategyWiki }
    case "trader-readiness":
      return { traderReadiness: state.traderReadiness }
    case "simulator":
      return { simulator: state.simulator }
    case "all":
      return {
        lessonProgress: state.lessonProgress,
        quizAttempts: state.quizAttempts,
        drillSessions: state.drillSessions,
        bookLab: state.bookLab,
        flashcards: state.flashcards,
        trendSpotter: state.trendSpotter,
        strategyWiki: state.strategyWiki,
        traderReadiness: state.traderReadiness,
        learningMap: state.learningMap,
        progress: state.progress,
        simulator: state.simulator,
      }
    default:
      return {}
  }
}

/**
 * Reset learning progress while preserving behavioural history
 * (activity log, journals, badges, assessment archives).
 */
export function resetWithArchive(
  state: UserState,
  section: ResetSection
): { next: UserState; archive: ArchiveSlice } {
  const archive: ArchiveSlice = {
    section,
    state: sliceForSection(state, section),
    archivedAt: new Date().toISOString(),
  }

  const behavioral = Object.fromEntries(
    BEHAVIORAL_KEYS.map((key) => [key, state[key]])
  ) as Pick<UserState, (typeof BEHAVIORAL_KEYS)[number]>

  let next = resetSection(state, section)

  if (section === "all") {
    // Full reset clears learning but NEVER behavioural history
    next = {
      ...next,
      ...behavioral,
      weeklyTarget: state.weeklyTarget,
      weeklyStreak: state.weeklyStreak,
      liveTradingPhase: state.liveTradingPhase,
    }
  } else if (section === "trader-readiness") {
    // Keep assessment attempt history for competence trending
    next = {
      ...next,
      traderReadiness: {
        ...next.traderReadiness,
        assessmentAttempts: state.traderReadiness.assessmentAttempts,
      },
    }
  }

  return { next, archive }
}
