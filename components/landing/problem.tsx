import { AlertTriangleIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const struggles = [
  {
    title: "Too much theory, not enough practice",
    description:
      "Watching videos doesn't build chart-reading skills. You need hands-on repetition with feedback on real chart decisions.",
  },
  {
    title: "No clear learning path",
    description:
      "Beginners jump between random strategies without mastering basics like candlesticks, support, and market structure first.",
  },
  {
    title: "Learning with real money",
    description:
      "Most people only learn after losing. TradeTrainer Academy lets you practice setups safely until the patterns feel familiar.",
  },
]

export function Problem() {
  return (
    <section className="border-y border-border/60 bg-card/20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-sm text-destructive">
            <AlertTriangleIcon />
            Why beginners struggle
          </div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Trading education is broken for beginners
          </h2>
          <p className="mt-4 text-muted-foreground">
            TradeTrainer Academy fixes this with a structured path, interactive
            drills, and supportive AI feedback — not signal bots or hype.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {struggles.map((item) => (
            <Card key={item.title} className="border-border/60 bg-card/50">
              <CardContent className="flex flex-col gap-3 pt-6">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
