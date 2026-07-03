# Database Audit — TradeTrainer Academy

**Date:** 2026-07-02
**Scope:** every table in `supabase/migrations/001`–`012` (46 tables + 1 view), cross-checked against the generated `lib/supabase/database.types.ts` and every Supabase call site in the app (`grep -r '.from("'`).
**Companion doc:** [`database-erd.md`](./database-erd.md) — entity relationship diagram.
**Remediation:** [`supabase/migrations/013_database_audit_fixes.sql`](../supabase/migrations/013_database_audit_fixes.sql) — written but **not yet applied**. See [Applying the fix](#applying-the-fix) at the bottom.

> **Update (2026-07-02):** migration `014_storage_buckets.sql` adds Supabase Storage buckets (avatars, journal images, chart screenshots, lesson/library assets, community images). It's outside the scope of this audit (Storage objects/policies live in `storage.objects`, not `public.*`) — see [`docs/storage.md`](./storage.md) for buckets, access rules, and path conventions.

> **Update (2026-07-02):** before applying `013`/`014`, a full v1.0 production-readiness pass was done on top of this audit — see [`docs/database-v1.md`](./database-v1.md). It found a **critical RLS gap on `user_subscriptions`** (owner-writable `plan`/`status` fields let a user bypass Stripe entirely) that should be fixed before `013`/`014` ship. Everything in *this* document (the table-by-table RLS/index/FK findings and the 013 remediation migration) still stands — the v1.0 doc adds naming, JSON, performance, backup, and security-in-depth coverage on top of it.

> **Update (2026-07-02, later same day):** that critical gap (plus the same pattern on `user_stats`/`xp_events`/`user_achievements`/`profiles`' gamification columns) is now **fixed** in [`015_harden_subscription_and_gamification_rls.sql`](../supabase/migrations/015_harden_subscription_and_gamification_rls.sql), paired with an app-code change that moves the app's own XP/stats writes to a new trusted server route (`app/api/progress/sync-gamification`). Subscription state is now written **exclusively** by the Stripe webhook / service-role code; XP/rank/stats are now written **exclusively** by trusted server code — no authenticated client can self-award Pro access or XP anymore. Full writeup: [`docs/database-v1.md` § Migration 015 — fix summary](./database-v1.md#migration-015--fix-summary). Push order: `013` → `014` → `015`.

---

## Headline finding: ~19 of 46 tables are dead

Before anything else — the single most important thing this audit found is architectural, not a bug: **this project has two generations of schema layered on top of each other, and the first generation is unused.**

Migration `001` built a fully-normalized, Codecademy-style content model (`learning_paths`, `modules`, `lessons`, `quizzes`, `quiz_questions`, plus matching progress tables like `lesson_progress`, `quiz_attempts`, `drill_sessions`, `ai_reviews`, `journal_entries`, `badges`). At some point the product pivoted to static TypeScript content (`content/registry`) and a single JSONB blob for progress (`user_learning_state.state_json`, synced via `lib/supabase/sync.ts`), plus a handful of purpose-built query tables added later for leaderboards/stats (`user_stats`, `xp_events`, `streaks`, `behavioral_events`, etc.). **The original content/progress tables were never removed.**

I confirmed this by grepping every `.from("...")` call in the codebase against every table — the tables below have **zero read or write call sites anywhere in the app**:

| Bucket | Tables | Why it's unused |
|---|---|---|
| **A — Superseded** (safe to drop, no code references them at all) | `learning_paths`, `modules`, `lessons`, `lesson_progress`, `quizzes`, `quiz_questions`, `quiz_attempts`, `drill_sessions`, `ai_reviews`, `journal_entries`, `badges`, `path_progress`, `book_progress`, `flashcard_progress`, `chart_progress`, `trend_progress`, `strategy_progress`, `assessments`, `enrollments` | Content moved to `content/registry`; progress moved to `user_learning_state` JSON blob + the newer per-domain tables. `enrollments` (table, migration 007) duplicates `feature_enrollments` (migration 002), which is the one actually used. |
| **B — Scaffolded, not superseded** (keep — these back real near-term features) | `friendships`, `achievements`, `user_achievements`, `simulator_sessions`, `chart_drill_sessions`, `trend_sessions`, `strategy_sessions`, `community_waitlist` | Explicitly forward-built (see comments in migrations 004/007) for friend leaderboards, an achievements catalog, per-session detail logs, and the waitlist form (`components/community/community-feed.tsx` has a literal `// Wire to Supabase community_waitlist table` comment). |

**Recommendation:** decide what to do with Bucket A before adding more schema. I did **not** drop these tables in the remediation migration — that's a data-affecting decision that should be a deliberate, separate step. Options: (1) drop them now while the app is pre-launch and it's cheap, (2) archive the migration history but drop the tables, or (3) leave them and accept the confusion. I'd pick (1). Bucket B I *did* finish auditing/indexing (see below), since it's clearly intentional and cheap to make correct now.

Everything below focuses on the **27 actually-used tables** (Bucket B included), since that's where real user data and real risk live.

---

## Answers to your checklist

### Does every table have RLS?
**Yes — 46/46.** Every single `create table` in every migration is immediately followed by `alter table ... enable row level security`. No exceptions found.

### Does every table have proper policies?
**Two bugs found, both fixed in the remediation migration:**

1. **`feature_enrollments`** — has `select`/`insert`/`delete` policies but no `update`. App code (`lib/auth/actions.ts` → `enrollInFeature()`, and `lib/data/onboarding-service.ts`) upserts this table with `onConflict: "user_id,feature_id"`. Postgres requires an `UPDATE` policy to satisfy the `ON CONFLICT DO UPDATE` path of an upsert — **without one, re-enrolling in something you're already enrolled in throws an RLS violation.** This is a real, reachable bug (onboarding re-runs, or a user re-clicking an enroll action).
2. **`account_deletion_requests`** — same shape of bug. Has `insert`/`select` only; `requestAccountDeletion()` upserts with `onConflict: "user_id"`. A second deletion request (e.g. re-clicking "delete my account," or requesting again after being talked out of it once) would fail.

Also found (fixed): **`friendships`** only allowed the *requester* (`user_id`) to update a row. The invited side (`friend_id`) had `select` but no `update`, so there was no way to ever accept/decline a friend request — it could only sit at `'pending'` forever. Dormant table today, but worth being correct before it's wired up.

Everything else checked out: every owner-scoped table restricts `select`/`insert`/`update`/`delete` to `auth.uid() = user_id` (or `= id` for `profiles`), content/catalog tables (`learning_paths`, `badges`, `achievements`, etc.) are correctly read-only-to-authenticated with no client write path, and `community_waitlist` correctly allows anonymous `insert` (open signup) with no `select` (can't enumerate other emails).

### Are there indexes on every foreign key?
**11 gaps found on live-relevant tables, all fixed in the remediation migration:**
- `progress_reset_events.user_id` — never indexed (this is a write-heavy, ever-growing audit log — the most important one to fix).
- `user_badges.badge_id` — never indexed (table is actively written on every badge-earn).
- `friendships.friend_id`, `simulator_sessions.user_id`, `chart_drill_sessions.user_id`, `trend_sessions.user_id`, `strategy_sessions.user_id`, `community_waitlist.user_id` — all Bucket B (dormant-but-real) tables.
- `user_achievements.achievement_id` — didn't even have a **foreign key**, let alone an index (the `achievements` catalog table didn't exist yet when `user_achievements` was created in migration 004; never retrofitted).

Also found: **11 fully redundant single-column indexes** on tables that already have a composite `UNIQUE(user_id, x)` constraint, e.g. `idx_lesson_progress_user` duplicates the leading column of `lesson_progress`'s own `unique(user_id, lesson_id)` index. These don't help query planning (Postgres can already use the composite index's leftmost column) and only add write overhead. Dropped in the remediation migration.

I did **not** add indexes for Bucket A (superseded) tables' foreign keys — no point indexing dead tables.

### Are unique constraints correct?
**Yes.** Every "one row per user per X" table (`lesson_progress`, `book_progress`, `path_enrollments`, `user_lesson_progress`, `user_progress`, etc.) has the composite unique constraint you'd expect. `profiles.username` has a case-insensitive unique partial index (`lower(username)`, excluding null/empty) which correctly allows multiple users to have no username yet. `community_waitlist.email` is unique, correctly preventing duplicate signups. `user_subscriptions.user_id` is unique — one subscription record per user (see note in the [subscription section](#subscription-queries-indexed) below).

### Are cascade deletes correct?
**Yes, and thoughtfully done.** Every user-owned row uses `on delete cascade` back to `profiles(id)` (which itself cascades from `auth.users(id)`), so deleting a user cleanly removes 100% of their data with one operation. Two deliberate exceptions, both correct: `ai_reviews.drill_session_id` and `journal_entries.drill_session_id` use `on delete set null` (deleting a drill session shouldn't destroy the user's saved review/journal entry, just detach it), and `community_waitlist.user_id` uses `on delete set null` (deleting an account shouldn't erase the waitlist signup record).

### Is every user table keyed by auth.uid()?
**Yes**, with the one caveat already covered above (`friendships` needed a second `auth.uid() = friend_id` policy for the non-owner side — now fixed).

### Is there orphan data?
Two things, both low-severity since nothing reads them:
- **`profiles.plan`** and **`profiles.stripe_customer_id`** (from the very first migration) are **dead columns** — zero read/write call sites anywhere in the app. Subscription state fully lives in `user_subscriptions` now (confirmed during the Stripe gating work this session). Not fixed automatically since dropping columns is destructive; flagging for a deliberate follow-up.
- `user_achievements.achievement_id` had no FK (see above) — theoretically could reference a non-existent achievement. Fixed (constraint added; table is empty so this was a zero-risk add).

### Are timestamps automatic?
**Partially — now fully fixed.** `created_at timestamptz not null default now()` is applied consistently everywhere (no gaps found). `updated_at` was a different story: a generic `public.set_updated_at()` trigger function exists (migration 012) but was **only ever attached to `profiles`**. Every other table with an `updated_at` column (13 of them: `user_learning_state`, `path_progress`, `strategy_progress`, `streaks`, `weekly_targets`, `trader_competence`, `live_trading_phase`, `user_settings`, `privacy_settings`, `notification_preferences`, `user_stats`, `user_progress`, `user_subscriptions`) relied entirely on application code remembering to pass `updated_at: new Date().toISOString()` on every write. I checked every call site — **the app code is currently 100% consistent about this**, so there's no live bug — but there was no database-level guarantee, meaning one future write path that forgets it would silently produce a stale timestamp with nothing to catch it. The remediation migration attaches the same trigger to all 13 tables, so this is now enforced at the database layer regardless of application code.

### Are enums normalised?
This schema uses **`text` + `check` constraint** rather than native Postgres `enum` types (e.g. `status text check (status in ('active','trialing',...))`). That's a deliberate, reasonable choice — check-constrained text is much easier to evolve (`ALTER TABLE ... DROP/ADD CONSTRAINT`) than a native `enum` type (which can't easily drop values and requires care around concurrent transactions). I would **not** recommend converting to native enums. One minor inconsistency: `profiles.plan`'s check constraint still allows the legacy values `'pro'`/`'lifetime'` even though migration 008 explicitly migrates existing rows away from them — harmless (nothing writes those values anymore) but worth cleaning up whenever `profiles.plan` itself is addressed (see orphan data above).

### Is every subscription query indexed? {#subscription-queries-indexed}
**Yes.** `user_subscriptions.user_id` has a `unique` constraint, which is backed by a unique btree index — exactly the column every query filters on (`fetchUserSubscription`, the proxy's Pro-gate check, `requireProUser()`, the checkout/billing-portal routes). One documentation note rather than a bug: `fetchUserSubscription()` does `.order("created_at", { ascending: false }).limit(1)`, written defensively as if a user could have multiple subscription rows — but the `unique(user_id)` constraint makes that impossible today (it's a single upserted row per user, not a history table). Not wrong, just slightly over-defensive code; no schema change needed.

---

## Everything fixed in `013_database_audit_fixes.sql`

Non-destructive, idempotent, safe to run multiple times:

1. Added the missing `UPDATE` RLS policy on `feature_enrollments` and `account_deletion_requests` (fixes the upsert bug).
2. Added the missing `friend_id`-side `UPDATE` policy on `friendships` (fixes the accept/decline gap).
3. Added indexes: `progress_reset_events.user_id`, `user_badges.badge_id`, `friendships.friend_id`, `simulator_sessions.user_id`, `chart_drill_sessions.user_id`, `trend_sessions.user_id`, `strategy_sessions.user_id`, `community_waitlist.user_id`.
4. Added the missing FK constraint `user_achievements.achievement_id → achievements.id`.
5. Attached `set_updated_at()` to all 13 tables that had an `updated_at` column but no trigger.
6. Dropped 11 redundant single-column indexes that duplicated a composite unique index's leading column.

## Explicitly NOT done (needs your decision)

- **Dropping the 19 Bucket-A superseded tables.** Zero code references them, so it's safe from an application standpoint, but it's real schema/data deletion and deserves its own explicit "yes, drop these" — I didn't want to make that call silently inside an audit migration.
- **Dropping `profiles.plan` / `profiles.stripe_customer_id`.** Same reasoning — dead, but destructive.

Happy to write the drop migration for either as soon as you confirm.

## Applying the fix

I don't have write access to your live Supabase project from here (and shouldn't apply schema changes to production data without you explicitly running it). To apply:

```bash
supabase db push
```

This will run `013_database_audit_fixes.sql` against the linked `tradetrainer-ai` project (`njsvozqbgirsikscaxbq`). It's additive/non-destructive (new policies, indexes, a constraint, triggers, and dropping only *redundant* indexes) — safe to run without a maintenance window.
