-- Subscription plans (weekly / 6-month / annual) — no lifetime tier

create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan text not null default 'free'
    check (plan in ('free', 'weekly', 'six_month', 'annual')),
  status text not null default 'inactive'
    check (status in ('inactive', 'active', 'cancelled', 'expired', 'trialing')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  provider text not null default 'manual'
    check (provider in ('stripe', 'manual', 'test')),
  provider_customer_id text,
  provider_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_subscriptions enable row level security;

create policy "Users select own subscription"
  on public.user_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users insert own subscription"
  on public.user_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users update own subscription"
  on public.user_subscriptions for update
  using (auth.uid() = user_id);

-- Migrate profiles.plan away from lifetime
alter table public.profiles drop constraint if exists profiles_plan_check;
alter table public.profiles
  add constraint profiles_plan_check
  check (plan in ('free', 'weekly', 'six_month', 'annual', 'pro'));

update public.profiles set plan = 'free' where plan in ('lifetime', 'pro');

-- Bootstrap free subscription row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, experience_level)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    nullif(new.raw_user_meta_data->>'trading_experience', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();

  insert into public.user_learning_state (user_id, state_json)
  values (new.id, '{}'::jsonb) on conflict (user_id) do nothing;

  insert into public.streaks (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.user_stats (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.user_settings (user_id, settings_json)
  values (new.id, '{}'::jsonb) on conflict (user_id) do nothing;
  insert into public.privacy_settings (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.notification_preferences (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.weekly_targets (user_id, days_per_week)
  values (new.id, 3) on conflict (user_id) do nothing;

  insert into public.live_trading_phase (user_id)
  values (new.id) on conflict (user_id) do nothing;
  insert into public.trader_competence (user_id)
  values (new.id) on conflict (user_id) do nothing;

  insert into public.user_subscriptions (user_id, plan, status, provider)
  values (new.id, 'free', 'inactive', 'manual')
  on conflict (user_id) do nothing;

  return new;
end;
$$;
