import { validateRequest } from "@/lib/validations/validate-request";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { requireSession } from "@/lib/auth/server/require-session";
import { LLMService } from "@/lib/validations/validate-llm";
import { ZodPollBestSlot } from "@/lib/zod/poll";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const { pollId } = validateRequest(ZodPollBestSlot, body);
    const insight = await LLMService.pollBestSlot(pollId, session.user.id);
    return InvitelyResponse(200, "Best slot identified", { insight });
  } catch (e) {
    return InvitelyError(e);
  }
}
