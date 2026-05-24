import { NewEventForm } from "@/components/events/new/new-event-form";
import { NewEventFormSkeleton } from "@/components/skeletons";
import { getSession } from "@/lib/auth/client/get-session";
import { WorkspaceWithMembers } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db/prisma";
import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "New Event | Invitely.gg",
};

function PageHeader() {
  return (
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div className="flex flex-col gap-1.5 min-w-0">
        <h1 className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          New event
        </h1>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
          Create an event and send invitations to your contacts.
        </p>
      </div>
      <Link href="/events" className="shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="font-sans text-sm h-8 gap-1.5 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to events
        </Button>
      </Link>
    </div>
  );
}

async function NewEventSection() {
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

  if (totalMembers === 0) {
    return (
      <div className="relative overflow-hidden border border-dashed border-white/8 bg-transparent flex flex-col items-center gap-4 px-6 py-12 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 70% at 50% 0%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div className="relative flex flex-col gap-1.5 max-w-sm">
          <h3 className="font-sans text-base font-medium text-foreground">
            No contacts yet
          </h3>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            Add members to a workspace before creating an event.
          </p>
        </div>
        <Link href="/workspace" className="relative">
          <Button
            size="sm"
            className="font-sans text-sm gap-1.5 h-9 cursor-pointer mt-1"
          >
            Go to Workspaces
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <NewEventForm
      workspaces={workspaces}
      organizerName={session.user.name ?? "Organizer"}
      organizerEmail={session.user.email}
    />
  );
}

export default function NewEventPage() {
  return (
    <div className="flex flex-col gap-6 sm:gap-7 max-w-3xl mx-auto">
      <PageHeader />
      <Suspense fallback={<NewEventFormSkeleton />}>
        <NewEventSection />
      </Suspense>
    </div>
  );
}
