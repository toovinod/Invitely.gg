import { LifetimeStats, RateStats } from "@/lib/analytics/types";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Mail,
  CheckCircle2,
  CalendarRange,
  Timer,
  Send,
} from "lucide-react";

interface LifetimeSummaryProps {
  lifetime: LifetimeStats;
  rates: RateStats;
}

type Trend = "up" | "down" | "flat";

interface CardSpec {
  title: string;
  value: string;
  icon: typeof TrendingUp;
  trend: Trend;
  trendLabel: string;
  description: string;
  hint: string;
}

export function LifetimeSummary({ lifetime, rates }: LifetimeSummaryProps) {
  const avgResponse =
    lifetime.avgResponseHours === null
      ? "—"
      : lifetime.avgResponseHours < 1
        ? `${Math.round(lifetime.avgResponseHours * 60)}m`
        : `${lifetime.avgResponseHours}h`;

  const cards: CardSpec[] = [
    {
      title: "Events sent",
      value: String(lifetime.eventsSent),
      icon: CalendarRange,
      trend: lifetime.eventsSent > 0 ? "up" : "flat",
      trendLabel: `${lifetime.totalEvents} total`,
      description:
        lifetime.eventsSent === 0
          ? "No events sent yet"
          : "Events delivered to guests",
      hint: `${lifetime.totalEvents - lifetime.eventsSent} draft / scheduled`,
    },
    {
      title: "Invites sent",
      value: lifetime.totalInvites.toLocaleString(),
      icon: Mail,
      trend: lifetime.totalInvites > 0 ? "up" : "flat",
      trendLabel: `${lifetime.totalResponses} replied`,
      description: `${lifetime.totalAttending} attending · ${lifetime.totalDeclined} declined`,
      hint: `${lifetime.totalPending} pending response`,
    },
    {
      title: "Response rate",
      value: `${rates.responseRate}%`,
      icon: Send,
      trend: judgeRate(rates.responseRate, 60, 30),
      trendLabel: `${lifetime.totalResponses}/${lifetime.totalInvites}`,
      description: rateLabel(rates.responseRate),
      hint: "of invitations received a reply",
    },
    {
      title: "Attending rate",
      value: `${rates.attendingRate}%`,
      icon: CheckCircle2,
      trend: judgeRate(rates.attendingRate, 70, 40),
      trendLabel: `${lifetime.totalAttending} going`,
      description:
        lifetime.totalResponses === 0
          ? "Awaiting first responses"
          : "Of those who replied",
      hint: `${lifetime.totalMaybe} maybe · ${lifetime.totalDeclined} declined`,
    },
    {
      title: "Avg response",
      value: avgResponse,
      icon: Timer,
      trend:
        lifetime.avgResponseHours === null
          ? "flat"
          : lifetime.avgResponseHours <= 24
            ? "up"
            : lifetime.avgResponseHours <= 72
              ? "flat"
              : "down",
      trendLabel:
        lifetime.avgResponseHours === null
          ? "no data"
          : lifetime.avgResponseHours <= 24
            ? "Fast"
            : "Slow",
      description:
        lifetime.avgResponseHours === null
          ? "Send invitations to track this"
          : "Time from invite to first reply",
      hint: "Lower is better",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((spec) => (
        <SummaryTile key={spec.title} spec={spec} />
      ))}
    </div>
  );
}

function SummaryTile({ spec }: { spec: CardSpec }) {
  const trendStyle = trendStyles[spec.trend];
  const TrendIcon = trendStyle.icon;
  const Icon = spec.icon;

  return (
    <div className="relative overflow-hidden border border-white/8 bg-white/2 hover:border-white/15 hover:bg-white/4 transition-all duration-300 px-4 sm:px-5 py-4 sm:py-5 flex flex-col gap-4 min-h-40">
      {/* eyebrow */}
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-muted-foreground/80 shrink-0" />
        <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {spec.title}
        </span>
      </div>

      {/* big number */}
      <div className="flex items-end justify-between gap-2 -mt-1">
        <span className="font-mono text-3xl sm:text-[2rem] font-semibold tabular-nums tracking-tight text-foreground leading-none">
          {spec.value}
        </span>
        <span
          className={`inline-flex items-center gap-1 border px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide tabular-nums shrink-0 ${trendStyle.pillClass}`}
        >
          <TrendIcon className="h-3 w-3" />
          {spec.trendLabel}
        </span>
      </div>

      {/* description + hint */}
      <div className="flex flex-col gap-0.5 mt-auto">
        <p className="font-sans text-xs text-foreground line-clamp-1">
          {spec.description}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground tabular-nums line-clamp-1">
          {spec.hint}
        </p>
      </div>
    </div>
  );
}

const trendStyles: Record<
  Trend,
  {
    icon: typeof TrendingUp;
    pillClass: string;
  }
> = {
  up: {
    icon: TrendingUp,
    pillClass: "border-white/25 bg-white/10 text-foreground",
  },
  down: {
    icon: TrendingDown,
    pillClass: "border-destructive/30 bg-destructive/10 text-destructive",
  },
  flat: {
    icon: Minus,
    pillClass: "border-white/8 bg-white/3 text-muted-foreground",
  },
};

function judgeRate(value: number, goodAt: number, okAt: number): Trend {
  if (value >= goodAt) return "up";
  if (value >= okAt) return "flat";
  return "down";
}

function rateLabel(rate: number): string {
  if (rate >= 75) return "Excellent engagement";
  if (rate >= 50) return "Solid engagement";
  if (rate >= 25) return "Room to improve";
  return "Needs attention";
}
