import { BestSendTimeChart } from "@/components/analytics/best-send-time-chart";
import { BestSendTime } from "@/lib/analytics/types";
import { Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BestSendTimeCardProps {
  buckets: BestSendTime[];
}

export function BestSendTimeCard({ buckets }: BestSendTimeCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="font-mono text-sm flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          Best send times
        </CardTitle>
        <CardDescription className="font-mono text-xs">
          Day and hour combinations with the highest response rate
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6">
        {buckets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <p className="font-mono text-xs text-muted-foreground text-center max-w-md">
              Not enough send history yet — at least 5 invitations in the same
              (day, hour) slot are needed to call a winner.
            </p>
          </div>
        ) : (
          <BestSendTimeChart buckets={buckets} />
        )}
      </CardContent>
    </Card>
  );
}
