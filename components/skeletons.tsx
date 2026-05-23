export function EventListSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="flex items-center justify-between border-b border-white/8 pb-4 gap-3 flex-wrap">
        <div className="h-3 w-44 sm:w-56 bg-white/5" />
        <div className="h-8 w-28 sm:w-32 bg-white/5" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-2 w-20 bg-white/5" />
        <div className="h-px flex-1 bg-white/6" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="border border-white/8 bg-[#0a0a0a] flex flex-col gap-3 p-4 sm:p-5"
          >
            <div className="h-4 w-32 bg-white/5" />
            <div className="h-2 w-40 bg-white/5" />
            <div className="h-2 w-28 bg-white/5" />
            <div className="h-px bg-white/6 my-1" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((__, j) => (
                <div key={j} className="flex flex-col gap-1">
                  <div className="h-4 w-6 bg-white/5" />
                  <div className="h-2 w-10 bg-white/5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GuestTableSkeleton() {
  return (
    <div className="border border-white/8 bg-[#0a0a0a] flex flex-col">
      <div className="h-10 border-b border-white/6" />
      <div className="flex flex-col">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="border-b border-white/6 last:border-b-0 px-4 py-3 flex items-center gap-4 animate-pulse"
          >
            <div className="h-2 w-32 sm:w-40 bg-white/5" />
            <div className="h-2 w-24 bg-white/5 hidden md:block" />
            <div className="h-5 w-16 bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border border-white/8 bg-[#0a0a0a] divide-x-0 sm:divide-x divide-y sm:divide-y-0 divide-white/6 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex flex-col gap-1 px-4 py-3.5">
          <div className="h-2 w-16 bg-white/5" />
          <div className="h-6 w-10 bg-white/5" />
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
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="flex items-center justify-between border-b border-white/8 pb-4">
        <div className="h-6 w-48 bg-white/5" />
        <div className="h-8 w-16 bg-white/5" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-2 w-20 bg-white/5" />
        <div className="h-5 w-40 bg-white/5" />
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="h-3 w-24 bg-white/5" />
          <div className="h-10 w-full bg-white/5" />
        </div>
      ))}
      <div className="flex justify-end">
        <div className="h-9 w-28 bg-white/5" />
      </div>
    </div>
  );
}

export function InsightsCardSkeleton() {
  return (
    <div className="border border-white/8 bg-[#0a0a0a] p-4 sm:p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-2 w-24 bg-white/5" />
        <div className="h-8 w-32 bg-white/5" />
      </div>
      <div className="h-3 w-full bg-white/5" />
      <div className="h-3 w-3/4 bg-white/5" />
    </div>
  );
}

export function TemplateListSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border border-white/8 bg-white/2 flex flex-col">
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-3.5 border-b border-white/6">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="h-3.5 w-3.5 bg-white/5 rounded-full shrink-0" />
              <div className="h-4 w-40 bg-white/5" />
              <div className="h-5 w-20 bg-white/5" />
            </div>
            <div className="h-8 w-8 bg-white/5" />
          </div>
          <div className="px-4 sm:px-5 py-4 flex flex-col gap-1.5">
            <div className="h-3 w-3/5 bg-white/5" />
            <div className="h-2 w-full bg-white/5" />
            <div className="h-2 w-4/5 bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EditEventFormSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="flex items-center justify-between border-b border-white/8 pb-4">
        <div className="h-6 w-40 bg-white/5" />
        <div className="h-8 w-16 bg-white/5" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="h-3 w-24 bg-white/5" />
          <div className="h-10 w-full bg-white/5" />
        </div>
      ))}
      <div className="flex justify-between mt-2">
        <div className="h-9 w-24 bg-white/5" />
        <div className="h-9 w-32 bg-white/5" />
      </div>
    </div>
  );
}

export function CalendarGridSkeleton({ view }: { view: "month" | "agenda" }) {
  if (view === "agenda") {
    return (
      <div className="flex flex-col gap-7 sm:gap-8 animate-pulse">
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-white/8 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-16 bg-white/5" />
            <div className="h-8 w-8 bg-white/5" />
            <div className="h-8 w-8 bg-white/5" />
            <div className="h-3 w-32 bg-white/5 ml-2" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-28 bg-white/5" />
            <div className="h-8 w-32 bg-white/5" />
            <div className="h-8 w-24 bg-white/5" />
            <div className="h-8 w-28 bg-white/5" />
          </div>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-20 bg-white/5" />
              <div className="h-2 w-4 bg-white/5" />
              <div className="h-px flex-1 bg-white/6" />
            </div>
            <div className="flex flex-col gap-1.5">
              {[...Array(2)].map((__, j) => (
                <div
                  key={j}
                  className="border border-white/8 bg-white/2 h-10"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-white/8 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-16 bg-white/5" />
          <div className="h-8 w-8 bg-white/5" />
          <div className="h-8 w-8 bg-white/5" />
          <div className="h-3 w-32 bg-white/5 ml-2" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-28 bg-white/5" />
          <div className="h-8 w-32 bg-white/5" />
          <div className="h-8 w-24 bg-white/5" />
          <div className="h-8 w-28 bg-white/5" />
        </div>
      </div>
      <div className="border border-white/8">
        <div className="grid grid-cols-7 h-8 border-b border-white/8 bg-white/2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="border-r border-white/6 last:border-r-0" />
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-6">
          {[...Array(42)].map((_, i) => (
            <div
              key={i}
              className="min-h-24 sm:min-h-28 border-r border-b border-white/6 last:border-r-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PollListSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="flex items-center justify-between border-b border-white/8 pb-4 gap-3 flex-wrap">
        <div className="h-3 w-44 sm:w-56 bg-white/5" />
        <div className="h-8 w-24 sm:w-28 bg-white/5" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-2 w-16 bg-white/5" />
        <div className="h-2 w-6 bg-white/5" />
        <div className="h-px flex-1 bg-white/6" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="border border-white/8 bg-white/2 flex flex-col gap-3 p-4 sm:p-5"
          >
            <div className="h-4 w-16 bg-white/5" />
            <div className="h-4 w-3/4 bg-white/5" />
            <div className="h-2 w-2/3 bg-white/5" />
            <div className="h-2 w-1/2 bg-white/5" />
            <div className="h-px bg-white/6 my-1" />
            <div className="flex items-center justify-between">
              <div className="h-2 w-28 bg-white/5" />
              <div className="h-2 w-8 bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PollDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-8 w-24 bg-white/5" />
      <div className="flex flex-col gap-2">
        <div className="h-5 w-16 bg-white/5" />
        <div className="h-7 w-1/2 bg-white/5" />
        <div className="h-2 w-full bg-white/5" />
        <div className="h-2 w-3/4 bg-white/5" />
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="h-2 w-44 bg-white/5" />
          <div className="h-2 w-56 bg-white/5" />
        </div>
      </div>
      <div className="h-px bg-white/6" />
      <div className="border border-white/8 bg-white/2 flex flex-col">
        <div className="h-14 border-b border-white/6 px-4 sm:px-5 flex flex-col justify-center gap-1.5">
          <div className="h-3 w-32 bg-white/5" />
          <div className="h-2 w-44 bg-white/5" />
        </div>
        <div className="flex flex-col gap-3 px-4 sm:px-5 py-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 border border-white/8 bg-white/2 p-3"
            >
              <div className="h-3 w-1/2 bg-white/5" />
              <div className="h-2 w-24 bg-white/5" />
              <div className="h-1.5 w-full bg-white/6" />
            </div>
          ))}
        </div>
      </div>
      <div className="h-px bg-white/6" />
      <div className="flex items-center gap-3">
        <div className="h-2 w-16 bg-white/5" />
        <div className="h-2 w-6 bg-white/5" />
        <div className="h-px flex-1 bg-white/6" />
      </div>
      <div className="border border-white/8 bg-white/2 divide-y divide-white/6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 px-4 py-2.5"
          >
            <div className="h-2 w-1/3 bg-white/5" />
            <div className="h-5 w-20 bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsPageSkeleton() {
  return (
    <div className="flex flex-col gap-7 sm:gap-8 animate-pulse">
      <section className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-32 bg-white/5" />
          <div className="h-px flex-1 bg-white/6" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="border border-white/8 bg-white/2 flex flex-col gap-3 px-4 sm:px-5 py-4 min-h-35"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="h-2 w-20 bg-white/5" />
                <div className="h-5 w-14 bg-white/5" />
              </div>
              <div className="h-8 w-20 bg-white/5" />
              <div className="flex flex-col gap-1 mt-auto">
                <div className="h-2 w-32 bg-white/5" />
                <div className="h-2 w-24 bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-24 bg-white/5" />
          <div className="h-px flex-1 bg-white/6" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="border border-white/8 bg-white/2 flex flex-col"
            >
              <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3.5 border-b border-white/6 flex flex-col gap-1.5">
                <div className="h-4 w-40 bg-white/5" />
                <div className="h-2 w-56 bg-white/5" />
              </div>
              <div className="px-4 sm:px-5 py-4 flex flex-col gap-3">
                {[...Array(4)].map((__, j) => (
                  <div key={j} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="h-2 w-20 bg-white/5" />
                      <div className="h-2 w-12 bg-white/5" />
                    </div>
                    <div className="h-2.5 w-full bg-white/5" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border border-white/8 bg-white/2">
          <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3.5 border-b border-white/6 flex flex-col gap-1.5">
            <div className="h-4 w-48 bg-white/5" />
            <div className="h-2 w-64 bg-white/5" />
          </div>
          <div className="h-72 mx-4 sm:mx-5 my-4 bg-white/5" />
        </div>
      </section>

      <section className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-16 bg-white/5" />
          <div className="h-px flex-1 bg-white/6" />
        </div>
        <div className="border border-white/8 bg-white/2">
          <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3.5 border-b border-white/6 flex flex-col gap-1.5">
            <div className="h-4 w-40 bg-white/5" />
            <div className="h-2 w-72 bg-white/5" />
          </div>
          <div className="h-65 mx-4 sm:mx-5 my-4 bg-white/5" />
        </div>
      </section>

      <section className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-20 bg-white/5" />
          <div className="h-px flex-1 bg-white/6" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="border border-white/8 bg-white/2 flex flex-col"
            >
              <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3.5 border-b border-white/6 flex flex-col gap-1.5">
                <div className="h-4 w-32 bg-white/5" />
                <div className="h-2 w-48 bg-white/5" />
              </div>
              <div className="flex flex-col">
                {[...Array(4)].map((__, j) => (
                  <div
                    key={j}
                    className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-white/6 last:border-b-0"
                  >
                    <div className="h-2 w-4 bg-white/5" />
                    <div className="h-7 w-7 bg-white/5 rounded-full" />
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div className="h-2 w-32 bg-white/5" />
                      <div className="h-2 w-44 bg-white/5" />
                    </div>
                    <div className="h-5 w-16 bg-white/5" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
