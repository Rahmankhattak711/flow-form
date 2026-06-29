"use client";

import type { RouterOutputs } from "@repo/trpc/client";
import { ArrowLeft, FileText, RefreshCw, Users, Calendar, CheckCircle2, Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetAllForms, useGetFormFields, useGetFormSubmissions, useGetSubmissionStats, useDeleteFormSubmission } from "~/hooks/api/form";
import { toast } from "sonner";

type ResponseField = RouterOutputs["form"]["getFormFields"][number];
type ResponseSubmission = RouterOutputs["form"]["getFormSubmissions"][number];
type UserForm = RouterOutputs["form"]["listFormsByUserId"][number];
type SubmissionAnswers = ResponseSubmission["answers"];

type Column = {
  id: string;
  label: string;
  labelKey: string;
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

  const columnCount = 3 + columns.length;

  const deleteSubmission = useDeleteFormSubmission();

  async function handleDeleteSubmission(submissionId: string) {
    if (!formId) return;
    if (!window.confirm("Are you sure you want to delete this submission?")) return;
    try {
      await deleteSubmission.mutateAsync({ submissionId, formId });
      toast.success("Submission deleted successfully");
    } catch {
      toast.error("Failed to delete submission");
    }
  }

  const stats = [
    {
      label: "Form",
      value: form?.title ?? "Unknown form",
      sub: "Current form",
      icon: FileText,
      iconBg: "bg-orange-50",
      iconBorder: "border-orange-200",
      iconColor: "text-orange-500",
      glow: "bg-orange-200/30",
      isText: true,
    },
    {
      label: "Submissions Loaded",
      value: submissions?.length ?? 0,
      sub: "Responses in this view",
      icon: Users,
      iconBg: "bg-orange-500/10",
      iconBorder: "border-orange-500/20",
      iconColor: "text-orange-500",
      glow: "bg-orange-500/10",
      isText: false,
    },
    {
      label: "Total Responses",
      value: expectedCount ?? 0,
      sub: "From overview stats",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconBorder: "border-emerald-200",
      iconColor: "text-emerald-500",
      glow: "bg-emerald-200/30",
      isText: false,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">Responses / Detail</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            {form?.title ?? "Form Responses"}
          </h1>
          <p className="text-neutral-500 mt-1.5">Browse individual submissions and response details for this form.</p>
          {expectedCount !== null && (
            <p className="text-xs text-neutral-400 mt-1">
              <span className="font-semibold text-orange-500">{expectedCount}</span> total responses recorded
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/responses"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-orange-500 border border-orange-200 rounded-xl hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to responses
          </Link>
          <button
            type="button"
            onClick={() => refetch?.()}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-neutral-600 border border-neutral-200 rounded-xl bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 group"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-orange-100 relative overflow-hidden group hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100 transition-all duration-300"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.glow} rounded-full blur-2xl pointer-events-none`} />
              <div className="flex items-center gap-4 relative">
                <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} border ${stat.iconBorder} flex items-center justify-center ${stat.iconColor} shadow-sm shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{stat.label}</p>
                  {stat.isText ? (
                    <p className="text-base font-bold text-neutral-900 mt-0.5 truncate">{stat.value}</p>
                  ) : (
                    <p className="text-3xl font-extrabold text-neutral-900 mt-0.5 tabular-nums">{stat.value}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-neutral-400 mt-3 font-medium">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Submission Table */}
      <div className="rounded-2xl bg-white border border-orange-100 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-orange-100 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Submission Details</h2>
            <p className="text-neutral-500 text-xs mt-0.5">Each row shows a single response with answer values.</p>
          </div>
          {submissions && submissions.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full">
              <Users className="w-3.5 h-3.5 text-orange-500" />
              {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-orange-100 bg-orange-50/60">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500 whitespace-nowrap">
                  # &nbsp;ID
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500 whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Submitted At
                  </span>
                </th>
                {columns.map((col) => (
                  <th key={col.id ?? col.labelKey} className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500 whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500 whitespace-nowrap text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50 text-sm">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={columnCount} className="px-6 py-4">
                      <div className="h-8 rounded-lg bg-orange-50 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={columnCount} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <p className="text-red-500 font-medium text-sm">Error loading submissions</p>
                      <p className="text-neutral-400 text-xs">{String(error)}</p>
                    </div>
                  </td>
                </tr>
              ) : submissions?.length === 0 || !submissions ? (
                <tr>
                  <td colSpan={columnCount} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-400">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="text-neutral-600 font-semibold">No submissions found</p>
                      <p className="text-neutral-400 text-xs">Share this form to start collecting responses.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                submissions.map((submission, rowIdx) => (
                  <tr
                    key={submission.id}
                    className="hover:bg-orange-50/40 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {rowIdx + 1}
                        </span>
                        <span className="font-mono text-xs text-neutral-400 truncate max-w-[100px]">{submission.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-neutral-600 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        {new Date(submission.submittedAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    {columns.map((col) => {
                      const key = (col.labelKey as string) || col.id || col.label;
                      const value = submission.answers?.[key];
                      const display = Array.isArray(value) ? value.join(", ") : value ?? "—";
                      return (
                        <td key={key} className="px-6 py-4 text-sm text-neutral-700 max-w-[200px]">
                          <span className="line-clamp-2">{display}</span>
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteSubmission(submission.id)}
                        disabled={deleteSubmission.status === "pending"}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition border border-transparent hover:border-rose-100 disabled:opacity-50"
                        title="Delete response"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {submissions && submissions.length > 0 && (
          <div className="px-6 py-3 border-t border-orange-50 bg-orange-50/30 flex items-center justify-between">
            <p className="text-xs text-neutral-400 font-medium">
              <span className="text-neutral-700 font-bold">{submissions.length}</span> submission{submissions.length !== 1 ? "s" : ""} loaded
            </p>
            <p className="text-xs text-neutral-400">
              {columns.length} field{columns.length !== 1 ? "s" : ""} per response
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
