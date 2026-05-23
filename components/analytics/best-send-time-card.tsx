import { BestSendTimeChart } from "@/components/analytics/best-send-time-chart";
import { BestSendTime } from "@/lib/analytics/types";
import { Clock } from "lucide-react";

interface BestSendTimeCardProps {
  buckets: BestSendTime[];
}

export function BestSendTimeCard({ buckets }: BestSendTimeCardProps) {
  return (
    <div className="relative overflow-hidden border border-white/8 bg-white/2 flex flex-col">
      <div className="flex items-start justify-between gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-3.5 border-b border-white/6">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-sans text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            Best send times
          </h3>
          <p className="font-sans text-sm text-muted-foreground">
            Day and hour combinations with the highest response rate
          </p>
        </div>
      </div>

      <div className="px-2 sm:px-5 py-4 flex-1">
        {buckets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 px-4">
            <p className="font-sans text-sm text-muted-foreground text-center max-w-md leading-relaxed">
              Not enough send history yet at least 5 invitations in the same
              (day, hour) slot are needed to call a winner.
            </p>
          </div>
        ) : (
          <BestSendTimeChart buckets={buckets} />
        )}
      </div>
    </div>
  );
}
