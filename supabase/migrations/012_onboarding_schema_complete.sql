-- TradeTrainer AI — complete onboarding schema (idempotent)
-- Aligns public.profiles with onboarding-service payload.
-- Safe to run on production; does not drop data.

-- ─── Core onboarding columns ────────────────────────────────────────────────
alter table public.profiles
  add column if not exists display_name text,
  add column if not exists username text,
  add column if not exists country text,
  add column if not exists experience_level text,
  add column if not exists preferred_market text,
  add column if not exists study_intensity text,
  add column if not exists learning_plan text,
  add column if not exists weekly_target_days integer default 3,
  add column if not exists public_leaderboard boolean default false,
  add column if not exists onboarding_step integer default 1,
  add column if not exists onboarding_completed boolean default false,
  add column if not exists onboarding_completed_at timestamptz,
  add column if not exists updated_at timestamptz default now();

-- trading_goals: keep jsonb if already present (005), add text[] only when missing
do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'trading_goals'
  ) then
    alter table public.profiles
      add column trading_goals text[] not null default '{}';
  end if;
end $$;

-- Backfill nulls for onboarding defaults
update public.profiles set onboarding_step = 1 where onboarding_step is null;
update public.profiles set onboarding_completed = false where onboarding_completed is null;
update public.profiles set weekly_target_days = 3 where weekly_target_days is null;
update public.profiles set public_leaderboard = false where public_leaderboard is null;
update public.profiles set updated_at = now() where updated_at is null;

-- Normalize trading_goals jsonb empty arrays
update public.profiles
set trading_goals = '[]'::jsonb
where trading_goals is null
  and exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'trading_goals'
      and udt_name = 'jsonb'
  );

-- ─── Constraints (safe — nulls allowed) ─────────────────────────────────────
alter table public.profiles drop constraint if exists profiles_onboarding_step_check;
alter table public.profiles
  add constraint profiles_onboarding_step_check
  check (onboarding_step is null or (onboarding_step >= 1 and onboarding_step <= 4));

alter table public.profiles drop constraint if exists profiles_weekly_target_days_check;
alter table public.profiles
  add constraint profiles_weekly_target_days_check
  check (weekly_target_days is null or (weekly_target_days >= 1 and weekly_target_days <= 7));

-- ─── Username uniqueness (case-insensitive) ─────────────────────────────────
create unique index if not exists profiles_username_unique_idx
  on public.profiles (lower(username))
  where username is not null and trim(username) <> '';

-- ─── updated_at trigger ─────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ─── Leaderboard opt-in default + incomplete onboarding fix ─────────────────
alter table public.profiles
  alter column leaderboard_opt_in set default false;

update public.profiles
set leaderboard_opt_in = false,
    public_leaderboard = false
where onboarding_completed = false
  and coalesce(leaderboard_opt_in, public_leaderboard, false) = true
  and (username is null or trim(username) = '');

-- ─── Index for incomplete onboarding queries ────────────────────────────────
create index if not exists idx_profiles_onboarding_incomplete
  on public.profiles (onboarding_completed)
  where onboarding_completed = false;

notify pgrst, 'reload schema';
