import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { PollService } from "@/lib/validations/validate-poll";
import { PollTokenParams } from "@/lib/polls/types";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest, { params }: PollTokenParams) {
  try {
    const { token } = await params;
    const view = await PollService.resolveByToken(token);
    return InvitelyResponse(200, "Poll loaded", view);
  } catch (e) {
    return InvitelyError(e);
  }
}
