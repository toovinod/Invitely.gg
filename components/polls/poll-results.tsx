"use client";
import { CheckCircle2, Crown, Lock, Users } from "lucide-react";
import { PollOptionWithStats } from "@/lib/polls/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="font-mono text-sm flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          Vote results
        </CardTitle>
        <CardDescription className="font-mono text-xs">
          {responseCount} of {inviteeCount} invitee
          {inviteeCount === 1 ? "" : "s"} have voted
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-4">
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
              className={`flex flex-col gap-2 border px-3 py-3 transition-colors ${
                isAiPick
                  ? "border-foreground/40 bg-muted/30"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-foreground tabular-nums">
                      {formatSlot(option.startAt)}
                    </span>
                    {isLeader && (
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] h-4 px-1.5 border-green-500/20 bg-green-500/5 text-green-500 gap-1"
                      >
                        <Crown className="h-2.5 w-2.5" />
                        Leader
                      </Badge>
                    )}
                    {isAiPick && (
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] h-4 px-1.5 border-foreground/30 bg-foreground/10"
                      >
                        AI pick
                      </Badge>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
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
                    className="font-mono text-xs h-8 gap-2 rounded-none cursor-pointer shrink-0"
                  >
                    <Lock className="h-3 w-3" />
                    {finalizing === option.id ? "Locking..." : "Lock in"}
                  </Button>
                )}
              </div>

              <div className="h-1.5 bg-muted overflow-hidden">
                <div
                  className={`h-full ${isLeader ? "bg-foreground" : "bg-foreground/50"}`}
                  style={{ width: `${widthPct}%` }}
                  aria-hidden="true"
                />
              </div>

              {option.voters.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {option.voters.map((voter) => (
                    <Badge
                      key={voter.id}
                      variant="outline"
                      className="font-mono text-[10px] h-4 px-1.5 border-border bg-muted/30 text-muted-foreground gap-1"
                    >
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      {voter.name ?? voter.email}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
