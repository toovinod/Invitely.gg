// buildInsightsPrompt
export function generateRsvpInsightsPrompt(data: {
  eventName: string;
  eventDate: string;
  daysUntilEvent: number;
  totalInvited: number;
  attending: number;
  maybe: number;
  declined: number;
  pending: number;
  openedNotResponded: number;
  responseRate: number;
  avgResponseHours: number | null;
}): string {
  return `
You are an expert event analytics assistant helping an organiser understand their RSVP situation.

Event: ${data.eventName}
Event Date: ${data.eventDate}
Days Until Event: ${data.daysUntilEvent} day${data.daysUntilEvent === 1 ? "" : "s"}

RSVP Breakdown:
- Total Invited: ${data.totalInvited}
- Attending: ${data.attending}
- Maybe: ${data.maybe}
- Declined: ${data.declined}
- Pending (no response): ${data.pending}
- Opened email but not responded: ${data.openedNotResponded}
- Response Rate: ${data.responseRate}%
- Average Response Time: ${data.avgResponseHours !== null ? `${data.avgResponseHours} hours after receiving` : "not available"}

Your job:
Analyse this data and return insights that are specific, direct, and actionable. Use the numbers. Reference the days until event. Consider urgency based on how soon the event is.

Urgency rules:
- If daysUntilEvent <= 2: urgency is "high"
- If daysUntilEvent <= 7: urgency is "medium"
- If daysUntilEvent > 7: urgency is "low"

Field rules:
- summary: exactly 2 sentences. Sentence 1 states the response situation with specific numbers. Sentence 2 interprets what it means given the time remaining.
- topInsight: the single sharpest observation. Must reference actual numbers. BAD: "Response rate is low." GOOD: "12 guests opened the email but haven't responded — they are the easiest wins."
- suggestion: one concrete next step the organiser can take TODAY. Must be specific. BAD: "Send a reminder." GOOD: "Send a personal follow-up to the 12 guests who opened but haven't responded."
- urgency: "low", "medium", or "high" based on days until event and pending count
- responseRate: return exactly ${data.responseRate} — do not change this number

Return ONLY valid JSON, no markdown, no backticks, no explanation.

Return exactly this JSON shape:
{
  "summary": "2 sentence situation overview with specific numbers",
  "responseRate": ${data.responseRate},
  "topInsight": "sharpest observation referencing actual numbers",
  "suggestion": "one concrete actionable next step for today",
  "urgency": "low" | "medium" | "high"
}
`.trim();
}

// buildLifetimeAnalyticsPrompt
export interface LifetimeAnalyticsPromptData {
  rangeLabel: string;
  eventsSent: number;
  totalInvites: number;
  responseRate: number;
  attendingRate: number;
  openRate: number;
  avgResponseHours: number | null;
  trendCount: number;
  trendRates: number[];
  topEngagedSummary: string;
  ghostersCount: number;
  bestSendTimeSummary: string;
  recurringSeriesCount: number;
}

export function generateLifetimeAnalyticsPrompt(
  data: LifetimeAnalyticsPromptData,
): string {
  const trendDirection =
    data.trendRates.length < 2
      ? "not enough data"
      : data.trendRates[data.trendRates.length - 1] > data.trendRates[0] + 5
        ? "improving"
        : data.trendRates[data.trendRates.length - 1] < data.trendRates[0] - 5
          ? "declining"
          : "stable";

  return `
You are a senior event analytics consultant reviewing a user's lifetime invitation history on Invitely.gg.

Time range: ${data.rangeLabel}

Lifetime stats:
- Events sent: ${data.eventsSent}
- Invitations sent: ${data.totalInvites}
- Response rate: ${data.responseRate}%
- Attending rate (of those who replied): ${data.attendingRate}%
- Open rate: ${data.openRate}%
- Avg response time: ${data.avgResponseHours !== null ? `${data.avgResponseHours} hours` : "not available"}
- Recurring series active: ${data.recurringSeriesCount}
- Ghosters (invited 2+ times, never responded): ${data.ghostersCount}

Response-rate trend across the last ${data.trendCount} sent events: ${data.trendRates.join(", ")}%
Observed direction: ${trendDirection}

Top engaged guests: ${data.topEngagedSummary || "none yet"}
Best performing send slot: ${data.bestSendTimeSummary || "insufficient data"}

Your job:
Write an executive-level summary in three fields. Be specific. Use the actual numbers above. Avoid generic platitudes.

Field rules:
- summary: 2 to 3 sentences. Lead with the headline number. Mention the direction of the trend if it's not stable.
- topInsight: ONE sharp observation referencing actual numbers. BAD: "You have a good response rate." GOOD: "Your last 4 events averaged 78% response rate, up from 60% earlier in the period."
- recommendation: ONE concrete action the user could take this week. Reference a specific guest cohort, send slot, or series when possible.
- trend: "improving" | "stable" | "declining". Mirror the observed direction unless the numbers contradict it.

Return ONLY valid JSON, no markdown, no backticks:
{
  "summary": "2-3 sentences with specific numbers",
  "topInsight": "sharp observation referencing actual numbers",
  "recommendation": "one concrete action for this week",
  "trend": "improving" | "stable" | "declining"
}
`.trim();
}
