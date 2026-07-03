"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  CheckIcon,
  GraduationCapIcon,
  LineChartIcon,
  TrendingUpIcon,
} from "lucide-react"

import { Reveal } from "@/components/landing/reveal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const VALUE_PROPS = [
  "Structured learning path",
  "Interactive chart practice",
  "Quizzes & competency tracking",
  "Trade journal & progress",
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.72_0.19_145/0.18),transparent)]" />
      <div className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 size-64 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <Reveal>
          <div className="flex flex-col items-start text-left">
            <Badge
              variant="secondary"
              className="border-primary/20 bg-primary/10 text-primary"
            >
              Structured trading education
            </Badge>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Become a consistently{" "}
              <span className="text-primary">competent trader</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg text-muted-foreground text-pretty sm:text-xl">
              Master markets with interactive lessons, real chart drills,
              quizzes, and journaling — a protected programme from beginner to
              live-trading ready.
            </p>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {VALUE_PROPS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-foreground/90"
                >
                  <CheckIcon className="size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button size="lg" render={<Link href="/sign-up" />}>
                Start learning free
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/#journey" />}
              >
                See how it works
              </Button>
            </div>

            <p className="mt-5 text-xs text-muted-foreground">
              Educational simulator · No live trading · No financial advice
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={120} className="relative">
          <div className="landing-float relative mx-auto max-w-md lg:max-w-none">
            <div className="absolute -top-4 -right-2 z-20 flex size-12 items-center justify-center rounded-2xl border border-primary/30 bg-card/90 text-primary shadow-lg shadow-primary/10 sm:size-14">
              <LineChartIcon className="size-6" />
            </div>
            <div className="absolute -bottom-3 -left-2 z-20 flex size-12 items-center justify-center rounded-2xl border border-sky-400/30 bg-card/90 text-sky-400 shadow-lg sm:size-14">
              <GraduationCapIcon className="size-6" />
            </div>

            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-5 shadow-2xl shadow-primary/5 backdrop-blur-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <TrendingUpIcon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Your progress</p>
                    <p className="text-xs text-muted-foreground">Demo preview</p>
                  </div>
                </div>
                <Badge className="bg-primary/15 text-primary">+23.8%</Badge>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: "Lessons", value: "24/47" },
                  { label: "Quizzes", value: "18" },
                  { label: "XP", value: "2,450" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border/50 bg-background/50 p-3 text-center"
                  >
                    <p className="text-lg font-semibold text-primary">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-border/50 bg-background/40 p-4">
                <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Competency</span>
                  <span className="font-medium text-primary">66%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary to-emerald-300" />
                </div>
                <div className="mt-4 flex h-24 items-end gap-1.5">
                  {[32, 44, 38, 52, 48, 61, 58, 70, 66, 78, 74, 88].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-primary/25 transition-all"
                        style={{
                          height: `${h}%`,
                          animationDelay: `${i * 60}ms`,
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
