import { generatePollBestSlotPrompt } from "../prompts/poll";
import { AnalyticsService } from "./validate-analytics";
import { ZodPollBestSlotResponse } from "../zod/poll";
import { PollBestSlotInsight } from "../polls/types";
import { AnalyticsRange } from "../analytics/types";
import { InvitationData } from "../types/index";
import { PollService } from "./validate-poll";
import { formatEventDate } from "../utils";
import { llm } from "@/lib/llm/llm";
import { db } from "../db/prisma";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  TimeoutError,
} from "@/lib/shared/exceptions";
import {
  generateLifetimeAnalyticsPrompt,
  generateRsvpInsightsPrompt,
} from "../prompts/analytics";
import {
  ZodLLMInsightsResponse,
  ZodLLMOptimizeResponse,
  ZodLifetimeAnalyticsResponse,
} from "@/lib/zod/llm";

export const LLMService = {
  async optimizeInvite(prompt: string) {
    try {
      const raw = await llm(prompt);
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        console.error("[AI_PARSE_FAILURE]:", raw);
        throw new InternalServerError(
          "LLM returned an invalid response format.",
        );
      }
      const validated = ZodLLMOptimizeResponse.safeParse(parsed);
      if (!validated.success) {
        console.error("[AI_SHAPE_FAILURE]:", validated.error.format());
        throw new InternalServerError(
          "LLM response did not match the expected template.",
        );
      }

      return validated.data;
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "gemini response error") {
        throw new TimeoutError(
          "The LLM took too long to respond. please try again.",
        );
      }
      throw error;
    }
  },
  async EventInsights(eventId: string, userId: string) {
    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
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
    if (!event) throw new NotFoundError("Event not found");
    if (event.userId !== userId) throw new ForbiddenError("Not authorized");
    const total = event.invitations.length;
    if (total === 0) throw new BadRequestError("No invitations to analyze");
    const stats = {
      attending: event.invitations.filter((x) => x.status === "attending")
        .length,
      pending: event.invitations.filter((x) => x.status === "pending").length,
      declined: event.invitations.filter((x) => x.status === "declined").length,
      maybe: event.invitations.filter((x) => x.status === "maybe").length,
      openedNotResponded: event.invitations.filter(
        (i) => i.openedAt && i.status === "pending",
      ).length,
    };
    const responded = total - stats.pending;
    const responseRate = Math.round((responded / total) * 100);
    if (responseRate < 10) {
      throw new ConflictError(
        "Not enough responses yet to generate insights (minimum 10% required)",
      );
    }
    const avgResponseHours = this.calculateAvgResponseTime(event.invitations);
    const eventDate = formatEventDate(event.eventAt, "full");
    const daysUntilEvent = Math.max(
      0,
      Math.ceil(
        (new Date(event.eventAt).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      ),
    );
    const prompt = generateRsvpInsightsPrompt({
      eventName: event.name,
      eventDate,
      daysUntilEvent,
      totalInvited: total,
      ...stats,
      responseRate,
      avgResponseHours,
    });

    const llmRes = await this.fetchAndValidateAI(prompt);
    return {
      insights: llmRes,
      stats: { total, ...stats, responseRate },
    };
  },

  calculateAvgResponseTime(invitations: InvitationData[]): number | null {
    const validResponses = invitations.filter(
      (
        i,
      ): i is InvitationData & {
        respondedAt: Date | string;
        sentAt: Date | string;
      } => i.respondedAt !== null && i.sentAt !== null,
    );
    if (validResponses.length === 0) return null;
    const times = validResponses.map((i) => {
      const responded = new Date(i.respondedAt).getTime();
      const sent = new Date(i.sentAt).getTime();
      return (responded - sent) / (1000 * 60 * 60);
    });
    const totalHours = times.reduce((acc, curr) => acc + curr, 0);
    return Math.round(totalHours / times.length);
  },
  async fetchAndValidateAI(prompt: string) {
    const raw = await llm(prompt);
    try {
      const parsed = JSON.parse(raw);
      const validated = ZodLLMInsightsResponse.safeParse(parsed);
      if (!validated.success) throw new Error("AI response mismatch");
      return validated.data;
    } catch (e) {
      console.log(e);
      throw new Error("AI failed to provide valid insights");
    }
  },

  async LifetimeInsights(userId: string, range: AnalyticsRange) {
    const data = await AnalyticsService.getDashboardData(userId, range);

    if (data.isEmpty || data.lifetime.eventsSent === 0) {
      throw new ConflictError(
        "Send at least one event before generating analytics insights.",
      );
    }

    const rangeLabel =
      range === "30d"
        ? "last 30 days"
        : range === "90d"
          ? "last 90 days"
          : "all time";

    const topEngagedSummary = data.topEngaged
      .slice(0, 3)
      .map(
        (g) =>
          `${g.name ?? g.email} (${g.attendingCount} attended of ${g.invitedCount} invites)`,
      )
      .join("; ");

    const bestSlot = data.bestSendTimes[0];
    const bestSendTimeSummary = bestSlot
      ? `${bestSlot.dayLabel} ${bestSlot.hourLabel} (${bestSlot.responseRate}% from ${bestSlot.sampleSize} invites)`
      : "";

    const prompt = generateLifetimeAnalyticsPrompt({
      rangeLabel,
      eventsSent: data.lifetime.eventsSent,
      totalInvites: data.lifetime.totalInvites,
      responseRate: data.rates.responseRate,
      attendingRate: data.rates.attendingRate,
      openRate: data.rates.openRate,
      avgResponseHours: data.lifetime.avgResponseHours,
      trendCount: data.trend.length,
      trendRates: data.trend.map((p) => p.responseRate),
      topEngagedSummary,
      ghostersCount: data.ghosters.length,
      bestSendTimeSummary,
      recurringSeriesCount: data.series.length,
    });

    try {
      const raw = await llm(prompt);
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        console.error("[AI_PARSE_FAILURE]:", raw);
        throw new InternalServerError(
          "LLM returned an invalid analytics response.",
        );
      }
      const validated = ZodLifetimeAnalyticsResponse.safeParse(parsed);
      if (!validated.success) {
        console.error("[AI_SHAPE_FAILURE]:", validated.error.format());
        throw new InternalServerError(
          "LLM analytics response did not match the expected template.",
        );
      }
      return validated.data;
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "gemini response error") {
        throw new TimeoutError(
          "The LLM took too long to respond. please try again.",
        );
      }
      throw error;
    }
  },

  async pollBestSlot(
    pollId: string,
    userId: string,
  ): Promise<PollBestSlotInsight> {
    const summary = await PollService.pollSummaryForLlm(pollId, userId);
    if (!summary) {
      throw new ConflictError(
        "Wait for at least one response before picking the best slot.",
      );
    }

    const prompt = generatePollBestSlotPrompt({
      title: summary.title,
      inviteeCount: summary.inviteeCount,
      responseCount: summary.responseCount,
      options: summary.options.map((o) => ({
        id: o.id,
        iso: o.startAt,
        voteCount: o.voteCount,
      })),
    });

    const validIds = new Set(summary.options.map((o) => o.id));

    try {
      const raw = await llm(prompt);
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        console.error("[AI_PARSE_FAILURE]:", raw);
        throw new InternalServerError(
          "LLM returned an invalid best-slot response.",
        );
      }
      const validated = ZodPollBestSlotResponse.safeParse(parsed);
      if (!validated.success) {
        console.error("[AI_SHAPE_FAILURE]:", validated.error.format());
        throw new InternalServerError(
          "LLM best-slot response did not match the expected template.",
        );
      }

      if (!validIds.has(validated.data.optionId)) {
        const fallback = [...summary.options].sort(
          (a, b) => b.voteCount - a.voteCount,
        )[0];
        return {
          optionId: fallback.id,
          reason: `Most votes (${fallback.voteCount}/${summary.responseCount}).`,
          confidence: "low",
        };
      }
      return validated.data;
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "gemini response error") {
        throw new TimeoutError(
          "The LLM took too long to respond. please try again.",
        );
      }
      throw error;
    }
  },
};
