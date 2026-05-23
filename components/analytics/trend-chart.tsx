"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { EventTrendPoint } from "@/lib/analytics/types";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
interface TrendChartProps {
  points: EventTrendPoint[];
}

const config: ChartConfig = {
  responseRate: {
    label: "Response rate",
    color: "var(--foreground)",
  },
  attending: {
    label: "Attending",
    color: "var(--foreground)",
  },
};

interface ChartDatum {
  index: number;
  label: string;
  fullLabel: string;
  responseRate: number;
  attending: number;
  total: number;
  opened: number;
}

function formatShortDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function TrendChart({ points }: TrendChartProps) {
  if (points.length === 0) {
    return (
      <div className="aspect-auto h-72 w-full flex items-center justify-center font-sans text-sm text-muted-foreground/60">
        No sent events yet
      </div>
    );
  }

  const data: ChartDatum[] = points.map((p, i) => ({
    index: i,
    label: formatShortDate(p.eventAt),
    fullLabel: p.eventName,
    responseRate: p.responseRate,
    attending: p.attending,
    total: p.total,
    opened: p.opened,
  }));

  return (
    <ChartContainer config={config} className="aspect-auto h-72 w-full">
      <AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="fillResponseRate" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-responseRate)"
              stopOpacity={0.35}
            />
            <stop
              offset="95%"
              stopColor="var(--color-responseRate)"
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          strokeDasharray="2 4"
          className="stroke-white/6"
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
        />
        <YAxis
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={32}
          tickFormatter={(value: number) => `${value}%`}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
        />
        <ChartTooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={
            <ChartTooltipContent
              indicator="dot"
              labelFormatter={(_, payload) => {
                const datum = payload?.[0]?.payload as ChartDatum | undefined;
                if (!datum) return "";
                return `${datum.fullLabel} · ${datum.label}`;
              }}
              formatter={(value, _name, item) => {
                const datum = item?.payload as ChartDatum | undefined;
                if (!datum) return null;
                return (
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="font-sans text-muted-foreground">
                      Response rate
                    </span>
                    <span className="text-foreground font-mono tabular-nums font-medium">
                      {value}% · {datum.attending}/{datum.total} going
                    </span>
                  </div>
                );
              }}
            />
          }
        />
        <Area
          dataKey="responseRate"
          type="monotone"
          fill="url(#fillResponseRate)"
          stroke="var(--foreground)"
          strokeWidth={2}
          dot={{ r: 2.5, fill: "var(--foreground)", strokeWidth: 0 }}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
