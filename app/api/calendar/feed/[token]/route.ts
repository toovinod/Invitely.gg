import { CalendarService } from "@/lib/validations/validate-calendar";
import { CalendarTokenParams } from "@/lib/calendar/types";
import { isInvitelyApiError } from "@/lib/shared/base";
import { buildIcs } from "@/lib/calendar/ics";
import { NextResponse } from "next/server";

const CACHE_SECONDS = 900;

export async function GET(_req: Request, { params }: CalendarTokenParams) {
  try {
    const { token: raw } = await params;
    const token = raw.endsWith(".ics") ? raw.slice(0, -4) : raw;

    const feed = await CalendarService.resolveFeedToken(token);
    const events = await CalendarService.getFeedEvents(feed.user.id);
    const appUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "";

    const ics = buildIcs({
      events,
      description: `Invitely.gg events for ${feed.user.name}`,
      appUrl,
    });

    return new NextResponse(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'inline; filename="invitely.ics"',
        "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
      },
    });
  } catch (e) {
    const status = isInvitelyApiError(e) ? e.statusCode : 500;
    const message = isInvitelyApiError(e) ? e.message : "internal server error";
    console.error("[Invitely_Calendar_Feed_Error]", e);
    return new NextResponse(message, {
      status,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
