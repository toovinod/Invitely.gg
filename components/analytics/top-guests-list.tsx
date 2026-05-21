import { GuestAggregate } from "@/lib/analytics/types";
import { Crown, GhostIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TopGuestsListProps {
  title: string;
  subtitle: string;
  guests: GuestAggregate[];
  variant: "engaged" | "ghosters";
  emptyMessage: string;
}

const variantConfig = {
  engaged: {
    icon: Crown,
    badgeClass: "border-green-500/20 text-green-500 bg-green-500/5",
  },
  ghosters: {
    icon: GhostIcon,
    badgeClass: "border-destructive/20 text-destructive bg-destructive/5",
  },
} as const;

export function TopGuestsList({
  title,
  subtitle,
  guests,
  variant,
  emptyMessage,
}: TopGuestsListProps) {
  const Icon = variantConfig[variant].icon;
  const badgeClass = variantConfig[variant].badgeClass;

  return (
    <Card className="flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="font-mono text-sm flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          {title}
        </CardTitle>
        <CardDescription className="font-mono text-xs">
          {subtitle}
        </CardDescription>
      </CardHeader>

      {guests.length === 0 ? (
        <CardContent className="flex flex-col items-center justify-center py-12 gap-2">
          <p className="font-mono text-xs text-muted-foreground text-center max-w-sm">
            {emptyMessage}
          </p>
        </CardContent>
      ) : (
        <CardContent className="flex flex-col p-0">
          {guests.map((guest, index) => (
            <div
              key={guest.email}
              className="flex items-center gap-3 px-6 py-2.5 border-b last:border-b-0 hover:bg-muted/40 transition-colors"
            >
              <span className="font-mono text-[10px] text-muted-foreground tabular-nums w-5 shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-mono text-xs text-foreground truncate font-medium">
                  {guest.name ?? guest.email}
                </span>
                {guest.name && (
                  <span className="font-mono text-[10px] text-muted-foreground truncate">
                    {guest.email}
                  </span>
                )}
              </div>

              {variant === "engaged" ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums hidden sm:inline">
                    {guest.invitedCount} invites
                  </span>
                  <Badge
                    variant="outline"
                    className={`font-mono text-[10px] tabular-nums ${badgeClass}`}
                  >
                    {guest.attendingCount} going
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums hidden sm:inline">
                    {guest.invitedCount} invites
                  </span>
                  <Badge
                    variant="outline"
                    className={`font-mono text-[10px] tabular-nums ${badgeClass}`}
                  >
                    {guest.pendingCount} ignored
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
