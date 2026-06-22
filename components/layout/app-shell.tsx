import { Header } from "@/components/layout/header"
import { SidebarNav } from "@/components/layout/sidebar-nav"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-svh bg-background">
      <SidebarNav />
      <Header variant="app" />
      <main className="pb-20 lg:ml-64 lg:pb-8">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
