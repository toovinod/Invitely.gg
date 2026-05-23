import { PollDeleteDialog } from "@/components/polls/poll-delete-dialog";
import { PollHostBoard } from "@/components/polls/poll-host-board";
import { PollService } from "@/lib/validations/validate-poll";
import { PollDetailSkeleton } from "@/components/skeletons";
import { getSession } from "@/lib/auth/client/get-session";
import { isInvitelyApiError } from "@/lib/shared/base";
import { redirect, notFound } from "next/navigation";
import { PollIdParams } from "@/lib/polls/types";
import { Button } from "@/components/ui/button";
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

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "default" | "success" | "destructive" | "muted";
}) {
  const className =
    tone === "destructive"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : tone === "success"
        ? "border-white/25 bg-white/10 text-foreground"
        : tone === "muted"
          ? "border-white/8 bg-white/3 text-muted-foreground"
          : "border-white/15 bg-white/6 text-foreground";
  return (
    <span
      className={`inline-flex items-center gap-1 border px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide w-fit ${className}`}
    >
      {label}
    </span>
  );
}

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

  const isOpen = detail.status === "open";
  const responseRate =
    detail.invitees.length === 0
      ? 0
      : Math.round((detail.responseCount / detail.invitees.length) * 100);

  const tone: "default" | "success" | "destructive" =
    detail.status === "finalized"
      ? "success"
      : detail.status === "cancelled"
        ? "destructive"
        : "default";
  const statusLabel =
    detail.status === "finalized"
      ? "finalised"
      : detail.status === "cancelled"
        ? "cancelled"
        : "open";

  return (
    <div className="flex flex-col gap-6 sm:gap-7">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Link href="/polls" className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="font-sans text-sm h-8 gap-1.5 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All polls
          </Button>
        </Link>
        <PollDeleteDialog pollId={detail.id} pollTitle={detail.title} />
      </div>

      {detail.status === "finalized" && detail.finalEventId && (
        <div className="border border-white/15 bg-white/3 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <p className="font-sans text-sm font-medium text-foreground">
                Locked in — event created
              </p>
              <p className="font-sans text-xs text-muted-foreground">
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
              className="font-sans text-sm h-8 gap-1.5 cursor-pointer"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              Open event
            </Button>
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-2 min-w-0">
        <StatusPill label={statusLabel} tone={tone} />
        <h1 className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          {detail.title}
        </h1>
        {detail.description && (
          <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {detail.description}
          </p>
        )}

        <div className="flex flex-col gap-1.5 pt-1">
          {detail.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span className="font-sans text-sm text-muted-foreground">
                {detail.location}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
            <span className="font-sans text-sm text-muted-foreground">
              <span className="font-mono tabular-nums text-foreground">
                {detail.responseCount}
              </span>
              /
              <span className="font-mono tabular-nums text-foreground">
                {detail.invitees.length}
              </span>{" "}
              responded ·{" "}
              <span className="font-mono tabular-nums text-foreground">
                {responseRate}%
              </span>
            </span>
          </div>
          {detail.closesAt && (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span className="font-sans text-sm text-muted-foreground">
                Closes{" "}
                <span className="font-mono tabular-nums text-foreground">
                  {new Date(detail.closesAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-white/6" />

      <PollHostBoard
        pollId={detail.id}
        options={detail.options}
        inviteeCount={detail.invitees.length}
        responseCount={detail.responseCount}
        isOpen={isOpen}
      />

      <div className="h-px bg-white/6" />

      <section className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <h2 className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.18em]">
            Invitees
          </h2>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {detail.invitees.length}
          </span>
          <div className="h-px flex-1 bg-white/6" />
        </div>
        <div className="border border-white/8 bg-white/2 divide-y divide-white/6">
          {detail.invitees.map((inv) => {
            const responded = inv.respondedAt !== null;
            return (
              <div
                key={inv.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5"
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-sans text-sm text-foreground truncate">
                    {inv.name ?? inv.email}
                  </span>
                  {inv.name && (
                    <span className="font-mono text-[11px] text-muted-foreground truncate">
                      {inv.email}
                    </span>
                  )}
                </div>
                <StatusPill
                  label={responded ? "responded" : "pending"}
                  tone={responded ? "success" : "muted"}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
