import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Plus } from "lucide-react";
import Link from "next/link";

export function AnalyticsEmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="h-12 w-12 rounded-none border border-dashed border-border flex items-center justify-center bg-muted/30">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="text-center flex flex-col gap-1 max-w-sm">
          <p className="font-mono text-sm text-foreground font-medium">
            No data yet
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Send your first invitation to start tracking response rates,
            attendance, and audience trends across all your events.
          </p>
        </div>
        <Link href="/events/new">
          <Button
            size="sm"
            className="font-mono text-xs gap-2 rounded-none cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            Create your first event
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
