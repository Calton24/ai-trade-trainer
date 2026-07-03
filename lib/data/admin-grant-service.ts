import type { SupabaseClient } from "@supabase/supabase-js"

import type { AdminGrant } from "@/lib/subscription/admin-grant-types"

interface AdminGrantRow {
  id: string
  user_id: string
  granted_by: string | null
  grant_type: string
  plan: string
  status: string
  starts_at: string
  expires_at: string | null
  reason: string | null
  created_at: string
  revoked_at: string | null
}

function mapRow(row: AdminGrantRow): AdminGrant {
  return {
    id: row.id,
    userId: row.user_id,
    grantedBy: row.granted_by,
    grantType: row.grant_type as AdminGrant["grantType"],
    plan: row.plan,
    status: row.status as AdminGrant["status"],
    startsAt: row.starts_at,
    expiresAt: row.expires_at,
    reason: row.reason,
    createdAt: row.created_at,
    revokedAt: row.revoked_at,
  }
}

/** Fetch the user's most recent potentially-active admin grant. */
export async function fetchActiveAdminGrant(
  supabase: SupabaseClient,
  userId: string
): Promise<AdminGrant | null> {
  const { data, error } = await supabase
    .from("admin_grants")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .is("revoked_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("[admin-grant] fetch failed", {
      userId,
      message: error.message,
      code: error.code,
      details: error.details,
    })
    return null
  }

  if (!data) return null
  return mapRow(data as AdminGrantRow)
}
