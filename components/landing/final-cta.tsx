import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function FinalCta() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/50 to-card/30 p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,oklch(0.72_0.19_145/0.12),transparent)]" />
          <div className="relative flex flex-col items-center gap-6">
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Start your trading education the right way
            </h2>
            <p className="max-w-lg text-muted-foreground">
              Guided lessons, chart drills, AI feedback, and progress tracking
              — all in a safe, beginner-friendly simulator.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" render={<Link href="/learn" />}>
                Start Learning Free
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/training" />}
              >
                Try a Chart Drill
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
