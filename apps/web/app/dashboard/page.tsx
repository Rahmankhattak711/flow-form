"use client";

import {
  ArrowRight,
  Calendar,
  ClipboardList,
  Copy,
  FileText,
  Loader2,
  Percent,
  Plus,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
  X,
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

  const recentForms = forms ? [...forms].slice(0,6) : [];

  // Calculate stats
  const totalForms = forms?.length || 0;
  const responsesCount = submissionStats?.total ?? 0;
  const publishedCount = forms?.filter((f) => f.published).length ?? 0;
  const avgCompletionRate =
    totalForms > 0 ? `${Math.round((publishedCount / totalForms) * 100)}%` : "0%";

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            Welcome back, <span className="chai-gradient-text">{user?.fullName || "User"}</span>!
          </h1>
          <p className="text-neutral-600 mt-1">Here is a quick overview of your form performance.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 font-semibold text-white chai-gradient-bg hover:opacity-95 rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Create New Form
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stat 1 */}
        <div className="p-6 rounded-2xl chai-card border border-orange-100 backdrop-blur-sm relative overflow-hidden group hover:border-orange-300 transition duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/40 rounded-full blur-xl pointer-events-none group-hover:bg-orange-300/50 transition" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-semibold">Total Forms</p>
              <h3 className="text-3xl font-extrabold text-neutral-900 mt-2">{totalForms}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-4 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{publishedCount} live for sharing</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="p-6 rounded-2xl chai-card border border-orange-100 backdrop-blur-sm relative overflow-hidden group hover:border-orange-300 transition duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-orange-500/10 transition" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-semibold">Total Responses</p>
              <h3 className="text-3xl font-extrabold text-neutral-900 mt-2">{responsesCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-4 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>From shared public forms</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="p-6 rounded-2xl chai-card border border-orange-100 backdrop-blur-sm relative overflow-hidden group hover:border-orange-300 transition duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/40 rounded-full blur-xl pointer-events-none group-hover:bg-amber-300/50 transition" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-semibold">Published Forms</p>
              <h3 className="text-3xl font-extrabold text-neutral-900 mt-2">{avgCompletionRate}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Percent className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-orange-500 mt-4 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Share links on published forms</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Forms List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">Recent Forms</h2>
            <Link href="/dashboard/forms" className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition flex items-center gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-orange-50 border border-orange-100/40 animate-pulse" />
              ))}
            </div>
          ) : recentForms.length === 0 ? (
            <div className="p-10 rounded-2xl bg-orange-50 border border-orange-100 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-orange-100 flex items-center justify-center text-neutral-500 mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-700">No forms created yet</h3>
              <p className="text-neutral-500 text-sm max-w-sm mt-1 mb-6">
                Ready to collect data? Create your first form in seconds with our builder.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md transition duration-200"
              >
                Create First Form
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentForms.map((form) => (
                <div
                  key={form.id}
                  className="p-6 rounded-2xl chai-card border border-slate-850 hover:border-orange-300 transition duration-300 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-neutral-900 truncate">{form.title}</h3>
                    <p className="text-neutral-600 text-sm mt-1 line-clamp-1">
                      {form.description || "No description provided."}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-neutral-500 mt-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {form.createdAt
                          ? new Date(form.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                            })
                          : "—"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${
                          form.published
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {form.published ? "Published" : "Draft"}
                      </span>
                      {submissionStats?.byFormId[form.id] !== undefined && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {submissionStats.byFormId[form.id]} responses
                        </span>
                      )}
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
                        className="p-3 rounded-xl bg-white border border-orange-100 text-neutral-600 hover:text-orange-500 hover:border-orange-500/30 transition"
                        title="Copy share link"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    )}
                    <Link
                      href={`/dashboard/forms?formId=${form.id}`}
                      className="p-3 rounded-xl bg-white border border-orange-100 text-neutral-600 hover:text-orange-500 hover:border-orange-500/30 transition duration-200"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Info Panel */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-neutral-900">Tips & Resources</h2>

          <div className="p-6 rounded-2xl bg-linear-to-br from-orange-50 via-amber-50 to-white border border-orange-500/10 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-md font-bold text-neutral-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-orange-500" />
              Share forms with anyone
            </h3>
            <p className="text-neutral-600 text-sm leading-relaxed mt-3">
              Publish your form, copy the share link, and send it to anyone — they can fill and submit without signing in.
            </p>
          </div>

          <div className="p-6 rounded-2xl chai-card border border-orange-100 text-left">
            <h3 className="text-md font-bold text-neutral-900">Form Templates</h3>
            <p className="text-neutral-600 text-sm mt-2 leading-relaxed">
              Unlock pre-designed form structures for feedback collection, contact forms, sign-up flows, and customer surveys.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition mt-4 flex items-center gap-1.5"
            >
              Browse templates
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm overflow-y-auto  flex  items-center justify-center z-50 p-8 ">
          <div className="bg-white border border-orange-100 rounded-2xl min-h-screen shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-orange-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <FileText className="w-5.5 h-5.5 text-orange-500" />
                Create New Form
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-600 hover:text-white p-1 rounded-lg border border-transparent hover:border-orange-100 transition"
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
                    <h4 className="text-sm font-semibold text-neutral-900">Choose a template</h4>
                    <p className="text-xs text-neutral-500">Start with a prebuilt form structure.</p>
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
                      className={`rounded-2xl border p-4 text-left transition ${
                        selectedTemplate?.id === template.id
                          ? "border-orange-400 bg-orange-50"
                          : "border-neutral-200 bg-white hover:border-orange-300"
                      }`}
                    >
                      <h5 className="text-sm font-bold text-neutral-900">{template.title}</h5>
                      <p className="text-xs text-neutral-500 mt-2 line-clamp-2">{template.description}</p>
                    </button>
                  ))}
                </div>
                {selectedTemplate && (
                  <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm text-neutral-700">
                    Using the <span className="font-semibold">{selectedTemplate.title}</span> template. You can still customize the title and description.
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 block" htmlFor="title-input">
                  Form Title
                </label>
                <input
                  id="title-input"
                  type="text"
                  {...register("title", { required: !selectedTemplate && "Title is required" })}
                  placeholder={selectedTemplate ? selectedTemplate.title : "e.g. Customer Feedback Survey"}
                  className="w-full bg-white border border-orange-100 rounded-xl py-3 px-4 text-neutral-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
                />
                {errors.title && (
                  <p className="text-xs text-rose-500">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 block" htmlFor="description-input">
                  Description
                </label>
                <textarea
                  id="description-input"
                  rows={3}
                  {...register("description")}
                  placeholder={selectedTemplate ? selectedTemplate.description : "e.g. Help us improve by answering these few questions."}
                  className="w-full bg-white border border-orange-100 rounded-xl py-3 px-4 text-neutral-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 block" htmlFor="start-date-input">
                    Start date
                  </label>
                  <input
                    id="start-date-input"
                    type="datetime-local"
                    {...register("startDate")}
                    className="w-full bg-white border border-orange-100 rounded-xl py-3 px-4 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 block" htmlFor="end-date-input">
                    End date
                  </label>
                  <input
                    id="end-date-input"
                    type="datetime-local"
                    {...register("endDate")}
                    className="w-full bg-white border border-orange-100 rounded-xl py-3 px-4 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-orange-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-orange-100 hover:bg-slate-800 text-neutral-700 transition text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Form"
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
