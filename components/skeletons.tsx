export function EventListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="border border-border p-4 flex items-center justify-between animate-pulse"
        >
          <div className="flex flex-col gap-2">
            <div className="h-3 w-48 bg-muted rounded-none" />
            <div className="h-2 w-32 bg-muted rounded-none" />
          </div>
          <div className="h-2 w-16 bg-muted rounded-none" />
        </div>
      ))}
    </div>
  );
}

export function GuestTableSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="border border-border p-3 flex items-center gap-4 animate-pulse"
        >
          <div className="h-2 w-40 bg-muted rounded-none" />
          <div className="h-2 w-24 bg-muted rounded-none" />
          <div className="h-2 w-16 bg-muted rounded-none" />
        </div>
      ))}
    </div>
  );
}

export function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border border-border p-4 animate-pulse">
          <div className="h-2 w-16 bg-muted rounded-none mb-3" />
          <div className="h-6 w-8 bg-muted rounded-none" />
        </div>
      ))}
    </div>
  );
}

export function WorkspaceListSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="flex items-center justify-between border-b border-white/8 pb-4 gap-3 flex-wrap">
        <div className="h-3 w-56 sm:w-64 bg-white/5" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-32 sm:w-36 bg-white/5" />
          <div className="h-8 w-28 sm:w-32 bg-white/5" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="border border-white/8 bg-[#0a0a0a] flex flex-col gap-3 p-5"
          >
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 bg-white/5" />
              <div className="h-2 w-24 bg-white/5" />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              {[...Array(3)].map((__, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-white/5" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="h-2 w-24 bg-white/5" />
                    <div className="h-2 w-40 bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NewEventFormSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="h-2 w-24 bg-muted rounded-none" />
          <div className="h-9 w-full bg-muted rounded-none" />
        </div>
      ))}
      <div className="h-9 w-full bg-muted rounded-none mt-2" />
    </div>
  );
}

export function InsightsCardSkeleton() {
  return (
    <div className="border border-border p-4 flex flex-col gap-3 animate-pulse">
      <div className="h-2 w-24 bg-muted rounded-none" />
      <div className="h-3 w-full bg-muted rounded-none" />
      <div className="h-3 w-3/4 bg-muted rounded-none" />
      <div className="h-2 w-1/2 bg-muted rounded-none" />
    </div>
  );
}

export function TemplateListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="border border-border p-4 flex items-center justify-between animate-pulse"
        >
          <div className="flex flex-col gap-2">
            <div className="h-3 w-40 bg-muted rounded-none" />
            <div className="h-2 w-56 bg-muted rounded-none" />
          </div>
          <div className="h-7 w-16 bg-muted rounded-none" />
        </div>
      ))}
    </div>
  );
}

export function EditEventFormSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="h-2 w-24 bg-muted rounded-none" />
          <div className="h-9 w-full bg-muted rounded-none" />
        </div>
      ))}
      <div className="flex gap-2 mt-2">
        <div className="h-9 w-24 bg-muted rounded-none" />
        <div className="h-9 w-24 bg-muted rounded-none" />
      </div>
    </div>
  );
}

export function CalendarGridSkeleton({ view }: { view: "month" | "agenda" }) {
  if (view === "agenda") {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-2 w-32 bg-muted rounded-none" />
            {[...Array(2)].map((__, j) => (
              <div key={j} className="h-10 w-full bg-muted rounded-none" />
            ))}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="border border-border animate-pulse">
      <div className="grid grid-cols-7 border-b border-border">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-7 border-r border-border last:border-r-0" />
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6">
        {[...Array(42)].map((_, i) => (
          <div
            key={i}
            className="min-h-24 sm:min-h-28 border-r border-b border-border last-of-type:border-r-0"
          />
        ))}
      </div>
    </div>
  );
}

export function PollListSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-2 w-32 bg-muted rounded-none" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="border border-border bg-card flex flex-col gap-3 p-4"
          >
            <div className="h-3 w-16 bg-muted rounded-none" />
            <div className="h-3 w-3/4 bg-muted rounded-none" />
            <div className="h-2 w-2/3 bg-muted rounded-none" />
            <div className="h-2 w-1/2 bg-muted rounded-none" />
            <div className="h-2 w-full bg-muted rounded-none" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PollDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-2 w-20 bg-muted rounded-none" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-16 bg-muted rounded-none" />
        <div className="h-5 w-1/2 bg-muted rounded-none" />
        <div className="h-2 w-full bg-muted rounded-none" />
        <div className="h-2 w-3/4 bg-muted rounded-none" />
      </div>
      <div className="border border-border bg-card flex flex-col">
        <div className="h-12 border-b border-border" />
        <div className="flex flex-col gap-3 p-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 border border-border p-3"
            >
              <div className="h-3 w-1/2 bg-muted rounded-none" />
              <div className="h-1.5 w-full bg-muted rounded-none" />
            </div>
          ))}
        </div>
      </div>
      <div className="border border-border bg-card">
        <div className="h-9 border-b border-border" />
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border last:border-b-0"
          >
            <div className="h-2 w-1/3 bg-muted rounded-none" />
            <div className="h-3 w-16 bg-muted rounded-none" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Lifetime summary tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="border border-border bg-card flex flex-col gap-2 px-4 py-4"
          >
            <div className="h-2 w-20 bg-muted rounded-none" />
            <div className="h-7 w-16 bg-muted rounded-none" />
            <div className="h-2 w-32 bg-muted rounded-none mt-2" />
          </div>
        ))}
      </div>
      {/* Funnel + Recurring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="border border-border bg-card flex flex-col">
            <div className="h-12 border-b border-border" />
            <div className="flex flex-col gap-3 p-4">
              {[...Array(4)].map((__, j) => (
                <div key={j} className="flex flex-col gap-1.5">
                  <div className="h-2 w-20 bg-muted rounded-none" />
                  <div className="h-2 w-full bg-muted rounded-none" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border border-border bg-card">
        <div className="h-14 border-b border-border" />
        <div className="h-65 m-4 bg-muted rounded-none" />
      </div>

      <div className="border border-border bg-card">
        <div className="h-14 border-b border-border" />
        <div className="h-55 m-4 bg-muted rounded-none" />
      </div>
    </div>
  );
}
