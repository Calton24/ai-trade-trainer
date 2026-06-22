import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { TrainingChart } from "@/components/training/training-chart"
import { Button } from "@/components/ui/button"
import { generateMockCandles } from "@/lib/mock-data"

const previewCandles = generateMockCandles(40)

export function TrainingPreview() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <p className="text-sm font-medium text-primary">
              Interactive chart drills
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Practice marking support, breaks, and retests
            </h2>
            <p className="text-muted-foreground">
              Choose a drill type, click to place markers on the chart, and
              submit for instant feedback. No real money, no pressure — just
              repetition.
            </p>
            <Button className="w-fit" render={<Link href="/training" />}>
              Try a Drill
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-border/60 bg-card/80 ring-1 ring-white/[0.02]">
            <TrainingChart candles={previewCandles} readOnly />
          </div>
        </div>
      </div>
    </section>
  )
}
