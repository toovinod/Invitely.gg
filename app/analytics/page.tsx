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
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Analytics | Invitely.gg" };

interface AnalyticsPageProps {
  searchParams: Promise<{ range?: string }>;
}

const rangeLabels: Record<AnalyticsRange, string> = {
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  all: "All time",
};

export default async function AnalyticsPage({
  searchParams,
}: AnalyticsPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const params = await searchParams;
  const range = parseRange(params.range);

  return (
    <div className="flex flex-col gap-6 sm:gap-7">
      <PageHeader />
      <Toolbar range={range} />
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

function PageHeader() {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
        Analytics
      </h1>
      <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xl">
        See how your invitations perform response rates, audience trends, and
        the moments your guests engage most.
      </p>
    </div>
  );
}

function Toolbar({ range }: { range: AnalyticsRange }) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap border-b border-white/8 pb-4">
      <p className="font-sans text-sm text-muted-foreground">
        Showing <span className="text-foreground">{rangeLabels[range]}</span>
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <RangeFilter current={range} />
        <ExportButton range={range} />
      </div>
    </div>
  );
}

function SectionHeader({ label, count }: { label: string; count?: number }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.18em]">
        {label}
      </h2>
      {typeof count === "number" && (
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {count}
        </span>
      )}
      <div className="h-px flex-1 bg-white/6" />
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
    <div className="flex flex-col gap-7 sm:gap-8">
      <section className="flex flex-col gap-4">
        <SectionHeader label="Performance overview" />
        <LifetimeSummary lifetime={data.lifetime} rates={data.rates} />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader label="Engagement" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FunnelCard funnel={data.funnel} />
          <RecurringSeriesCard series={data.series} />
        </div>
        <TrendCard points={data.trend} />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader label="Timing" />
        <BestSendTimeCard buckets={data.bestSendTimes} />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader label="Audience" />
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
      </section>
    </div>
  );
}
