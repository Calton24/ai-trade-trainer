"use client"

import { memo } from "react"

import type { CategoryScore } from "@/lib/skills/types"
import { cn } from "@/lib/utils"

const VB = 200
const CX = VB / 2
const CY = VB / 2
const R = 72

function polar(angle: number, radius: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) }
}

export const SkillRadar = memo(function SkillRadar({
  categories,
  className,
}: {
  categories: CategoryScore[]
  className?: string
}) {
  const scored = categories.filter((c) => c.score > 0)
  if (scored.length < 3) return null

  const n = scored.length
  const step = 360 / n
  const gridLevels = [0.25, 0.5, 0.75, 1]

  const points = scored
    .map((c, i) => {
      const p = polar(i * step, R * (c.score / 100))
      return `${p.x},${p.y}`
    })
    .join(" ")

  return (
    <svg
      viewBox={`0 0 ${VB} ${VB}`}
      className={cn("mx-auto w-full max-w-[220px]", className)}
      role="img"
      aria-label="Skill radar chart"
    >
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={scored
            .map((_, i) => {
              const p = polar(i * step, R * level)
              return `${p.x},${p.y}`
            })
            .join(" ")}
          fill="none"
          stroke="var(--border)"
          strokeWidth={0.5}
          opacity={0.6}
        />
      ))}
      {scored.map((c, i) => {
        const outer = polar(i * step, R)
        return (
          <line
            key={c.id}
            x1={CX}
            y1={CY}
            x2={outer.x}
            y2={outer.y}
            stroke="var(--border)"
            strokeWidth={0.5}
            opacity={0.5}
          />
        )
      })}
      <polygon
        points={points}
        fill="var(--primary)"
        fillOpacity={0.2}
        stroke="var(--primary)"
        strokeWidth={1.2}
      />
      {scored.map((c, i) => {
        const label = polar(i * step, R + 18)
        return (
          <text
            key={`${c.id}-label`}
            x={label.x}
            y={label.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-[7px]"
          >
            {c.score}%
          </text>
        )
      })}
    </svg>
  )
})
