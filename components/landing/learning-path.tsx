"use client"

import { useEffect, useRef, useState } from "react"
import {
  BookOpenIcon,
  FlagIcon,
  GraduationCapIcon,
  LineChartIcon,
  NotebookPenIcon,
  SparklesIcon,
} from "lucide-react"

import { Reveal } from "@/components/landing/reveal"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    id: "start",
    label: "Start",
    title: "Set your foundation",
    body: "Create your profile, pick a study pace, and open your first lesson.",
    icon: SparklesIcon,
  },
  {
    id: "learn",
    label: "Learn",
    title: "Structured lessons",
    body: "Work through interactive lessons and the trading library at your pace.",
    icon: BookOpenIcon,
  },
  {
    id: "practice",
    label: "Practice",
    title: "Chart drills",
    body: "Mark levels, read trends, and train decisions on real chart mechanics.",
    icon: LineChartIcon,
  },
  {
    id: "test",
    label: "Test",
    title: "Quizzes & feedback",
    body: "Prove what stuck with quizzes and instant feedback on every attempt.",
    icon: GraduationCapIcon,
  },
  {
    id: "journal",
    label: "Journal",
    title: "Review & improve",
    body: "Log decisions, track streaks, and turn mistakes into measurable progress.",
    icon: NotebookPenIcon,
  },
  {
    id: "ready",
    label: "Ready",
    title: "Live-trading readiness",
    body: "Build competency and readiness before you risk real capital.",
    icon: FlagIcon,
  },
] as const

/** Desktop path in a 1000×200 viewBox — gentle wave, room for labels below. */
const DESKTOP_VB = { w: 1000, h: 200 }
const DESKTOP_POINTS = [
  [90, 110],
  [250, 80],
  [410, 120],
  [570, 75],
  [730, 115],
  [890, 85],
] as const

const DESKTOP_PATH =
  "M90 110 C170 110, 180 80, 250 80 S330 120, 410 120 S490 75, 570 75 S650 115, 730 115 S810 85, 890 85"

export function InteractiveLearningPath() {
  const sectionRef = useRef<HTMLElement>(null)
  const [drawn, setDrawn] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setDrawn(true)
      setActiveIndex(STEPS.length - 1)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setDrawn(true)
        observer.disconnect()
      },
      { threshold: 0.2 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!drawn) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    let step = 0
    const timer = window.setInterval(() => {
      step += 1
      setActiveIndex(step)
      if (step >= STEPS.length - 1) window.clearInterval(timer)
    }, 220)

    return () => window.clearInterval(timer)
  }, [drawn])

  const selected = hovered ?? activeIndex
  const selectedStep = STEPS[selected] ?? STEPS[0]

  return (
    <section
      ref={sectionRef}
      id="roadmap"
      className="scroll-mt-20 border-t border-border/60 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-4 border-primary/20 bg-primary/10 text-primary"
            >
              Roadmap
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              From complete beginner to competent trader
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Tap any step to explore the roadmap — learn, practice, test, and
              build competence before you trade live.
            </p>
          </div>
        </Reveal>

        {/* Desktop interactive path */}
        <Reveal delayMs={100} className="mt-14 hidden md:block">
          <div className="rounded-3xl border border-border/60 bg-card/30 px-4 pb-12 pt-10 lg:px-8 lg:pb-14 lg:pt-12">
            <div className="relative mx-auto w-full max-w-5xl">
              <div
                className="relative w-full"
                style={{ aspectRatio: `${DESKTOP_VB.w} / ${DESKTOP_VB.h}` }}
              >
                <svg
                  viewBox={`0 0 ${DESKTOP_VB.w} ${DESKTOP_VB.h}`}
                  className="absolute inset-0 h-full w-full overflow-visible"
                  role="img"
                  aria-label="Interactive roadmap from start to live-trading readiness"
                >
                  <defs>
                    <linearGradient
                      id="pathGlow"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="oklch(0.72 0.19 145)" />
                      <stop
                        offset="100%"
                        stopColor="oklch(0.78 0.14 200)"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d={DESKTOP_PATH}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-border/80"
                    pathLength={1}
                  />
                  <path
                    d={DESKTOP_PATH}
                    fill="none"
                    stroke="url(#pathGlow)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className={cn("landing-path-line", drawn && "is-drawn")}
                    pathLength={1}
                  />
                </svg>

                {DESKTOP_POINTS.map(([x, y], index) => {
                  const step = STEPS[index]
                  const Icon = step.icon
                  const isSelected = selected === index
                  const isReached = index <= selected
                  const isFuture = index > selected

                  return (
                    <button
                      key={step.id}
                      type="button"
                      className={cn(
                        "absolute flex size-12 -translate-x-1/2 -translate-y-1/2 flex-col items-center",
                        isSelected ? "z-30" : isReached ? "z-20" : "z-10",
                        isFuture ? "opacity-45" : "opacity-100"
                      )}
                      style={{
                        left: `${(x / DESKTOP_VB.w) * 100}%`,
                        top: `${(y / DESKTOP_VB.h) * 100}%`,
                      }}
                      onMouseEnter={() => setHovered(index)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(index)}
                      onBlur={() => setHovered(null)}
                      onClick={() => setActiveIndex(index)}
                      aria-pressed={isSelected}
                      aria-label={`${step.label}: ${step.title}`}
                    >
                      {/* Opaque bg-card base so the path line never shows through */}
                      <span
                        className={cn(
                          "relative flex size-12 items-center justify-center overflow-hidden rounded-full border-2 bg-card shadow-md transition-colors",
                          isSelected
                            ? "border-primary text-primary shadow-primary/25 ring-4 ring-primary/15"
                            : isReached
                              ? "border-primary/60 text-primary"
                              : "border-border text-muted-foreground"
                        )}
                      >
                        {(isSelected || isReached) && (
                          <span
                            className="absolute inset-0 bg-primary/15"
                            aria-hidden
                          />
                        )}
                        <Icon className="relative z-10 size-5" aria-hidden />
                      </span>
                      <span
                        className={cn(
                          "pointer-events-none absolute top-[calc(100%+10px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-border/60 bg-card px-2.5 py-0.5 text-xs font-medium shadow-sm",
                          isSelected
                            ? "border-primary/30 text-primary"
                            : isReached
                              ? "text-foreground/80"
                              : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Mobile interactive path */}
        <Reveal delayMs={100} className="mt-10 md:hidden">
          <div className="rounded-3xl border border-border/60 bg-card/30 p-4">
            <ol className="relative space-y-3">
              <div
                className="absolute top-6 bottom-6 left-[1.375rem] w-0.5 bg-border"
                aria-hidden
              />

              {STEPS.map((step, index) => {
                const Icon = step.icon
                const isSelected = selected === index
                const isReached = index <= selected
                const isFuture = index > selected
                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      className={cn(
                        "relative flex w-full items-start gap-4 rounded-2xl border bg-background/80 p-4 text-left transition-colors",
                        isSelected
                          ? "z-20 border-primary/50 ring-1 ring-primary/30"
                          : "border-border/60",
                        isFuture && "opacity-50"
                      )}
                      onClick={() => {
                        setActiveIndex(index)
                        setHovered(index)
                      }}
                      aria-pressed={isSelected}
                    >
                      <span
                        className={cn(
                          "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border-2 bg-background",
                          isSelected
                            ? "border-primary bg-primary/15 text-primary"
                            : isReached
                              ? "border-primary/60 text-primary"
                              : "border-border text-muted-foreground"
                        )}
                      >
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span
                          className={cn(
                            "text-xs font-medium",
                            isSelected || isReached
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        >
                          {step.label}
                        </span>
                        <span className="mt-0.5 block font-semibold">
                          {step.title}
                        </span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {step.body}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        </Reveal>

        {/* Desktop detail card */}
        <Reveal delayMs={180} className="mt-6 hidden md:block">
          <div
            key={selectedStep.id}
            className="mx-auto max-w-2xl rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              Step {selected + 1} of {STEPS.length} · {selectedStep.label}
            </p>
            <h3 className="mt-2 text-xl font-semibold">{selectedStep.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {selectedStep.body}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
