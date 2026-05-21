"use client";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/client/auth-client";
import type { User } from "@/lib/auth/server/auth";
import { Logo } from "@/components/landing/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Calendar,
  Users,
  FileText,
  LogOut,
  CalendarDays,
  BarChart3,
  Vote,
} from "lucide-react";

const navItems = [
  { href: "/workspace", label: "Workspaces", icon: Users },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/polls", label: "Polls", icon: Vote },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/templates", label: "Templates", icon: FileText },
];

export function AppSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    try {
      setIsSigningOut(true);
      await signOut();
      router.push("/login");
    } catch {
      toast.error("failed to sign out");
      setIsSigningOut(false);
    }
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="h-12 border-b border-border px-3 flex-row items-center gap-2 justify-between">
        <Link
          href="/workspace"
          className="flex items-center gap-2 min-w-0 overflow-hidden"
        >
          <Logo size={18} className="shrink-0" />
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground truncate group-data-[collapsible=icon]:hidden">
            Invitely.gg
          </span>
        </Link>
        <SidebarTrigger className="cursor-pointer h-6 w-6 shrink-0 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted/50" />
      </SidebarHeader>
      <SidebarContent className="px-2 py-2">
        <SidebarMenu className="gap-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={label}
                  className="h-8 rounded-none font-mono text-xs gap-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 data-[active=true]:bg-muted data-[active=true]:text-foreground"
                >
                  <Link href={href}>
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border px-2 py-3">
        <div className="px-2 mb-1 flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
          {user.name && (
            <p className="font-mono text-xs text-foreground truncate leading-tight">
              {user.name}
            </p>
          )}
          <p className="font-mono text-[11px] text-muted-foreground truncate leading-tight">
            {user.email}
          </p>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              disabled={isSigningOut}
              tooltip="Sign out"
              className="h-8 rounded-none font-mono text-xs gap-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-50 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
