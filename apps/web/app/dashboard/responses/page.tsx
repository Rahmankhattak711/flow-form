"use client";

import { FileText, Users } from "lucide-react";
import Link from "next/link";
import { useUser } from "~/hooks/api/auth";
import { useGetAllForms, useGetSubmissionStats } from "~/hooks/api/form";

export default function Page() {
  const { data: user } = useUser();
  const { data: forms, isLoading } = useGetAllForms();
  const { data: submissionStats } = useGetSubmissionStats();

  const totalForms = forms?.length || 0;
  const totalResponses = submissionStats?.total || 0;
  const publishedForms = forms?.filter((form) => form.published).length || 0;
  const getFormTitle = (formId: string) => forms?.find((f) => f.id === formId)?.title || "Unknown Form";

  const formResponseRows = submissionStats?.byFormId
    ? Object.entries(submissionStats.byFormId).map(([formId, responses]) => ({
        formId,
        title: getFormTitle(formId),
        responses,
      }))
    : [];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">Dashboard / Responses</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">Form Responses</h1>
          <p className="text-neutral-600 mt-2">Review response counts across your published and draft forms.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl chai-card border border-orange-100 backdrop-blur-sm relative overflow-hidden group hover:border-orange-300 transition duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/40 rounded-full blur-xl pointer-events-none group-hover:bg-orange-300/50 transition" />
          <div className="flex items-center justify-between relative">
            <div>
              <p className="text-neutral-500 text-sm font-semibold">Total Forms</p>
              <h3 className="text-3xl font-extrabold text-neutral-900 mt-2">{totalForms}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-4 font-medium">
            <span>{publishedForms} published</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl chai-card border border-orange-100 backdrop-blur-sm relative overflow-hidden group hover:border-orange-300 transition duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-orange-500/20 transition" />
          <div className="flex items-center justify-between relative">
            <div>
              <p className="text-neutral-500 text-sm font-semibold">Total Responses</p>
              <h3 className="text-3xl font-extrabold text-neutral-900 mt-2">{totalResponses}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-4">Responses from forms currently shared or in draft.</p>
        </div>

        <div className="p-6 rounded-2xl chai-card border border-orange-100 backdrop-blur-sm relative overflow-hidden group hover:border-orange-300 transition duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/40 rounded-full blur-xl pointer-events-none group-hover:bg-amber-300/50 transition" />
          <div className="flex items-center justify-between relative">
            <div>
              <p className="text-neutral-500 text-sm font-semibold">Shared Forms</p>
              <h3 className="text-3xl font-extrabold text-neutral-900 mt-2">{publishedForms}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-4">Forms currently available for submissions.</p>
        </div>
      </div>

      <div className="rounded-2xl chai-card border border-orange-100 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Response Overview</h2>
            <p className="text-neutral-500 text-sm mt-1">Browse forms and jump to detailed response reports below.</p>
          </div>
          <Link
            href="/dashboard/forms"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-orange-500 border border-orange-200 rounded-xl hover:bg-orange-50 transition"
          >
            View all forms
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4">Form</th>
                <th className="px-6 py-4">Form ID</th>
                <th className="px-6 py-4 text-right">Responses</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground animate-pulse">
                    Loading response data...
                  </td>
                </tr>
              ) : formResponseRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                    No response data found.
                  </td>
                </tr>
              ) : (
                formResponseRows.map((row) => (
                  <tr key={row.formId} className="hover:bg-muted/30 transition-colors duration-150">
                    <td className="px-6 py-4 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-50 border border-orange-100 text-orange-600">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span>{row.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{row.formId}</td>
                    <td className="px-6 py-4 text-right font-semibold text-neutral-900">{row.responses}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/responses/${row.formId}`}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background text-xs font-medium text-foreground hover:bg-muted/20"
                      >
                        View details
                      </Link>
                    </td>
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
