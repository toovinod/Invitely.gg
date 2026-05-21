import { ANALYTICS_RANGES, AnalyticsRange } from "@/lib/analytics/types";
import { AnalyticsService } from "@/lib/validations/validate-analytics";
import { requireSession } from "@/lib/auth/server/require-session";
import { isInvitelyApiError } from "@/lib/shared/base";
import { NextRequest, NextResponse } from "next/server";

function csvEscape(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const needsQuotes = /[",\n\r]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

function toIsoOrEmpty(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString();
}

function parseRange(value: string | null): AnalyticsRange {
  if (!value) return "all";
  return (ANALYTICS_RANGES as readonly string[]).includes(value)
    ? (value as AnalyticsRange)
    : "all";
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    const range = parseRange(req.nextUrl.searchParams.get("range"));
    const rows = await AnalyticsService.fetchInvitationsForExport(
      session.user.id,
      range,
    );

    const header = [
      "event_name",
      "event_date",
      "event_location",
      "event_status",
      "event_recurrence",
      "event_sent_at",
      "guest_name",
      "guest_email",
      "rsvp_status",
      "invitation_sent_at",
      "opened_at",
      "responded_at",
    ].join(",");

    const lines: string[] = [header];
    for (const row of rows) {
      lines.push(
        [
          csvEscape(row.event.name),
          toIsoOrEmpty(row.event.eventAt),
          csvEscape(row.event.location),
          row.event.status,
          row.event.recurrence ?? "",
          toIsoOrEmpty(row.event.sentAt),
          csvEscape(row.name),
          csvEscape(row.email),
          row.status,
          toIsoOrEmpty(row.sentAt),
          toIsoOrEmpty(row.openedAt),
          toIsoOrEmpty(row.respondedAt),
        ].join(","),
      );
    }

    const csv = lines.join("\r\n") + "\r\n";
    const filename = `invitely-analytics-${range}-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    // Browsers download the response directly keep error bodies plain text.
    const status = isInvitelyApiError(e) ? e.statusCode : 500;
    const message = isInvitelyApiError(e) ? e.message : "internal server error";
    console.error("[Invitely_Analytics_Export_Error]", e);
    return new NextResponse(message, {
      status,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
