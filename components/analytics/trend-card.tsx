import { TrendChart } from "@/components/analytics/trend-chart";
import { EventTrendPoint } from "@/lib/analytics/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface TrendCardProps {
  points: EventTrendPoint[];
}

function formatShortDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function TrendCard({ points }: TrendCardProps) {
  return (
    <Card className="@container/trend">
      <CardHeader className="border-b">
        <CardTitle className="font-mono text-sm">Response rate trend</CardTitle>
        <CardDescription className="font-mono text-xs">
          {points.length === 0
            ? "No sent events yet — chart will populate once you send your first batch."
            : `Last ${points.length} delivered event${points.length === 1 ? "" : "s"} · % of guests who replied`}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6">
        <TrendChart points={points} />
      </CardContent>

      {points.length > 0 && (
        <CardContent className="px-0 pt-0">
          <div className="border-t">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Event
                  </TableHead>
                  <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-right hidden md:table-cell">
                    Sent
                  </TableHead>
                  <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-right">
                    Going
                  </TableHead>
                  <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-right">
                    Rate
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...points].reverse().map((p) => (
                  <TableRow key={p.eventId}>
                    <TableCell>
                      <Link
                        href={`/events/${p.eventId}`}
                        className="font-mono text-xs text-foreground hover:underline underline-offset-4 truncate block max-w-65"
                      >
                        {p.eventName}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground tabular-nums hidden sm:table-cell">
                      {formatShortDate(p.eventAt)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground tabular-nums text-right hidden md:table-cell">
                      {p.total}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-foreground tabular-nums text-right">
                      {p.attending}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-foreground tabular-nums text-right">
                      {p.responseRate}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
