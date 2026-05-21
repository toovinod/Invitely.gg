import { validateRequest } from "@/lib/validations/validate-request";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { PollService } from "@/lib/validations/validate-poll";
import { PollTokenParams } from "@/lib/polls/types";
import { ZodPollVote } from "@/lib/zod/poll";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: PollTokenParams) {
  try {
    const { token } = await params;
    const body = await req.json();
    const data = validateRequest(ZodPollVote, body);
    const result = await PollService.submitVote(token, data);
    return InvitelyResponse(200, "Votes saved", result);
  } catch (e) {
    return InvitelyError(e);
  }
}
