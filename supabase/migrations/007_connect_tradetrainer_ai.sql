-- TradeTrainer AI — connect to project njsvozqbgirsikscaxbq
-- Idempotent migration safe to run on existing schema.

-- Keep public_leaderboard in sync with leaderboard_opt_in
update public.profiles
set public_leaderboard = leaderboard_opt_in
where public_leaderboard is distinct from leaderboard_opt_in;

create or replace function public.sync_public_leaderboard()
returns trigger
language plpgsql
as $$
begin
  new.public_leaderboard := coalesce(new.leaderboard_opt_in, new.public_leaderboard, false);
  new.leaderboard_opt_in := new.public_leaderboard;
  return new;
end;
$$;

drop trigger if exists profiles_leaderboard_sync on public.profiles;
create trigger profiles_leaderboard_sync
  before insert or update on public.profiles
  for each row execute function public.sync_public_leaderboard();

-- Session log tables (complement user_learning_state JSON blob)
create table if not exists public.simulator_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stage_id text not null,
  score integer check (score is null or (score >= 0 and score <= 100)),
  passed boolean not null default false,
  payload jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now()
);

alter table public.simulator_sessions enable row level security;
create policy "Users manage own simulator sessions"
  on public.simulator_sessions for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.chart_drill_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  drill_type text not null,
  score integer,
  payload jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now()
);

alter table public.chart_drill_sessions enable row level security;
create policy "Users manage own chart drill sessions"
  on public.chart_drill_sessions for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.trend_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  session_type text not null,
  entity_id text,
  score integer,
  payload jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now()
);

alter table public.trend_sessions enable row level security;
create policy "Users manage own trend sessions"
  on public.trend_sessions for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.strategy_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  strategy_id text,
  session_type text not null,
  score integer,
  payload jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now()
);

alter table public.strategy_sessions enable row level security;
create policy "Users manage own strategy sessions"
  on public.strategy_sessions for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Achievements catalog (user_achievements already exists from 004)
create table if not exists public.achievements (
  id text primary key,
  name text not null,
  description text,
  bonus_xp integer not null default 0,
  category text,
  created_at timestamptz not null default now()
);

alter table public.achievements enable row level security;
create policy "Achievements readable by authenticated"
  on public.achievements for select to authenticated using (true);

-- Enrollments table (alongside feature_enrollments)
drop view if exists public.enrollments;
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content_type text not null,
  content_id text not null,
  status text not null default 'active',
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, content_type, content_id)
);

alter table public.enrollments enable row level security;
create policy "Users manage own enrollments"
  on public.enrollments for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Leaderboard view aligned with prompt (public_leaderboard gate, no email)
drop view if exists public.leaderboard_public;
create view public.leaderboard_public as
  select
    p.id as user_id,
    coalesce(p.username, 'Trader') as username,
    coalesce(p.display_name, 'Trader') as display_name,
    p.avatar_url,
    p.country,
    coalesce(us.lifetime_xp, p.xp, 0) as lifetime_xp,
    coalesce(us.highest_rank_tier, p.rank_tier, 1) as highest_rank_tier,
    coalesce(us.current_streak, p.streak, 0) as current_streak,
    coalesce(us.competency_score, p.competency_score, 0) as competency_score,
    coalesce(p.xp_today, 0) as daily_xp,
    coalesce(p.xp_week, 0) as weekly_xp,
    coalesce(p.xp_month, 0) as monthly_xp,
    coalesce(p.public_leaderboard, p.leaderboard_opt_in, false) as public_leaderboard
  from public.profiles p
  left join public.user_stats us on us.user_id = p.id
  where coalesce(p.public_leaderboard, p.leaderboard_opt_in, false) = true
    and p.username is not null
    and length(trim(p.username)) > 0;

grant select on public.leaderboard_public to anon, authenticated;

-- Signup bootstrap (profiles + stats + settings + weekly target)
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

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
