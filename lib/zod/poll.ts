import { POLL_LIMITS } from "@/lib/polls/types";
import { z } from "zod";

export const ZodPollOption = z.object({
  startAt: z.string().datetime(),
  endAt: z.string().datetime().optional().nullable(),
});

export const ZodPollInvitee = z.object({
  email: z.string().email().max(254),
  name: z.string().min(1).max(100).optional().nullable(),
});

export const ZodCreatePoll = z
  .object({
    title: z.string().min(1, "Title is required").max(150),
    description: z.string().max(1000).optional().nullable(),
    location: z.string().max(200).optional().nullable(),
    closesAt: z.string().datetime().optional().nullable(),
    options: z
      .array(ZodPollOption)
      .min(POLL_LIMITS.MIN_OPTIONS, "Add at least 2 time slots")
      .max(POLL_LIMITS.MAX_OPTIONS),
    invitees: z
      .array(ZodPollInvitee)
      .min(1, "Invite at least one person")
      .max(POLL_LIMITS.MAX_INVITEES),
  })
  .refine(
    (value) => {
      const seen = new Set<string>();
      for (const inv of value.invitees) {
        const lower = inv.email.toLowerCase();
        if (seen.has(lower)) return false;
        seen.add(lower);
      }
      return true;
    },
    { message: "Duplicate emails in invitee list", path: ["invitees"] },
  )
  .refine(
    (value) => {
      const seen = new Set<string>();
      for (const opt of value.options) {
        const key = `${opt.startAt}|${opt.endAt ?? ""}`;
        if (seen.has(key)) return false;
        seen.add(key);
      }
      return true;
    },
    { message: "Duplicate time slots", path: ["options"] },
  );

export const ZodPollVote = z.object({
  optionIds: z.array(z.string().uuid()).max(POLL_LIMITS.MAX_OPTIONS),
  name: z.string().min(1).max(100).optional().nullable(),
});

export const ZodFinalizePoll = z.object({
  optionId: z.string().uuid(),
});

export const ZodPollBestSlot = z.object({
  pollId: z.string().uuid(),
});

export const ZodPollBestSlotResponse = z.object({
  optionId: z.string(),
  reason: z.string(),
  confidence: z.enum(["low", "medium", "high"]),
});
