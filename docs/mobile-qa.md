# Mobile QA — TradeTrainer Academy

Responsive QA checklist for private beta. **Lesson/mobile interaction improvements are a later priority** — this doc focuses on identifying layout issues, not full mobile lesson redesign.

## Test breakpoints

| Device | Width | How to test |
|--------|-------|-------------|
| iPhone SE / mini | 390px | Chrome DevTools → iPhone 12/13 mini |
| iPhone Pro Max | 430px | iPhone 14 Pro Max preset |
| iPad | 768px | iPad preset |
| Tablet landscape | 1024px | iPad Pro landscape |

Also test one real device if possible before handing to beta testers.

---

## Critical pages

### Landing (`/`)

- [ ] Hero CTA visible without horizontal scroll
- [ ] Header nav collapses or scrolls on mobile
- [ ] Pricing teaser readable
- [ ] Footer links tappable (min 44px touch targets)

### Pricing (`/pricing`)

- [ ] Plan cards stack vertically
- [ ] Checkout buttons full-width on mobile
- [ ] Feature comparison doesn't overflow

### Sign up / Sign in (`/sign-up`, `/sign-in`)

- [ ] Form fields full width
- [ ] OAuth buttons stack cleanly
- [ ] Keyboard doesn't obscure submit button

### Onboarding (`/onboarding`)

- [ ] Wizard steps fit viewport
- [ ] Progress indicator visible
- [ ] Back/next buttons reachable

### Dashboard (`/dashboard`)

- [ ] Stats cards stack
- [ ] Sidebar becomes mobile nav (if applicable)
- [ ] No content clipped under header

### First lesson (`/paths/trading-foundations/lessons/what-is-trading`)

- [ ] Content readable (font size, line length)
- [ ] **Known later priority:** interactive lesson elements on small screens
- [ ] Mark any horizontal scroll or tiny tap targets

### Quiz (`/quiz/...`)

- [ ] Question text wraps
- [ ] Answer options tappable
- [ ] Submit button visible

### Settings (`/settings/...`)

- [ ] Tabs/nav usable on mobile
- [ ] Billing card readable

### Billing (`/settings/billing`)

- [ ] Plan/status visible
- [ ] Manage / Upgrade buttons stack

### Chart Lab (`/chart-lab`)

- [ ] Preview/gate screen works (Pro users)
- [ ] **Known later priority:** full chart interaction on mobile

### Library (`/library`)

- [ ] Book grid becomes single column
- [ ] Cards don't overflow

---

## Issues log template

| Page | Breakpoint | Issue | Severity | Notes |
|------|------------|-------|----------|-------|
| e.g. /pricing | 390px | Cards too wide | Medium | horizontal scroll |

---

## Later priority (not blocking beta)

- Full lesson reading experience on mobile
- Chart Lab touch gestures / pinch-zoom
- Flashcard swipe gestures
- Simulator mobile layout

Deploy first, collect beta feedback, then prioritize mobile lesson work based on what testers actually use.
