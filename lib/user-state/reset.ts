import type { UserState } from "./types"
import {
  getInitialBookLabProgress,
  getInitialGamificationState,
  getInitialLearningMapState,
} from "./types"
import { getInitialFlashcardState } from "./flashcards"
import { getInitialTrendSpotterState } from "./trend-spotter"
import { getInitialStrategyWikiState } from "./strategy-wiki"
import { getInitialTraderReadinessState } from "@/lib/trader-readiness/types"
import { getInitialSimulatorState } from "@/lib/simulator/types"

function freshProgress() {
  return {
    level: 1,
    xp: 0,
    streak: 0,
    lastActivityDate: null,
    activePathId: null,
    completedSyllabusItems: [] as string[],
    pathProgress: {} as Record<string, number>,
  }
}

export type ResetSection =
  | "paths"
  | "book-lab"
  | "flashcards"
  | "trend-spotter"
  | "chart-lab"
  | "strategy-wiki"
  | "trader-readiness"
  | "simulator"
  | "journal"
  | "all"

export function resetSection(
  state: UserState,
  section: ResetSection
): UserState {
  if (section === "all") {
    return {
      progress: freshProgress(),
      lessonProgress: [],
      quizAttempts: [],
      drillSessions: [],
      journalEntries: [],
      earnedBadgeIds: [],
      bookLab: getInitialBookLabProgress(),
      activityLog: [],
      weeklyTarget: state.weeklyTarget,
      weeklyStreak: {
        streak: 0,
        activeDaysByWeek: {},
        lastEvaluatedWeekKey: null,
      },
      flashcards: getInitialFlashcardState(),
      trendSpotter: getInitialTrendSpotterState(),
      strategyWiki: getInitialStrategyWikiState(),
      learningMap: getInitialLearningMapState(),
      traderReadiness: getInitialTraderReadinessState(),
      liveTradingPhase: state.liveTradingPhase,
      simulator: getInitialSimulatorState(),
      gamification: getInitialGamificationState(),
    }
  }

  switch (section) {
    case "paths":
      return {
        ...state,
        lessonProgress: [],
        quizAttempts: [],
        progress: {
          ...state.progress,
          level: state.progress.level,
          xp: state.progress.xp,
          streak: state.progress.streak,
          lastActivityDate: state.progress.lastActivityDate,
          completedSyllabusItems: [],
          pathProgress: {},
          activePathId: null,
        },
        learningMap: getInitialLearningMapState(),
      }
    case "book-lab":
      return { ...state, bookLab: getInitialBookLabProgress() }
    case "flashcards":
      return { ...state, flashcards: getInitialFlashcardState() }
    case "trend-spotter":
      return { ...state, trendSpotter: getInitialTrendSpotterState() }
    case "chart-lab":
      return {
        ...state,
        drillSessions: state.drillSessions.filter(
          (d) => !d.drillType.startsWith("chart")
        ),
      }
    case "strategy-wiki":
      return { ...state, strategyWiki: getInitialStrategyWikiState() }
    case "trader-readiness":
      return { ...state, traderReadiness: getInitialTraderReadinessState() }
    case "simulator":
      return { ...state, simulator: getInitialSimulatorState() }
    case "journal":
      return { ...state, journalEntries: [] }
    default:
      return state
  }
}
