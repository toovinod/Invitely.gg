import { FunnelStats } from "@/lib/analytics/types";
import { Funnel } from "lucide-react";

interface FunnelCardProps {
  funnel: FunnelStats;
}

interface Stage {
  key: keyof FunnelStats;
  label: string;
}

const stages: Stage[] = [
  { key: "sent", label: "Sent" },
  { key: "opened", label: "Opened" },
  { key: "responded", label: "Responded" },
  { key: "attending", label: "Attending" },
];

export function FunnelCard({ funnel }: FunnelCardProps) {
  const max = funnel.sent || 1;

  return (
    <div className="relative overflow-hidden border border-white/8 bg-white/2 flex flex-col">
      <div className="flex items-start justify-between gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-3.5 border-b border-white/6">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-sans text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Funnel className="h-3.5 w-3.5 text-muted-foreground" />
            Conversion funnel
          </h3>
          <p className="font-sans text-sm text-muted-foreground">
            From inbox to confirmed attendance
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-4 flex-1 flex flex-col gap-3">
        {stages.map(({ key, label }, idx) => {
          const value = funnel[key];
          const widthPct = Math.round((value / max) * 100);
          const conversionPct =
            funnel.sent === 0 ? 0 : Math.round((value / funnel.sent) * 100);
          const isLast = idx === stages.length - 1;
          return (
            <div
              key={key}
              className={`flex flex-col gap-2 ${
                isLast ? "" : "border-b border-white/6 pb-3"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-sans text-sm text-foreground">
                  {label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-foreground tabular-nums font-medium">
                    {value.toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-1 border border-white/8 bg-white/3 text-muted-foreground px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide tabular-nums">
                    {conversionPct}%
                  </span>
                </div>
              </div>
              <div className="h-2.5 bg-white/4 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-foreground/80 to-foreground transition-all duration-500"
                  style={{ width: `${widthPct}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
