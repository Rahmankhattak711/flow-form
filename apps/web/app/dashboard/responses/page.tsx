"use client";

import { BarChart3, FileText, TrendingUp, Users, ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useGetAllForms, useGetSubmissionStats } from "~/hooks/api/form";

export default function Page() {
  const { data: forms, isLoading } = useGetAllForms();
  const { data: submissionStats } = useGetSubmissionStats();
  const [search, setSearch] = useState("");

  const totalForms = forms?.length || 0;
  const totalResponses = submissionStats?.total || 0;
  const publishedForms = forms?.filter((form) => form.published).length || 0;
  const avgResponses = totalForms > 0 ? Math.round(totalResponses / totalForms) : 0;

  const getFormTitle = (formId: string) => forms?.find((f) => f.id === formId)?.title || "Unknown Form";
  const getFormPublished = (formId: string) => forms?.find((f) => f.id === formId)?.published ?? false;

  const formResponseRows = submissionStats?.byFormId
    ? Object.entries(submissionStats.byFormId).map(([formId, responses]) => ({
        formId,
        title: getFormTitle(formId),
        responses,
        published: getFormPublished(formId),
      }))
    : [];

  const filtered = formResponseRows.filter((row) =>
    row.title.toLowerCase().includes(search.toLowerCase()) ||
    row.formId.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    {
      label: "Total Forms",
      value: totalForms,
      sub: `${publishedForms} published`,
      icon: FileText,
      iconBg: "bg-orange-50",
      iconBorder: "border-orange-200",
      iconColor: "text-orange-500",
      glow: "bg-orange-200/40",
      subColor: "text-emerald-500",
    },
    {
      label: "Total Responses",
      value: totalResponses,
      sub: "Across all forms",
      icon: Users,
      iconBg: "bg-orange-500/10",
      iconBorder: "border-orange-500/20",
      iconColor: "text-orange-500",
      glow: "bg-orange-500/10",
      subColor: "text-emerald-500",
    },
    {
      label: "Avg. per Form",
      value: avgResponses,
      sub: "Responses per form",
      icon: BarChart3,
      iconBg: "bg-amber-50",
      iconBorder: "border-amber-200",
      iconColor: "text-amber-600",
      glow: "bg-amber-200/40",
      subColor: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">Analytics</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">Form Responses</h1>
          <p className="text-neutral-500 mt-1.5">Review response counts across your published and draft forms.</p>
        </div>
        <Link
          href="/dashboard/forms"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-orange-500 border border-orange-200 rounded-xl hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 group"
        >
          View all forms
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-orange-100 backdrop-blur-sm relative overflow-hidden group hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100 transition-all duration-300"
            >
              <div className={`absolute top-0 right-0 w-28 h-28 ${stat.glow} rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500`} />
              <div className="flex items-center justify-between relative">
                <div>
                  <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-4xl font-extrabold text-neutral-900 mt-2 tabular-nums">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} border ${stat.iconBorder} flex items-center justify-center ${stat.iconColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className={`flex items-center gap-1.5 text-xs ${stat.subColor} mt-4 font-semibold`}>
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{stat.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="rounded-2xl bg-white border border-orange-100 overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="px-6 py-5 border-b border-orange-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Response Overview</h2>
            <p className="text-neutral-500 text-xs mt-0.5">Browse forms and jump to detailed response reports.</p>
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search forms..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-orange-100 bg-orange-50/60">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500">Form</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500">Form ID</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500 text-right">Responses</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50 text-sm">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-8 rounded-lg bg-orange-50 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-400">
                        <FileText className="w-6 h-6" />
                      </div>
                      <p className="text-neutral-500 font-medium">
                        {search ? "No forms match your search." : "No response data found."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr
                    key={row.formId}
                    className="hover:bg-orange-50/40 transition-colors duration-150 group"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 flex items-center justify-center text-orange-500 shrink-0 group-hover:scale-105 transition-transform duration-200">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-sm truncate max-w-[200px]">{row.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                          row.published
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        {row.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-neutral-400 max-w-[140px] truncate">{row.formId}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-900">
                        <Users className="w-3.5 h-3.5 text-orange-400" />
                        {row.responses}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/responses/${row.formId}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-xs font-bold text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 group"
                      >
                        View details
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-orange-50 bg-orange-50/30 flex items-center justify-between">
            <p className="text-xs text-neutral-400 font-medium">
              Showing <span className="text-neutral-700 font-bold">{filtered.length}</span> form{filtered.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-neutral-400">
              Total responses: <span className="text-orange-500 font-bold">{totalResponses}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
