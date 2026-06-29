"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard, ChartEmptyState } from "./chart-card";

type DataPoint = {
  month: string;
  count: number;
};

interface FormsCreatedChartProps {
  data: DataPoint[];
}

export function FormsCreatedChart({ data }: FormsCreatedChartProps) {
  const hasData = data.some((item) => item.count > 0);

  return (
    <ChartCard title="Forms created" description="New forms added over time">
      {!hasData ? (
        <ChartEmptyState message="Form creation activity will appear here once you add forms." />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" vertical={false} />
            <XAxis
              dataKey="month"
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
                    <p className="font-semibold text-neutral-900">{item.month}</p>
                    <p className="text-orange-600 mt-0.5">
                      {item.count} form{item.count !== 1 ? "s" : ""} created
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="count" fill="#fbbf24" radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
