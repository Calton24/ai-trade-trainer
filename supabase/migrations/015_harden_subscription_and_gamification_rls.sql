-- TradeTrainer Academy — CRITICAL: close the entitlement/gamification RLS gap
-- See docs/database-v1.md Part 5 for the full writeup of this finding.
--
-- Problem: `user_subscriptions`, `user_stats`, `xp_events`, and
-- `user_achievements` were all owner-writable via RLS with no restriction
-- on *which fields* an owner could set — RLS filters rows, not columns.
-- Since the Supabase anon key + a user's own JWT are both things the user
-- legitimately has, any authenticated user could open the browser console
-- and directly PATCH `plan`/`status`/`current_period_end` on their own
-- `user_subscriptions` row, bypassing Stripe entirely, or PATCH
-- `xp`/`level`/`streak`/`rank_tier` on their own `profiles` row /
-- `user_stats` row to fake their public leaderboard rank.
--
-- Fix: default-deny writes on the affected tables/columns for the
-- `authenticated` role (both by dropping the now-obsolete broad RLS
-- policies AND revoking the underlying column privilege, so the block
-- holds even if a policy is ever re-added carelessly), then explicitly
-- re-grant only the specific `profiles` columns users legitimately
-- self-manage (identity/preference fields). `service_role` is never
-- affected by these grants/revokes — the Stripe webhook (lib/stripe/sync.ts)
-- and the new /api/progress/sync-gamification route both use the
-- service-role admin client and keep working unchanged.
--
-- Non-destructive: no rows are dropped or modified, only privileges and
-- policies. Safe to run multiple times.

-- ─── 1. user_subscriptions — SELECT only for authenticated ─────────────────
-- Every real write (checkout's provider_customer_id, and all Stripe-driven
-- plan/status/period changes via the webhook) now goes through
-- service-role code paths exclusively.
drop policy if exists "Users insert own subscription" on public.user_subscriptions;
drop policy if exists "Users update own subscription" on public.user_subscriptions;

revoke insert, update, delete on public.user_subscriptions from authenticated;
-- "Users select own subscription" (auth.uid() = user_id) is unchanged —
-- reading your own subscription status still works.

-- ─── 2. user_stats — SELECT only for authenticated ─────────────────────────
-- All writes now happen via /api/progress/sync-gamification (service-role).
drop policy if exists "Users insert own stats" on public.user_stats;
drop policy if exists "Users update own stats" on public.user_stats;

revoke insert, update, delete on public.user_stats from authenticated;

-- ─── 3. xp_events — append-only ledger, but never from the client ──────────
drop policy if exists "Users insert own xp events" on public.xp_events;

revoke insert, update, delete on public.xp_events from authenticated;
-- "Users read own xp events" (select) is unchanged.

-- ─── 4. user_achievements — dormant table, close the same gap pre-emptively ─
-- Unused by the app today (no call sites) — hardening now so it's correct
-- the day it's wired up, matching the same "server/RPC awards it" model.
drop policy if exists "Users insert own achievements" on public.user_achievements;

revoke insert, update, delete on public.user_achievements from authenticated;
-- "Users view own achievements" (select) is unchanged.

-- ─── 5. profiles — split identity/preference columns from ──────────────────
--        gamification/entitlement columns
-- The existing row-level UPDATE policy (auth.uid() = id) is unchanged — a
-- user can still only ever touch their own row. What changes is *which
-- columns* that policy is allowed to reach: revoke blanket UPDATE, then
-- re-grant only the columns a user legitimately self-manages (display
-- name, username, avatar, locale/market prefs, onboarding progress,
-- leaderboard opt-in). Every gamification/score column — level, xp,
-- streak, rank_tier, competency_score, the xp_* period columns, the
-- *_completed counters, strongest/weakest_skill, last_practice_date,
-- active_path_id — becomes writable only by service-role (via
-- /api/progress/sync-gamification). `plan` and `stripe_customer_id` are
-- included in the lock-down too: both are dead/legacy columns per
-- docs/database-audit.md (nothing reads or writes them today), but there's
-- no reason to leave them client-writable either.
revoke update on public.profiles from authenticated;

grant update (
  display_name,
  username,
  avatar_url,
  country,
  experience_level,
  trading_experience,
  trading_goals,
  preferred_market,
  study_intensity,
  learning_plan,
  weekly_target_days,
  public_leaderboard,
  leaderboard_opt_in,
  onboarding_step,
  onboarding_completed,
  onboarding_completed_at,
  updated_at
) on public.profiles to authenticated;

notify pgrst, 'reload schema';

-- ─── Manual verification (run these against the live DB after applying) ───
--
-- As an authenticated user (via the anon key + a real user JWT, e.g. from
-- the browser console or `supabase.auth.getSession()` in a test script):
--
--   -- Should succeed (reads your own row):
--   select * from user_subscriptions where user_id = auth.uid();
--
--   -- Should FAIL with a permission/RLS error:
--   update user_subscriptions set plan = 'annual', status = 'active'
--     where user_id = auth.uid();
--   insert into xp_events (user_id, source, amount, date_key, week_key, month_key)
--     values (auth.uid(), 'fake', 999999, '2026-01-01', '2026-W01', '2026-01');
--   update user_stats set lifetime_xp = 999999 where user_id = auth.uid();
--   update profiles set xp = 999999, level = 99 where id = auth.uid();
--
--   -- Should still succeed (identity/preference columns remain writable):
--   update profiles set display_name = 'New Name', username = 'newname'
--     where id = auth.uid();
--
-- As service_role (e.g. from the Supabase SQL editor, or the app's
-- service-role client):
--
--   -- Should succeed (webhook path):
--   update user_subscriptions set plan = 'annual', status = 'active'
--     where user_id = '<some-user-id>';
--
--   -- Should succeed (gamification sync path):
--   insert into xp_events (user_id, source, amount, date_key, week_key, month_key)
--     values ('<some-user-id>', 'lesson', 50, '2026-01-01', '2026-W01', '2026-01');
--   update user_stats set lifetime_xp = 500 where user_id = '<some-user-id>';
