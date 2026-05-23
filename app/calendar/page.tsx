import { CalendarPageSearchParams, CalendarView } from "@/lib/calendar/types";
import { CalendarService } from "@/lib/validations/validate-calendar";
import { CalendarShell } from "@/components/calendar/calendar-shell";
import { AgendaList } from "@/components/calendar/agenda-list";
import { CalendarGridSkeleton } from "@/components/skeletons";
import { MonthGrid } from "@/components/calendar/month-grid";
import { getSession } from "@/lib/auth/client/get-session";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import {
  computeRangeFor,
  parseDateParam,
  parseView,
} from "@/lib/calendar/range";

export const metadata: Metadata = { title: "Calendar | Invitely.gg" };

interface CalendarPageProps {
  searchParams: Promise<CalendarPageSearchParams>;
}

export default async function CalendarPage({
  searchParams,
}: CalendarPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const params = await searchParams;
  const view = parseView(params.view);
  const anchor = parseDateParam(params.date);
  const hideCancelled = params.hideCancelled === "1";

  const [feedToken, appUrl] = [
    (await CalendarService.getOrCreateFeedToken(session.user.id)).token,
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "",
  ];

  return (
    <div className="flex flex-col gap-6 sm:gap-7">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          Calendar
        </h1>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xl">
          See every upcoming event at a glance switch between month and agenda,
          or subscribe to keep your favourite calendar app in sync.
        </p>
      </div>

      <CalendarShell
        view={view}
        anchorIso={anchor.toISOString()}
        hideCancelled={hideCancelled}
        appUrl={appUrl}
        feedToken={feedToken}
      />

      <Suspense
        key={`${view}-${anchor.toISOString()}-${hideCancelled}`}
        fallback={<CalendarGridSkeleton view={view} />}
      >
        <CalendarBody
          userId={session.user.id}
          view={view}
          anchor={anchor}
          hideCancelled={hideCancelled}
        />
      </Suspense>
    </div>
  );
}

interface CalendarBodyProps {
  userId: string;
  view: CalendarView;
  anchor: Date;
  hideCancelled: boolean;
}

async function CalendarBody({
  userId,
  view,
  anchor,
  hideCancelled,
}: CalendarBodyProps) {
  const range = computeRangeFor(view, anchor);
  const allEvents = await CalendarService.getEventsInRange(userId, range);
  const events = hideCancelled
    ? allEvents.filter((e) => e.status !== "cancelled")
    : allEvents;

  if (view === "month") {
    return <MonthGrid anchor={anchor} events={events} />;
  }
  return <AgendaList events={events} />;
}
