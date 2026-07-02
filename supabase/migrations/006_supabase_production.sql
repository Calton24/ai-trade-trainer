-- TradeTrainer AI — Production persistence layer (tradetrainer-ai)
-- Run after 005_user_settings.sql

-- ─── Profile extensions for onboarding ──────────────────────────────────────
alter table public.profiles
  add column if not exists experience_level text
    check (experience_level in (
      'complete-beginner', 'beginner', 'intermediate', 'advanced'
    )),
  add column if not exists trading_goals text[] not null default '{}',
  add column if not exists public_leaderboard boolean not null default false,
  add column if not exists onboarding_completed boolean not null default false;

-- Align experience_level with legacy trading_experience when present
update public.profiles
set experience_level = trading_experience
where experience_level is null and trading_experience is not null;

-- ─── Denormalised user stats (synced from client state) ─────────────────────
create table if not exists public.user_stats (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  lifetime_xp integer not null default 0,
  highest_rank_tier integer not null default 1,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  competency_score integer not null default 0,
  lessons_completed integer not null default 0,
  quizzes_completed integer not null default 0,
  drills_completed integer not null default 0,
  books_completed integer not null default 0,
  simulations_completed integer not null default 0,
  last_activity_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.user_stats enable row level security;
create policy "Users read own stats"
  on public.user_stats for select using (auth.uid() = user_id);
create policy "Users insert own stats"
  on public.user_stats for insert with check (auth.uid() = user_id);
create policy "Users update own stats"
  on public.user_stats for update using (auth.uid() = user_id);

-- ─── XP event log (audit + leaderboard period queries) ────────────────────
create table if not exists public.xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source text not null,
  source_id text,
  amount integer not null,
  reason text,
  date_key text not null,
  week_key text not null,
  month_key text not null,
  created_at timestamptz not null default now()
);

alter table public.xp_events enable row level security;
create policy "Users read own xp events"
  on public.xp_events for select using (auth.uid() = user_id);
create policy "Users insert own xp events"
  on public.xp_events for insert with check (auth.uid() = user_id);

create index if not exists idx_xp_events_user_date
  on public.xp_events(user_id, date_key);
create index if not exists idx_xp_events_user_week
  on public.xp_events(user_id, week_key);

-- ─── Generic progress rows (lessons, concepts, drills, etc.) ──────────────
create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  entity_type text not null,
  entity_id text not null,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed')),
  score integer check (score is null or (score >= 0 and score <= 100)),
  attempts integer not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, entity_type, entity_id)
);

alter table public.user_progress enable row level security;
create policy "Users manage own progress"
  on public.user_progress for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_user_progress_user
  on public.user_progress(user_id, entity_type);

-- ─── Enrollments alias view (maps feature_enrollments → enrollments API) ────
create or replace view public.enrollments as
  select
    id,
    user_id,
    feature_id as content_id,
    'feature' as content_type,
    'active' as status,
    enrolled_at,
    null::timestamptz as completed_at
  from public.feature_enrollments;

-- ─── Leaderboard public view (safe columns only — no email) ─────────────────
drop view if exists public.leaderboard_public;
create view public.leaderboard_public as
  select
    p.id,
    coalesce(p.username, 'Trader') as username,
    coalesce(p.display_name, 'Trader') as display_name,
    p.avatar_url,
    p.country,
    coalesce(us.lifetime_xp, p.xp, 0) as lifetime_xp,
    coalesce(us.current_streak, p.streak, 0) as current_streak,
    coalesce(us.highest_rank_tier, p.rank_tier, 1) as highest_rank_tier,
    coalesce(us.competency_score, p.competency_score, 0) as competency_score,
    coalesce(p.xp_today, 0) as daily_xp,
    coalesce(p.xp_week, 0) as weekly_xp,
    coalesce(p.xp_month, 0) as monthly_xp,
    coalesce(p.lessons_completed, 0) as lessons_completed,
    coalesce(p.books_completed, 0) as books_completed,
    p.leaderboard_opt_in
  from public.profiles p
  left join public.user_stats us on us.user_id = p.id
  where p.leaderboard_opt_in = true
    and p.username is not null
    and length(trim(p.username)) > 0;

grant select on public.leaderboard_public to anon, authenticated;

-- ─── Signup bootstrap: profile + defaults for every new user ────────────────
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
  on conflict (id) do nothing;

  insert into public.user_learning_state (user_id, state_json)
  values (new.id, '{}'::jsonb)
  on conflict (user_id) do nothing;

  insert into public.streaks (user_id) values (new.id)
  on conflict (user_id) do nothing;

  insert into public.user_stats (user_id) values (new.id)
  on conflict (user_id) do nothing;

  insert into public.user_settings (user_id, settings_json)
  values (new.id, '{}'::jsonb)
  on conflict (user_id) do nothing;

  insert into public.privacy_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.notification_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.weekly_targets (user_id, days_per_week)
  values (new.id, 3)
  on conflict (user_id) do nothing;

  insert into public.live_trading_phase (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.trader_competence (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
