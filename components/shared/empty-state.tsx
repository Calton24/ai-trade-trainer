import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
  compact?: boolean
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border/60 bg-card/30 text-center",
        compact ? "px-5 py-10" : "px-6 py-16",
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted/50 ring-1 ring-white/[0.04]">
        <Icon className="size-5 text-muted-foreground" aria-hidden />
      </div>
      <div className="flex max-w-sm flex-col gap-2">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  )
}
