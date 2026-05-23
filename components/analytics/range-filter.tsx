"use client";

import { ANALYTICS_RANGES, AnalyticsRange } from "@/lib/analytics/types";
import { useRouter, useSearchParams } from "next/navigation";

interface RangeFilterProps {
  current: AnalyticsRange;
}

const labels: Record<AnalyticsRange, string> = {
  "30d": "30d",
  "90d": "90d",
  all: "All",
};

export function RangeFilter({ current }: RangeFilterProps) {
  const router = useRouter();
  const params = useSearchParams();

  const setRange = (range: AnalyticsRange) => {
    const merged = new URLSearchParams(params.toString());
    if (range === "all") merged.delete("range");
    else merged.set("range", range);
    const query = merged.toString();
    router.push(query ? `/analytics?${query}` : "/analytics");
  };

  return (
    <div
      className="inline-flex border border-white/8 overflow-hidden"
      role="group"
      aria-label="Analytics range"
    >
      {ANALYTICS_RANGES.map((range, idx) => {
        const active = range === current;
        return (
          <button
            key={range}
            type="button"
            onClick={() => setRange(range)}
            aria-pressed={active}
            className={`font-sans text-xs h-8 px-3 transition-colors cursor-pointer ${
              idx > 0 ? "border-l border-white/8" : ""
            } ${
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-white/4"
            }`}
          >
            {labels[range]}
          </button>
        );
      })}
    </div>
  );
}
