import { StopRecurrenceButton } from "@/components/dashboard/stop-recurrence-button";
import { EventCancelDialog } from "@/components/events/event-cancel-dialog";
import { EventDeleteDialog } from "@/components/events/event-delete-dialog";
import { UnscheduleButton } from "@/components/dashboard/unschedule-button";
import { ReminderButton } from "@/components/dashboard/reminder-button";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { InsightsCard } from "@/components/dashboard/insights-card";
import { GuestTable } from "@/components/dashboard/guest-table";
import { getSession } from "@/lib/auth/client/get-session";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EventIdParams } from "@/lib/utils";
import { Invitation } from "@/lib/types";
import { db } from "@/lib/db/prisma";
import { Suspense } from "react";
import { Metadata } from "next";
import {
  SummaryCardsSkeleton,
  GuestTableSkeleton,
} from "@/components/skeletons";
import { cache } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Pencil,
  RefreshCw,
  AlertTriangle,
  Clock,
} from "lucide-react";

const getEvent = cache(async (eventId: string) => {
  return db.event.findUnique({
    where: { id: eventId },
    include: {
      _count: {
        select: {
          childEvents: {
            where: {
              eventAt: { gt: new Date() },
              status: { not: "cancelled" },
            },
          },
        },
      },
    },
  });
});

export async function generateMetadata({
  params,
}: EventIdParams): Promise<Metadata> {
  const { eventId } = await params;
  const event = await getEvent(eventId);
  return {
    title: event ? `${event.name} | Invitely.gg` : "Event | Invitely.gg",
  };
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "default" | "muted" | "destructive";
}) {
  const className =
    tone === "destructive"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : tone === "muted"
        ? "border-white/8 bg-white/3 text-muted-foreground"
        : "border-white/15 bg-white/6 text-foreground";
  return (
    <span
      className={`inline-flex items-center gap-1 border px-2 h-5 font-sans text-[11px] uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}

async function GuestSection({
  eventId,
  isScheduled,
}: {
  eventId: string;
  isScheduled: boolean;
}) {
  const invitations = await db.invitation.findMany({
    where: { eventId },
    orderBy: { sentAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      sentAt: true,
      respondedAt: true,
      openedAt: true,
      guestNote: true,
      organizerNote: true,
    },
  });

  const summary = {
    total: invitations.length,
    attending: invitations.filter((i: Invitation) => i.status === "attending")
      .length,
    maybe: invitations.filter((i: Invitation) => i.status === "maybe").length,
    declined: invitations.filter((i: Invitation) => i.status === "declined")
      .length,
    pending: invitations.filter((i: Invitation) => i.status === "pending")
      .length,
  };

  return (
    <>
      <SummaryCards summary={summary} />
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-sans text-[11px] text-muted-foreground uppercase tracking-[0.18em] font-medium">
            Guest list ·{" "}
            <span className="font-mono tabular-nums text-foreground">
              {summary.total}
            </span>
          </h2>
          {!isScheduled && (
            <ReminderButton eventId={eventId} pendingCount={summary.pending} />
          )}
        </div>
        <GuestTable
          invitations={invitations}
          eventId={eventId}
          isScheduled={isScheduled}
        />
      </div>
    </>
  );
}

export default async function EventDashboardPage({ params }: EventIdParams) {
  const { eventId } = await params;
  const [session, event] = await Promise.all([getSession(), getEvent(eventId)]);

  if (!session) redirect("/login");
  if (!event) notFound();
  if (event.userId !== session.user.id) notFound();

  const isCancelled = event.status === "cancelled";
  const isScheduled = event.status === "scheduled";
  const isPast = new Date(event.eventAt) < new Date();
  const isRecurring = !!event.recurrence;
  const isChildEvent = !!event.parentEventId;
  const futureChildCount = event._count.childEvents;

  const hoursUntilEvent =
    (new Date(event.eventAt).getTime() - new Date().getTime()) /
    (1000 * 60 * 60);
  const noInvitationsSent = !event.sentAt && event.status !== "scheduled";

  const showUrgentBanner =
    isChildEvent &&
    !isCancelled &&
    !isPast &&
    noInvitationsSent &&
    hoursUntilEvent <= 12 &&
    hoursUntilEvent > 0;

  const showInvitePendingBanner =
    isChildEvent &&
    !isCancelled &&
    !isPast &&
    noInvitationsSent &&
    hoursUntilEvent > 12 &&
    hoursUntilEvent <= 18;

  const showRecurringNotSent =
    isChildEvent &&
    !isCancelled &&
    !isPast &&
    noInvitationsSent &&
    hoursUntilEvent > 18;

  const hoursLabel =
    hoursUntilEvent < 1
      ? "less than 1 hour"
      : `${Math.round(hoursUntilEvent)} hour${Math.round(hoursUntilEvent) === 1 ? "" : "s"}`;

  const formattedDate = new Date(event.eventAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(event.eventAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const guestCount = await db.invitation.count({ where: { eventId } });

  return (
    <div className="flex flex-col gap-6 sm:gap-7">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Link href="/events" className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="font-sans text-sm h-8 gap-1.5 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All events
          </Button>
        </Link>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {isScheduled && event.scheduledAt && (
            <UnscheduleButton
              eventId={event.id}
              scheduledAt={event.scheduledAt}
            />
          )}
          {!isCancelled && !isScheduled && isRecurring && (
            <StopRecurrenceButton
              eventId={event.id}
              recurrence={event.recurrence!}
              futureCount={futureChildCount}
            />
          )}
          {!isCancelled && !isScheduled && (
            <Button
              variant="outline"
              size="sm"
              className="font-sans text-sm h-8 gap-1.5 border-white/8 hover:border-white/15 hover:bg-white/4"
              asChild
            >
              <Link href={`/events/${eventId}/edit`}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Link>
            </Button>
          )}
          {!isCancelled && !isScheduled && (
            <EventCancelDialog
              eventId={event.id}
              eventName={event.name}
              guestCount={guestCount}
            />
          )}
          <EventDeleteDialog eventId={event.id} eventName={event.name} />
        </div>
      </div>

      {showUrgentBanner && (
        <div className="border border-destructive/30 bg-destructive/10 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5 animate-pulse" />
            <div className="flex flex-col gap-0.5">
              <p className="font-sans text-sm font-semibold text-destructive">
                Event in {hoursLabel} — no invitations sent
              </p>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                Your guests don&apos;t know about this recurring event yet.
              </p>
            </div>
          </div>
          <Link
            href={`/events/${eventId}/send-invitations`}
            className="shrink-0"
          >
            <Button size="sm" className="font-sans text-sm h-8">
              Send invitations now
            </Button>
          </Link>
        </div>
      )}

      {showInvitePendingBanner && (
        <div className="border border-white/15 bg-white/4 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <p className="font-sans text-sm font-semibold text-foreground">
                Event in {hoursLabel} — send invitations soon
              </p>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                This occurrence was created automatically. Select guests and
                send.
              </p>
            </div>
          </div>
          <Link
            href={`/events/${eventId}/send-invitations`}
            className="shrink-0"
          >
            <Button
              variant="outline"
              size="sm"
              className="font-sans text-sm h-8 border-white/15 hover:border-white/22 hover:bg-white/6"
            >
              Send invitations
            </Button>
          </Link>
        </div>
      )}

      {showRecurringNotSent && (
        <div className="border border-white/8 bg-white/2 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <RefreshCw className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <p className="font-sans text-sm font-semibold text-foreground">
                Recurring event — no invitations sent yet
              </p>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                This occurrence was created automatically. Select guests when
                ready.
              </p>
            </div>
          </div>
          <Link
            href={`/events/${eventId}/send-invitations`}
            className="shrink-0"
          >
            <Button
              variant="outline"
              size="sm"
              className="font-sans text-sm h-8 border-white/8 hover:border-white/15 hover:bg-white/4"
            >
              Send invitations
            </Button>
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3 border-b border-white/8 pb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusPill
            label={
              isCancelled
                ? "cancelled"
                : isScheduled
                  ? "scheduled"
                  : isPast
                    ? "past"
                    : "upcoming"
            }
            tone={isCancelled ? "destructive" : isPast ? "muted" : "default"}
          />
          {isRecurring && (
            <span className="inline-flex items-center gap-1 border border-white/8 bg-white/3 px-2 h-5 font-sans text-[11px] uppercase tracking-wide text-muted-foreground">
              <RefreshCw className="h-2.5 w-2.5" />
              {event.recurrence}
            </span>
          )}
          {isChildEvent && noInvitationsSent && !isCancelled && !isPast && (
            <span className="inline-flex items-center gap-1 border border-white/8 bg-white/3 px-2 h-5 font-sans text-[11px] uppercase tracking-wide text-muted-foreground">
              invite pending
            </span>
          )}
        </div>

        <h1 className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          {event.name}
        </h1>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
            <span
              className={`font-mono text-xs tabular-nums text-muted-foreground ${isCancelled ? "line-through" : ""}`}
            >
              {formattedDate} at {formattedTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
            <span
              className={`font-sans text-sm text-muted-foreground ${isCancelled ? "line-through" : ""}`}
            >
              {event.location}
            </span>
          </div>
        </div>

        {isScheduled && event.scheduledAt && (
          <p className="font-sans text-xs text-muted-foreground">
            Sends{" "}
            <span className="font-mono tabular-nums text-foreground">
              {new Date(event.scheduledAt).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
        )}
      </div>

      <InsightsCard eventId={eventId} />

      <Suspense
        fallback={
          <>
            <SummaryCardsSkeleton />
            <GuestTableSkeleton />
          </>
        }
      >
        <GuestSection eventId={eventId} isScheduled={isScheduled} />
      </Suspense>
    </div>
  );
}
