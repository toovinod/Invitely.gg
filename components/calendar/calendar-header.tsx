"use client";
import { ChevronLeft, ChevronRight, Plus, Rss } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { CalendarView } from "@/lib/calendar/types";
import { Button } from "@/components/ui/button";
import {
  addDays,
  addMonths,
  formatMonthLabel,
  formatDayLabel,
  toDateKey,
} from "@/lib/calendar/range";
import Link from "next/link";

interface CalendarHeaderProps {
  view: CalendarView;
  anchor: Date;
  hideCancelled: boolean;
  onSubscribe: () => void;
}

export function CalendarHeader({
  view,
  anchor,
  hideCancelled,
  onSubscribe,
}: CalendarHeaderProps) {
  const router = useRouter();
  const params = useSearchParams();

  const navigate = (next: { view?: CalendarView; date?: Date }) => {
    const merged = new URLSearchParams(params.toString());
    if (next.view) merged.set("view", next.view);
    if (next.date) merged.set("date", toDateKey(next.date));
    router.push(`/calendar?${merged.toString()}`);
  };

  const toggleHideCancelled = () => {
    const merged = new URLSearchParams(params.toString());
    if (hideCancelled) merged.delete("hideCancelled");
    else merged.set("hideCancelled", "1");
    router.push(`/calendar?${merged.toString()}`);
  };

  const step = view === "month" ? 1 : 7;
  const goPrev = () =>
    navigate({
      date:
        view === "month" ? addMonths(anchor, -step) : addDays(anchor, -step),
    });
  const goNext = () =>
    navigate({
      date: view === "month" ? addMonths(anchor, step) : addDays(anchor, step),
    });
  const goToday = () => navigate({ date: new Date() });

  const label =
    view === "month" ? formatMonthLabel(anchor) : formatDayLabel(anchor);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-mono text-base font-semibold text-foreground">
          Calendar
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="font-mono text-xs h-8 gap-2 rounded-none cursor-pointer"
            onClick={onSubscribe}
          >
            <Rss className="h-3 w-3" />
            Subscribe
          </Button>
          <Link href="/events/new">
            <Button
              size="sm"
              className="font-mono text-xs h-8 gap-2 rounded-none cursor-pointer"
            >
              <Plus className="h-3 w-3" />
              New event
            </Button>
          </Link>
        </div>
      </div>

      <Separator className="bg-border" />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="font-mono text-xs h-8 rounded-none cursor-pointer"
            onClick={goToday}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none cursor-pointer"
            onClick={goPrev}
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none cursor-pointer"
            onClick={goNext}
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="font-mono text-xs text-foreground ml-2 tabular-nums">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleHideCancelled}
            className={`font-mono text-[11px] h-8 px-2.5 border transition-colors cursor-pointer ${
              hideCancelled
                ? "border-foreground text-foreground bg-foreground/5"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
            aria-pressed={hideCancelled}
          >
            Hide cancelled
          </button>

          <div className="inline-flex border border-border">
            <ViewButton
              active={view === "month"}
              onClick={() => navigate({ view: "month" })}
              label="Month"
            />
            <ViewButton
              active={view === "agenda"}
              onClick={() => navigate({ view: "agenda" })}
              label="Agenda"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-mono text-[11px] h-8 px-3 transition-colors cursor-pointer ${
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:text-foreground"
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
