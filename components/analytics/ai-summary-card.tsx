"use client";
import { AnalyticsInsights, AnalyticsRange } from "@/lib/analytics/types";
import { Sparkles, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

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
  { icon: typeof TrendingUp; pillClass: string; label: string }
> = {
  improving: {
    icon: TrendingUp,
    pillClass: "border-sky-400/25 bg-sky-400/10 text-sky-400",
    label: "Improving",
  },
  declining: {
    icon: TrendingDown,
    pillClass: "border-destructive/30 bg-destructive/10 text-destructive",
    label: "Declining",
  },
  stable: {
    icon: Minus,
    pillClass: "border-white/8 bg-white/3 text-muted-foreground",
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
    <div className="relative overflow-hidden border border-white/8 bg-white/2 flex flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-sky-400/40 to-transparent"
      />

      <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3.5 flex items-start justify-between gap-3 flex-wrap border-b border-white/6">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-sans text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
            AI summary
          </h3>
          <p className="font-sans text-sm text-muted-foreground">
            {insights
              ? "Cross-event narrative — refresh to regenerate with the latest data"
              : "Generate an executive-level summary across every event you've sent"}
          </p>
        </div>
        {insights && trendStyle && TrendIcon && (
          <span
            className={`inline-flex items-center gap-1 border px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide ${trendStyle.pillClass}`}
          >
            <TrendIcon className="h-3 w-3" />
            {trendStyle.label}
          </span>
        )}
      </div>

      <div className="px-4 sm:px-5 py-4 flex flex-col gap-4">
        {!generated && !isLoading && (
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="font-sans text-sm text-muted-foreground flex-1 min-w-0">
              Click generate to analyse your lifetime stats with AI.
            </p>
            <Button
              size="sm"
              className="font-sans text-sm h-8 gap-1.5 cursor-pointer"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Generate summary
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col gap-3 animate-pulse">
            <div className="h-2 w-full bg-white/5" />
            <div className="h-2 w-3/4 bg-white/5" />
            <div className="h-2 w-1/2 bg-white/5" />
          </div>
        )}

        {insights && !isLoading && (
          <>
            <p className="font-sans text-sm text-foreground leading-relaxed">
              {insights.summary}
            </p>

            <div className="h-px bg-white/6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border border-white/8 bg-white/2 px-3 py-2.5 flex flex-col gap-1.5">
                <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Top insight
                </span>
                <span className="font-sans text-sm text-foreground leading-relaxed">
                  {insights.topInsight}
                </span>
              </div>
              <div className="border border-white/8 bg-white/2 px-3 py-2.5 flex flex-col gap-1.5">
                <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Recommendation
                </span>
                <span className="font-sans text-sm text-foreground leading-relaxed">
                  {insights.recommendation}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="font-sans text-sm gap-1.5 h-8 text-muted-foreground hover:text-foreground hover:bg-white/4 cursor-pointer"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
