import {
  getAllDrills,
  getAllLessons,
  getAllQuizzes,
} from "@/content/registry"
import { getAllBooks, getAllLibraryConcepts } from "@/content/library"
import { SIMULATOR_STAGES } from "@/content/simulator/stages"

import { XP_REWARDS } from "./levels"

/**
 * Dynamic XP engine.
 *
 * Sums the total XP earnable from a full first pass of every learning asset on
 * the platform. Because it reads live content registries, adding a new book,
 * course, lesson, quiz, drill or simulator stage automatically raises the
 * budget — and therefore the rank ceiling — with no manual tuning.
 */

export interface PlatformXpBudget {
  /** XP from completing every lesson once. */
  lessonsXp: number
  /** XP from passing every quiz once. */
  quizzesXp: number
  /** XP from every chart drill once. */
  drillsXp: number
  /** XP from every library concept (read + quiz + practice). */
  libraryXp: number
  /** XP from book-completion bonuses. */
  bookBonusXp: number
  /** XP from every simulator stage. */
  simulatorXp: number
  /** Total earnable from one complete pass of all content. */
  contentTotal: number
  /**
   * Total XP target representing genuine mastery — content completion plus a
   * realistic amount of repetition (quiz retries, flashcards, challenges,
   * streaks). This anchors the top trader rank.
   */
  masteryTotal: number
}

/**
 * Multiplier applied to first-pass content XP to estimate the XP a genuinely
 * committed learner accrues through repetition, revision, challenges and
 * streaks on the road to mastery. Keeps the top rank challenging but reachable.
 */
const MASTERY_MULTIPLIER = 1.35

function sumXpReward(items: { xpReward?: number }[], fallback: number): number {
  return items.reduce((total, item) => total + (item.xpReward ?? fallback), 0)
}

let cached: PlatformXpBudget | null = null

export function computePlatformXpBudget(): PlatformXpBudget {
  if (cached) return cached

  const lessons = safe(() => getAllLessons(), [])
  const quizzes = safe(() => getAllQuizzes(), [])
  const drills = safe(() => getAllDrills(), [])
  const concepts = safe(() => getAllLibraryConcepts(), [])
  const books = safe(() => getAllBooks(), [])
  const stages = safe(() => SIMULATOR_STAGES, [])

  const lessonsXp = sumXpReward(lessons, XP_REWARDS.lessonComplete)
  const quizzesXp = sumXpReward(quizzes, XP_REWARDS.quizPassed)
  const drillsXp = drills.length * XP_REWARDS.chartExercise

  // Each concept can yield read XP, a quiz pass, and a practice drill.
  const perConcept =
    XP_REWARDS.bookConceptComplete +
    XP_REWARDS.quizPassed +
    XP_REWARDS.strategyPractice
  const libraryXp = concepts.length * perConcept
  const bookBonusXp = books.length * XP_REWARDS.bookComplete

  const simulatorXp = sumXpReward(
    stages as { xpReward?: number }[],
    XP_REWARDS.simulatorSession
  )

  const contentTotal =
    lessonsXp + quizzesXp + drillsXp + libraryXp + bookBonusXp + simulatorXp

  // Never let an empty/early catalog collapse the curve.
  const flooredContent = Math.max(contentTotal, 20_000)
  const masteryTotal = Math.round(flooredContent * MASTERY_MULTIPLIER)

  cached = {
    lessonsXp,
    quizzesXp,
    drillsXp,
    libraryXp,
    bookBonusXp,
    simulatorXp,
    contentTotal,
    masteryTotal,
  }
  return cached
}

/** Total earnable XP target that anchors the highest trader rank. */
export function getPlatformMasteryXp(): number {
  return computePlatformXpBudget().masteryTotal
}

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn() ?? fallback
  } catch {
    return fallback
  }
}
