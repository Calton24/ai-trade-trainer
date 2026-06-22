import Link from "next/link"
import { FlameIcon, SparklesIcon, TrophyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { badgeDefinitions } from "@/lib/mock-data"
import { getLevelTitle } from "@/lib/user-state"

export function ProgressPreview() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Level 1</p>
                <p className="font-semibold">{getLevelTitle(1)}</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-1.5">
                <FlameIcon className="text-muted-foreground" />
                <span className="text-sm font-medium">Start your streak</span>
              </div>
            </div>
            <Progress value={0} className="mt-4 h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              0 / 100 XP · 0 lessons · 0 drills
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {badgeDefinitions.slice(0, 3).map((b) => (
                <span
                  key={b.id}
                  className="rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {b.icon} {b.name} · Locked
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Example new-user state — progress updates as you learn
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <p className="text-sm font-medium text-primary">
              Progress & streaks
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Stay motivated with XP, levels, and badges
            </h2>
            <p className="text-muted-foreground">
              Complete lessons and drills to earn XP. Build daily streaks. Unlock
              badges like First Drill, Support Spotter, and 7-Day Streak.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <SparklesIcon className="text-primary" />
                Earn XP from lessons and chart drills
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <FlameIcon className="text-primary" />
                Build daily practice streaks
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <TrophyIcon className="text-primary" />
                Unlock badges as you improve
              </div>
            </div>
            <Button className="w-fit" render={<Link href="/progress" />}>
              View Progress
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
