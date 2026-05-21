import { CalendarEvent, DateRange } from "../calendar/types";
import { NotFoundError } from "../shared/exceptions";
import { randomBytes } from "crypto";
import { db } from "../db/prisma";

const FEED_EVENTS_DAYS_BEHIND = 30;
const FEED_EVENTS_LIMIT = 500;

export const CalendarService = {
  async getEventsInRange(
    userId: string,
    range: DateRange,
  ): Promise<CalendarEvent[]> {
    const events = await db.event.findMany({
      where: {
        userId,
        eventAt: { gte: range.start, lte: range.end },
      },
      orderBy: { eventAt: "asc" },
      select: {
        id: true,
        name: true,
        location: true,
        eventAt: true,
        status: true,
        recurrence: true,
        parentEventId: true,
        scheduledAt: true,
        sentAt: true,
        invitations: { select: { status: true } },
      },
    });
    return events;
  },

  async getFeedEvents(userId: string) {
    const now = new Date();
    const since = new Date(now);
    since.setDate(since.getDate() - FEED_EVENTS_DAYS_BEHIND);
    return db.event.findMany({
      where: { userId, eventAt: { gte: since } },
      orderBy: { eventAt: "asc" },
      take: FEED_EVENTS_LIMIT,
      select: {
        id: true,
        name: true,
        desc: true,
        location: true,
        eventAt: true,
        status: true,
        recurrence: true,
        parentEventId: true,
      },
    });
  },

  async getOrCreateFeedToken(userId: string) {
    const existing = await db.calendarFeedToken.findUnique({
      where: { userId },
    });
    if (existing) return existing;

    return db.calendarFeedToken.create({
      data: {
        userId,
        token: this.generateToken(),
      },
    });
  },

  async regenerateFeedToken(userId: string) {
    return db.calendarFeedToken.upsert({
      where: { userId },
      update: { token: this.generateToken() },
      create: { userId, token: this.generateToken() },
    });
  },

  async revokeFeedToken(userId: string) {
    await db.calendarFeedToken.deleteMany({ where: { userId } });
  },

  async resolveFeedToken(token: string) {
    const record = await db.calendarFeedToken.findUnique({
      where: { token },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!record) throw new NotFoundError("Calendar feed not found");
    return record;
  },

  generateToken(): string {
    return randomBytes(32).toString("hex");
  },
};
