/**
 * App-wide soft glow — pure CSS radial-gradients, no `filter: blur()`.
 *
 * Performance rationale: the previous implementation used 11 large divs each
 * with a `blur-[100px–140px]` CSS filter. Every filter-blurred element
 * forces the browser to create its own compositor layer (GPU texture), upload
 * it, and re-paint it whenever anything on the page changes. 11 of these on
 * the fixed background = 11 compositor textures always in memory.
 *
 * CSS `radial-gradient()` achieves the same soft-glow look in a single paint
 * on one GPU-composited layer, with zero filter passes.
 */
export function AmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: [
          /* Top wash — wide sky-blue sweep */
          "radial-gradient(ellipse 140% 55% at 50% -8%, oklch(0.68 0.12 228 / 0.18) 0%, transparent 55%)",
          /* Top-right accent */
          "radial-gradient(ellipse 70% 55% at 108% 18%, oklch(0.63 0.1 248 / 0.13) 0%, transparent 50%)",
          /* Left-centre fill */
          "radial-gradient(ellipse 75% 55% at -8% 48%, oklch(0.67 0.11 232 / 0.12) 0%, transparent 52%)",
          /* Right-centre fill */
          "radial-gradient(ellipse 65% 50% at 108% 55%, oklch(0.66 0.12 230 / 0.11) 0%, transparent 50%)",
          /* Bottom wash */
          "radial-gradient(ellipse 130% 52% at 50% 108%, oklch(0.68 0.12 222 / 0.15) 0%, transparent 54%)",
          /* Mid-page ambient fill — very soft */
          "radial-gradient(ellipse 90% 70% at 50% 52%, oklch(0.63 0.09 248 / 0.07) 0%, transparent 60%)",
        ].join(", "),
      }}
      aria-hidden
    />
  )
}

/** @deprecated Use AmbientBackground — kept for existing imports. */
export const LandingAmbientBackground = AmbientBackground
