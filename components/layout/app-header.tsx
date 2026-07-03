"use client"

import Link from "next/link"
import { AuthHeaderActions } from "@/components/layout/auth-header-actions"
import { BrandMark } from "@/components/layout/brand-mark"
import { StreakIndicator } from "@/components/habits/streak-indicator"
import { cn } from "@/lib/utils"

interface AppHeaderProps {
  variant?: "marketing" | "app"
}

const navLinks = [
  { href: "/paths", label: "Paths" },
  { href: "/learn", label: "Learn" },
  { href: "/training", label: "Training" },
  { href: "/pricing", label: "Pricing" },
]

export function AppHeader({ variant = "marketing" }: AppHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl",
        variant === "app" && "lg:pl-64"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
            <BrandMark className="size-5" />
          </div>
          <span className="font-semibold tracking-tight">
            TradeTrainer <span className="text-primary">Academy</span>
          </span>
        </Link>

        {variant === "marketing" && (
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {variant === "app" && <StreakIndicator />}
          <AuthHeaderActions showDrillCta={variant === "app"} />
        </div>
      </div>
    </header>
  )
}
