import { PollDeleteDialog } from "@/components/polls/poll-delete-dialog";
import { PollHostBoard } from "@/components/polls/poll-host-board";
import { PollService } from "@/lib/validations/validate-poll";
import { PollDetailSkeleton } from "@/components/skeletons";
import { getSession } from "@/lib/auth/client/get-session";
import { isInvitelyApiError } from "@/lib/shared/base";
import { Separator } from "@/components/ui/separator";
import { redirect, notFound } from "next/navigation";
import { PollIdParams } from "@/lib/polls/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
} from "lucide-react";

export async function generateMetadata({
  params,
}: PollIdParams): Promise<Metadata> {
  const { pollId } = await params;
  return { title: `Poll ${pollId.slice(0, 6)} | Invitely.gg` };
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

export default async function PollDetailPage({ params }: PollIdParams) {
  const { pollId } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <Suspense fallback={<PollDetailSkeleton />}>
      <PollDetailBody pollId={pollId} userId={session.user.id} />
    </Suspense>
  );
}

interface PollDetailBodyProps {
  pollId: string;
  userId: string;
}

async function PollDetailBody({ pollId, userId }: PollDetailBodyProps) {
  let detail;
  try {
    detail = await PollService.pollDetail(pollId, userId);
  } catch (e) {
    if (isInvitelyApiError(e)) notFound();
    throw e;
  }

  const cfg = statusBadge[detail.status];
  const isOpen = detail.status === "open";
  const responseRate =
    detail.invitees.length === 0
      ? 0
      : Math.round((detail.responseCount / detail.invitees.length) * 100);

  return (
    <div className="flex flex-col gap-6">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="font-mono text-xs gap-1.5 -ml-2 h-7 w-fit text-muted-foreground hover:text-foreground rounded-none"
      >
        <Link href="/polls">
          <ArrowLeft className="h-3 w-3" />
          All polls
        </Link>
      </Button>

      {detail.status === "finalized" && detail.finalEventId && (
        <div className="border border-green-500/20 bg-green-500/5 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <p className="font-mono text-xs font-semibold text-green-500">
                Locked in — event created
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                {detail.finalEventName ?? "Your event"} is ready to send.
              </p>
            </div>
          </div>
          <Link
            href={`/events/${detail.finalEventId}/send-invitations`}
            className="shrink-0"
          >
            <Button
              size="sm"
              className="font-mono text-xs h-8 gap-2 rounded-none"
            >
              <CalendarCheck className="h-3 w-3" />
              Open event
            </Button>
          </Link>
        </div>
      )}

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <Badge
            variant="outline"
            className={`font-mono text-[10px] w-fit ${cfg.className}`}
          >
            {cfg.label}
          </Badge>
          <h1 className="font-mono text-base font-semibold text-foreground">
            {detail.title}
          </h1>
          {detail.description && (
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              {detail.description}
            </p>
          )}

          <div className="flex flex-col gap-1.5 pt-1">
            {detail.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="font-mono text-xs text-muted-foreground">
                  {detail.location}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {detail.responseCount}/{detail.invitees.length} responded ·{" "}
                {responseRate}%
              </span>
            </div>
            {detail.closesAt && (
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="font-mono text-xs text-muted-foreground">
                  Closes{" "}
                  {new Date(detail.closesAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <PollDeleteDialog pollId={detail.id} pollTitle={detail.title} />
        </div>
      </div>

      <Separator className="bg-border" />

      <PollHostBoard
        pollId={detail.id}
        options={detail.options}
        inviteeCount={detail.invitees.length}
        responseCount={detail.responseCount}
        isOpen={isOpen}
      />

      <Separator className="bg-border" />

      <section className="flex flex-col gap-3">
        <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Invitees · {detail.invitees.length}
        </h2>
        <div className="border border-border divide-y divide-border">
          {detail.invitees.map((inv) => {
            const responded = inv.respondedAt !== null;
            return (
              <div
                key={inv.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5"
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-mono text-xs text-foreground truncate">
                    {inv.name ?? inv.email}
                  </span>
                  {inv.name && (
                    <span className="font-mono text-[10px] text-muted-foreground truncate">
                      {inv.email}
                    </span>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={`font-mono text-[10px] gap-1 ${
                    responded
                      ? "border-green-500/20 bg-green-500/5 text-green-500"
                      : "border-border bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {responded ? "Responded" : "Pending"}
                </Badge>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
