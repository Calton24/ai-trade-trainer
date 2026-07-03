-- TradeTrainer Academy — admin-granted beta Pro + referral attribution
-- Safe to run multiple times (idempotent where possible).

-- ─── 1. admin_grants — server-only writes, users read own row ───────────────

create table if not exists public.admin_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  granted_by uuid references auth.users(id),
  grant_type text not null default 'beta_pro',
  plan text not null default 'manual_pro',
  status text not null default 'active'
    check (status in ('active', 'revoked', 'expired')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  reason text,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index if not exists admin_grants_user_id_idx
  on public.admin_grants (user_id);

create index if not exists admin_grants_active_lookup_idx
  on public.admin_grants (user_id, status, expires_at);

alter table public.admin_grants enable row level security;

drop policy if exists "Users select own admin grants" on public.admin_grants;
create policy "Users select own admin grants"
  on public.admin_grants for select
  using (auth.uid() = user_id);

revoke insert, update, delete on public.admin_grants from authenticated;

-- ─── 2. referral_partners — service_role only ───────────────────────────────

create table if not exists public.referral_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  promo_code text unique not null,
  commission_percent numeric not null default 50,
  status text not null default 'active'
    check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

create index if not exists referral_partners_promo_code_idx
  on public.referral_partners (promo_code);

create index if not exists referral_partners_slug_idx
  on public.referral_partners (slug);

alter table public.referral_partners enable row level security;

revoke all on public.referral_partners from authenticated;

-- ─── 3. referral_attributions — service_role writes, no client access ───────

create table if not exists public.referral_attributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  partner_id uuid not null references public.referral_partners(id),
  promo_code text not null,
  source_url text,
  first_seen_at timestamptz not null default now(),
  signed_up_at timestamptz,
  converted_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text,
  amount_gbp numeric,
  commission_percent numeric,
  commission_due_gbp numeric,
  created_at timestamptz not null default now()
);

create index if not exists referral_attributions_partner_id_idx
  on public.referral_attributions (partner_id);

create index if not exists referral_attributions_promo_code_idx
  on public.referral_attributions (promo_code);

alter table public.referral_attributions enable row level security;

revoke all on public.referral_attributions from authenticated;
