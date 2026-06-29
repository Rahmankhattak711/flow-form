import { format, parseISO } from "date-fns";

type FormWithTitle = { id: string; title: string };
type FormWithStatus = { published: boolean };
type FormWithCreatedAt = { createdAt: string | null };
type SubmissionWithDate = { submittedAt: string };

export function buildResponsesByFormChart(
  forms: FormWithTitle[] | undefined,
  byFormId: Record<string, number> | undefined,
  limit = 8,
) {
  if (!forms?.length) return [];

  return forms
    .map((form) => ({
      name: form.title.length > 22 ? `${form.title.slice(0, 22)}…` : form.title,
      fullName: form.title,
      responses: byFormId?.[form.id] ?? 0,
    }))
    .sort((a, b) => b.responses - a.responses)
    .slice(0, limit);
}

export function buildFormStatusChart(forms: FormWithStatus[] | undefined) {
  const published = forms?.filter((f) => f.published).length ?? 0;
  const draft = Math.max((forms?.length ?? 0) - published, 0);

  return [
    { name: "Published", value: published, fill: "#10b981" },
    { name: "Draft", value: draft, fill: "#f59e0b" },
  ].filter((item) => item.value > 0);
}

export function buildSubmissionsTimeline(submissions: SubmissionWithDate[] | undefined) {
  if (!submissions?.length) return [];

  const byDay = new Map<string, { label: string; count: number }>();

  for (const submission of submissions) {
    const dateKey = submission.submittedAt.slice(0, 10);
    const label = format(parseISO(dateKey), "MMM d");
    const existing = byDay.get(dateKey);
    if (existing) {
      existing.count += 1;
    } else {
      byDay.set(dateKey, { label, count: 1 });
    }
  }

  return Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => ({ date: value.label, count: value.count }));
}

export function buildFormsCreatedChart(forms: FormWithCreatedAt[] | undefined) {
  if (!forms?.length) return [];

  const byMonth = new Map<string, { label: string; count: number }>();

  for (const form of forms) {
    if (!form.createdAt) continue;
    const dateKey = form.createdAt.slice(0, 7);
    const label = format(parseISO(`${dateKey}-01`), "MMM yyyy");
    const existing = byMonth.get(dateKey);
    if (existing) {
      existing.count += 1;
    } else {
      byMonth.set(dateKey, { label, count: 1 });
    }
  }

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => ({ month: value.label, count: value.count }));
}
