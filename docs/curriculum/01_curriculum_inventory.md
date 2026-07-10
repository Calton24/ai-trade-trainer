# TradeTrainer Academy Curriculum Inventory

> Source of truth generated from codebase audit (`content/`, `app/`, `lib/`).  
> Last audited: July 2026.

## Summary

| Asset type | Count | Notes |
|---|---:|---|
| **Learning paths (registered)** | 6 | 3 available, 1 preview, 2 coming soon |
| **Path lessons (all types)** | 28 | 26 substantive + 2 forex preview stubs |
| **Reading / interactive path lessons** | 20 | Excludes quizzes, drills, reflections |
| **Trend Spotter lessons** | 20 | Separate curriculum module |
| **Library concepts (articles)** | 97 | 2 books, 15 sections |
| **Standalone quizzes (path-linked)** | 4 | 14 total questions |
| **Flashcard decks** | 12 | 125 cards total |
| **Chart Lab scenarios** | 30 | 20 demos + 10 interactive tasks |
| **Strategy Wiki playbooks** | 12 | 9-step setup + chart examples + practice |
| **Trend Spotter exercises** | 16 | Plus 10-chart challenge mode |
| **Simulator stages** | 5 | 25 procedurally seeded scenarios |
| **Trader Readiness pillars** | 7 | Multi-question assessment per pillar |
| **Learning Map stages** | 12 | 33 progression nodes |
| **Badge definitions** | 58 | Earned via activity |
| **Achievement definitions** | 16 | Bonus XP milestones |

**Estimated guided learning time (single pass, all content):** ~22–28 hours  
(Path paths ~1.2h + Library ~10h + Trend Spotter ~3h + Strategies ~3h + Chart Lab ~2h + Simulator ~1h + Flashcards ~2h + assessments/journal)

---

## Learning Paths

| Path | Status | Modules | Lessons | Est. minutes | Premium |
|---|---|---:|---:|---:|---|
| Trading Foundations | available | 5 | 13 | 35 | Pro (1st lesson free) |
| Price Action Fundamentals | available | 3 | 7 | 15 | Pro |
| ICC Strategy Path | available | 2 | 6 | 18 | Pro |
| Forex Basics | preview | 2 | 2 | 2 | Pro (placeholder only) |
| Risk Management Mastery | coming_soon | 0 | 0 | 0 | Pro (locked) |
| Trading Psychology | coming_soon | 0 | 0 | 0 | Pro (locked) |

Registry: `content/registry.ts` · Path data: `content/paths/`

---

## Stage 1 — Market Basics

| Field | Value |
|---|---|
| **Goal** | Understand what trading is, what moves price, and why practice comes first |
| **Difficulty** | Beginner |
| **Est. duration** | ~25 min |
| **Unlock requirement** | None (entry stage) |
| **Premium?** | Pro path content; `/paths/trading-foundations/lessons/what-is-trading` is the **only free lesson** |

**Contains**
- Lesson: What is Trading? (`tf-m1-what-is-trading`)
- Lesson: What Moves Price? (`tf-m1-what-moves-price`)
- Quiz: Trading Basics Check (3 questions, 70% pass, +100 XP pass / +150 perfect)

**Flashcards:** Trading Basics deck (10 cards, always unlocked)

**Assessment:** Trading Basics Check quiz

**XP (Learning Map nodes):** 25 + 25 + 30 = 80 node XP; server catalog awards 50 XP per lesson complete, 100/150 for quiz

**Competencies earned:** Market vocabulary, buyer/seller dynamics

**Feature unlocks:** Trading Library starter access (`feature-book-lab-starter`)

**Completion requirements:** Complete both lessons + pass quiz (required nodes: `node-lesson-what-is-trading`, `node-lesson-what-moves-price`, `node-quiz-basics`)

---

## Stage 2 — Candlesticks

| Field | Value |
|---|---|
| **Goal** | Read open, high, low, close — the language of price |
| **Difficulty** | Beginner |
| **Est. duration** | ~20 min |
| **Unlock requirement** | Stage 1 complete |
| **Premium?** | Pro |

**Contains**
- Lesson: Candlestick Anatomy
- Lesson: Bullish vs Bearish Candles
- Quiz: Candlestick Basics (3 questions)

**Flashcards:** Candlesticks deck (10 cards, unlocks after Candlestick Anatomy)

**Chart Lab demos:** `demo-candlestick-anatomy`, `demo-bullish-bearish`

**XP:** 25 + 25 + 30 node XP

**Competencies:** Candle body, wicks, bullish vs bearish reading

**Completion requirements:** Both lessons + candlestick quiz

---

## Stage 3 — Market Structure

| Field | Value |
|---|---|
| **Goal** | Swing highs, swing lows, and building blocks of trend |
| **Difficulty** | Beginner |
| **Est. duration** | ~30 min |
| **Unlock requirement** | Stage 2 complete |
| **Premium?** | Pro |

**Contains**
- Lesson: Swing Highs and Swing Lows
- Lesson: Trends vs Ranges
- Chart drill (optional): Spot the Trend (`spot-the-trend` → Chart Lab `task-spot-trend`)

**Flashcards:** Market Structure deck (10 cards)

**Assessment:** Optional drill; no stage-gating quiz

**XP:** 30 + 30 + 35 (optional drill)

**Feature unlocks:** Chart Lab swing markup (`feature-chart-lab-swings`)

**Completion requirements:** Both required lessons (drill optional)

---

## Stage 4 — Trend Detection

| Field | Value |
|---|---|
| **Goal** | Spot uptrends, downtrends, ranges, and messy no-trade charts |
| **Difficulty** | Beginner-plus |
| **Est. duration** | ~35 min |
| **Unlock requirement** | Stage 3 complete |
| **Premium?** | Pro |

**Contains** (Trend Spotter curriculum, modules 1–2 partially)
- Trend lesson: What is a Trend?
- Trend lesson: Uptrend vs Downtrend
- Trend lesson: Trend vs Range

**Flashcards:** Trend Spotter deck (15 cards, unlocks after first trend lesson)

**Challenge preview:** 10-Chart Trend Challenge unlocks after Trend vs Range

**XP:** 30 + 30 + 30 per lesson (server: 50 XP each)

**Competencies:** Uptrend, downtrend, range, skip discipline

**Completion requirements:** All three trend lessons

---

## Stage 5 — Support & Resistance

| Field | Value |
|---|---|
| **Goal** | Mark levels where price repeatedly reacts |
| **Difficulty** | Beginner-plus |
| **Est. duration** | ~25 min |
| **Unlock requirement** | Stage 4 complete |
| **Premium?** | Pro |

**Contains**
- Chart Lab task: Identify Support (`task-identify-support`)
- Chart Lab task: Identify Resistance (`task-identify-resistance`)
- Price Action path lesson: Support and Resistance (parallel path content)

**Flashcards:** Support & Resistance deck (10 cards)

**Feature unlocks:** Strategy Wiki S&R strategies, Chart Lab levels hub

**XP:** 35 + 35 per chart task

**Completion requirements:** Both chart drills

---

## Stage 6 — Breakouts & Fakeouts

| Field | Value |
|---|---|
| **Goal** | When price breaks a level — and when the break fails |
| **Difficulty** | Intermediate |
| **Est. duration** | ~30 min |
| **Unlock requirement** | Stage 5 complete |
| **Premium?** | Pro |

**Contains**
- Chart Lab task: Mark a Breakout (`task-mark-breakout`)
- Trend lesson: Fake Reversals (`/trend-spotter/lessons/fake-reversals`)
- Price Action path: Breakouts, Fakeouts lessons

**Feature unlocks:** Break & Retest strategy wiki

**XP:** 40 + 40

**Completion requirements:** Breakout chart task + fake reversals lesson

---

## Stage 7 — Risk Management

| Field | Value |
|---|---|
| **Goal** | Risk per trade, stops, targets, account protection |
| **Difficulty** | Beginner |
| **Est. duration** | ~35 min |
| **Unlock requirement** | Stage 3 complete (parallel track) |
| **Premium?** | Pro |

**Contains**
- Lesson: What is Risk?
- Lesson: Risk/Reward Explained
- Interactive: Calculate Risk/Reward
- Book Lab concept: Risk/Reward Ratio (`/library/day-trading-for-a-living/risk-reward-ratio`)

**Flashcards:** Risk Management deck (10 cards)

**Feature unlocks:** Intermediate strategies (VWAP, ORB, flags)

**XP:** 25 + 30 + 35 + 25 (book concept)

**Completion requirements:** Risk lessons + book concept (interactive optional)

---

## Stage 8 — Break & Retest

| Field | Value |
|---|---|
| **Goal** | First repeatable setup — break, retest, continue |
| **Difficulty** | Intermediate |
| **Est. duration** | ~40 min |
| **Unlock requirement** | Stages 6 + 7 |
| **Premium?** | Pro |

**Contains**
- Strategy Wiki: Break & Retest (9-step playbook, 3 chart examples, 2 practice exercises)
- Strategy practice: `/strategy-wiki/break-retest/practice`
- Chart Lab: `task-break-retest`
- Price Action path: Break and Retest lesson

**Flashcards:** Break & Retest deck (10 cards)

**XP:** 45 + 50 (strategy + practice nodes)

**Completion requirements:** Strategy overview + practice session

---

## Stage 9 — ICC Foundations

| Field | Value |
|---|---|
| **Goal** | Indication, correction, continuation — structured trend trading |
| **Difficulty** | Intermediate |
| **Est. duration** | ~45 min |
| **Unlock requirement** | Stages 4 + 8 |
| **Premium?** | Pro |

**Contains**
- ICC path lessons: Indication, Correction, Continuation (interactive), Full Setup Practice
- ICC path quiz: ICC Framework Check (4 questions)
- Strategy Wiki: ICC playbook
- Chart Lab: ICC demos + `task-icc-bullish` / `task-icc-bearish`

**Flashcards:** ICC deck (10 cards)

**XP:** 35 + 50 (lesson + strategy nodes)

**Completion requirements:** Indication lesson + ICC strategy node

---

## Stage 10 — Strategy Practice

| Field | Value |
|---|---|
| **Goal** | Apply setups step by step with chart markup and challenges |
| **Difficulty** | Intermediate |
| **Est. duration** | ~50 min |
| **Premium?** | Pro |

**Contains**
- Strategy Wiki: Support Bounce, Resistance Rejection, Trend Pullback
- Strategy challenge: Support Bounce challenge mode
- Practice exercises across 12 strategies (1–2 each)

**Feature unlocks:** All beginner strategies, full practice mode

**Completion requirements:** Support Bounce strategy + basic challenge

---

## Stage 11 — Psychology & Journaling

| Field | Value |
|---|---|
| **Goal** | Discipline, reflection, learning from practice |
| **Difficulty** | Beginner-plus |
| **Est. duration** | ~25 min |
| **Unlock requirement** | Stage 7 |
| **Premium?** | Pro (journal is Pro-gated) |

**Contains**
- Journal: First reflection entry (`/journal`)
- Path reflection: Build Your Beginner Trading Rules
- Book Lab: Building Consistency (`/library/day-trading-for-a-living/building-consistency`)
- Library book: Trading in the Zone (30 psychology concepts)

**Flashcards:** Psychology deck (10 cards)

**Feature unlocks:** Full journaling

**XP:** 20 (journal) + 25 + 25

---

## Stage 12 — Intermediate Chart Mastery

| Field | Value |
|---|---|
| **Goal** | Combine trend, levels, and setups under time pressure |
| **Difficulty** | Advanced |
| **Est. duration** | ~60 min |
| **Premium?** | Pro |

**Contains**
- Trend Spotter: 10-Chart Challenge
- Flashcards: Mastery review session (market structure deck)
- Strategy challenge: Advanced Break & Retest challenge
- Remaining Trend Spotter modules 3–5 (quality, reversal, trade-or-skip)

**Feature unlocks:** Full exploration mode

**Completion requirements:** Trend challenge + mastery flashcards + advanced strategy challenge

---

## Supplementary Content (Outside Learning Map Stages)

### Trading Library — Day Trading for a Living Companion
- **67 concepts** across 9 sections (~8 estimated hours)
- Sections: Foundations, Tools, Stocks in Play, Risk, Planning, Core Strategies, Execution, Psychology, Journaling
- Each concept: explanation, quiz questions, reflection, optional chart demo/practice

### Trading Library — Trading in the Zone Companion
- **30 concepts** across 6 sections (~2 estimated hours)
- Focus: beliefs, discipline, consistency, professional thinking

### Strategy Wiki (12 strategies)
| Strategy | Difficulty | Practice exercises | Featured |
|---|---|---:|---|
| Break & Retest | beginner | 2 | ✓ |
| Support Bounce | beginner | 1 | ✓ |
| Resistance Rejection | beginner | 1 | ✓ |
| Trend Pullback | beginner | 1 | |
| Opening Range Breakout | intermediate | 1 | |
| VWAP Bounce | intermediate | 1 | |
| Bull Flag | intermediate | 1 | |
| Bear Flag | intermediate | 1 | |
| Reversal | intermediate | 1 | |
| ICC | intermediate | 2 | |
| Moving Average Trend | intermediate | 1 | |
| High of Day Breakout | intermediate | 1 | |

### Trading Simulator
| Stage | Focus | Scenarios (seeds) | Est. min |
|---|---|---:|---|
| Chart Reading | Classify trend | 5 | 5 |
| Support & Resistance | Mark levels | 5 | 8 |
| Trade Selection | Filter setups | 5 | 6 |
| Trade Planning | Entry/stop/target | 5 | 10 |
| Trade Management | Candle replay | 5 | 12 |

### Trader Readiness Assessment
7 pillars: Market Knowledge, Chart Reading, Trade Selection, Risk Management, Psychology, Journal Analysis, Strategy Mastery (+200 XP on full assessment)

---

## XP & Unlock Reference

**Server XP catalog** (`lib/gamification/xp-catalog.ts`):

| Activity | XP | Idempotency |
|---|---:|---|
| Lesson complete | 50 | once |
| Book concept complete | 50 | once |
| Chart drill / practice | 80 | daily |
| Chart Lab scenario | 60 | daily |
| Flashcard session | 30 | daily-global |
| Trend lesson | 50 | once |
| Trend challenge | 80 | daily |
| Strategy practice/challenge | 80 | daily |
| Journal reflection | 40 | daily-global |
| Simulator session | 300 | daily |
| Quiz pass | 100 | once |
| Quiz perfect | +150 | once |
| Readiness assessment | 200 | once |

**Free tier:** Dashboard, onboarding, settings, profile, training hub, learning map + **one lesson** (`what-is-trading`).

**Pro tier:** All paths, library, flashcards, chart lab, trend spotter, strategy wiki, simulator, journal, progress, leaderboard, trader readiness, progression.
