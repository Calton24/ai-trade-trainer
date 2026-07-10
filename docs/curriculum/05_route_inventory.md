# Route Inventory

> All user-facing routes as of codebase audit.  
> Auth: from `lib/auth/route-access.ts` · Pro: from `lib/subscription/access.ts`

**Legend:** ✅ Finished · 🟡 Partial · 🔴 Placeholder · 🔒 Pro required · 🆓 Free tier

---

## Marketing & Legal

| URL | Page | Purpose | Auth | Pro | Mock | Status |
|---|---|---|---|---|---|---|
| `/` | Landing | Marketing, roadmap SVG, conversion | No | No | No | ✅ |
| `/pricing` | Pricing | Plans (hidden in private beta) | No | No | No | ✅ |
| `/terms` | Terms of Service | Legal | No | No | No | ✅ |
| `/privacy` | Privacy Policy | Legal | No | No | No | ✅ |
| `/refund` | Refund Policy | Legal | No | No | No | ✅ |
| `/risk-disclaimer` | Risk Disclaimer | Legal | No | No | No | ✅ |
| `/features` | — | Public prefix, **no page** | No | No | — | 🔴 404 |
| `/about` | — | Public prefix, **no page** | No | No | — | 🔴 404 |
| `/faq` | — | Public prefix, **no page** | No | No | — | 🔴 404 |
| `/roadmap` | — | Public prefix, **no page** | No | No | — | 🔴 404 |
| `/testimonials` | — | Public prefix, **no page** | No | No | — | 🔴 404 |

---

## Authentication

| URL | Page | Purpose | Auth | Pro | Status |
|---|---|---|---|---|---|
| `/sign-in` | Sign In | Email auth | Public | No | ✅ |
| `/sign-up` | Sign Up | Registration | Public | No | ✅ |
| `/signin` | Sign In (alias) | Legacy URL | Public | No | ✅ |
| `/signup` | Sign Up (alias) | Legacy URL | Public | No | ✅ |
| `/forgot-password` | Forgot Password | Reset flow | Public | No | ✅ |
| `/reset-password` | Reset Password | Password update | Public | No | ✅ |
| `/auth/callback` | Auth Callback | Supabase session | Public | No | ✅ |
| `/auth/confirm` | Confirm (legacy) | Forwards to callback | Public | No | ✅ |

---

## Onboarding & Dashboard

| URL | Page | Purpose | Auth | Pro | Status |
|---|---|---|---|---|---|
| `/onboarding` | Onboarding Wizard | Profile + goals setup | Yes | 🆓 | ✅ |
| `/dashboard` | Dashboard | Home, continue learning | Yes | 🆓 | ✅ |
| `/profile` | Profile | User profile summary | Yes | 🆓 | ✅ |
| `/training` | Training Hub | Drill selector entry | Yes | 🆓 | ✅ |

---

## Learning Map & Paths

| URL | Page | Purpose | Auth | Pro | Stage | Status |
|---|---|---|---|---|---|---|
| `/learning-map` | Learning Map | Guided 12-stage journey | Yes | 🆓 | All | ✅ |
| `/paths` | Paths Index | 6 learning paths | Yes | 🔒 | — | ✅ |
| `/paths/[pathSlug]` | Path Detail | Module syllabus | Yes | 🔒 | — | ✅ |
| `/paths/[pathSlug]/lessons/[lessonSlug]` | Path Lesson | Reading/quiz/drill | Yes | 🔒* | Varies | ✅ |
| `/learn` | Learn Catalog | Flat path lesson list | Yes | 🔒 | — | 🟡 Redundant with paths |
| `/learn/[lessonId]` | Learn by ID | Legacy lesson route | Yes | 🔒 | — | 🟡 |

*Exception: `/paths/trading-foundations/lessons/what-is-trading` is **free**.

---

## Quizzes

| URL | Page | Purpose | Auth | Pro | Status |
|---|---|---|---|---|---|
| `/quizzes` | Quiz Index | Lists 4 path quizzes | Yes | 🔒 | ✅ |
| `/quiz/[quizId]` | Quiz Engine | Take quiz | Yes | 🔒 | ✅ |

---

## Trading Library (Book Lab)

| URL | Page | Purpose | Auth | Pro | Status |
|---|---|---|---|---|---|
| `/library` | Library Index | 2 books, 97 concepts | Yes | 🔒 | ✅ |
| `/library/[bookSlug]` | Book Detail | Section list | Yes | 🔒 | ✅ |
| `/library/[bookSlug]/[conceptSlug]` | Concept | Read + reflect | Yes | 🔒 | ✅ |
| `/library/[bookSlug]/[conceptSlug]/quiz` | Concept Quiz | Inline assessment | Yes | 🔒 | ✅ |
| `/library/[bookSlug]/[conceptSlug]/practice` | Concept Practice | Drill | Yes | 🔒 | ✅ |
| `/book-lab` | Book Lab (legacy) | Redirects to library | Yes | 🔒 | 🟡 Legacy |
| `/book-lab/[conceptSlug]/*` | Legacy concept routes | Canonical library URLs | Yes | 🔒 | 🟡 |

---

## Flashcards

| URL | Page | Purpose | Auth | Pro | Status |
|---|---|---|---|---|---|
| `/flashcards` | Deck Index | 12 decks | Yes | 🔒 | ✅ |
| `/flashcards/session` | Study Session | Spaced repetition | Yes | 🔒 | ✅ |

---

## Chart Lab

| URL | Page | Purpose | Auth | Pro | Status |
|---|---|---|---|---|---|
| `/chart-lab` | Chart Lab Index | 30 scenarios | Yes | 🔒 | ✅ |
| `/chart-lab/[scenarioId]` | Scenario | Demo or interactive task | Yes | 🔒 | ✅ |

---

## Trend Spotter

| URL | Page | Purpose | Auth | Pro | Status |
|---|---|---|---|---|---|
| `/trend-spotter` | Trend Spotter Hub | Modules + progress | Yes | 🔒 | ✅ |
| `/trend-spotter/lessons/[lessonSlug]` | Trend Lesson | 20 lessons | Yes | 🔒 | ✅ |
| `/trend-spotter/exercises/[exerciseId]` | Exercise | 16 scenarios | Yes | 🔒 | ✅ |
| `/trend-spotter/challenge` | 10-Chart Challenge | Timed assessment | Yes | 🔒 | ✅ |
| `/trend-spotter/results/[sessionId]` | Results | Session review | Yes | 🔒 | ✅ |

---

## Strategy Wiki

| URL | Page | Purpose | Auth | Pro | Status |
|---|---|---|---|---|---|
| `/strategy-wiki` | Strategy Index | 12 strategies | Yes | 🔒 | ✅ |
| `/strategy-wiki/[strategySlug]` | Strategy Playbook | 9-step setup | Yes | 🔒 | ✅ |
| `/strategy-wiki/[strategySlug]/practice` | Practice | Chart exercises | Yes | 🔒 | ✅ |
| `/strategy-wiki/[strategySlug]/challenge` | Challenge | Timed mode | Yes | 🔒 | ✅ |
| `/strategy-wiki/[strategySlug]/lesson/[lessonSlug]` | Strategy Lesson | **Route exists, 0 lessons in data** | Yes | 🔒 | 🔴 |
| `/strategy-wiki/[strategySlug]/results/[sessionId]` | Results | Session review | Yes | 🔒 | ✅ |

---

## Trading Simulator

| URL | Page | Purpose | Auth | Pro | Status |
|---|---|---|---|---|---|
| `/simulator` | Simulator Hub | 5 stages | Yes | 🔒 | ✅ |
| `/simulator/[stageId]` | Stage Session | Procedural scenarios | Yes | 🔒 | ✅ |
| `/simulator/performance` | Sim Performance | Stats dashboard | Yes | 🔒 | ✅ |

---

## Journal & Progress

| URL | Page | Purpose | Auth | Pro | Status |
|---|---|---|---|---|---|
| `/journal` | Trade Journal | Reflection entries | Yes | 🔒 | ✅ |
| `/progress` | Progress | Activity stats | Yes | 🔒 | ✅ |
| `/progression` | Progression | XP, ranks, roadmap | Yes | 🔒 | ✅ |
| `/progression/live-transition` | Live Progression | Phase gates | Yes | 🔒 | ✅ |
| `/live-progression` | — | Pro prefix alias, **no page** | Yes | 🔒 | 🔴 404 |
| `/performance` | — | Pro prefix alias, **no page** | Yes | 🔒 | 🔴 404 |

---

## Trader Readiness

| URL | Page | Purpose | Auth | Pro | Status |
|---|---|---|---|---|---|
| `/trader-readiness` | Readiness Hub | 7 pillars overview | Yes | 🔒 | ✅ |
| `/trader-readiness/assessment` | Assessment | Multi-pillar test | Yes | 🔒 | ✅ |
| `/trader-readiness/results/[sessionId]` | Results | Scores + recommendations | Yes | 🔒 | ✅ |

---

## Social & Competition

| URL | Page | Purpose | Auth | Pro | Mock | Status |
|---|---|---|---|---|---|---|
| `/leaderboard` | Leaderboard | XP rankings | Yes | 🔒 | Seed data | 🟡 |
| `/community` | Community | Waitlist + preview | Yes | 🆓?** | Yes | 🔴 Placeholder |

**Community auth not in FREE_AUTHENTICATED_PREFIXES — requires sign-in; Pro gate applies via default protected.

---

## Settings

| URL | Page | Purpose | Auth | Pro | Status |
|---|---|---|---|---|---|
| `/settings` | Settings Index | Redirect/hub | Yes | 🆓 | ✅ |
| `/settings/profile` | Profile | Avatar, name | Yes | 🆓 | ✅ |
| `/settings/account` | Account | Email, password | Yes | 🆓 | ✅ |
| `/settings/billing` | Billing | Plan status | Yes | 🆓 | ✅ |
| `/settings/notifications` | Notifications | Preferences | Yes | 🆓 | ✅ |
| `/settings/privacy` | Privacy | Data settings | Yes | 🆓 | ✅ |
| `/settings/goals` | Goals | Weekly targets | Yes | 🆓 | ✅ |
| `/settings/progress` | Progress Settings | Reset options | Yes | 🆓 | ✅ |
| `/settings/legal` | Legal | Policy links | Yes | 🆓 | ✅ |
| `/settings/danger` | Danger Zone | Delete account | Yes | 🆓 | ✅ |

---

## API Routes (Learner-Relevant)

| URL | Purpose | Auth |
|---|---|---|
| `/api/subscription/status` | Billing + entitlement | Yes |
| `/api/progress/record-activity` | XP events | Yes |
| `/api/progress/sync-gamification` | Gamification sync | Yes |
| `/api/checkout` | Stripe checkout | Yes |
| `/api/billing-portal` | Stripe portal | Yes |
| `/api/ai-review` | AI feedback on journal | Yes |
| `/api/referral/attribute` | Referral capture | Yes |
| `/api/stripe/webhook` | Stripe events | Webhook |
| `/api/stripe/status` | Stripe config health | Public |

---

## Route Health Summary

| Status | Count |
|---|---:|
| ✅ Production-ready | ~52 |
| 🟡 Partial / legacy / mock | ~8 |
| 🔴 Missing / placeholder | ~9 |

**Dead links to fix:** `/live-progression`, `/performance`, `/features`, `/about`, `/faq`, `/roadmap`, `/testimonials`, strategy lesson pages with no content.
