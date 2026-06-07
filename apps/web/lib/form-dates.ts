/** Convert ISO string to value for `<input type="datetime-local" />`. */
export function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Convert datetime-local input to ISO string for API, or undefined if empty. */
export function fromDatetimeLocalValue(value: string): string | undefined {
  if (!value.trim()) return undefined;
  return new Date(value).toISOString();
}

export function formatFormDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
): string | null {
  if (!startDate && !endDate) return null;
  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  if (startDate && endDate) return `${fmt(startDate)} → ${fmt(endDate)}`;
  if (startDate) return `Opens ${fmt(startDate)}`;
  return `Closes ${fmt(endDate!)}`;
}
