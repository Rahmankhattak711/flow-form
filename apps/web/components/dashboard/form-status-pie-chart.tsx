"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard, ChartEmptyState } from "./chart-card";

type DataPoint = {
  name: string;
  value: number;
  fill: string;
};

interface FormStatusPieChartProps {
  data: DataPoint[];
  title?: string;
  description?: string;
}

export function FormStatusPieChart({
  data,
  title = "Form status",
  description = "Published vs draft forms",
}: FormStatusPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartCard title={title} description={description}>
      {total === 0 ? (
        <ChartEmptyState message="Create your first form to see status breakdown." />
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={3}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0]?.payload as DataPoint;
                  return (
                    <div className="rounded-lg border border-orange-100 bg-white px-3 py-2 shadow-md text-xs">
                      <p className="font-semibold text-neutral-900">{item.name}</p>
                      <p className="text-neutral-600 mt-0.5">
                        {item.value} form{item.value !== 1 ? "s" : ""}
                      </p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex sm:flex-col gap-3 w-full sm:w-auto">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                <span className="text-neutral-700 font-medium">{item.name}</span>
                <span className="text-neutral-400 tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ChartCard>
  );
}
