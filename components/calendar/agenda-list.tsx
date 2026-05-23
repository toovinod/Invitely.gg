import { buildAgendaGroups, formatDayLabel } from "@/lib/calendar/range";
import { EventChip } from "@/components/calendar/event-chip";
import { CalendarEvent } from "@/lib/calendar/types";
import { CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AgendaListProps {
  events: CalendarEvent[];
}

export function AgendaList({ events }: AgendaListProps) {
  const groups = buildAgendaGroups(events);

  if (groups.length === 0) {
    return (
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
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="relative flex flex-col gap-1.5 max-w-sm">
          <h3 className="font-sans text-base font-medium text-foreground">
            Nothing in the next 60 days
          </h3>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            Create an event or jump to a different week to see what&apos;s on
            the horizon.
          </p>
        </div>
        <Link href="/events/new" className="relative">
          <Button
            size="sm"
            className="font-sans text-sm gap-1.5 cursor-pointer h-9 mt-2"
          >
            <Plus className="h-3.5 w-3.5" />
            New event
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7 sm:gap-8">
      {groups.map((group) => (
        <section key={group.key} className="flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <h2
              className={`font-sans text-[11px] font-medium uppercase tracking-[0.18em] ${
                group.isToday ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {group.isToday ? "Today" : formatDayLabel(group.date)}
            </h2>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {group.events.length}
            </span>
            <div className="h-px flex-1 bg-white/6" />
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
