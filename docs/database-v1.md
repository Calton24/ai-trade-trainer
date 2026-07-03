# Database v1.0 — Production Readiness Audit

**Date:** 2026-07-02
**Scope:** every object in `supabase/migrations/001`–`014` (46 tables, 1 view, 6 storage buckets), cross-checked against `lib/supabase/database.types.ts` and every `.from("...")` / `storage.from("...")` call site in the app.
**Status:** review only. **Nothing in this document changes application behaviour, adds features, or pushes migrations.** `013_database_audit_fixes.sql` and `014_storage_buckets.sql` are written but still **not applied**.
**Companion docs:** [`database-audit.md`](./database-audit.md) (the audit that produced migration 013), [`database-erd.md`](./database-erd.md) (full per-table ER diagrams), [`storage.md`](./storage.md) (bucket rules).

> **Update (2026-07-02):** the critical finding below (`user_subscriptions`/`user_stats`/`xp_events`/`profiles` gamification columns being directly client-writable via RLS) has been **fixed** in [`supabase/migrations/015_harden_subscription_and_gamification_rls.sql`](../supabase/migrations/015_harden_subscription_and_gamification_rls.sql), together with an app-code refactor that moves the app's own gamification writes to a new trusted server route, `app/api/progress/sync-gamification/route.ts`. The rest of this document is left as originally written (the audit that found the problem) — see the "✅ Fixed by migration 015" callouts inline, and the [Migration 015](#migration-015--fix-summary) section at the end for the full writeup of the fix, the app-code changes it required, and the verification/test checklist. **Push order: `013` → `014` → `015`**, and review `015` manually before pushing — it changes entitlement-critical privileges.
>
> **Update (2026-07-03):** migration 015 closed *direct table writes*, but the server route it introduced (`/api/progress/sync-gamification`) still trusted a client-computed XP/state payload — a crafted request could inflate XP, rank, or streaks. That gap is now closed: the route is retired (returns `410 Gone`) and replaced by `/api/progress/record-activity`, which accepts only learning-event *facts* and computes XP/level/rank/streak entirely server-side from a new catalog (`lib/gamification/xp-catalog.ts`) and the trusted `xp_events` ledger. No schema/migration change was needed for this pass. See [Gamification trust boundary closure](#gamification-trust-boundary-closure-post-015) for the full writeup, including what's still **not** covered (achievements/`competency_score` — flagged, not silently skipped).

---

## Executive summary

The schema is in good shape for a pre-launch product: RLS is universal, cascade deletes are correct, and the audit fixes already queued in migration 013 close every real bug found. The database is **not** the risky part of this stack. **The RLS *policy design* on the money-and-reputation tables is.**

**The one finding that matters most:** `user_subscriptions` — the table every paywall check in the app trusts as ground truth — has an owner-scoped `UPDATE` policy with no restriction on *which columns* an owner can change. Because `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` are, by definition, public, any signed-in user can open the browser console and run:

```js
await supabase.from('user_subscriptions')
  .update({ plan: 'annual', status: 'active', current_period_end: '2099-01-01' })
  .eq('user_id', myOwnId)
```

RLS evaluates `auth.uid() = user_id` — true — and grants themselves a year of Pro for free, invisibly to Stripe. Every layer built this session (`proxy.ts`, `requireProUser()`, `hasProAccess()`) faithfully reads this table and would grant access, because they're doing exactly what they were designed to do — trust the database. The bug isn't in the gating code; it's one layer beneath it. See [Part 5](#part-5--security) for the fix. This should be treated as a **pre-launch blocker**, not a backlog item — it's cheap to fix and expensive to leave.

The same root-cause pattern (owner-scoped RLS with no column restriction) also applies to every gamification table (`profiles.xp/level/streak`, `user_stats`, `xp_events`, `user_progress`) — lower severity (leaderboard integrity, not revenue), same fix shape.

> **✅ Fixed by migration 015.** See [Migration 015 — fix summary](#migration-015--fix-summary) at the end of this document.

**Production readiness score: 78/100** (see [Part 9](#part-9--production-score)). The architecture is sound; the score is held down almost entirely by the subscription-write gap and by 19 dead tables still shipping in every migration replay.

---

## Part 1 — Schema Review

46 tables split into four groups by how they're actually used today. Legend for compact columns:

- **RLS** — row-level security enabled (all 46 tables: yes, no exceptions).
- **Trig** — has the `set_updated_at()` trigger (✅ after migration 013 is applied; today only `profiles` and content-less tables without `updated_at` are exempt).
- **Growth** — `1/user` (capped, one row per user, never grows past user count), `append` (unbounded, grows every event forever), `catalog` (small, admin-managed, near-static), `dead` (zero rows expected, superseded).
- **Verdict** — keep / archive-candidate / drop-candidate.

### Group A — Core identity & subscription (5 tables, all live)

| Table | Purpose | PK | FK | Indexes | Cascade | Trig | Growth | Verdict |
|---|---|---|---|---|---|---|---|---|
| `profiles` | Root user record: identity, gamification counters, onboarding, plan flags | `id` (=`auth.users.id`) | `id → auth.users` | `xp desc`, `xp_week desc`, `xp_today desc`, `lower(username)` unique partial, `onboarding_completed` partial | cascades from `auth.users` delete | ✅ | 1/user | Keep — but see Part 2 for dead/duplicate columns |
| `user_subscriptions` | Stripe subscription mirror; sole source of truth for Pro gating | `id` | `user_id → profiles`, unique | unique(`user_id`) | cascade | ✅(013) | 1/user | Keep — **RLS needs tightening, see Part 5** |
| `user_settings` | Free-form settings blob (theme, misc prefs) | `user_id` | `→ profiles` | PK | cascade | ✅(013) | 1/user | Keep |
| `privacy_settings` | Leaderboard/profile visibility toggles | `user_id` | `→ profiles` | PK | cascade | none (no `updated_at`) | 1/user | Keep |
| `notification_preferences` | Email/push preference toggles | `user_id` | `→ profiles` | PK | cascade | none | 1/user | Keep — dormant until Resend ships, but schema is ready |

### Group B — Progress, gamification & activity (16 tables, all live)

| Table | Purpose | PK | FK | Indexes | Cascade | Trig | Growth | Verdict |
|---|---|---|---|---|---|---|---|---|
| `user_learning_state` | Full client `UserState` snapshot (JSONB) — the real progress store | `user_id` | `→ profiles` | PK | cascade | ✅(013) | 1/user, but **payload grows unbounded inside** — see Part 3 | Keep, needs pruning strategy |
| `streaks` | Current/longest streak mirror | `user_id` | `→ profiles` | PK | cascade | ✅(013) | 1/user | Keep |
| `weekly_targets` | Weekly study-day goal + completion map | `user_id` | `→ profiles` | PK | cascade | ✅(013) | 1/user | Keep |
| `user_stats` | Denormalised leaderboard/profile counters | `user_id` | `→ profiles` | PK only (no index on `lifetime_xp`) | cascade | ✅(013) | 1/user | Keep — **add sort index, Part 4** |
| `trader_competence` | Per-pillar competence snapshot (0–100 each) | `user_id` | `→ profiles` | PK | cascade | ✅(013) | 1/user | Keep |
| `live_trading_phase` | Live-trading readiness gate state | `user_id` | `→ profiles` | PK | cascade | ✅(013) | 1/user | Keep — `checklist` jsonb column is never written (dead column, harmless) |
| `xp_events` | Append-only XP ledger (leaderboard periods) | `id` | `user_id → profiles` | `(user_id,date_key)`, `(user_id,week_key)` | cascade | n/a (insert-only) | append | Keep — plan retention policy before 100k users |
| `user_progress` | Generic entity progress (`entity_type`+`entity_id`) | `id` | `user_id → profiles` | `(user_id,entity_type)`, unique(`user_id,entity_type,entity_id`) | cascade | ✅(013) | append (bounded by content catalog size) | Keep |
| `user_lesson_progress` | Lesson-specific progress mirror | `id` | `user_id → profiles` | unique(`user_id,lesson_id`) | cascade | ⚠️ column is `last_updated`, not `updated_at` — not covered by the generic trigger | append (bounded) | Keep — rename column for consistency (Part 2) |
| `behavioral_events` | Append-only pillar-scored activity log | `id` | `user_id → profiles` | `(user_id)`(013), `(user_id,pillar)` | cascade | n/a (insert-only) | append, unbounded | Keep — needs retention/partitioning plan before 100k |
| `progress_archives` | Snapshot dump on progress reset | `id` | `user_id → profiles` | `(user_id)` | cascade | n/a (insert-only) | append, rare (only on reset) | Keep |
| `progress_reset_events` | Audit log of reset actions | `id` | `user_id → profiles` | `(user_id)`(013) | cascade | n/a (insert-only) | append, rare | Keep |
| `user_badges` | Earned badge join table | `(user_id,badge_id)` | `user_id → profiles`, `badge_id → badges` | `(badge_id)`(013) | cascade | n/a | append (bounded by badge catalog) | Keep |
| `badges` | Badge catalog | `id` (text) | — | PK | n/a | n/a | catalog | Keep |
| `feature_enrollments` | "Which product areas has this user opened" tracker | `id` | `user_id → profiles` | unique(`user_id,feature_id`) | cascade | n/a | append (bounded, UX only) | Keep — **UPDATE policy missing until 013 applied** |
| `path_enrollments` | Learning-path enrollment tracker | `id` | `user_id → profiles` | unique(`user_id,path_id`) | cascade | n/a | append (bounded) | Keep |
| `account_deletion_requests` | GDPR-style deletion request record | `user_id` | `→ profiles` | PK | cascade | n/a | 1/user | Keep — **UPDATE policy missing until 013 applied**; scope it to `status='cancelled'` only (Part 5) |

### Group C — Scaffolded, not superseded (8 tables, dormant, forward-built)

| Table | Purpose | PK | FK | Indexes | Cascade | Trig | Growth | Verdict |
|---|---|---|---|---|---|---|---|---|
| `friendships` | Friend graph for future friend leaderboards | `(user_id,friend_id)` | both `→ profiles` | `(friend_id)`(013) | cascade both sides | n/a | append | Keep — real near-term feature dependency |
| `achievements` | Achievement catalog | `id` (text) | — | PK | n/a | n/a | catalog | Keep |
| `user_achievements` | Earned-achievement join table | `(user_id,achievement_id)` | `user_id → profiles`, `achievement_id → achievements`(013, was missing) | PK | cascade | n/a | append (bounded) | Keep |
| `simulator_sessions` | Full trading-simulator session log | `id` | `user_id → profiles` | `(user_id)`(013) | cascade | n/a | append, unbounded | Keep — plan retention before it's wired up |
| `chart_drill_sessions` | Chart Lab drill session log | `id` | `user_id → profiles` | `(user_id)`(013) | cascade | n/a | append, unbounded | Keep |
| `trend_sessions` | Trend Spotter session log | `id` | `user_id → profiles` | `(user_id)`(013) | cascade | n/a | append, unbounded | Keep |
| `strategy_sessions` | Strategy Wiki quiz session log | `id` | `user_id → profiles` | `(user_id)`(013) | cascade | n/a | append, unbounded | Keep |
| `community_waitlist` | Landing-page waitlist form | `id` | `user_id → profiles` (nullable, `set null`) | unique(`email`) | `set null` | n/a | append, bounded by signups | Keep — anon insert, no select (correct) |

### Group D — Superseded legacy content/progress model (19 tables, dead)

Zero `.from(...)` call sites anywhere in the app (confirmed by grepping the full codebase). All are RLS-correct and harmless to leave, but they:
- ship schema/migration weight for a data model the product no longer uses,
- confuse anyone reading the schema fresh (two competing "lesson progress" concepts),
- cost nothing at rest (0 rows), so there is **no urgency**, only a documentation/cleanup decision.

| Table | Superseded by | Verdict |
|---|---|---|
| `learning_paths`, `modules`, `lessons` | `content/registry` (static TS) | Drop-candidate |
| `quizzes`, `quiz_questions`, `quiz_attempts` | `content/quizzes` + `user_learning_state.quizAttempts[]` | Drop-candidate |
| `lesson_progress`, `path_progress`, `book_progress`, `flashcard_progress`, `chart_progress`, `trend_progress`, `strategy_progress` | `user_learning_state.state_json` sub-slices | Drop-candidate |
| `drill_sessions`, `ai_reviews`, `journal_entries` | `user_learning_state` + (dormant) `chart_drill_sessions`/`simulator_sessions` | Drop-candidate |
| `assessments` | `trader_competence` + `behavioral_events` | Drop-candidate |
| `enrollments` | `feature_enrollments` (see migration history note, Part 8) | Drop-candidate — literal duplicate, not just superseded |

**Recommendation unchanged from the last audit:** decide, don't drop silently. I'd drop all 19 now, pre-launch, while it's a zero-user, zero-data decision — see [Part 10](#part-10--recommendations).

---

## Part 2 — Naming Consistency

Overall the schema is disciplined: 100% `snake_case`, `created_at`/`updated_at`/`_id` conventions are followed almost everywhere, and `text + check constraint` is used consistently instead of native enums (a good choice — see below). The gaps found are narrow and mechanical:

| Finding | Detail | Recommendation |
|---|---|---|
| `trading_goals` type ambiguity | Migration 005 created it as `jsonb`. Migrations 007, 010, and 012 each independently tried to (re-)create it as `text[]` via `add column if not exists` — all three were silent no-ops since the column already existed. **Live type today is `jsonb`** (confirmed via `database.types.ts`), but the migration files themselves are misleading — someone reading 007 in isolation would believe it's `text[]`. App code (`normalizeTradingGoals()`) defensively accepts `Json \| string[]` to survive either shape. | Leave the live type as-is (it works); add a one-line comment in 007/010 migration files is not worth touching now. In a future squash, resolve to a single, explicit type. |
| `experience_level` vs `trading_experience` | Two columns for the same concept. `experience_level` is current; `trading_experience` is a legacy fallback only read in `lib/settings/repository.ts`, never written by new code. | Low-priority cleanup: drop `trading_experience` once confirmed no historical rows depend solely on it. |
| `leaderboard_opt_in` vs `public_leaderboard` | Two booleans for the same concept, kept equal by app code and `coalesce()` reads everywhere rather than a single source column. | Collapse to one column in a future migration; not urgent — every read site already `coalesce()`s both. |
| `user_lesson_progress.last_updated` | Every other table uses `updated_at`; this one alone uses `last_updated`. Cosmetic, but it also means this table was silently excluded from the generic `set_updated_at()` safety-net trigger in migration 013 (a differently-named column needs a differently-named trigger target). | Rename to `updated_at` in a future migration, or add an explicit `last_updated`-targeting trigger now — I'd do the rename since it's the only outlier. |
| `_id` used for non-FK content slugs | `path_id`, `lesson_id`, `concept_id`, `strategy_id`, `feature_id` etc. are free-text identifiers pointing into `content/registry`, **not** foreign keys — there's no DB-level referential integrity backing them (by design, since the registry lives in TypeScript, not Postgres). Using the `_id` suffix implies a checked reference to a reader; a `_slug` suffix would signal "trust the app layer, not the DB" more honestly. | Cosmetic-only — do not rename now (would touch every progress-sync call site for zero functional gain). Worth adopting `_slug` naming for any *new* content-reference columns going forward. |
| `status` check-constraint coverage gap | Every "used" table's `status` column has a `check` constraint enumerating valid values, **except** two Group-D dead tables (`drill_sessions.status`, `enrollments.status`), which accept arbitrary text. | No action needed — both tables are drop-candidates. If either is ever revived, add the missing constraint first. |
| `type`/`kind`/`category` | Consistently `_type` (`event_type`, `drill_type`, `session_type`, `question_type`) or `category` (`achievements.category`, `lessons.category`). No `kind` found anywhere, no collisions. | No action — this one's clean. |
| `deleted_at` / soft deletes | Not used anywhere in the schema — every delete is a hard, cascading delete. This is consistent (no accidental partial adoption), not a gap. | Worth a deliberate decision before `journal_entries`/community content ship for real: do you want "undo delete" on user-generated content? If yes, add `deleted_at` intentionally rather than retrofitting later. |

**Bottom line:** no renames are urgent enough to justify touching live data pre-launch. The two genuinely worth doing in the next migration window are the `user_lesson_progress.last_updated → updated_at` rename (five-minute fix, closes the trigger gap) and eventually collapsing the `leaderboard_opt_in`/`public_leaderboard` duplication.

---

## Part 3 — JSON Columns

Every JSONB column in the live (non-superseded) schema:

| Column | Size profile | Verdict |
|---|---|---|
| `user_learning_state.state_json` | **Large, unbounded, grows for the life of the account** | See deep-dive below |
| `user_settings.settings_json` | Small, fixed shape, bounded | Appropriate as JSON |
| `weekly_targets.active_days_by_week` | Small, one entry added per week, effectively bounded (old weeks could be trimmed but cost is negligible) | Appropriate as JSON |
| `behavioral_events.metadata` | Small per-row payload, table itself is append-only | Appropriate as JSON |
| `progress_archives.archived_state` | Snapshot-by-design, written rarely (only on explicit reset) | Appropriate as JSON |
| `live_trading_phase.checklist` | Never actually written by app code today (confirmed via grep) — dead column, defaults to `{}` forever | No action; note for future cleanup if this feature is revived without checking it first |
| `profiles.trading_goals` | Small, fixed-vocabulary tag list (≤10 items) | Appropriate as JSON regardless of the jsonb/text[] ambiguity in Part 2 |

### Deep dive: `user_learning_state.state_json`

**What it holds:** effectively the entire client `UserState` object — level/xp/streak snapshot, `lessonProgress[]`, `quizAttempts[]`, `drillSessions[]`, `journalEntries[]`, `activityLog[]`, gamification/badge state, live-trading-phase detail, and per-feature (book/flashcard/chart/trend/strategy) sub-progress — serialized as one JSONB blob per user, fully read and fully rewritten on every sync (`fetchLearningState` / `saveLearningState` in `lib/supabase/sync.ts`).

**Current complexity:** low today — new accounts, small payloads, sync round-trips are cheap.

**Should this remain JSON, or become relational?**

This is best understood as a **deliberate hybrid, not an oversight** — the schema already mitigates the JSON blob's biggest weakness (you can't query inside it) by dual-writing the facts that need to be queried/sorted/joined into purpose-built normalized tables alongside it: `user_stats` (leaderboard aggregates), `xp_events` (period queries), `user_progress`/`user_lesson_progress` (per-item status), `behavioral_events` (analytics). The JSON blob's actual job is narrower than it looks: "restore this user's exact client state on a new device," not "be the system of record for anything that needs to be queried across users."

Given that framing, the recommendation is **keep the blob, but bound its growth**:

- **Pros of keeping it as JSON:** zero migration risk, matches the client's existing state shape exactly (no serialization mismatch), trivial to version (`STATE_VERSION` already exists in `sync.ts`), cheap to add new client-side fields without a migration.
- **Cons / scaling concern:** `activityLog[]`, `journalEntries[]`, `quizAttempts[]`, `lessonProgress[]` inside the blob are **never pruned** — they only grow. A user active daily for 2 years could plausibly accumulate a multi-hundred-KB to low-MB JSON document. Since every sync reads and rewrites the *entire* document, sync cost scales with **lifetime activity**, not with the size of the actual change being synced — this is the one real architectural risk in the whole schema.
- **Migration recommendation:** no schema change needed pre-launch. Before scaling past a few thousand active users, add: (1) a client-side cap on `activityLog` (e.g. keep the last N entries, roll older ones into `progress_archives`, which already exists for exactly this purpose but is currently only invoked on a full reset, not routine pruning), and (2) a payload-size guard/alert so an unbounded blob is caught in monitoring rather than discovered via a slow sync. If growth ever becomes a real problem, the natural next step is moving `journalEntries` specifically into its own row-per-entry table (it already has an abandoned true-relational ancestor in the dead `journal_entries` table from Group D — ironic, but a fine template to resurrect if needed) since it's the one sub-object with genuinely unbounded, user-authored, individually-addressable content (a future Storage-backed image per entry only makes this more true).

---

## Part 4 — Performance

### Growth model

Every live table falls into one of three growth shapes (tagged in Part 1): **`1/user`** (linear in user count, small, capped), **`append`** (linear in user count × activity, unbounded per user), **`catalog`** (near-static, admin-managed). Nothing in the schema is quadratic or worse.

| Users | `1/user` tables (rows each) | Largest `append` tables (rough rows) | Practical impact |
|---|---|---|---|
| 10 | 10 | Tens | None. Anything works. |
| 100 | 100 | Hundreds–low thousands | None. |
| 1,000 | 1,000 | `xp_events`/`behavioral_events`: tens of thousands | Leaderboard `ORDER BY ... LIMIT 50` on ~1,000 rows: sub-millisecond even unindexed. |
| 10,000 | 10,000 | `xp_events`/`behavioral_events`: hundreds of thousands to low millions | Leaderboard sort over ~10k opted-in rows starts to be measurable (single-digit ms) but still fine. `user_learning_state` blob sizes start to matter for the most active cohort. |
| 100,000 | 100,000 | `xp_events`/`behavioral_events`: tens of millions | This is where the two real findings below start to bite. |

### Specific findings

1. **Leaderboard query has no supporting index for its actual sort expression (Medium).** `fetchPublicLeaderboard()` sorts `leaderboard_public` by `lifetime_xp`/`daily_xp`/`weekly_xp`/`monthly_xp`, but the view computes these as `coalesce(user_stats.x, profiles.y, 0)` — a computed expression, not a raw column. The plain btree indexes that exist (`profiles.xp desc`, `profiles.xp_week desc`, `profiles.xp_today desc`) generally can't be used by the planner for a sort on a `coalesce()` expression over two tables. At 100k users this becomes a full scan + sort of every opted-in row on every leaderboard page view, with **no caching layer** in front of it (`use-leaderboard.ts` calls `fetchPublicLeaderboard` directly, no `revalidate`/`unstable_cache`). Not urgent at current scale; becomes the single most important perf fix as the leaderboard becomes a heavily-trafficked page.
2. **`user_learning_state.state_json` full-document read/write on every sync (Medium, see Part 3).** Cost scales with lifetime activity per user, not update size. Same root cause discussed above.
3. **Append-only logs have no retention policy (Low today, Medium at 100k).** `xp_events`, `behavioral_events`, `simulator_sessions`, `chart_drill_sessions`, `trend_sessions`, `strategy_sessions` all grow forever with no archiving/partitioning story. At 100k active users these could individually reach tens of millions of rows within a couple of years — still index-able and queryable, but worth a retention/rollup plan (e.g. materialize monthly XP totals and drop event-level detail older than N months) before that point, not before launch.
4. **`user_stats` has no index beyond its primary key (Low).** It's read one row at a time (`user_id = $1`, PK lookup) except when joined into the leaderboard view, so this is fine today; only matters if `user_stats` is ever queried/sorted directly instead of through the view.
5. **No missing indexes on any hot single-row lookup path.** Every `user_id = $1` / `id = $1` read used by the app (subscription check, profile fetch, settings fetch, progress fetch) is backed by a primary key or unique index. This is the majority of query volume in the app and it's fully covered.
6. **No expensive joins found.** The only multi-table join in the live schema is the two-table `profiles ⟕ user_stats` leaderboard view — small, and the only one that needs the index work above.

No changes recommended before launch; items 1–3 are the concrete pre-scale backlog.

---

## Part 5 — Security

### No public writes
**Pass**, with one caveat. Every table requires `authenticated` role and an `auth.uid()` match for writes, except: `community_waitlist` (anonymous `insert` only, by design — no `select`, so it can't be enumerated), and the six Storage buckets' public-read policies (all `select`-only, no write). No table grants `insert`/`update`/`delete` to `anon`.

### Correct owner-only policies
**Mostly pass, with the one critical gap below.** Every table's `USING`/`WITH CHECK` clause correctly scopes rows to `auth.uid() = user_id` (or `= id` for `profiles`). What's *not* checked anywhere in the schema is **which columns** an owner can change within their own row — Postgres RLS filters rows, not columns, and this schema has no column-level `GRANT`s layered on top. That gap is invisible for tables where "the owner can freely set any field on their own row" is actually fine (settings, privacy, notification preferences — there's no wrong value a user can set there that matters to anyone else). It is **not fine** for two categories of table:

- **🔴 Critical — `user_subscriptions`.** The owner-scoped `UPDATE` policy has no restriction on `plan`, `status`, or `current_period_end` — the exact three fields every Pro-gate in the app (`hasProAccess()`, `requireProUser()`, `proxy.ts`) trusts as ground truth. A user can grant themselves permanent Pro access with a single authenticated REST call, completely bypassing Stripe. The only legitimate client-side write today is `provider_customer_id` (set once by `/api/checkout`, using the user's own RLS-scoped session — confirmed in `app/api/checkout/route.ts`). Real subscription state changes already flow exclusively through the webhook using the service-role/admin client (confirmed in `lib/stripe/sync.ts`). **This means the fix is a pure hardening change with zero legitimate-flow breakage**: Postgres supports column-level privileges — `revoke update on user_subscriptions from authenticated; grant update (provider_customer_id) on user_subscriptions to authenticated;` — combined with the existing row policy. A forged `status`/`plan` update would then fail at the privilege-check layer before RLS is even evaluated. I have **not** written this migration (out of scope for a review-only pass), but it should be the very next thing shipped after this document, ahead of 013/014.
  - Related: `setTestSubscription()` in `lib/data/subscription-service.ts` is a "dev/test helper" with no environment guard and is currently unused (not wired to any route) — dead code today, but a live landmine if anyone ever adds a debug/admin route that calls it without adding a guard. Recommend deleting it or wrapping it in an explicit `if (process.env.NODE_ENV === "production") throw`.
  - **✅ Fixed by migration 015** — `authenticated` now has `SELECT`-only privilege on `user_subscriptions`; `provider_customer_id` writes moved to the service-role client in `/api/checkout`. `setTestSubscription()` was deleted rather than guarded (see [Migration 015](#migration-015--fix-summary)).
- **🟠 High — gamification integrity (`profiles.xp/level/streak/rank_tier/competency_score`, `user_stats`, `xp_events.amount`, `user_progress`/`user_lesson_progress.status`).** Same root-cause pattern: the client computes XP/level/streak/competence locally and syncs the result up via the user's own RLS-scoped session, with no server-side recomputation or validation. A technically-savvy user can directly set these fields (or insert fabricated `xp_events` rows) to top the public leaderboard fraudulently. This is a trust/reputation risk, not a revenue risk — lower severity than the subscription gap, but it sits on the same fix pattern (narrow the writable columns, or move to a `security definer` RPC that recomputes values server-side instead of trusting the client-submitted number) and is worth doing before the leaderboard is a public-facing trust signal at any real scale.
  - **✅ Fixed by migration 015** for `profiles`/`user_stats`/`xp_events` — column-level grants now restrict `authenticated` to identity/preference fields on `profiles`, and to `SELECT`-only on `user_stats`/`xp_events`. `user_progress`/`user_lesson_progress` were intentionally left as owner-writable (see [Migration 015](#migration-015--fix-summary) for why) — forging a progress row doesn't bypass any paywall (the free-tier gate is route-based, not progress-based) or move a leaderboard-sort column.

### Service-role usage
**Pass.** Service-role key usage is correctly confined to server-only code: the Stripe webhook handler (`createAdminClient()`, only after signature verification succeeds) and the Storage admin helper (`lib/storage/server.ts`, for lesson/library asset writes). Middleware/proxy never touches the service-role key — it uses the cookie-bound, RLS-respecting client, avoiding edge-runtime key exposure.

### Storage RLS
**Pass.** All six buckets reviewed against migration 014: public buckets (`avatars`, `lesson-assets`, `library-assets`, `community-images`) grant `select` to everyone but restrict writes to the owning folder (`auth.uid()::text = (storage.foldername(name))[1]`) or to service-role-only (lesson/library assets have no client insert/update/delete policy at all, by design). Private buckets (`journal-images`, `chart-screenshots`) are fully owner-scoped for all operations. No bucket allows a user to write into another user's folder or to overwrite admin-only content.

### Subscription protection
**Partially fails — see the critical finding above.** Server-side *read* enforcement (`requireProUser`, `proxy.ts`) is correctly implemented and never trusts client-reported state — it re-queries `user_subscriptions` on every request. The gap is entirely on the *write* side of that same table.

### Webhook safety
**Pass.** `app/api/stripe/webhook/route.ts` verifies `stripe.webhooks.constructEvent()` with the raw request body and `STRIPE_WEBHOOK_SECRET` before processing any event, returns 400 on missing/invalid signature, returns 501 (not silently succeeding) if the secret or admin credentials aren't configured, and only uses the admin client after verification succeeds.

### No privilege escalation / no cross-user reads
**Pass**, modulo the write-side finding above (which is "escalate your own privilege," not "read someone else's data"). I found no policy anywhere that allows `select`/`update`/`delete` across a different `auth.uid()`, other than the two intentionally shared-visibility cases: `friendships` (both the requester and the invited friend can see the row they're both party to — correct) and `leaderboard_public` (a view that deliberately exposes a narrow, opt-in, non-PII column set to everyone — correct and by design).

---

## Part 6 — Backup & Recovery

- **PITR (Point-in-Time Recovery):** enable Supabase's PITR add-on on the production project before real user data accumulates. At current/near-term scale the cost is small relative to the risk of an unrecoverable bad migration or accidental delete. This is the single highest-leverage backup investment for a one-person/small-team project — it turns almost any mistake into a "restore to 5 minutes ago" instead of a data-loss incident.
- **Scheduled backups:** Supabase's daily managed backups (available even without PITR) should be confirmed *on* for the project regardless of PITR — treat PITR as the fast/precise recovery path and daily snapshots as the long-retention fallback.
- **Migration strategy:** keep doing exactly what this project already does — numbered, idempotent (`if not exists` / `drop ... if exists`), forward-only migrations checked into `supabase/migrations/`, applied via `supabase db push`. The one gap: there's no automated CI step that runs `supabase db push --dry-run` (or applies migrations to a throwaway branch/preview DB) before merge — worth adding once there's a CI pipeline, so a broken migration is caught before it reaches production.
- **Rollback strategy:** this schema has no `down` migrations (Supabase's CLI doesn't require them, and none exist here). For a project this size that's a reasonable trade-off, but it means rollback today = "write and apply a new forward migration that undoes the change" or "restore from PITR/backup." Recommend: for any future migration that drops a column/table, always ship it as two steps (stop reading/writing it in app code + deploy; *then*, in a later migration, actually drop it) so there's always a window to reverse course without a restore.
- **Seed strategy:** no `supabase/seed.sql` exists today. For local development and CI, add one that creates a handful of realistic demo `profiles`/`user_subscriptions`/`user_learning_state` rows — this also makes the leaderboard/gamification code testable without a real signup flow. Low urgency, high convenience.
- **Local development strategy:** the standard `supabase start` (local Postgres + Auth + Storage in Docker) workflow works unmodified with this migration set since every migration is idempotent — no local-only workarounds needed. Recommend documenting the exact local setup steps (`supabase start`, `supabase db reset`, env var wiring) in the README once onboarding a second contributor becomes relevant; not urgent solo.

---

## Part 7 — Documentation

This document *is* Part 7's deliverable. Summary of what's covered where:

- **Architecture overview:** [Executive summary](#executive-summary) above, and the "headline finding" framing in [`database-audit.md`](./database-audit.md#headline-finding-19-of-46-tables-are-dead) (two schema generations layered on top of each other).
- **Mermaid ERD:** full diagrams already live in [`database-erd.md`](./database-erd.md) (core identity, progress/gamification, leaderboard view, scaffolded features) — not duplicated here to avoid drift between two copies of the same diagram; that file is the source of truth and is current as of migration 013.
- **Table catalogue:** [Part 1](#part-1--schema-review) above (46 tables, 4 groups).
- **Storage buckets:** [`storage.md`](./storage.md) — 6 buckets, path conventions, RLS rules; cross-checked against migration 014 in [Part 5](#storage-rls) and [Part 8](#part-8--migration-review) of this document.
- **RLS summary:** [Part 5](#part-5--security).
- **Indexes:** [Part 1](#part-1--schema-review) (per-table) and [Part 4](#part-4--performance) (gaps/recommendations).
- **Growth expectations:** [Part 4](#part-4--performance).
- **Future migrations:** [Part 10](#part-10--recommendations).
- **Technical debt:** [Part 2](#part-2--naming-consistency) (naming), [Part 1 Group D](#group-d--superseded-legacy-content-progress-model-19-tables-dead) (dead tables), [Part 5](#part-5--security) (RLS column-scoping gap).
- **Dropped-table candidates:** [Part 1 Group D](#group-d--superseded-legacy-content-progress-model-19-tables-dead) — 19 tables, full list with what superseded each one.

---

## Part 8 — Migration Review

| Migration | Verdict | Notes |
|---|---|---|
| `001_initial_schema.sql` | **Superseded** (mostly) | Built the original Codecademy-style content model. All 8 tables it created that are still referenced today (`profiles`, `badges`, `user_badges`, `path_enrollments`, `feature_enrollments`) are fine; the other ~13 (`learning_paths`, `modules`, `lessons`, `quizzes`, `quiz_questions`, `quiz_attempts`, `drill_sessions`, `ai_reviews`, `journal_entries`) are Group-D dead tables. Squash-candidate for a future "v1 baseline" migration once the drop decision is made. |
| `002_learning_progress.sql` | **Mixed** | `user_learning_state` (still the core progress store, live) alongside now-dead `path_progress`/`book_progress`/`flashcard_progress`/`chart_progress`/`trend_progress`/`strategy_progress`/`assessments`. Same squash-candidate note as 001. |
| `003_competence_system.sql` | **Safe, mostly live** | `behavioral_events`, `trader_competence`, `live_trading_phase`, `progress_archives` all live and correct. `user_lesson_progress` also created here — still live, but its `last_updated` naming outlier (Part 2) originates in this file. |
| `004_gamification_leaderboard.sql` | **Safe, live** | `user_achievements`, `friendships` (Group B/C, live/dormant-real), the first version of `leaderboard_public` (later replaced by 006/007's version — fine, `create or replace view` is safe to layer). |
| `005_user_settings.sql` | **Safe, live** | `user_settings`, `privacy_settings`, `notification_preferences`, `progress_reset_events`, `account_deletion_requests` — all live, correctly scoped. Origin of the `trading_goals jsonb` type (Part 2). |
| `006_supabase_production.sql` | **Safe, live, one questionable design choice** | `user_stats`, `xp_events`, `user_progress` — all live and correctly indexed/scoped. Creates `enrollments` as a lightweight read-only *view* over `feature_enrollments` — a good, safe design (no duplicate storage). |
| `007_connect_tradetrainer_ai.sql` | **Needs revision (superseded intent)** | **Drops the safe `enrollments` view from 006 and replaces it with a real, independently-writable `enrollments` *table*** that duplicates `feature_enrollments`'s concept with separate storage. This table is confirmed dead (zero call sites) — the "connect" migration's `enrollments` table never actually got used; `feature_enrollments` remained the one real path. No live risk today (it's simply unused), but this is the one migration I'd flag as an actual design mistake worth reverting to the 006 view approach if `enrollments` is ever revived, rather than keeping two physically separate tables for one concept. |
| `008_user_subscriptions.sql` | **Safe schema, RLS needs hardening** | Table structure, check constraints, and bootstrap trigger are all correct. This is the migration whose RLS policies need the column-level tightening described in [Part 5](#part-5--security) — not a bug in this migration specifically (it's a reasonable default that just needs narrowing now that the app's real write pattern is known), but the priority fix. |
| `009_onboarding_flow.sql` | **Superseded by 012** | Added `onboarding_step`/`onboarding_completed_at`/`preferred_market` + a step check constraint. Squash-candidate — 012 re-establishes the same columns/constraints idempotently. |
| `010_onboarding_profile_columns.sql` | **Superseded by 012** | Explicitly a "safety-net re-run" migration (per its own header comment) for a partially-applied 009. Fully redundant once 012 is applied; safe to leave (idempotent) or squash later. |
| `011_leaderboard_opt_in_default.sql` | **Superseded by 012** | Single-purpose default-flip + backfill; 012 repeats the same backfill logic. Squash-candidate. |
| `012_onboarding_schema_complete.sql` | **Safe, live, the real baseline** | This is the migration that should have been the *only* onboarding migration — it's the idempotent, complete version that supersedes 009/010/011. Also the origin of the generic `set_updated_at()` function (only attached to `profiles` until 013). |
| `013_database_audit_fixes.sql` | **Safe, not yet applied** | Reviewed in the prior audit pass. Additive/non-destructive (policies, indexes, one FK constraint, triggers, dropping only redundant indexes). Ready to push. |
| `014_storage_buckets.sql` | **Safe, not yet applied** | Reviewed fresh in this pass (Part 5). Idempotent (`on conflict do update` for buckets, `drop policy if exists` for policies), correctly scoped RLS on all 6 buckets, no gaps found. Ready to push. |
| `015_harden_subscription_and_gamification_rls.sql` | **Critical, not yet applied — review before pushing** | Closes the `user_subscriptions`/`user_stats`/`xp_events`/`user_achievements`/`profiles`-gamification-columns write gap described in Part 5. Non-destructive (privileges/policies only, no data changes) and idempotent (`drop policy if exists`, `revoke`/`grant` are safe to re-run). Paired with an app-code change (new `/api/progress/sync-gamification` route) that must ship in the **same deploy** as this migration — see [Migration 015](#migration-015--fix-summary) for why the two are coupled. |

**Squash candidates for a future "v1 baseline" migration** (purely a maintainability cleanup, not urgent): `009` + `010` + `011` → already fully absorbed by `012`; and, if/when the Group-D drop decision is made, `001`/`002`'s dead-table halves could be removed from history entirely in a rebased baseline. Neither is needed before `013`/`014` ship — migration replay is idempotent and safe as-is.

---

## Part 9 — Production Score

> Scores below are **as originally found**, before migration 015. With 015 applied: **Security rises to ~86/100** (the two exploitable gaps are closed; residual points held back only by the not-yet-implemented deeper XP-recomputation validation, which is explicitly out of scope for this pass) and **Overall rises to ~83/100**. Architecture/Maintainability/Developer-Experience scores are essentially unchanged by 015 (it's a privilege/RLS change, not a structural one) — those still track the Part 1/2 findings (19 dead tables, onboarding-migration duplication, naming ambiguities).

| Category | Score | Why |
|---|---|---|
| **Architecture** | 82/100 | Sound RLS-first design, clean separation of auth/subscription/progress/gamification concerns, sensible hybrid JSON+relational pattern for progress. Docked for the two-schema-generations situation (19 dead tables) and the duplicate-concept tables (`enrollments`/`feature_enrollments`, `leaderboard_opt_in`/`public_leaderboard`). |
| **Security** | 68/100 | Every table has RLS, cascade deletes are correct, webhook/service-role usage is textbook, storage policies are clean. Held down specifically by the `user_subscriptions` column-scoping gap (critical, revenue-bypassable) and the gamification-integrity gap (high, leaderboard-fraud-able). Neither is exploited today, both are trivially exploitable by anyone who opens dev tools. |
| **Scalability** | 80/100 | Comfortably handles 10→10,000 users with zero changes. Two concrete, well-understood bottlenecks appear before 100,000 users (leaderboard sort expression, unbounded JSON blob growth) — both have clear, scoped mitigations already identified, neither requires a rearchitecture. |
| **Maintainability** | 74/100 | Migrations are consistently idempotent and safe to replay — a real strength. Docked for 19 dead tables shipping in every fresh deploy, 4 overlapping onboarding migrations that should be one, and a couple of duplicate-concept column pairs that force every reader to `coalesce()` two sources of truth. |
| **Developer Experience** | 79/100 | Strong: consistent snake_case, consistent RLS pattern any new table can copy, generated types (`database.types.ts`) kept in sync, helper libraries (`lib/data/*`, `lib/storage/*`) cleanly wrap raw table access. Docked for the trading_goals jsonb/text[] ambiguity and the `last_updated` naming outlier being genuine "wait, why is this different" moments for a new contributor. |
| **Performance** | 81/100 | No missing indexes on any hot single-row path, no expensive joins beyond the one (small, fixable) leaderboard view. Docked only for the two Part 4 findings, both of which are "will matter at scale," not "matters today." |
| **Overall Production Readiness** | **78/100** | This is a genuinely solid pre-launch database — better than most solo/small-team SaaS products at this stage. It is **not** production-ready for real paying users until the subscription-write gap is closed; everything else here is "should fix soon," not "must fix first." |

---

## Part 10 — Recommendations

**Critical**
1. ~~Close the `user_subscriptions` RLS write gap before any real payment flows go live~~ — **✅ done in migration 015** (column/privilege-level lock-down, `provider_customer_id` moved to service-role in `/api/checkout`).

**High**
2. ~~Apply the same column-scoping pattern to the gamification write surface — `profiles` (xp/level/streak/rank_tier/competency_score), `user_stats`, `xp_events.amount`~~ — **✅ done in migration 015**, paired with the new `/api/progress/sync-gamification` server route. Residual: this still trusts the client-submitted XP/activity values inside a plausible request shape — full recomputation from authoritative content-registry facts is a larger follow-up, tracked as a new Nice-to-have below.
3. ~~Delete or environment-guard `setTestSubscription()`~~ — **✅ done in migration 015's companion app-code change** (deleted).
4. Decide the fate of the 19 Group-D superseded tables (drop now while it's a zero-data decision, or formally archive) before adding any more schema — every month this waits makes the eventual cleanup migration larger and scarier.

**Medium**
5. Add a supporting index (or denormalized, indexed sort column) for the leaderboard's actual `coalesce()`-based sort expression, and add a short-TTL cache in front of `fetchPublicLeaderboard()` — do this before the leaderboard is a heavily-trafficked page, not necessarily before launch.
6. Establish a pruning/archiving strategy for `user_learning_state.state_json`'s unbounded internal arrays (`activityLog`, etc.) before highly-active accounts accumulate multi-year history — no schema change needed, just a client-side cap + periodic move into `progress_archives`.
7. Enable Supabase PITR on the production project before real user data accumulates.
8. Scope the `account_deletion_requests` client `UPDATE` policy (added in migration 013) to only allow transitioning `status` to `'cancelled'`, not `'processing'`/`'completed'`, before that migration is applied.

**Low**
9. Rename `user_lesson_progress.last_updated` → `updated_at` for consistency and to bring it under the generic trigger.
10. Collapse `leaderboard_opt_in`/`public_leaderboard` into a single column in a future migration.
11. Drop the legacy `trading_experience` column once confirmed unnecessary; resolve the `trading_goals` jsonb-vs-text[] migration-file ambiguity in a future squash.
12. Revert `enrollments` to a read-only view over `feature_enrollments` (as migration 006 originally had it) or drop it entirely, instead of leaving migration 007's independent duplicate table in place.
13. Add a retention/rollup plan for `xp_events`/`behavioral_events`/the per-feature session-log tables before they reach tens of millions of rows.

**Nice-to-have**
14. Add `supabase/seed.sql` for local development and CI.
15. Add a CI step that dry-runs new migrations against a throwaway database before merge.
16. Squash migrations `009`–`011` (fully superseded by `012`) into `012` itself the next time a clean baseline is cut.
17. Document the exact local Supabase dev setup in the README once onboarding a second contributor is relevant.
18. ~~Move XP awarding from "trust the client's computed `xpAwarded` number inside a plausible sync payload" to genuine server-side recomputation~~ — **✅ done, see "Gamification trust boundary closure" below.** `/api/progress/record-activity` now looks up the authoritative XP value from `lib/gamification/xp-catalog.ts` (a server-only catalog) keyed off the client-reported `eventType`/`entityId`, never from a client-submitted amount.
19. *(Added post-015)* `/api/progress/record-activity` currently receives the full `UserState` a second time on the last event of a sync batch (it's already sent once to Supabase directly via `saveLearningState`). Fine at current scale; if `user_learning_state` payload sizes become a concern (Part 3), consider having the route re-fetch `state_json` from `user_learning_state` server-side instead of accepting it in the request body.
20. *(Added post-record-activity)* Achievements (`user_badges`) and `competency_score` are still derived from the client-reported `state` snapshot (via `syncProfileSummary`), not recomputed from a trusted server-side event ledger. See "What deliberately did *not* change" under the new section below for why, and what it would take to close.
21. *(Added post-record-activity)* Several repeatable event types (`chart-drill-complete`, `chart-lab-complete`, `practice-complete`, `trend-exercise-complete`, `trend-challenge-complete`, `strategy-practice-complete`, `strategy-challenge-complete`, `simulator-session-complete`) now use a flat, server-decided, once-per-day-per-entity reward instead of the old score-proportional client math. This is a deliberate simplification (see below) — restoring proportionality safely would mean trusting a server-validated score/grading per drill type, which content doesn't currently support server-side.

---

## Migration 015 — fix summary

**Migration:** [`supabase/migrations/015_harden_subscription_and_gamification_rls.sql`](../supabase/migrations/015_harden_subscription_and_gamification_rls.sql)
**Status:** written, **not yet applied**. Push order is `013` → `014` → `015` via `supabase db push`. Review this one manually before pushing — it changes entitlement-critical privileges, and the app-code half (below) must ship in the same deploy or writes will start failing.

### What the migration does

Default-denies writes on the four affected tables/columns for the `authenticated` role — both by dropping the now-obsolete broad RLS policies *and* revoking the underlying `INSERT`/`UPDATE`/`DELETE` privilege (belt-and-braces: the block holds even if a policy is ever re-added carelessly later). `service_role` is untouched by any of this — it doesn't go through `authenticated`'s grants at all.

| Table | Before | After |
|---|---|---|
| `user_subscriptions` | owner could `INSERT`/`UPDATE` any column, including `plan`/`status`/`current_period_end` | `SELECT`-only. Every write (webhook-driven state changes, `provider_customer_id`) now goes through the service-role admin client. |
| `user_stats` | owner could `INSERT`/`UPDATE` any column | `SELECT`-only. All writes now via `/api/progress/sync-gamification` (service-role). |
| `xp_events` | owner could `INSERT` arbitrary rows/amounts | `SELECT`-only. Same server route writes it now. |
| `user_achievements` | owner could `INSERT` (unused by the app today) | `SELECT`-only, pre-emptively, so it's correct the day it's wired up. |
| `profiles` | owner could `UPDATE` any column, including `xp`/`level`/`streak`/`rank_tier`/`competency_score`/etc. | Owner can still `UPDATE` their own row, but **only** these columns: `display_name`, `username`, `avatar_url`, `country`, `experience_level`, `trading_experience`, `trading_goals`, `preferred_market`, `study_intensity`, `learning_plan`, `weekly_target_days`, `public_leaderboard`, `leaderboard_opt_in`, `onboarding_step`, `onboarding_completed`, `onboarding_completed_at`, `updated_at`. Every gamification/score column, plus the two known-dead legacy columns (`plan`, `stripe_customer_id`), is now service-role-only. |

`user_progress`, `user_lesson_progress`, `user_learning_state`, `streaks`, `weekly_targets`, `user_badges`, `trader_competence`, `live_trading_phase`, `feature_enrollments`, `path_enrollments` and every other "normal learning progress" table are **unchanged** — still fully owner-writable, per the explicit scope of this pass. Forging a row in any of them doesn't bypass a paywall (the free/Pro gate is route-based) or move a leaderboard-sort column, so they don't carry the same risk.

### App-code changes required (and made)

The app's own sync flow used to write `xp_events`/`user_stats`/`profiles`-gamification-columns directly from the browser using the signed-in user's own Supabase client. After 015, that would simply start failing (Postgres would reject the write with a permission error before RLS even runs) — so the write path had to move server-side in the same change:

1. **New route: `app/api/progress/sync-gamification/route.ts`.** Authenticates the caller with `requireAuth()` (re-verifies the session server-side, never trusts a client-supplied user id), then uses the service-role admin client to run the *exact same* existing sync logic (`recordXpEvent`, `syncProfileSummary` — unchanged functions, just called with a different, trusted client) scoped to `authResult.user.id`.
2. **New client helper: `lib/data/gamification-sync-client.ts`** (`syncGamificationState`) — a thin `fetch()` wrapper the browser calls instead of writing to Supabase directly.
3. **`components/providers/user-state-provider.tsx`** — `syncToCloud()` now calls `saveLearningState` (unchanged, still direct-to-Supabase — `user_learning_state` isn't in scope) and `syncNewActivityLogEvents` (unchanged for the `user_progress` half), then `syncGamificationState(next, xpEvents)` instead of `syncProfileSummary(supabase, ...)` directly.
4. **`lib/data/activity-service.ts`** — `syncNewActivityLogEvents` no longer writes `xp_events` itself; it returns the computed `xpEvents` as plain data for the caller to forward to the new route. `recordActivityCompletion` (the function that bundled both writes together) was removed since nothing else called it.
5. **`app/api/checkout/route.ts`** — the one legitimate client-triggered write to `user_subscriptions` (`provider_customer_id`, set once when a Stripe customer is created) now uses `createAdminClient()` instead of the user's RLS-scoped session.
6. **`lib/data/subscription-service.ts`** — `setTestSubscription()` deleted (see Part 5/Part 10).
7. **Doc comments added** to `recordXpEvent`, `syncUserStats`, and `syncProfileSummary` (all in `lib/data/xp-service.ts` / `lib/supabase/sync.ts`) making it explicit these must only ever be called with the service-role admin client from now on — a guardrail for the next person who touches this code.

No feature behavior changed: lesson/quiz/drill completion, XP awards, streaks, leaderboard stats, and profile editing all work exactly as before from the user's perspective — only *which server-side code path* performs the underlying writes changed. `npx tsc --noEmit`, `npm run lint`, and `npm run build` were all run after these changes: TypeScript is clean, the build succeeds (including the new `/api/progress/sync-gamification` route appearing in the route manifest), and lint shows zero new errors (the 29 pre-existing errors/42 warnings it reports are all in files this change didn't touch — trader-readiness, trend-spotter, and `lib/user-state/*` `prefer-const`/React-compiler findings that predate this work).

### What deliberately did *not* change

- **`streaks`, `weekly_targets`, `user_badges`** stay owner-writable even though `syncProfileSummary` (now running server-side) also writes them. They weren't named in scope and are lower-stakes: `streaks` isn't read by the leaderboard view at all (it reads `user_stats.current_streak`/`profiles.streak` instead), and a forged badge is cosmetic. Flagged as a residual follow-up, not fixed here, to keep this migration's blast radius matched to what was asked.
- **`account_deletion_requests`**'s migration-013 `UPDATE` policy (not yet applied) is unrelated to this finding and was left as originally written; the earlier recommendation to scope it to `status = 'cancelled'` only remains open (Part 10, Medium #8).
- **No RPC/recomputation layer was added in *this* migration.** It closes the "bypass application logic entirely via a raw table write" vector only — a sufficiently motivated user could still, at this point in the timeline, submit a crafted-but-well-formed sync payload with an inflated `xpAwarded`. That residual gap (tracked as Nice-to-have #18) was closed in a follow-up pass — see "Gamification trust boundary closure" below, which replaces the client-trusted sync payload with server-side recomputation from `xp_events`.

### Verification / test checklist

**Database-level** (run in the Supabase SQL editor or via `psql`, once `015` is applied):

- [ ] As `service_role`: `update user_subscriptions set plan='annual', status='active' where user_id='<test-user>';` — **succeeds**.
- [ ] As `service_role`: `insert into xp_events (user_id, source, amount, date_key, week_key, month_key) values ('<test-user>','test',50,'2026-01-01','2026-W01','2026-01');` — **succeeds**.
- [ ] As `service_role`: `update user_stats set lifetime_xp = 500 where user_id='<test-user>';` — **succeeds**.
- [ ] As the `authenticated` role with a real user JWT: `select * from user_subscriptions where user_id = auth.uid();` — **succeeds** (still readable).
- [ ] Same session: `update user_subscriptions set plan='annual' where user_id = auth.uid();` — **fails** with a permission error.
- [ ] Same session: `insert into xp_events (...) values (auth.uid(), 'fake', 999999, ...);` — **fails**.
- [ ] Same session: `update user_stats set lifetime_xp = 999999 where user_id = auth.uid();` — **fails**.
- [ ] Same session: `update profiles set xp = 999999, level = 99 where id = auth.uid();` — **fails**.
- [ ] Same session: `update profiles set display_name = 'New Name' where id = auth.uid();` — **succeeds** (identity columns still writable).

**App-level** (manual QA against a staging/dev Supabase project with `015` applied):

- [ ] Sign up as a new user — `handle_new_user()` trigger still bootstraps `profiles`/`user_subscriptions`/`user_stats`/etc. correctly (trigger runs as `security definer`, unaffected by the grant changes).
- [ ] Complete a lesson — `user_progress` row appears (client-written, unaffected), an `xp_events` row appears (now server-written via the new route), and `profiles.xp`/`level` update correctly.
- [ ] Complete a quiz / drill / flashcard session / chart drill — same check across each surface that feeds `activityLog`.
- [ ] Check the leaderboard — `lifetime_xp`/streak/rank reflect the just-earned XP after a sync cycle.
- [ ] Start Stripe checkout — a Stripe customer is created and `provider_customer_id` is persisted (now via the admin client in `/api/checkout`).
- [ ] Complete a test-mode Stripe subscription — the webhook still activates Pro access (webhook path untouched, uses service-role already).
- [ ] Open the billing portal — still works (read-only against `user_subscriptions`, unaffected).
- [ ] Cancel a subscription in Stripe test mode — the webhook still downgrades access correctly.
- [ ] Edit profile settings (display name, username, avatar, country, trading goals, leaderboard opt-in) — still saves correctly (identity columns remain client-writable).
- [ ] Open browser dev tools, get a real session's `access_token`, and attempt the "as authenticated" queries above via `fetch()`/PostgREST directly (not through the app) — confirm they fail. This is the actual exploit the migration closes; worth confirming by hand once against a staging project.

---

## Gamification trust boundary closure (post-015)

Migration 015 closed *direct table writes* — a user could no longer `UPDATE user_stats`/`INSERT xp_events` etc. from their own browser session. But `/api/progress/sync-gamification` (the server route 015 introduced) still accepted a client-computed XP/state payload and trusted it: a crafted `fetch()` call with `xpEvents: [{ amount: 999999, ... }]` or a `state.progress.xp` of `999999` would have been written faithfully by the service-role client. This section closes that gap.

### What changed

- **New route: `app/api/progress/record-activity/route.ts`.** Accepts only learning-event *facts*: `{ event: { eventType, entityId, score?, attemptId?, completedAt? } }`. It never accepts (and structurally cannot accept, since the type doesn't have the field) an XP amount, rank tier, streak count, or achievement id.
- **New server-owned XP catalog: `lib/gamification/xp-catalog.ts`.** The single source of truth for how much every event type is worth. Only server code imports it (the route and `lib/gamification/record-activity.ts`) — the client bundle never sees these numbers.
- **New orchestration: `lib/gamification/record-activity.ts`.**
  - `recordActivityEvent` — validates the event type is known, validates the entity exists in the content registry where a lookup is available (`lesson-complete`, `book-concept-complete`, `quiz-complete`, `trend-lesson-complete`, `strategy-lesson-complete`, `readiness-pillar-complete`), checks whether it's already been rewarded (idempotency, see below), and — only if not already rewarded — inserts one `xp_events` row for the catalog amount. The client's reported `score` is used *only* to gate pass/fail and perfect-score bonuses for quizzes (via `CourseQuiz.passingScore`); it is never used as, or converted into, an XP amount directly.
  - `recomputeTrustedStats` — recomputes `lifetime_xp` (`sum(xp_events.amount)`), `level`, `rank_tier` (via the existing `getTierForXp`), and `current_streak` (from distinct `xp_events.date_key` values, mirroring the client's own streak algorithm) purely from the `xp_events` ledger, and overwrites `user_stats.lifetime_xp/highest_rank_tier/current_streak/longest_streak` and `profiles.xp/level/streak/rank_tier`. **This always runs** — on every call to the route, even one with no `event` — so those columns self-heal to the trusted value regardless of anything in a client-supplied `state`.
- **`/api/progress/sync-gamification` is retired.** It now returns `410 Gone` with `{ error: "Gone. Use /api/progress/record-activity." }` instead of processing anything.
- **Client pipeline updated to report facts, not amounts:**
  - `lib/data/activity-service.ts` (`syncNewActivityLogEvents`) now returns `ActivityFact[]` (`eventType`/`entityId`/`score`/`completedAt`) instead of `XpEventInput[]` (`amount`). It also no longer filters out zero-XP activity-log entries before syncing — since the server, not the client, now decides whether an event is worth anything, every fresh activity is reported and let the server decide.
  - `lib/data/gamification-sync-client.ts` (`syncGamificationState`) now POSTs each fact to `/api/progress/record-activity` in turn (plus one `state`-only call to refresh the soft-mirror fields — see below), instead of one call with a bundled `xpEvents[]`/`state` payload.
  - `components/providers/user-state-provider.tsx` — `syncToCloud()` unchanged in shape, just passes `facts` through instead of `xpEvents`.
  - `ActivityLogItem`/`LearningActivityInput` (`lib/user-state/types.ts`) gained an optional `score` field, threaded through from `saveQuizAttempt` (`lib/user-state/index.ts`) and `recordBookQuizAttempt` (`lib/user-state/book-lab.ts`) so the server can evaluate quiz pass/perfect from a real reported score rather than trusting a client-computed `xpAwarded`.

### The XP catalog and idempotency rules

| Event type | Reward | Idempotency | Registry-validated? |
|---|---|---|---|
| `lesson-complete` | 50 XP | once per `(user, entityId)` | ✅ `getLessonById` |
| `book-concept-complete` | 50 XP | once per `(user, entityId)` | ✅ `getLibraryConceptById` |
| `quiz-complete` | 100 XP on first pass **+** 150 XP the first time scored 100% (both can stack on the same attempt) | once per `(user, entityId)` per tier | ✅ `getQuizById`, pass threshold from `quiz.passingScore` |
| `trend-lesson-complete` | 50 XP | once per `(user, entityId)` | ✅ `ALL_TREND_LESSONS` |
| `strategy-lesson-complete` | 50 XP | once per `(user, entityId)` | ✅ `ALL_STRATEGIES` |
| `readiness-pillar-complete` | 50 XP | once per `(user, entityId)` | ✅ `READINESS_PILLARS` |
| `readiness-assessment-complete` | 200 XP | once per `(user, entityId)` | — |
| `interactive-question` | 10 XP | once per `(user, entityId)` | — |
| `chart-drill-complete` | 80 XP | once per `(user, entityId, day)` | — |
| `chart-lab-complete` | 60 XP | once per `(user, entityId, day)` | — |
| `practice-complete` | 80 XP | once per `(user, entityId, day)` | — |
| `trend-exercise-complete` / `trend-challenge-complete` | 80 XP | once per `(user, entityId, day)` | — |
| `strategy-practice-complete` / `strategy-challenge-complete` | 80 XP | once per `(user, entityId, day)` | — |
| `simulator-session-complete` | 300 XP | once per `(user, entityId, day)` | — |
| `journal-reflection` | 40 XP | once per `(user, day)` — entity-agnostic | — |
| `flashcard-session` | 30 XP | once per `(user, day)` — entity-agnostic | — |

Idempotency is enforced by checking `xp_events` for an existing row matching `(user_id, source, source_id[, date_key])` before inserting — `source` is the event type itself (e.g. `"lesson-complete"`, or `"quiz-complete:pass"` / `"quiz-complete:perfect"` for the two quiz sub-rewards), not the old `ActivitySource` category, so dedupe keys can't collide across unrelated event types. This is a real, database-backed dedupe check, which also happens to fix a latent bug: the client's in-memory `syncedActivityIdsRef` (`components/providers/user-state-provider.tsx`) resets on every page load, so before this change *every reload re-sent the user's entire activity log*, and the old route's blind `.insert()` would have quietly created duplicate `xp_events` rows for the same historical activity on every reload. The new idempotency check makes replaying old facts a safe no-op.

Rewards for the "daily-capped" event types are intentionally **flat**, not score-proportional (the old client math for chart drills/chart lab was `Math.round(score / 10)`). A flat, server-decided amount fully closes the "arbitrary XP amount" exploit; restoring proportionality safely would require the server to independently grade the drill (verify the reported score against real drill data), which isn't in scope here — see "What deliberately did *not* change" below.

`completedAt` is accepted in the request but is **informational only** — the server always uses its own clock (`getDateKey()`) for `date_key`/`week_key`/`month_key` and therefore for idempotency and streak calculations. If it trusted a client-supplied date, a user could backdate events to fabricate a streak.

### What deliberately did *not* change

- **Achievements (`user_badges`) and `competency_score` are not recomputed from a trusted server-side ledger in this pass.** They're still written by `syncProfileSummary` from the client-reported `state` snapshot (unchanged from before — still service-role-only, still not directly writable by the browser per migration 015, just not re-validated fact-by-fact). Badge rules (`evaluateBadges` in `lib/user-state/index.ts`) span dozens of conditions — drill-type counts, flashcard deck IDs, trend classification accuracy, weekly active-day tracking, etc. — none of which exist today as queryable, trusted server rows; only `xp_events` (amount/date) does. Recomputing badges/competency server-side for real would mean first building a trusted, richly-typed server-side event ledger (capturing per-event metadata like drill type, deck id, classification correctness) and then porting the entire rule engine to run against it — a genuinely large, separate feature project, not a hardening pass. Flagging this explicitly rather than claiming it's covered: a sufficiently motivated user could still report a crafted `state` snapshot that unlocks badges or inflates `competency_score` — those two fields are **not yet leaderboard-sort-safe** the way `lifetime_xp`/`rank_tier`/`streak` now are (the actual leaderboard sort keys, per `lib/leaderboard/index.ts`, are the XP columns — `competency_score` is displayed but not sorted on, and badges aren't surfaced on the public leaderboard at all, which is why this was scoped out rather than rushed).
- **Quiz answer integrity has an inherent ceiling.** `content/quizzes` (including correct answers) ships in the public client bundle today, since content is statically compiled into the app. Grading a submitted score server-side (rather than trusting `attempt.passed`) closes the "send `passed: true` directly" shortcut, but a user who wants to see the correct answers can already read them out of the bundle regardless of where grading happens. Full integrity here would require moving answer keys out of the client bundle entirely — out of scope for a gamification-trust-boundary pass.
- **`streaks`, `weekly_targets`, `user_badges` rows, lesson/quiz/drill/book completion *counts*, and the competence snapshot** continue to be written via `syncProfileSummary` from client-reported `state`, unchanged. These aren't leaderboard sort keys and weren't named in the hardening request.
- **Subscription logic is untouched.** No changes to Stripe, `user_subscriptions`, `/api/checkout`, or `/api/stripe/webhook`.

### Verification / test checklist

- [ ] POST `/api/progress/record-activity` with `{ event: { eventType: "lesson-complete", entityId: "<valid-lesson-id>" } }` and a body that also includes a spoofed `amount: 999999` alongside it — the extra field is ignored (the type has no such field; the route derives XP solely from the catalog). Response's `stats.lifetimeXp` reflects only the catalog amount (50), not 999999.
- [ ] Same, with a spoofed top-level `rankTier: 15` in the body — ignored; `stats.rankTier` reflects `getTierForXp(lifetimeXp)` only.
- [ ] POST the same `lesson-complete` event twice (simulating a page reload replaying the activity log) — the second call returns `event.awarded: false`, and `xp_events` has exactly one row for that `(user, "lesson-complete", entityId)`.
- [ ] Complete a real lesson through the UI — `xp_events` gets one row, `profiles.xp`/`user_stats.lifetime_xp` increase by exactly the catalog amount.
- [ ] Submit a quiz with `score` below `passingScore` — `event.awarded: false`, `xpAwarded: 0`, no `xp_events` row.
- [ ] Submit a quiz with a passing (non-100) score — one `xp_events` row (`quiz-complete:pass`, 100 XP); repeating the same quiz attempt again awards nothing more.
- [ ] Submit a quiz with `score: 100` — two `xp_events` rows (`quiz-complete:pass` + `quiz-complete:perfect`, 250 XP total); repeating awards nothing more.
- [ ] After a batch of activity, confirm `user_stats.lifetime_xp` and `profiles.xp` both equal `select sum(amount) from xp_events where user_id = '<test-user>'` exactly.
- [ ] Confirm the leaderboard (`fetchPublicLeaderboard`, `lib/leaderboard/index.ts`) reflects only `user_stats`/`profiles` trusted columns — unchanged by this pass, still true.
- [ ] POST to the retired `/api/progress/sync-gamification` — confirm it returns `410` and writes nothing.
