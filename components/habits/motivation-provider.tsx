"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { CheckCircle2Icon, FlameIcon, TrophyIcon, XIcon } from "lucide-react"

import type { MotivationEvent } from "@/lib/user-state/types"
import { cn } from "@/lib/utils"

interface ToastItem {
  id: string
  message: string
  subtext?: string
  icon: "flame" | "trophy" | "check"
}

interface MotivationContextValue {
  pushEvents: (events: MotivationEvent[]) => void
}

const MotivationContext = createContext<MotivationContextValue | null>(null)

function eventToToast(event: MotivationEvent): ToastItem {
  switch (event.type) {
    case "streak-started":
      return {
        id: crypto.randomUUID(),
        icon: "flame",
        message: "Your learning streak has started.",
        subtext: `${event.streak} day streak — come back tomorrow to keep it alive.`,
      }
    case "streak-continued":
      return {
        id: crypto.randomUUID(),
        icon: "flame",
        message: `${event.streak}-day streak`,
        subtext: "Consistency compounds. Nice work today.",
      }
    case "weekly-target-hit":
      return {
        id: crypto.randomUUID(),
        icon: "check",
        message: "Weekly target hit.",
        subtext: `${event.weeksStreak} week${event.weeksStreak === 1 ? "" : "s"} of consistent learning.`,
      }
    case "weekly-target-prompt":
      return {
        id: crypto.randomUUID(),
        icon: "check",
        message: "Set a weekly learning target",
        subtext: "3 days per week is a strong default — visit Goal settings anytime.",
      }
    case "badge-unlocked":
      return {
        id: crypto.randomUUID(),
        icon: "trophy",
        message: `Badge unlocked: ${event.badgeName}`,
        subtext: "Earned from real practice — keep going.",
      }
  }
}

export function MotivationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const pushEvents = useCallback((events: MotivationEvent[]) => {
    if (events.length === 0) return
    setToasts((prev) => [
      ...events.map(eventToToast),
      ...prev,
    ].slice(0, 3))
  }, [])

  useEffect(() => {
    if (toasts.length === 0) return
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(0, -1))
    }, 5000)
    return () => clearTimeout(timer)
  }, [toasts])

  return (
    <MotivationContext.Provider value={{ pushEvents }}>
      {children}
      <div className="pointer-events-none fixed bottom-20 right-4 z-[100] flex flex-col gap-2 lg:bottom-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex max-w-sm items-start gap-3 rounded-xl border border-border/60 bg-card/95 p-4 shadow-lg backdrop-blur-xl"
          >
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                toast.icon === "flame" && "bg-primary/10 text-primary",
                toast.icon === "trophy" && "bg-amber-500/10 text-amber-400",
                toast.icon === "check" && "bg-primary/10 text-primary"
              )}
            >
              {toast.icon === "flame" && <FlameIcon className="size-4" />}
              {toast.icon === "trophy" && <TrophyIcon className="size-4" />}
              {toast.icon === "check" && <CheckCircle2Icon className="size-4" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
              {toast.subtext && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {toast.subtext}
                </p>
              )}
            </div>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground"
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
            >
              <XIcon className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </MotivationContext.Provider>
  )
}

export function useMotivation() {
  const ctx = useContext(MotivationContext)
  if (!ctx) {
    throw new Error("useMotivation must be used within MotivationProvider")
  }
  return ctx
}
