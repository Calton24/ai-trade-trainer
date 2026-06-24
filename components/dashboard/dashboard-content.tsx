"use client"

import Link from "next/link"
import { ArrowRightIcon, BookOpenIcon, ClipboardListIcon, FlameIcon, LayersIcon, LockIcon, MapIcon, SparklesIcon, TrendingUpIcon } from "lucide-react"

import { WeeklyTargetWidget } from "@/components/habits/weekly-target-widget"
import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { ReadinessScoreCard } from "@/components/trader-readiness/readiness-score-card"
import { EmptyState } from "@/components/shared/empty-state"
import { StatCard } from "@/components/shared/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { badgeDefinitions } from "@/lib/mock/badges"
import {
  getLessonById,
  getPathBySlug,
} from "@/content/registry"
import { getLevelTitle, getXpProgressPercent } from "@/lib/user-state"

export function DashboardContent() {
  const {
    stats,
    state,
    pathProgress,
    hasBadge,
    bookLabStats,
    flashcardStats,
    trendSpotterStats,
    strategyWikiStats,
    globalSnapshot,
    learningMapStats,
    traderReadinessStats,
  } = useUserState()
  const xpPercent = getXpProgressPercent(state.progress)
  const activePath = stats.activePathId
    ? getPathBySlug(stats.activePathId)
    : null
  const nextItem = stats.nextSyllabusItemId
    ? getLessonById(stats.nextSyllabusItemId)
    : null
  const recommendedLesson = getLessonById(stats.recommendedLessonId)
  const recommendedHref = recommendedLesson
    ? `/paths/${getPathBySlug(recommendedLesson.pathId)?.slug ?? recommendedLesson.pathId}/lessons/${recommendedLesson.slug}`
    : "/paths/trading-foundations"
  const earnedBadges = badgeDefinitions.filter((b) => hasBadge(b.id))
  const isNewUser =
    state.lessonProgress.length === 0 &&
    state.quizAttempts.length === 0 &&
    state.drillSessions.length === 0 &&
    state.bookLab.completedConceptIds.length === 0 &&
    state.activityLog.length === 0

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {isNewUser ? "Welcome to TradeTrainer AI" : "Welcome back"}
            </h1>
            <p className="text-muted-foreground">{learningMapStats.nextActionReason}</p>
          </div>
          <Button render={<Link href={learningMapStats.nextActionHref} />}>
            {isNewUser ? "Start Stage 1" : learningMapStats.nextActionTitle}
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>

        <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/80 to-card/50 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <MapIcon className="size-4" />
                <span className="text-sm font-medium">
                  Stage {learningMapStats.currentStageOrder} of {learningMapStats.totalStages}
                </span>
              </div>
              <h2 className="text-xl font-semibold">
                {learningMapStats.currentStageTitle ?? "Market Basics"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Next: {learningMapStats.nextActionTitle}
              </p>
              {learningMapStats.nextLockedStageTitle && (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <LockIcon className="size-3 shrink-0" />
                  {learningMapStats.nextUnlockPreview ??
                    `Unlocks: ${learningMapStats.nextLockedStageTitle}`}
                </p>
              )}
              {!learningMapStats.foundationComplete && (
                <p className="text-xs text-muted-foreground">
                  Beginner Foundation: {learningMapStats.foundationProgressPercent}% complete
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button render={<Link href="/learning-map" />}>
                Open Learning Map
              </Button>
              <Button
                variant="outline"
                render={<Link href={learningMapStats.nextActionHref} />}
              >
                Continue
              </Button>
            </div>
          </div>
          {learningMapStats.recentlyUnlocked.length > 0 && (
            <div className="mt-4 border-t border-border/40 pt-4">
              <p className="text-xs font-medium text-muted-foreground">
                Recently unlocked
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {learningMapStats.recentlyUnlocked.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {!learningMapStats.foundationComplete && (
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <LockIcon className="size-3.5" />
              Complete Beginner Foundation to unlock Trend Spotter challenges, Chart Lab exercises, and Strategy Wiki practice.
            </div>
          )}
        </div>

        {isNewUser && (
          <EmptyState
            icon={MapIcon}
            title="Complete your first lesson or drill to start your streak"
            description="Choose a path lesson, Book Lab concept, or chart drill. Your daily streak and weekly target begin after your first real activity."
            action={
              <Button render={<Link href="/learning-map" />}>
                Open Learning Map
              </Button>
            }
          />
        )}

        {!isNewUser && (
          <ReadinessScoreCard stats={traderReadinessStats} compact />
        )}

        {!isNewUser && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-card/50 p-6">
              <p className="text-sm text-muted-foreground">Today&apos;s learning</p>
              <p className="mt-1 font-medium">
                {globalSnapshot.todayActivity.length > 0
                  ? `${globalSnapshot.todayActivity.length} activit${globalSnapshot.todayActivity.length === 1 ? "y" : "ies"} completed`
                  : "No activity yet today"}
              </p>
              {globalSnapshot.dailyStreak > 0 && (
                <p className="mt-1 text-xs text-primary">
                  {globalSnapshot.dailyStreak}-day streak
                </p>
              )}
              {globalSnapshot.todayActivity.length > 0 && (
                <ul className="mt-3 flex flex-col gap-1 border-t border-border/60 pt-3">
                  {globalSnapshot.todayActivity.slice(0, 4).map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center justify-between text-xs text-muted-foreground"
                    >
                      <span className="truncate pr-2">{a.title}</span>
                      <span className="shrink-0 capitalize">{a.source}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="rounded-xl border border-border/60 bg-card/50 p-6">
              <WeeklyTargetWidget />
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <SparklesIcon className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  Level {stats.level}
                </span>
              </div>
              <h2 className="text-xl font-semibold">
                {getLevelTitle(stats.level)}
              </h2>
              <p className="text-sm text-muted-foreground">
                {stats.xp} / {stats.xpForNextLevel} XP
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-4 py-2">
              <FlameIcon className="text-muted-foreground" />
              <span className="text-sm font-medium">
                {stats.streak > 0
                  ? `${stats.streak}-day streak`
                  : "No streak yet"}
              </span>
            </div>
          </div>
          <Progress value={xpPercent} className="mt-4 h-2" />
        </div>

        {activePath && state.progress.activePathId && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-2 text-primary">
              <MapIcon />
              <span className="text-sm font-medium">Active learning path</span>
            </div>
            <h3 className="mt-2 font-medium">{activePath.title}</h3>
            <Progress
              value={pathProgress(activePath.id)}
              className="mt-3 h-2"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {pathProgress(activePath.id)}% complete
              {nextItem && ` · Next: ${nextItem.title}`}
            </p>
            <Button
              className="mt-4"
              size="sm"
              render={<Link href={`/paths/${activePath.slug}`} />}
            >
              View Syllabus
            </Button>
          </div>
        )}

        {isNewUser ? null : (
        <div>
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            Explore zones — practice at your own pace
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-card/50 p-6">
              <div className="flex items-center gap-2 text-primary">
                <BookOpenIcon />
                <span className="text-sm font-medium">Book Lab</span>
              </div>
              {bookLabStats.conceptsCompleted === 0 ? (
                <>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Start your first book concept: What is Day Trading?
                  </p>
                  <Button
                    className="mt-4"
                    size="sm"
                    render={<Link href="/book-lab/what-is-day-trading" />}
                  >
                    Open Book Lab
                    <ArrowRightIcon data-icon="inline-end" />
                  </Button>
                </>
              ) : (
                <>
                  <p className="mt-2 font-medium">
                    {bookLabStats.conceptsCompleted} / {bookLabStats.totalConcepts}{" "}
                    concepts completed
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Section: {bookLabStats.currentSectionTitle}
                    {bookLabStats.quizAverage > 0 &&
                      ` · Quiz avg ${bookLabStats.quizAverage}%`}
                  </p>
                  <Button
                    className="mt-4"
                    size="sm"
                    variant="outline"
                    render={
                      <Link
                        href={`/book-lab/${bookLabStats.nextConceptSlug ?? "what-is-day-trading"}`}
                      />
                    }
                  >
                    Continue Book Lab
                  </Button>
                </>
              )}
            </div>

            <div className="rounded-xl border border-border/60 bg-card/50 p-6">
              <div className="flex items-center gap-2 text-primary">
                <TrendingUpIcon />
                <span className="text-sm font-medium">Trend Spotter</span>
              </div>
              {trendSpotterStats.lessonsCompleted === 0 ? (
                <>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Unlocks fully after Trend Detection basics on the Learning Map.
                  </p>
                  <Button
                    className="mt-4"
                    size="sm"
                    render={<Link href="/trend-spotter" />}
                  >
                    Preview Trend Spotter
                  </Button>
                </>
              ) : (
                <>
                  <p className="mt-2 font-medium">
                    {trendSpotterStats.lessonsCompleted}/{trendSpotterStats.totalLessons} lessons
                  </p>
                  <Button
                    className="mt-4"
                    size="sm"
                    variant="outline"
                    render={<Link href="/trend-spotter" />}
                  >
                    Continue
                  </Button>
                </>
              )}
            </div>

            <div className="rounded-xl border border-border/60 bg-card/50 p-6">
              <div className="flex items-center gap-2 text-primary">
                <ClipboardListIcon />
                <span className="text-sm font-medium">Strategy Wiki</span>
              </div>
              {strategyWikiStats.strategiesStarted === 0 ? (
                <>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Browse strategies — practice unlocks after Support & Resistance.
                  </p>
                  <Button
                    className="mt-4"
                    size="sm"
                    render={<Link href="/strategy-wiki" />}
                  >
                    Browse Strategies
                  </Button>
                </>
              ) : (
                <>
                  <p className="mt-2 font-medium">
                    {strategyWikiStats.practiceSessions} practice sessions
                  </p>
                  <Button
                    className="mt-4"
                    size="sm"
                    variant="outline"
                    render={<Link href="/strategy-wiki" />}
                  >
                    Continue
                  </Button>
                </>
              )}
            </div>

            <div className="rounded-xl border border-border/60 bg-card/50 p-6">
              <div className="flex items-center gap-2 text-primary">
                <LayersIcon />
                <span className="text-sm font-medium">Flashcards</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Starter decks always available — advanced decks unlock with progress.
              </p>
              <Button
                className="mt-4"
                size="sm"
                render={<Link href="/flashcards/session?mode=game10" />}
              >
                10-card review
              </Button>
            </div>
          </div>
        </div>
        )}

        {!isNewUser && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Lessons Completed"
            value={`${stats.lessonsCompleted}/${stats.totalLessons}`}
            subtext="Across all paths"
            trend={stats.lessonsCompleted > 0 ? "up" : "neutral"}
          />
          <StatCard
            label="Quizzes Completed"
            value={String(stats.quizzesCompleted)}
            subtext={
              stats.quizzesCompleted > 0
                ? `${stats.quizAverageScore}% avg score`
                : "No quizzes yet"
            }
            trend={stats.quizzesCompleted > 0 ? "up" : "neutral"}
          />
          <StatCard
            label="Drills Completed"
            value={String(stats.drillsCompleted)}
            subtext={
              stats.drillsCompleted > 0
                ? `${stats.accuracy}% avg score`
                : "No drills yet"
            }
            trend={stats.drillsCompleted > 0 ? "up" : "neutral"}
          />
          <StatCard
            label="Weakest Skill"
            value={
              stats.drillsCompleted > 0 ? stats.weakestSkill || "—" : "—"
            }
            subtext={
              stats.drillsCompleted > 0 ? "Focus area" : "Complete drills to see"
            }
            trend="neutral"
          />
        </div>
        )}

        {!isNewUser && (
        <div className="grid gap-6 lg:grid-cols-2">
          {flashcardStats.totalReviewed === 0 ? (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-2 text-primary">
                <LayersIcon className="size-4" />
                <p className="text-sm font-medium">Recommended: Flashcards</p>
              </div>
              <h3 className="mt-2 font-medium">Start your first 10-card review</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Quick rounds help trading concepts stick between lessons.
              </p>
              <Button className="mt-4" render={<Link href="/flashcards/session?mode=game10" />}>
                Start 10-card review
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </div>
          ) : (
            recommendedLesson && (
              <div className="rounded-xl border border-border/60 bg-card/50 p-6">
                <p className="text-sm font-medium text-primary">
                  {stats.lessonsCompleted === 0
                    ? "Recommended first lesson"
                    : "Recommended lesson"}
                </p>
                <h3 className="mt-2 font-medium">{recommendedLesson.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {recommendedLesson.description}
                </p>
                <Button className="mt-4" render={<Link href={recommendedHref} />}>
                  Start Lesson
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </div>
            )
          )}

          {flashcardStats.dueCount > 0 && flashcardStats.totalReviewed > 0 && (
            <div className="rounded-xl border border-border/60 bg-card/50 p-6">
              <p className="text-sm font-medium text-primary">Due for review</p>
              <h3 className="mt-2 font-medium">
                {flashcardStats.dueCount} flashcard
                {flashcardStats.dueCount === 1 ? "" : "s"} due today
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Spaced repetition keeps concepts fresh.
              </p>
              <Button className="mt-4" render={<Link href="/flashcards/session?mode=game10" />}>
                Review now
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </div>
          )}

          {!(flashcardStats.dueCount > 0 && flashcardStats.totalReviewed > 0) &&
            recommendedLesson &&
            flashcardStats.totalReviewed > 0 && (
              <div className="rounded-xl border border-border/60 bg-card/50 p-6">
                <p className="text-sm font-medium text-primary">
                  Recommended lesson
                </p>
                <h3 className="mt-2 font-medium">{recommendedLesson.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {recommendedLesson.description}
                </p>
                <Button className="mt-4" render={<Link href={recommendedHref} />}>
                  Start Lesson
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </div>
            )}

          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <h2 className="font-medium">Quick Actions</h2>
            <div className="mt-4 flex flex-col gap-2">
              <Button
                variant="outline"
                className="justify-start"
                render={<Link href="/training" />}
              >
                Start a chart drill
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                render={<Link href="/quizzes" />}
              >
                Take a quiz
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                render={<Link href="/chart-lab" />}
              >
                Open Chart Lab
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                render={<Link href="/book-lab" />}
              >
                <BookOpenIcon data-icon="inline-start" />
                Open Book Lab
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                render={<Link href="/flashcards" />}
              >
                <LayersIcon data-icon="inline-start" />
                Review flashcards
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                render={<Link href="/learn" />}
              >
                Browse lesson library
              </Button>
            </div>
          </div>
        </div>
        )}

        {earnedBadges.length > 0 ? (
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <h2 className="font-medium">Your Badges</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {earnedBadges.map((badge) => (
                <Badge
                  key={badge.id}
                  variant="secondary"
                  className="border-primary/20 bg-primary/10 px-3 py-1.5 text-primary"
                >
                  {badge.icon} {badge.name}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/60 bg-card/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No badges earned yet. Complete lessons and drills to unlock your
              first badge.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
