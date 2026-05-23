import { RecurringSeriesStats } from "@/lib/analytics/types";
import Link from "next/link";
import {
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Minus,
  Repeat,
} from "lucide-react";

interface RecurringSeriesCardProps {
  series: RecurringSeriesStats[];
}

type Trend = "up" | "down" | "flat";

function getTrend(counts: number[]): Trend {
  if (counts.length < 2) return "flat";
  const last = counts[counts.length - 1];
  const prior = counts.slice(0, -1);
  const priorAvg = prior.reduce((acc, x) => acc + x, 0) / prior.length;
  if (priorAvg === 0) return last > 0 ? "up" : "flat";
  const delta = (last - priorAvg) / priorAvg;
  if (delta > 0.1) return "up";
  if (delta < -0.1) return "down";
  return "flat";
}

const trendStyles: Record<
  Trend,
  { icon: typeof TrendingUp; pillClass: string; label: string }
> = {
  up: {
    icon: TrendingUp,
    pillClass: "border-sky-400/25 bg-sky-400/10 text-sky-400",
    label: "Up",
  },
  down: {
    icon: TrendingDown,
    pillClass: "border-destructive/30 bg-destructive/10 text-destructive",
    label: "Down",
  },
  flat: {
    icon: Minus,
    pillClass: "border-white/8 bg-white/3 text-muted-foreground",
    label: "Flat",
  },
};

export function RecurringSeriesCard({ series }: RecurringSeriesCardProps) {
  return (
    <div className="relative overflow-hidden border border-white/8 bg-white/2 flex flex-col">
      <div className="flex items-start justify-between gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-3.5 border-b border-white/6">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-sans text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
            Recurring series
          </h3>
          <p className="font-sans text-sm text-muted-foreground">
            {series.length === 0
              ? "Track attendance trends across your repeating events"
              : `${series.length} active series · attendance trend per occurrence`}
          </p>
        </div>
      </div>

      {series.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2 px-4">
          <p className="font-sans text-sm text-muted-foreground text-center max-w-sm leading-relaxed">
            No recurring events yet. Set a recurrence on any event to track its
            attendance over time.
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {series.map((s) => {
            const trend = getTrend(s.recentAttendingCounts);
            const trendStyle = trendStyles[trend];
            const TrendIcon = trendStyle.icon;
            const avgAttending =
              s.occurrenceCount === 0
                ? 0
                : Math.round((s.totalAttending / s.occurrenceCount) * 10) / 10;

            return (
              <div
                key={s.parentEventId}
                className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-white/6 last:border-b-0 hover:bg-white/3 transition-colors"
              >
                <div className="flex flex-col min-w-0 flex-1 gap-1">
                  <Link
                    href={`/events/${s.parentEventId}`}
                    className="font-sans text-sm text-foreground hover:underline underline-offset-4 truncate flex items-center gap-1.5 font-medium"
                  >
                    {s.seriesName}
                    <RefreshCw className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                  </Link>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 border border-white/8 bg-white/3 text-muted-foreground px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide">
                      {s.recurrence}
                    </span>
                    <span className="inline-flex items-center gap-1 border border-white/8 bg-white/3 text-muted-foreground px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide tabular-nums">
                      {s.occurrenceCount} sent
                    </span>
                  </div>
                </div>

                <Sparkline counts={s.recentAttendingCounts} />

                <div className="hidden sm:flex flex-col items-end shrink-0 w-16">
                  <span className="font-mono text-base font-semibold tabular-nums text-foreground leading-none">
                    {avgAttending}
                  </span>
                  <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
                    avg going
                  </span>
                </div>

                <span
                  className={`inline-flex items-center gap-1 border px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide ${trendStyle.pillClass}`}
                >
                  <TrendIcon className="h-3 w-3" />
                  {trendStyle.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Sparkline({ counts }: { counts: number[] }) {
  if (counts.length === 0) {
    return <div className="w-20 h-7" />;
  }
  const max = Math.max(...counts, 1);
  return (
    <div
      className="hidden sm:flex items-end gap-px h-7 w-20 shrink-0"
      aria-hidden="true"
    >
      {counts.map((count, i) => {
        const heightPct = Math.max(12, Math.round((count / max) * 100));
        return (
          <div
            key={i}
            className="flex-1 bg-foreground/60 min-h-1"
            style={{ height: `${heightPct}%` }}
          />
        );
      })}
    </div>
  );
}
