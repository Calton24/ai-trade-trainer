# Deployment — TradeTrainer Academy

Private beta deployment guide for Vercel + Supabase + Stripe.

## Prerequisites

- Vercel account connected to this GitHub repo
- Supabase project (production)
- Stripe account (start in **test mode**, switch to live when ready)
- Domain (optional for first deploy — Vercel preview URL works for internal testing)

---

## 1. Apply database migrations

Before first production deploy, apply all migrations to your Supabase project:

```bash
# Option A: Supabase CLI (recommended)
supabase link --project-ref YOUR_PROJECT_REF
supabase db push

# Option B: Supabase Dashboard → SQL Editor
# Run each file in supabase/migrations/ in numeric order (001 → 016).
```

**Critical migrations for beta:**

| Migration | Purpose |
|-----------|---------|
| `013_database_audit_fixes.sql` | Schema audit fixes |
| `014_storage_buckets.sql` | Avatar storage buckets |
| `015_harden_subscription_and_gamification_rls.sql` | Block client entitlement/gamification writes |
| `016_admin_grants_and_referrals.sql` | Beta Pro grants + referral attribution |

### Verify RLS after migrations

Run in Supabase SQL Editor as an authenticated test user (or use the dashboard policy tester):

```sql
-- Should return own row only
select * from public.user_subscriptions where user_id = auth.uid();

-- Should fail (permission denied)
update public.user_subscriptions set plan = 'annual', status = 'active'
where user_id = auth.uid();

-- Should fail (permission denied)
insert into public.xp_events (user_id, event_type, xp_amount)
values (auth.uid(), 'test', 9999);

-- Should return own grants only (after 016)
select * from public.admin_grants where user_id = auth.uid();
```

### Verify storage buckets

In Supabase Dashboard → Storage, confirm buckets from migration `014` exist and policies match `docs/storage.md`.

---

## 2. Vercel environment variables

Set these in **Vercel → Project → Settings → Environment Variables** for **Production** (and Preview if you want parity).

### Required

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — never expose to client |
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` or `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | From Stripe Dashboard webhook endpoint |
| `STRIPE_WEEKLY_PRICE_ID` | `price_...` (not `prod_...`) |
| `STRIPE_SIX_MONTH_PRICE_ID` | `price_...` |
| `STRIPE_ANNUAL_PRICE_ID` | `price_...` |

### Recommended

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, e.g. `https://tradetraineracademy.vercel.app` — used in auth redirects and referral links |
| `NEXT_PUBLIC_POSTHOG_KEY` | Analytics |
| `NEXT_PUBLIC_POSTHOG_HOST` | e.g. `https://eu.i.posthog.com` |
| `SENTRY_DSN` | Server error tracking |
| `NEXT_PUBLIC_SENTRY_DSN` | Client error tracking |
| `RESEND_API_KEY` | Transactional email |
| `RESEND_FROM_EMAIL` | e.g. `hello@tradetrainer.ai` |

### Private beta (5-tester cohort)

Set during private beta to hide checkout and de-emphasise pricing:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_PRIVATE_BETA` | `true` |

When enabled:

- `/pricing` shows invite-only message (no checkout buttons)
- `/api/checkout` returns 403
- Pro-gated routes redirect free users to `/dashboard?beta=limited` instead of pricing
- Pricing nav links hidden

Remove or set to `false` when opening public payments.

### Must NOT be set in production

| Variable | Why |
|----------|-----|
| `ENABLE_DEV_PRO_UNLOCK` | Bypasses all Pro gating |
| `NEXT_PUBLIC_ENABLE_DEV_PRO_UNLOCK` | Same bypass in browser |

`isDevProUnlockEnabled()` returns `false` in production even if these are accidentally set — but **do not set them** on Vercel.

---

## 3. Vercel deploy

```bash
# Push your branch, then in Vercel:
# 1. Import / connect repo
# 2. Framework: Next.js (auto-detected)
# 3. Build command: npm run build
# 4. Output: default
# 5. Add env vars above
# 6. Deploy
```

Or via CLI:

```bash
npx vercel --prod
```

---

## 4. Stripe webhook (production)

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. URL: `https://yourdomain.com/api/stripe/webhook`
3. Events (minimum):
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy signing secret → `STRIPE_WEBHOOK_SECRET` in Vercel
5. Redeploy after setting the secret

### Test vs live mode

| | Test mode | Live mode |
|---|-----------|-----------|
| Keys | `sk_test_`, `pk_test_` | `sk_live_`, `pk_live_` |
| Cards | `4242 4242 4242 4242` | Real cards |
| Webhook | Separate endpoint + secret | Separate endpoint + secret |
| Prices | Test mode Price IDs | Live mode Price IDs |

Use test mode for private beta unless you want real charges.

---

## 5. Domain setup

1. Vercel → Project → Settings → Domains
2. Add your domain, follow DNS instructions
3. Set `NEXT_PUBLIC_SITE_URL` to the canonical URL
4. Supabase → Authentication → URL Configuration:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: add `https://yourdomain.com/auth/callback`

---

## 6. Post-deploy smoke tests

Run through `docs/post-deploy-smoke-test.md` after every production deploy.

Quick checklist:

- [ ] Landing page loads
- [ ] Sign up + onboarding
- [ ] Free user blocked from `/chart-lab`
- [ ] Stripe checkout → webhook → billing shows active
- [ ] Beta grant script unlocks Pro
- [ ] Referral link `?promo=CODE` attributes on signup
- [ ] Mobile pricing page readable at 390px

---

## 7. Beta tester workflow

See `docs/private-beta.md` for granting Pro without Stripe payment.

```bash
# After tester signs up:
npm run grant:beta -- --email tester@example.com --days 30 --reason "Private beta"
```

---

## 8. Referral partner setup

```bash
npm run referral:create -- --name "Trader Name" --slug tradername --promo TRADER50 --commission 50
```

Share: `https://yourdomain.com?promo=TRADER50`

Report: `npm run referral:report -- --promo TRADER50`

---

## Remaining blockers before public launch

- [ ] Migrations 013–016 applied to production Supabase
- [ ] Stripe live mode + live webhook (when charging real users)
- [ ] Mobile lesson UX improvements (tracked in `docs/mobile-qa.md`)
- [ ] Affiliate payout automation (attribution only for now)
- [ ] Email flows wired (welcome, payment failed — templates exist, not all wired)
