import { GuestAggregate } from "@/lib/analytics/types";
import { Crown, GhostIcon } from "lucide-react";

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
    pillClass: "border-white/25 bg-white/10 text-foreground",
  },
  ghosters: {
    icon: GhostIcon,
    pillClass: "border-destructive/30 bg-destructive/10 text-destructive",
  },
} as const;

function initialOf(guest: GuestAggregate): string {
  const source = guest.name?.trim() || guest.email;
  return source.charAt(0).toUpperCase() || "?";
}

export function TopGuestsList({
  title,
  subtitle,
  guests,
  variant,
  emptyMessage,
}: TopGuestsListProps) {
  const Icon = variantConfig[variant].icon;
  const pillClass = variantConfig[variant].pillClass;

  return (
    <div className="relative overflow-hidden border border-white/8 bg-white/2 flex flex-col">
      <div className="flex items-start justify-between gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-3.5 border-b border-white/6">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-sans text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            {title}
          </h3>
          <p className="font-sans text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {guests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2 px-4">
          <p className="font-sans text-sm text-muted-foreground text-center max-w-sm leading-relaxed">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {guests.map((guest, index) => (
            <div
              key={guest.email}
              className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-white/6 last:border-b-0 hover:bg-white/3 transition-colors"
            >
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums w-6 shrink-0 text-right">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="h-7 w-7 rounded-full border border-white/8 bg-white/4 flex items-center justify-center shrink-0">
                <span className="font-sans text-xs font-medium text-foreground uppercase">
                  {initialOf(guest)}
                </span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-sans text-sm text-foreground truncate font-medium">
                  {guest.name ?? guest.email}
                </span>
                {guest.name && (
                  <span className="font-mono text-xs text-muted-foreground truncate tabular-nums">
                    {guest.email}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-xs text-muted-foreground tabular-nums hidden sm:inline">
                  {guest.invitedCount} invites
                </span>
                <span
                  className={`inline-flex items-center gap-1 border px-1.5 h-5 font-mono text-[10px] uppercase tracking-wide tabular-nums ${pillClass}`}
                >
                  {variant === "engaged"
                    ? `${guest.attendingCount} going`
                    : `${guest.pendingCount} ignored`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
