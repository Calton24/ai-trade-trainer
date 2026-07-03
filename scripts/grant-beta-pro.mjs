#!/usr/bin/env node
/**
 * Grant beta Pro access to a user by email (admin_grants table).
 *
 * Usage:
 *   npm run grant:beta -- --email tester@example.com --days 30 --reason "Private beta"
 */

import {
  createScriptAdmin,
  findUserIdByEmail,
  parseArgs,
} from "./lib/admin.mjs"

const args = parseArgs(process.argv.slice(2))
const email = args.email
const days = Number(args.days ?? 30)
const reason = args.reason ?? "Private beta"

if (!email) {
  console.error(
    "Usage: npm run grant:beta -- --email tester@example.com --days 30 --reason \"Private beta\""
  )
  process.exit(1)
}

if (!Number.isFinite(days) || days < 1) {
  console.error("--days must be a positive number")
  process.exit(1)
}

const admin = createScriptAdmin()
const userId = await findUserIdByEmail(admin, email)

if (!userId) {
  console.error(`No user found for email: ${email}`)
  console.error("The tester must sign up first, then run this script.")
  process.exit(1)
}

const startsAt = new Date()
const expiresAt = new Date(startsAt)
expiresAt.setDate(expiresAt.getDate() + days)

const { data: existing } = await admin
  .from("admin_grants")
  .select("id, status")
  .eq("user_id", userId)
  .eq("status", "active")
  .is("revoked_at", null)
  .maybeSingle()

if (existing) {
  const { error } = await admin
    .from("admin_grants")
    .update({
      expires_at: expiresAt.toISOString(),
      reason,
    })
    .eq("id", existing.id)

  if (error) {
    console.error("Failed to extend grant:", error.message)
    process.exit(1)
  }

  console.log("Extended existing beta grant:")
} else {
  const { error } = await admin.from("admin_grants").insert({
    user_id: userId,
    grant_type: "beta_pro",
    plan: "manual_pro",
    status: "active",
    starts_at: startsAt.toISOString(),
    expires_at: expiresAt.toISOString(),
    reason,
  })

  if (error) {
    console.error("Failed to create grant:", error.message)
    process.exit(1)
  }

  console.log("Created beta Pro grant:")
}

console.log({
  email,
  userId,
  days,
  expiresAt: expiresAt.toISOString(),
  reason,
})
