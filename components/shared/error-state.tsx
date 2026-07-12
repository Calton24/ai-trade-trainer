import type { LucideIcon } from "lucide-react"
import { AlertCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  description: string
  onRetry?: () => void
  retryLabel?: string
  icon?: LucideIcon
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Try again",
  icon: Icon = AlertCircleIcon,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-12 text-center",
        className
      )}
      role="alert"
    >
      <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
        <Icon className="size-5 text-destructive" aria-hidden />
      </div>
      <div className="flex max-w-md flex-col gap-2">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
