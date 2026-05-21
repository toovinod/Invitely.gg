import { RecurringSeriesStats } from "@/lib/analytics/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  { icon: typeof TrendingUp; className: string; label: string }
> = {
  up: {
    icon: TrendingUp,
    className: "text-green-500 border-green-500/20 bg-green-500/5",
    label: "Up",
  },
  down: {
    icon: TrendingDown,
    className: "text-destructive border-destructive/20 bg-destructive/5",
    label: "Down",
  },
  flat: {
    icon: Minus,
    className: "text-muted-foreground border-border bg-muted/20",
    label: "Flat",
  },
};

export function RecurringSeriesCard({ series }: RecurringSeriesCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="font-mono text-sm flex items-center gap-2">
          <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
          Recurring series
        </CardTitle>
        <CardDescription className="font-mono text-xs">
          {series.length === 0
            ? "Track attendance trends across your repeating events"
            : `${series.length} active series · attendance trend per occurrence`}
        </CardDescription>
      </CardHeader>

      {series.length === 0 ? (
        <CardContent className="flex flex-col items-center justify-center py-12 gap-2">
          <p className="font-mono text-xs text-muted-foreground text-center max-w-sm">
            No recurring events yet. Set a recurrence on any event to track its
            attendance over time.
          </p>
        </CardContent>
      ) : (
        <CardContent className="flex flex-col p-0">
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
                className="flex items-center gap-3 px-6 py-3 border-b last:border-b-0 hover:bg-muted/40 transition-colors"
              >
                <div className="flex flex-col min-w-0 flex-1 gap-1">
                  <Link
                    href={`/events/${s.parentEventId}`}
                    className="font-mono text-xs text-foreground hover:underline underline-offset-4 truncate flex items-center gap-1.5 font-medium"
                  >
                    {s.seriesName}
                    <RefreshCw className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                  </Link>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] h-4 px-1.5 capitalize"
                    >
                      {s.recurrence}
                    </Badge>
                    <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                      {s.occurrenceCount} sent
                    </span>
                  </div>
                </div>

                <Sparkline counts={s.recentAttendingCounts} />

                <div className="flex flex-col items-end shrink-0 w-16">
                  <span className="font-mono text-sm text-foreground tabular-nums font-medium">
                    {avgAttending}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    avg going
                  </span>
                </div>

                <Badge
                  variant="outline"
                  className={`font-mono text-[10px] gap-1 ${trendStyle.className}`}
                >
                  <TrendIcon className="h-3 w-3" />
                  {trendStyle.label}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}

function Sparkline({ counts }: { counts: number[] }) {
  if (counts.length === 0) {
    return <div className="w-16 h-6" />;
  }
  const max = Math.max(...counts, 1);
  return (
    <div
      className="hidden sm:flex items-end gap-0.5 h-6 w-16 shrink-0"
      aria-hidden="true"
    >
      {counts.map((count, i) => {
        const heightPct = Math.max(8, Math.round((count / max) * 100));
        return (
          <div
            key={i}
            className="flex-1 bg-foreground/70"
            style={{ height: `${heightPct}%` }}
          />
        );
      })}
    </div>
  );
}
