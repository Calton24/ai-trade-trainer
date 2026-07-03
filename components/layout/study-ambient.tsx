"use client"

import { usePathname } from "next/navigation"

/**
 * Routes where learners spend long sessions — dim the global glow so text
 * and charts stay easier on the eyes.
 */
const STUDY_PREFIXES = [
  "/paths/",
  "/learn/",
  "/library/",
  "/flashcards/session",
  "/quiz/",
  "/chart-lab/",
  "/trend-spotter/",
  "/strategy-wiki/",
  "/simulator/",
] as const

function isStudyRoute(pathname: string): boolean {
  return STUDY_PREFIXES.some(
    (prefix) => pathname === prefix.slice(0, -1) || pathname.startsWith(prefix)
  )
}

export function StudyAmbient() {
  const pathname = usePathname()
  if (!isStudyRoute(pathname)) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] bg-background/75"
      aria-hidden
    >
      {/* Soft cool vignette — keeps depth without bright blue wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,oklch(0.2_0.03_250/0.35),transparent_55%),radial-gradient(ellipse_80%_60%_at_50%_100%,oklch(0.16_0.02_250/0.4),transparent_50%)]" />
    </div>
  )
}
