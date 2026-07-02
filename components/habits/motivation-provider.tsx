"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  AwardIcon,
  CheckCircle2Icon,
  FlameIcon,
  GiftIcon,
  SparklesIcon,
  TrophyIcon,
  XIcon,
  ZapIcon,
} from "lucide-react"

import type { MotivationEvent } from "@/lib/user-state/types"
import { cn } from "@/lib/utils"

interface ToastItem {
  id: string
  message: string
  subtext?: string
  icon: "flame" | "trophy" | "check" | "rank" | "achievement" | "challenge" | "xp"
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
    case "rank-up":
      return {
        id: crypto.randomUUID(),
        icon: "rank",
        message: `Rank up! ${event.insignia} ${event.title}`,
        subtext: `You've reached Trader Rank ${event.tier}.`,
      }
    case "achievement-unlocked":
      return {
        id: crypto.randomUUID(),
        icon: "achievement",
        message: `${event.icon} Achievement: ${event.name}`,
        subtext: `+${event.bonusXp} bonus XP earned.`,
      }
    case "challenge-complete":
      return {
        id: crypto.randomUUID(),
        icon: "challenge",
        message: `${event.period[0].toUpperCase()}${event.period.slice(1)} challenge complete!`,
        subtext: `+${event.rewardXp} XP reward claimed.`,
      }
    case "xp-awarded":
      return {
        id: crypto.randomUUID(),
        icon: "xp",
        message: `+${event.amount} XP`,
        subtext: event.reason,
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
                toast.icon === "check" && "bg-primary/10 text-primary",
                toast.icon === "rank" && "bg-fuchsia-500/10 text-fuchsia-400",
                toast.icon === "achievement" && "bg-amber-500/10 text-amber-400",
                toast.icon === "challenge" && "bg-emerald-500/10 text-emerald-400",
                toast.icon === "xp" && "bg-primary/10 text-primary"
              )}
            >
              {toast.icon === "flame" && <FlameIcon className="size-4" />}
              {toast.icon === "trophy" && <TrophyIcon className="size-4" />}
              {toast.icon === "check" && <CheckCircle2Icon className="size-4" />}
              {toast.icon === "rank" && <AwardIcon className="size-4" />}
              {toast.icon === "achievement" && <SparklesIcon className="size-4" />}
              {toast.icon === "challenge" && <GiftIcon className="size-4" />}
              {toast.icon === "xp" && <ZapIcon className="size-4" />}
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
