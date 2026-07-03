#!/usr/bin/env node
/**
 * Referral performance report for a promo code.
 *
 * Usage:
 *   npm run referral:report -- --promo TRADER50
 */

import { createScriptAdmin, parseArgs } from "./lib/admin.mjs"

const args = parseArgs(process.argv.slice(2))
const promo = args.promo?.toUpperCase()

if (!promo) {
  console.error("Usage: npm run referral:report -- --promo TRADER50")
  process.exit(1)
}

const admin = createScriptAdmin()

const { data: partner, error: partnerError } = await admin
  .from("referral_partners")
  .select("*")
  .eq("promo_code", promo)
  .maybeSingle()

if (partnerError || !partner) {
  console.error(`No partner found for promo: ${promo}`)
  process.exit(1)
}

const { data: attributions, error } = await admin
  .from("referral_attributions")
  .select("*")
  .eq("partner_id", partner.id)
  .order("created_at", { ascending: false })

if (error) {
  console.error("Failed to load attributions:", error.message)
  process.exit(1)
}

const rows = attributions ?? []
const signups = rows.filter((r) => r.signed_up_at).length
const conversions = rows.filter((r) => r.converted_at).length
const grossRevenue = rows.reduce(
  (sum, r) => sum + Number(r.amount_gbp ?? 0),
  0
)
const estimatedCommission = rows.reduce(
  (sum, r) => sum + Number(r.commission_due_gbp ?? 0),
  0
)

const planBreakdown = rows
  .filter((r) => r.converted_at && r.plan)
  .reduce((acc, r) => {
    acc[r.plan] = (acc[r.plan] ?? 0) + 1
    return acc
  }, {})

console.log(`\nReferral report — ${partner.name} (${promo})\n`)
console.log("Summary:")
console.log({
  partnerSlug: partner.slug,
  commissionPercent: partner.commission_percent,
  signups,
  conversions,
  conversionRate:
    signups > 0 ? `${Math.round((conversions / signups) * 100)}%` : "n/a",
  grossRevenueGbp: grossRevenue.toFixed(2),
  estimatedCommissionGbp: estimatedCommission.toFixed(2),
  planBreakdown,
})

if (rows.length) {
  console.log("\nRecent attributions:")
  for (const row of rows.slice(0, 20)) {
    console.log({
      userId: row.user_id,
      signedUpAt: row.signed_up_at,
      convertedAt: row.converted_at,
      plan: row.plan,
      amountGbp: row.amount_gbp,
      commissionDueGbp: row.commission_due_gbp,
    })
  }
}
