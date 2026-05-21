import { AppSidebar } from "@/components/layout/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/lib/auth/server/auth";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
}

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar user={user} />

        <SidebarInset className="flex flex-col min-h-svh">
          <header className="md:hidden sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
            <SidebarTrigger className="h-7 w-7 rounded-none -ml-1 text-muted-foreground hover:text-foreground" />
            <Separator orientation="vertical" className="h-4" />
            <span className="font-mono text-sm font-semibold text-foreground">
              Invitely.gg
            </span>
          </header>
          <main className="flex-1 w-full px-4 sm:px-6 py-6 sm:py-8 max-w-5xl mx-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
