"use client"

import { AppShell } from "@/components/layout/app-shell"
import { PathCard } from "@/components/paths/path-card"
import { useUserState } from "@/components/providers/user-state-provider"
import { getAllPaths, getPathCardData, TIME_ESTIMATE_NOTE } from "@/lib/course"

export function PathsContent() {
  const { pathProgress } = useUserState()
  const paths = getAllPaths()
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((path) => getPathCardData(path, pathProgress(path.id)))

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Learning Paths
          </h1>
          <p className="text-muted-foreground">
            Structured courses with real modules, lessons, quizzes, and chart
            drills — like Codecademy for trading
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {TIME_ESTIMATE_NOTE}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => (
            <PathCard key={path.id} path={path} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
