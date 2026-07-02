import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.72_0.19_145/0.15),transparent)]" />
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 sm:py-28 lg:py-32">
        <Badge
          variant="secondary"
          className="border-primary/20 bg-primary/10 text-primary"
        >
          The Codecademy for traders
        </Badge>

        <div className="flex max-w-3xl flex-col gap-5">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Become a Competent Trader Through Structured Practice
          </h1>
          <p className="text-lg text-muted-foreground text-pretty sm:text-xl">
            Lessons, a trading library, chart labs, a market simulator, and a
            measurable competency score — a protected, university-style programme
            that takes you from complete beginner to live-trading ready.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" render={<Link href="/sign-up" />}>
            Create free account
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/#features" />}>
            See everything included
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Educational simulator · No live trading · No financial advice
        </p>
      </div>
    </section>
  )
}
