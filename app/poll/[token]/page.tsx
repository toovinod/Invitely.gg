import { PollService } from "@/lib/validations/validate-poll";
import { VoteForm } from "@/components/polls/vote-form";
import { isInvitelyApiError } from "@/lib/shared/base";
import { CalendarClock, MapPin } from "lucide-react";
import { PollTokenParams } from "@/lib/polls/types";
import { Logo } from "@/components/landing/logo";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: PollTokenParams): Promise<Metadata> {
  const { token } = await params;
  try {
    const view = await PollService.resolveByToken(token);
    return {
      title: `Vote: ${view.title} | Invitely.gg`,
      description: `${view.organizerName} is asking you to vote on a date for ${view.title}.`,
    };
  } catch {
    return { title: "Poll | Invitely.gg" };
  }
}

export default async function PublicPollPage({ params }: PollTokenParams) {
  const { token } = await params;
  if (!token || token.length !== 64 || !/^[a-f0-9]+$/.test(token)) {
    notFound();
  }

  let view;
  try {
    view = await PollService.resolveByToken(token);
  } catch (e) {
    if (isInvitelyApiError(e)) notFound();
    throw e;
  }

  const closesLabel = view.closesAt
    ? new Date(view.closesAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-white/8">
        <div className="mx-auto max-w-2xl px-6 py-4 flex items-center gap-2">
          <Logo size={16} />
          <span className="font-sans text-sm font-semibold tracking-tight text-foreground">
            Invitely.gg
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-10 sm:py-12 flex flex-col gap-7">
        <div className="flex flex-col gap-2">
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {view.organizerName} wants to find a time
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
            {view.title}
          </h1>
          {view.description && (
            <p className="font-sans text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {view.description}
            </p>
          )}

          <div className="flex flex-col gap-1.5 pt-2">
            {view.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                <span className="font-sans text-sm text-muted-foreground">
                  {view.location}
                </span>
              </div>
            )}
            {closesLabel && (
              <div className="flex items-center gap-2">
                <CalendarClock className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                <span className="font-sans text-sm text-muted-foreground">
                  Voting closes{" "}
                  <span className="font-mono text-foreground tabular-nums">
                    {closesLabel}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        <VoteForm token={token} view={view} />
      </div>
    </main>
  );
}
