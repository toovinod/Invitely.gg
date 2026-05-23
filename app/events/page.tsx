import { EventList } from "@/components/events/event-list";
import { getSession } from "@/lib/auth/client/get-session";
import { EventListSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { EventWithStatus } from "@/lib/types";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/prisma";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Events | Invitely.gg" };

function PageHeader() {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
        Events
      </h1>
      <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xl">
        Create events, send invitations, and track RSVPs all in one place.
      </p>
    </div>
  );
}

async function EventListSection() {
  const session = await getSession();
  if (!session) redirect("/login");

  const rawEvents = await db.event.findMany({
    where: { userId: session.user.id },
    orderBy: { eventAt: "desc" },
    include: { invitations: { select: { status: true } } },
  });

  const events = rawEvents.map((event: EventWithStatus) => {
    const summary = {
      total: event.invitations.length,
      attending: event.invitations.filter(
        (i: { status: string }) => i.status === "attending",
      ).length,
      maybe: event.invitations.filter(
        (i: { status: string }) => i.status === "maybe",
      ).length,
      declined: event.invitations.filter(
        (i: { status: string }) => i.status === "declined",
      ).length,
      pending: event.invitations.filter(
        (i: { status: string }) => i.status === "pending",
      ).length,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { invitations: _, ...rest } = event;
    return { ...rest, summary };
  });

  const now = new Date();
  const upcomingCount = events.filter((e) => new Date(e.eventAt) >= now).length;
  const pastCount = events.length - upcomingCount;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-white/8 pb-4">
        <p className="font-sans text-sm text-muted-foreground">
          {events.length === 0 ? (
            "Create your first event to start sending invitations."
          ) : (
            <>
              <span className="font-mono tabular-nums text-foreground">
                {upcomingCount}
              </span>{" "}
              upcoming
              <span className="mx-2 text-muted-foreground/40">·</span>
              <span className="font-mono tabular-nums text-foreground">
                {pastCount}
              </span>{" "}
              past
            </>
          )}
        </p>
        <Link href="/events/new">
          <Button
            size="sm"
            className="font-sans text-sm gap-1.5 cursor-pointer h-8"
          >
            <Plus className="h-3.5 w-3.5" />
            New event
          </Button>
        </Link>
      </div>
      <EventList events={events} />
    </div>
  );
}

export default function EventsPage() {
  return (
    <div className="flex flex-col gap-6 sm:gap-7">
      <PageHeader />
      <Suspense fallback={<EventListSkeleton />}>
        <EventListSection />
      </Suspense>
    </div>
  );
}
