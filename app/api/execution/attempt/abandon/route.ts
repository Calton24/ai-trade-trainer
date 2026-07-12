import { NextResponse } from "next/server"

import { requireAuth } from "@/lib/api/auth-guard"
import { abandonScenarioAttempt } from "@/lib/execution-analytics/service"
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Analytics not configured." }, { status: 501 })
  }

  const body = (await request.json().catch(() => ({}))) as {
    attemptId?: string
    meaningfulInteraction?: boolean
  }

  if (!body.attemptId || typeof body.attemptId !== "string") {
    return NextResponse.json({ error: "attemptId is required." }, { status: 400 })
  }

  try {
    const admin = createAdminClient()
    const result = await abandonScenarioAttempt(
      admin,
      auth.user.id,
      body.attemptId,
      Boolean(body.meaningfulInteraction)
    )
    return NextResponse.json(result)
  } catch (error) {
    console.error("[execution/attempt/abandon]", error)
    return NextResponse.json({ error: "Failed to abandon attempt." }, { status: 500 })
  }
}
