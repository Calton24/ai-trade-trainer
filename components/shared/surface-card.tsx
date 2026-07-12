import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type SurfaceVariant = "default" | "muted" | "primary" | "dashed"

interface SurfaceCardProps {
  children: ReactNode
  className?: string
  variant?: SurfaceVariant
  padding?: "none" | "sm" | "md" | "lg"
  as?: "div" | "section" | "article"
}

const variantStyles: Record<SurfaceVariant, string> = {
  default: "border-border/60 bg-card/50 ring-1 ring-white/[0.02]",
  muted: "border-border/40 bg-card/30",
  primary: "border-primary/30 bg-gradient-to-br from-primary/10 via-card/80 to-card/50",
  dashed: "border-dashed border-border/60 bg-card/30",
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
}

export function SurfaceCard({
  children,
  className,
  variant = "default",
  padding = "md",
  as: Tag = "div",
}: SurfaceCardProps) {
  return (
    <Tag
      className={cn(
        "rounded-xl border transition-colors duration-200",
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </Tag>
  )
}
