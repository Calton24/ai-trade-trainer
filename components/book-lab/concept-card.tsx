"use client"

import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { useUserState } from "@/components/providers/user-state-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getConceptHref, getSectionForConcept } from "@/content/library"
import type { BookLabConcept } from "@/lib/book-lab/types"

interface BookLabConceptCardProps {
  concept: BookLabConcept
  done: boolean
}

export function BookLabConceptCard({ concept, done }: BookLabConceptCardProps) {
  const { state } = useUserState()
  const section = getSectionForConcept(concept)
  const quizCount = concept.quizQuestions.length
  const hasChart = Boolean(concept.chartDemoId)
  const hasPractice = Boolean(concept.practiceDrill || concept.chartPracticeId)

  const hasActivity =
    state.bookLab.quizAttempts.some((a) => a.conceptId === concept.id) ||
    state.bookLab.practiceDrills.some((d) => d.conceptId === concept.id) ||
    state.bookLab.reflections.some((r) => r.conceptId === concept.id)

  const ctaLabel = done ? "Review" : hasActivity ? "Continue" : "Start Concept"

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/50 p-5 ring-1 ring-white/[0.02]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-[10px]">
            Read
          </Badge>
          {hasChart && (
            <Badge variant="secondary" className="text-[10px]">
              Chart
            </Badge>
          )}
          {quizCount > 0 && (
            <Badge variant="secondary" className="text-[10px]">
              Quiz
            </Badge>
          )}
          {hasPractice && (
            <Badge variant="secondary" className="text-[10px]">
              Practise
            </Badge>
          )}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {concept.estimatedMinutes} min
        </span>
      </div>
      <div>
        <h3 className="font-medium">{concept.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {concept.summary}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="capitalize">{concept.difficulty}</span>
        {quizCount > 0 && <span>· {quizCount} quiz</span>}
        {hasPractice && <span>· practice</span>}
      </div>
      {done && <Progress value={100} className="h-1.5" />}
      {!done && hasActivity && <Progress value={50} className="h-1.5" />}
      <Button
        size="sm"
        variant={done ? "outline" : "default"}
        render={<Link href={getConceptHref(concept)} />}
      >
        {ctaLabel}
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
      {section && (
        <p className="text-[10px] text-muted-foreground/70">{section.title}</p>
      )}
    </div>
  )
}
