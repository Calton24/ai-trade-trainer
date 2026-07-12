import { NextResponse } from "next/server"

import { requireAuth } from "@/lib/api/auth-guard"
import {
  buildLearnerAnalytics,
  fetchLearnerAttempts,
} from "@/lib/execution-analytics/learner-aggregates"

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  try {
    const attempts = await fetchLearnerAttempts(auth.supabase, auth.user.id, 80)
    const analytics = buildLearnerAnalytics(attempts)
    return NextResponse.json(analytics)
  } catch (error) {
    console.error("[execution/analytics/learner]", error)
    return NextResponse.json({ error: "Failed to load analytics." }, { status: 500 })
  }
}
