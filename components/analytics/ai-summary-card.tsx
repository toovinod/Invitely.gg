"use client";
import { AnalyticsInsights, AnalyticsRange } from "@/lib/analytics/types";
import { Sparkles, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AiSummaryCardProps {
  range: AnalyticsRange;
}

interface ApiEnvelope {
  success: boolean;
  message: string;
  data?: { insights: AnalyticsInsights };
}

const trendStyles: Record<
  AnalyticsInsights["trend"],
  { icon: typeof TrendingUp; badgeClass: string; label: string }
> = {
  improving: {
    icon: TrendingUp,
    badgeClass: "border-green-500/20 text-green-500 bg-green-500/5",
    label: "Improving",
  },
  declining: {
    icon: TrendingDown,
    badgeClass: "border-destructive/20 text-destructive bg-destructive/5",
    label: "Declining",
  },
  stable: {
    icon: Minus,
    badgeClass: "border-border text-muted-foreground bg-muted/20",
    label: "Stable",
  },
};

export function AiSummaryCard({ range }: AiSummaryCardProps) {
  const [insights, setInsights] = useState<AnalyticsInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  async function handleGenerate() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/ai/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ range }),
      });
      const result = (await res.json()) as ApiEnvelope;
      if (!result.success || !result.data) {
        toast.error(result.message);
        return;
      }
      setInsights(result.data.insights);
      setGenerated(true);
    } catch {
      toast.error("failed to generate insights");
    } finally {
      setIsLoading(false);
    }
  }

  const trendStyle = insights ? trendStyles[insights.trend] : null;
  const TrendIcon = trendStyle?.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-mono text-sm flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
          AI summary
        </CardTitle>
        <CardDescription className="font-mono text-xs">
          {insights
            ? "Cross-event narrative — refresh to regenerate with the latest data"
            : "Generate an executive-level summary across every event you've sent"}
        </CardDescription>
        <CardAction>
          {insights && trendStyle && TrendIcon && (
            <Badge
              variant="outline"
              className={`font-mono text-[10px] gap-1 ${trendStyle.badgeClass}`}
            >
              <TrendIcon className="h-3 w-3" />
              {trendStyle.label}
            </Badge>
          )}
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {!generated && !isLoading && (
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="font-mono text-xs text-muted-foreground flex-1 min-w-0">
              Click generate to analyse your lifetime stats with AI.
            </p>
            <Button
              variant="default"
              size="sm"
              className="font-mono text-xs h-8 gap-2 cursor-pointer"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              <Sparkles className="h-3 w-3" />
              Generate summary
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col gap-3 animate-pulse">
            <div className="h-2 w-full bg-muted rounded-none" />
            <div className="h-2 w-3/4 bg-muted rounded-none" />
            <div className="h-2 w-1/2 bg-muted rounded-none" />
          </div>
        )}

        {insights && !isLoading && (
          <>
            <p className="font-mono text-xs text-foreground leading-relaxed">
              {insights.summary}
            </p>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5 border border-border bg-muted/20 px-3 py-2.5">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                  Top insight
                </span>
                <span className="font-mono text-xs text-foreground leading-relaxed">
                  {insights.topInsight}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 border border-border bg-muted/20 px-3 py-2.5">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                  Recommendation
                </span>
                <span className="font-mono text-xs text-foreground leading-relaxed">
                  {insights.recommendation}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="font-mono text-xs h-7 gap-2 cursor-pointer text-muted-foreground"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                <Sparkles className="h-3 w-3" />
                Refresh
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
