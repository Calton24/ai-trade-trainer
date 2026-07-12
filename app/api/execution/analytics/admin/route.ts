import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/admin/auth"
import {
  buildAdminAnalytics,
  fetchAdminAttemptRows,
} from "@/lib/execution-analytics/admin-aggregates"
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"

export async function GET(request: Request) {
  const gate = await requireAdmin()
  if (!gate.ok) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 })
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Not configured." }, { status: 501 })
  }

  const { searchParams } = new URL(request.url)
  const filters = {
    packId: searchParams.get("pack") || null,
    difficulty: searchParams.get("difficulty") || null,
    mode: searchParams.get("mode") || null,
    symbol: searchParams.get("symbol") || null,
    dateFrom: searchParams.get("from") || null,
    dateTo: searchParams.get("to") || null,
  }

  try {
    const admin = createAdminClient()
    const rows = await fetchAdminAttemptRows(admin, filters)
    const analytics = buildAdminAnalytics(rows, filters)
    return NextResponse.json(analytics)
  } catch (error) {
    console.error("[execution/analytics/admin]", error)
    return NextResponse.json({ error: "Failed to load admin analytics." }, { status: 500 })
  }
}
