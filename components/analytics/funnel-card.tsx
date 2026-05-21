import { FunnelStats } from "@/lib/analytics/types";
import { Funnel } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="font-mono text-sm flex items-center gap-2">
          <Funnel className="h-3.5 w-3.5 text-muted-foreground" />
          Conversion funnel
        </CardTitle>
        <CardDescription className="font-mono text-xs">
          From inbox to confirmed attendance
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-4">
        {stages.map(({ key, label }) => {
          const value = funnel[key];
          const widthPct = Math.round((value / max) * 100);
          const conversionPct =
            funnel.sent === 0 ? 0 : Math.round((value / funnel.sent) * 100);
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-foreground">
                  {label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm text-foreground tabular-nums font-medium">
                    {value.toLocaleString()}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                    {conversionPct}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-muted overflow-hidden">
                <div
                  className="h-full bg-foreground transition-all"
                  style={{ width: `${widthPct}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
