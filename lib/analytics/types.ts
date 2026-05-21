import { $Enums } from "@prisma/client";

export type AnalyticsRange = "30d" | "90d" | "all";

export const ANALYTICS_RANGES: readonly AnalyticsRange[] = [
  "30d",
  "90d",
  "all",
] as const;

export interface LifetimeStats {
  totalEvents: number;
  eventsSent: number;
  totalInvites: number;
  totalResponses: number;
  totalAttending: number;
  totalMaybe: number;
  totalDeclined: number;
  totalPending: number;
  totalOpens: number;
  avgResponseHours: number | null;
}

export interface FunnelStats {
  sent: number;
  opened: number;
  responded: number;
  attending: number;
}

export interface RateStats {
  responseRate: number;
  attendingRate: number;
  openRate: number;
}

export interface EventTrendPoint {
  eventId: string;
  eventName: string;
  eventAt: Date;
  sentAt: Date;
  total: number;
  responded: number;
  attending: number;
  opened: number;
  responseRate: number;
}

export interface GuestAggregate {
  email: string;
  name: string | null;
  invitedCount: number;
  attendingCount: number;
  maybeCount: number;
  declinedCount: number;
  pendingCount: number;
  responseRate: number;
}

export interface RecurringSeriesStats {
  parentEventId: string;
  seriesName: string;
  recurrence: $Enums.Recurrence;
  occurrenceCount: number;
  totalInvited: number;
  totalAttending: number;
  recentAttendingCounts: number[];
}

export interface BestSendTime {
  dayLabel: string;
  hourLabel: string;
  responseRate: number;
  attendingRate: number;
  sampleSize: number;
}

export interface AnalyticsInsights {
  summary: string;
  topInsight: string;
  recommendation: string;
  trend: "improving" | "stable" | "declining";
}

export interface AnalyticsData {
  range: AnalyticsRange;
  lifetime: LifetimeStats;
  funnel: FunnelStats;
  rates: RateStats;
  trend: EventTrendPoint[];
  topEngaged: GuestAggregate[];
  ghosters: GuestAggregate[];
  series: RecurringSeriesStats[];
  bestSendTimes: BestSendTime[];
  isEmpty: boolean;
}
