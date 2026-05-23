import { AnalyticsRange } from "@/lib/analytics/types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  range: AnalyticsRange;
}

export function ExportButton({ range }: ExportButtonProps) {
  const href =
    range === "all"
      ? "/api/analytics/export"
      : `/api/analytics/export?range=${range}`;
  return (
    <a href={href}>
      <Button
        variant="outline"
        size="sm"
        className="font-sans text-sm h-8 gap-1.5 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
      >
        <Download className="h-3.5 w-3.5" />
        Export CSV
      </Button>
    </a>
  );
}
