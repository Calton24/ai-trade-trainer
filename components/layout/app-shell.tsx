import { AppHeader } from "@/components/layout/app-header"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { StudyAmbient } from "@/components/layout/study-ambient"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-svh">
      <StudyAmbient />
      <SidebarNav />
      <AppHeader variant="app" />
      <main className="relative z-10 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:ml-64 lg:pb-8">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
