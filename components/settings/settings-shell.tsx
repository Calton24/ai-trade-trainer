"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  AlertTriangleIcon,
  BellIcon,
  CreditCardIcon,
  DatabaseIcon,
  FileTextIcon,
  LogOutIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/settings/profile", label: "Profile", icon: UserIcon },
  { href: "/settings/account", label: "Account", icon: ShieldIcon },
  { href: "/settings/privacy", label: "Privacy", icon: ShieldIcon },
  { href: "/settings/notifications", label: "Notifications", icon: BellIcon },
  { href: "/settings/billing", label: "Billing", icon: CreditCardIcon },
  { href: "/settings/progress", label: "Progress & Data", icon: DatabaseIcon },
  { href: "/settings/legal", label: "Legal", icon: FileTextIcon },
  { href: "/settings/danger", label: "Danger Zone", icon: AlertTriangleIcon },
]

function SettingsLogoutButton() {
  const { signOutClient, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [pending, setPending] = useState(false)

  if (loading || !isAuthenticated) return null

  async function handleLogout() {
    setPending(true)
    await signOutClient()
    router.replace("/sign-in")
  }

  return (
    <div className="mt-6 border-t border-border/60 pt-4">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
        disabled={pending}
        onClick={() => void handleLogout()}
      >
        <LogOutIcon className="size-4" />
        {pending ? "Logging out…" : "Log out"}
      </Button>
    </div>
  )
}

export function SettingsShell({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <AppShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:gap-10">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your account and preferences.
            </p>
          </div>
          <nav className="flex flex-col gap-0.5">
            {NAV.map((item) => {
              const active = pathname === item.href
              const isDanger = item.href === "/settings/danger"
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    isDanger && !active && "text-destructive/80 hover:text-destructive"
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <SettingsLogoutButton />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </AppShell>
  )
}
