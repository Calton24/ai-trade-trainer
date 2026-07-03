"use client"

import Link from "next/link"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { AuthHeaderActions } from "@/components/layout/auth-header-actions"
import { BrandMark } from "@/components/layout/brand-mark"
import { cn } from "@/lib/utils"

interface HeaderProps {
  variant?: "marketing" | "app"
}

/** Product-focused marketing nav — outcome language, not SaaS “Features”. */
const marketingLinks = [
  { href: "/#curriculum", id: "curriculum", label: "Curriculum" },
  { href: "/#practice", id: "practice", label: "Practice" },
  { href: "/#roadmap", id: "roadmap", label: "Roadmap" },
  { href: "/#pricing", id: "pricing", label: "Pricing" },
] as const

type SectionId = (typeof marketingLinks)[number]["id"]

function sectionFromHash(hash: string): SectionId | null {
  const id = hash.replace(/^#/, "")
  return marketingLinks.some((l) => l.id === id) ? (id as SectionId) : null
}

export function Header({ variant = "marketing" }: HeaderProps) {
  const [activeId, setActiveId] = useState<SectionId>("curriculum")
  const navRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<Map<SectionId, HTMLAnchorElement>>(new Map())
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false })

  const updateIndicator = useCallback((id: SectionId) => {
    const nav = navRef.current
    const item = itemRefs.current.get(id)
    if (!nav || !item) return

    const navRect = nav.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()
    setIndicator({
      left: itemRect.left - navRect.left,
      width: itemRect.width,
      ready: true,
    })
  }, [])

  useLayoutEffect(() => {
    if (variant !== "marketing") return
    updateIndicator(activeId)
  }, [activeId, updateIndicator, variant])

  useEffect(() => {
    if (variant !== "marketing") return

    const onResize = () => updateIndicator(activeId)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [activeId, updateIndicator, variant])

  // Sync active tab from hash + scroll position
  useEffect(() => {
    if (variant !== "marketing") return

    const fromHash = sectionFromHash(window.location.hash)
    if (fromHash) setActiveId(fromHash)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const top = visible[0]
        if (!top?.target.id) return
        const id = top.target.id as SectionId
        if (marketingLinks.some((l) => l.id === id)) {
          setActiveId(id)
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] }
    )

    for (const link of marketingLinks) {
      const el = document.getElementById(link.id)
      if (el) observer.observe(el)
    }

    const onHashChange = () => {
      const id = sectionFromHash(window.location.hash)
      if (id) setActiveId(id)
    }
    window.addEventListener("hashchange", onHashChange)

    return () => {
      observer.disconnect()
      window.removeEventListener("hashchange", onHashChange)
    }
  }, [variant])

  return (
    <header
      className={cn("sticky top-0 z-50", variant === "app" && "lg:pl-64")}
    >
      <div
        className={cn(
          "border-b border-white/10",
          "bg-zinc-900/45 backdrop-blur-2xl backdrop-saturate-150",
          "supports-[backdrop-filter]:bg-zinc-950/35",
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
            <nav
              ref={navRef}
              className="relative hidden items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.04] p-1 md:flex"
              aria-label="Page sections"
            >
              {/* Sliding glass pill */}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute top-1 bottom-1 rounded-full",
                  "border border-white/15 bg-white/12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]",
                  "transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  !indicator.ready && "opacity-0"
                )}
                style={{
                  width: indicator.width,
                  transform: `translateX(${indicator.left}px)`,
                }}
              />

              {marketingLinks.map((link) => {
                const active = activeId === link.id
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    ref={(node) => {
                      if (node) itemRefs.current.set(link.id, node)
                      else itemRefs.current.delete(link.id)
                    }}
                    onClick={() => setActiveId(link.id)}
                    className={cn(
                      "relative z-10 rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200",
                      active
                        ? "text-zinc-50"
                        : "text-zinc-400 hover:text-zinc-200"
                    )}
                    aria-current={active ? "true" : undefined}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <AuthHeaderActions marketingCta />
          </div>
        </div>
      </div>
    </header>
  )
}
