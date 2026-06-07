"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormInput, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { FormFieldInput } from "~/components/forms/form-field-input";
import { useGetPublicForm, useSubmitForm } from "~/hooks/api/form";
import { formatFormDateRange } from "~/lib/form-dates";

type Answers = Record<string, string | string[]>;

export default function PublicFormPage() {
  const params = useParams();
  const formId = typeof params.formId === "string" ? params.formId : "";

  const { data: form, isLoading, isError, error } = useGetPublicForm(formId);
  const { mutateAsync: submitForm, isSuccess: submitted } = useSubmitForm();

  const [answers, setAnswers] = useState<Answers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedFields = useMemo(() => {
    return [...(form?.fields ?? [])].sort((a, b) => a.order - b.order);
  }, [form?.fields]);

  function handleChange(labelKey: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [labelKey]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formId) return;

    setIsSubmitting(true);
    try {
      await submitForm({ formId, answers });
      toast.success("Response submitted", {
        description: "Thank you for filling out this form.",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not submit form";
      toast.error("Submission failed", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#fafaf9] text-neutral-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          <p className="text-neutral-600">Loading form...</p>
        </div>
      </main>
    );
  }

  if (isError || !form) {
    return (
      <main className="min-h-screen bg-[#fafaf9] text-neutral-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full chai-card p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-neutral-900">Form unavailable</h1>
          <p className="text-neutral-600 mt-2 text-sm">
            {error?.message || "This form may be unpublished, closed, or the link is invalid."}
          </p>
          <Link
            href="/"
            className="inline-block mt-6 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            Go to FlowForm home
          </Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#fafaf9] text-neutral-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full chai-card border-emerald-200 p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-neutral-900">Thank you!</h1>
          <p className="text-neutral-600 mt-2 text-sm">
            Your response to &quot;{form.title}&quot; was submitted successfully.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf9] text-neutral-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

      <header className="relative z-10 max-w-3xl mx-auto px-6 py-8 flex items-center gap-2">
        <FormInput className="w-7 h-7 text-orange-500" />
        <span className="font-bold text-lg text-neutral-900">
          Flow<span className="chai-gradient-text">Form</span>
        </span>
      </header>

      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-16">
        <div className="chai-card p-8 shadow-lg">
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">{form.title}</h1>
          {form.description && (
            <p className="mt-3 text-neutral-600 leading-relaxed">{form.description}</p>
          )}
          {formatFormDateRange(form.startDate, form.endDate) && (
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-3 py-1.5">
              {formatFormDateRange(form.startDate, form.endDate)}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            {sortedFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-800">
                  {field.label}
                  {field.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <FormFieldInput
                  field={field}
                  value={answers[field.labelKey] ?? (field.type === "checkbox" ? [] : "")}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            ))}

            {sortedFields.length === 0 && (
              <p className="text-sm text-neutral-500">This form has no fields yet.</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || sortedFields.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 font-semibold text-white chai-gradient-bg hover:opacity-95 rounded-xl shadow-lg shadow-orange-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-neutral-500 mt-8">
          Powered by{" "}
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
            FlowForm
          </Link>
        </p>
      </div>
    </main>
  );
}
