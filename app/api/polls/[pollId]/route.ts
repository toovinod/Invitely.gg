import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { PollService } from "@/lib/validations/validate-poll";
import { PollIdParams } from "@/lib/polls/types";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest, { params }: PollIdParams) {
  try {
    const session = await requireSession();
    const { pollId } = await params;
    const detail = await PollService.pollDetail(pollId, session.user.id);
    return InvitelyResponse(200, "Poll fetched successfully", detail);
  } catch (e) {
    return InvitelyError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: PollIdParams) {
  try {
    const session = await requireSession();
    const { pollId } = await params;
    await PollService.deletePoll(pollId, session.user.id);
    return InvitelyResponse(200, "Poll deleted successfully");
  } catch (e) {
    return InvitelyError(e);
  }
}
