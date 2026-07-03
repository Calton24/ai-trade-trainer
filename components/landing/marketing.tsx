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
import { Reveal } from "@/components/landing/reveal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { isPrivateBetaEnabled } from "@/lib/config/private-beta"
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

const FAILURES = [
  {
    icon: LayersIcon,
    title: "No structure",
    body: "Random YouTube videos and tips with no clear path from beginner to competent.",
  },
  {
    icon: ActivityIcon,
    title: "No practice",
    body: "Watching charts is not the same as marking levels and making decisions under pressure.",
  },
  {
    icon: CalendarCheckIcon,
    title: "No consistency",
    body: "Nothing keeps you accountable, so learning fizzles out after a few days.",
  },
  {
    icon: GaugeIcon,
    title: "No improvement loop",
    body: "No measurable sense of how good you're actually becoming over time.",
  },
]

export function WhyTradersFail() {
  return (
    <section className="border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="The problem"
            title="Why most traders fail before they start"
            description="Trading education is broken. People consume content endlessly but never build real, tested competence."
          />
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FAILURES.map((f, i) => (
            <Reveal key={f.title} delayMs={i * 80}>
              <div className="h-full rounded-2xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-destructive/30 hover:bg-card/70">
                <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

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
    <section
      id="features"
      className="scroll-mt-20 border-t border-border/60 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Everything included"
            title="One platform for the entire journey"
            description="From your first candle to live-trading readiness — every tool you need to learn, practice, and prove competence."
          />
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.label} delayMs={(i % 4) * 50}>
              <div className="flex h-full items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/70 hover:shadow-lg hover:shadow-primary/5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </span>
                <span className="text-sm font-medium">{f.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BooksIncluded() {
  const books = getAllBooks()
  return (
    <section
      id="books"
      className="scroll-mt-20 border-t border-border/60 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Trading library"
            title="Learn from the world's best trading books"
            description="Each book becomes an interactive course with lessons, quizzes, XP, and progress tracking."
          />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2">
          {books.map((book, i) => {
            const lessons = book.sections.reduce(
              (n, s) => n + s.concepts.length,
              0
            )
            return (
              <Reveal key={book.id} delayMs={i * 90}>
                <div className="h-full overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
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
              </Reveal>
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

export function PracticePreview() {
  return (
    <section className="border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <div className="flex h-full flex-col justify-center rounded-2xl border border-border/60 bg-card/40 p-8 transition-colors hover:border-primary/30">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BarChart3Icon className="size-5" />
            </div>
            <h3 className="mt-4 text-2xl font-semibold">Interactive chart labs</h3>
            <p className="mt-3 text-muted-foreground">
              Mark support and resistance, classify trends, and call setups on
              real chart mechanics — then get instant feedback on every decision.
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
        </Reveal>

        <Reveal delayMs={100}>
          <div className="flex h-full flex-col justify-center rounded-2xl border border-border/60 bg-card/40 p-8 transition-colors hover:border-primary/30">
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
        </Reveal>
      </div>
    </section>
  )
}

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
    body: "A 0–100 score from exams, simulations, and chart recognition. Measures how good you actually are.",
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
        <Reveal>
          <SectionHeading
            eyebrow="Three systems, one goal"
            title="XP is effort. Competency is knowledge."
            description="You could grind XP and still sit at low competency if you keep failing assessments. Competence has to be earned."
          />
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {SYSTEMS.map((s, i) => (
            <Reveal key={s.title} delayMs={i * 90}>
              <div className="h-full rounded-2xl border border-border/60 bg-card/40 p-7 transition-all hover:-translate-y-0.5 hover:border-primary/30">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                  <s.icon className={cn("size-5", s.color)} />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
                <p className={cn("text-sm font-medium", s.color)}>{s.subtitle}</p>
                <p className="mt-3 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

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
    <section
      id="plans"
      className="scroll-mt-20 border-t border-border/60 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Personalised pace"
            title="Choose how fast you want to go"
            description="Pick an intensity at sign-up and we generate weekly targets, study hours, and an expected completion date."
          />
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delayMs={i * 90}>
              <div
                className={cn(
                  "h-full rounded-2xl border bg-card/40 p-7 transition-all hover:-translate-y-0.5",
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
                    <Badge className="bg-primary/15 text-primary">
                      Most popular
                    </Badge>
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

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
        <Reveal>
          <SectionHeading
            eyebrow="The roadmap"
            title="You earn the right to trade live"
            description="Not because you finished lessons — because you've demonstrated competence."
          />
        </Reveal>
        <ol className="mt-12 space-y-3">
          {ROADMAP.map((step, i) => (
            <Reveal key={step.label} delayMs={i * 50}>
              <li className="flex items-center gap-4 rounded-xl border border-border/60 bg-card/40 p-4 transition-colors hover:border-primary/30">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <step.icon className="size-5 text-muted-foreground" />
                <span className="font-medium">{step.label}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

const PRICING_TEASER = [
  {
    name: "Weekly",
    price: "£4.99",
    per: "/week",
    note: "Try the platform",
  },
  {
    name: "6-Month Plan",
    price: "£79.99",
    per: " / 6 mo",
    note: "Build competency",
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "Annual",
    price: "£129.99",
    per: "/year",
    note: "Master over time",
    badge: "Best Value",
  },
]

export function PricingTeaser() {
  const privateBeta = isPrivateBetaEnabled()

  return (
    <section
      id="pricing"
      className="scroll-mt-20 border-t border-border/60 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Pricing"
            title="Simple, transparent plans"
            description={
              privateBeta
                ? "Private beta is invite-only. Sign up free — invited testers get Pro access enabled by our team."
                : "Weekly to try, 6-month to build competency, annual for long-term mastery."
            }
          />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-4xl gap-4 pt-3 sm:grid-cols-3">
          {PRICING_TEASER.map((tier, i) => (
            <Reveal key={tier.name} delayMs={i * 90}>
              <div
                className={cn(
                  "relative h-full overflow-visible rounded-2xl border bg-card/40 p-7 text-center transition-all hover:-translate-y-0.5",
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
                <p className="mt-2 text-sm font-semibold text-primary">
                  {tier.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delayMs={120}>
          <div className="mt-10 flex justify-center">
            <Button
              size="lg"
              render={
                <Link href={privateBeta ? "/sign-up" : "/pricing"} />
              }
            >
              {privateBeta ? "Join private beta" : "Compare all plans"}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function FinalCtaSection() {
  return (
    <section className="border-t border-border/60 py-24">
      <Reveal>
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 to-transparent px-6 py-12 sm:px-10">
            <BrainIcon className="mx-auto size-10 text-primary" />
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Ready to learn trading the right way?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Structured practice, measurable progress, and a clear path to
              competence — start free and build from there.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" render={<Link href="/sign-up" />}>
                Start learning free
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
        </div>
      </Reveal>
    </section>
  )
}
