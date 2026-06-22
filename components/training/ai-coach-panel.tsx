"use client"

import Link from "next/link"
import {
  CheckCircle2Icon,
  Loader2Icon,
  RefreshCwIcon,
  SparklesIcon,
  XCircleIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AIReview } from "@/lib/types"

interface AiCoachPanelProps {
  review: AIReview | null
  isLoading: boolean
}

export function AiCoachPanel({ review, isLoading }: AiCoachPanelProps) {
  return (
    <Card className="flex h-full flex-col border-border/60 bg-card/50">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
            <SparklesIcon className="text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">AI Coach</CardTitle>
            <p className="text-xs text-muted-foreground">
              Supportive feedback · Not financial advice
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pt-4">
        {isLoading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
            <Loader2Icon className="animate-spin text-primary" />
            <p className="text-sm">Reviewing your answer...</p>
          </div>
        )}

        {!isLoading && !review && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
            <SparklesIcon className="text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Choose a drill, place your markers on the chart, then submit for
              beginner-friendly feedback.
            </p>
          </div>
        )}

        {!isLoading && review && (
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-5 pr-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Your Score</span>
                <Badge className="bg-primary text-primary-foreground">
                  {review.score}/100
                </Badge>
              </div>
              <Progress value={review.score} className="h-2" />

              {review.beginnerExplanation && (
                <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                  <p className="text-sm font-medium">In simple terms</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {review.beginnerExplanation}
                  </p>
                </div>
              )}

              <p className="text-sm text-muted-foreground">{review.summary}</p>

              {review.strengths.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-primary">
                    What you got right
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {review.strengths.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2Icon className="mt-0.5 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {review.mistakes.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-destructive">
                    What to improve
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {review.mistakes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <XCircleIcon className="mt-0.5 shrink-0 text-destructive" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                <p className="text-sm font-medium">One thing to try next</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {review.improvement}
                </p>
              </div>

              {review.riskRewardFeedback && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm font-medium">Risk/Reward note</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {review.riskRewardFeedback}
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                render={<Link href="/training" />}
              >
                <RefreshCwIcon data-icon="inline-start" />
                Try Another Drill
              </Button>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
