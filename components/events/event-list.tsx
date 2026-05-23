import { EventCard } from "@/components/events/event-card";
import { CalendarPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PastEvent } from "@/lib/types";
import Link from "next/link";

interface EventListProps {
  events: {
    id: string;
    name: string;
    location: string;
    eventAt: Date;
    createdAt: Date;
    status: string;
    sentAt: Date | null;
    recurrence: string | null;
    parentEventId: string | null;
    summary: {
      total: number;
      attending: number;
      maybe: number;
      declined: number;
      pending: number;
    };
  }[];
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
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
          <CalendarPlus className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="relative flex flex-col gap-1.5 max-w-sm">
          <h3 className="font-sans text-base font-medium text-foreground">
            No events yet
          </h3>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            Create your first event to start sending invitations to your
            workspace contacts.
          </p>
        </div>
        <Link href="/events/new" className="relative">
          <Button
            size="sm"
            className="font-sans text-sm gap-1.5 cursor-pointer h-9 mt-2"
          >
            <Plus className="h-3.5 w-3.5" />
            Create your first event
          </Button>
        </Link>
      </div>
    );
  }

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.eventAt) >= now);
  const past = events.filter((e) => new Date(e.eventAt) < now);

  return (
    <div className="flex flex-col gap-7 sm:gap-8">
      {upcoming.length > 0 && (
        <section className="flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.18em]">
              Upcoming
            </h2>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {upcoming.length}
            </span>
            <div className="h-px flex-1 bg-white/6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.18em]">
              Past
            </h2>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {past.length}
            </span>
            <div className="h-px flex-1 bg-white/6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {past.map((event: PastEvent) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
