-- TradeTrainer AI — User settings, privacy, notifications, audit tables
-- Run after 004_gamification_leaderboard.sql

-- Extend profiles for study preferences
alter table public.profiles
  add column if not exists study_intensity text
    check (study_intensity in ('casual', 'consistent', 'locked-in')),
  add column if not exists learning_plan text
    check (learning_plan in ('casual', 'six-month', 'locked-in')),
  add column if not exists trading_goals jsonb not null default '[]'::jsonb;

-- ─── User settings bundle (profile extras + prefs) ──────────────────────────
create table if not exists public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  settings_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;
create policy "Users read own settings"
  on public.user_settings for select using (auth.uid() = user_id);
create policy "Users upsert own settings"
  on public.user_settings for insert with check (auth.uid() = user_id);
create policy "Users update own settings"
  on public.user_settings for update using (auth.uid() = user_id);

-- ─── Privacy settings (denormalised for leaderboard queries) ──────────────────
create table if not exists public.privacy_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  leaderboard_visible boolean not null default false,
  show_country boolean not null default false,
  show_streak boolean not null default true,
  show_trader_rank boolean not null default true,
  show_username boolean not null default true,
  friend_leaderboard_visible boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.privacy_settings enable row level security;
create policy "Users read own privacy"
  on public.privacy_settings for select using (auth.uid() = user_id);
create policy "Users upsert own privacy"
  on public.privacy_settings for insert with check (auth.uid() = user_id);
create policy "Users update own privacy"
  on public.privacy_settings for update using (auth.uid() = user_id);

-- ─── Notification preferences ───────────────────────────────────────────────
create table if not exists public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  daily_reminder boolean not null default true,
  weekly_target_reminder boolean not null default true,
  streak_reminder boolean not null default true,
  challenge_reminder boolean not null default true,
  new_content_updates boolean not null default true,
  leaderboard_updates boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.notification_preferences enable row level security;
create policy "Users read own notifications"
  on public.notification_preferences for select using (auth.uid() = user_id);
create policy "Users upsert own notifications"
  on public.notification_preferences for insert with check (auth.uid() = user_id);
create policy "Users update own notifications"
  on public.notification_preferences for update using (auth.uid() = user_id);

-- ─── Progress reset audit log ─────────────────────────────────────────────────
create table if not exists public.progress_reset_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  section text not null,
  created_at timestamptz not null default now()
);

alter table public.progress_reset_events enable row level security;
create policy "Users insert own reset events"
  on public.progress_reset_events for insert with check (auth.uid() = user_id);
create policy "Users read own reset events"
  on public.progress_reset_events for select using (auth.uid() = user_id);

-- ─── Account deletion requests ──────────────────────────────────────────────
create table if not exists public.account_deletion_requests (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'completed', 'cancelled')),
  requested_at timestamptz not null default now(),
  processed_at timestamptz
);

alter table public.account_deletion_requests enable row level security;
create policy "Users insert own deletion request"
  on public.account_deletion_requests for insert with check (auth.uid() = user_id);
create policy "Users read own deletion request"
  on public.account_deletion_requests for select using (auth.uid() = user_id);
