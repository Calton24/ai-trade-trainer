"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3Icon,
  BookOpenIcon,
  BrainIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  LineChartIcon,
  MapIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/paths", label: "Paths", icon: MapIcon },
  { href: "/learn", label: "Learn", icon: GraduationCapIcon },
  { href: "/training", label: "Training", icon: LineChartIcon },
  { href: "/quizzes", label: "Quizzes", icon: BrainIcon },
  { href: "/journal", label: "Journal", icon: BookOpenIcon },
  { href: "/progress", label: "Progress", icon: BarChart3Icon },
  { href: "/community", label: "Community", icon: UsersIcon },
  { href: "/pricing", label: "Pricing", icon: TrendingUpIcon },
]

export function SidebarNav() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border/60 bg-card/50 backdrop-blur-xl lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-border/60 px-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
            <TrendingUpIcon className="text-primary" />
          </div>
          <Link href="/" className="font-semibold tracking-tight">
            TradeTrainer <span className="text-primary">AI</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-border/60 p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Educational simulator only. Not financial advice.
          </p>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border/60 bg-card/95 backdrop-blur-xl lg:hidden">
        {navItems.slice(0, 5).map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
