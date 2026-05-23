import { PollCard } from "@/components/polls/poll-card";
import { PollListItem } from "@/lib/polls/types";
import { Button } from "@/components/ui/button";
import { Plus, Vote } from "lucide-react";
import Link from "next/link";

interface PollListProps {
  polls: PollListItem[];
}

export function PollList({ polls }: PollListProps) {
  if (polls.length === 0) {
    return (
      <div className="relative overflow-hidden border border-dashed border-white/8 bg-transparent flex flex-col items-center justify-center py-16 sm:py-20 px-6 gap-4 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 70% at 50% 0%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div className="relative shrink-0 rounded-full border border-white/8 bg-white/4 w-12 h-12 flex items-center justify-center">
          <Vote className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="relative flex flex-col gap-1.5 max-w-sm">
          <h3 className="font-sans text-base font-medium text-foreground">
            No polls yet
          </h3>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            Create a poll when you don&apos;t know the date yet let your guests
            vote on what works.
          </p>
        </div>
        <Link href="/polls/new" className="relative">
          <Button
            size="sm"
            className="font-sans text-sm gap-1.5 cursor-pointer h-9 mt-2"
          >
            <Plus className="h-3.5 w-3.5" />
            Create your first poll
          </Button>
        </Link>
      </div>
    );
  }

  const open = polls.filter((p) => p.status === "open");
  const finalized = polls.filter((p) => p.status === "finalized");
  const cancelled = polls.filter((p) => p.status === "cancelled");

  return (
    <div className="flex flex-col gap-7 sm:gap-8">
      {open.length > 0 && (
        <Section label="Open" count={open.length} polls={open} />
      )}
      {finalized.length > 0 && (
        <Section label="Finalised" count={finalized.length} polls={finalized} />
      )}
      {cancelled.length > 0 && (
        <Section label="Cancelled" count={cancelled.length} polls={cancelled} />
      )}
    </div>
  );
}

function Section({
  label,
  count,
  polls,
}: {
  label: string;
  count: number;
  polls: PollListItem[];
}) {
  return (
    <section className="flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center gap-3">
        <h2 className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.18em]">
          {label}
        </h2>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {count}
        </span>
        <div className="h-px flex-1 bg-white/6" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>
    </section>
  );
}
