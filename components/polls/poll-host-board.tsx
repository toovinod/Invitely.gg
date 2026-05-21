"use client";

import { PollBestSlotInsight, PollOptionWithStats } from "@/lib/polls/types";
import { PollResults } from "@/components/polls/poll-results";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    className: "border-green-500/20 bg-green-500/5 text-green-500",
    label: "High",
  },
  medium: {
    className: "border-yellow-500/20 bg-yellow-500/5 text-yellow-500",
    label: "Medium",
  },
  low: {
    className: "border-border bg-muted/30 text-muted-foreground",
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
        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-sm flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
              AI best-slot suggestion
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              {insight
                ? "Recommendation based on current votes — refresh after more responses"
                : "Let AI surface the slot most of your guests can make"}
            </CardDescription>
            <CardAction>
              {insight && conf && (
                <Badge
                  variant="outline"
                  className={`font-mono text-[10px] gap-1 ${conf.className}`}
                >
                  {conf.label} confidence
                </Badge>
              )}
            </CardAction>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-3 flex-wrap">
            {insight ? (
              <p className="font-mono text-xs text-foreground leading-relaxed flex-1 min-w-0">
                {insight.reason}
              </p>
            ) : (
              <p className="font-mono text-xs text-muted-foreground flex-1 min-w-0">
                Click the button to ask Gemini to pick the best slot for you.
              </p>
            )}
            <Button
              size="sm"
              variant={insight ? "ghost" : "default"}
              onClick={handleGenerate}
              disabled={isLoading || responseCount === 0}
              className="font-mono text-xs h-8 gap-2 rounded-none cursor-pointer shrink-0"
            >
              <Sparkles className="h-3 w-3" />
              {isLoading
                ? "Thinking..."
                : insight
                  ? "Refresh"
                  : "Suggest best slot"}
            </Button>
          </CardContent>
        </Card>
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
