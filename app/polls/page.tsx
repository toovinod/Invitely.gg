import { PollService } from "@/lib/validations/validate-poll";
import { getSession } from "@/lib/auth/client/get-session";
import { PollListSkeleton } from "@/components/skeletons";
import { PollList } from "@/components/polls/poll-list";
import { Button } from "@/components/ui/button";
import { POLL_LIMITS } from "@/lib/polls/types";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Polls | Invitely.gg" };

function PageHeader() {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
        Polls
      </h1>
      <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xl">
        Find a date that works for everyone let guests vote on time slots before
        you commit.
      </p>
    </div>
  );
}

async function PollsSection() {
  const session = await getSession();
  if (!session) redirect("/login");

  const polls = await PollService.userPolls(session.user.id);

  const open = polls.filter((p) => p.status === "open").length;
  const finalized = polls.filter((p) => p.status === "finalized").length;
  const cancelled = polls.filter((p) => p.status === "cancelled").length;

  const stats: { label: string; value: number }[] = [];
  if (open > 0) stats.push({ label: "open", value: open });
  if (finalized > 0) stats.push({ label: "finalised", value: finalized });
  if (cancelled > 0) stats.push({ label: "cancelled", value: cancelled });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-white/8 pb-4">
        <p className="font-sans text-sm text-muted-foreground">
          {polls.length === 0 ? (
            "Create your first poll to find a date that works for everyone."
          ) : (
            <>
              {stats.map((s, idx) => (
                <span key={s.label}>
                  <span className="font-mono tabular-nums text-foreground">
                    {s.value}
                  </span>{" "}
                  {s.label}
                  {idx < stats.length - 1 && (
                    <span className="mx-2 text-muted-foreground/40">·</span>
                  )}
                </span>
              ))}
              {stats.length > 0 && (
                <span className="mx-2 text-muted-foreground/40">·</span>
              )}
              <span className="font-mono tabular-nums text-foreground">
                {polls.length}
              </span>
              <span className="text-muted-foreground/70">
                /{POLL_LIMITS.MAX_POLLS_PER_USER}
              </span>{" "}
              polls
            </>
          )}
        </p>
        <Link href="/polls/new">
          <Button
            size="sm"
            className="font-sans text-sm gap-1.5 cursor-pointer h-8"
          >
            <Plus className="h-3.5 w-3.5" />
            New poll
          </Button>
        </Link>
      </div>
      <PollList polls={polls} />
    </div>
  );
}

export default function PollsPage() {
  return (
    <div className="flex flex-col gap-6 sm:gap-7">
      <PageHeader />
      <Suspense fallback={<PollListSkeleton />}>
        <PollsSection />
      </Suspense>
    </div>
  );
}
