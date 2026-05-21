import { PollCard } from "@/components/polls/poll-card";
import { PollListItem } from "@/lib/polls/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface PollListProps {
  polls: PollListItem[];
}

export function PollList({ polls }: PollListProps) {
  if (polls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="border border-dashed border-border w-12 h-12 flex items-center justify-center">
          <span className="font-mono text-lg text-muted-foreground">+</span>
        </div>
        <div className="text-center flex flex-col gap-1 max-w-sm">
          <p className="font-mono text-sm text-foreground">No polls yet</p>
          <p className="font-mono text-xs text-muted-foreground">
            Create a poll when you don&apos;t know the date yet — let your
            guests vote on what works.
          </p>
        </div>
        <Link href="/polls/new">
          <Button size="sm" className="font-mono text-xs gap-2 cursor-pointer">
            <Plus className="h-3 w-3" />
            Create poll
          </Button>
        </Link>
      </div>
    );
  }

  const open = polls.filter((p) => p.status === "open");
  const finalized = polls.filter((p) => p.status === "finalized");
  const cancelled = polls.filter((p) => p.status === "cancelled");

  return (
    <div className="flex flex-col gap-8">
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
    <section className="flex flex-col gap-4">
      <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
        {label} — {count}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>
    </section>
  );
}
