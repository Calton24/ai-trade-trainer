# TradeTrainer Academy

The Codecademy-style platform for learning trading step by step.

> **Educational simulator only.** No financial advice, trading signals, or profit guarantees.

## Product Promise

**"Learn trading by doing interactive chart drills."**

## Getting Started

```bash
cd trade-trainer-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## MVP Features

| Area | Route | Description |
|------|-------|-------------|
| Learning Path | `/learn` | 8 beginner modules with lessons, quizzes, XP |
| Lessons | `/learn/[lessonId]` | Interactive lesson pages with chart examples |
| Chart Drills | `/training` | 6 drill types with mock AI feedback |
| Dashboard | `/dashboard` | Level, XP, streak, badges, recommendations |
| Progress | `/progress` | XP, accuracy, mistakes, badge collection |
| Journal | `/journal` | Beginner reflections with confidence ratings |
| Community | `/community` | Preview feed + Discord waitlist |
| Pricing | `/pricing` | Weekly / 6-month / annual subscription tiers |

## Mock Data

All data lives in `lib/mock/`:

- `modules.ts` — 8 curriculum modules
- `lessons.ts` — lesson content, quizzes, XP rewards
- `drills.ts` — 6 chart drill types
- `badges.ts` — achievement badges
- `journal-entries.ts` — practice reflections
- `community-posts.ts` — community preview posts
- `user-progress.ts` — XP, level, streak state

## Wiring Up Services

See `.env.example` for required keys. Schema in `supabase/migrations/001_initial_schema.sql` includes:

`profiles`, `modules`, `lessons`, `lesson_progress`, `drill_sessions`, `ai_reviews`, `journal_entries`, `badges`, `user_badges`, `community_waitlist`

## Disclaimer

TradeTrainer Academy is an educational simulator. It does not provide financial advice, trading signals, or profit guarantees.
