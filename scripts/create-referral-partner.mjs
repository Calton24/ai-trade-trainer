#!/usr/bin/env node
/**
 * Create a referral partner for attribution tracking.
 *
 * Usage:
 *   npm run referral:create -- --name "Trader Name" --slug tradername --promo TRADER50 --commission 50
 */

import { createScriptAdmin, parseArgs } from "./lib/admin.mjs"

const args = parseArgs(process.argv.slice(2))
const name = args.name
const slug = args.slug?.toLowerCase()
const promo = args.promo?.toUpperCase()
const commission = Number(args.commission ?? 50)

if (!name || !slug || !promo) {
  console.error(
    'Usage: npm run referral:create -- --name "Trader Name" --slug tradername --promo TRADER50 --commission 50'
  )
  process.exit(1)
}

const admin = createScriptAdmin()

const { data, error } = await admin
  .from("referral_partners")
  .insert({
    name,
    slug,
    promo_code: promo,
    commission_percent: commission,
    status: "active",
  })
  .select("*")
  .single()

if (error) {
  console.error("Failed to create partner:", error.message)
  process.exit(1)
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com"

console.log("Referral partner created:")
console.log({
  id: data.id,
  name: data.name,
  slug: data.slug,
  promoCode: data.promo_code,
  commissionPercent: data.commission_percent,
})
console.log("\nShare links:")
console.log(`  ${baseUrl}?promo=${data.promo_code}`)
console.log(`  ${baseUrl}?ref=${data.slug}`)
