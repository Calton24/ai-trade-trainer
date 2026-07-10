# TradeTrainer Academy — Content Gap Analysis

> Instructional design audit against a production-quality commercial trading academy standard.  
> Severity: **Critical** · **High** · **Medium** · **Low**

---

## Executive Gap Summary

| Category | Critical | High | Medium | Low |
|---|---:|---:|---:|---:|
| Missing / empty content | 3 | 8 | 6 | 4 |
| Navigation / UX | 1 | 3 | 4 | 2 |
| Assessment & progression | 2 | 5 | 3 | 1 |
| Pedagogy & structure | 0 | 4 | 7 | 3 |

---

## Critical

### C1 — Two advertised learning paths are empty shells
- **Issue:** `risk-management` and `trading-psychology` paths show in `/paths` with `coming_soon` status and **zero modules/lessons**.
- **Impact:** Learners see incomplete product; roadmap promises unfulfilled.
- **Location:** `content/paths/preview-paths.ts`
- **Fix:** Either hide until ready or ship minimum viable modules (3–5 lessons each).

### C2 — Forex Basics path is preview-only placeholder
- **Issue:** 2 modules with single-block “coming soon” preview lessons, no real curriculum.
- **Impact:** Listed as a path but delivers almost no value; forex flashcards exist without matching lessons.
- **Location:** `content/paths/preview-paths.ts`, `content/flashcards/forex-basics.ts`
- **Fix:** Build 8–12 forex lessons or remove from path list until ready.

### C3 — Quiz coverage is extremely thin
- **Issue:** Only **4 path quizzes** with **14 total questions** across the entire platform. No milestone exams, no stage completion tests beyond node quizzes.
- **Impact:** Competency system (`lib/progression/competency.ts`) weights quiz performance heavily, but assessment surface area is tiny.
- **Location:** `content/quizzes/`, `content/registry.ts`
- **Fix:** Minimum 1 quiz per path module (15+ quizzes); stage milestone tests at stages 4, 8, 12.

---

## High

### H1 — No Supply & Demand / Liquidity curriculum
- **Issue:** Landing page roadmap mentions liquidity; no lessons, flashcards, or chart scenarios cover supply/demand zones or liquidity concepts.
- **Impact:** Major gap for intermediate traders; weak progression after S&R.
- **Fix:** New path module or Stage 5.5 with 4–6 lessons + chart lab tasks.

### H2 — Trend content duplicated without clear learner messaging
- **Issue:** Trend concepts appear in Trading Foundations (`trends-vs-ranges`), Trend Spotter (20 lessons), Chart Lab, and Learning Map nodes — with overlapping titles.
- **Impact:** Confusion about where to learn; perceived repetition without recap framing.
- **Fix:** Add “You’ve seen this before” recap blocks or consolidate entry points.

### H3 — Community is a waitlist placeholder
- **Issue:** `/community` shows “coming soon” with mock prompts only; no real social learning.
- **Impact:** Marketing promises community; feature is non-functional.
- **Location:** `components/community/community-content.tsx`, `lib/mock/community-posts.ts`

### H4 — `/live-progression` route alias missing
- **Issue:** `PRO_PATH_PREFIXES` includes `/live-progression` but actual page is `/progression/live-transition`. No `app/live-progression/` route exists.
- **Impact:** Potential 404 if linked externally; inconsistent naming.
- **Location:** `lib/subscription/access.ts`, sidebar uses correct href

### H5 — Strategy Wiki has no dedicated lesson pages
- **Issue:** Strategies use 9-step playbooks on overview pages; `app/strategy-wiki/[strategySlug]/lesson/[lessonSlug]/page.tsx` exists but strategies export **0 lessons** in data model.
- **Impact:** Deep strategy education is single-page; no progressive unlock within strategies.
- **Location:** `content/strategies/*.ts`

### H6 — Only 1 chart-drill embedded in paths
- **Issue:** Registry has 1 drill (`spot-the-trend`); Price Action and ICC paths reference interactive blocks but most practice lives outside paths.
- **Impact:** Paths feel reading-heavy; “every lesson ends with a chart” promise only partially true.
- **Location:** `content/registry.ts`, `content/drills/`

### H7 — Missing advanced / professional tier content
- **Issue:** No modules on multi-timeframe analysis, session timing, news trading, portfolio heat, prop firm prep, or live execution checklist.
- **Impact:** Platform tops out at “intermediate mastery”; no path to professional readiness beyond gates.
- **Fix:** Stage 13+ or “Professional Track” path.

### H8 — Trading Psychology path empty despite rich library book
- **Issue:** 30 “Trading in the Zone” concepts exist in library but dedicated psychology **path** is empty.
- **Impact:** Psychology content is siloed; learning map stage 11 underuses the book.

---

## Medium

### M1 — `/learn` page duplicates `/paths` without clear purpose
- **Issue:** Flat lesson list from paths only; no trend spotter or library lessons.
- **Impact:** Navigation redundancy; learners unsure which entry point to use.
- **Location:** `app/learn/page.tsx`

### M2 — `/training` hub under-documented in learning map
- **Issue:** Free authenticated route with drill selector; not represented as a Learning Map node.
- **Impact:** Hidden practice surface for free users.

### M3 — Book Lab legacy routes (`/book-lab/*`) redirect to library
- **Issue:** Dual route trees; `/book-lab` still exists alongside `/library`.
- **Impact:** SEO duplication, maintenance burden.
- **Location:** `app/book-lab/`, `content/library/index.ts` `findConceptHrefBySlug`

### M4 — Forex flashcards unlock without forex lessons
- **Issue:** `forex-basics` deck has no deck gate (`deck-gates.ts`) but no forex path content.
- **Impact:** Cards without contextual lessons.

### M5 — ICC path vs ICC strategy wiki overlap
- **Issue:** ICC taught in path (6 lessons), strategy wiki, chart lab, flashcards — no unified ICC mastery track.
- **Impact:** Scattered ICC learning experience.

### M6 — No recap / spaced review lessons
- **Issue:** No “Week 1 review” or inter-stage recap content.
- **Impact:** Weak retention design for commercial academy standard.

### M7 — Journal lacks structured curriculum
- **Issue:** Journal is a tool with one “first entry” node; no guided journal lessons (tags, mistake taxonomy, weekly review templates as lessons).
- **Impact:** Stage 11 completes quickly without building habit systems.

### M8 — Leaderboard uses seeded mock competitors
- **Issue:** `lib/leaderboard/seed.ts` provides fake entries for empty states.
- **Impact:** Acceptable for beta; misleading if presented as real users at scale.

### M9 — Price Action path missing final quiz
- **Issue:** Module 1 has quiz; modules 2–3 have no summative assessment.
- **Impact:** Incomplete path assessment pattern.

### M10 — Simulator not linked to Learning Map stages
- **Issue:** 5 simulator stages exist independently; no node unlocks simulator progression.
- **Impact:** Disconnected “demo trading” phase from guided journey.

---

## Low

### L1 — `/features`, `/about`, `/faq`, `/roadmap`, `/testimonials` in PUBLIC_PREFIXES but no pages
- **Issue:** Auth config allows public access; routes may 404.
- **Location:** `lib/auth/route-access.ts`

### L2 — Duplicate auth routes (`/sign-in` vs `/signin`)
- **Issue:** Both exist for compatibility.
- **Impact:** Minor SEO/canonical issue.

### L3 — Preview path duplicate ICC definition
- **Issue:** `preview-paths.ts` exports preview ICC; registry uses full `icc-strategy.ts`. Dead code confusion for contributors.
- **Location:** `content/paths/preview-paths.ts`

### L4 — No video or PDF assets
- **Issue:** 100% text + generated charts; no embedded video lessons.
- **Impact:** Acceptable for MVP; limits learning modality diversity.

### L5 — Chart scenarios reuse seeds
- **Issue:** Multiple demos filter annotations from same generated seed (ICC phases).
- **Impact:** Pedagogically fine; visually repetitive for power users.

### L6 — Achievement count (16) vs badge count (58) imbalance
- **Issue:** Two overlapping gamification systems.
- **Impact:** UX complexity, not content gap.

---

## Duplicate / Repeated Concepts

| Concept | Locations | Severity |
|---|---|---|
| Trend vs range | TF path, Trend Spotter (4+ lessons), Chart Lab demo, flashcards | Medium |
| Support/resistance | TF-adjacent PA path, Chart Lab, Strategy Wiki (3 strategies), flashcards | Medium |
| Break & retest | PA path, Strategy Wiki, Chart Lab, flashcards, Learning Map | Low (intentional spiral) |
| Risk/reward | TF path, Book Lab (9 concepts), flashcards, Chart Lab | Low |
| ICC phases | ICC path, Strategy Wiki, Chart Lab (4 demos), flashcards | Medium |

---

## Weak Progression Areas

1. **Beginner → Intermediate bridge:** Strong through Stage 8; weak between Stage 9 and professional content.
2. **Theory → practice handoff:** Reading lessons outnumber embedded drills 16:1 in paths.
3. **Assessment → remediation:** Quizzes link to concepts but no auto-assigned review decks on failure.
4. **Live trading transition:** Gates exist (`live-trading-phases.ts`) but educational content for “live prep” is thin.

---

## Features With No / Minimal Educational Content

| Feature | Educational substance |
|---|---|
| Community | None (waitlist) |
| Leaderboard | Gamification only |
| Profile / Settings | Account management |
| Pricing | Commercial |
| Progress page | Analytics dashboard |
| `/training` | Drill selector (points to chart lab) |

---

## Priority Fix Order (Recommended)

1. **C1, C2** — Hide or fill empty paths before public launch
2. **C3, H6** — Expand quizzes and path-embedded drills
3. **H1** — Supply/demand + liquidity module
4. **H3** — Ship community MVP or remove nav item
5. **H5, M5** — Unify strategy education into progressive lessons
6. **M6, M9** — Recap lessons + path milestone tests
7. **H7** — Advanced track for v1.0
