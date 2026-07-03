#!/usr/bin/env node
/**
 * Local Stripe CLI helpers for TradeTrainer Academy.
 *
 * Wraps the official Stripe CLI with a friendly error when it is not installed.
 * Does NOT write STRIPE_WEBHOOK_SECRET to .env.local — copy the whsec_ value
 * from `npm run stripe:listen` output manually after each new listener session.
 */

import { spawn, spawnSync } from "node:child_process"

const WEBHOOK_FORWARD_URL = "localhost:3000/api/stripe/webhook"

const INSTALL_HELP = `
Stripe CLI is not installed or not on your PATH.

Install it (macOS):

  brew install stripe/stripe-cli/stripe

or:

  npm install -g @stripe/cli

Then authenticate once:

  npm run stripe:login

Docs: https://docs.stripe.com/stripe-cli
`.trim()

function stripeAvailable() {
  const result = spawnSync("stripe", ["--version"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  })
  return result.status === 0
}

function printInstallHelp() {
  console.error(`\n${INSTALL_HELP}\n`)
  process.exit(1)
}

function runStripe(args, { inherit = true } = {}) {
  if (!stripeAvailable()) {
    printInstallHelp()
  }

  const child = spawn("stripe", args, {
    stdio: inherit ? "inherit" : "pipe",
    shell: process.platform === "win32",
  })

  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal)
    process.exit(code ?? 1)
  })

  child.on("error", (err) => {
    if (err.code === "ENOENT") {
      printInstallHelp()
    }
    console.error(err.message)
    process.exit(1)
  })
}

const command = process.argv[2]

switch (command) {
  case "login":
    if (!stripeAvailable()) {
      printInstallHelp()
    }
    console.log("Opening Stripe login — follow the browser prompt.\n")
    runStripe(["login"])
    break

  case "listen": {
    if (!stripeAvailable()) {
      printInstallHelp()
    }
    console.log("Forwarding Stripe webhooks to your local app.\n")
    console.log(`  → http://${WEBHOOK_FORWARD_URL}\n`)
    console.log(
      "When the listener starts, copy the webhook signing secret (whsec_…)\n" +
        "into .env.local as STRIPE_WEBHOOK_SECRET, then restart: npm run dev\n"
    )
    console.log("Leave this process running while testing checkout.\n")
    runStripe(["listen", "--forward-to", WEBHOOK_FORWARD_URL])
    break
  }

  case "events":
    runStripe(["events", "list", "--limit", "10"])
    break

  case "resend": {
    const eventId = process.argv[3]
    if (!eventId || !eventId.startsWith("evt_")) {
      console.error(
        "Usage: npm run stripe:resend -- evt_xxxxxxxx\n\n" +
          "List recent events: npm run stripe:events"
      )
      process.exit(1)
    }
    runStripe(["events", "resend", eventId])
    break
  }

  default:
    console.log(`TradeTrainer Academy — Stripe CLI helpers

Usage:
  npm run stripe:login    Authenticate with Stripe (once per machine)
  npm run stripe:listen   Forward webhooks to local /api/stripe/webhook
  npm run stripe:events   List the 10 most recent Stripe events
  npm run stripe:resend -- evt_xxx   Resend a webhook event

See docs/stripe-local.md for the full local payment test flow.
`)
    process.exit(command ? 1 : 0)
}
