import { Loader2Icon } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  message?: string
  variant?: "spinner" | "skeleton"
  className?: string
}

export function LoadingState({
  message = "Loading...",
  variant = "spinner",
  className,
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-3", className)} aria-busy aria-label={message}>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="mt-4 h-32 w-full" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <Loader2Icon className="size-5 animate-spin text-primary" aria-hidden />
      <p className="text-sm">{message}</p>
    </div>
  )
}
