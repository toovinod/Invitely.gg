import { buildMonthGrid, toDateKey } from "@/lib/calendar/range";
import { CalendarEvent, DayCell } from "@/lib/calendar/types";
import { EventChip } from "@/components/calendar/event-chip";
import Link from "next/link";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MAX_CHIPS_PER_CELL = 3;

interface MonthGridProps {
  anchor: Date;
  events: CalendarEvent[];
}

export function MonthGrid({ anchor, events }: MonthGridProps) {
  const cells = buildMonthGrid(anchor, events);

  return (
    <div className="border border-border">
      <div className="grid grid-cols-7 border-b border-border bg-muted/30">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="px-2 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-center border-r border-border last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 grid-rows-6">
        {cells.map((cell, idx) => (
          <DayCellView
            key={cell.key}
            cell={cell}
            isLastColumn={idx % 7 === 6}
            isLastRow={idx >= 35}
          />
        ))}
      </div>
    </div>
  );
}

interface DayCellViewProps {
  cell: DayCell;
  isLastColumn: boolean;
  isLastRow: boolean;
}

function DayCellView({ cell, isLastColumn, isLastRow }: DayCellViewProps) {
  const visible = cell.events.slice(0, MAX_CHIPS_PER_CELL);
  const overflow = cell.events.length - visible.length;
  const dayNumber = cell.date.getDate();

  return (
    <div
      className={`group relative flex flex-col min-h-24 sm:min-h-28 bg-background ${
        isLastColumn ? "" : "border-r border-border"
      } ${isLastRow ? "" : "border-b border-border"} ${
        cell.inCurrentMonth ? "" : "bg-muted/10"
      }`}
    >
      <div className="flex items-center justify-between px-2 pt-1.5">
        <span
          className={`font-mono text-[11px] tabular-nums ${
            cell.isToday
              ? "h-5 w-5 flex items-center justify-center bg-foreground text-background font-semibold"
              : cell.inCurrentMonth
                ? "text-foreground"
                : "text-muted-foreground/50"
          }`}
        >
          {dayNumber}
        </span>
        {cell.events.length === 0 && cell.inCurrentMonth && (
          <Link
            href={`/events/new?date=${toDateKey(cell.date)}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-muted-foreground hover:text-foreground px-1"
            aria-label={`Create event on ${toDateKey(cell.date)}`}
          >
            +
          </Link>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-0.5 px-1 pb-1 mt-1 min-w-0">
        {visible.map((event) => (
          <EventChip key={event.id} event={event} variant="month" />
        ))}
        {overflow > 0 && (
          <Link
            href={`/calendar?view=agenda&date=${toDateKey(cell.date)}`}
            className="font-mono text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-0.5"
          >
            +{overflow} more
          </Link>
        )}
      </div>
    </div>
  );
}
