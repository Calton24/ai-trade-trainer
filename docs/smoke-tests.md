# TradeTrainer Academy — v1 Beta Smoke Tests

Manual, step-by-step tests. Run against a **staging** environment with
Stripe in test mode and (ideally) migrations `013`/`014`/`015` applied —
see [`docs/beta-launch-checklist.md`](./beta-launch-checklist.md) for the
account setup these tests assume (test user matrix) and the full route
matrix referenced throughout.

Each test lists: **Setup**, **Steps**, **Expected result**, **Pass/Fail**.

---

## A. New user signup

**Setup:** Logged-out browser, incognito recommended.

**Steps:**
1. Go to `/sign-up`.
2. Enter a new, unused email + password (or use an OAuth provider).
3. Submit.

**Expected result:**
- Account is created in Supabase Auth.
- A `profiles` row is created for the new user (check via Supabase table
  editor or `select * from profiles where id = '<uid>'`).
- User is redirected to `/onboarding`, not `/dashboard`.
- PostHog (if enabled): `sign_up_started` fires on form mount,
  `sign_up_completed` fires once landing on `/onboarding` (via the
  `sessionStorage` pending flag).

**Pass/Fail:** ☐

---

## B. Onboarding completion

**Setup:** Continue from test A, or any account with
`onboarding_completed = false`.

**Steps:**
1. Step through the onboarding wizard: experience level, trading goals,
   preferred market, study intensity, learning plan, weekly target days.
2. Refresh the page mid-way through (after step 2 or 3).
3. Confirm your answers are still there after refresh.
4. Finish the wizard.

**Expected result:**
- Mid-flow refresh does not lose answers (local draft + any already-saved
  step).
- On completion: `profiles.onboarding_completed = true`,
  `onboarding_completed_at` set, redirected to `/dashboard?welcome=1`.
- PostHog: `onboarding_started` (once) and `onboarding_completed` fire.
- Re-visiting `/onboarding` afterward redirects to `/dashboard`.

**Pass/Fail:** ☐

---

## C. Free user route gating

**Setup:** Free onboarded user (no active subscription), signed in.

**Steps:**
1. Visit `/dashboard`, `/settings`, `/training` — should all render.
2. Visit `/library`, `/chart-lab`, `/flashcards`, `/leaderboard`,
   `/progression`, `/paths` — should all redirect.

**Expected result:**
- Step 1 routes render normally.
- Step 2 routes redirect to `/pricing?upgrade=1&redirect=<original path>`.
- The `redirect` query param matches the page you tried to visit.
- No flash of protected content before the redirect (this is
  server-enforced in the proxy, not client-side).

**Pass/Fail:** ☐

---

## D. Free lesson access

**Setup:** Same free onboarded user as test C.

**Steps:**
1. Visit `/paths` directly → confirm redirect (per test C).
2. Visit `/paths/trading-foundations/lessons/what-is-trading` directly.
3. Complete the lesson.
4. Visit `/paths/trading-foundations/lessons/what-moves-price` (the
   *second* lesson in the same path).

**Expected result:**
- Step 2 renders fully — this is the one hardcoded free lesson.
- Step 3 completion is saved (`user_progress`/activity log) and awards
  XP per the catalog.
- Step 4 redirects to `/pricing?upgrade=1&...` — the free exception is
  exactly one lesson, not the whole path.

**Pass/Fail:** ☐

---

## E. Pro checkout with Stripe test card

**Setup:** Free onboarded user. Stripe test mode configured (keys,
prices, webhook — see checklist §4/§5).

**Steps:**
1. Go to `/pricing`, choose any plan, click its checkout CTA.
2. `trackCheckoutStarted` should fire (PostHog, if enabled) before the
   redirect.
3. On the Stripe Checkout page, enter `4242 4242 4242 4242`, any future
   expiry, any CVC/ZIP.
4. Complete payment.

**Expected result:**
- Redirected back to the app at `...?checkout=success`.
- Billing panel shows "Payment received — activating" then updates to
  the paid plan within ~5 seconds (it polls 4x at 1.5s intervals).
- `user_subscriptions` row created/updated: `plan` matches the chosen
  tier, `status = 'active'`, `provider = 'stripe'`,
  `provider_customer_id` and `provider_subscription_id` populated.
- `checkout_completed` server event captured via PostHog (if enabled)
  from the webhook handler.

**Pass/Fail:** ☐

---

## F. Pro route unlock after webhook

**Setup:** Continue directly from test E.

**Steps:**
1. Immediately after checkout success, visit `/library`, `/chart-lab`,
   `/leaderboard`, `/paths`.

**Expected result:**
- All render without redirect.
- If visited within the first second or two (before the webhook has been
  processed), a brief redirect-then-retry is acceptable, but access
  should be unlocked within a few seconds without needing a manual page
  reload loop.

**Pass/Fail:** ☐

---

## G. Cancel subscription in billing portal

**Setup:** Paid active user from test E/F.

**Steps:**
1. Go to `/settings/billing`, click "Manage subscription".
2. In the Stripe-hosted portal, cancel the subscription (choose
   cancel-at-period-end, the default).
3. Return to the app.
4. Re-visit a Pro route (e.g. `/library`).

**Expected result:**
- `user_subscriptions.status` updates to `cancelled` (via webhook) but
  `current_period_end` is unchanged (still in the future).
- Pro routes **still accessible** — `hasProAccess()` checks the period
  end, not just status.
- Billing panel shows "Access ends {date}" instead of "Renews {date}".

**Pass/Fail:** ☐

---

## H. XP from first lesson

**Setup:** Fresh free or paid user who has completed zero lessons.

**Steps:**
1. Complete the first lesson available to them.
2. Check `xp_events` for a new row (`source` matching the lesson
   activity type, `user_id` = this user).
3. Check `profiles.xp` / `user_stats.lifetime_xp` and `profiles.level`.

**Expected result:**
- Exactly one `xp_events` row is created for this lesson.
- `trackLessonCompleted` and `trackFirstLessonCompleted` both fire
  (PostHog, if enabled) — this is genuinely their first lesson.
- `lifetime_xp`/`xp`/`level` reflect the catalog amount for that activity
  type (see `lib/gamification/xp-catalog.ts`), recomputed server-side —
  not whatever the client's local `UserState` XP counter says.

**Pass/Fail:** ☐

---

## I. Duplicate XP prevention

**Setup:** Same user as test H, immediately after.

**Steps:**
1. Re-trigger the same completion event for the *same* lesson (e.g.
   revisit the lesson and hit "Mark complete" again, or replay the
   `/api/progress/record-activity` request for the identical fact via
   devtools/network tab).
2. Also try: reload the page entirely (simulates the historical bug
   where an in-memory "already synced" ref reset on refresh) and
   trigger a resync of the activity log.

**Expected result:**
- No second `xp_events` row is created for the same
  `(user_id, source, source_id)` (or `date_key` for daily-mode rewards).
- `hasExistingReward` returns true and the event is skipped server-side
  — this must hold even after a full page reload, since idempotency is
  DB-backed, not client-memory-backed.
- `lifetime_xp` is unchanged by the repeat attempt.

**Pass/Fail:** ☐

---

## J. Leaderboard opt-in

**Setup:** Onboarded user, not yet opted in to the leaderboard.

**Steps:**
1. Go to `/settings/privacy` (or wherever the leaderboard toggle lives)
   without a username set — attempt to opt in.
2. Set a username, then opt in.
3. Visit `/leaderboard` as this user, and as a second, unrelated user.
4. Opt back out.
5. Re-check `/leaderboard` as the second user.

**Expected result:**
- Step 1 is blocked with a clear message requiring a username first
  (not a silent failure or generic error).
- Step 3: the opted-in user appears on `/leaderboard` for both viewers,
  with rank/XP matching the server-recomputed values.
- Step 5: the user no longer appears for the second viewer immediately
  after opting out.

**Pass/Fail:** ☐

---

## K. Settings persistence

**Setup:** Any signed-in user.

**Steps:**
1. Change display name, country, and a privacy toggle in `/settings`.
2. Save.
3. Sign out, sign back in.
4. Revisit `/settings`.

**Expected result:**
- All changed values persist across the sign-out/sign-in cycle.
- No console errors; if a save fails, a visible error message appears
  (and is captured by Sentry if configured — check the Sentry project
  for a corresponding event during deliberate-failure testing, e.g. by
  temporarily revoking network access).

**Pass/Fail:** ☐

---

## L. Avatar upload

**Setup:** Any signed-in user, storage bucket `avatars` exists
(migration `014` applied).

**Steps:**
1. Go to `/settings/profile`, click "Upload image", choose a valid PNG
   under 2MB.
2. **Before** clicking "Save profile", refresh the page.
3. Repeat the upload, this time click "Save profile" afterward.
4. Try uploading a 10MB file, then a `.pdf`.
5. Click "Remove" on an existing avatar and save.

**Expected result:**
- Step 1: preview updates immediately, message says "Click Save profile
  to confirm."
- Step 2: since the DB `avatar_url` was never saved, the avatar reverts
  to its previous value after refresh (upload happened, but wasn't
  committed) — confirm this matches expectations, flag as UX polish if
  not.
- Step 3: `profiles.avatar_url` updates and persists after refresh.
- Step 4: both rejected with a clear error (file-size and MIME-type
  limits enforced both client-side and by the bucket's
  `file_size_limit`/`allowed_mime_types`).
- Step 5: avatar cleared, Storage object deleted.

**Pass/Fail:** ☐

---

## M. Sign out/sign in persistence

**Setup:** Paid active user with some progress (at least one completed
lesson, some XP, leaderboard opt-in set).

**Steps:**
1. Sign out.
2. Sign back in with the same credentials.
3. Check `/dashboard`, `/progression`, `/settings`.

**Expected result:**
- All progress, XP, plan/subscription status, and settings are exactly
  as before sign-out — nothing resets to local/mock defaults.
- No duplicate onboarding prompt.

**Pass/Fail:** ☐

---

## N. Error monitoring no-op without keys

**Setup:** Local/staging environment with `SENTRY_DSN` and
`NEXT_PUBLIC_SENTRY_DSN` both **unset**.

**Steps:**
1. Start the app (`npm run dev` or the staging deployment with no
   Sentry keys).
2. Trigger a deliberate error path (e.g. a failing API call, or
   temporarily throw in a component).
3. Check the server/browser console.

**Expected result:**
- No network calls to Sentry's ingest endpoint.
- App does not crash or behave differently than with Sentry configured.
- Dev-mode console shows the error was captured locally (per
  `lib/observability/sentry.ts`'s no-op/dev-log fallback), confirming the
  capture call sites are wired even though nothing is actually sent.

**Pass/Fail:** ☐

---

## O. PostHog no-op without keys

**Setup:** Local/staging environment with `NEXT_PUBLIC_POSTHOG_KEY`
**unset**.

**Steps:**
1. Start the app.
2. Sign in, visit `/pricing`, complete an onboarding step, view the
   upgrade modal.
3. Check the Network tab for any request to a PostHog domain.

**Expected result:**
- Zero requests to `i.posthog.com` / the configured `POSTHOG_HOST`.
- No console errors from `posthog-js` failing to initialize.
- All `trackX(...)` call sites (sign-up, onboarding, lesson/quiz
  completion, checkout, pricing, upgrade modal, pro-gate) execute without
  throwing — they should all be safe no-ops per `isPostHogEnabled()`.

**Pass/Fail:** ☐

---

## Verification run for this document

```bash
npx tsc --noEmit
npm run build
```

Both commands should be clean/successful — writing this test suite makes
no code changes, so this only confirms the baseline was healthy at the
time these tests were written. It does **not** substitute for actually
running tests A–O by hand against a real staging environment.
