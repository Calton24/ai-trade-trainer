# Premium Content Inventory

> Everything locked behind Pro subscription (or admin grant / dev unlock).  
> Source: `lib/subscription/access.ts` · Free exception: one lesson.

---

## Access Model

| Tier | Access |
|---|---|
| **Anonymous** | Landing, legal, pricing, auth pages only |
| **Free (authenticated)** | Dashboard, onboarding, settings, profile, training, learning map, **one lesson** |
| **Pro** | All educational routes below |
| **Beta Pro** | Same as Pro via `admin_grants` table |
| **Dev unlock** | Local only (`ENABLE_DEV_PRO_UNLOCK` + `NEXT_PUBLIC_*`) |

**Free lesson (hardcoded):** `/paths/trading-foundations/lessons/what-is-trading`

---

## Pro-Gated Features

### 1. Learning Paths (6 paths)

| Name | Location | Unlock | Educational value | Dependencies |
|---|---|---|---|---|
| Trading Foundations | `/paths/trading-foundations` | Pro | Core beginner curriculum (13 lessons) | None |
| Price Action Fundamentals | `/paths/price-action` | Pro | S&R, breakouts, break-retest (7 lessons) | TF recommended |
| ICC Strategy Path | `/paths/icc-strategy` | Pro | ICC framework (6 lessons) | PA + trend |
| Forex Basics | `/paths/forex-basics` | Pro | Preview stubs only | TF |
| Risk Management Mastery | `/paths/risk-management` | Pro | **Empty — coming soon** | TF |
| Trading Psychology | `/paths/trading-psychology` | Pro | **Empty — coming soon** | TF |

---

### 2. Trading Library (97 concepts)

| Name | Location | Unlock | Educational value | Dependencies |
|---|---|---|---|---|
| Day Trading for a Living companion | `/library/day-trading-for-a-living` | Pro | 67 concepts, 9 sections, ~8h | Map stage 1 unlocks starter |
| Trading in the Zone companion | `/library/trading-in-the-zone` | Pro | 30 psychology concepts, ~2h | None (Pro gate) |

**Per-concept routes:** read, quiz, practice — all Pro.

---

### 3. Flashcards (125 cards, 12 decks)

| Deck | Location | Map unlock | Educational value |
|---|---|---|---|
| Trading Basics | `/flashcards/session?deck=trading-basics` | Always | Core vocabulary |
| Candlesticks | `/flashcards` | After candle anatomy | Candle reading |
| Market Structure | `/flashcards` | After swing highs lesson | HH/HL, trends |
| Support & Resistance | `/flashcards` | After support chart task | Levels, flips |
| Break & Retest | `/flashcards` | After breakouts node | Setup recall |
| ICC | `/flashcards` | After ICC indication | Phase recall |
| Risk Management | `/flashcards` | After risk/reward lesson | Stops, sizing |
| Forex Basics | `/flashcards` | None (always) | Pairs, pips — **no matching lessons** |
| Book Lab | `/flashcards` | After what-is-trading | Book concept recall |
| Psychology | `/flashcards` | None | Mindset cards |
| Trend Spotter | `/flashcards` | After first trend lesson | Trend/range recall |
| Chart Cards | `/flashcards` | After swing highs | Visual recognition |

Deck gates: `content/flashcards/deck-gates.ts`

---

### 4. Chart Lab (30 scenarios)

| Type | Count | Location | Unlock | Value |
|---|---:|---|---|---|
| Read-only demos | 20 | `/chart-lab/demo-*` | Pro (some preview via map) | Visual teaching |
| Interactive tasks | 10 | `/chart-lab/task-*` | Pro + map nodes | Hands-on markup |

**Concepts covered:** candlesticks, swings, trend, S&R, breakout, fakeout, break-retest, ICC (4 phases), risk-reward, VWAP, volume, flags, ORB, chasing

---

### 5. Trend Spotter

| Feature | Location | Map unlock | Value |
|---|---|---|---|
| 20 lessons (5 modules) | `/trend-spotter/lessons/*` | Stage 4 nodes | Trend literacy |
| 16 exercises | `/trend-spotter/exercises/*` | Progressive | Classification practice |
| 10-Chart Challenge | `/trend-spotter/challenge` | After trend vs range | Timed assessment |

---

### 6. Strategy Wiki (12 strategies)

| Strategy | Location | Map unlock | Value |
|---|---|---|---|
| Break & Retest | `/strategy-wiki/break-retest` | After fakeouts | Core setup |
| Support Bounce | `/strategy-wiki/support-bounce` | After S&R drills | Level bounce |
| Resistance Rejection | `/strategy-wiki/resistance-rejection` | After S&R | Short setup |
| Trend Pullback | `/strategy-wiki/trend-pullback` | Intermediate gate | Pullback entries |
| Opening Range Breakout | `/strategy-wiki/opening-range-breakout` | Risk lesson | Day trading |
| VWAP Bounce | `/strategy-wiki/vwap-bounce` | Risk lesson | Session average |
| Bull Flag | `/strategy-wiki/bull-flag` | Risk lesson | Continuation |
| Bear Flag | `/strategy-wiki/bear-flag` | Risk lesson | Continuation |
| Reversal | `/strategy-wiki/reversal` | Risk lesson | Counter-trend |
| ICC | `/strategy-wiki/icc` | ICC foundations | Structured entries |
| Moving Average Trend | `/strategy-wiki/moving-average-trend` | Risk lesson | Trend filter |
| High of Day Breakout | `/strategy-wiki/high-of-day-breakout` | Risk lesson | Momentum |

Each includes: 9-step playbook, 3 chart examples, 1–2 practice exercises, optional challenge mode.

Feature gates: `content/learning-map/unlock-rules.ts`

---

### 7. Trading Simulator

| Stage | Location | Unlock | Value |
|---|---|---|---|
| Chart Reading | `/simulator/chart-reading` | Pro | Trend classification |
| Support & Resistance | `/simulator/support-resistance` | Pro | Level marking |
| Trade Selection | `/simulator/trade-selection` | Pro | Setup filtering |
| Trade Planning | `/simulator/trade-planning` | Pro | Entry/stop/target |
| Trade Management | `/simulator/trade-management` | Pro | Candle replay |

25 procedural scenarios (5 per stage). **Not Learning Map gated** — open to all Pro users.

XP: 300 per session (daily cap).

---

### 8. Trade Journal

| Feature | Location | Unlock | Value |
|---|---|---|---|
| Full journaling | `/journal` | Pro + first journal node | Reflection, tags, confidence |
| AI review | `/api/ai-review` | Pro | Feedback on entries |

---

### 9. Trader Readiness Assessment

| Pillar | Location | Unlock | Value |
|---|---|---|---|
| Market Knowledge | `/trader-readiness/assessment` | Pro | Conceptual test |
| Chart Reading | Same | Pro | Interactive charts |
| Trade Selection | Same | Pro | Setup filtering |
| Risk Management | Same | Pro | Sizing scenarios |
| Psychology | Same | Pro | 20 MC questions |
| Journal Analysis | Same | Pro | Sample journal review |
| Strategy Mastery | Same | Pro | Requires strategy progress |

XP: 200 full assessment, 50 per pillar.

---

### 10. Progress & Gamification (Pro)

| Feature | Location | Value |
|---|---|---|
| Progress dashboard | `/progress` | Activity history |
| Progression / ranks | `/progression` | XP levels, roadmap titles |
| Live progression gates | `/progression/live-transition` | Education → sim → live prep |
| Leaderboard | `/leaderboard` | XP competition |

---

### 11. Quizzes Index

| Quiz | Path | Pro |
|---|---|---|
| Trading Basics Check | Trading Foundations | 🔒 |
| Candlestick Basics | Trading Foundations | 🔒 |
| Price Action Levels Check | Price Action | 🔒 |
| ICC Framework Check | ICC Strategy | 🔒 |

---

## Premium Content NOT Pro-Gated

These require sign-in but remain free:

- `/dashboard` — overview
- `/learning-map` — full map visible (nodes may show locked state)
- `/onboarding` — setup
- `/settings/*` — account management
- `/profile` — user profile
- `/training` — drill hub entry
- First lesson only

---

## Premium Value Summary

| Category | Pro items | Est. hours |
|---|---:|---:|
| Path lessons | 26 substantive | ~1.2 |
| Library concepts | 97 | ~10 |
| Trend Spotter | 20 lessons + 16 exercises | ~3 |
| Strategies | 12 playbooks + practice | ~3 |
| Chart Lab | 30 scenarios | ~2 |
| Flashcards | 125 cards | ~2 |
| Simulator | 5 stages | ~1 |
| Assessments | Readiness + quizzes | ~2 |
| **Total** | | **~22–28h** |

---

## Private Beta Considerations

When `NEXT_PUBLIC_PRIVATE_BETA=true`:

- `/pricing` shows beta notice; checkout API returns 403
- Testers receive Pro via `npm run grant:beta -- --email ...`
- All premium content above accessible via admin grant
- Stripe live keys configured but not used for beta cohort
