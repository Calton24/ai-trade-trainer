import { NextResponse } from "next/server"

import { drillMarkMap, getDrillByType } from "@/lib/mock-data"
import type { AIReview, DrillType, TradeMark } from "@/lib/types"

interface ReviewRequest {
  marks: TradeMark[]
  drillType?: DrillType
  pair: string
}

function generateMockReview(
  marks: TradeMark[],
  drillType: DrillType = "place_entry_sl_tp"
): AIReview {
  const drill = getDrillByType(drillType)
  const required = drillMarkMap[drillType] ?? drill?.requiredMarks ?? []

  const strengths: string[] = []
  const mistakes: string[] = []
  let score = 40

  for (const markType of required) {
    const has = marks.some((m) => m.type === markType)
    const labels: Record<string, string> = {
      support: "support level",
      resistance: "resistance level",
      trend: "trend direction",
      break: "break level",
      retest: "retest zone",
      entry: "entry point",
      stop_loss: "stop loss",
      take_profit: "take profit",
    }
    if (has) {
      strengths.push(`You marked the ${labels[markType] ?? markType} — nice work!`)
      score += Math.floor(60 / required.length)
    } else {
      mistakes.push(
        `The ${labels[markType] ?? markType} wasn't marked. Try identifying it on the chart.`
      )
    }
  }

  score = Math.max(0, Math.min(100, score))

  let riskRewardFeedback: string | undefined
  const entry = marks.find((m) => m.type === "entry")
  const sl = marks.find((m) => m.type === "stop_loss")
  const tp = marks.find((m) => m.type === "take_profit")

  if (entry && sl && tp) {
    const risk = Math.abs(entry.price - sl.price)
    const reward = Math.abs(tp.price - entry.price)
    const rr = risk > 0 ? reward / risk : 0
    if (rr >= 2) {
      riskRewardFeedback = `Your risk/reward is about ${rr.toFixed(1)}:1 — that means your target is at least twice your risk. That's a solid plan for beginners.`
      score = Math.min(100, score + 5)
    } else if (rr > 0) {
      riskRewardFeedback = `Your risk/reward is about ${rr.toFixed(1)}:1. Beginners often aim for at least 2:1 — try placing your take profit further out or your stop loss closer (while still below structure).`
      mistakes.push("Risk/reward ratio is below the 2:1 guideline")
      score = Math.max(0, score - 10)
    }
  } else if (required.includes("stop_loss") || required.includes("take_profit")) {
    riskRewardFeedback =
      "Mark both your stop loss and take profit to get risk/reward feedback. This helps you plan before entering any setup."
  }

  const recommendation = score >= 60 ? "take" : "skip"

  const drillTitles: Record<DrillType, string> = {
    identify_support: "support identification",
    identify_resistance: "resistance identification",
    spot_trend: "trend reading",
    mark_break: "break marking",
    mark_retest: "retest marking",
    place_entry_sl_tp: "full Break & Retest setup",
  }

  return {
    score,
    strengths,
    mistakes,
    improvement:
      score >= 60
        ? "You're building good habits. Next time, double-check your levels against the most recent price action before submitting."
        : "Take your time with each marker. Look for the level that price has reacted to most clearly — not just the most recent wick.",
    recommendation,
    summary: `You completed the ${drillTitles[drillType]} drill with a score of ${score}/100. Keep practicing — every drill builds your chart-reading skills.`,
    beginnerExplanation: `Think of this drill like a quiz on the chart. You were asked to practice ${drillTitles[drillType]}. ${score >= 60 ? "You showed a solid understanding of the basics." : "Some key pieces were missing — review the lesson and try again. There's no rush."}`,
    riskRewardFeedback,
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as ReviewRequest

  await new Promise((resolve) => setTimeout(resolve, 1200))

  const review = generateMockReview(body.marks ?? [], body.drillType)

  // Wire to Supabase drill_sessions + ai_reviews when auth is configured

  return NextResponse.json({ review })
}
