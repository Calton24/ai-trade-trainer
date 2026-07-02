-- Ensure all onboarding profile columns exist (safe idempotent add)
-- Run if 009 was not applied or schema cache is stale after partial deploy.

alter table public.profiles add column if not exists display_name text;
alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists country text;
alter table public.profiles add column if not exists experience_level text;
alter table public.profiles add column if not exists trading_experience text;
alter table public.profiles add column if not exists trading_goals text[] default '{}';
alter table public.profiles add column if not exists study_intensity text;
alter table public.profiles add column if not exists learning_plan text;
alter table public.profiles add column if not exists weekly_target_days integer default 3;
alter table public.profiles add column if not exists leaderboard_opt_in boolean default false;
alter table public.profiles add column if not exists public_leaderboard boolean default false;
alter table public.profiles add column if not exists onboarding_step integer default 1;
alter table public.profiles add column if not exists onboarding_completed boolean default false;
alter table public.profiles add column if not exists onboarding_completed_at timestamptz;
alter table public.profiles add column if not exists preferred_market text;
alter table public.profiles add column if not exists updated_at timestamptz default now();

update public.profiles set onboarding_step = 1 where onboarding_step is null;
update public.profiles set onboarding_completed = false where onboarding_completed is null;
update public.profiles set weekly_target_days = 3 where weekly_target_days is null;
update public.profiles set trading_goals = '{}' where trading_goals is null;
update public.profiles set updated_at = now() where updated_at is null;

alter table public.profiles drop constraint if exists profiles_onboarding_step_check;
alter table public.profiles
  add constraint profiles_onboarding_step_check
  check (onboarding_step >= 1 and onboarding_step <= 4);

alter table public.profiles drop constraint if exists profiles_weekly_target_days_check;
alter table public.profiles
  add constraint profiles_weekly_target_days_check
  check (weekly_target_days is null or (weekly_target_days >= 1 and weekly_target_days <= 7));

alter table public.profiles drop constraint if exists profiles_study_intensity_check;
alter table public.profiles
  add constraint profiles_study_intensity_check
  check (
    study_intensity is null
    or study_intensity in ('casual', 'consistent', 'locked-in')
  );

alter table public.profiles drop constraint if exists profiles_learning_plan_check;
alter table public.profiles
  add constraint profiles_learning_plan_check
  check (
    learning_plan is null
    or learning_plan in ('casual', 'six-month', 'locked-in')
  );

create index if not exists idx_profiles_onboarding_incomplete
  on public.profiles (onboarding_completed)
  where onboarding_completed = false;

-- Notify PostgREST to reload schema (Supabase API)
notify pgrst, 'reload schema';
