-- TradeTrainer AI — Learning progress, enrollments, and profile extensions
-- Run after 001_initial_schema.sql

-- ─── Profile extensions ─────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists trading_experience text
    check (trading_experience in (
      'complete-beginner', 'beginner', 'intermediate', 'advanced'
    )),
  add column if not exists weekly_target_days integer
    check (weekly_target_days is null or weekly_target_days between 1 and 7),
  add column if not exists strongest_skill text,
  add column if not exists weakest_skill text,
  add column if not exists lessons_completed integer not null default 0,
  add column if not exists quizzes_completed integer not null default 0,
  add column if not exists drills_completed integer not null default 0;

-- Allow profile insert on signup (trigger runs as security definer)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ─── Full learning state (cross-device sync) ────────────────────────────────
create table if not exists public.user_learning_state (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  state_version integer not null default 1,
  state_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_learning_state enable row level security;
create policy "Users view own learning state"
  on public.user_learning_state for select using (auth.uid() = user_id);
create policy "Users insert own learning state"
  on public.user_learning_state for insert with check (auth.uid() = user_id);
create policy "Users update own learning state"
  on public.user_learning_state for update using (auth.uid() = user_id);

-- ─── Feature enrollments (Book Lab, Chart Lab, Trend Spotter, etc.) ─────────
create table if not exists public.feature_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  feature_id text not null,
  enrolled_at timestamptz not null default now(),
  unique (user_id, feature_id)
);

alter table public.feature_enrollments enable row level security;
create policy "Users view own feature enrollments"
  on public.feature_enrollments for select using (auth.uid() = user_id);
create policy "Users insert own feature enrollments"
  on public.feature_enrollments for insert with check (auth.uid() = user_id);
create policy "Users delete own feature enrollments"
  on public.feature_enrollments for delete using (auth.uid() = user_id);

-- ─── Path progress (denormalized for queries) ───────────────────────────────
create table if not exists public.path_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  path_id text not null,
  completed_lessons text[] not null default '{}',
  completed_quizzes text[] not null default '{}',
  percentage_complete integer not null default 0 check (percentage_complete between 0 and 100),
  updated_at timestamptz not null default now(),
  unique (user_id, path_id)
);

alter table public.path_progress enable row level security;
create policy "Users view own path progress"
  on public.path_progress for select using (auth.uid() = user_id);
create policy "Users insert own path progress"
  on public.path_progress for insert with check (auth.uid() = user_id);
create policy "Users update own path progress"
  on public.path_progress for update using (auth.uid() = user_id);

-- ─── Book Lab progress ──────────────────────────────────────────────────────
create table if not exists public.book_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  concept_id text not null,
  completed boolean not null default false,
  score integer check (score is null or (score >= 0 and score <= 100)),
  completed_at timestamptz,
  unique (user_id, concept_id)
);

alter table public.book_progress enable row level security;
create policy "Users view own book progress"
  on public.book_progress for select using (auth.uid() = user_id);
create policy "Users insert own book progress"
  on public.book_progress for insert with check (auth.uid() = user_id);
create policy "Users update own book progress"
  on public.book_progress for update using (auth.uid() = user_id);

-- ─── Flashcard progress ─────────────────────────────────────────────────────
create table if not exists public.flashcard_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  card_id text not null,
  confidence_level text not null default 'new'
    check (confidence_level in ('new', 'easy', 'medium', 'hard')),
  ease_factor numeric(4,2) not null default 2.5,
  interval_days integer not null default 0,
  repetitions integer not null default 0,
  next_review_date date,
  last_reviewed_at timestamptz,
  unique (user_id, card_id)
);

alter table public.flashcard_progress enable row level security;
create policy "Users view own flashcard progress"
  on public.flashcard_progress for select using (auth.uid() = user_id);
create policy "Users insert own flashcard progress"
  on public.flashcard_progress for insert with check (auth.uid() = user_id);
create policy "Users update own flashcard progress"
  on public.flashcard_progress for update using (auth.uid() = user_id);

-- ─── Chart exercise progress ────────────────────────────────────────────────
create table if not exists public.chart_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercise_id text not null,
  attempts integer not null default 0,
  best_score integer not null default 0 check (best_score between 0 and 100),
  completed boolean not null default false,
  last_attempted_at timestamptz,
  unique (user_id, exercise_id)
);

alter table public.chart_progress enable row level security;
create policy "Users view own chart progress"
  on public.chart_progress for select using (auth.uid() = user_id);
create policy "Users insert own chart progress"
  on public.chart_progress for insert with check (auth.uid() = user_id);
create policy "Users update own chart progress"
  on public.chart_progress for update using (auth.uid() = user_id);

-- ─── Trend Spotter progress ─────────────────────────────────────────────────
create table if not exists public.trend_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null,
  accuracy_rate integer not null default 0 check (accuracy_rate between 0 and 100),
  completed boolean not null default false,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

alter table public.trend_progress enable row level security;
create policy "Users view own trend progress"
  on public.trend_progress for select using (auth.uid() = user_id);
create policy "Users insert own trend progress"
  on public.trend_progress for insert with check (auth.uid() = user_id);
create policy "Users update own trend progress"
  on public.trend_progress for update using (auth.uid() = user_id);

-- ─── Strategy mastery progress ──────────────────────────────────────────────
create table if not exists public.strategy_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  strategy_id text not null,
  exercises_completed integer not null default 0,
  mastery_score integer not null default 0 check (mastery_score between 0 and 100),
  unlocked boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (user_id, strategy_id)
);

alter table public.strategy_progress enable row level security;
create policy "Users view own strategy progress"
  on public.strategy_progress for select using (auth.uid() = user_id);
create policy "Users insert own strategy progress"
  on public.strategy_progress for insert with check (auth.uid() = user_id);
create policy "Users update own strategy progress"
  on public.strategy_progress for update using (auth.uid() = user_id);

-- ─── Trader readiness assessments ───────────────────────────────────────────
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  overall_score integer not null check (overall_score between 0 and 100),
  trader_level text not null,
  pillar_scores jsonb not null default '{}'::jsonb,
  detected_weaknesses text[] not null default '{}',
  xp_earned integer not null default 0,
  completed_at timestamptz not null default now()
);

alter table public.assessments enable row level security;
create policy "Users view own assessments"
  on public.assessments for select using (auth.uid() = user_id);
create policy "Users insert own assessments"
  on public.assessments for insert with check (auth.uid() = user_id);

-- ─── Streaks (daily) ────────────────────────────────────────────────────────
create table if not exists public.streaks (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_activity_date date,
  updated_at timestamptz not null default now()
);

alter table public.streaks enable row level security;
create policy "Users view own streaks"
  on public.streaks for select using (auth.uid() = user_id);
create policy "Users insert own streaks"
  on public.streaks for insert with check (auth.uid() = user_id);
create policy "Users update own streaks"
  on public.streaks for update using (auth.uid() = user_id);

-- ─── Weekly targets ─────────────────────────────────────────────────────────
create table if not exists public.weekly_targets (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  days_per_week integer not null check (days_per_week between 1 and 7),
  active_days_by_week jsonb not null default '{}'::jsonb,
  weekly_streak integer not null default 0,
  last_evaluated_week_key text,
  updated_at timestamptz not null default now()
);

alter table public.weekly_targets enable row level security;
create policy "Users view own weekly targets"
  on public.weekly_targets for select using (auth.uid() = user_id);
create policy "Users insert own weekly targets"
  on public.weekly_targets for insert with check (auth.uid() = user_id);
create policy "Users update own weekly targets"
  on public.weekly_targets for update using (auth.uid() = user_id);

-- ─── Auto-create profile on signup ──────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  insert into public.user_learning_state (user_id, state_json)
  values (new.id, '{}'::jsonb);
  insert into public.streaks (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Indexes ────────────────────────────────────────────────────────────────
create index if not exists idx_feature_enrollments_user on public.feature_enrollments(user_id);
create index if not exists idx_path_progress_user on public.path_progress(user_id);
create index if not exists idx_book_progress_user on public.book_progress(user_id);
create index if not exists idx_flashcard_progress_user on public.flashcard_progress(user_id);
create index if not exists idx_chart_progress_user on public.chart_progress(user_id);
create index if not exists idx_trend_progress_user on public.trend_progress(user_id);
create index if not exists idx_strategy_progress_user on public.strategy_progress(user_id);
create index if not exists idx_assessments_user on public.assessments(user_id);
