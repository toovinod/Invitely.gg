import { formatChipTime } from "@/lib/calendar/range";
import { CalendarEvent } from "@/lib/calendar/types";
import { RefreshCw } from "lucide-react";
import Link from "next/link";

interface EventChipProps {
  event: CalendarEvent;
  variant?: "month" | "agenda";
}

export function EventChip({ event, variant = "month" }: EventChipProps) {
  const isCancelled = event.status === "cancelled";
  const isScheduled = event.status === "scheduled";
  const isPast = new Date(event.eventAt) < new Date();

  const dotClass = isCancelled
    ? "bg-destructive"
    : isScheduled
      ? "bg-blue-500"
      : isPast
        ? "bg-muted-foreground/40"
        : "bg-foreground";

  const time = formatChipTime(new Date(event.eventAt));

  if (variant === "agenda") {
    return (
      <Link
        href={`/events/${event.id}`}
        className={`group flex items-center gap-3 border border-border px-3 py-2.5 hover:border-foreground/30 transition-colors ${
          isCancelled ? "opacity-50" : ""
        }`}
      >
        <span className={`h-1.5 w-1.5 shrink-0 ${dotClass}`} />
        <span className="font-mono text-xs text-muted-foreground tabular-nums w-16 shrink-0">
          {time}
        </span>
        <span
          className={`font-mono text-xs text-foreground truncate flex-1 group-hover:underline underline-offset-4 ${
            isCancelled ? "line-through" : ""
          }`}
        >
          {event.name}
        </span>
        {event.recurrence && (
          <RefreshCw className="h-3 w-3 text-muted-foreground shrink-0" />
        )}
        <span className="font-mono text-[10px] text-muted-foreground truncate hidden sm:block max-w-[40%]">
          {event.location}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/events/${event.id}`}
      className={`flex items-center gap-1.5 px-1.5 py-0.5 hover:bg-muted/60 transition-colors min-w-0 ${
        isCancelled ? "opacity-50" : ""
      }`}
      title={`${event.name} · ${time}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 ${dotClass}`} />
      <span className="font-mono text-[10px] text-muted-foreground tabular-nums shrink-0 hidden sm:inline">
        {time}
      </span>
      <span
        className={`font-mono text-[10px] text-foreground truncate min-w-0 ${
          isCancelled ? "line-through" : ""
        }`}
      >
        {event.name}
      </span>
      {event.recurrence && (
        <RefreshCw className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
      )}
    </Link>
  );
}
