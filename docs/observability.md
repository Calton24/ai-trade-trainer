# Observability

TradeTrainer Academy ships with three optional, independently-configured
observability integrations: **Sentry** (error monitoring), **PostHog**
(product analytics), and **Resend** (transactional email). All three are
**disabled by default** and safely no-op until their environment variables
are set — nothing here requires an account, an API key, or a working
integration for local development, CI, or `npm run build` to succeed.

This document covers setup for each, the event/naming conventions used,
and — importantly — what we deliberately do **not** track.

## Required env vars

Add these to `.env.local` (never commit real values — see `.env.example`).
Every var is optional; each integration is enabled independently based on
whether its keys are present.

| Var | Where used | Required for |
| --- | --- | --- |
| `SENTRY_DSN` | server | Sentry (server/edge error capture) |
| `NEXT_PUBLIC_SENTRY_DSN` | client + server fallback | Sentry (browser error capture; also used server-side if `SENTRY_DSN` is unset) |
| `NEXT_PUBLIC_POSTHOG_KEY` | client + server | PostHog (both browser events and the server-side capture helper) |
| `NEXT_PUBLIC_POSTHOG_HOST` | client + server | PostHog (defaults to `https://us.i.posthog.com` if unset) |
| `RESEND_API_KEY` | server only | Resend |
| `RESEND_FROM_EMAIL` | server only | Resend (defaults to a placeholder `no-reply@` address if unset) |

## 1. Sentry — error monitoring

**Setup steps:**

1. Create a project at [sentry.io](https://sentry.io) (Next.js platform).
2. Copy the DSN into both `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` in
   `.env.local` (a single DSN works for both client and server traffic —
   they don't need to be different projects).
3. Restart the dev server. That's it — no build step or wizard required.

**How it's wired:**

- `instrumentation.ts` (Next.js server entry point) calls `register()` on
  boot, which initializes Sentry in the Node.js runtime only (skipped in
  the edge runtime for compatibility). It also exports `onRequestError`,
  which Next calls automatically for uncaught server errors (Server
  Components, Route Handlers, Server Actions, and the proxy).
- `instrumentation-client.ts` initializes Sentry in the browser before
  hydration, so it's in place before any client error can occur.
- `lib/observability/sentry.ts` is the only place app code should import
  from. It exports:
  - `captureError(error, context?)` — report an exception. Never throws.
  - `captureMessage(message, level, context?)` — report a non-error event
    worth knowing about (e.g. a misconfiguration).
  - Both no-op (with a dev-only `console.error`/`console.log`) if no DSN
    is configured.

**Where errors are already captured:**

- `app/api/checkout/route.ts` (session creation failures, missing admin
  credentials)
- `app/api/billing-portal/route.ts`
- `app/api/stripe/webhook/route.ts` (signature verification + handler
  failures)
- `app/api/progress/record-activity/route.ts` (event recording + stat
  recompute failures)
- `lib/auth/onboarding-actions.ts` (save + finalize flows)
- `lib/settings/use-user-settings.ts` (settings/profile save flow)
- Every other server/client error automatically, via
  `instrumentation.ts`'s `onRequestError` and `instrumentation-client.ts`.

To add a new capture point: `import { captureError } from "@/lib/observability/sentry"` and call it from a `catch` block with a small `context` object (route name, user id, relevant ids — never raw user content).

## 2. PostHog — product analytics

**Setup steps:**

1. Create a project at [posthog.com](https://posthog.com) (or self-hosted).
2. Copy the project API key into `NEXT_PUBLIC_POSTHOG_KEY`.
3. Set `NEXT_PUBLIC_POSTHOG_HOST` if self-hosting or using a region other
   than the US cloud default.
4. Restart the dev server.

**How it's wired:**

- `components/providers/analytics-provider.tsx` initializes PostHog once
  on mount and keeps identity in sync with the Supabase auth session
  (`identify()` on sign-in, `reset()` on sign-out/anonymous). It's mounted
  in `app/layout.tsx`, inside `AuthProvider`.
- `lib/analytics/posthog.ts` is the low-level client: `initPostHog`,
  `trackEvent`, `identifyUser`, `resetAnalytics`, and a server-only
  `captureServerEvent` (plain HTTP call to PostHog's capture endpoint, no
  `posthog-node` dependency — used for the one event that's more reliable
  server-side, `checkout_completed`, sent from the Stripe webhook).
- `lib/analytics/events.ts` is the **only place event names should be
  defined**. Always call these typed wrappers from UI/route code instead
  of calling `trackEvent` directly.
- Autocapture is explicitly disabled (`autocapture: false` in
  `initPostHog`) — we only ever send the explicit events below, so a
  stray click near sensitive UI (journal, trade notes) can never leak
  content.

**Tracked events:**

| Event | Wrapper | Fired from |
| --- | --- | --- |
| `sign_up_started` | `trackSignUpStarted` | `components/auth/sign-up-form.tsx` (mount) |
| `sign_up_completed` | `trackSignUpCompleted` | `components/onboarding/onboarding-wizard.tsx` (mount, via a sessionStorage flag set at signup — needed since the Supabase signup path redirects server-side) |
| `onboarding_started` | `trackOnboardingStarted` | `components/onboarding/onboarding-wizard.tsx` (mount) |
| `onboarding_completed` | `trackOnboardingCompleted` | `components/onboarding/onboarding-wizard.tsx` (on successful finalize) |
| `lesson_completed` | `trackLessonCompleted` | `components/providers/user-state-provider.tsx` (`markLessonComplete`) |
| `first_lesson_completed` | `trackFirstLessonCompleted` | same, when it's the user's first ever completed lesson |
| `quiz_completed` | `trackQuizCompleted` | `components/providers/user-state-provider.tsx` (`recordQuizAttempt`) |
| `checkout_started` | `trackCheckoutStarted` | `components/pricing/pricing-checkout-button.tsx` |
| `checkout_completed` | (server-side `captureServerEvent`) | `app/api/stripe/webhook/route.ts` on `checkout.session.completed` |
| `upgrade_modal_viewed` | `trackUpgradeModalViewed` | `components/auth/upgrade-modal.tsx` (on open) |
| `pro_gate_hit` | `trackProGateHit` | `components/auth/pro-access-required.tsx` (when a non-Pro user is actually blocked) |
| `pricing_viewed` | `trackPricingViewed` | `components/pricing/pricing-upgrade-banner.tsx` (mount) |
| `first_lesson_started` | `trackFirstLessonStarted` | exported, not yet wired to a call site — add where the first lesson view is detected |

## 3. Resend — transactional email

**Setup steps:**

1. Create an account at [resend.com](https://resend.com) and verify a
   sending domain.
2. Copy the API key into `RESEND_API_KEY`.
3. Set `RESEND_FROM_EMAIL` to a verified sender, e.g.
   `TradeTrainer Academy <no-reply@yourdomain.com>`.

**How it's wired:**

- `lib/email/resend.ts` exports `sendEmail({ to, subject, html, from? })`:
  - No `RESEND_API_KEY`, development: logs the would-be email to the
    console, returns `{ ok: true }` (so calling code doesn't need special
    dev-mode branching).
  - No `RESEND_API_KEY`, production: no-ops and reports a Sentry warning
    (`captureMessage(..., "warning")`) so a misconfigured deploy doesn't
    fail silently forever.
  - Send failures are reported via `captureError` and returned as
    `{ ok: false, error }` — never thrown.
- Templates live in `lib/email/templates/` and each export a pure function
  returning `{ subject, html }`:
  - `welcome.ts` — `welcomeEmail({ name })`
  - `payment-failed.ts` — `paymentFailedEmail({ name?, planLabel? })`
  - `weekly-progress.ts` — `weeklyProgressEmail({ name?, lessonsCompleted, xpEarned, currentStreak })`

**Not wired to any live flow yet, by design.** Creating an account and
setting `RESEND_API_KEY` will not cause any email to be sent — no signup
handler, webhook, or cron currently calls `sendEmail`. When ready to wire
a template up:

- Welcome: call from the signup success path once decided where "success"
  should be measured (email confirmation vs. first sign-in).
- Payment failed: call from `app/api/stripe/webhook/route.ts` on a new
  `invoice.payment_failed` case (not currently handled).
- Weekly progress: needs a scheduled job (none exists yet) that aggregates
  a user's week and calls `sendEmail` per user.

## Event naming conventions

- `snake_case`, past-tense verb for completed actions (`lesson_completed`),
  `_started` suffix for funnel entry points (`checkout_started`).
- Event names and their property shapes are defined **once**, in
  `lib/analytics/events.ts` — never call `trackEvent("some_new_name", …)`
  ad hoc from a component; add a wrapper first.
- Properties should be ids/enums/counts (`lessonId`, `plan`, `score`), not
  free text.

## Privacy rules

**Never send to analytics, error monitoring, or email templates:**

- Full email addresses or names to PostHog (identify by Supabase **user id
  only** — `identifyUser(user.id)`, never `identifyUser(user.email)`).
- Journal entries or trading notes (any free-text user content).
- Raw chart screenshots or other uploaded images.
- Payment details (card numbers, full Stripe objects) — only high-level
  plan ids/labels.
- Any of the above as `context` passed to `captureError`/`captureMessage`
  — Sentry breadcrumbs/extras are still a data-exfiltration surface. Stick
  to ids, route names, and short enums.

**What's safe to send:** content/entity ids (`lessonId`, `quizId`,
`planId`), aggregate counts (XP totals, streak length, lessons completed),
booleans/enums (`passed`, `source`), and the Supabase user id as the sole
identity key.
