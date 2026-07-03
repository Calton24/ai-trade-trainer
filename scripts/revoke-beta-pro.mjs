#!/usr/bin/env node
/**
 * Revoke beta Pro access for a user by email.
 *
 * Usage:
 *   npm run revoke:beta -- --email tester@example.com
 */

import {
  createScriptAdmin,
  findUserIdByEmail,
  parseArgs,
} from "./lib/admin.mjs"

const args = parseArgs(process.argv.slice(2))
const email = args.email

if (!email) {
  console.error("Usage: npm run revoke:beta -- --email tester@example.com")
  process.exit(1)
}

const admin = createScriptAdmin()
const userId = await findUserIdByEmail(admin, email)

if (!userId) {
  console.error(`No user found for email: ${email}`)
  process.exit(1)
}

const now = new Date().toISOString()

const { data, error } = await admin
  .from("admin_grants")
  .update({ status: "revoked", revoked_at: now })
  .eq("user_id", userId)
  .eq("status", "active")
  .is("revoked_at", null)
  .select("id")

if (error) {
  console.error("Failed to revoke grant:", error.message)
  process.exit(1)
}

if (!data?.length) {
  console.log(`No active beta grant found for ${email}`)
  process.exit(0)
}

console.log(`Revoked beta Pro for ${email} (${userId})`)
