"use client";

import type { RouterOutputs } from "@repo/trpc/client";
import { FileText } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetAllForms, useGetFormFields, useGetFormSubmissions, useGetSubmissionStats } from "~/hooks/api/form";

type ResponseField = RouterOutputs["form"]["getFormFields"][number];
type ResponseSubmission = RouterOutputs["form"]["getFormSubmissions"][number];
type UserForm = RouterOutputs["form"]["listFormsByUserId"][number];
type SubmissionAnswers = ResponseSubmission["answers"];

type Column = {
  id: string;
  label: string;
  labelKey: string;
};

type Row = {
  id: string;
  [key: string]: string;
};

export default function ResponsesPage() {
  const params = useParams();
  const formId = typeof params?.formId === "string" ? params.formId : null;
  const { data: forms } = useGetAllForms();
  const { data: fields } = useGetFormFields(formId);
  const { data: submissions, isLoading, error, refetch } = useGetFormSubmissions(formId);
  const { data: submissionStats } = useGetSubmissionStats();
  const form: UserForm | undefined = forms?.find((f) => f.id === formId);
  const expectedCount = submissionStats?.byFormId?.[formId ?? ""] ?? null;

  const firstSubmission = submissions?.[0];
  const answerKeys = firstSubmission ? Object.keys(firstSubmission.answers as SubmissionAnswers) : [];

  const columns: Column[] =
    fields && fields.length > 0
      ? fields.map((field) => ({ id: field.id, labelKey: field.labelKey, label: field.label }))
      : answerKeys.length > 0
      ? answerKeys.map((key) => ({ id: key, labelKey: key, label: key }))
      : [];

  const columnCount = 2 + columns.length;

  return (
    <div className="space-y-10 p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">Dashboard / Responses</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">{form?.title ?? "Form Responses"}</h1>
          <p className="text-neutral-600 mt-2">Browse individual submissions and response details for this form.</p>
          {expectedCount !== null && (
            <p className="text-sm text-neutral-500 mt-2">Expected responses: {expectedCount}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/responses"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-orange-500 border border-orange-200 rounded-xl hover:bg-orange-50 transition"
          >
            Back to responses
          </Link>
          <button
            type="button"
            onClick={() => refetch?.()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-neutral-100 border border-border rounded-xl bg-background hover:bg-muted/20 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl chai-card border border-orange-100">
          <p className="text-sm text-neutral-500">Form</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Current form</p>
              <p className="mt-1 text-lg font-semibold text-neutral-900">{form?.title ?? "Unknown form"}</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-2xl chai-card border border-orange-100">
          <p className="text-sm text-neutral-500">Submissions</p>
          <p className="mt-3 text-3xl font-extrabold text-neutral-900">{submissions?.length ?? 0}</p>
          <p className="text-sm text-neutral-500 mt-2">Responses loaded for this form.</p>
        </div>
        <div className="p-6 rounded-2xl chai-card border border-orange-100">
          <p className="text-sm text-neutral-500">Total Responses</p>
          <p className="mt-3 text-3xl font-extrabold text-neutral-900">{expectedCount ?? 0}</p>
          <p className="text-sm text-neutral-500 mt-2">Count from the overview stats.</p>
        </div>
      </div>

      <div className="rounded-2xl chai-card border border-orange-100 overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Submission details</h2>
              <p className="text-neutral-500 text-sm mt-1">Each row shows a single response with answer values.</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4">Submission ID</th>
                <th className="px-6 py-4">Submitted At</th>
                {columns.map((col) => (
                  <th key={col.id ?? col.labelKey} className="px-6 py-4">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={columnCount} className="px-6 py-10 text-center text-muted-foreground animate-pulse">
                    Loading submissions...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={columnCount} className="px-6 py-10 text-center text-destructive">
                    Error loading submissions: {String(error)}
                  </td>
                </tr>
              ) : submissions?.length === 0 || !submissions ? (
                <tr>
                  <td colSpan={columnCount} className="px-6 py-10 text-center text-muted-foreground">
                    No submissions found for this form.
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-muted/30 transition-colors duration-150">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{submission.id}</td>
                    <td className="px-6 py-4">{new Date(submission.submittedAt).toLocaleString()}</td>
                    {columns.map((col) => {
                      const key = (col.labelKey as string) || col.id || col.label;
                      const value = submission.answers?.[key];
                      const display = Array.isArray(value) ? value.join(", ") : value ?? "-";
                      return (
                        <td key={key} className="px-6 py-4 text-sm text-neutral-700">
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
