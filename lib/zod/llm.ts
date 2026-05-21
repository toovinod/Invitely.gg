import { z } from "zod";

export const ZodLLMOptimze = z.object({
  casualText: z.string().min(1).max(1000),
  eventName: z.string().min(1).max(100),
  eventDate: z.string().min(1),
  eventLocation: z.string().min(1).max(200),
  eventDesc: z.string().max(1000).optional().default(""),
});

export const ZodLLMOptimizeResponse = z.object({
  subject: z.string(),
  body: z.string(),
});

export const ZodLLMSmartSendTime = z.object({
  eventName: z.string().min(1).max(100),
  eventDate: z.string().min(1),
  eventLocation: z.string().min(1).max(200),
  eventDesc: z.string().max(1000).optional().default(""),
});

export const ZodLLMSmartSendTimeResponse = z.object({
  suggestedAt: z.string().datetime(),
  dayLabel: z.string(),
  timeLabel: z.string(),
  reason: z.string(),
});

export const ZodLLMInsights = z.object({
  eventId: z.string().min(1),
});

export const ZodLLMInsightsResponse = z.object({
  summary: z.string(),
  responseRate: z.number(),
  topInsight: z.string(),
  suggestion: z.string(),
  urgency: z.enum(["low", "medium", "high"]),
});

export const ZodLifetimeAnalytics = z.object({
  range: z.enum(["30d", "90d", "all"]).optional().default("all"),
});

export const ZodLifetimeAnalyticsResponse = z.object({
  summary: z.string(),
  topInsight: z.string(),
  recommendation: z.string(),
  trend: z.enum(["improving", "stable", "declining"]),
});
