import { validateRequest } from "@/lib/validations/validate-request";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { requireSession } from "@/lib/auth/server/require-session";
import { LLMService } from "@/lib/validations/validate-llm";
import { ZodLifetimeAnalytics } from "@/lib/zod/llm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json().catch(() => ({}));
    const { range } = validateRequest(ZodLifetimeAnalytics, body);
    const insights = await LLMService.LifetimeInsights(session.user.id, range);
    return InvitelyResponse(200, "Insights generated successfully", {
      insights,
    });
  } catch (e) {
    return InvitelyError(e);
  }
}
