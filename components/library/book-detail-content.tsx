"use client"

import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon, InfoIcon } from "lucide-react"

import { BookLabConceptCard } from "@/components/book-lab/concept-card"
import { WeeklyTargetWidget } from "@/components/habits/weekly-target-widget"
import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  LIBRARY_DISCLAIMER,
  getConceptHref,
  getLibrarySectionStats,
} from "@/content/library"
import type { LibraryBook } from "@/lib/book-lab/types"
import { cn } from "@/lib/utils"

interface BookDetailContentProps {
  book: LibraryBook
}

export function BookDetailContent({ book }: BookDetailContentProps) {
  const { libraryBookStats, isBookConceptDone, state } = useUserState()
  const stats = libraryBookStats[book.id]
  const completedIds = state.bookLab.completedConceptIds

  const allConcepts = book.sections.flatMap((s) => s.concepts)
  const continueConcept = stats.nextConceptSlug
    ? allConcepts.find((c) => c.slug === stats.nextConceptSlug)
    : allConcepts[0]

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          render={<Link href="/library" />}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Trading Library
        </Button>

        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-border/60 p-6 sm:p-8",
            "bg-gradient-to-br",
            book.coverGradient
          )}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-background/40 text-5xl ring-1 ring-white/10">
              {book.cover}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-[10px]">
                  {book.category}
                </Badge>
                <Badge variant="outline" className="text-[10px] capitalize">
                  {book.difficulty}
                </Badge>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {book.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                by {book.author} · {stats.totalConcepts} lessons · ~
                {book.estimatedHours}h
              </p>
              <p className="max-w-2xl text-sm text-muted-foreground">
                {book.description}
              </p>
            </div>
          </div>
        </div>

        {continueConcept && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <p className="text-sm font-medium text-primary">
              {stats.conceptsCompleted === 0
                ? "Start the book"
                : "Continue reading"}
            </p>
            <h2 className="mt-1 text-lg font-semibold">
              {continueConcept.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {continueConcept.summary}
            </p>
            <div className="mt-4">
              <Button render={<Link href={getConceptHref(continueConcept)} />}>
                {stats.conceptsCompleted === 0
                  ? "Start lesson"
                  : "Continue lesson"}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your progress</p>
              <p className="text-lg font-medium">
                {stats.conceptsCompleted} / {stats.totalConcepts} lessons
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.xpEarned} XP ·{" "}
                {stats.quizAverage > 0
                  ? `${stats.quizAverage}% quiz avg`
                  : "No quizzes yet"}
                {stats.notes > 0 ? ` · ${stats.notes} notes` : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-primary">
                {stats.progressPercent}%
              </p>
            </div>
          </div>
          <Progress value={stats.progressPercent} className="mt-4 h-2" />
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <WeeklyTargetWidget />
        </div>

        {book.sections.map((section) => {
          const sectionStats = getLibrarySectionStats(section, completedIds)
          return (
            <section key={section.id} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {sectionStats.completedCount}/{sectionStats.conceptCount} ·{" "}
                  {sectionStats.estimatedMinutes} min · {sectionStats.quizCount}{" "}
                  quizzes
                </p>
              </div>
              {sectionStats.completedCount > 0 && (
                <Progress value={sectionStats.progressPercent} className="h-1.5" />
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

        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground/70">
          <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
          {LIBRARY_DISCLAIMER}
        </p>
      </div>
    </AppShell>
  )
}
