import { validateRequest } from "@/lib/validations/validate-request";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { PollService } from "@/lib/validations/validate-poll";
import { PollEmailService } from "@/lib/resend/poll";
import { ZodCreatePoll } from "@/lib/zod/poll";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const session = await requireSession();
    const polls = await PollService.userPolls(session.user.id);
    return InvitelyResponse(200, "Polls fetched successfully", polls);
  } catch (e) {
    return InvitelyError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const data = validateRequest(ZodCreatePoll, body);
    const poll = await PollService.createPoll(session.user.id, data);

    const emailResult = await PollEmailService.sendPollInvites({
      poll: {
        title: poll.title,
        location: poll.location,
        description: poll.description,
        closesAt: poll.closesAt,
      },
      options: poll.options.map((o) => ({
        startAt: o.startAt,
        endAt: o.endAt,
      })),
      recipients: poll.invitees.map((i) => ({
        email: i.email,
        name: i.name,
        token: i.token,
      })),
      organizer: {
        name: session.user.name,
        email: session.user.email,
      },
    });

    return InvitelyResponse(201, "Poll created successfully", {
      poll: {
        id: poll.id,
        title: poll.title,
        status: poll.status,
      },
      email: emailResult,
    });
  } catch (e) {
    return InvitelyError(e);
  }
}
