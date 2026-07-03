"use client"

import Link from "next/link"
import { TrendingUpIcon } from "lucide-react"

import { AuthHeaderActions } from "@/components/layout/auth-header-actions"
import { isPrivateBetaEnabled } from "@/lib/config/private-beta"
import { cn } from "@/lib/utils"

interface HeaderProps {
  variant?: "marketing" | "app"
}

const marketingLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#journey", label: "Journey" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#plans", label: "Plans" },
]

export function Header({ variant = "marketing" }: HeaderProps) {
  // Keep in-page pricing anchor during private beta; hide only the /pricing route.
  const links = isPrivateBetaEnabled()
    ? marketingLinks.filter((link) => !link.href.startsWith("/pricing"))
    : marketingLinks

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
            <TrendingUpIcon className="text-primary" />
          </div>
          <span className="font-semibold tracking-tight">
            TradeTrainer <span className="text-primary">Academy</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <AuthHeaderActions />
        </div>
      </div>
    </header>
  )
}
