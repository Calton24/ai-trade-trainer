-- TradeTrainer AI — Competence tracking, behavioral history, live trading phases
-- Append-only behavioral events + phase progression (never deleted on reset)

-- ─── Append-only behavioral events ────────────────────────────────────────────
create table if not exists public.behavioral_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null,
  pillar text not null check (pillar in (
    'market-knowledge', 'chart-recognition', 'trade-selection',
    'risk-management', 'psychology', 'consistency', 'execution'
  )),
  entity_id text not null default '',
  score integer check (score is null or (score >= 0 and score <= 100)),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.behavioral_events enable row level security;
create policy "Users view own behavioral events"
  on public.behavioral_events for select using (auth.uid() = user_id);
create policy "Users insert own behavioral events"
  on public.behavioral_events for insert with check (auth.uid() = user_id);

-- No UPDATE or DELETE policies — append-only by design

-- ─── Competence snapshots (point-in-time scores) ────────────────────────────
create table if not exists public.trader_competence (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  knowledge_score integer not null default 0 check (knowledge_score between 0 and 100),
  chart_score integer not null default 0 check (chart_score between 0 and 100),
  trade_selection_score integer not null default 0 check (trade_selection_score between 0 and 100),
  risk_score integer not null default 0 check (risk_score between 0 and 100),
  psychology_score integer not null default 0 check (psychology_score between 0 and 100),
  consistency_score integer not null default 0 check (consistency_score between 0 and 100),
  execution_score integer not null default 0 check (execution_score between 0 and 100),
  overall_score integer not null default 0 check (overall_score between 0 and 100),
  weakest_area text,
  recommended_next_module text,
  assessment_count integer not null default 0,
  drill_count integer not null default 0,
  journal_completion_rate integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.trader_competence enable row level security;
create policy "Users view own competence"
  on public.trader_competence for select using (auth.uid() = user_id);
create policy "Users insert own competence"
  on public.trader_competence for insert with check (auth.uid() = user_id);
create policy "Users update own competence"
  on public.trader_competence for update using (auth.uid() = user_id);

-- ─── Live trading phase progression ─────────────────────────────────────────
create table if not exists public.live_trading_phase (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  current_phase text not null default 'education' check (current_phase in (
    'education', 'simulated', 'live_prep', 'go_live', 'live_active'
  )),
  simulated_unlocked_at timestamptz,
  live_prep_unlocked_at timestamptz,
  go_live_unlocked_at timestamptz,
  risk_quiz_passed boolean not null default false,
  losing_streak_scenario_passed boolean not null default false,
  strategy_clarity_passed boolean not null default false,
  journal_completion_rate integer not null default 0,
  emotional_violations integer not null default 0,
  trades_in_phase integer not null default 0,
  checklist jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.live_trading_phase enable row level security;
create policy "Users view own live phase"
  on public.live_trading_phase for select using (auth.uid() = user_id);
create policy "Users insert own live phase"
  on public.live_trading_phase for insert with check (auth.uid() = user_id);
create policy "Users update own live phase"
  on public.live_trading_phase for update using (auth.uid() = user_id);

-- ─── Progress archives (preserved on reset) ─────────────────────────────────
create table if not exists public.progress_archives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  section text not null,
  archived_state jsonb not null,
  archived_at timestamptz not null default now()
);

alter table public.progress_archives enable row level security;
create policy "Users view own archives"
  on public.progress_archives for select using (auth.uid() = user_id);
create policy "Users insert own archives"
  on public.progress_archives for insert with check (auth.uid() = user_id);

-- ─── Unified lesson progress (normalized) ───────────────────────────────────
create table if not exists public.user_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null,
  status text not null default 'not_started' check (status in (
    'not_started', 'in_progress', 'completed'
  )),
  score integer check (score is null or (score between 0 and 100)),
  attempts integer not null default 0,
  last_updated timestamptz not null default now(),
  unique (user_id, lesson_id)
);

alter table public.user_lesson_progress enable row level security;
create policy "Users view own lesson progress"
  on public.user_lesson_progress for select using (auth.uid() = user_id);
create policy "Users insert own lesson progress"
  on public.user_lesson_progress for insert with check (auth.uid() = user_id);
create policy "Users update own lesson progress"
  on public.user_lesson_progress for update using (auth.uid() = user_id);

-- Initialize live_trading_phase on signup
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
  insert into public.live_trading_phase (user_id) values (new.id);
  insert into public.trader_competence (user_id) values (new.id);
  return new;
end;
$$;

create index if not exists idx_behavioral_events_user on public.behavioral_events(user_id);
create index if not exists idx_behavioral_events_pillar on public.behavioral_events(user_id, pillar);
create index if not exists idx_progress_archives_user on public.progress_archives(user_id);
create index if not exists idx_user_lesson_progress_user on public.user_lesson_progress(user_id);
