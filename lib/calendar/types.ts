import { $Enums } from "@prisma/client";

export type CalendarView = "month" | "agenda";

export const CALENDAR_VIEWS: readonly CalendarView[] = [
  "month",
  "agenda",
] as const;

export interface DateRange {
  start: Date;
  end: Date;
}

export interface CalendarEvent {
  id: string;
  name: string;
  location: string;
  eventAt: Date;
  status: $Enums.EventStatus;
  recurrence: $Enums.Recurrence | null;
  parentEventId: string | null;
  scheduledAt: Date | null;
  sentAt: Date | null;
  invitations: { status: $Enums.InvitationStatus }[];
}

export interface DayCell {
  /** ISO date key in YYYY-MM-DD form, used as the React key and bucket id */
  key: string;
  /** Date object pointing to 00:00 local on this day */
  date: Date;
  /** True when the cell belongs to the month the user is currently viewing */
  inCurrentMonth: boolean;
  /** True when the cell represents today (server-evaluated against `Date.now()`) */
  isToday: boolean;
  /** Events scheduled for this day, already sorted ascending by `eventAt` */
  events: CalendarEvent[];
}

export interface CalendarPageSearchParams {
  view?: string;
  date?: string;
  hideCancelled?: string;
}

export interface CalendarTokenParams {
  params: Promise<{ token: string }>;
}
