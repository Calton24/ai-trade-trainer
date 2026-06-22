-- TradeTrainer AI — Beginner MVP Schema (Codecademy-style paths + quizzes)
-- Run via Supabase CLI: supabase db push

-- profiles, learning_paths, path_enrollments, modules, lessons,
-- lesson_progress, quizzes, quiz_questions, quiz_attempts,
-- drill_sessions, ai_reviews, journal_entries, badges,
-- user_badges, community_waitlist

-- ─── Profiles ───────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'lifetime')),
  stripe_customer_id text,
  level integer not null default 1,
  xp integer not null default 0,
  streak integer not null default 0,
  last_practice_date date,
  active_path_id text,
  drills_completed_today integer not null default 0,
  drills_reset_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- ─── Learning Paths ─────────────────────────────────────────────────────────
create table if not exists public.learning_paths (
  id text primary key,
  title text not null,
  description text,
  difficulty text not null default 'beginner',
  estimated_hours integer not null default 8,
  is_pro_only boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.learning_paths enable row level security;
create policy "Paths readable by authenticated" on public.learning_paths for select to authenticated using (true);

-- ─── Path Enrollments ───────────────────────────────────────────────────────
create table if not exists public.path_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  path_id text not null references public.learning_paths(id) on delete cascade,
  progress_percent integer not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, path_id)
);

alter table public.path_enrollments enable row level security;
create policy "Users view own enrollments" on public.path_enrollments for select using (auth.uid() = user_id);
create policy "Users insert own enrollments" on public.path_enrollments for insert with check (auth.uid() = user_id);
create policy "Users update own enrollments" on public.path_enrollments for update using (auth.uid() = user_id);

-- ─── Modules ────────────────────────────────────────────────────────────────
create table if not exists public.modules (
  id text primary key,
  path_id text references public.learning_paths(id) on delete cascade,
  title text not null,
  description text,
  difficulty text not null default 'beginner',
  sort_order integer not null,
  estimated_minutes integer not null default 15,
  created_at timestamptz not null default now()
);

alter table public.modules enable row level security;
create policy "Modules readable by authenticated" on public.modules for select to authenticated using (true);

-- ─── Lessons ────────────────────────────────────────────────────────────────
create table if not exists public.lessons (
  id text primary key,
  module_id text references public.modules(id) on delete cascade,
  path_id text references public.learning_paths(id) on delete cascade,
  title text not null,
  subtitle text,
  content jsonb not null default '{}'::jsonb,
  key_idea text,
  category text,
  xp_reward integer not null default 50,
  is_pro_only boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.lessons enable row level security;
create policy "Lessons readable by authenticated" on public.lessons for select to authenticated using (true);

-- ─── Lesson Progress ────────────────────────────────────────────────────────
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;
create policy "Users view own lesson progress" on public.lesson_progress for select using (auth.uid() = user_id);
create policy "Users insert own lesson progress" on public.lesson_progress for insert with check (auth.uid() = user_id);
create policy "Users update own lesson progress" on public.lesson_progress for update using (auth.uid() = user_id);

-- ─── Quizzes ────────────────────────────────────────────────────────────────
create table if not exists public.quizzes (
  id text primary key,
  path_id text references public.learning_paths(id) on delete cascade,
  title text not null,
  description text,
  passing_score integer not null default 70,
  xp_reward integer not null default 50,
  created_at timestamptz not null default now()
);

alter table public.quizzes enable row level security;
create policy "Quizzes readable by authenticated" on public.quizzes for select to authenticated using (true);

-- ─── Quiz Questions ─────────────────────────────────────────────────────────
create table if not exists public.quiz_questions (
  id text primary key,
  quiz_id text not null references public.quizzes(id) on delete cascade,
  question_type text not null default 'multiple_choice',
  question text not null,
  options jsonb not null default '[]'::jsonb,
  explanation text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.quiz_questions enable row level security;
create policy "Quiz questions readable by authenticated" on public.quiz_questions for select to authenticated using (true);

-- ─── Quiz Attempts ──────────────────────────────────────────────────────────
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id text not null references public.quizzes(id) on delete cascade,
  score integer not null check (score >= 0 and score <= 100),
  passed boolean not null default false,
  answers jsonb not null default '{}'::jsonb,
  xp_earned integer not null default 0,
  completed_at timestamptz not null default now()
);

alter table public.quiz_attempts enable row level security;
create policy "Users view own quiz attempts" on public.quiz_attempts for select using (auth.uid() = user_id);
create policy "Users insert own quiz attempts" on public.quiz_attempts for insert with check (auth.uid() = user_id);

-- ─── Drill Sessions ─────────────────────────────────────────────────────────
create table if not exists public.drill_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  drill_type text not null,
  pair text not null default 'BTC/USDT',
  marks jsonb not null default '[]'::jsonb,
  score integer,
  status text not null default 'in_progress',
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.drill_sessions enable row level security;
create policy "Users view own drill sessions" on public.drill_sessions for select using (auth.uid() = user_id);
create policy "Users insert own drill sessions" on public.drill_sessions for insert with check (auth.uid() = user_id);
create policy "Users update own drill sessions" on public.drill_sessions for update using (auth.uid() = user_id);

-- ─── AI Reviews ─────────────────────────────────────────────────────────────
create table if not exists public.ai_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  drill_session_id uuid references public.drill_sessions(id) on delete set null,
  score integer not null check (score >= 0 and score <= 100),
  strengths text[] not null default '{}',
  mistakes text[] not null default '{}',
  improvement text,
  risk_reward_feedback text,
  beginner_explanation text,
  recommendation text check (recommendation in ('take', 'skip')),
  summary text,
  marks jsonb not null default '[]'::jsonb,
  model text default 'mock',
  created_at timestamptz not null default now()
);

alter table public.ai_reviews enable row level security;
create policy "Users view own ai reviews" on public.ai_reviews for select using (auth.uid() = user_id);
create policy "Users insert own ai reviews" on public.ai_reviews for insert with check (auth.uid() = user_id);

-- ─── Journal Entries ────────────────────────────────────────────────────────
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  drill_session_id uuid references public.drill_sessions(id) on delete set null,
  setup_practiced text not null,
  marks_summary text,
  ai_feedback_summary text,
  confidence_rating integer check (confidence_rating >= 1 and confidence_rating <= 5),
  mistake_tag text,
  personal_note text,
  created_at timestamptz not null default now()
);

alter table public.journal_entries enable row level security;
create policy "Users view own journal" on public.journal_entries for select using (auth.uid() = user_id);
create policy "Users insert own journal" on public.journal_entries for insert with check (auth.uid() = user_id);
create policy "Users update own journal" on public.journal_entries for update using (auth.uid() = user_id);

-- ─── Badges ─────────────────────────────────────────────────────────────────
create table if not exists public.badges (
  id text primary key,
  name text not null,
  description text,
  icon text,
  created_at timestamptz not null default now()
);

alter table public.badges enable row level security;
create policy "Badges readable by authenticated" on public.badges for select to authenticated using (true);

-- ─── User Badges ────────────────────────────────────────────────────────────
create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_id text not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

alter table public.user_badges enable row level security;
create policy "Users view own badges" on public.user_badges for select using (auth.uid() = user_id);
create policy "Users insert own badges" on public.user_badges for insert with check (auth.uid() = user_id);

-- ─── Community Waitlist ─────────────────────────────────────────────────────
create table if not exists public.community_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.community_waitlist enable row level security;
create policy "Anyone can join waitlist" on public.community_waitlist for insert with check (true);

-- ─── Indexes ────────────────────────────────────────────────────────────────
create index if not exists idx_path_enrollments_user on public.path_enrollments(user_id);
create index if not exists idx_lesson_progress_user on public.lesson_progress(user_id);
create index if not exists idx_quiz_attempts_user on public.quiz_attempts(user_id);
create index if not exists idx_drill_sessions_user on public.drill_sessions(user_id);
create index if not exists idx_journal_entries_user on public.journal_entries(user_id);
