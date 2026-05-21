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
        className="font-mono text-xs h-8 gap-2 rounded-none cursor-pointer"
      >
        <Download className="h-3 w-3" />
        Export CSV
      </Button>
    </a>
  );
}
