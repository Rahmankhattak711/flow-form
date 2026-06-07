"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useCreateForm,
  useCreateFormField,
  useDeleteFormField,
  useGetAllForms,
  useGetFormFields,
  usePublishForm,
  useUpdateForm,
  useUpdateFormField,
} from "~/hooks/api/form";
import { fromDatetimeLocalValue, formatFormDateRange, toDatetimeLocalValue } from "~/lib/form-dates";
import { FormFieldInput } from "~/components/forms/form-field-input";
import { toast } from "sonner";
import {
  Copy,
  ExternalLink,
  Globe,
  GlobeLock,
  Loader2,
  Plus,
  Share2,
  CalendarRange,
  Save,
} from "lucide-react";

type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "number"
  | "phone"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

interface FieldData {
  id?: string;
  label: string;
  labelKey: string;
  type: FieldType;
  placeholder: string;
  required: boolean;
  order: number;
  options: string;
}

const emptyField: FieldData = {
  label: "",
  labelKey: "",
  type: "text",
  placeholder: "",
  required: false,
  order: 0,
  options: "",
};

function getShareUrl(formId: string) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/f/${formId}`;
  }
  return `/f/${formId}`;
}

function FormsPageContent() {
  const searchParams = useSearchParams();
  const formIdFromUrl = searchParams.get("formId");

  const { data: forms, isLoading: formsLoading } = useGetAllForms();
  const createForm = useCreateForm();
  const createField = useCreateFormField();
  const updateField = useUpdateFormField();
  const deleteField = useDeleteFormField();
  const publishForm = usePublishForm();
  const updateForm = useUpdateForm();

  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const { data: fields, isLoading: fieldsLoading, refetch } = useGetFormFields(selectedFormId);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [fieldData, setFieldData] = useState<FieldData>(emptyField);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editFieldData, setEditFieldData] = useState<FieldData | null>(null);

  const selectedForm = forms?.find((f) => f.id === selectedFormId);

  useEffect(() => {
    if (formIdFromUrl && forms?.some((f) => f.id === formIdFromUrl)) {
      setSelectedFormId(formIdFromUrl);
    }
  }, [formIdFromUrl, forms]);

  useEffect(() => {
    if (selectedFormId) refetch();
  }, [selectedFormId, refetch]);

  useEffect(() => {
    if (!selectedForm) return;
    setEditTitle(selectedForm.title);
    setEditDescription(selectedForm.description ?? "");
    setEditStartDate(toDatetimeLocalValue(selectedForm.startDate));
    setEditEndDate(toDatetimeLocalValue(selectedForm.endDate));
  }, [selectedForm]);

  const sortedFields = useMemo(
    () => [...(fields || [])].sort((a, b) => a.order - b.order),
    [fields],
  );

  function patchFieldFromEvent(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    prev: FieldData,
  ): FieldData {
    const { name, value, type } = e.target;
    return {
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    };
  }

  async function handleCreateForm(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (formStartDate && formEndDate && new Date(formEndDate) <= new Date(formStartDate)) {
        toast.error("End date must be after start date");
        return;
      }

      const res = await createForm.mutateAsync({
        title: formTitle,
        description: formDescription || undefined,
        startDate: fromDatetimeLocalValue(formStartDate) ?? null,
        endDate: fromDatetimeLocalValue(formEndDate) ?? null,
      });
      setFormTitle("");
      setFormDescription("");
      setFormStartDate("");
      setFormEndDate("");
      if (res?.id) {
        setSelectedFormId(res.id);
        toast.success("Form created");
      }
    } catch {
      toast.error("Failed to create form");
    }
  }

  async function handleCreateField(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFormId) return;

    try {
      const parsedOptions =
        fieldData.options.trim().length > 0
          ? fieldData.options.split("\n").map((item) => item.trim()).filter(Boolean)
          : undefined;

      await createField.mutateAsync({
        formId: selectedFormId,
        label: fieldData.label,
        labelKey: fieldData.labelKey,
        type: fieldData.type,
        placeholder: fieldData.placeholder || undefined,
        required: fieldData.required,
        order: Number(fieldData.order),
        options: parsedOptions,
      });

      setFieldData(emptyField);
      await refetch();
      toast.success("Field added");
    } catch {
      toast.error("Failed to add field");
    }
  }

  async function handleUpdateField(e: React.FormEvent) {
    e.preventDefault();
    if (!editingFieldId || !editFieldData) return;

    try {
      await updateField.mutateAsync({
        id: editingFieldId,
        label: editFieldData.label,
        labelKey: editFieldData.labelKey,
        type: editFieldData.type,
        placeholder: editFieldData.placeholder || undefined,
        required: editFieldData.required,
        order: Number(editFieldData.order),
        options: editFieldData.options
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setEditingFieldId(null);
      setEditFieldData(null);
      await refetch();
      toast.success("Field updated");
    } catch {
      toast.error("Failed to update field");
    }
  }

  async function handleDeleteField(fieldId: string) {
    try {
      await deleteField.mutateAsync({ id: fieldId });
      if (editingFieldId === fieldId) {
        setEditingFieldId(null);
        setEditFieldData(null);
      }
      await refetch();
      toast.success("Field deleted");
    } catch {
      toast.error("Failed to delete field");
    }
  }

  async function handleTogglePublish() {
    if (!selectedFormId || !selectedForm) return;
    try {
      await publishForm.mutateAsync({
        formId: selectedFormId,
        published: !selectedForm.published,
      });
      toast.success(selectedForm.published ? "Form unpublished" : "Form published — share link is live");
    } catch {
      toast.error("Failed to update publish status");
    }
  }

  async function handleUpdateFormSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFormId) return;

    if (editStartDate && editEndDate && new Date(editEndDate) <= new Date(editStartDate)) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      await updateForm.mutateAsync({
        formId: selectedFormId,
        title: editTitle,
        description: editDescription || null,
        startDate: fromDatetimeLocalValue(editStartDate) ?? null,
        endDate: fromDatetimeLocalValue(editEndDate) ?? null,
      });
      toast.success("Form settings saved");
    } catch {
      toast.error("Failed to save form settings");
    }
  }

  function copyShareLink() {
    if (!selectedFormId) return;
    void navigator.clipboard.writeText(getShareUrl(selectedFormId));
    toast.success("Share link copied");
  }

  function handleEditField(field: (typeof sortedFields)[number]) {
    setEditingFieldId(field.id);
    setEditFieldData({
      id: field.id,
      label: field.label || "",
      labelKey: field.labelKey || "",
      type: (field.type as FieldType) || "text",
      placeholder: field.placeholder || "",
      required: field.required ?? false,
      order: field.order ?? 0,
      options: (field.options || []).join("\n"),
    });
  }

  const inputClass =
    "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 outline-none chai-input-focus";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
          Form Builder
        </h1>
        <p className="text-neutral-600 mt-1">
          Build your form, publish it, and share the link so anyone can fill and submit responses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="rounded-2xl border border-orange-100 bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-neutral-900">Your Forms</h2>
              <span className="text-xs font-semibold text-neutral-500 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                {forms?.length ?? 0}
              </span>
            </div>

            {formsLoading && (
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            )}

            {!formsLoading && forms?.length === 0 && (
              <p className="text-sm text-neutral-500">No forms yet. Create one below.</p>
            )}

            <div className="space-y-2 mt-3 max-h-[420px] overflow-y-auto">
              {forms?.map((form) => (
                <button
                  key={form.id}
                  type="button"
                  onClick={() => setSelectedFormId(form.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    selectedFormId === form.id
                      ? "border-orange-300 bg-orange-50"
                      : "border-neutral-200 bg-white hover:border-orange-300 hover:shadow-sm"
                  }`}
                >
                  <div className="font-semibold text-neutral-900 truncate">{form.title}</div>
                  {form.description && (
                    <p className="mt-1 text-xs text-neutral-500 line-clamp-2">{form.description}</p>
                  )}
                  <span
                    className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      form.published
                        ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                        : "text-amber-400 border-amber-500/30 bg-amber-500/10"
                    }`}
                  >
                    {form.published ? "Published" : "Draft"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Create form */}
          <div className="rounded-2xl border border-orange-100 bg-white shadow-sm p-5">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-orange-500" />
              New Form
            </h2>
            <form onSubmit={handleCreateForm} className="mt-4 space-y-3">
              <input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Form title"
                className={inputClass}
                required
              />
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Description (optional)"
                className={`${inputClass} resize-none`}
                rows={2}
              />
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-500 mb-1 block">Start date</label>
                  <input
                    type="datetime-local"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-500 mb-1 block">End date</label>
                  <input
                    type="datetime-local"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 transition"
              >
                Create Form
              </button>
            </form>
          </div>
        </aside>

        {/* Main */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {!selectedFormId ? (
            <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/30 p-12 text-center">
              <Share2 className="w-10 h-10 text-orange-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-neutral-700">Select or create a form</h3>
              <p className="text-neutral-500 text-sm mt-2 max-w-md mx-auto">
                Choose a form from the sidebar to add fields, preview it, and get a shareable link for respondents.
              </p>
            </div>
          ) : (
            <>
              {/* Form settings */}
              <section className="rounded-2xl border border-orange-100 bg-white shadow-sm p-6">
                <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <CalendarRange className="w-5 h-5 text-orange-500" />
                  Form details
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Title, description, and availability window for respondents.
                </p>
                {formatFormDateRange(selectedForm?.startDate, selectedForm?.endDate) && (
                  <p className="text-xs text-orange-600 mt-2 font-medium">
                    Active: {formatFormDateRange(selectedForm?.startDate, selectedForm?.endDate)}
                  </p>
                )}
                <form onSubmit={handleUpdateFormSettings} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-neutral-500 mb-1 block">Title</label>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-neutral-500 mb-1 block">Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className={`${inputClass} resize-none`}
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 mb-1 block">Start date</label>
                    <input
                      type="datetime-local"
                      value={editStartDate}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 mb-1 block">End date</label>
                    <input
                      type="datetime-local"
                      value={editEndDate}
                      onChange={(e) => setEditEndDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={updateForm.status === "pending"}
                      className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-orange-50 border border-neutral-200 text-neutral-900 font-semibold px-5 py-2.5 transition shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      Save settings
                    </button>
                  </div>
                </form>
              </section>

              {/* Share & publish */}
              <section className="rounded-2xl border border-orange-100 bg-white shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">{selectedForm?.title}</h2>
                    <p className="text-sm text-neutral-600 mt-1">
                      {selectedForm?.published
                        ? "Anyone with the link can fill and submit this form."
                        : "Publish when ready to share with respondents."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleTogglePublish()}
                    disabled={publishForm.status === "pending"}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition ${
                      selectedForm?.published
                        ? "border-amber-500/30 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20"
                        : "border-emerald-500/30 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20"
                    }`}
                  >
                    {selectedForm?.published ? (
                      <>
                        <GlobeLock className="w-4 h-4" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4" />
                        Publish
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-2">
                  <input
                    readOnly
                    value={getShareUrl(selectedFormId)}
                    className={`${inputClass} flex-1 text-sm`}
                  />
                  <button
                    type="button"
                    onClick={copyShareLink}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:text-orange-600 hover:border-orange-300 transition font-semibold text-sm shadow-sm"
                  >
                    <Copy className="w-4 h-4" />
                    Copy link
                  </button>
                  {selectedForm?.published && (
                    <Link
                      href={`/f/${selectedFormId}`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-100 transition font-semibold text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open form
                    </Link>
                  )}
                </div>
              </section>

              {/* Add field */}
              <section className="rounded-2xl border border-orange-100 bg-white shadow-sm p-6">
                <h2 className="text-lg font-bold text-neutral-900">Add Field</h2>
                <form onSubmit={handleCreateField} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <input
                    name="label"
                    value={fieldData.label}
                    onChange={(e) => setFieldData((prev) => patchFieldFromEvent(e, prev))}
                    placeholder="Field label"
                    className={inputClass}
                    required
                  />
                  <input
                    name="labelKey"
                    value={fieldData.labelKey}
                    onChange={(e) => setFieldData((prev) => patchFieldFromEvent(e, prev))}
                    placeholder="Field key (e.g. full_name)"
                    className={inputClass}
                    required
                  />
                  <select
                    name="type"
                    value={fieldData.type}
                    onChange={(e) => setFieldData((prev) => patchFieldFromEvent(e, prev))}
                    className={inputClass}
                  >
                    {(["text", "textarea", "email", "number", "phone", "select", "radio", "checkbox", "date"] as const).map(
                      (t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ),
                    )}
                  </select>
                  <input
                    name="placeholder"
                    value={fieldData.placeholder}
                    onChange={(e) => setFieldData((prev) => patchFieldFromEvent(e, prev))}
                    placeholder="Placeholder"
                    className={inputClass}
                  />
                  <input
                    type="number"
                    name="order"
                    value={fieldData.order}
                    onChange={(e) => setFieldData((prev) => patchFieldFromEvent(e, prev))}
                    placeholder="Order"
                    className={inputClass}
                  />
                  <label className="flex items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      name="required"
                      checked={fieldData.required}
                      onChange={(e) => setFieldData((prev) => patchFieldFromEvent(e, prev))}
                      className="accent-orange-500"
                    />
                    Required
                  </label>
                  {["select", "radio", "checkbox"].includes(fieldData.type) && (
                    <textarea
                      name="options"
                      value={fieldData.options}
                      onChange={(e) => setFieldData((prev) => patchFieldFromEvent(e, prev))}
                      placeholder="One option per line"
                      className={`${inputClass} sm:col-span-2 resize-none`}
                      rows={4}
                    />
                  )}
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 transition"
                    >
                      Add Field
                    </button>
                  </div>
                </form>
              </section>

              {editFieldData && (
                <section className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6">
                  <h2 className="text-lg font-bold text-neutral-900">Edit Field</h2>
                  <form onSubmit={handleUpdateField} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <input
                      name="label"
                      value={editFieldData.label}
                      onChange={(e) =>
                        setEditFieldData((prev) => (prev ? patchFieldFromEvent(e, prev) : prev))
                      }
                      className={inputClass}
                    />
                    <input
                      name="labelKey"
                      value={editFieldData.labelKey}
                      onChange={(e) =>
                        setEditFieldData((prev) => (prev ? patchFieldFromEvent(e, prev) : prev))
                      }
                      className={inputClass}
                    />
                    <select
                      name="type"
                      value={editFieldData.type}
                      onChange={(e) =>
                        setEditFieldData((prev) => (prev ? patchFieldFromEvent(e, prev) : prev))
                      }
                      className={inputClass}
                    >
                      {(["text", "textarea", "email", "number", "phone", "select", "radio", "checkbox", "date"] as const).map(
                        (t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ),
                      )}
                    </select>
                    <input
                      name="placeholder"
                      value={editFieldData.placeholder}
                      onChange={(e) =>
                        setEditFieldData((prev) => (prev ? patchFieldFromEvent(e, prev) : prev))
                      }
                      className={inputClass}
                    />
                    <input
                      type="number"
                      name="order"
                      value={editFieldData.order}
                      onChange={(e) =>
                        setEditFieldData((prev) => (prev ? patchFieldFromEvent(e, prev) : prev))
                      }
                      className={inputClass}
                    />
                    <label className="flex items-center gap-2 text-sm text-neutral-700">
                      <input
                        type="checkbox"
                        name="required"
                        checked={editFieldData.required}
                        onChange={(e) =>
                        setEditFieldData((prev) => (prev ? patchFieldFromEvent(e, prev) : prev))
                      }
                        className="accent-orange-500"
                      />
                      Required
                    </label>
                    {["select", "radio", "checkbox"].includes(editFieldData.type) && (
                      <textarea
                        name="options"
                        value={editFieldData.options}
                        onChange={(e) =>
                        setEditFieldData((prev) => (prev ? patchFieldFromEvent(e, prev) : prev))
                      }
                        className={`${inputClass} sm:col-span-2 resize-none`}
                        rows={4}
                      />
                    )}
                    <div className="sm:col-span-2 flex gap-2">
                      <button type="submit" className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingFieldId(null);
                          setEditFieldData(null);
                        }}
                        className="rounded-xl border border-neutral-200 px-5 py-2.5 text-neutral-700 hover:bg-orange-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </section>
              )}

              {/* Preview */}
              <section className="rounded-2xl border border-orange-100 bg-white shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-neutral-900">Preview</h2>
                  <span className="text-xs text-neutral-500">{sortedFields.length} fields</span>
                </div>

                {fieldsLoading && (
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading fields...
                  </div>
                )}

                {!fieldsLoading && sortedFields.length === 0 && (
                  <p className="text-sm text-neutral-500">Add fields to see a preview.</p>
                )}

                <div className="space-y-6">
                  {sortedFields.map((field) => (
                    <div key={field.id} className="rounded-xl border border-orange-100 bg-white p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-neutral-900">
                          {field.label}
                          {field.required && <span className="text-rose-400 ml-1">*</span>}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditField(field)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-orange-600 hover:bg-orange-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteField(field.id)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <FormFieldInput
                        field={field}
                        value={field.type === "checkbox" ? [] : ""}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FormsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-2 text-neutral-500">
          <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
          <span className="text-neutral-600">Loading builder...</span>
        </div>
      }
    >
      <FormsPageContent />
    </Suspense>
  );
}
