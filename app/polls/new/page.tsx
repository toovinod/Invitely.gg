import { NewPollForm } from "@/components/polls/new-poll-form";
import { getSession } from "@/lib/auth/client/get-session";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/prisma";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "New Poll | Invitely.gg" };

function PageHeader() {
  return (
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div className="flex flex-col gap-1.5 min-w-0">
        <h1 className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          New poll
        </h1>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
          Pick a few candidate dates and invitees. Guests vote, you lock the
          winner, and we send the real invitations automatically.
        </p>
      </div>
      <Link href="/polls" className="shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="font-sans text-sm h-8 gap-1.5 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to polls
        </Button>
      </Link>
    </div>
  );
}

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
    <div className="flex flex-col gap-6 sm:gap-7 max-w-2xl mx-auto">
      <PageHeader />

      {totalMembers === 0 ? (
        <div className="relative overflow-hidden border border-dashed border-white/8 bg-transparent flex flex-col items-center justify-center py-16 sm:py-20 px-6 gap-4 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 70% at 50% 0%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 70%)",
            }}
          />
          <div className="relative shrink-0 rounded-full border border-white/8 bg-white/4 w-12 h-12 flex items-center justify-center">
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="relative flex flex-col gap-1.5 max-w-sm">
            <h3 className="font-sans text-base font-medium text-foreground">
              No contacts yet
            </h3>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              Add at least one member to a workspace before creating a poll.
              That contact graph powers polls and events the same way.
            </p>
          </div>
          <Link href="/workspace" className="relative">
            <Button
              size="sm"
              className="font-sans text-sm gap-1.5 cursor-pointer h-9 mt-2"
            >
              Go to Workspaces
            </Button>
          </Link>
        </div>
      ) : (
        <NewPollForm workspaces={workspaces} />
      )}
    </div>
  );
}
