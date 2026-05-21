import {
  CALENDAR_VIEWS,
  CalendarEvent,
  CalendarView,
  DateRange,
  DayCell,
} from "./types";

const AGENDA_DAYS_AHEAD = 60;
const AGENDA_DAYS_BEHIND = 7;

export function parseView(value: string | undefined): CalendarView {
  if (!value) return "month";
  return (CALENDAR_VIEWS as readonly string[]).includes(value)
    ? (value as CalendarView)
    : "month";
}

export function parseDateParam(value: string | undefined): Date {
  if (!value) return startOfDay(new Date());
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return startOfDay(new Date());
  return startOfDay(parsed);
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function endOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

export function startOfMonth(date: Date): Date {
  const next = new Date(date);
  next.setDate(1);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function endOfMonth(date: Date): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + 1);
  next.setDate(0);
  next.setHours(23, 59, 59, 999);
  return next;
}

export function addDays(date: Date, n: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + n);
  return next;
}

export function addMonths(date: Date, n: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + n);
  return next;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function computeRangeFor(view: CalendarView, anchor: Date): DateRange {
  if (view === "month") {
    const monthStart = startOfMonth(anchor);

    const gridStart = addDays(monthStart, -monthStart.getDay());

    const gridEnd = endOfDay(addDays(gridStart, 41));
    return { start: gridStart, end: gridEnd };
  }

  const start = startOfDay(addDays(anchor, -AGENDA_DAYS_BEHIND));
  const end = endOfDay(addDays(anchor, AGENDA_DAYS_AHEAD));
  return { start, end };
}

export function buildMonthGrid(
  anchor: Date,
  events: CalendarEvent[],
): DayCell[] {
  const monthStart = startOfMonth(anchor);
  const gridStart = addDays(monthStart, -monthStart.getDay());
  const today = startOfDay(new Date());
  const targetMonth = anchor.getMonth();

  const buckets = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = toDateKey(new Date(event.eventAt));
    const list = buckets.get(key);
    if (list) list.push(event);
    else buckets.set(key, [event]);
  }

  const cells: DayCell[] = [];
  for (let i = 0; i < 42; i += 1) {
    const date = addDays(gridStart, i);
    const key = toDateKey(date);
    cells.push({
      key,
      date,
      inCurrentMonth: date.getMonth() === targetMonth,
      isToday: isSameDay(date, today),
      events: buckets.get(key) ?? [],
    });
  }
  return cells;
}

export function buildAgendaGroups(events: CalendarEvent[]): DayCell[] {
  const today = startOfDay(new Date());
  const buckets = new Map<string, DayCell>();

  for (const event of events) {
    const eventDay = startOfDay(new Date(event.eventAt));
    const key = toDateKey(eventDay);
    const existing = buckets.get(key);
    if (existing) {
      existing.events.push(event);
      continue;
    }
    buckets.set(key, {
      key,
      date: eventDay,
      inCurrentMonth: true,
      isToday: isSameDay(eventDay, today),
      events: [event],
    });
  }

  return Array.from(buckets.values()).sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
}

export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatChipTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}
