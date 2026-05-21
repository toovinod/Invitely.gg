import { $Enums } from "@prisma/client";
import { db } from "../db/prisma";
import {
  AnalyticsData,
  AnalyticsRange,
  BestSendTime,
  EventTrendPoint,
  FunnelStats,
  GuestAggregate,
  LifetimeStats,
  RateStats,
  RecurringSeriesStats,
} from "../analytics/types";

const TREND_EVENTS_LIMIT = 12;
const TOP_GUESTS_LIMIT = 10;
const GHOSTER_MIN_INVITES = 2;
const SERIES_RECENT_OCCURRENCES = 4;
const SEND_TIME_MIN_SAMPLE = 5;
const SEND_TIME_TOP_N = 5;

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

interface InvitationRow {
  email: string;
  name: string | null;
  status: $Enums.InvitationStatus;
  sentAt: Date;
  respondedAt: Date | null;
  openedAt: Date | null;
  eventId: string;
}

interface TrendEventRow {
  id: string;
  name: string;
  eventAt: Date;
  sentAt: Date | null;
  invitations: {
    status: $Enums.InvitationStatus;
    sentAt: Date;
    respondedAt: Date | null;
    openedAt: Date | null;
  }[];
}

interface SeriesEventRow {
  id: string;
  name: string;
  recurrence: $Enums.Recurrence | null;
  parentEventId: string | null;
  eventAt: Date;
  sentAt: Date | null;
  invitations: { status: $Enums.InvitationStatus }[];
}

export const AnalyticsService = {
  getCutoff(range: AnalyticsRange): Date | null {
    if (range === "all") return null;
    const days = range === "30d" ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);
    return cutoff;
  },

  async getDashboardData(
    userId: string,
    range: AnalyticsRange = "all",
  ): Promise<AnalyticsData> {
    const since = this.getCutoff(range);

    const [
      eventCount,
      eventsSentCount,
      invitations,
      trendEvents,
      seriesEvents,
    ] = await Promise.all([
      db.event.count({
        where: { userId, ...(since && { eventAt: { gte: since } }) },
      }),
      db.event.count({
        where: {
          userId,
          sentAt: since ? { gte: since } : { not: null },
        },
      }),
      this.fetchAllInvitations(userId, since),
      this.fetchTrendEvents(userId, since),
      this.fetchSeriesEvents(userId, since),
    ]);

    const lifetime = this.computeLifetime(
      eventCount,
      eventsSentCount,
      invitations,
    );
    const funnel = this.computeFunnel(invitations);
    const rates = this.computeRates(funnel);
    const guestAggregates = this.aggregateByGuest(invitations);
    const topEngaged = this.rankEngaged(guestAggregates);
    const ghosters = this.rankGhosters(guestAggregates);
    const trend = this.computeTrend(trendEvents);
    const series = this.computeRecurringSeries(seriesEvents);
    const bestSendTimes = this.computeBestSendTimes(invitations);

    const isEmpty = lifetime.totalInvites === 0;

    return {
      range,
      lifetime,
      funnel,
      rates,
      trend,
      topEngaged,
      ghosters,
      series,
      bestSendTimes,
      isEmpty,
    };
  },

  async fetchAllInvitations(
    userId: string,
    since: Date | null,
  ): Promise<InvitationRow[]> {
    return db.invitation.findMany({
      where: {
        event: {
          userId,
          ...(since && { sentAt: { gte: since } }),
        },
      },
      select: {
        email: true,
        name: true,
        status: true,
        sentAt: true,
        respondedAt: true,
        openedAt: true,
        eventId: true,
      },
    });
  },

  async fetchTrendEvents(
    userId: string,
    since: Date | null,
  ): Promise<TrendEventRow[]> {
    const events = await db.event.findMany({
      where: {
        userId,
        sentAt: since ? { gte: since } : { not: null },
        status: { not: "cancelled" },
      },
      orderBy: { sentAt: "desc" },
      take: TREND_EVENTS_LIMIT,
      select: {
        id: true,
        name: true,
        eventAt: true,
        sentAt: true,
        invitations: {
          select: {
            status: true,
            sentAt: true,
            respondedAt: true,
            openedAt: true,
          },
        },
      },
    });
    return events.reverse();
  },

  async fetchSeriesEvents(
    userId: string,
    since: Date | null,
  ): Promise<SeriesEventRow[]> {
    return db.event.findMany({
      where: {
        userId,
        OR: [
          { recurrence: { not: null }, parentEventId: null },
          { parentEventId: { not: null } },
        ],
        ...(since && { eventAt: { gte: since } }),
      },
      orderBy: { eventAt: "asc" },
      select: {
        id: true,
        name: true,
        recurrence: true,
        parentEventId: true,
        eventAt: true,
        sentAt: true,
        invitations: { select: { status: true } },
      },
    });
  },

  computeLifetime(
    totalEvents: number,
    eventsSent: number,
    invitations: InvitationRow[],
  ): LifetimeStats {
    const totalInvites = invitations.length;
    let attending = 0;
    let maybe = 0;
    let declined = 0;
    let pending = 0;
    let opens = 0;
    let responseHoursSum = 0;
    let respondedSamples = 0;

    for (const inv of invitations) {
      switch (inv.status) {
        case "attending":
          attending += 1;
          break;
        case "maybe":
          maybe += 1;
          break;
        case "declined":
          declined += 1;
          break;
        case "pending":
          pending += 1;
          break;
      }
      if (inv.openedAt) opens += 1;
      if (inv.respondedAt && inv.sentAt) {
        const hours =
          (inv.respondedAt.getTime() - inv.sentAt.getTime()) / 3_600_000;
        if (hours >= 0 && Number.isFinite(hours)) {
          responseHoursSum += hours;
          respondedSamples += 1;
        }
      }
    }

    const totalResponses = attending + maybe + declined;
    const avgResponseHours =
      respondedSamples > 0
        ? Math.round((responseHoursSum / respondedSamples) * 10) / 10
        : null;

    return {
      totalEvents,
      eventsSent,
      totalInvites,
      totalResponses,
      totalAttending: attending,
      totalMaybe: maybe,
      totalDeclined: declined,
      totalPending: pending,
      totalOpens: opens,
      avgResponseHours,
    };
  },

  computeFunnel(invitations: InvitationRow[]): FunnelStats {
    let sent = 0;
    let opened = 0;
    let responded = 0;
    let attending = 0;
    for (const inv of invitations) {
      sent += 1;
      if (inv.openedAt) opened += 1;
      if (inv.status !== "pending") responded += 1;
      if (inv.status === "attending") attending += 1;
    }
    return { sent, opened, responded, attending };
  },

  computeRates(funnel: FunnelStats): RateStats {
    const safe = (numerator: number, denominator: number) =>
      denominator === 0 ? 0 : Math.round((numerator / denominator) * 100);
    return {
      responseRate: safe(funnel.responded, funnel.sent),
      attendingRate: safe(funnel.attending, funnel.responded),
      openRate: safe(funnel.opened, funnel.sent),
    };
  },

  aggregateByGuest(invitations: InvitationRow[]): GuestAggregate[] {
    const map = new Map<string, GuestAggregate>();
    for (const inv of invitations) {
      const existing = map.get(inv.email);
      const aggregate: GuestAggregate = existing ?? {
        email: inv.email,
        name: inv.name,
        invitedCount: 0,
        attendingCount: 0,
        maybeCount: 0,
        declinedCount: 0,
        pendingCount: 0,
        responseRate: 0,
      };
      // Prefer a name when one becomes available across invitations.
      if (!aggregate.name && inv.name) aggregate.name = inv.name;
      aggregate.invitedCount += 1;
      switch (inv.status) {
        case "attending":
          aggregate.attendingCount += 1;
          break;
        case "maybe":
          aggregate.maybeCount += 1;
          break;
        case "declined":
          aggregate.declinedCount += 1;
          break;
        case "pending":
          aggregate.pendingCount += 1;
          break;
      }
      map.set(inv.email, aggregate);
    }

    for (const aggregate of map.values()) {
      const responses =
        aggregate.attendingCount +
        aggregate.maybeCount +
        aggregate.declinedCount;
      aggregate.responseRate =
        aggregate.invitedCount === 0
          ? 0
          : Math.round((responses / aggregate.invitedCount) * 100);
    }
    return Array.from(map.values());
  },

  rankEngaged(guests: GuestAggregate[]): GuestAggregate[] {
    return [...guests]
      .filter((g) => g.attendingCount > 0)
      .sort((a, b) => {
        if (b.attendingCount !== a.attendingCount)
          return b.attendingCount - a.attendingCount;
        if (b.maybeCount !== a.maybeCount) return b.maybeCount - a.maybeCount;
        return b.responseRate - a.responseRate;
      })
      .slice(0, TOP_GUESTS_LIMIT);
  },

  rankGhosters(guests: GuestAggregate[]): GuestAggregate[] {
    return [...guests]
      .filter(
        (g) =>
          g.invitedCount >= GHOSTER_MIN_INVITES &&
          g.attendingCount === 0 &&
          g.maybeCount === 0 &&
          g.declinedCount === 0,
      )
      .sort((a, b) => b.pendingCount - a.pendingCount)
      .slice(0, TOP_GUESTS_LIMIT);
  },

  computeTrend(events: TrendEventRow[]): EventTrendPoint[] {
    return events
      .filter((e): e is TrendEventRow & { sentAt: Date } => e.sentAt !== null)
      .map((event) => {
        let attending = 0;
        let responded = 0;
        let opened = 0;
        for (const inv of event.invitations) {
          if (inv.openedAt) opened += 1;
          if (inv.status !== "pending") responded += 1;
          if (inv.status === "attending") attending += 1;
        }
        const total = event.invitations.length;
        const responseRate =
          total === 0 ? 0 : Math.round((responded / total) * 100);
        return {
          eventId: event.id,
          eventName: event.name,
          eventAt: event.eventAt,
          sentAt: event.sentAt,
          total,
          responded,
          attending,
          opened,
          responseRate,
        };
      });
  },

  computeRecurringSeries(events: SeriesEventRow[]): RecurringSeriesStats[] {
    const parents = events.filter(
      (e): e is SeriesEventRow & { recurrence: $Enums.Recurrence } =>
        e.recurrence !== null && e.parentEventId === null,
    );
    if (parents.length === 0) return [];

    return parents
      .map<RecurringSeriesStats>((parent) => {
        const occurrences = events
          .filter(
            (e) =>
              (e.id === parent.id || e.parentEventId === parent.id) &&
              e.sentAt !== null,
          )
          .sort((a, b) => a.eventAt.getTime() - b.eventAt.getTime());

        let totalInvited = 0;
        let totalAttending = 0;
        const recentAttending: number[] = [];

        for (const occ of occurrences) {
          totalInvited += occ.invitations.length;
          const attending = occ.invitations.filter(
            (i) => i.status === "attending",
          ).length;
          totalAttending += attending;
          recentAttending.push(attending);
        }

        return {
          parentEventId: parent.id,
          seriesName: parent.name,
          recurrence: parent.recurrence,
          occurrenceCount: occurrences.length,
          totalInvited,
          totalAttending,
          recentAttendingCounts: recentAttending.slice(
            -SERIES_RECENT_OCCURRENCES,
          ),
        };
      })
      .filter((s) => s.occurrenceCount > 0)
      .sort((a, b) => b.totalAttending - a.totalAttending);
  },

  computeBestSendTimes(invitations: InvitationRow[]): BestSendTime[] {
    interface RawBucket {
      dayOfWeek: number;
      hour: number;
      sent: number;
      responded: number;
      attending: number;
    }
    const buckets = new Map<string, RawBucket>();
    for (const inv of invitations) {
      const dayOfWeek = inv.sentAt.getDay();
      const hour = inv.sentAt.getHours();
      const key = `${dayOfWeek}-${hour}`;
      const existing = buckets.get(key) ?? {
        dayOfWeek,
        hour,
        sent: 0,
        responded: 0,
        attending: 0,
      };
      existing.sent += 1;
      if (inv.status !== "pending") existing.responded += 1;
      if (inv.status === "attending") existing.attending += 1;
      buckets.set(key, existing);
    }

    return Array.from(buckets.values())
      .filter((b) => b.sent >= SEND_TIME_MIN_SAMPLE)
      .map<BestSendTime>((b) => ({
        dayLabel: DAY_NAMES[b.dayOfWeek],
        hourLabel: this.formatHour(b.hour),
        responseRate: Math.round((b.responded / b.sent) * 100),
        attendingRate: Math.round((b.attending / b.sent) * 100),
        sampleSize: b.sent,
      }))
      .sort((a, b) => {
        if (b.responseRate !== a.responseRate)
          return b.responseRate - a.responseRate;
        return b.sampleSize - a.sampleSize;
      })
      .slice(0, SEND_TIME_TOP_N);
  },

  formatHour(hour: number): string {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  },

  async fetchInvitationsForExport(userId: string, range: AnalyticsRange) {
    const since = this.getCutoff(range);
    return db.invitation.findMany({
      where: {
        event: {
          userId,
          ...(since && { sentAt: { gte: since } }),
        },
      },
      orderBy: [{ event: { eventAt: "desc" } }, { sentAt: "asc" }],
      select: {
        email: true,
        name: true,
        status: true,
        sentAt: true,
        respondedAt: true,
        openedAt: true,
        event: {
          select: {
            name: true,
            eventAt: true,
            location: true,
            status: true,
            recurrence: true,
            sentAt: true,
          },
        },
      },
    });
  },
};
