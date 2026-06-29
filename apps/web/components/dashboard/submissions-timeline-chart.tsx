"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard, ChartEmptyState } from "./chart-card";

type DataPoint = {
  date: string;
  count: number;
};

interface SubmissionsTimelineChartProps {
  data: DataPoint[];
  title?: string;
  description?: string;
}

export function SubmissionsTimelineChart({
  data,
  title = "Submissions over time",
  description = "Daily response volume for this form",
}: SubmissionsTimelineChartProps) {
  const hasData = data.some((item) => item.count > 0);

  return (
    <ChartCard title={title} description={description}>
      {!hasData ? (
        <ChartEmptyState message="No submissions yet. Share your form link to start collecting responses." />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="submissionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#737373" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#737373" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0]?.payload as DataPoint;
                return (
                  <div className="rounded-lg border border-orange-100 bg-white px-3 py-2 shadow-md text-xs">
                    <p className="font-semibold text-neutral-900">{item.date}</p>
                    <p className="text-orange-600 mt-0.5">
                      {item.count} submission{item.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#submissionGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
