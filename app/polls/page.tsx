import { PollService } from "@/lib/validations/validate-poll";
import { getSession } from "@/lib/auth/client/get-session";
import { PollListSkeleton } from "@/components/skeletons";
import { PollList } from "@/components/polls/poll-list";
import { Separator } from "@/components/ui/separator";
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-mono text-base font-semibold text-foreground">
          Polls
        </h1>
        <Link href="/polls/new">
          <Button
            size="sm"
            className="font-mono text-xs gap-2 rounded-none cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            New poll
          </Button>
        </Link>
      </div>
      <Separator className="bg-border" />
    </div>
  );
}

async function PollsSection() {
  const session = await getSession();
  if (!session) redirect("/login");
  const polls = await PollService.userPolls(session.user.id);
  return (
    <div className="flex flex-col gap-6">
      <p className="font-mono text-xs text-muted-foreground -mt-2">
        {polls.length === 0
          ? "Find a date that works for everyone before committing to one."
          : `${polls.length}/${POLL_LIMITS.MAX_POLLS_PER_USER} polls`}
      </p>
      <PollList polls={polls} />
    </div>
  );
}

export default function PollsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader />
      <Suspense fallback={<PollListSkeleton />}>
        <PollsSection />
      </Suspense>
    </div>
  );
}
