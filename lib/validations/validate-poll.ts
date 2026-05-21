import { ZodCreatePoll, ZodPollVote } from "../zod/poll";
import { Prisma } from "@prisma/client";
import { randomBytes } from "crypto";
import { db } from "../db/prisma";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../shared/exceptions";
import {
  PollDetail,
  PollListItem,
  PollOptionWithStats,
  PollPublicView,
  POLL_LIMITS,
} from "../polls/types";
import { z } from "zod";

type CreatePollDTO = z.infer<typeof ZodCreatePoll>;
type PollVoteDTO = z.infer<typeof ZodPollVote>;

export const PollService = {
  async ownedPoll(pollId: string, userId: string) {
    const poll = await db.poll.findUnique({ where: { id: pollId } });
    if (!poll) throw new NotFoundError("Poll not found");
    if (poll.userId !== userId) {
      throw new ForbiddenError("Only the poll owner can perform this action");
    }
    return poll;
  },

  async createPoll(userId: string, dto: CreatePollDTO) {
    const now = Date.now();
    const sortedOptions = [...dto.options].sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
    );

    const earliestSlot = new Date(sortedOptions[0].startAt);
    const earliestMs = earliestSlot.getTime();
    const minSlotMs =
      now + POLL_LIMITS.MIN_FIRST_SLOT_HOURS_AHEAD * 60 * 60 * 1000;

    if (earliestMs < minSlotMs) {
      throw new ValidationError(
        `Your earliest time slot must be at least ${POLL_LIMITS.MIN_FIRST_SLOT_HOURS_AHEAD} hours from now so guests have time to vote before voting auto-closes.`,
      );
    }

    if (sortedOptions.some((o) => new Date(o.startAt).getTime() <= now)) {
      throw new ValidationError("All time slots must be in the future");
    }

    // Auto-close = earliest slot - 12h. If the host set their own closesAt,
    // honour it but only if it's earlier than the auto value.
    const autoCloseAt = new Date(
      earliestMs -
        POLL_LIMITS.AUTO_CLOSE_HOURS_BEFORE_FIRST_SLOT * 60 * 60 * 1000,
    );
    const userCloseAt = dto.closesAt ? new Date(dto.closesAt) : null;
    if (userCloseAt && userCloseAt.getTime() <= now) {
      throw new ValidationError("Closes-at must be in the future");
    }
    const effectiveCloseAt =
      userCloseAt && userCloseAt.getTime() < autoCloseAt.getTime()
        ? userCloseAt
        : autoCloseAt;

    // Cheap per-user guardrail. Keeps abuse from blowing up the table.
    const total = await db.poll.count({ where: { userId } });
    if (total >= POLL_LIMITS.MAX_POLLS_PER_USER) {
      throw new ConflictError(
        `You have reached the limit of ${POLL_LIMITS.MAX_POLLS_PER_USER} polls`,
      );
    }

    return db.$transaction(async (tx) => {
      const poll = await tx.poll.create({
        data: {
          userId,
          title: dto.title.trim(),
          description: dto.description?.trim() ?? null,
          location: dto.location?.trim() ?? null,
          closesAt: effectiveCloseAt,
        },
      });

      await tx.pollOption.createMany({
        data: sortedOptions.map((opt) => ({
          pollId: poll.id,
          startAt: new Date(opt.startAt),
          endAt: opt.endAt ? new Date(opt.endAt) : null,
        })),
      });

      const inviteeData = dto.invitees.map((inv) => ({
        pollId: poll.id,
        email: inv.email.trim().toLowerCase(),
        name: inv.name?.trim() ?? null,
        token: randomBytes(32).toString("hex"),
      }));
      await tx.pollInvitee.createMany({ data: inviteeData });

      // Re-read with relations so the caller has a self-contained payload.
      const created = await tx.poll.findUnique({
        where: { id: poll.id },
        include: {
          options: { orderBy: { startAt: "asc" } },
          invitees: { orderBy: { createdAt: "asc" } },
        },
      });
      if (!created) throw new NotFoundError("Poll not found after create");
      return created;
    });
  },

  async userPolls(userId: string): Promise<PollListItem[]> {
    const polls = await db.poll.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { options: true, invitees: true },
        },
        invitees: {
          where: { respondedAt: { not: null } },
          select: { id: true },
        },
      },
    });
    return polls.map((p) => ({
      id: p.id,
      title: p.title,
      location: p.location,
      status: p.status,
      closesAt: p.closesAt,
      finalEventId: p.finalEventId,
      finalizedAt: p.finalizedAt,
      createdAt: p.createdAt,
      optionCount: p._count.options,
      inviteeCount: p._count.invitees,
      responseCount: p.invitees.length,
    }));
  },

  async pollDetail(pollId: string, userId: string): Promise<PollDetail> {
    const poll = await db.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          orderBy: { startAt: "asc" },
          include: {
            votes: {
              include: {
                invitee: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
        invitees: { orderBy: { createdAt: "asc" } },
        finalEvent: { select: { name: true } },
      },
    });
    if (!poll) throw new NotFoundError("Poll not found");
    if (poll.userId !== userId)
      throw new ForbiddenError("Only the poll owner can view this");

    const responseCount = poll.invitees.filter(
      (i) => i.respondedAt !== null,
    ).length;

    const options: PollOptionWithStats[] = poll.options.map((opt) => ({
      id: opt.id,
      startAt: opt.startAt,
      endAt: opt.endAt,
      voteCount: opt.votes.length,
      voters: opt.votes.map((v) => ({
        id: v.invitee.id,
        name: v.invitee.name,
        email: v.invitee.email,
      })),
    }));

    return {
      id: poll.id,
      userId: poll.userId,
      title: poll.title,
      description: poll.description,
      location: poll.location,
      status: poll.status,
      closesAt: poll.closesAt,
      finalEventId: poll.finalEventId,
      finalEventName: poll.finalEvent?.name ?? null,
      finalizedAt: poll.finalizedAt,
      createdAt: poll.createdAt,
      options,
      invitees: poll.invitees.map((i) => ({
        id: i.id,
        email: i.email,
        name: i.name,
        respondedAt: i.respondedAt,
      })),
      responseCount,
    };
  },

  async deletePoll(pollId: string, userId: string) {
    await this.ownedPoll(pollId, userId);
    await db.poll.delete({ where: { id: pollId } });
  },

  /**
   * Resolve a public-facing voting page from an invitee token. The token is
   * the only authentication — anyone with the URL can see the poll, by design,
   * matching the existing RSVP token model. Throws NotFound if the poll has
   * been cancelled (we don't show stale forms).
   */
  async resolveByToken(token: string): Promise<PollPublicView> {
    const invitee = await db.pollInvitee.findUnique({
      where: { token },
      include: {
        poll: {
          include: {
            user: { select: { name: true } },
            options: { orderBy: { startAt: "asc" } },
          },
        },
        votes: { select: { optionId: true } },
      },
    });
    if (!invitee) throw new NotFoundError("Invitation not found");
    if (invitee.poll.status === "cancelled") {
      throw new NotFoundError("This poll is no longer active");
    }

    return {
      id: invitee.poll.id,
      title: invitee.poll.title,
      description: invitee.poll.description,
      location: invitee.poll.location,
      closesAt: invitee.poll.closesAt,
      status: invitee.poll.status,
      organizerName: invitee.poll.user.name,
      options: invitee.poll.options.map((o) => ({
        id: o.id,
        startAt: o.startAt,
        endAt: o.endAt,
      })),
      invitee: {
        id: invitee.id,
        email: invitee.email,
        name: invitee.name,
        respondedAt: invitee.respondedAt,
      },
      votedOptionIds: invitee.votes.map((v) => v.optionId),
    };
  },

  async submitVote(token: string, dto: PollVoteDTO) {
    const invitee = await db.pollInvitee.findUnique({
      where: { token },
      include: { poll: { include: { options: { select: { id: true } } } } },
    });
    if (!invitee) throw new NotFoundError("Invitation not found");
    const { poll } = invitee;

    if (poll.status === "cancelled") {
      throw new ConflictError("This poll is no longer accepting votes");
    }
    if (poll.status === "finalized") {
      throw new ConflictError(
        "This poll has been finalised — voting is closed",
      );
    }
    if (poll.closesAt && new Date() > poll.closesAt) {
      throw new ConflictError("This poll has closed");
    }

    const validIds = new Set(poll.options.map((o) => o.id));
    const requested = Array.from(new Set(dto.optionIds));
    for (const id of requested) {
      if (!validIds.has(id)) {
        throw new BadRequestError(`Unknown option ${id}`);
      }
    }

    await db.$transaction(async (tx) => {
      await tx.pollVote.deleteMany({ where: { inviteeId: invitee.id } });
      if (requested.length > 0) {
        await tx.pollVote.createMany({
          data: requested.map((optionId) => ({
            optionId,
            inviteeId: invitee.id,
          })),
        });
      }
      await tx.pollInvitee.update({
        where: { id: invitee.id },
        data: {
          respondedAt: new Date(),
          ...(dto.name && !invitee.name ? { name: dto.name.trim() } : {}),
        },
      });
    });

    return { votedOptionCount: requested.length };
  },

  async finalizePoll(pollId: string, userId: string, optionId: string) {
    const poll = await db.poll.findUnique({
      where: { id: pollId },
      include: {
        options: { include: { votes: { select: { inviteeId: true } } } },
        invitees: true,
      },
    });
    if (!poll) throw new NotFoundError("Poll not found");
    if (poll.userId !== userId)
      throw new ForbiddenError("Only the poll owner can finalise");
    if (poll.status === "finalized") {
      throw new ConflictError("This poll has already been finalised");
    }
    if (poll.status === "cancelled") {
      throw new ConflictError("This poll has been cancelled");
    }

    const option = poll.options.find((o) => o.id === optionId);
    if (!option) {
      throw new BadRequestError("That option does not belong to this poll");
    }
    if (option.startAt.getTime() <= Date.now()) {
      throw new ValidationError("That time slot is in the past");
    }

    const yesVoterIds = new Set(option.votes.map((v) => v.inviteeId));
    const totalResponses = poll.invitees.filter(
      (i) => i.respondedAt !== null,
    ).length;
    const dayLabel = option.startAt.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    function openingFor(inviteeId: string): string {
      if (totalResponses === 0) {
        return `We're going with ${dayLabel} — hope you can make it.`;
      }
      if (yesVoterIds.has(inviteeId)) {
        return `You voted for this date — we're so glad it works for you!`;
      }
      return `${dayLabel} won the vote. We know it wasn't your top pick, but we'd love to have you there.`;
    }

    const now = new Date();

    const result = await db.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          userId,
          name: poll.title,
          desc: poll.description ?? `Finalised from poll: ${poll.title}`,
          eventAt: option.startAt,
          location: poll.location ?? "TBD",
          emailSubject: `You're invited: ${poll.title}`,
          emailBody:
            poll.description ??
            "Looking forward to seeing you. RSVP below — see you there!",
          sentAt: now,
        },
      });

      const invitationData = poll.invitees.map((inv) => ({
        eventId: event.id,
        email: inv.email,
        name: inv.name,
        token: randomBytes(32).toString("hex"),
        personalizedOpening: openingFor(inv.id),
      }));

      const invitations = await tx.invitation.createManyAndReturn({
        data: invitationData,
      });

      await tx.poll.update({
        where: { id: pollId },
        data: {
          finalEventId: event.id,
          status: "finalized",
          finalizedAt: now,
        },
      });

      return { event, invitations };
    });

    return result;
  },

  async pollSummaryForLlm(pollId: string, userId: string) {
    const detail = await this.pollDetail(pollId, userId);
    if (detail.responseCount === 0) return null;
    return {
      title: detail.title,
      inviteeCount: detail.invitees.length,
      responseCount: detail.responseCount,
      options: detail.options.map((o) => ({
        id: o.id,
        startAt: o.startAt.toISOString(),
        voteCount: o.voteCount,
      })),
    };
  },
};

/** Type guard for picking up Prisma duplicate-row errors at the route layer. */
export function isUniqueConstraintError(
  e: unknown,
): e is Prisma.PrismaClientKnownRequestError {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002"
  );
}
