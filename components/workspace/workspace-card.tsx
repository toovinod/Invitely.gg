import { WorkspaceDeleteDialog } from "@/components/workspace/workspace-delete-dialog";
import { MemberAddDialog } from "@/components/workspace/member-add-dialog";
import { MemberList } from "@/components/workspace/member-list";
import { Send, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Member {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
}

interface WorkspaceCardProps {
  workspace: {
    id: string;
    name: string;
    members: Member[];
    createdAt: Date;
  };
}

const MAX_MEMBERS = 25;

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const memberCount = workspace.members.length;
  const isAtLimit = memberCount >= MAX_MEMBERS;

  return (
    <div className="group relative flex flex-col overflow-hidden border border-white/8 bg-[#0a0a0a] transition-all duration-300 hover:border-white/15 hover:bg-[#0c0c0c]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/4 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-3.5">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-sans text-base font-semibold tracking-tight text-foreground truncate">
            {workspace.name}
          </h3>
          <span
            className={`font-mono text-xs tabular-nums ${
              isAtLimit ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {memberCount}/{MAX_MEMBERS} members
          </span>
        </div>

        <WorkspaceDeleteDialog
          workspaceId={workspace.id}
          workspaceName={workspace.name}
        />
      </div>

      <div className="relative border-t border-white/6 bg-black/40 px-4 sm:px-5 py-1 flex-1 min-h-16">
        <MemberList members={workspace.members} workspaceId={workspace.id} />
      </div>

      <div className="relative border-t border-white/6 bg-[#0a0a0a] px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        <MemberAddDialog
          workspaceId={workspace.id}
          workspaceName={workspace.name}
          currentMemberCount={memberCount}
        />
        {memberCount > 0 ? (
          <Link href="/events/new">
            <Button
              variant="ghost"
              size="sm"
              className="font-sans text-sm gap-1.5 h-8 text-muted-foreground hover:text-foreground hover:bg-white/4 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Send invitations</span>
              <span className="sm:hidden">Send</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </Link>
        ) : (
          <span className="font-sans text-xs text-muted-foreground italic">
            Add a member to start sending
          </span>
        )}
      </div>
    </div>
  );
}
