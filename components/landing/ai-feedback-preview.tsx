import { CheckCircle2Icon, XCircleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const mockReview = {
  score: 78,
  beginnerExplanation:
    "You marked most of the key levels correctly. Your break and retest zones show you understand the setup — just watch for entering a bit too early.",
  strengths: [
    "Break level identified correctly",
    "Stop loss placed below structure",
  ],
  mistakes: ["Entry was slightly before retest confirmation"],
  improvement:
    "Wait for the candle to close above the retest level before marking your entry.",
  riskRewardFeedback:
    "Your risk/reward is about 2.1:1 — your target is roughly twice your risk. Good planning!",
}

export function AiFeedbackPreview() {
  return (
    <section className="border-y border-border/60 bg-card/20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <p className="text-sm font-medium text-primary">AI coach feedback</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Supportive feedback after every drill
            </h2>
            <p className="text-muted-foreground">
              Clear, beginner-friendly explanations — what you got right, what
              to improve, and risk/reward notes. Not guru talk, not signals.
            </p>
          </div>

          <Card className="border-border/60 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Drill Review</CardTitle>
              <Badge className="bg-primary text-primary-foreground">
                {mockReview.score}/100
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Progress value={mockReview.score} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {mockReview.beginnerExplanation}
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-primary">Correct</p>
                {mockReview.strengths.map((item) => (
                  <p
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2Icon className="mt-0.5 shrink-0 text-primary" />
                    {item}
                  </p>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-destructive">
                  To improve
                </p>
                {mockReview.mistakes.map((item) => (
                  <p
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <XCircleIcon className="mt-0.5 shrink-0 text-destructive" />
                    {item}
                  </p>
                ))}
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="text-xs font-medium">Risk/Reward</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {mockReview.riskRewardFeedback}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
