/**
 * App-wide soft Gaussian glow — blue-forward with a light brand green accent.
 * Fixed to the viewport so it covers every route (landing, auth, app shell).
 */
export function AmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Top wash */}
      <div className="absolute -top-40 left-1/2 h-[36rem] w-[56rem] -translate-x-1/2 rounded-full bg-sky-500/20 blur-[140px]" />
      <div className="absolute top-0 right-[-10%] size-[28rem] rounded-full bg-blue-500/15 blur-[120px]" />

      {/* Upper third */}
      <div className="absolute top-[18%] -left-32 size-[32rem] rounded-full bg-sky-400/14 blur-[130px]" />
      <div className="absolute top-[22%] right-[8%] size-[22rem] rounded-full bg-primary/10 blur-[100px]" />

      {/* Mid page */}
      <div className="absolute top-[42%] left-[20%] size-[30rem] rounded-full bg-indigo-500/12 blur-[140px]" />
      <div className="absolute top-[48%] -right-40 size-[34rem] rounded-full bg-sky-500/14 blur-[130px]" />

      {/* Lower third */}
      <div className="absolute top-[68%] -left-24 size-[28rem] rounded-full bg-blue-400/12 blur-[120px]" />
      <div className="absolute top-[72%] right-[15%] size-[24rem] rounded-full bg-sky-300/10 blur-[110px]" />

      {/* Bottom wash */}
      <div className="absolute -bottom-32 left-1/2 h-[32rem] w-[50rem] -translate-x-1/2 rounded-full bg-sky-500/16 blur-[140px]" />
      <div className="absolute bottom-[5%] left-[30%] size-[20rem] rounded-full bg-primary/8 blur-[100px]" />

      {/* Soft vertical blue veil for continuity top → bottom */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,oklch(0.7_0.12_230/0.12),transparent_55%),radial-gradient(ellipse_70%_50%_at_50%_50%,oklch(0.65_0.1_250/0.08),transparent_60%),radial-gradient(ellipse_80%_50%_at_50%_100%,oklch(0.7_0.12_220/0.1),transparent_55%)]" />
    </div>
  )
}

/** @deprecated Use AmbientBackground — kept for existing imports. */
export const LandingAmbientBackground = AmbientBackground
