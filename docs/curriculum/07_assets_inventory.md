# Educational Assets Inventory

> Where content lives, how it's stored, and what media types exist.  
> Audit date: July 2026.

---

## Storage Architecture

| Layer | Location | Format |
|---|---|---|
| **Primary curriculum** | `content/` | TypeScript modules (structured data) |
| **UI components** | `components/` | React TSX |
| **Routes** | `app/` | Next.js App Router pages |
| **Gamification / access** | `lib/` | TypeScript |
| **User progress** | Supabase | Postgres + RLS |
| **Public static assets** | `public/` | **Empty** (no images/videos) |

**No external CMS.** All lesson body copy is inline in TypeScript `contentBlocks` arrays or concept builder calls.

---

## Lessons

### Path lessons (28 total)

| Path | File | Lessons | Block types |
|---|---|---:|---|
| Trading Foundations | `content/paths/trading-foundations.ts` | 13 | heading, paragraph, definition, example, callout, checklist, summary, safety-note, interactive |
| Price Action | `content/paths/price-action.ts` | 7 | Same + chart-interactive blocks |
| ICC Strategy | `content/paths/icc-strategy.ts` | 6 | Same |
| Forex Basics (preview) | `content/paths/preview-paths.ts` | 2 | callout stub only |

**Lesson types:** `reading`, `interactive`, `quiz`, `chart-drill`, `reflection`

### Trend Spotter lessons (20)

| Module | File | Lessons |
|---|---|---|
| Trend Basics | `content/trend-spotter/curriculum.ts` | 4 |
| Market Structure | same | 4 |
| Trend Quality | same | 4 |
| Reversal or Continuation | same | 4 |
| Trade or Skip | same | 4 |

Built via `content/trend-spotter/lesson-builder.ts` — each includes explanation, quiz question, chart demo/practice links.

### Strategy lessons (0 standalone)

Strategy education is embedded in `content/strategies/*.ts` as:
- `setupSteps` (9 steps × 12 strategies)
- `chartExamples` (3 per strategy)
- `practiceExercises` (1–2 per strategy)

Route `app/strategy-wiki/[strategySlug]/lesson/[lessonSlug]/page.tsx` exists but no lesson slugs are populated.

---

## Markdown

| Location | Usage |
|---|---|
| `docs/` | Deployment, beta, QA, **this curriculum audit** |
| `README.md` | Project overview |
| `AGENTS.md` | Agent rules |
| Lesson body copy | **Not markdown** — TS content blocks |

**No `.md` lesson files.** Content is code-first.

---

## JSON / Structured Data

| Asset | Location | Records |
|---|---|---|
| Learning stages | `content/learning-map/stages.ts` | 12 |
| Learning nodes | `content/learning-map/nodes.ts` | 33 |
| Feature unlock rules | `content/learning-map/unlock-rules.ts` | 13 |
| Flashcard deck defs | `content/flashcards/decks.ts` | 12 |
| Chart scenario meta | `content/chart-scenarios/index.ts` | 30 |
| Simulator stages | `content/simulator/stages.ts` | 5 |
| Simulator scenarios | `content/simulator/scenarios.ts` | 25 |
| Trend scenarios | `content/trend-spotter/scenarios.ts` | 16 |
| Readiness pillars | `content/trader-readiness/pillars.ts` | 7 |
| Readiness questions | `content/trader-readiness/*.ts` | ~80+ across pillars |
| Quizzes | `content/quizzes/*.ts` | 4 |
| Badge definitions | `lib/mock/badges.ts` | 58 |
| Achievements | `lib/progression/achievements.ts` | 16 |
| XP catalog | `lib/gamification/xp-catalog.ts` | 15 activity types |
| Level thresholds | `lib/progression/levels.ts` | 10 levels |
| Trader roadmap | `lib/progression/roadmap.ts` | 7 titles |

---

## Library / Book Lab Concepts (97)

### Day Trading for a Living (67 concepts)

| Section file | Concepts |
|---|---:|
| `content/book-lab/concepts/day-trading-foundations.ts` | 5 |
| `content/book-lab/concepts/tools-and-market-access.ts` | 6 |
| `content/book-lab/concepts/stocks-in-play.ts` | 8 |
| `content/book-lab/concepts/risk-money-management.ts` | 9 |
| `content/book-lab/concepts/trade-planning.ts` | 8 |
| `content/book-lab/concepts/core-strategies.ts` | 9 |
| `content/book-lab/concepts/execution.ts` | 7 |
| `content/book-lab/concepts/psychology-discipline.ts` | 8 |
| `content/book-lab/concepts/journaling-review.ts` | 7 |

Built via `content/book-lab/concept-builder.ts` — each concept includes explanation, quiz questions, reflection prompt, optional chart demo/practice IDs.

### Trading in the Zone (30 concepts)

| Section file | Concepts |
|---|---:|
| `content/library/trading-in-the-zone/concepts/foundations.ts` | 5 |
| `content/library/trading-in-the-zone/concepts/beliefs-mindset.ts` | 5 |
| `content/library/trading-in-the-zone/concepts/discipline.ts` | 5 |
| `content/library/trading-in-the-zone/concepts/consistency.ts` | 5 |
| `content/library/trading-in-the-zone/concepts/professional-thinking.ts` | 5 |
| `content/library/trading-in-the-zone/concepts/advanced-psychology.ts` | 5 |

---

## Flashcards (125)

| Deck file | Cards |
|---|---:|
| `content/flashcards/trading-basics.ts` | 10 |
| `content/flashcards/candlesticks.ts` | 10 |
| `content/flashcards/market-structure.ts` | 10 |
| `content/flashcards/support-resistance.ts` | 10 |
| `content/flashcards/break-retest.ts` | 10 |
| `content/flashcards/icc.ts` | 10 |
| `content/flashcards/risk-management.ts` | 10 |
| `content/flashcards/forex-basics.ts` | 10 |
| `content/flashcards/book-lab.ts` | 10 |
| `content/flashcards/psychology.ts` | 10 |
| `content/flashcards/trend-spotter.ts` | 15 |
| `content/flashcards/chart-cards.ts` | 10 |

Card types: `basic`, `multiple-choice`, `true-false` via `content/flashcards/card-builder.ts`

---

## Charts

### Procedurally generated (no static chart files)

| Generator | File | Usage |
|---|---|---|
| Scenario generator | `lib/charts/generate-scenario.ts` | Chart Lab, simulator, strategy practice |
| Trend scenario generator | `lib/charts/generate-trend-scenario.ts` | Trend Spotter exercises |
| RNG | `lib/charts/rng.ts` | Seeded reproducibility |

**Chart kinds:** uptrend, downtrend, ranging, support-bounce, resistance-rejection, breakout, fakeout, break-retest, icc-bullish, icc-bearish, risk-reward

**Rendered by:** `components/chart-lab/chart-canvas.tsx`, `components/training/training-chart.tsx`

### Chart annotations

Generated per scenario: swing markers, S&R lines, ICC zones, entry/stop/target zones. Not stored as SVG files.

---

## Images

| Type | Count | Notes |
|---|---:|---|
| PNG/JPG/WebP in `public/` | 0 | — |
| SVG illustrations | 0 | Landing uses inline SVG (learning path) |
| Emoji covers | 2 | Library book covers (📘 📗) |
| User avatars | Dynamic | Supabase storage bucket |

---

## Videos

| Type | Count |
|---|---:|
| Embedded video lessons | 0 |
| Video files in repo | 0 |

---

## PDFs

| Type | Count |
|---|---:|
| Downloadable PDFs | 0 |
| Workbook exports | 0 |

---

## Icons

| Source | Usage |
|---|---|
| Lucide React | Navigation, UI, feature icons |
| Emoji | Badges, book covers, readiness pillars |

---

## Illustrations & Animations

| Asset | Location | Type |
|---|---|---|
| Interactive learning path SVG | `components/landing/learning-path.tsx` | Inline SVG + CSS animations |
| Ambient background glow | `components/layout/ambient-background.tsx` | CSS blur |
| Logo TrendingUp animation | `app/globals.css` | CSS keyframes (`brand-mark-draw`, `brand-mark-glow`) |
| Landing reveal animations | `app/globals.css` | fade-up, float, draw, node-pop |

---

## Seed / Mock / Fixture Data

| File | Purpose | Educational? |
|---|---|---|
| `lib/mock/badges.ts` | Badge definitions | Config |
| `lib/mock/community-posts.ts` | Community preview prompts | Placeholder |
| `lib/mock/quiz-discussion.ts` | Quiz discussion threads | Supplementary |
| `lib/mock/drills.ts` | Legacy drill refs | Partial |
| `lib/leaderboard/seed.ts` | Fake leaderboard entries | UI filler |
| `lib/mock-data.ts` | Re-exports mock content | — |

---

## Supabase Migrations (Content-Related Schema)

| Migration | Tables |
|---|---|
| `004_gamification_leaderboard.sql` | XP, badges, leaderboard |
| `003_competence_system.sql` | Competence scores |
| `016_admin_grants_and_referrals.sql` | Beta access, referrals |

User-generated educational assets: journal entries, quiz attempts, flashcard progress, simulator sessions — stored per user in Supabase.

---

## Asset Gap Summary

| Asset type | Status |
|---|---|
| TypeScript curriculum | ✅ Comprehensive |
| Procedural charts | ✅ Strong |
| Static images/diagrams | ❌ Missing |
| Video lessons | ❌ Missing |
| PDF workbooks | ❌ Missing |
| Audio | ❌ Missing |
| External CMS | ❌ Not used |

**Recommendation for v1.0:** Add 10–15 custom SVG diagram assets for candle anatomy, market structure, and ICC phases to reduce reliance on generated charts alone.
