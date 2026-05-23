import { Calendar, MapPin, Users, CheckCircle2 } from "lucide-react";
import { PollListItem } from "@/lib/polls/types";
import Link from "next/link";

interface PollCardProps {
  poll: PollListItem;
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "default" | "success" | "destructive";
}) {
  const className =
    tone === "destructive"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : tone === "success"
        ? "border-sky-400/25 bg-sky-400/10 text-sky-400"
        : "border-white/15 bg-white/6 text-foreground";
  return (
    <span
      className={`inline-flex items-center gap-1 border px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}

export function PollCard({ poll }: PollCardProps) {
  const responseRate =
    poll.inviteeCount === 0
      ? 0
      : Math.round((poll.responseCount / poll.inviteeCount) * 100);

  const tone: "default" | "success" | "destructive" =
    poll.status === "finalized"
      ? "success"
      : poll.status === "cancelled"
        ? "destructive"
        : "default";

  const statusLabel =
    poll.status === "finalized"
      ? "finalised"
      : poll.status === "cancelled"
        ? "cancelled"
        : "open";

  const isCancelled = poll.status === "cancelled";

  return (
    <div
      className={`group relative flex flex-col overflow-hidden border border-white/8 bg-white/2 transition-all duration-300 hover:border-white/15 hover:bg-white/4 ${
        isCancelled ? "opacity-60" : ""
      }`}
    >
      <div className="relative flex items-start justify-between gap-2 px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <StatusPill label={statusLabel} tone={tone} />
          </div>

          <Link href={`/polls/${poll.id}`} className="min-w-0">
            <h3 className="font-sans text-base font-semibold tracking-tight text-foreground truncate group-hover:underline underline-offset-4 decoration-white/30">
              {poll.title}
            </h3>
          </Link>
        </div>
      </div>

      <Link
        href={`/polls/${poll.id}`}
        className="relative block flex-1 cursor-pointer"
      >
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            {poll.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                <span className="font-sans text-xs text-muted-foreground truncate">
                  {poll.location}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {poll.optionCount} time slot
                {poll.optionCount === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/6 pt-3">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span className="font-mono text-xs text-foreground tabular-nums">
                {poll.responseCount}/{poll.inviteeCount} responded
              </span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
              {responseRate}%
            </span>
          </div>

          {poll.status === "finalized" && (
            <div className="flex items-center gap-2 text-sky-400">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span className="font-sans text-xs">
                Locked &amp; event created
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
