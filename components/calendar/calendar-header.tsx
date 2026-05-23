"use client";
import { CalendarPlus, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
    <div className="flex items-center justify-between gap-3 flex-wrap border-b border-white/8 pb-4">
      <div className="flex items-center gap-1 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className="font-sans text-sm h-8 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
          onClick={goToday}
        >
          Today
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-white/4"
          onClick={goPrev}
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-white/4"
          onClick={goNext}
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span className="font-mono text-sm text-foreground tabular-nums ml-2">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={toggleHideCancelled}
          className={`font-sans text-xs h-8 px-2.5 border transition-colors cursor-pointer ${
            hideCancelled
              ? "border-white/15 bg-white/4 text-foreground"
              : "border-white/8 text-muted-foreground hover:text-foreground hover:border-white/15 hover:bg-white/4"
          }`}
          aria-pressed={hideCancelled}
        >
          Hide cancelled
        </button>

        <div className="inline-flex border border-white/8 overflow-hidden">
          <ViewButton
            active={view === "month"}
            onClick={() => navigate({ view: "month" })}
            label="Month"
          />
          <ViewButton
            active={view === "agenda"}
            onClick={() => navigate({ view: "agenda" })}
            label="Agenda"
            withDivider
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="font-sans text-sm h-8 gap-1.5 cursor-pointer border-white/8 hover:border-white/15 hover:bg-white/4"
          onClick={onSubscribe}
        >
          <CalendarPlus className="h-3.5 w-3.5" />
          Subscribe
        </Button>

        <Link href="/events/new">
          <Button
            size="sm"
            className="font-sans text-sm h-8 gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            New event
          </Button>
        </Link>
      </div>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  withDivider,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  withDivider?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-sans text-xs h-8 px-3 transition-colors cursor-pointer ${
        withDivider ? "border-l border-white/8" : ""
      } ${
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:text-foreground hover:bg-white/4"
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
