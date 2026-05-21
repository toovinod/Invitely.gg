import { validateRequest } from "@/lib/validations/validate-request";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { PollService } from "@/lib/validations/validate-poll";
import { PollEmailService } from "@/lib/resend/poll";
import { PollIdParams } from "@/lib/polls/types";
import { ZodFinalizePoll } from "@/lib/zod/poll";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: PollIdParams) {
  try {
    const session = await requireSession();
    const { pollId } = await params;
    const body = await req.json();
    const data = validateRequest(ZodFinalizePoll, body);

    const { event, invitations } = await PollService.finalizePoll(
      pollId,
      session.user.id,
      data.optionId,
    );

    const emailResult = await PollEmailService.sendFinalizedEventInvites({
      event: {
        name: event.name,
        eventAt: event.eventAt,
        location: event.location,
        emailSubject: event.emailSubject,
        emailBody: event.emailBody,
      },
      invitations: invitations.map((inv) => ({
        email: inv.email,
        name: inv.name,
        token: inv.token,
        personalizedOpening: inv.personalizedOpening,
      })),
      organizer: {
        name: session.user.name,
        email: session.user.email,
      },
    });

    return InvitelyResponse(201, "Slot locked & invites sent", {
      eventId: event.id,
      email: emailResult,
    });
  } catch (e) {
    return InvitelyError(e);
  }
}
