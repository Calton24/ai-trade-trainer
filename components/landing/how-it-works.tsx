import {
  BookOpenIcon,
  BrainIcon,
  ChartCandlestickIcon,
  TrophyIcon,
} from "lucide-react"

const steps = [
  {
    step: "01",
    icon: BookOpenIcon,
    title: "Follow the learning path",
    description:
      "8 beginner modules from candlesticks to psychology — each with simple explanations, chart examples, and a quiz.",
  },
  {
    step: "02",
    icon: ChartCandlestickIcon,
    title: "Practice on chart drills",
    description:
      "Mark support, resistance, breaks, and retests on replay charts. Learn by doing, not just reading.",
  },
  {
    step: "03",
    icon: BrainIcon,
    title: "Get AI coach feedback",
    description:
      "Submit your answer and receive clear, beginner-friendly feedback on what you got right and what to improve.",
  },
  {
    step: "04",
    icon: TrophyIcon,
    title: "Track XP, streaks & badges",
    description:
      "Earn XP for lessons and drills, build daily streaks, and unlock badges as you progress.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Learn by doing</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            The Codecademy approach to trading
          </h2>
          <p className="mt-4 text-muted-foreground">
            Read a lesson, take a quiz, practice on a chart, get feedback, and
            track your progress — one step at a time.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.step}
                className="relative flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-6"
              >
                <span className="text-xs font-mono text-primary">
                  {item.step}
                </span>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                  <Icon className="text-primary" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
