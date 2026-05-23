import { TrendChart } from "@/components/analytics/trend-chart";
import { EventTrendPoint } from "@/lib/analytics/types";
import { LineChart } from "lucide-react";
import Link from "next/link";

interface TrendCardProps {
  points: EventTrendPoint[];
}

function formatShortDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function TrendCard({ points }: TrendCardProps) {
  return (
    <div className="relative overflow-hidden border border-white/8 bg-white/2 flex flex-col">
      <div className="flex items-start justify-between gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-3.5 border-b border-white/6">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-sans text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            <LineChart className="h-3.5 w-3.5 text-muted-foreground" />
            Response rate trend
          </h3>
          <p className="font-sans text-sm text-muted-foreground">
            {points.length === 0
              ? "No sent events yet — chart will populate once you send your first batch."
              : `Last ${points.length} delivered event${points.length === 1 ? "" : "s"} · % of guests who replied`}
          </p>
        </div>
      </div>

      <div className="px-2 sm:px-5 pt-4 pb-2">
        <TrendChart points={points} />
      </div>

      {points.length > 0 && (
        <div className="border-t border-white/6">
          <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 sm:gap-x-6 px-4 sm:px-5">
            <div className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground py-2.5 border-b border-white/6">
              Event
            </div>
            <div className="hidden sm:block font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground py-2.5 border-b border-white/6 text-right">
              Date
            </div>
            <div className="hidden sm:block font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground py-2.5 border-b border-white/6 text-right">
              Sent
            </div>
            <div className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground py-2.5 border-b border-white/6 text-right">
              Going
            </div>
            <div className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground py-2.5 border-b border-white/6 text-right">
              Rate
            </div>

            {[...points].reverse().map((p, idx, arr) => {
              const isLast = idx === arr.length - 1;
              const cellBase = `py-2.5 ${isLast ? "" : "border-b border-white/6"}`;
              return (
                <div key={p.eventId} className="contents group">
                  <div className={cellBase}>
                    <Link
                      href={`/events/${p.eventId}`}
                      className="font-sans text-sm text-foreground hover:underline underline-offset-4 truncate block max-w-[20ch] sm:max-w-[40ch]"
                    >
                      {p.eventName}
                    </Link>
                  </div>
                  <div
                    className={`hidden sm:flex items-center justify-end font-mono text-xs text-muted-foreground tabular-nums ${cellBase}`}
                  >
                    {formatShortDate(p.eventAt)}
                  </div>
                  <div
                    className={`hidden sm:flex items-center justify-end font-mono text-xs text-muted-foreground tabular-nums ${cellBase}`}
                  >
                    {p.total}
                  </div>
                  <div
                    className={`flex items-center justify-end font-mono text-xs text-foreground tabular-nums ${cellBase}`}
                  >
                    {p.attending}
                  </div>
                  <div
                    className={`flex items-center justify-end font-mono text-xs text-foreground tabular-nums ${cellBase}`}
                  >
                    {p.responseRate}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
