import { buildAgendaGroups, formatDayLabel } from "@/lib/calendar/range";
import { EventChip } from "@/components/calendar/event-chip";
import { CalendarEvent } from "@/lib/calendar/types";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

interface AgendaListProps {
  events: CalendarEvent[];
}

export function AgendaList({ events }: AgendaListProps) {
  const groups = buildAgendaGroups(events);

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 border border-dashed border-border">
        <CalendarDays className="h-6 w-6 text-muted-foreground" />
        <div className="text-center flex flex-col gap-1">
          <p className="font-mono text-sm text-foreground">
            Nothing in the next 60 days
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Create an event or jump to a different week.
          </p>
        </div>
        <Link href="/events/new">
          <Button
            size="sm"
            className="font-mono text-xs gap-2 rounded-none cursor-pointer"
          >
            New event
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.key} className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3 border-b border-border pb-1.5">
            <h2
              className={`font-mono text-xs uppercase tracking-widest ${
                group.isToday ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {group.isToday ? "Today" : formatDayLabel(group.date)}
            </h2>
            <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
              {group.events.length} event{group.events.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {group.events.map((event) => (
              <EventChip key={event.id} event={event} variant="agenda" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
