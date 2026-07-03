# Private Beta — Controlled Pro Access

Give selected testers Pro access **without Stripe payment**, without making it hackable.

## How it works

- Pro access from beta is stored in `admin_grants` (separate from Stripe `user_subscriptions`)
- Only **service-role scripts** can create/revoke grants
- Users can **read** their own grant row (for middleware/UI) but cannot write
- `hasProAccess()` returns true for active Stripe subscription **or** active admin grant
- Grants expire automatically via `expires_at`

**Users cannot self-grant Pro.** There is no client API to create grants.

---

## Invite a tester

### 1. Tester signs up normally

Send them your deployed URL:

```
https://yourdomain.com/sign-up
```

They complete sign-up and onboarding like any user.

### 2. You grant beta Pro (local machine with `.env.local`)

```bash
npm run grant:beta -- --email tester@example.com --days 30 --reason "Private beta"
```

Requirements:

- `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- Migration `016_admin_grants_and_referrals.sql` applied
- Tester account must already exist (script looks up by email)

### 3. Tester refreshes or re-logs in

Pro access is checked on:

- Server middleware (route protection)
- `/api/subscription/status` (billing UI)
- Client `SubscriptionProvider`

They should see **Beta Pro / Active** on Settings → Billing.

### 4. Verify Pro routes

Tester should access without upgrade prompts:

- `/chart-lab`
- `/library`
- `/flashcards`
- `/paths`

They should **not** see any admin tooling (there is none in the app UI).

---

## Recommended grant durations

| Audience | Days | Command |
|----------|------|---------|
| Normal beta testers | 30 | `--days 30` |
| Close collaborators | 90 | `--days 90` |
| Extended trial | 180 | `--days 180` |

---

## Revoke access early

```bash
npm run revoke:beta -- --email tester@example.com
```

Effect is immediate on next request (no page reload required for new API calls).

---

## Your 5 testers

Workflow for each person who reached out:

1. Send deploy URL + sign-up link
2. Ask them to sign up with the email they'll use
3. Run `grant:beta` with their email
4. Confirm they can open `/chart-lab`
5. Collect feedback (Discord/email/form — your choice)

---

## Security notes

| Threat | Mitigation |
|--------|------------|
| User patches own subscription | RLS migration 015 blocks client writes to `user_subscriptions` |
| User creates own admin grant | No INSERT policy; `revoke all` on write for `authenticated` |
| Client calls grant API | No grant API exists — scripts only |
| Dev unlock in production | `NODE_ENV === 'production'` disables bypass |
| Fake Stripe subscription | Webhook uses signature verification + service role |

---

## Stripe vs beta grant

| | Stripe subscription | Admin grant |
|---|---------------------|-------------|
| Table | `user_subscriptions` | `admin_grants` |
| Billing UI | Shows plan + manage portal | Shows "Beta Pro" + expiry |
| Revoke | Cancel in Stripe / webhook | `npm run revoke:beta` |
| Referral commission | Yes (on conversion) | No (not a paid conversion) |

A user can have both; Stripe plan shows when `proSource === 'stripe'`.
