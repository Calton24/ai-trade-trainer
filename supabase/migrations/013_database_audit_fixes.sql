-- TradeTrainer AI — Database audit remediation (non-destructive)
-- See docs/database-audit.md for the full audit this migration addresses.
--
-- Scope: fixes real bugs and gaps found in the audit. Does NOT drop or
-- rename anything, and does not touch the ~19 tables identified as fully
-- superseded by content/registry + user_learning_state (see docs/
-- database-audit.md §"Unused tables" for that list and next-step options).

-- ─── 1. Missing UPDATE policies (upsert bugs) ───────────────────────────────
-- Both tables are upserted with onConflict from app code. Postgres requires
-- an UPDATE policy to satisfy the "ON CONFLICT DO UPDATE" path — without
-- one, re-enrolling or re-requesting silently fails with a policy violation
-- the second time the same row is upserted.

drop policy if exists "Users update own feature enrollments" on public.feature_enrollments;
create policy "Users update own feature enrollments"
  on public.feature_enrollments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users update own deletion request" on public.account_deletion_requests;
create policy "Users update own deletion request"
  on public.account_deletion_requests for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── 2. Missing FK indexes on actively-queried / actively-growing tables ────

-- Audit log — insert-only today, but has a SELECT policy for future use and
-- will grow indefinitely; index now while it's cheap.
create index if not exists idx_progress_reset_events_user
  on public.progress_reset_events(user_id);

-- user_badges is live (synced on every badge-earning event). badge_id was
-- never indexed (only covered as the trailing column of a composite unique).
create index if not exists idx_user_badges_badge
  on public.user_badges(badge_id);

-- ─── 3. Scaffolded-but-real-feature tables: complete FK indexing ───────────
-- These are unused today but are NOT superseded (unlike the legacy content/
-- quiz tables) — they're forward-built for friend leaderboards, the
-- achievements catalog, session-level detail logs, and the community
-- waitlist form. Indexing them now costs nothing and avoids a forgotten gap
-- once they're wired up.

create index if not exists idx_friendships_friend on public.friendships(friend_id);

-- user_achievements.achievement_id had no FK at all (achievements didn't
-- exist yet when user_achievements was created). Table is empty today so
-- this is a safe, instant constraint add.
alter table public.user_achievements
  drop constraint if exists user_achievements_achievement_id_fkey;
alter table public.user_achievements
  add constraint user_achievements_achievement_id_fkey
  foreign key (achievement_id) references public.achievements(id) on delete cascade;

create index if not exists idx_simulator_sessions_user on public.simulator_sessions(user_id);
create index if not exists idx_chart_drill_sessions_user on public.chart_drill_sessions(user_id);
create index if not exists idx_trend_sessions_user on public.trend_sessions(user_id);
create index if not exists idx_strategy_sessions_user on public.strategy_sessions(user_id);
create index if not exists idx_community_waitlist_user on public.community_waitlist(user_id);

-- ─── 4. Friendships: allow the invited side to respond ─────────────────────
-- Previously only the requester (user_id) could update a friendship row, so
-- the invited friend had no way to accept/decline — the request could only
-- ever sit at 'pending'. Table is unused today; fixing now so it works
-- correctly the day it's wired up.
drop policy if exists "Invited friend can respond to request" on public.friendships;
create policy "Invited friend can respond to request"
  on public.friendships for update
  using (auth.uid() = friend_id)
  with check (auth.uid() = friend_id);

-- ─── 5. Automatic updated_at everywhere (safety net) ────────────────────────
-- public.set_updated_at() already exists (migration 012) and is only wired
-- to `profiles`. Every other table with an updated_at column has relied on
-- application code remembering to set it on every write — correct today,
-- but with no database-level guarantee. Attach the same trigger everywhere
-- so a future write path can never leave a stale updated_at.
do $$
declare
  t text;
  trigger_name text;
begin
  foreach t in array array[
    'user_learning_state',
    'path_progress',
    'strategy_progress',
    'streaks',
    'weekly_targets',
    'trader_competence',
    'live_trading_phase',
    'user_settings',
    'privacy_settings',
    'notification_preferences',
    'user_stats',
    'user_progress',
    'user_subscriptions'
  ]
  loop
    trigger_name := t || '_set_updated_at';
    execute format(
      'drop trigger if exists %I on public.%I', trigger_name, t
    );
    execute format(
      'create trigger %I before update on public.%I
         for each row execute function public.set_updated_at()', trigger_name, t
    );
  end loop;
end $$;

-- ─── 6. Drop redundant single-column indexes ────────────────────────────────
-- Each of these duplicates the leading column of an existing composite
-- UNIQUE index on the same table, so it never helps planning and only adds
-- write overhead. Safe to drop — Postgres can satisfy a `WHERE user_id = $1`
-- query via the leftmost column of the unique index just as well.
drop index if exists public.idx_path_enrollments_user;
drop index if exists public.idx_lesson_progress_user;
drop index if exists public.idx_feature_enrollments_user;
drop index if exists public.idx_path_progress_user;
drop index if exists public.idx_book_progress_user;
drop index if exists public.idx_flashcard_progress_user;
drop index if exists public.idx_chart_progress_user;
drop index if exists public.idx_trend_progress_user;
drop index if exists public.idx_strategy_progress_user;
drop index if exists public.idx_user_lesson_progress_user;
drop index if exists public.idx_behavioral_events_user;

notify pgrst, 'reload schema';
