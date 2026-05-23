import { WorkspaceCreateDialog } from "@/components/workspace/workspace-create-dialog";
import { WorkspaceList } from "@/components/workspace/workspace-list";
import { WorkspaceListSkeleton } from "@/components/skeletons";
import { getSession } from "@/lib/auth/client/get-session";
import { WorkspaceWithMembers } from "@/lib/types";
import { ArrowUpRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/prisma";
import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Workspaces | Invitely.gg",
};

const MAX_WORKSPACES = 5;

function PageHeader() {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
        Workspaces
      </h1>
      <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xl">
        Group your contacts by family, work, friends and send invitations at
        scale.
      </p>
    </div>
  );
}

async function WorkspaceSection() {
  const session = await getSession();
  if (!session) redirect("/login");

  const workspaces = await db.workSpace.findMany({
    where: { userId: session.user.id },
    include: { members: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "asc" },
  });

  const totalMembers = workspaces.reduce(
    (acc: number, w: WorkspaceWithMembers) => acc + w.members.length,
    0,
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-white/8 pb-4">
        <p className="font-sans text-sm text-muted-foreground">
          {workspaces.length === 0 ? (
            "Create your first workspace to start organising contacts."
          ) : (
            <>
              <span className="font-mono tabular-nums text-foreground">
                {workspaces.length}
              </span>
              <span className="text-muted-foreground/70">
                /{MAX_WORKSPACES}
              </span>{" "}
              workspaces
              <span className="mx-2 text-muted-foreground/40">·</span>
              <span className="font-mono tabular-nums text-foreground">
                {totalMembers}
              </span>{" "}
              {totalMembers === 1 ? "contact" : "contacts"} ready to invite
            </>
          )}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          {totalMembers > 0 && (
            <Link href="/events/new">
              <Button
                variant="outline"
                size="sm"
                className="font-sans text-sm gap-1.5 cursor-pointer h-8 border-white/8 hover:border-white/15 hover:bg-white/4"
              >
                <Send className="h-3.5 w-3.5" />
                Send invitations
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </Link>
          )}
          <WorkspaceCreateDialog currentCount={workspaces.length} />
        </div>
      </div>

      <WorkspaceList workspaces={workspaces} />
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <div className="flex flex-col gap-6 sm:gap-7">
      <PageHeader />
      <Suspense fallback={<WorkspaceListSkeleton />}>
        <WorkspaceSection />
      </Suspense>
    </div>
  );
}
