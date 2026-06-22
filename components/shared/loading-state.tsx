import { Loader2Icon } from "lucide-react"

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <Loader2Icon className="animate-spin text-primary" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
