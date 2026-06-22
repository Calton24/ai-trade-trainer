"use client"

import Link from "next/link"
import { ArrowRightIcon, BrainIcon, HistoryIcon } from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAllQuizzes, getPathBySlug } from "@/content/registry"

export function QuizzesContent() {
  const { state } = useUserState()
  const quizzes = getAllQuizzes()
  const attempts = state.quizAttempts

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Quizzes
          </h1>
          <p className="text-muted-foreground">
            Test your knowledge with dynamic beginner quizzes — get instant
            feedback and discuss answers with the AI coach
          </p>
        </div>

        {attempts.length === 0 ? (
          <EmptyState
            icon={HistoryIcon}
            title="No quiz attempts yet"
            description="Pick a quiz below to test what you've learned. Your scores will appear here after you finish."
            action={
              <Button render={<Link href="/paths/trading-foundations" />}>
                Start Trading Foundations
              </Button>
            }
          />
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <h2 className="font-medium">Recent attempts</h2>
            <div className="mt-4 flex flex-col gap-2">
              {attempts.slice(0, 5).map((attempt) => {
                const quiz = quizzes.find((q) => q.id === attempt.quizId)
                return (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 text-sm"
                  >
                    <span>{quiz?.title ?? attempt.quizId}</span>
                    <span className="text-muted-foreground">
                      {attempt.score}% ·{" "}
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {quizzes.map((quiz) => {
            const path = getPathBySlug(quiz.pathId)
            const bestAttempt = attempts
              .filter((a) => a.quizId === quiz.id)
              .sort((a, b) => b.score - a.score)[0]

            return (
              <div
                key={quiz.id}
                className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                    <BrainIcon className="text-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium">{quiz.title}</h3>
                    {path && (
                      <Badge variant="secondary" className="w-fit text-xs">
                        {path.title}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {quiz.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {quiz.questions.length} questions · +{quiz.xpReward} XP
                    {bestAttempt && ` · Best: ${bestAttempt.score}%`}
                  </span>
                  <Button
                    size="sm"
                    render={<Link href={`/quiz/${quiz.id}`} />}
                  >
                    {bestAttempt ? "Retake Quiz" : "Start Quiz"}
                    <ArrowRightIcon data-icon="inline-end" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
