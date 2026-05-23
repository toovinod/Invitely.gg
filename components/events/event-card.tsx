import { EventDeleteDialog } from "@/components/events/event-delete-dialog";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface EventSummary {
  total: number;
  attending: number;
  maybe: number;
  declined: number;
  pending: number;
}

interface EventCardProps {
  event: {
    id: string;
    name: string;
    location: string;
    eventAt: Date;
    createdAt: Date;
    status: string;
    recurrence: string | null;
    parentEventId: string | null;
    sentAt: Date | null;
    summary: EventSummary;
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
      className={`inline-flex items-center gap-1 border px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}

export function EventCard({ event }: EventCardProps) {
  const now = new Date();
  const isPast = new Date(event.eventAt) < now;
  const isCancelled = event.status === "cancelled";
  const isScheduled = event.status === "scheduled";
  const isRecurring = !!event.recurrence;
  const isChildEvent = !!event.parentEventId;
  const noInvitationsSent = !event.sentAt && event.status !== "scheduled";

  const hoursUntilEvent =
    (new Date(event.eventAt).getTime() - now.getTime()) / (1000 * 60 * 60);

  const isUrgent =
    isChildEvent &&
    !isCancelled &&
    !isPast &&
    noInvitationsSent &&
    hoursUntilEvent <= 18 &&
    hoursUntilEvent > 0;

  const isInvitePending =
    isChildEvent &&
    !isCancelled &&
    !isPast &&
    noInvitationsSent &&
    hoursUntilEvent > 18;

  const formattedDate = new Date(event.eventAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(event.eventAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const cardClass = isCancelled
    ? "opacity-60 hover:border-white/[0.12]"
    : isUrgent
      ? "border-destructive/30 hover:border-destructive/50"
      : "hover:border-white/15";

  return (
    <div
      className={`group relative flex flex-col overflow-hidden border border-white/8 bg-white/2 transition-all duration-300 hover:bg-white/4 ${cardClass}`}
    >
      <div className="relative flex items-start justify-between gap-2 px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
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
              <span className="inline-flex items-center gap-1 border border-white/8 bg-white/3 px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                <RefreshCw className="h-2.5 w-2.5" />
                {event.recurrence}
              </span>
            )}

            {isUrgent && (
              <span className="inline-flex items-center gap-1 border border-destructive/30 bg-destructive/10 px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide text-destructive">
                <AlertTriangle className="h-2.5 w-2.5" />
                urgent
              </span>
            )}

            {isInvitePending && !isUrgent && (
              <span className="inline-flex items-center gap-1 border border-white/8 bg-white/3 px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                invite pending
              </span>
            )}
          </div>

          <Link href={`/events/${event.id}`} className="min-w-0">
            <h3 className="font-sans text-base font-semibold tracking-tight text-foreground truncate group-hover:underline underline-offset-4 decoration-white/30">
              {event.name}
            </h3>
          </Link>
        </div>

        <EventDeleteDialog eventId={event.id} eventName={event.name} />
      </div>

      <Link
        href={`/events/${event.id}`}
        className="relative block flex-1 cursor-pointer"
      >
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span
                className={`font-mono text-xs tabular-nums text-muted-foreground ${isCancelled ? "line-through" : ""}`}
              >
                {formattedDate} · {formattedTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span
                className={`font-sans text-xs text-muted-foreground truncate ${isCancelled ? "line-through" : ""}`}
              >
                {event.location}
              </span>
            </div>
          </div>

          <div className="h-px bg-white/6" />

          {event.summary.total === 0 ? (
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-muted-foreground/80" />
              <span className="font-sans text-xs text-muted-foreground">
                {isScheduled
                  ? "Send scheduled"
                  : isInvitePending || isUrgent
                    ? "No invitations sent — action needed"
                    : "No invitations sent yet"}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Going", value: event.summary.attending },
                { label: "Maybe", value: event.summary.maybe },
                { label: "No", value: event.summary.declined },
                { label: "Pending", value: event.summary.pending },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-base font-semibold text-foreground tabular-nums leading-none">
                    {value}
                  </span>
                  <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-wider">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
