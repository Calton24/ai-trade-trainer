import Link from "next/link"
import {
  ActivityIcon,
  ArrowRightIcon,
  AwardIcon,
  BarChart3Icon,
  BookOpenIcon,
  BrainIcon,
  CalendarCheckIcon,
  CheckIcon,
  CompassIcon,
  FlameIcon,
  GaugeIcon,
  LayersIcon,
  LineChartIcon,
  NotebookPenIcon,
  RocketIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react"

import { GatedLink } from "@/components/auth/premium-gate"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAllBooks } from "@/content/library"
import { cn } from "@/lib/utils"

function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      {eyebrow && (
        <Badge
          variant="secondary"
          className="mb-4 border-primary/20 bg-primary/10 text-primary"
        >
          {eyebrow}
        </Badge>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          {description}
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Why traders fail                                                    */
/* ------------------------------------------------------------------ */

const FAILURES = [
  {
    icon: LayersIcon,
    title: "No structure",
    body: "Random YouTube videos and tips with no clear path from beginner to competent.",
  },
  {
    icon: ActivityIcon,
    title: "No feedback",
    body: "You never find out whether your chart reads and decisions were actually right.",
  },
  {
    icon: CalendarCheckIcon,
    title: "No accountability",
    body: "Nothing keeps you consistent, so learning fizzles out after a few days.",
  },
  {
    icon: GaugeIcon,
    title: "No progression",
    body: "No measurable sense of how good you're actually becoming over time.",
  },
]

export function WhyTradersFail() {
  return (
    <section className="border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The problem"
          title="Why most traders fail before they start"
          description="Trading education is broken. People consume content endlessly but never build real, tested competence."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FAILURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border/60 bg-card/40 p-6"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Everything included                                                */
/* ------------------------------------------------------------------ */

const FEATURES = [
  { icon: BookOpenIcon, label: "Interactive Lessons" },
  { icon: LayersIcon, label: "Trading Library" },
  { icon: NotebookPenIcon, label: "Book Lab" },
  { icon: BarChart3Icon, label: "Chart Lab" },
  { icon: LineChartIcon, label: "Trend Spotter" },
  { icon: CompassIcon, label: "Strategy Wiki" },
  { icon: RocketIcon, label: "Trading Simulator" },
  { icon: ShieldCheckIcon, label: "Readiness Assessment" },
  { icon: SparklesIcon, label: "Flashcards" },
  { icon: TrophyIcon, label: "Leaderboards" },
  { icon: GaugeIcon, label: "Competency Tracking" },
  { icon: AwardIcon, label: "Trader Rankings" },
  { icon: TargetIcon, label: "Achievements" },
  { icon: FlameIcon, label: "Daily Challenges" },
  { icon: NotebookPenIcon, label: "Trade Journal" },
  { icon: UsersIcon, label: "Community" },
]

export function EverythingIncluded() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Everything included"
          title="One platform for the entire journey"
          description="From your first candle to live-trading readiness — every tool you need to learn, practice, and prove competence."
        />
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-4 transition-colors hover:border-primary/40 hover:bg-card/70"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </span>
              <span className="text-sm font-medium">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Learning journey                                                   */
/* ------------------------------------------------------------------ */

const JOURNEY = [
  { rank: "Beginner", detail: "Novice → Student Trader", color: "text-sky-400" },
  { rank: "Student", detail: "Apprentice → Market Student", color: "text-cyan-400" },
  { rank: "Competent", detail: "Technical Analyst → Competent", color: "text-emerald-400" },
  { rank: "Professional", detail: "Advanced → Professional Trader", color: "text-amber-400" },
  { rank: "Master", detail: "Elite → Legendary Trader", color: "text-fuchsia-400" },
]

export function LearningJourney() {
  return (
    <section id="journey" className="scroll-mt-20 border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The journey"
          title="A clear path from beginner to master"
          description="15 aspirational Trader Ranks. Every lesson, quiz, drill, and simulation moves you forward."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-5">
          {JOURNEY.map((step, i) => (
            <div key={step.rank} className="relative">
              <div className="rounded-2xl border border-border/60 bg-card/40 p-6 text-center">
                <span className="text-xs font-medium text-muted-foreground">
                  Stage {i + 1}
                </span>
                <h3 className={cn("mt-2 text-lg font-semibold", step.color)}>
                  {step.rank}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{step.detail}</p>
              </div>
              {i < JOURNEY.length - 1 && (
                <ArrowRightIcon className="absolute top-1/2 -right-3 hidden size-5 -translate-y-1/2 text-muted-foreground/40 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Books included                                                     */
/* ------------------------------------------------------------------ */

export function BooksIncluded() {
  const books = getAllBooks()
  return (
    <section id="books" className="scroll-mt-20 border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Trading library"
          title="Learn from the world's best trading books"
          description="Each book becomes an interactive course with lessons, quizzes, XP, and progress tracking."
        />
        <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2">
          {books.map((book) => {
            const lessons = book.sections.reduce(
              (n, s) => n + s.concepts.length,
              0
            )
            return (
              <div
                key={book.id}
                className="overflow-hidden rounded-2xl border border-border/60 bg-card/40"
              >
                <div
                  className={cn(
                    "flex h-28 items-center justify-center bg-gradient-to-br text-5xl",
                    book.coverGradient
                  )}
                >
                  {book.cover}
                </div>
                <div className="p-6">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {book.category}
                  </Badge>
                  <h3 className="font-semibold">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {book.description}
                  </p>
                  <p className="mt-4 text-xs font-medium text-muted-foreground">
                    {lessons} lessons · ~{book.estimatedHours}h
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          More books added regularly — your progression extends automatically.
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Practice: charts + simulator                                       */
/* ------------------------------------------------------------------ */

export function PracticePreview() {
  return (
    <section className="border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
        <div className="flex flex-col justify-center rounded-2xl border border-border/60 bg-card/40 p-8">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BarChart3Icon className="size-5" />
          </div>
          <h3 className="mt-4 text-2xl font-semibold">Interactive chart labs</h3>
          <p className="mt-3 text-muted-foreground">
            Mark support and resistance, classify trends, and call setups on real
            chart mechanics — then get instant feedback on every decision.
          </p>
          <div className="mt-6 flex h-40 items-end gap-1.5 rounded-xl border border-border/40 bg-background/60 p-4">
            {[40, 55, 48, 62, 70, 58, 75, 88, 80, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-primary/30"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-border/60 bg-card/40 p-8">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <RocketIcon className="size-5" />
          </div>
          <h3 className="mt-4 text-2xl font-semibold">Trading simulator</h3>
          <p className="mt-3 text-muted-foreground">
            Replay markets candle-by-candle and make live decisions — entries,
            stops, targets, and trade management — without risking a cent.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Candle-by-candle replay engine",
              "Forced risk limits & journaling",
              "Performance analytics feed your competency",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <CheckIcon className="size-4 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Competency system                                                  */
/* ------------------------------------------------------------------ */

const SYSTEMS = [
  {
    icon: FlameIcon,
    title: "XP",
    subtitle: "Motivation",
    color: "text-emerald-400",
    body: "Earned for effort — lessons, streaks, challenges, and achievements. Keeps you showing up.",
  },
  {
    icon: GaugeIcon,
    title: "Competency",
    subtitle: "Knowledge",
    color: "text-sky-400",
    body: "A hidden 0–100 score from exams, simulations, and chart recognition. Measures how good you actually are.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Live Readiness",
    subtitle: "Confidence",
    color: "text-amber-400",
    body: "Unlocked late. Proves you've demonstrated the discipline to risk real money — not just finished lessons.",
  },
]

export function CompetencySystem() {
  return (
    <section className="border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Three systems, one goal"
          title="XP is effort. Competency is knowledge."
          description="You could grind 80,000 XP and still sit at 48% competency if you keep failing assessments. Competency has to be earned."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {SYSTEMS.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border/60 bg-card/40 p-7"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                <s.icon className={cn("size-5", s.color)} />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className={cn("text-sm font-medium", s.color)}>{s.subtitle}</p>
              <p className="mt-3 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Study plans                                                        */
/* ------------------------------------------------------------------ */

const PLANS = [
  {
    name: "Casual",
    cadence: "2–3 lessons / week",
    hours: "~2 hrs / week",
    completion: "~12 month completion",
    icon: CompassIcon,
    featured: false,
  },
  {
    name: "Consistent",
    cadence: "5 lessons / week",
    hours: "~5 hrs / week",
    completion: "~6 month completion",
    icon: TargetIcon,
    featured: true,
  },
  {
    name: "Locked In",
    cadence: "Daily learning",
    hours: "~10 hrs / week",
    completion: "90–120 day completion",
    icon: FlameIcon,
    featured: false,
  },
]

export function StudyPlans() {
  return (
    <section id="plans" className="scroll-mt-20 border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Personalised pace"
          title="Choose how fast you want to go"
          description="Pick an intensity at sign-up and we generate weekly targets, study hours, and an expected completion date."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={cn(
                "rounded-2xl border bg-card/40 p-7",
                p.featured
                  ? "border-primary/50 ring-1 ring-primary/30"
                  : "border-border/60"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <p.icon className="size-5" />
                </span>
                {p.featured && (
                  <Badge className="bg-primary/15 text-primary">Most popular</Badge>
                )}
              </div>
              <h3 className="mt-4 text-xl font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.cadence}</p>
              <div className="mt-5 space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-primary" />
                  {p.hours}
                </p>
                <p className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-primary" />
                  {p.completion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Success roadmap                                                    */
/* ------------------------------------------------------------------ */

const ROADMAP = [
  { icon: SparklesIcon, label: "Sign up" },
  { icon: BookOpenIcon, label: "Learn" },
  { icon: BarChart3Icon, label: "Practice" },
  { icon: ShieldCheckIcon, label: "Pass assessments" },
  { icon: GaugeIcon, label: "Build competency" },
  { icon: AwardIcon, label: "Readiness exam" },
  { icon: RocketIcon, label: "Transition to live" },
]

export function SuccessRoadmap() {
  return (
    <section className="border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The roadmap"
          title="You earn the right to trade live"
          description="Not because you finished lessons — because you've demonstrated competence."
        />
        <ol className="mt-12 space-y-3">
          {ROADMAP.map((step, i) => (
            <li
              key={step.label}
              className="flex items-center gap-4 rounded-xl border border-border/60 bg-card/40 p-4"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                {i + 1}
              </span>
              <step.icon className="size-5 text-muted-foreground" />
              <span className="font-medium">{step.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Pricing teaser                                                     */
/* ------------------------------------------------------------------ */

const PRICING_TEASER = [
  {
    name: "Weekly",
    price: "£4.99",
    per: "/week",
    note: "Try the platform",
    cta: "Start Weekly",
  },
  {
    name: "6-Month Plan",
    price: "£79.99",
    per: " / 6 mo",
    note: "Build competency",
    featured: true,
    badge: "Most Popular",
    cta: "Start 6-Month Plan",
  },
  {
    name: "Annual",
    price: "£129.99",
    per: "/year",
    note: "Master over time",
    badge: "Best Value",
    cta: "Start Annual",
  },
]

export function PricingTeaser() {
  return (
    <section id="pricing" className="scroll-mt-20 border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pricing"
          title="Choose the pace that matches your learning commitment"
          description="Weekly to try, 6-month to build competency, annual for long-term mastery."
        />
        <div className="mx-auto mt-14 grid max-w-4xl gap-4 pt-3 sm:grid-cols-3">
          {PRICING_TEASER.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative overflow-visible rounded-2xl border bg-card/40 p-7 text-center",
                tier.featured
                  ? "z-[1] border-primary/50 pt-8 ring-1 ring-primary/30"
                  : "border-border/60"
              )}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-primary/50 bg-card px-3 py-1 text-xs font-semibold tracking-wide text-primary shadow-md ring-1 ring-background">
                  {tier.badge}
                </span>
              )}
              <h3 className="font-semibold">{tier.name}</h3>
              <div className="mt-3 flex items-end justify-center gap-1">
                <span className="text-4xl font-semibold">{tier.price}</span>
                <span className="pb-1 text-sm text-muted-foreground">
                  {tier.per}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-primary">{tier.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button size="lg" render={<Link href="/pricing" />}>
            Compare all plans
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                          */
/* ------------------------------------------------------------------ */

export function FinalCtaSection() {
  return (
    <section className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <BrainIcon className="mx-auto size-10 text-primary" />
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Join thousands of traders learning the right way
        </h2>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          Structured. Protected. Measurable. Enrol in the programme that takes you
          from complete beginner to competent trader.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" render={<Link href="/sign-up" />}>
            Create free account
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <GatedLink href="/dashboard">
            <Button size="lg" variant="outline" render={<span />}>
              Explore the platform
            </Button>
          </GatedLink>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Educational simulator · No live trading · No financial advice
        </p>
      </div>
    </section>
  )
}
