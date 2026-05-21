import { LifetimeStats, RateStats } from "@/lib/analytics/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
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
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs">
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
    <Card className="@container/card">
      <CardHeader>
        <CardDescription className="font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5">
          <Icon className="h-3 w-3" />
          {spec.title}
        </CardDescription>
        <CardTitle className="font-mono text-2xl font-semibold tabular-nums @[180px]/card:text-2xl">
          {spec.value}
        </CardTitle>
        <CardAction>
          <Badge
            variant="outline"
            className={`font-mono text-[10px] tabular-nums gap-1 ${trendStyle.badgeClass}`}
          >
            <TrendIcon className="h-3 w-3" />
            {spec.trendLabel}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 border-t-0 p-0 px-4">
        <div className="font-mono text-xs text-foreground line-clamp-1 flex items-center gap-1.5">
          {spec.description}
          <TrendIcon
            className={`h-3 w-3 shrink-0 ${trendStyle.textClass}`}
            aria-hidden="true"
          />
        </div>
        <div className="font-mono text-[10px] text-muted-foreground">
          {spec.hint}
        </div>
      </CardFooter>
    </Card>
  );
}

const trendStyles: Record<
  Trend,
  {
    icon: typeof TrendingUp;
    badgeClass: string;
    textClass: string;
  }
> = {
  up: {
    icon: TrendingUp,
    badgeClass: "border-green-500/20 text-green-500 bg-green-500/5",
    textClass: "text-green-500",
  },
  down: {
    icon: TrendingDown,
    badgeClass: "border-destructive/20 text-destructive bg-destructive/5",
    textClass: "text-destructive",
  },
  flat: {
    icon: Minus,
    badgeClass: "border-border text-muted-foreground bg-muted/20",
    textClass: "text-muted-foreground",
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
