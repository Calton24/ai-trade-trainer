import { cn } from "@/lib/utils"

/**
 * Animated TradeTrainer mark — the trend line draws upward in a loop
 * to suggest progression.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("brand-mark text-primary", className)}
      aria-hidden
    >
      {/* Main progression line (left → right, upward) */}
      <polyline
        points="3 17 9 11 13 15 21 7"
        className="brand-mark-line"
        pathLength={1}
      />
      {/* Arrow head at the peak */}
      <polyline
        points="15 7 21 7 21 13"
        className="brand-mark-arrow"
        pathLength={1}
      />
    </svg>
  )
}
