import { GrainBackdrop } from "@/components/landing/grain-backdrop";
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
      <GrainBackdrop />
      <SidebarProvider className="bg-transparent">
        <AppSidebar user={user} />

        <SidebarInset className="flex flex-col min-h-svh bg-transparent">
          <header className="md:hidden sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b border-white/8 bg-[#161616]/85 backdrop-blur-md px-4">
            <SidebarTrigger className="h-7 w-7 -ml-1 text-muted-foreground hover:text-foreground hover:bg-white/4" />
            <Separator orientation="vertical" className="h-4 bg-white/8" />
            <span className="font-sans text-sm font-semibold tracking-tight text-foreground">
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
