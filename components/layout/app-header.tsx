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
    <header className={cn("sticky top-0 z-50", variant === "app" && "lg:pl-64")}>
      {/*
        Performance: sticky + backdrop-blur-2xl forces the browser to
        re-sample and blur the scrolling content on every frame → scroll jank.
        A near-opaque solid background is visually identical in this dark theme
        and eliminates the per-frame compositing cost entirely.
      */}
      <div
        className={cn(
          "border-b border-white/10",
          "bg-zinc-950/92",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 ring-1 ring-white/5">
              <BrandMark className="size-5" />
            </div>
            <span className="font-semibold tracking-tight text-zinc-100">
              TradeTrainer <span className="text-primary">Academy</span>
            </span>
          </Link>

          {variant === "marketing" && (
            <nav className="hidden items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.04] p-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-3.5 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
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
      </div>
    </header>
  )
}
