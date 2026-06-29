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
  name: string;
  fullName: string;
  responses: number;
};

interface ResponsesBarChartProps {
  data: DataPoint[];
  title?: string;
  description?: string;
  emptyMessage?: string;
}

export function ResponsesBarChart({
  data,
  title = "Responses by form",
  description = "Top forms ranked by total submissions",
  emptyMessage = "No response data yet. Publish a form and share it to see activity here.",
}: ResponsesBarChartProps) {
  const hasData = data.some((item) => item.responses > 0);

  return (
    <ChartCard title={title} description={description}>
      {!hasData ? (
        <ChartEmptyState message={emptyMessage} />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#737373" }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={56}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#737373" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(251, 146, 60, 0.08)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0]?.payload as DataPoint;
                return (
                  <div className="rounded-lg border border-orange-100 bg-white px-3 py-2 shadow-md text-xs">
                    <p className="font-semibold text-neutral-900">{item.fullName}</p>
                    <p className="text-orange-600 mt-0.5">{item.responses} responses</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="responses" fill="#f97316" radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
