import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, description, children, className = "" }: ChartCardProps) {
  return (
    <div className={`rounded-2xl bg-white border border-orange-100 shadow-sm overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-orange-50">
        <h3 className="text-sm font-bold text-neutral-900">{title}</h3>
        {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

export function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-orange-100 bg-orange-50/30 px-6 text-center">
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  );
}
