# Stripe local development

Checkout can run without webhooks, but **Pro access only activates when your app
receives Stripe webhook events** and writes to `user_subscriptions`. Locally,
that means running the Stripe CLI listener.

## Prerequisites

- Stripe test-mode keys in `.env.local` (`STRIPE_SECRET_KEY`, `price_…` IDs)
- Supabase configured (`SUPABASE_SERVICE_ROLE_KEY` for webhook upserts)
- Next.js dev server (`npm run dev`)

## 1. Install the Stripe CLI

The npm scripts wrap the official CLI — they do not replace it.

**macOS (Homebrew — recommended):**

```bash
brew install stripe/stripe-cli/stripe
```

**npm global:**

```bash
npm install -g @stripe/cli
```

Verify:

```bash
stripe --version
```

If `stripe: command not found`, install using one of the options above, then
open a new terminal.

Official docs: [Stripe CLI](https://docs.stripe.com/stripe-cli)

## 2. Authenticate (once per machine)

```bash
npm run stripe:login
```

Follow the browser prompt to link your Stripe account.

## 3. Start the webhook listener

In a **separate terminal** from `npm run dev`:

```bash
npm run stripe:listen
```

You should see output like:

```
> Ready! Your webhook signing secret is whsec_xxxxxxxx
```

Copy that value into `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxx
```

**Important:**

- Do not commit `whsec_…` or any real keys.
- The signing secret can change when you restart `stripe listen` — update
  `.env.local` if it does.
- This script does **not** auto-write secrets to `.env.local` (by design).

## 4. Restart the dev server

Env vars are read at startup:

```bash
# In your dev terminal
Ctrl+C
npm run dev
```

## 5. Test checkout

1. Visit `/pricing` while signed in.
2. Click a plan → complete Stripe Checkout with test card `4242 4242 4242 4242`.
3. Watch the **listener terminal** for:

   ```
   checkout.session.completed
   customer.subscription.created
   ```

4. Watch the **dev server terminal** for:

   ```
   [stripe/webhook] checkout.session.completed
   [stripe/sync] upserted subscription
   ```

5. Refresh `/settings/billing` — plan should show **Active** (not Free/Inactive).

## 6. Resend a past event (no second payment)

If you paid before webhooks were configured:

```bash
npm run stripe:events
```

Find the `checkout.session.completed` event ID (`evt_…`), then:

```bash
npm run stripe:resend -- evt_xxxxxxxx
```

With `stripe listen` still running and `STRIPE_WEBHOOK_SECRET` set, refresh
billing.

## npm scripts reference

| Script | What it does |
| --- | --- |
| `npm run stripe:login` | `stripe login` with install check |
| `npm run stripe:listen` | Forward webhooks to `localhost:3000/api/stripe/webhook` |
| `npm run stripe:events` | List 10 recent events |
| `npm run stripe:resend -- evt_xxx` | Resend one event to your local webhook |

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `stripe: command not found` | Install CLI (step 1), open new terminal |
| Billing shows “webhook not configured” | Set `STRIPE_WEBHOOK_SECRET`, restart `npm run dev` |
| Payment succeeded, plan still Free | `stripe listen` not running, or wrong `whsec_` secret |
| `Invalid signature` in server logs | `STRIPE_WEBHOOK_SECRET` does not match current listener — copy fresh `whsec_` |
| Checkout error mentions `prod_` | Use **Price** IDs (`price_…`), not Product IDs (`prod_…`) |

## Production

Production uses a **Dashboard webhook endpoint** (not `stripe listen`):

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://your-domain.com/api/stripe/webhook`
3. Events: `checkout.session.completed`, `customer.subscription.created`,
   `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the endpoint signing secret into your hosting env as
   `STRIPE_WEBHOOK_SECRET`

Never set `ENABLE_DEV_PRO_UNLOCK` or `NEXT_PUBLIC_ENABLE_DEV_PRO_UNLOCK` in
production.
