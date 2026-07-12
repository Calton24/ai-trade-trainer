import { NextResponse } from "next/server"

import { requireAuth } from "@/lib/api/auth-guard"
import { startScenarioAttempt } from "@/lib/execution-analytics/service"
import type { ExecutionMode } from "@/lib/execution-lab/types"
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"

const MODES = new Set<ExecutionMode>(["guided", "practice", "arcade"])

export async function POST(request: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Analytics not configured." }, { status: 501 })
  }

  const body = (await request.json().catch(() => ({}))) as {
    scenarioId?: string
    mode?: string
  }

  if (!body.scenarioId || typeof body.scenarioId !== "string") {
    return NextResponse.json({ error: "scenarioId is required." }, { status: 400 })
  }

  const mode = body.mode as ExecutionMode
  if (!mode || !MODES.has(mode)) {
    return NextResponse.json({ error: "Invalid mode." }, { status: 400 })
  }

  try {
    const admin = createAdminClient()
    const result = await startScenarioAttempt(admin, auth.user.id, body.scenarioId, mode)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error && error.message === "UNKNOWN_SCENARIO") {
      return NextResponse.json({ error: "Unknown scenario." }, { status: 400 })
    }
    console.error("[execution/attempt/start]", error)
    return NextResponse.json({ error: "Failed to start attempt." }, { status: 500 })
  }
}
