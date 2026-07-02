-- Multi-step onboarding persistence

alter table public.profiles
  add column if not exists onboarding_step integer not null default 1,
  add column if not exists onboarding_completed_at timestamptz,
  add column if not exists preferred_market text;

alter table public.profiles drop constraint if exists profiles_onboarding_step_check;
alter table public.profiles
  add constraint profiles_onboarding_step_check
  check (onboarding_step >= 1 and onboarding_step <= 4);

create index if not exists idx_profiles_onboarding_incomplete
  on public.profiles (onboarding_completed)
  where onboarding_completed = false;
