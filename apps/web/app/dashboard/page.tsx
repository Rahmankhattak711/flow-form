"use client";

import {
  ArrowRight,
  Calendar,
  ClipboardList,
  Copy,
  FileText,
  Loader2,
  Plus,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
  X,
  BarChart3,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUser } from "~/hooks/api/auth";
import { useCreateForm, useCreateFormField, useGetAllForms, useGetSubmissionStats } from "~/hooks/api/form";
import { fromDatetimeLocalValue } from "~/lib/form-dates";
import { FormTemplate, formTemplates } from "./templates/template";

interface CreateFormInputs {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export default function DashboardPage() {
  const { data: user } = useUser();
  const { data: forms, isLoading } = useGetAllForms();
  const { data: submissionStats } = useGetSubmissionStats();
  const { mutateAsync: createFormAsync } = useCreateForm();
  const createFormField = useCreateFormField();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateFormInputs>({
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit: SubmitHandler<CreateFormInputs> = async (data) => {
    try {
      if (data.startDate && data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
        toast.error("End date must be after start date");
        return;
      }

      const createdForm = await createFormAsync({
        title: selectedTemplate ? selectedTemplate.title : data.title,
        description: selectedTemplate ? selectedTemplate.description : data.description || undefined,
        startDate: fromDatetimeLocalValue(data.startDate) ?? null,
        endDate: fromDatetimeLocalValue(data.endDate) ?? null,
      });

      if (selectedTemplate && createdForm?.id) {
        await Promise.all(
          selectedTemplate.fields.map((field) =>
            createFormField.mutateAsync({
              formId: createdForm.id,
              label: field.label,
              labelKey: field.labelKey,
              type: field.type,
              placeholder: field.placeholder,
              required: field.required,
              order: field.order,
              options: field.options,
            }),
          ),
        );
      }

      toast.success("Form created successfully!");
      setIsModalOpen(false);
      setSelectedTemplate(null);
      reset();
    } catch (err: any) {
      toast.error("Failed to create form", {
        description: err.message || "Please try again later.",
      });
    }
  };

  const recentForms = forms ? [...forms].slice(0, 6) : [];

  // Calculate stats
  const totalForms = forms?.length || 0;
  const responsesCount = submissionStats?.total ?? 0;
  const publishedCount = forms?.filter((f) => f.published).length ?? 0;
  const avgCompletionRate =
    totalForms > 0 ? `${Math.round((publishedCount / totalForms) * 100)}%` : "0%";

  const stats = [
    {
      label: "Total Forms",
      value: totalForms,
      sub: `${publishedCount} live for sharing`,
      icon: ClipboardList,
      iconBg: "bg-orange-50",
      iconBorder: "border-orange-200",
      iconColor: "text-orange-500",
      glowColor: "bg-orange-200/40",
      subIcon: TrendingUp,
      subColor: "text-emerald-500",
      accent: "from-orange-50 to-amber-50",
    },
    {
      label: "Total Responses",
      value: responsesCount,
      sub: "From shared public forms",
      icon: Users,
      iconBg: "bg-orange-500/10",
      iconBorder: "border-orange-500/20",
      iconColor: "text-orange-500",
      glowColor: "bg-orange-500/10",
      subIcon: TrendingUp,
      subColor: "text-emerald-500",
      accent: "from-orange-50/50 to-white",
    },
    {
      label: "Publish Rate",
      value: avgCompletionRate,
      sub: "Share links on published forms",
      icon: BarChart3,
      iconBg: "bg-amber-50",
      iconBorder: "border-amber-200",
      iconColor: "text-amber-600",
      glowColor: "bg-amber-200/40",
      subIcon: Sparkles,
      subColor: "text-orange-500",
      accent: "from-amber-50 to-orange-50/30",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">Overview</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            Welcome back, <span className="chai-gradient-text">{user?.fullName || "User"}</span>!
          </h1>
          <p className="text-neutral-500 mt-1.5">Here&apos;s a quick overview of your form performance.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 font-semibold text-white chai-gradient-bg hover:opacity-95 rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/40 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Create New Form
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const SubIcon = stat.subIcon;
          return (
            <div
              key={i}
              className={`p-6 rounded-2xl bg-gradient-to-br ${stat.accent} border border-orange-100 backdrop-blur-sm relative overflow-hidden group hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100 transition-all duration-300`}
            >
              <div className={`absolute top-0 right-0 w-28 h-28 ${stat.glowColor} rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500`} />
              <div className="flex items-center justify-between relative">
                <div>
                  <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-4xl font-extrabold text-neutral-900 mt-2 tabular-nums">{stat.value}</h3>
                </div>
                <div className={`w-13 h-13 rounded-2xl ${stat.iconBg} border ${stat.iconBorder} flex items-center justify-center ${stat.iconColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className={`flex items-center gap-1.5 text-xs ${stat.subColor} mt-4 font-semibold`}>
                <SubIcon className="w-3.5 h-3.5" />
                <span>{stat.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Forms List */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Recent Forms</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Your latest created forms</p>
            </div>
            <Link href="/dashboard/forms" className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition flex items-center gap-1 group">
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100/60 animate-pulse" />
              ))}
            </div>
          ) : recentForms.length === 0 ? (
            <div className="p-12 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50/50 border border-orange-100 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white border border-orange-200 flex items-center justify-center text-orange-400 mb-4 shadow-sm">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-700">No forms created yet</h3>
              <p className="text-neutral-500 text-sm max-w-sm mt-1 mb-6">
                Ready to collect data? Create your first form in seconds with our builder.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 font-bold text-white chai-gradient-bg rounded-xl shadow-md shadow-orange-500/20 transition duration-200 hover:opacity-90"
              >
                Create First Form
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentForms.map((form) => (
                <div
                  key={form.id}
                  className="p-5 rounded-2xl bg-white border border-orange-100 hover:border-orange-300 hover:shadow-md hover:shadow-orange-100/60 transition-all duration-300 flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 flex items-center justify-center text-orange-500 shrink-0 group-hover:scale-105 transition-transform duration-200">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-neutral-900 truncate">{form.title}</h3>
                      <p className="text-neutral-500 text-xs mt-0.5 line-clamp-1">
                        {form.description || "No description provided."}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-neutral-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {form.createdAt
                            ? new Date(form.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                            : "—"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border text-[10px] ${
                            form.published
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}
                        >
                          {form.published ? "Published" : "Draft"}
                        </span>
                        {submissionStats?.byFormId[form.id] !== undefined && (
                          <span className="flex items-center gap-1 text-orange-400 font-medium">
                            <Users className="w-3 h-3" />
                            {submissionStats.byFormId[form.id]} responses
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {form.published && (
                      <button
                        type="button"
                        onClick={() => {
                          const url = `${window.location.origin}/f/${form.id}`;
                          void navigator.clipboard.writeText(url);
                          toast.success("Share link copied");
                        }}
                        className="p-2.5 rounded-xl bg-orange-50 border border-orange-100 text-orange-400 hover:text-orange-600 hover:border-orange-400 hover:bg-orange-100 transition-all duration-200"
                        title="Copy share link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                    <Link
                      href={`/dashboard/forms?formId=${form.id}`}
                      className="p-2.5 rounded-xl bg-white border border-orange-100 text-neutral-500 hover:text-orange-500 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Info Panel */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-neutral-900">Tips &amp; Resources</h2>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/5 via-amber-50 to-white border border-orange-200/60 relative overflow-hidden group hover:border-orange-300 transition-all duration-300">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-500">
                <Share2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">Share forms with anyone</h3>
            </div>
            <p className="text-neutral-600 text-xs leading-relaxed">
              Publish your form, copy the share link, and send it to anyone — they can fill and submit without signing in.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-orange-100 hover:border-orange-200 hover:shadow-md hover:shadow-orange-50 transition-all duration-300 group">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">Form Templates</h3>
            </div>
            <p className="text-neutral-500 text-xs mt-1 leading-relaxed">
              Unlock pre-designed form structures for feedback collection, contact forms, sign-up flows, and customer surveys.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-orange-500 hover:text-orange-600 transition mt-4 flex items-center gap-1.5 group"
            >
              Browse templates
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-white/80" />
              <h3 className="text-sm font-bold text-white">Quick Start</h3>
            </div>
            <p className="text-white/80 text-xs leading-relaxed">
              Create your first form in under 60 seconds using one of our ready-made templates.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition border border-white/30"
            >
              Get started →
            </button>
          </div>
        </div>

      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto flex items-start justify-center z-50 p-6 pt-16">
          <div className="bg-white border border-orange-100 rounded-2xl w-full max-w-2xl shadow-2xl shadow-orange-500/10 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-orange-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Create New Form</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg border border-transparent hover:border-neutral-200 hover:bg-neutral-50 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

              {/* Template picker */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Choose a template</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Start with a prebuilt form structure.</p>
                  </div>
                  {selectedTemplate && (
                    <button
                      type="button"
                      onClick={() => setSelectedTemplate(null)}
                      className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition"
                    >
                      Clear template
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {formTemplates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template)}
                      className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                        selectedTemplate?.id === template.id
                          ? "border-orange-400 bg-orange-50 shadow-sm shadow-orange-200"
                          : "border-neutral-200 bg-white hover:border-orange-300 hover:bg-orange-50/40"
                      }`}
                    >
                      <h5 className="text-sm font-bold text-neutral-900">{template.title}</h5>
                      <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2">{template.description}</p>
                    </button>
                  ))}
                </div>
                {selectedTemplate && (
                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-3.5 text-xs text-neutral-700 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                    Using the <span className="font-bold text-orange-600">{selectedTemplate.title}</span> template. You can still customize the title and description.
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-700 block" htmlFor="title-input">
                  Form Title
                </label>
                <input
                  id="title-input"
                  type="text"
                  {...register("title", { required: !selectedTemplate && "Title is required" })}
                  placeholder={selectedTemplate ? selectedTemplate.title : "e.g. Customer Feedback Survey"}
                  className="w-full bg-white border border-neutral-200 rounded-xl py-2.5 px-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition text-sm"
                />
                {errors.title && (
                  <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-700 block" htmlFor="description-input">
                  Description <span className="text-neutral-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="description-input"
                  rows={3}
                  {...register("description")}
                  placeholder={selectedTemplate ? selectedTemplate.description : "e.g. Help us improve by answering these few questions."}
                  className="w-full bg-white border border-neutral-200 rounded-xl py-2.5 px-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition resize-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700 block" htmlFor="start-date-input">
                    Start date
                  </label>
                  <input
                    id="start-date-input"
                    type="datetime-local"
                    {...register("startDate")}
                    className="w-full bg-white border border-neutral-200 rounded-xl py-2.5 px-4 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700 block" htmlFor="end-date-input">
                    End date
                  </label>
                  <input
                    id="end-date-input"
                    type="datetime-local"
                    {...register("endDate")}
                    className="w-full bg-white border border-neutral-200 rounded-xl py-2.5 px-4 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition text-sm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-800 transition text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 font-bold text-white chai-gradient-bg rounded-xl shadow-md shadow-orange-500/20 transition hover:opacity-90 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Form
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
