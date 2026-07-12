import { NextResponse } from "next/server"

import { requireAuth } from "@/lib/api/auth-guard"
import { completeScenarioAttempt } from "@/lib/execution-analytics/service"
import type { AttemptCompletePayload } from "@/lib/execution-analytics/types"
import type { TradeDirection } from "@/lib/execution-lab/types"
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"

const DIRECTIONS = new Set<TradeDirection>(["buy", "sell", "wait", "no-trade"])

function parsePayload(body: unknown): AttemptCompletePayload | null {
  if (!body || typeof body !== "object") return null
  const b = body as Record<string, unknown>
  if (typeof b.attemptId !== "string") return null
  if (typeof b.direction !== "string" || !DIRECTIONS.has(b.direction as TradeDirection)) {
    return null
  }
  const num = (k: string) =>
    typeof b[k] === "number" && Number.isFinite(b[k] as number) ? (b[k] as number) : 0

  return {
    attemptId: b.attemptId,
    direction: b.direction as TradeDirection,
    strategy: typeof b.strategy === "string" ? b.strategy : null,
    entry: num("entry"),
    stop: num("stop"),
    target: num("target"),
    lots: num("lots"),
    accountSize: num("accountSize"),
    riskPercent: num("riskPercent"),
    confidence: num("confidence"),
    hintsUsed: typeof b.hintsUsed === "number" ? Math.max(0, b.hintsUsed) : 0,
    revealUsed: Boolean(b.revealUsed),
    ruleViolations: Array.isArray(b.ruleViolations) ? b.ruleViolations : [],
    managementScore:
      typeof b.managementScore === "number" ? b.managementScore : undefined,
    outcome:
      typeof b.outcome === "string"
        ? (b.outcome as AttemptCompletePayload["outcome"])
        : null,
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Analytics not configured." }, { status: 501 })
  }

  const payload = parsePayload(await request.json().catch(() => null))
  if (!payload) {
    return NextResponse.json({ error: "Invalid completion payload." }, { status: 400 })
  }

  try {
    const admin = createAdminClient()
    const result = await completeScenarioAttempt(admin, auth.user.id, payload)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNKNOWN_SCENARIO") {
        return NextResponse.json({ error: "Unknown scenario." }, { status: 400 })
      }
      if (error.message === "ATTEMPT_NOT_FOUND") {
        return NextResponse.json({ error: "Attempt not found." }, { status: 404 })
      }
    }
    console.error("[execution/attempt/complete]", error)
    return NextResponse.json({ error: "Failed to complete attempt." }, { status: 500 })
  }
}
