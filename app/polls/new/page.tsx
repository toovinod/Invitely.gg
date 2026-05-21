import { NewPollForm } from "@/components/polls/new-poll-form";
import { getSession } from "@/lib/auth/client/get-session";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/prisma";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "New Poll | Invitely.gg" };

export default async function NewPollPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const workspaces = await db.workSpace.findMany({
    where: { userId: session.user.id },
    include: {
      members: {
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const totalMembers = workspaces.reduce(
    (acc: number, w: (typeof workspaces)[number]) => acc + w.members.length,
    0,
  );

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="font-mono text-xs gap-1.5 -ml-2 h-7 w-fit text-muted-foreground hover:text-foreground rounded-none"
      >
        <Link href="/polls">
          <ArrowLeft className="h-3 w-3" />
          All polls
        </Link>
      </Button>

      <div className="flex flex-col gap-1">
        <h1 className="font-mono text-base font-semibold text-foreground">
          New poll
        </h1>
        <p className="font-mono text-xs text-muted-foreground">
          Pick a few candidate dates and invitees from your workspaces — guests
          vote on what works, you lock in the winner, and we send the actual
          invites with personalised openings.
        </p>
      </div>

      <Separator className="bg-border" />

      {totalMembers === 0 ? (
        <div className="border border-dashed border-border px-5 py-10 flex flex-col items-center gap-4 text-center">
          <p className="font-mono text-sm text-foreground">No contacts yet</p>
          <p className="font-mono text-xs text-muted-foreground max-w-md">
            Add at least one member to a workspace before creating a poll. That
            contact graph powers polls and events the same way.
          </p>
          <Link href="/workspace">
            <Button
              size="sm"
              className="font-mono text-xs gap-2 rounded-none cursor-pointer"
            >
              <Plus className="h-3 w-3" />
              Open workspaces
            </Button>
          </Link>
        </div>
      ) : (
        <NewPollForm workspaces={workspaces} />
      )}
    </div>
  );
}
