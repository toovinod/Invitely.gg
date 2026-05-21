import { CalendarService } from "@/lib/validations/validate-calendar";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";

export async function GET() {
  try {
    const session = await requireSession();
    const record = await CalendarService.getOrCreateFeedToken(session.user.id);
    return InvitelyResponse(200, "feed token ready", { token: record.token });
  } catch (e) {
    return InvitelyError(e);
  }
}

export async function PUT() {
  try {
    const session = await requireSession();
    const record = await CalendarService.regenerateFeedToken(session.user.id);
    return InvitelyResponse(200, "feed token regenerated", {
      token: record.token,
    });
  } catch (e) {
    return InvitelyError(e);
  }
}

export async function DELETE() {
  try {
    const session = await requireSession();
    await CalendarService.revokeFeedToken(session.user.id);
    return InvitelyResponse(200, "feed token revoked");
  } catch (e) {
    return InvitelyError(e);
  }
}
