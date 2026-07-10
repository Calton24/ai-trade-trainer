"use client"

import type { SwingPoint } from "@/lib/course/widgets"
import { cn } from "@/lib/utils"

/** Chart viewbox constants (normalised 0–100 grid). */
export const CHART_W = 100
export const CHART_H = 60

/** Convert a swing point's price-space y (higher = higher price) to SVG y (top = 0). */
export function svgY(y: number): number {
  // Map 0–100 price into a padded 6–54 band, inverted for SVG.
  return CHART_H - 6 - (y / 100) * (CHART_H - 12)
}

export function svgX(x: number): number {
  return 4 + (x / 100) * (CHART_W - 8)
}

/**
 * Renders the zig-zag structure line through a set of swing points, plus the
 * point markers. Pure presentational SVG — no per-frame work, no filters.
 */
export function SwingChart({
  points,
  selectedIndex,
  labeledPoints,
  onSelectPoint,
  showFutureHint,
  className,
}: {
  points: SwingPoint[]
  /** Index the user is currently acting on (highlight). */
  selectedIndex?: number
  /** Map of point index → chosen label, for coloured feedback. */
  labeledPoints?: Record<number, { correct: boolean; label: string }>
  onSelectPoint?: (index: number) => void
  /** Draw a faint "?" zone to the right suggesting the next move is unknown. */
  showFutureHint?: boolean
  className?: string
}) {
  const linePoints = points
    .map((p) => `${svgX(p.x)},${svgY(p.y)}`)
    .join(" ")

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      className={cn("w-full", className)}
      role="img"
      aria-label="Market structure chart"
    >
      {/* baseline grid */}
      <line
        x1={0}
        y1={CHART_H - 4}
        x2={CHART_W}
        y2={CHART_H - 4}
        stroke="var(--border)"
        strokeWidth={0.3}
      />

      {showFutureHint && (
        <>
          <line
            x1={svgX(points[points.length - 1]?.x ?? 100)}
            y1={2}
            x2={svgX(points[points.length - 1]?.x ?? 100)}
            y2={CHART_H - 4}
            stroke="var(--muted-foreground)"
            strokeWidth={0.25}
            strokeDasharray="1.5 1.5"
          />
          <text
            x={Math.min(svgX(points[points.length - 1]?.x ?? 100) + 6, CHART_W - 4)}
            y={CHART_H / 2}
            fontSize={7}
            fill="var(--muted-foreground)"
            textAnchor="middle"
            opacity={0.5}
          >
            ?
          </text>
        </>
      )}

      {/* structure line */}
      <polyline
        points={linePoints}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={0.7}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.55}
      />

      {/* swing point markers */}
      {points.map((p, i) => {
        const cx = svgX(p.x)
        const cy = svgY(p.y)
        const fb = labeledPoints?.[i]
        const isSelected = selectedIndex === i
        const stroke = fb
          ? fb.correct
            ? "var(--primary)"
            : "var(--destructive)"
          : isSelected
            ? "var(--primary)"
            : "var(--muted-foreground)"
        return (
          <g
            key={i}
            onClick={onSelectPoint ? () => onSelectPoint(i) : undefined}
            style={{ cursor: onSelectPoint ? "pointer" : "default" }}
          >
            <circle
              cx={cx}
              cy={cy}
              r={isSelected ? 2.4 : 1.8}
              fill={fb ? (fb.correct ? "var(--primary)" : "var(--destructive)") : "var(--card)"}
              stroke={stroke}
              strokeWidth={0.6}
            />
            {/* index number */}
            <text
              x={cx}
              y={p.type === "high" ? cy - 3 : cy + 5}
              fontSize={4}
              fill="var(--muted-foreground)"
              textAnchor="middle"
            >
              {i + 1}
            </text>
            {fb && (
              <text
                x={cx}
                y={p.type === "high" ? cy - 7 : cy + 9}
                fontSize={4.5}
                fontWeight={600}
                fill={fb.correct ? "var(--primary)" : "var(--destructive)"}
                textAnchor="middle"
              >
                {fb.label}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
