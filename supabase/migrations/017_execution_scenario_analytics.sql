-- Execution Lab scenario analytics — trusted server writes, users read own rows.

create table if not exists public.execution_scenario_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id text not null,
  pack_id text null,
  mode text not null check (mode in ('guided', 'practice', 'arcade')),
  started_at timestamptz not null default now(),
  completed_at timestamptz null,
  duration_seconds integer null,
  status text not null default 'started'
    check (status in ('started', 'completed', 'abandoned')),
  decision text null check (decision in ('buy', 'sell', 'wait', 'no_trade')),
  expected_decision text null,
  decision_correct boolean null,
  strategy_selected text null,
  expected_strategy text null,
  strategy_correct boolean null,
  execution_score integer null,
  market_reading_score integer null,
  structure_score integer null,
  entry_score integer null,
  stop_score integer null,
  target_score integer null,
  risk_score integer null,
  management_score integer null,
  patience_score integer null,
  confidence integer null,
  confidence_correctness_gap integer null,
  hints_used integer not null default 0,
  reveal_used boolean not null default false,
  rule_violations jsonb not null default '[]'::jsonb,
  mistake_codes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists execution_scenario_attempts_user_id_idx
  on public.execution_scenario_attempts (user_id);

create index if not exists execution_scenario_attempts_scenario_id_idx
  on public.execution_scenario_attempts (scenario_id);

create index if not exists execution_scenario_attempts_pack_id_idx
  on public.execution_scenario_attempts (pack_id);

create index if not exists execution_scenario_attempts_completed_at_idx
  on public.execution_scenario_attempts (completed_at);

create index if not exists execution_scenario_attempts_status_idx
  on public.execution_scenario_attempts (status);

create index if not exists execution_scenario_attempts_created_at_idx
  on public.execution_scenario_attempts (created_at);

create index if not exists execution_scenario_attempts_user_scenario_idx
  on public.execution_scenario_attempts (user_id, scenario_id);

create index if not exists execution_scenario_attempts_scenario_completed_idx
  on public.execution_scenario_attempts (scenario_id, completed_at);

alter table public.execution_scenario_attempts enable row level security;

drop policy if exists "Users select own execution attempts" on public.execution_scenario_attempts;
create policy "Users select own execution attempts"
  on public.execution_scenario_attempts for select
  using (auth.uid() = user_id);

revoke insert, update, delete on public.execution_scenario_attempts from authenticated;
