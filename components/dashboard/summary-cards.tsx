interface SummaryCardsProps {
  summary: {
    total: number;
    attending: number;
    maybe: number;
    declined: number;
    pending: number;
  };
}

const cards = [
  { key: "total", label: "Invited" },
  { key: "attending", label: "Attending" },
  { key: "maybe", label: "Maybe" },
  { key: "declined", label: "Declined" },
  { key: "pending", label: "Pending" },
] as const;

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border border-white/8 bg-white/2 divide-x-0 sm:divide-x divide-y sm:divide-y-0 divide-white/6">
      {cards.map(({ key, label }) => (
        <div key={key} className="flex flex-col gap-1 px-4 py-3.5 group/stat">
          <span className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          <span className="font-mono text-2xl font-semibold text-foreground tabular-nums leading-none">
            {summary[key]}
          </span>
        </div>
      ))}
    </div>
  );
}
