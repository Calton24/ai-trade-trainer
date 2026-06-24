"use client"

import Link from "next/link"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookMarkedIcon,
  CheckCircle2Icon,
  InfoIcon,
  LayersIcon,
} from "lucide-react"

import { BookLabInlineReflection } from "@/components/book-lab/inline-reflection"
import { BookLabMiniQuiz } from "@/components/book-lab/mini-quiz"
import { ChartLab } from "@/components/chart-lab/chart-lab"
import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BOOK_LAB_DISCLAIMER,
  getBookLabSectionForConcept,
  getRelatedBookLabConcepts,
} from "@/content/book-lab"
import type { BookLabConcept } from "@/lib/book-lab/types"
import { cn } from "@/lib/utils"

interface ConceptDetailContentProps {
  concept: BookLabConcept
}

export function ConceptDetailContent({ concept }: ConceptDetailContentProps) {
  const { isBookConceptDone, markBookConceptComplete } = useUserState()
  const section = getBookLabSectionForConcept(concept)
  const related = getRelatedBookLabConcepts(concept)
  const done = isBookConceptDone(concept.id)

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit"
            render={<Link href="/book-lab" />}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            Book Lab
          </Button>
          <div className="flex items-center gap-2 text-primary">
            <BookMarkedIcon className="size-4" />
            <span className="text-sm font-medium">
              {section?.title ?? "Book Lab"}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {concept.title}
          </h1>
          <p className="text-muted-foreground">{concept.summary}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">
              {concept.difficulty}
            </Badge>
            <Badge variant="secondary">{concept.estimatedMinutes} min</Badge>
            {done && (
              <Badge className="border-primary/20 bg-primary/10 text-primary">
                <CheckCircle2Icon className="size-3" />
                Completed
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              "Read",
              concept.chartDemoId && "See chart",
              concept.quizQuestions.length > 0 && "Quiz",
              (concept.chartPracticeId || concept.practiceDrill) && "Practise",
              "Reflect",
            ]
              .filter((l): l is string => Boolean(l))
              .map((label) => (
                <Badge key={label} variant="outline" className="text-[10px]">
                  {label}
                </Badge>
              ))}
          </div>
        </div>

        {concept.contentBlocks.map((block, i) => (
          <div
            key={i}
            className={cn(
              "rounded-xl border p-5",
              block.type === "key-idea" || block.variant === "idea"
                ? "border-primary/20 bg-primary/5"
                : block.variant === "mistake"
                  ? "border-destructive/20 bg-destructive/5"
                  : "border-border/60 bg-card/50"
            )}
          >
            {block.heading && (
              <p
                className={cn(
                  "text-sm font-medium",
                  block.type === "key-idea" || block.variant === "idea"
                    ? "text-primary"
                    : block.variant === "mistake"
                      ? "text-destructive"
                      : "text-primary"
                )}
              >
                {block.heading}
              </p>
            )}
            <p
              className={cn(
                "mt-2 text-sm leading-relaxed",
                block.variant === "idea"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {block.content}
            </p>
          </div>
        ))}

        {concept.chartDemoId && (
          <section className="flex flex-col gap-3">
            <p className="text-sm font-medium text-primary">See it on a chart</p>
            <ChartLab
              scenarioId={concept.chartDemoId}
              caption="Synthetic educational example — not live market data."
            />
          </section>
        )}

        {concept.chartPracticeId && (
          <section className="flex flex-col gap-3">
            <p className="text-sm font-medium text-primary">Practise on a chart</p>
            <p className="text-sm text-muted-foreground">
              Mark the structure or trade levels the concept describes, then
              submit for instant feedback.
            </p>
            <ChartLab
              scenarioId={concept.chartPracticeId}
              caption="Interactive task — synthetic chart, not live data."
              trackProgress
            />
          </section>
        )}

        <section className="flex flex-col gap-3">
          <p className="text-sm font-medium text-primary">Quick check</p>
          <BookLabMiniQuiz concept={concept} />
          {concept.quizQuestions.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              className="w-fit"
              render={<Link href={`/book-lab/${concept.slug}/quiz`} />}
            >
              Full quiz
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <p className="text-sm font-medium text-primary">Practise</p>
          <div className="flex flex-wrap gap-2">
            <Button render={<Link href={`/book-lab/${concept.slug}/practice`} />}>
              Open practice drill
            </Button>
            {concept.chartPracticeId && (
              <Button
                variant="outline"
                render={<Link href={`/chart-lab/${concept.chartPracticeId}`} />}
              >
                Chart Lab exercise
              </Button>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <p className="text-sm font-medium text-primary">Reflect</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {concept.reflectionPrompt}
          </p>
          <div className="mt-4">
            <BookLabInlineReflection concept={concept} />
          </div>
        </section>

        {related.length > 0 && (
          <section className="flex flex-col gap-3">
            <p className="text-sm font-medium">Related concepts</p>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Button
                  key={r.id}
                  size="sm"
                  variant="outline"
                  render={<Link href={`/book-lab/${r.slug}`} />}
                >
                  {r.title}
                </Button>
              ))}
            </div>
          </section>
        )}

        {done && (
          <div className="rounded-xl border border-border/60 bg-card/50 p-5">
            <div className="flex items-center gap-2 text-primary">
              <LayersIcon className="size-4" />
              <p className="text-sm font-medium">Review this concept</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Reinforce what you learned with a 10-card flashcard round.
            </p>
            <Button
              className="mt-3"
              size="sm"
              render={<Link href="/flashcards/session?deck=book-lab" />}
            >
              Review 10 flashcards
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
        )}

        {!done && (
          <Button onClick={() => markBookConceptComplete(concept.id)}>
            Mark concept complete
          </Button>
        )}

        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground/70">
          <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
          {BOOK_LAB_DISCLAIMER}
        </p>
      </div>
    </AppShell>
  )
}
