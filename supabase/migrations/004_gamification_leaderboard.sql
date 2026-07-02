-- TradeTrainer AI — Gamification & public leaderboards
-- Run after 003_competence_system.sql

-- ─── Profile extensions for ranks + public leaderboard ──────────────────────
alter table public.profiles
  add column if not exists username text unique,
  add column if not exists country text,
  add column if not exists rank_tier integer not null default 1,
  add column if not exists books_completed integer not null default 0,
  add column if not exists competency_score integer not null default 0,
  -- Per-period XP, refreshed by the client on sync. Enables daily/weekly/
  -- monthly public boards without scanning the full activity log.
  add column if not exists xp_today integer not null default 0,
  add column if not exists xp_week integer not null default 0,
  add column if not exists xp_month integer not null default 0,
  add column if not exists xp_period_key_day text,
  add column if not exists xp_period_key_week text,
  add column if not exists xp_period_key_month text,
  add column if not exists leaderboard_opt_in boolean not null default true;

create index if not exists profiles_xp_idx on public.profiles (xp desc);
create index if not exists profiles_xp_week_idx on public.profiles (xp_week desc);
create index if not exists profiles_xp_today_idx on public.profiles (xp_today desc);

-- ─── Public leaderboard view (read-only, opt-in users only) ─────────────────
-- Exposes only non-sensitive, display-safe columns.
create or replace view public.leaderboard_public as
  select
    id,
    coalesce(username, 'Trader') as username,
    avatar_url,
    country,
    xp,
    xp_today,
    xp_week,
    xp_month,
    streak,
    rank_tier,
    lessons_completed,
    books_completed
  from public.profiles
  where leaderboard_opt_in = true;

grant select on public.leaderboard_public to anon, authenticated;

-- ─── Earned achievements (server mirror of client gamification slice) ───────
create table if not exists public.user_achievements (
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id text not null,
  bonus_xp integer not null default 0,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

alter table public.user_achievements enable row level security;
create policy "Users view own achievements"
  on public.user_achievements for select using (auth.uid() = user_id);
create policy "Users insert own achievements"
  on public.user_achievements for insert with check (auth.uid() = user_id);

-- ─── Friend graph (for friend leaderboards) ─────────────────────────────────
create table if not exists public.friendships (
  user_id uuid not null references public.profiles(id) on delete cascade,
  friend_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'blocked')),
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id)
);

alter table public.friendships enable row level security;
create policy "Users view own friendships"
  on public.friendships for select
  using (auth.uid() = user_id or auth.uid() = friend_id);
create policy "Users manage own friendships"
  on public.friendships for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
