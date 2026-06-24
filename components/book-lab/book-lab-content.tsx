"use client"

import Link from "next/link"
import { ArrowRightIcon, BookMarkedIcon, InfoIcon } from "lucide-react"

import { WeeklyTargetWidget } from "@/components/habits/weekly-target-widget"
import { BookLabConceptCard } from "@/components/book-lab/concept-card"
import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BOOK_LAB_DISCLAIMER,
  getAllBookLabSections,
  getBookLabConcept,
  getBookLabSectionStats,
} from "@/content/book-lab"

export function BookLabContent() {
  const { bookLabStats, isBookConceptDone, state } = useUserState()
  const sections = getAllBookLabSections()
  const completedIds = state.bookLab.completedConceptIds
  const continueConcept = bookLabStats.nextConceptSlug
    ? getBookLabConcept(bookLabStats.nextConceptSlug)
    : getBookLabConcept("what-is-day-trading")
  const overallPercent =
    bookLabStats.totalConcepts > 0
      ? Math.round(
          (bookLabStats.conceptsCompleted / bookLabStats.totalConcepts) * 100
        )
      : 0

  const nextHref = bookLabStats.nextConceptSlug
    ? `/book-lab/${bookLabStats.nextConceptSlug}`
    : "/book-lab/what-is-day-trading"

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary">
            <BookMarkedIcon className="size-5" />
            <span className="text-sm font-medium">Book Lab</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Day Trading Book Lab
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Turn what you&apos;re reading into interactive lessons, chart examples,
            quizzes, and practice drills.
          </p>
          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground/70">
            <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
            {BOOK_LAB_DISCLAIMER}
          </p>
        </div>

        {continueConcept && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <p className="text-sm font-medium text-primary">Continue learning</p>
            <h2 className="mt-1 text-lg font-semibold">{continueConcept.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {continueConcept.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button render={<Link href={`/book-lab/${continueConcept.slug}`} />}>
                {bookLabStats.conceptsCompleted === 0
                  ? "Start concept"
                  : "Continue concept"}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              {continueConcept.chartPracticeId && (
                <Button
                  variant="outline"
                  render={
                    <Link href={`/book-lab/${continueConcept.slug}/practice`} />
                  }
                >
                  Practise on chart
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your progress</p>
              <p className="text-lg font-medium">
                {bookLabStats.conceptsCompleted} / {bookLabStats.totalConcepts}{" "}
                concepts
              </p>
              <p className="text-xs text-muted-foreground">
                {bookLabStats.bookLabXP} Book Lab XP ·{" "}
                {bookLabStats.practiceDrillsCompleted} drills ·{" "}
                {bookLabStats.quizAverage > 0
                  ? `${bookLabStats.quizAverage}% quiz avg`
                  : "No quizzes yet"}
              </p>
            </div>
            <Button render={<Link href={nextHref} />}>
              {bookLabStats.conceptsCompleted === 0
                ? "Start First Concept"
                : "Continue"}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
          <Progress value={overallPercent} className="mt-4 h-2" />
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <WeeklyTargetWidget />
        </div>

        {sections.map((section) => {
          const stats = getBookLabSectionStats(section, completedIds)
          return (
          <section key={section.id} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.completedCount}/{stats.conceptCount} · {stats.estimatedMinutes} min ·{" "}
                {stats.quizCount} quizzes · {stats.drillCount} drills
              </p>
            </div>
            {stats.completedCount > 0 && (
              <Progress value={stats.progressPercent} className="h-1.5" />
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.concepts.map((concept) => (
                <BookLabConceptCard
                  key={concept.id}
                  concept={concept}
                  done={isBookConceptDone(concept.id)}
                />
              ))}
            </div>
          </section>
          )
        })}
      </div>
    </AppShell>
  )
}
