import { SendInvitationsForm } from "@/components/events/send-invitations-form";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth/client/get-session";
import { redirect, notFound } from "next/navigation";
import { WorkspaceWithMembers } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { EventIdParams } from "@/lib/utils";
import { db } from "@/lib/db/prisma";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Send Invitations | Invitely.gg" };

export default async function SendInvitationsPage({ params }: EventIdParams) {
  const { eventId } = await params;
  const [session, event] = await Promise.all([
    getSession(),
    db.event.findUnique({ where: { id: eventId } }),
  ]);

  if (!session) redirect("/login");
  if (!event) notFound();
  if (event.userId !== session.user.id) notFound();
  if (event.status === "cancelled") redirect(`/events/${eventId}`);
  if (event.sentAt) redirect(`/events/${eventId}`);

  const workspaces = await db.workSpace.findMany({
    where: { userId: session.user.id },
    include: { members: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "asc" },
  });

  const totalMembers = workspaces.reduce(
    (acc: number, w: WorkspaceWithMembers) => acc + w.members.length,
    0,
  );

  const formattedDate = new Date(event.eventAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-6 sm:gap-7 max-w-3xl mx-auto">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-1.5 min-w-0">
          <h1 className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Send invitations
          </h1>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            Select guests for this occurrence of{" "}
            <span className="text-foreground font-medium">{event.name}</span>
          </p>
        </div>
        <Link href={`/events/${eventId}`} className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="font-sans text-sm h-8 gap-1.5 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to event
          </Button>
        </Link>
      </div>

      <div className="border border-white/8 bg-[#0a0a0a] px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {formattedDate}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
          <span className="font-sans text-sm text-muted-foreground">
            {event.location}
          </span>
        </div>
      </div>

      {totalMembers === 0 ? (
        <div className="relative overflow-hidden border border-dashed border-white/8 bg-[#070707] px-6 py-12 flex flex-col items-center gap-4 text-center">
          <div className="flex flex-col gap-1.5 max-w-sm">
            <h3 className="font-sans text-base font-medium text-foreground">
              No contacts yet
            </h3>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              Add members to a workspace before sending invitations.
            </p>
          </div>
          <Link href="/workspace">
            <Button
              size="sm"
              className="font-sans text-sm h-9 cursor-pointer mt-1"
            >
              Go to Workspaces
            </Button>
          </Link>
        </div>
      ) : (
        <SendInvitationsForm
          eventId={eventId}
          workspaces={workspaces}
          organizerName={session.user.name ?? "Organizer"}
          organizerEmail={session.user.email}
          event={{
            name: event.name,
            eventAt: event.eventAt,
            location: event.location,
            emailSubject: event.emailSubject,
            emailBody: event.emailBody,
          }}
        />
      )}
    </div>
  );
}
