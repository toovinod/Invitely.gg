"use client";
import { SubscribeDialog } from "@/components/calendar/subscribe-dialog";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarView } from "@/lib/calendar/types";
import { useState } from "react";

interface CalendarShellProps {
  view: CalendarView;
  anchorIso: string;
  hideCancelled: boolean;
  appUrl: string;
  feedToken: string;
}

export function CalendarShell({
  view,
  anchorIso,
  hideCancelled,
  appUrl,
  feedToken,
}: CalendarShellProps) {
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const anchor = new Date(anchorIso);

  return (
    <>
      <CalendarHeader
        view={view}
        anchor={anchor}
        hideCancelled={hideCancelled}
        onSubscribe={() => setSubscribeOpen(true)}
      />
      <SubscribeDialog
        open={subscribeOpen}
        onOpenChange={setSubscribeOpen}
        appUrl={appUrl}
        initialToken={feedToken}
      />
    </>
  );
}
