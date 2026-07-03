# Post-Deploy Smoke Test

Run after every production (or preview) deployment. ~20 minutes.

## A. Infrastructure

- [ ] `https://yourdomain.com` loads (no 5xx)
- [ ] `npm run build` passed in CI/Vercel
- [ ] Supabase migrations 013–016 applied
- [ ] Vercel env vars set (see `docs/deployment.md`)
- [ ] `ENABLE_DEV_PRO_UNLOCK` **not** set in production

---

## B. Auth

- [ ] Sign up with new email works
- [ ] Email confirmation flow (if enabled) works
- [ ] Sign in works
- [ ] Sign out works
- [ ] Session persists after browser refresh
- [ ] Onboarding completes and lands on dashboard

---

## C. Free user gating

- [ ] Free user can access `/dashboard`, `/settings`, `/learning-map`
- [ ] Free user can access first free lesson (`/paths/trading-foundations/lessons/what-is-trading`)
- [ ] Free user redirected from `/chart-lab` to `/pricing?upgrade=1`
- [ ] Free user redirected from `/library` to pricing

---

## D. Stripe checkout (test mode OK)

- [ ] `/pricing` → select plan → redirects to Stripe Checkout
- [ ] Test card `4242 4242 4242 4242` completes
- [ ] Redirect to `/settings/billing?checkout=success`
- [ ] Webhook received (Stripe Dashboard → Webhooks → event log)
- [ ] Billing shows active plan within ~30s
- [ ] `/chart-lab` accessible after activation
- [ ] "Manage subscription" opens Stripe billing portal

---

## E. Manual beta grant

Prerequisite: migration 016 applied.

```bash
npm run grant:beta -- --email smoke-test@example.com --days 7 --reason "Smoke test"
```

- [ ] User with grant sees **Beta Pro / Active** on billing
- [ ] `/chart-lab` accessible without Stripe
- [ ] Revoke works: `npm run revoke:beta -- --email smoke-test@example.com`
- [ ] Pro access removed after revoke

---

## F. Referral attribution

```bash
npm run referral:create -- --name "Smoke Partner" --slug smoke --promo SMOKE50 --commission 50
```

- [ ] Visit `https://yourdomain.com?promo=SMOKE50` in incognito
- [ ] Sign up new user
- [ ] Check `referral_attributions` row in Supabase (service role / SQL editor)
- [ ] Complete Stripe checkout for that user
- [ ] Attribution row has `converted_at`, `plan`, `amount_gbp`
- [ ] `npm run referral:report -- --promo SMOKE50` shows signup + conversion

---

## G. Mobile (quick pass)

At 390px width:

- [ ] Landing readable
- [ ] Pricing readable
- [ ] Sign up form usable
- [ ] Dashboard doesn't horizontal scroll

Full checklist: `docs/mobile-qa.md`

---

## H. Security spot checks

- [ ] View page source — no `SUPABASE_SERVICE_ROLE_KEY` or `STRIPE_SECRET_KEY`
- [ ] Browser console cannot PATCH `user_subscriptions` via Supabase client
- [ ] No `/api/admin/*` grant endpoints exist
- [ ] Referral commission data not visible in any user-facing API

---

## Pass criteria

All sections A–H pass, or failures are documented with severity and owner.

For private beta handoff to your 5 testers: sections A, B, C, E must pass. D and F can be validated once on production Stripe webhook.
