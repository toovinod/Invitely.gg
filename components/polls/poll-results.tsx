"use client";
import { CheckCircle2, Crown, Lock, Users } from "lucide-react";
import { PollOptionWithStats } from "@/lib/polls/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PollResultsProps {
  pollId: string;
  options: PollOptionWithStats[];
  inviteeCount: number;
  responseCount: number;
  isOpen: boolean;
  bestSlotOptionId?: string | null;
}

interface FinalizeResponse {
  eventId: string;
  email: { sent: number; failed: number; batches: number };
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
}

function formatSlot(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function PollResults({
  pollId,
  options,
  inviteeCount,
  responseCount,
  isOpen,
  bestSlotOptionId,
}: PollResultsProps) {
  const router = useRouter();
  const [finalizing, setFinalizing] = useState<string | null>(null);

  const ranked = [...options].sort((a, b) => b.voteCount - a.voteCount);
  const topVoteCount = ranked[0]?.voteCount ?? 0;

  async function handleFinalize(optionId: string) {
    if (finalizing) return;
    setFinalizing(optionId);
    try {
      const res = await fetch(`/api/polls/${pollId}/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });
      const json = (await res.json()) as ApiEnvelope<FinalizeResponse>;
      if (!json.success || !json.data) {
        toast.error(json.message);
        return;
      }
      const { sent, failed } = json.data.email;
      if (failed > 0) {
        toast.warning(
          `slot locked — ${sent - failed}/${sent} invites delivered, ${failed} failed`,
        );
      } else {
        toast.success(`slot locked — ${sent} invitations sent`);
      }
      router.push(`/events/${json.data.eventId}`);
    } catch {
      toast.error("failed to finalise poll");
    } finally {
      setFinalizing(null);
    }
  }

  return (
    <div className="relative overflow-hidden border border-white/8 bg-white/2 flex flex-col">
      <div className="flex items-start justify-between gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-3.5 border-b border-white/6">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-sans text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            Vote results
          </h3>
          <p className="font-sans text-xs text-muted-foreground">
            <span className="font-mono tabular-nums text-foreground">
              {responseCount}
            </span>{" "}
            of{" "}
            <span className="font-mono tabular-nums text-foreground">
              {inviteeCount}
            </span>{" "}
            invitee
            {inviteeCount === 1 ? "" : "s"} have voted
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 sm:px-5 py-4">
        {options.map((option) => {
          const isLeader =
            option.voteCount === topVoteCount && topVoteCount > 0;
          const widthPct =
            topVoteCount === 0
              ? 0
              : Math.max(
                  4,
                  Math.round((option.voteCount / topVoteCount) * 100),
                );
          const inviteePct =
            inviteeCount === 0
              ? 0
              : Math.round((option.voteCount / inviteeCount) * 100);
          const isAiPick = option.id === bestSlotOptionId;

          return (
            <div
              key={option.id}
              className={`flex flex-col gap-2 border px-3 py-3 transition-all duration-300 ${
                isAiPick
                  ? "border-foreground/40 bg-white/4"
                  : "border-white/8 bg-white/2 hover:border-white/15 hover:bg-white/4"
              }`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-sans text-sm text-foreground">
                      {formatSlot(option.startAt)}
                    </span>
                    {isLeader && (
                      <span className="inline-flex items-center gap-1 border border-white/25 bg-white/10 text-foreground px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide">
                        <Crown className="h-2.5 w-2.5" />
                        Leader
                      </span>
                    )}
                    {isAiPick && (
                      <span className="inline-flex items-center gap-1 border border-foreground/30 bg-foreground/10 text-foreground px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide">
                        AI pick
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {option.voteCount} vote{option.voteCount === 1 ? "" : "s"}
                    {" · "}
                    {inviteePct}% of invitees
                  </span>
                </div>
                {isOpen && (
                  <Button
                    size="sm"
                    variant={isLeader ? "default" : "outline"}
                    onClick={() => handleFinalize(option.id)}
                    disabled={finalizing !== null}
                    className={`font-sans text-sm h-8 gap-1.5 cursor-pointer shrink-0 ${
                      isLeader
                        ? ""
                        : "border-white/8 hover:border-white/15 hover:bg-white/4"
                    }`}
                  >
                    <Lock className="h-3.5 w-3.5" />
                    {finalizing === option.id ? "Locking..." : "Lock in"}
                  </Button>
                )}
              </div>

              <div className="h-1.5 bg-white/6 overflow-hidden">
                <div
                  className={`h-full ${isLeader ? "bg-foreground" : "bg-foreground/50"}`}
                  style={{ width: `${widthPct}%` }}
                  aria-hidden="true"
                />
              </div>

              {option.voters.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {option.voters.map((voter) => (
                    <span
                      key={voter.id}
                      className="inline-flex items-center gap-1 border border-white/8 bg-white/3 text-muted-foreground px-1.5 h-5 font-mono text-[10px]"
                    >
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      {voter.name ?? voter.email}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
