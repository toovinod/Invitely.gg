const DEFAULT_DURATION_MINUTES = 120;

function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let i = 0;
  while (i < line.length) {
    chunks.push(i === 0 ? line.slice(i, i + 75) : ` ${line.slice(i, i + 74)}`);
    i += i === 0 ? 75 : 74;
  }
  return chunks.join("\r\n");
}

function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function toIcsUtc(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

function toRrule(recurrence: "weekly" | "monthly" | "annually"): string {
  switch (recurrence) {
    case "weekly":
      return "RRULE:FREQ=WEEKLY";
    case "monthly":
      return "RRULE:FREQ=MONTHLY";
    case "annually":
      return "RRULE:FREQ=YEARLY";
  }
}

interface BuildIcsParams {
  events: IcsEventInput[];
  description: string;
  appUrl: string;
}

interface IcsEventInput {
  id: string;
  name: string;
  desc: string;
  location: string;
  eventAt: Date;
  recurrence: "weekly" | "monthly" | "annually" | null;
  parentEventId: string | null;
  status: "active" | "cancelled" | "scheduled";
}

export function buildIcs(params: BuildIcsParams): string {
  const { events, description, appUrl } = params;
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Invitely.gg//Calendar Feed//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Invitely.gg",
    `X-WR-CALDESC:${escapeText(description)}`,
  ];

  const now = new Date();
  const dtstamp = toIcsUtc(now);

  for (const event of events) {
    // Skip materialised recurring children when their parent is in the feed
    // and carries an RRULE. The parent's RRULE already represents them.
    if (event.parentEventId) continue;

    const start = new Date(event.eventAt);
    const end = new Date(start.getTime() + DEFAULT_DURATION_MINUTES * 60_000);
    const url = `${appUrl}/events/${event.id}`;

    const eventLines = [
      "BEGIN:VEVENT",
      `UID:${event.id}@invitely.gg`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${toIcsUtc(start)}`,
      `DTEND:${toIcsUtc(end)}`,
      `SUMMARY:${escapeText(event.name)}`,
      `LOCATION:${escapeText(event.location)}`,
      `DESCRIPTION:${escapeText(event.desc)}`,
      `URL:${url}`,
      `STATUS:${event.status === "cancelled" ? "CANCELLED" : "CONFIRMED"}`,
    ];

    if (event.recurrence) {
      eventLines.push(toRrule(event.recurrence));
    }

    eventLines.push("END:VEVENT");
    for (const line of eventLines) {
      lines.push(foldLine(line));
    }
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
