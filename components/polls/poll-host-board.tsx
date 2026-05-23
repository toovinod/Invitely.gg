"use client";

import { PollBestSlotInsight, PollOptionWithStats } from "@/lib/polls/types";
import { PollResults } from "@/components/polls/poll-results";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PollHostBoardProps {
  pollId: string;
  options: PollOptionWithStats[];
  inviteeCount: number;
  responseCount: number;
  isOpen: boolean;
}

interface ApiEnvelope {
  success: boolean;
  message: string;
  data?: { insight: PollBestSlotInsight };
}

const confidenceStyles: Record<
  PollBestSlotInsight["confidence"],
  { className: string; label: string }
> = {
  high: {
    className: "border-sky-400/25 bg-sky-400/10 text-sky-400",
    label: "High",
  },
  medium: {
    className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-500",
    label: "Medium",
  },
  low: {
    className: "border-white/8 bg-white/3 text-muted-foreground",
    label: "Low",
  },
};

export function PollHostBoard({
  pollId,
  options,
  inviteeCount,
  responseCount,
  isOpen,
}: PollHostBoardProps) {
  const [insight, setInsight] = useState<PollBestSlotInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate() {
    if (!isOpen) return;
    if (responseCount === 0) {
      toast.error("wait for at least one response first");
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch("/api/ai/poll-best-slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId }),
      });
      const json = (await res.json()) as ApiEnvelope;
      if (!json.success || !json.data) {
        toast.error(json.message);
        return;
      }
      setInsight(json.data.insight);
    } catch {
      toast.error("failed to fetch ai recommendation");
    } finally {
      setIsLoading(false);
    }
  }

  const conf = insight ? confidenceStyles[insight.confidence] : null;

  return (
    <div className="flex flex-col gap-4">
      {isOpen && (
        <div className="relative overflow-hidden border border-white/8 bg-white/2 px-4 sm:px-5 py-4 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <h3 className="font-sans text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                AI best-slot suggestion
              </h3>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                {insight
                  ? "Recommendation based on current votes — refresh after more responses"
                  : "Let AI surface the slot most of your guests can make"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {insight && conf && (
                <span
                  className={`inline-flex items-center gap-1 border px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide ${conf.className}`}
                >
                  {conf.label} confidence
                </span>
              )}
              <Button
                size="sm"
                variant={insight ? "outline" : "default"}
                onClick={handleGenerate}
                disabled={isLoading || responseCount === 0}
                className={`font-sans text-sm h-8 gap-1.5 cursor-pointer ${
                  insight
                    ? "border-white/8 hover:border-white/15 hover:bg-white/4"
                    : ""
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isLoading
                  ? "Thinking..."
                  : insight
                    ? "Refresh"
                    : "Suggest best slot"}
              </Button>
            </div>
          </div>

          {insight ? (
            <p className="font-sans text-sm text-foreground leading-relaxed">
              {insight.reason}
            </p>
          ) : (
            <p className="font-sans text-sm text-muted-foreground">
              Click the button to ask AI to pick the best slot for you.
            </p>
          )}
        </div>
      )}

      <PollResults
        pollId={pollId}
        options={options}
        inviteeCount={inviteeCount}
        responseCount={responseCount}
        isOpen={isOpen}
        bestSlotOptionId={insight?.optionId}
      />
    </div>
  );
}
