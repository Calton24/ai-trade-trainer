# TradeTrainer Academy — v1 Beta Launch Checklist

**Status:** planning/documentation only. Nothing in this document changes
app code or infrastructure. Use it as a gate before inviting real (paying)
beta users.

**Companion doc:** [`docs/smoke-tests.md`](./smoke-tests.md) — step-by-step
manual tests for each area below. Run those *after* checking the boxes
here.

**⚠️ Known blocker as of this writing:** migrations `013`, `014`, and `015`
are written and reviewed (see `docs/database-v1.md`) but **have not been
applied** to the live Supabase project yet (no automated migration runner
exists in this repo — pushing is a manual, deliberate step). Until `015`
is pushed, the critical RLS hardening it provides is **not live**, meaning
a user could still self-award Pro/XP by crafting a direct Supabase request
today. **This must be resolved before beta users are invited.** See
[§2](#2-supabase-migrations) and [§3](#3-rls-verification).

---

## 1. Environment variables

Checked against `.env.example`. Every var below is read by name somewhere
in the app — none are aspirational.

| Var | Required for | If missing |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Auth, all DB access | App runs in local/mock mode — no persistence, no real auth (`isSupabaseConfigured()` gates this everywhere) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth, all DB access | Same as above |
| `SUPABASE_SERVICE_ROLE_KEY` | Checkout customer-id write, Stripe webhook, gamification recompute (`/api/progress/record-activity`) | Those routes return `501 Not configured` (`isAdminConfigured()`) instead of silently failing |
| `NEXT_PUBLIC_SITE_URL` | Stripe checkout/portal return URLs, OAuth callback | Falls back to `http://localhost:3000` — **must be set correctly in production** or Stripe redirects go to the wrong host |
| `STRIPE_SECRET_KEY` | All Stripe server calls | Checkout/billing-portal return `501` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Currently unused server-side; reserved for future client-side Stripe.js | — |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification | Webhook returns `501`; **no subscription state will ever update** |
| `STRIPE_WEEKLY_PRICE_ID` / `STRIPE_SIX_MONTH_PRICE_ID` / `STRIPE_ANNUAL_PRICE_ID` | Checkout session creation per plan | That specific plan's checkout returns `501` |
| `ENABLE_DEV_PRO_UNLOCK` | Local dev only | Must be **unset** (not just falsy) in staging/production — check this explicitly, see [§8](#8-free-vs-pro-access) |
| `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` | Error monitoring | Silently disabled, dev-console fallback only |
| `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` | Product analytics | Silently disabled |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Transactional email | No emails currently wired to send automatically either way — see `docs/observability.md` |

**Action items:**
- [ ] All Supabase/Stripe vars set in the hosting platform's **production**
      environment (not just `.env.local`)
- [ ] `NEXT_PUBLIC_SITE_URL` matches the real production domain (no
      trailing slash, correct scheme)
- [ ] `ENABLE_DEV_PRO_UNLOCK` confirmed **absent** from production env
- [ ] Stripe keys are **live** keys, not `sk_test_.../pk_test_...`, once
      leaving test mode (see [§4](#4-stripe-test-mode) for pre-launch
      testing, which should use test keys)
- [ ] Observability keys added if launching with monitoring on (optional
      for a private beta, strongly recommended before public beta)

## 2. Supabase migrations

Numbered, idempotent, forward-only — applied via `supabase db push`.

| Migration | Purpose | Status |
| --- | --- | --- |
| `001`–`012` | Base schema, learning progress, competence, gamification/leaderboard, user settings, Stripe subscriptions table, onboarding flow/schema | Assumed already applied (production has been running on this schema) |
| `013_database_audit_fixes.sql` | RLS policy gaps, missing FK indexes, `updated_at` triggers, dead column notes | **Written, not yet applied** |
| `014_storage_buckets.sql` | 6 storage buckets + RLS policies (avatars, journal-images, chart-screenshots, lesson-assets, library-assets, community-images) | **Written, not yet applied** |
| `015_harden_subscription_and_gamification_rls.sql` | **Critical** — closes the client-writable RLS gap on `user_subscriptions`, `user_stats`, `xp_events`, `user_achievements`, and gamification columns on `profiles` | **Written, not yet applied — blocks beta launch** |

**Push order matters:** `013` → `014` → `015`, in that order, in one
sitting. `015` must ship in the **same deploy** as the current app code
(the service-role-only write paths it requires — `/api/checkout`,
`/api/stripe/webhook`, `/api/progress/record-activity` — are already in
the codebase, but if `015` is pushed against an *older* deployed version
that still writes gamification fields via the user's own session, those
writes will start failing with permission errors).

**Action items:**
- [ ] Confirm current production DB migration state (`supabase migration
      list` or equivalent) — verify `001`–`012` are actually applied, not
      assumed
- [ ] Push `013`, `014`, `015` to a staging/preview Supabase project first
- [ ] Run the [RLS verification](#3-rls-verification) queries against
      staging
- [ ] Confirm the currently-deployed app code matches what `015` assumes
      (service-role write paths already merged) before pushing to
      production
- [ ] Push to production, then re-run RLS verification against production

## 3. RLS verification

Run as an **authenticated non-admin user** (real user JWT + anon key —
easiest via the browser console on a signed-in session, or a script using
`supabase.auth.signInWithPassword`).

**Should succeed (read-only, own row):**
```sql
select * from user_subscriptions where user_id = auth.uid();
select * from user_stats where user_id = auth.uid();
select * from xp_events where user_id = auth.uid();
select * from profiles where id = auth.uid();
```

**Should FAIL with a permission/RLS error (post-`015`):**
```sql
update user_subscriptions set plan = 'annual', status = 'active' where user_id = auth.uid();
update user_stats set lifetime_xp = 999999 where user_id = auth.uid();
insert into xp_events (user_id, source, amount, date_key, week_key, month_key)
  values (auth.uid(), 'fake', 999999, '2026-01-01', '2026-W01', '2026-01');
update profiles set xp = 999999, level = 99, streak = 999 where id = auth.uid();
```

**Should still succeed (identity/preference columns remain user-writable):**
```sql
update profiles set display_name = 'New Name', username = 'newname' where id = auth.uid();
```

**Storage RLS (post-`014`):**
- [ ] Upload to `avatars/{own-user-id}/...` succeeds
- [ ] Upload to `avatars/{someone-else's-user-id}/...` fails
- [ ] Public (unauthenticated) read of any `avatars/...` object succeeds
- [ ] Public read of a `journal-images/...` object **fails** (private bucket)
- [ ] Upload to `journal-images/{own-user-id}/...` succeeds; another
      user's folder fails

**Action items:**
- [ ] All of the above run against staging with `015` applied, before
      production push
- [ ] Repeat against production immediately after pushing `015`

## 4. Stripe test mode

- [ ] `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are
      **test-mode** keys (`sk_test_...` / `pk_test_...`)
- [ ] Three recurring test-mode Prices created (weekly, 6-month, annual)
      matching `lib/pricing/plans.ts` (£4.99/wk, £79.99/6mo, £129.99/yr) —
      IDs copied into `STRIPE_WEEKLY_PRICE_ID` / `STRIPE_SIX_MONTH_PRICE_ID`
      / `STRIPE_ANNUAL_PRICE_ID`
- [ ] Webhook endpoint added in the Stripe test-mode dashboard, pointing
      at `{site}/api/stripe/webhook`, subscribed to at least:
      `checkout.session.completed`, `customer.subscription.created`,
      `customer.subscription.updated`, `customer.subscription.deleted`
- [ ] `STRIPE_WEBHOOK_SECRET` copied from that endpoint into env
- [ ] Test cards on hand: `4242 4242 4242 4242` (success, any future
      expiry/CVC/ZIP), `4000 0000 0000 0002` (generic decline), `4000 0025
      0000 3155` (requires 3-D Secure — confirms the checkout flow
      survives the extra redirect)

Full checklist: [§5](#5-stripe-test-checklist).

## 5. Auth providers

- [ ] Email/password sign-up and sign-in work (Supabase built-in)
- [ ] Email confirmation flow: if "Confirm email" is enabled in Supabase
      Auth settings, verify the confirmation email arrives and
      `/auth/confirm` completes the flow correctly
- [ ] Each OAuth provider actually wired up in the Supabase dashboard
      (Google, Microsoft/Azure, Apple, GitHub — `lib/auth/providers.ts`)
      — the UI renders all four buttons unconditionally, so an
      unconfigured provider will fail at the Supabase redirect, not in
      the app
- [ ] OAuth redirect URL(s) registered with each provider match the
      production domain, not just `localhost`
- [ ] Password reset flow (`/forgot-password` → email → `/reset-password`)
      works end to end

## 6. Onboarding

- [ ] New sign-up always lands on `/onboarding` (never `/dashboard`
      directly) until `profile.onboardingCompleted` is true
- [ ] Draft answers persist across a page refresh mid-onboarding
      (`lib/onboarding/draft-storage.ts` — local draft merged with any
      remote-saved step)
- [ ] Username validation: uniqueness enforced, leaderboard opt-in step
      specifically requires a username to be set first
      (`isLeaderboardUsernameRequiredError`) — verify the wizard surfaces
      this clearly rather than a generic error
- [ ] Finalizing onboarding redirects to `/dashboard?welcome=1`
- [ ] Visiting `/onboarding` again after completion redirects away
      (`RouteGuard`, client-side)
- [ ] Trading-experience/goals/plan answers actually show up later in
      `/settings/profile` and influence path recommendations on
      `/dashboard`

## 7. Protected routes

Server-enforced in `proxy.ts` → `lib/supabase/middleware.ts` (this is the
real security boundary — client-side `RouteGuard` only prevents UI
flicker, it enforces nothing on its own). Full matrix: [§4 route access
matrix](#4-route-access-matrix) below (numbered independently — this is
checklist §7, the matrix is presented after the Stripe checklist for flow,
titled to match the prompt's requested "route access matrix" section).

- [ ] Confirm the proxy actually runs on every request (check response
      headers or Supabase auth cookie refresh) — an accidentally
      misconfigured `matcher` in `proxy.ts` would silently disable all
      server-side gating
- [ ] Confirm `requireAuth()`/`requireProUser()` guard every sensitive API
      route directly (defense in depth — don't rely on the proxy alone
      for API routes, since the proxy matcher excludes nothing under
      `/api`, but double-check `app/api/*/route.ts` each still call these
      guards)

## 8. Free vs Pro access

- [ ] `ENABLE_DEV_PRO_UNLOCK` is **not** set in any environment a real
      user could reach (it bypasses Pro-gating entirely — see
      `lib/subscription/access.ts`)
- [ ] Free authenticated users can reach: `/dashboard`, `/onboarding`,
      `/settings`, `/profile`, `/training`, `/learning-map`, and exactly
      one lesson: `/paths/trading-foundations/lessons/what-is-trading`
- [ ] Free authenticated users are redirected to
      `/pricing?upgrade=1&redirect=<path>` from every other educational
      route (see the full list in `lib/subscription/access.ts`
      `PRO_PATH_PREFIXES`)
- [ ] Pro users are never redirected away from any of the above
- [ ] A **cancelled-but-still-in-period** subscription still grants access
      (`hasProAccess` checks `currentPeriodEnd`, not just `status`)
- [ ] An **expired** subscription (`currentPeriodEnd` in the past) is
      correctly denied even if `status` is stale

## 9. Payment checkout

- [ ] `/pricing` → select a plan → redirected to a real Stripe Checkout
      page (not a 501/error)
- [ ] Completing checkout redirects back to
      `{redirectTo}?checkout=success` (or `/settings/billing?checkout=success`
      if no `redirectTo` was set)
- [ ] `user_subscriptions.provider_customer_id` gets set on **first**
      checkout for a user (created once, reused on subsequent
      plan-switch checkouts)
- [ ] Cancelling out of Stripe Checkout returns to
      `/pricing?checkout=cancelled` with no charge and no subscription row
      change

## 10. Billing portal

- [ ] "Manage subscription" only enabled once a Stripe customer exists
      (`provider === "stripe" && providerCustomerId` — a user who never
      checked out sees it disabled, not broken)
- [ ] Opens the real Stripe-hosted billing portal
- [ ] Portal's "Cancel subscription" flows back correctly and the local
      `user_subscriptions` row updates (via webhook, not the portal
      redirect itself — allow a few seconds)
- [ ] Portal's return URL sends the user back to `/settings/billing`

## 11. XP/progression

- [ ] XP is awarded only via the server-trusted path
      (`/api/progress/record-activity` → `lib/gamification/xp-catalog.ts`)
      — never trust a client-reported XP amount
- [ ] Every catalog event type awards the documented amount exactly once
      per its idempotency mode (`once` / `daily` / `daily-global` — see
      `lib/gamification/xp-catalog.ts`)
- [ ] `lifetime_xp`, `level`, `rank_tier`, and `streak` on `profiles` /
      `user_stats` are recomputed from `xp_events` on every call to
      `record-activity` — verify they self-heal (e.g. after a manual DB
      edit in staging, the next activity call corrects them)
- [ ] Quiz XP (`awardQuizXp`) awards pass/perfect bonuses independently
      and doesn't double-award on a repeated identical submission
- [ ] Streak calculation correctly handles the "haven't done anything
      today yet, but did yesterday" case without resetting to 0
      prematurely

## 12. Leaderboard

- [ ] Opt-in requires a username to be set (enforced at the onboarding/
      settings layer, not just silently ignored)
- [ ] Opting out immediately removes the user from `/leaderboard` (check
      the `leaderboard_public` view / RLS, not just client-side filtering)
- [ ] Users who never opted in are not listed by default
      (`011_leaderboard_opt_in_default.sql` — confirm the default is
      opt-out)
- [ ] Rank/XP shown on the leaderboard matches the trusted
      server-recomputed values, not anything client-cached
- [ ] `/leaderboard` is Pro-gated — a free user hits the upgrade redirect,
      not a broken/empty page

## 13. Settings/profile

- [ ] Profile fields (display name, username, country, trading
      experience/goals, preferred market, study intensity, learning plan,
      weekly target) save and reload correctly
- [ ] Privacy toggles (leaderboard visibility, show country/streak/rank/
      username) persist and are respected by the public leaderboard view
- [ ] Notification preference toggles persist (no email-sending is wired
      to them yet — see `docs/observability.md` — but the settings
      themselves should still save)
- [ ] "Reset progress" (a specific section) and "Request account
      deletion" both work and don't silently no-op
- [ ] Settings save errors are visible to the user, not just swallowed
      (now also reported to Sentry — see `lib/settings/use-user-settings.ts`)

## 14. Storage/avatar upload

- [ ] Avatar upload accepts PNG/JPEG/WEBP/GIF up to 2MB, rejects larger
      files and other MIME types client-side **and** server-side (bucket
      `file_size_limit`/`allowed_mime_types` in `014_storage_buckets.sql`
      is the real enforcement — client-side checks are just UX)
- [ ] Uploading an avatar does not take effect until "Save profile" is
      clicked (the upload writes to Storage immediately, but
      `avatar_url` on `profiles` only updates on the settings save call —
      confirm this two-step behaviour is intentional/acceptable for
      launch, or fix if it's confusing in practice)
- [ ] Removing an avatar deletes the Storage object and clears
      `avatar_url`
- [ ] A user cannot upload into another user's avatar folder (RLS,
      see [§3](#3-rls-verification))

## 15. Sentry/PostHog/Resend

See `docs/observability.md` for full detail. For launch:

- [ ] Decide: launch observability-blind (all three unset) or with
      monitoring on. Recommendation: **at least Sentry on** before any
      real user traffic — errors in a paid product need to be visible.
- [ ] If enabling Sentry: DSN set in both `SENTRY_DSN` and
      `NEXT_PUBLIC_SENTRY_DSN`, confirm a deliberately-thrown test error
      shows up in the Sentry project within a minute
- [ ] If enabling PostHog: key set, confirm `pricing_viewed` or another
      early-funnel event shows up in the PostHog project live view
- [ ] If leaving Resend unset: confirmed acceptable that zero
      transactional emails send (no welcome email, no payment-failed
      email) — this is a real product gap for launch, not just a nice-to
      -have, if user volume grows
- [ ] All three confirmed **absent from local dev** don't break anything
      (see [smoke tests N/O](./smoke-tests.md))

## 16. Legal/disclaimers

- [ ] `/terms`, `/privacy`, `/risk-disclaimer` all render and are linked
      from the footer
- [ ] Educational-simulator disclaimer visible on `/pricing` (already
      present per `app/pricing/page.tsx`) and ideally also on `/dashboard`
      or another high-traffic authenticated page
- [ ] Terms/privacy content actually reviewed by a human (not just
      present) before accepting real payments

## 17. Mobile responsiveness

Manual pass on a real phone (or device emulation) for:

- [ ] `/`, `/pricing`, `/sign-up`, `/sign-in` (first-touch pages — most
      beta traffic will land here on mobile)
- [ ] `/onboarding` wizard (multi-step forms are the highest-risk area
      for mobile layout breakage)
- [ ] `/dashboard`, a lesson page, a quiz page (core loop)
- [ ] Stripe Checkout and the billing portal (hosted by Stripe, but
      confirm the redirect back into the app renders correctly on mobile)
- [ ] Any horizontal scroll, overlapping text, or unreachable buttons —
      treat as launch blockers, not polish

## 18. Deployment readiness

- [ ] `npm run build` succeeds cleanly on the exact commit being deployed
      (see verification run at the bottom of this doc)
- [ ] `npx tsc --noEmit` clean
- [ ] Production environment variables set in the hosting platform (not
      just committed to `.env.example`)
- [ ] Custom domain configured and `NEXT_PUBLIC_SITE_URL` matches it
      exactly
- [ ] Stripe webhook endpoint URL updated to the **production** domain
      (a separate webhook + secret from the test-mode one used during
      QA)
- [ ] Supabase project confirmed as the **production** project, not the
      dev/staging one used for migration testing
- [ ] Rollback plan: confirm the hosting platform's previous-deployment
      rollback works (test it once on a throwaway change) before relying
      on it during a real incident

---

## 3. Test user matrix

Create these as real accounts in the **test/staging** environment before
running the smoke tests. Reuse them across test runs rather than
recreating each time.

| Account | How to set up | Purpose |
| --- | --- | --- |
| **Logged out visitor** | No account — just an unauthenticated browser session (or incognito) | Public-page and redirect-to-sign-in behaviour |
| **Free onboarded user** | Sign up, complete onboarding, never check out | Free-tier route gating, single free lesson, upgrade prompts |
| **Paid active user** | Sign up → complete onboarding → checkout with `4242 4242 4242 4242` on any plan | Full Pro access, billing portal, XP/leaderboard as a real user |
| **Cancelled user** | From a paid active account, cancel via the billing portal but **before** the current period ends | Access should persist until `current_period_end` — the highest-risk "did we get this right" case |
| **Expired user** | Either wait out a cancelled subscription's period end, or (staging only) manually backdate `current_period_end` in the DB via the service-role client | Access should be revoked; confirms `hasProAccess`'s period-end check, not just `status` |
| **Leaderboard-private user** | Any onboarded user who does not opt in (or opts out) on the leaderboard privacy toggle | Confirms exclusion from `/leaderboard` and the public view |
| **Leaderboard-public user** | Onboarded user, sets a username, opts in to the leaderboard | Confirms inclusion and that displayed stats match trusted server values |

## 4. Route access matrix

Enforced server-side in `lib/supabase/middleware.ts` /
`lib/subscription/access.ts`. "Free user" = authenticated, no active Pro
subscription. "Pro user" = authenticated, `hasProAccess()` true.

| Route | Logged out | Free user | Pro user | Expected redirect/access |
| --- | --- | --- | --- | --- |
| `/` | ✅ renders | ✅ renders | ✅ renders | Public |
| `/pricing` | ✅ renders | ✅ renders | ✅ renders (shows "Manage Plan" instead of checkout buttons) | Public |
| `/dashboard` | ❌ → `/sign-in?redirect=/dashboard` | ✅ renders | ✅ renders | Free-authenticated |
| `/onboarding` | ❌ → `/sign-in?redirect=/onboarding` | ✅ renders (or → `/dashboard` if already completed) | Same | Free-authenticated, client-redirected once complete |
| `/paths` | ❌ → sign-in | ❌ → `/pricing?upgrade=1&redirect=/paths` | ✅ renders | Pro-only |
| `/paths/trading-foundations/lessons/what-is-trading` (free lesson) | ❌ → sign-in | ✅ renders | ✅ renders | **Exception** — the one free lesson |
| `/paths/trading-foundations/lessons/what-moves-price` (paid lesson) | ❌ → sign-in | ❌ → `/pricing?upgrade=1&redirect=...` | ✅ renders | Pro-only |
| `/chart-lab` | ❌ → sign-in | ❌ → upgrade redirect | ✅ renders | Pro-only |
| `/library` | ❌ → sign-in | ❌ → upgrade redirect | ✅ renders | Pro-only |
| `/flashcards` | ❌ → sign-in | ❌ → upgrade redirect | ✅ renders | Pro-only |
| `/leaderboard` | ❌ → sign-in | ❌ → upgrade redirect | ✅ renders | Pro-only |
| `/settings` | ❌ → sign-in | ✅ renders | ✅ renders | Free-authenticated |
| `/progression` | ❌ → sign-in | ❌ → upgrade redirect | ✅ renders | Pro-only |

Also worth spot-checking (not in the prompt's list but same matrix logic):
`/book-lab`, `/trend-spotter`, `/strategy-wiki`, `/simulator`,
`/trader-readiness`, `/journal`, `/progress`, `/learn`, `/quiz`,
`/quizzes` — all Pro-only per `PRO_PATH_PREFIXES`.

**Note on `/sign-in` and `/sign-up`:** an already-authenticated user
hitting either is redirected to `/dashboard` regardless of plan
(`isAuthEntryPath` check in `updateSession`).

## 5. Stripe test checklist

- [ ] `STRIPE_SECRET_KEY` / publishable key configured (test mode)
- [ ] Webhook endpoint configured in Stripe test dashboard, secret in
      `STRIPE_WEBHOOK_SECRET`
- [ ] `checkout.session.completed` fires and is handled — confirm via
      Stripe's webhook event log ("Succeeded" with a 200 response) and
      that `upsertSubscriptionFromStripe` ran (check `user_subscriptions`
      row)
- [ ] `customer.subscription.created` handled (fires alongside
      `checkout.session.completed` for new subscriptions — confirm no
      duplicate/conflicting writes)
- [ ] `customer.subscription.updated` handled (trigger via a plan change
      or the billing portal)
- [ ] `customer.subscription.deleted` handled (trigger via
      cancel-immediately in the Stripe dashboard, not just
      cancel-at-period-end) — confirms `markSubscriptionCancelled` runs
- [ ] `user_subscriptions` row reflects `plan`, `status`,
      `current_period_start/end`, `provider_subscription_id` correctly
      after each of the above
- [ ] Pro access granted immediately after `checkout.session.completed`
      is processed (allow the few seconds the billing panel already polls
      for)
- [ ] Cancel-at-period-end is respected: `status` may show `cancelled`
      immediately, but `hasProAccess()` still returns true until
      `current_period_end` passes

## 6. Supabase checklist

- [ ] Migrations `013`/`014`/`015` applied to the target environment
      (see [§2](#2-supabase-migrations) — **currently not applied
      anywhere**, this is the top launch blocker)
- [ ] RLS enabled on every table holding user data (should already be
      true project-wide; spot-check `user_subscriptions`, `user_stats`,
      `xp_events`, `profiles`, `user_settings`, `privacy_settings`,
      `notification_preferences`)
- [ ] All 6 storage buckets exist (`avatars`, `journal-images`,
      `chart-screenshots`, `lesson-assets`, `library-assets`,
      `community-images`) with correct public/private flags
- [ ] Avatar bucket policy works: own-folder upload/update/delete
      succeeds, cross-user write fails, public read succeeds (see
      [§3](#3-rls-verification))
- [ ] A user **cannot** update their own `user_subscriptions` row
      directly (RLS test in [§3](#3-rls-verification))
- [ ] A user **cannot** insert into `xp_events` directly (same section)

---

## Verification run for this document

```bash
npx tsc --noEmit
npm run build
```

Both should be clean/successful — this document itself makes no code
changes, so these commands only confirm the baseline is still healthy at
the time this checklist was written.
