import { Button } from "@/components/ui/button";
import { BarChart3, Plus } from "lucide-react";
import Link from "next/link";

export function AnalyticsEmptyState() {
  return (
    <div className="relative overflow-hidden border border-dashed border-white/8 bg-transparent flex flex-col items-center justify-center py-16 sm:py-20 px-6 gap-4 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 70% at 50% 0%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 70%)",
        }}
      />
      <div className="relative shrink-0 rounded-full border border-white/8 bg-white/4 w-12 h-12 flex items-center justify-center">
        <BarChart3 className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="relative flex flex-col gap-1.5 max-w-sm">
        <h3 className="font-sans text-base font-medium text-foreground">
          No data yet
        </h3>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
          Send your first invitation to start tracking response rates,
          attendance, and audience trends across all your events.
        </p>
      </div>
      <Link href="/events/new" className="relative">
        <Button
          size="sm"
          className="font-sans text-sm gap-1.5 cursor-pointer h-9 mt-2"
        >
          <Plus className="h-3.5 w-3.5" />
          Create your first event
        </Button>
      </Link>
    </div>
  );
}
