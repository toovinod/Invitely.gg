import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, MapPin, Users, CheckCircle2 } from "lucide-react";
import { PollListItem } from "@/lib/polls/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface PollCardProps {
  poll: PollListItem;
}

const statusBadge = {
  open: {
    label: "Open",
    className: "border-border bg-muted/30 text-foreground",
  },
  finalized: {
    label: "Finalized",
    className: "border-green-500/20 bg-green-500/5 text-green-500",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-destructive/20 bg-destructive/5 text-destructive",
  },
} as const;

export function PollCard({ poll }: PollCardProps) {
  const cfg = statusBadge[poll.status];
  const responseRate =
    poll.inviteeCount === 0
      ? 0
      : Math.round((poll.responseCount / poll.inviteeCount) * 100);

  return (
    <Card className="hover:border-foreground/30 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <Badge
              variant="outline"
              className={`font-mono text-[10px] w-fit ${cfg.className}`}
            >
              {cfg.label}
            </Badge>
            <Link
              href={`/polls/${poll.id}`}
              className="font-mono text-sm font-semibold text-foreground truncate hover:underline underline-offset-4"
            >
              {poll.title}
            </Link>
          </div>
        </div>
      </CardHeader>
      <Link href={`/polls/${poll.id}`}>
        <CardContent className="flex flex-col gap-2.5">
          {poll.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="font-mono text-xs text-muted-foreground truncate">
                {poll.location}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {poll.optionCount} time slot
              {poll.optionCount === 1 ? "" : "s"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="font-mono text-xs text-foreground tabular-nums">
                {poll.responseCount}/{poll.inviteeCount} responded
              </span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
              {responseRate}%
            </span>
          </div>
          {poll.status === "finalized" && (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="h-3 w-3 shrink-0" />
              <span className="font-mono text-[10px]">Locked & event created</span>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
