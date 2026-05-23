"use client";
import { BestSendTime } from "@/lib/analytics/types";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
interface BestSendTimeChartProps {
  buckets: BestSendTime[];
}

const config: ChartConfig = {
  responseRate: {
    label: "Response rate",
    color: "var(--foreground)",
  },
};

interface ChartDatum {
  slot: string;
  responseRate: number;
  attendingRate: number;
  sampleSize: number;
}

export function BestSendTimeChart({ buckets }: BestSendTimeChartProps) {
  const data: ChartDatum[] = buckets.map((b) => ({
    slot: `${b.dayLabel.slice(0, 3)} ${b.hourLabel}`,
    responseRate: b.responseRate,
    attendingRate: b.attendingRate,
    sampleSize: b.sampleSize,
  }));

  return (
    <ChartContainer config={config} className="aspect-auto h-65 w-full">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 12, right: 32, top: 8, bottom: 0 }}
      >
        <defs>
          <linearGradient id="fillBestSendTime" x1="0" y1="0" x2="1" y2="0">
            <stop
              offset="0%"
              stopColor="var(--foreground)"
              stopOpacity={0.55}
            />
            <stop
              offset="100%"
              stopColor="var(--foreground)"
              stopOpacity={0.85}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          horizontal={false}
          strokeDasharray="2 4"
          className="stroke-white/6"
        />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          tickFormatter={(value: number) => `${value}%`}
          hide
        />
        <YAxis
          dataKey="slot"
          type="category"
          tickLine={false}
          axisLine={false}
          width={96}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
        />
        <ChartTooltip
          cursor={{ fill: "var(--foreground)", opacity: 0.05 }}
          content={
            <ChartTooltipContent
              formatter={(value, _name, item) => {
                const datum = item?.payload as ChartDatum | undefined;
                if (!datum) return null;
                return (
                  <div className="flex w-full flex-col gap-0.5 min-w-40">
                    <div className="flex justify-between gap-3">
                      <span className="font-sans text-muted-foreground">
                        Response rate
                      </span>
                      <span className="font-mono tabular-nums font-medium">
                        {value}%
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="font-sans text-muted-foreground">
                        Sample
                      </span>
                      <span className="font-mono tabular-nums text-muted-foreground">
                        {datum.sampleSize} sent · {datum.attendingRate}% confirm
                      </span>
                    </div>
                  </div>
                );
              }}
            />
          }
        />
        <Bar
          dataKey="responseRate"
          fill="url(#fillBestSendTime)"
          radius={0}
          minPointSize={2}
        >
          <LabelList
            dataKey="responseRate"
            position="right"
            offset={4}
            formatter={(value) =>
              typeof value === "number" ? `${value}%` : ""
            }
            className="fill-foreground font-mono"
            fontSize={10}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
