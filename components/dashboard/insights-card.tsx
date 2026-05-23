"use client";
import { Sparkles, Lightbulb, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface Insights {
  summary: string;
  responseRate: number;
  topInsight: string;
  suggestion: string;
  urgency: "low" | "medium" | "high";
}

interface InsightsCardProps {
  eventId: string;
}

const urgencyConfig = {
  low: {
    border: "border-white/15",
    bg: "bg-white/4",
    text: "text-foreground",
    iconColor: "text-muted-foreground",
    Icon: Lightbulb,
    label: "Suggestion",
  },
  medium: {
    border: "border-white/[0.18]",
    bg: "bg-white/6",
    text: "text-foreground",
    iconColor: "text-foreground",
    Icon: AlertCircle,
    label: "Action needed",
  },
  high: {
    border: "border-destructive/40",
    bg: "bg-destructive/10",
    text: "text-destructive",
    iconColor: "text-destructive",
    Icon: AlertTriangle,
    label: "Urgent",
  },
} as const;

export function InsightsCard({ eventId }: InsightsCardProps) {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  async function handleGenerate() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const result = await res.json();
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setInsights(result.data.insights);
      setGenerated(true);
    } catch {
      toast.error("Failed to generate insights");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden border">
      <div className="relative px-4 sm:px-5 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
              AI Insights
            </span>
          </div>
          {!generated && (
            <Button
              variant="outline"
              size="sm"
              className="font-sans text-sm h-8 gap-1.5 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {isLoading ? "Analysing..." : "Generate insights"}
            </Button>
          )}
          {generated && (
            <Button
              variant="ghost"
              size="sm"
              className="font-sans text-sm h-8 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-white/4 cursor-pointer"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              {isLoading ? "Analysing..." : "Refresh"}
            </Button>
          )}
        </div>

        {!generated && !isLoading && (
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            Generate AI-powered insights based on your guest responses.
          </p>
        )}

        {isLoading && (
          <div className="flex flex-col gap-3 animate-pulse">
            <div className="h-2 w-full bg-white/5" />
            <div className="h-2 w-3/4 bg-white/5" />
            <div className="h-2 w-1/2 bg-white/5" />
          </div>
        )}

        {insights && !isLoading && (
          <div className="flex flex-col gap-4">
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              {insights.summary}
            </p>

            <div className="h-px bg-white/6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 border border-white/8 bg-white/2 px-3.5 py-3">
                <span className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                  Response rate
                </span>
                <span className="font-mono text-2xl font-semibold text-foreground tabular-nums leading-none">
                  {insights.responseRate}%
                </span>
              </div>
              <div className="flex flex-col gap-1 border border-white/8 bg-white/2 px-3.5 py-3">
                <span className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                  Top insight
                </span>
                <span className="font-sans text-sm text-foreground leading-relaxed">
                  {insights.topInsight}
                </span>
              </div>
            </div>

            {(() => {
              const cfg = urgencyConfig[insights.urgency];
              const Icon = cfg.Icon;
              return (
                <div
                  className={`border ${cfg.border} ${cfg.bg} px-3.5 py-3 flex flex-col gap-1`}
                >
                  <span
                    className={`font-sans text-[11px] uppercase tracking-wider font-medium flex items-center gap-1.5 ${cfg.text}`}
                  >
                    <Icon className={`h-3 w-3 ${cfg.iconColor}`} />
                    {cfg.label}
                  </span>
                  <span className="font-sans text-sm text-foreground leading-relaxed">
                    {insights.suggestion}
                  </span>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
