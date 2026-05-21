import { RecurringSeriesCard } from "@/components/analytics/recurring-series-card";
import { BestSendTimeCard } from "@/components/analytics/best-send-time-card";
import { LifetimeSummary } from "@/components/analytics/lifetime-summary";
import { ANALYTICS_RANGES, AnalyticsRange } from "@/lib/analytics/types";
import { AnalyticsEmptyState } from "@/components/analytics/empty-state";
import { AnalyticsService } from "@/lib/validations/validate-analytics";
import { TopGuestsList } from "@/components/analytics/top-guests-list";
import { AiSummaryCard } from "@/components/analytics/ai-summary-card";
import { ExportButton } from "@/components/analytics/export-button";
import { RangeFilter } from "@/components/analytics/range-filter";
import { FunnelCard } from "@/components/analytics/funnel-card";
import { AnalyticsPageSkeleton } from "@/components/skeletons";
import { TrendCard } from "@/components/analytics/trend-card";
import { getSession } from "@/lib/auth/client/get-session";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Analytics | Invitely.gg" };

interface AnalyticsPageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function AnalyticsPage({
  searchParams,
}: AnalyticsPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const params = await searchParams;
  const range = parseRange(params.range);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader range={range} />
      <AiSummaryCard key={range} range={range} />
      <Suspense key={`analytics-${range}`} fallback={<AnalyticsPageSkeleton />}>
        <AnalyticsBody userId={session.user.id} range={range} />
      </Suspense>
    </div>
  );
}

function parseRange(value: string | undefined): AnalyticsRange {
  if (!value) return "all";
  return (ANALYTICS_RANGES as readonly string[]).includes(value)
    ? (value as AnalyticsRange)
    : "all";
}

function PageHeader({ range }: { range: AnalyticsRange }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-mono text-base font-semibold text-foreground">
          Analytics
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <RangeFilter current={range} />
          <ExportButton range={range} />
        </div>
      </div>
      <Separator className="bg-border" />
    </div>
  );
}

interface AnalyticsBodyProps {
  userId: string;
  range: AnalyticsRange;
}

async function AnalyticsBody({ userId, range }: AnalyticsBodyProps) {
  const data = await AnalyticsService.getDashboardData(userId, range);

  if (data.isEmpty) {
    return <AnalyticsEmptyState />;
  }

  return (
    <div className="flex flex-col gap-6">
      <LifetimeSummary lifetime={data.lifetime} rates={data.rates} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FunnelCard funnel={data.funnel} />
        <RecurringSeriesCard series={data.series} />
      </div>

      <TrendCard points={data.trend} />

      <BestSendTimeCard buckets={data.bestSendTimes} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopGuestsList
          title="Top engaged"
          subtitle="by attending count"
          guests={data.topEngaged}
          variant="engaged"
          emptyMessage="No guests have RSVP'd attending yet."
        />
        <TopGuestsList
          title="Ghosters"
          subtitle="invited 2+ times, never responded"
          guests={data.ghosters}
          variant="ghosters"
          emptyMessage="No ghosters yet — your audience is responsive."
        />
      </div>
    </div>
  );
}
