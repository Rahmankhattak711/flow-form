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
  useDeleteForm,
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
  FileText,
  Settings2,
  Pencil,
  Trash2,
  Eye,
  X,
  ChevronRight,
  LayoutList,
  Sparkles,
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

const fieldTypeIcons: Record<string, string> = {
  text: "T",
  textarea: "¶",
  email: "@",
  number: "#",
  phone: "☏",
  select: "▾",
  radio: "◉",
  checkbox: "☑",
  date: "📅",
};

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
  const deleteForm = useDeleteForm();

  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const { data: fields, isLoading: fieldsLoading, refetch } = useGetFormFields(selectedFormId);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [fieldData, setFieldData] = useState<FieldData>(emptyField);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editFieldData, setEditFieldData] = useState<FieldData | null>(null);
  const [activeTab, setActiveTab] = useState<"settings" | "fields" | "preview">("fields");

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
      setShowCreateForm(false);
      if (res?.id) {
        setSelectedFormId(res.id);
        toast.success("Form created!");
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
        options: editFieldData.options.split("\n").map((item) => item.trim()).filter(Boolean),
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

  async function handleDeleteForm() {
    if (!selectedFormId) return;
    if (!window.confirm("Are you sure you want to delete this form? This will delete all submissions and fields permanently!")) return;
    try {
      await deleteForm.mutateAsync({ formId: selectedFormId });
      setSelectedFormId(null);
      toast.success("Form deleted successfully");
    } catch {
      toast.error("Failed to delete form");
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
    setActiveTab("fields");
  }

  const inputClass =
    "w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition";

  const tabs = [
    { id: "fields" as const, label: "Fields", icon: LayoutList },
    { id: "settings" as const, label: "Settings", icon: Settings2 },
    { id: "preview" as const, label: "Preview", icon: Eye },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">Builder</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">Form Builder</h1>
          <p className="text-neutral-500 mt-1.5">
            Build your form, publish it, and share the link so anyone can fill and submit responses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Sidebar ── */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-4">

          {/* Forms list */}
          <div className="rounded-2xl border border-orange-100 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-orange-50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                <h2 className="text-sm font-bold text-neutral-900">Your Forms</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-500 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                  {forms?.length ?? 0}
                </span>
                <button
                  onClick={() => setShowCreateForm((v) => !v)}
                  className="w-7 h-7 rounded-lg bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white transition shadow-sm"
                  title="New Form"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {formsLoading ? (
              <div className="p-4 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-orange-50 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                ))}
              </div>
            ) : forms?.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-400 mx-auto mb-2">
                  <FileText className="w-5 h-5" />
                </div>
                <p className="text-sm text-neutral-500">No forms yet. Create one below.</p>
              </div>
            ) : (
              <div className="divide-y divide-orange-50 max-h-[380px] overflow-y-auto">
                {forms?.map((form) => (
                  <button
                    key={form.id}
                    type="button"
                    onClick={() => setSelectedFormId(form.id)}
                    className={`w-full px-4 py-3.5 text-left transition group flex items-center gap-3 ${
                      selectedFormId === form.id
                        ? "bg-orange-50 border-l-2 border-orange-500"
                        : "hover:bg-orange-50/50 border-l-2 border-transparent"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition ${
                      selectedFormId === form.id
                        ? "bg-orange-500 text-white"
                        : "bg-orange-50 border border-orange-200 text-orange-500 group-hover:bg-orange-100"
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-neutral-900 truncate">{form.title}</p>
                      <span
                        className={`inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${
                          form.published
                            ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                            : "text-amber-600 border-amber-500/30 bg-amber-500/10"
                        }`}
                      >
                        {form.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition ${selectedFormId === form.id ? "text-orange-500" : "text-neutral-300 group-hover:text-orange-400"}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Create form panel */}
          {showCreateForm && (
            <div className="rounded-2xl border border-orange-200 bg-white shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-orange-100 bg-orange-50/50">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-orange-500" />
                  <h2 className="text-sm font-bold text-neutral-900">New Form</h2>
                </div>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg hover:bg-neutral-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreateForm} className="p-4 space-y-3">
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Form title *"
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
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-semibold text-neutral-500 mb-1 block">Start date</label>
                    <input
                      type="datetime-local"
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-500 mb-1 block">End date</label>
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
                  disabled={createForm.status === "pending"}
                  className="w-full rounded-xl chai-gradient-bg text-white font-bold py-2.5 text-sm transition hover:opacity-90 shadow-sm shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {createForm.status === "pending" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Create Form
                </button>
              </form>
            </div>
          )}
        </aside>

        {/* ── Main Panel ── */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-5">
          {!selectedFormId ? (
            <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50/60 to-amber-50/30 p-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-white border border-orange-200 flex items-center justify-center text-orange-400 mb-5 shadow-sm">
                <Share2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-700">Select or create a form</h3>
              <p className="text-neutral-500 text-sm mt-2 max-w-md">
                Choose a form from the sidebar to add fields, preview it, and get a shareable link for respondents.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 chai-gradient-bg text-white font-bold rounded-xl shadow-md shadow-orange-500/20 text-sm hover:opacity-90 transition"
              >
                <Plus className="w-4 h-4" />
                Create your first form
              </button>
            </div>
          ) : (
            <>
              {/* Share & Publish Banner */}
              <section className="rounded-2xl border border-orange-100 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50/50 border-b border-orange-100 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="text-lg font-bold text-neutral-900 truncate">{selectedForm?.title}</h2>
                      <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        selectedForm?.published
                          ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                          : "text-amber-600 border-amber-500/30 bg-amber-500/10"
                      }`}>
                        {selectedForm?.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      {selectedForm?.published
                        ? "Anyone with the link can fill and submit this form."
                        : "Publish when ready to share with respondents."}
                    </p>
                    {formatFormDateRange(selectedForm?.startDate, selectedForm?.endDate) && (
                      <p className="text-xs text-orange-600 mt-1 font-medium flex items-center gap-1">
                        <CalendarRange className="w-3 h-3" />
                        Active: {formatFormDateRange(selectedForm?.startDate, selectedForm?.endDate)}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleTogglePublish()}
                    disabled={publishForm.status === "pending"}
                    className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border transition ${
                      selectedForm?.published
                        ? "border-amber-400/40 text-amber-700 bg-amber-50 hover:bg-amber-100"
                        : "border-emerald-400/40 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                    } disabled:opacity-50`}
                  >
                    {publishForm.status === "pending" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : selectedForm?.published ? (
                      <><GlobeLock className="w-4 h-4" />Unpublish</>
                    ) : (
                      <><Globe className="w-4 h-4" />Publish</>
                    )}
                  </button>
                </div>

                {/* Share Link Row */}
                <div className="px-6 py-4 flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Share2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      readOnly
                      value={getShareUrl(selectedFormId)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-600 outline-none font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={copyShareLink}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50 transition font-semibold text-sm shadow-sm"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  {selectedForm?.published && (
                    <Link
                      href={`/f/${selectedFormId}`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-100 transition font-semibold text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </Link>
                  )}
                </div>
              </section>

              {/* Tab Bar */}
              <div className="flex gap-1 p-1 rounded-xl bg-orange-50 border border-orange-100">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      activeTab === id
                        ? "bg-white text-orange-600 shadow-sm border border-orange-200"
                        : "text-neutral-500 hover:text-neutral-700 hover:bg-orange-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {id === "fields" && sortedFields.length > 0 && (
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">
                        {sortedFields.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── FIELDS TAB ── */}
              {activeTab === "fields" && (
                <div className="space-y-5">
                  {/* Add field */}
                  <section className="rounded-2xl border border-orange-100 bg-white shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-orange-50 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-orange-500" />
                      <h2 className="text-sm font-bold text-neutral-900">Add Field</h2>
                    </div>
                    <form onSubmit={handleCreateField} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-500">Label *</label>
                        <input
                          name="label"
                          value={fieldData.label}
                          onChange={(e) => setFieldData((prev) => patchFieldFromEvent(e, prev))}
                          placeholder="e.g. Full Name"
                          className={inputClass}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-500">Key *</label>
                        <input
                          name="labelKey"
                          value={fieldData.labelKey}
                          onChange={(e) => setFieldData((prev) => patchFieldFromEvent(e, prev))}
                          placeholder="e.g. full_name"
                          className={inputClass}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-500">Type</label>
                        <select
                          name="type"
                          value={fieldData.type}
                          onChange={(e) => setFieldData((prev) => patchFieldFromEvent(e, prev))}
                          className={inputClass}
                        >
                          {(["text", "textarea", "email", "number", "phone", "select", "radio", "checkbox", "date"] as const).map((t) => (
                            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-500">Placeholder</label>
                        <input
                          name="placeholder"
                          value={fieldData.placeholder}
                          onChange={(e) => setFieldData((prev) => patchFieldFromEvent(e, prev))}
                          placeholder="e.g. Enter your name"
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-500">Order</label>
                        <input
                          type="number"
                          name="order"
                          value={fieldData.order}
                          onChange={(e) => setFieldData((prev) => patchFieldFromEvent(e, prev))}
                          placeholder="0"
                          className={inputClass}
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center gap-2.5 text-sm text-neutral-700 cursor-pointer select-none">
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="required"
                              checked={fieldData.required}
                              onChange={(e) => setFieldData((prev) => patchFieldFromEvent(e, prev))}
                              className="sr-only"
                            />
                            <div className={`w-10 h-5 rounded-full border transition ${fieldData.required ? "bg-orange-500 border-orange-500" : "bg-neutral-200 border-neutral-300"}`}>
                              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 mt-0.5 ${fieldData.required ? "translate-x-5" : "translate-x-0.5"}`} />
                            </div>
                          </div>
                          <span className="font-medium">Required field</span>
                        </label>
                      </div>
                      {["select", "radio", "checkbox"].includes(fieldData.type) && (
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-xs font-semibold text-neutral-500">Options (one per line)</label>
                          <textarea
                            name="options"
                            value={fieldData.options}
                            onChange={(e) => setFieldData((prev) => patchFieldFromEvent(e, prev))}
                            placeholder={"Option 1\nOption 2\nOption 3"}
                            className={`${inputClass} resize-none`}
                            rows={4}
                          />
                        </div>
                      )}
                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          disabled={createField.status === "pending"}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 text-sm transition shadow-sm disabled:opacity-50"
                        >
                          {createField.status === "pending" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                          Add Field
                        </button>
                      </div>
                    </form>
                  </section>

                  {/* Edit field panel */}
                  {editFieldData && (
                    <section className="rounded-2xl border border-orange-300 bg-orange-50/60 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-6 py-4 border-b border-orange-200 flex items-center justify-between bg-orange-50">
                        <div className="flex items-center gap-2">
                          <Pencil className="w-4 h-4 text-orange-500" />
                          <h2 className="text-sm font-bold text-neutral-900">Edit Field</h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setEditingFieldId(null); setEditFieldData(null); }}
                          className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg hover:bg-orange-100 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <form onSubmit={handleUpdateField} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-neutral-500">Label</label>
                          <input name="label" value={editFieldData.label}
                            onChange={(e) => setEditFieldData((prev) => (prev ? patchFieldFromEvent(e, prev) : prev))}
                            className={inputClass} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-neutral-500">Key</label>
                          <input name="labelKey" value={editFieldData.labelKey}
                            onChange={(e) => setEditFieldData((prev) => (prev ? patchFieldFromEvent(e, prev) : prev))}
                            className={inputClass} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-neutral-500">Type</label>
                          <select name="type" value={editFieldData.type}
                            onChange={(e) => setEditFieldData((prev) => (prev ? patchFieldFromEvent(e, prev) : prev))}
                            className={inputClass}>
                            {(["text", "textarea", "email", "number", "phone", "select", "radio", "checkbox", "date"] as const).map((t) => (
                              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-neutral-500">Placeholder</label>
                          <input name="placeholder" value={editFieldData.placeholder}
                            onChange={(e) => setEditFieldData((prev) => (prev ? patchFieldFromEvent(e, prev) : prev))}
                            className={inputClass} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-neutral-500">Order</label>
                          <input type="number" name="order" value={editFieldData.order}
                            onChange={(e) => setEditFieldData((prev) => (prev ? patchFieldFromEvent(e, prev) : prev))}
                            className={inputClass} />
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center gap-2.5 text-sm text-neutral-700 cursor-pointer select-none">
                            <div className="relative">
                              <input type="checkbox" name="required" checked={editFieldData.required}
                                onChange={(e) => setEditFieldData((prev) => (prev ? patchFieldFromEvent(e, prev) : prev))}
                                className="sr-only" />
                              <div className={`w-10 h-5 rounded-full border transition ${editFieldData.required ? "bg-orange-500 border-orange-500" : "bg-neutral-200 border-neutral-300"}`}>
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 mt-0.5 ${editFieldData.required ? "translate-x-5" : "translate-x-0.5"}`} />
                              </div>
                            </div>
                            <span className="font-medium">Required field</span>
                          </label>
                        </div>
                        {["select", "radio", "checkbox"].includes(editFieldData.type) && (
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-xs font-semibold text-neutral-500">Options (one per line)</label>
                            <textarea name="options" value={editFieldData.options}
                              onChange={(e) => setEditFieldData((prev) => (prev ? patchFieldFromEvent(e, prev) : prev))}
                              className={`${inputClass} resize-none`} rows={4} />
                          </div>
                        )}
                        <div className="sm:col-span-2 flex gap-2">
                          <button type="submit" disabled={updateField.status === "pending"}
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 text-sm transition disabled:opacity-50">
                            {updateField.status === "pending" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save changes
                          </button>
                          <button type="button"
                            onClick={() => { setEditingFieldId(null); setEditFieldData(null); }}
                            className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 font-semibold transition">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </section>
                  )}

                  {/* Fields list */}
                  {fieldsLoading ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-16 rounded-2xl bg-orange-50 animate-pulse" />
                      ))}
                    </div>
                  ) : sortedFields.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-orange-100 bg-orange-50/30 p-10 text-center">
                      <Sparkles className="w-8 h-8 text-orange-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-neutral-600">No fields yet</p>
                      <p className="text-xs text-neutral-400 mt-1">Add your first field using the form above.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sortedFields.map((field, idx) => (
                        <div
                          key={field.id}
                          className="rounded-2xl border border-orange-100 bg-white shadow-sm overflow-hidden group hover:border-orange-300 hover:shadow-md hover:shadow-orange-100/60 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between px-5 py-3 border-b border-orange-50 bg-orange-50/40">
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <div>
                                <span className="text-sm font-bold text-neutral-900">
                                  {field.label}
                                  {field.required && <span className="text-rose-500 ml-1">*</span>}
                                </span>
                                <span className="ml-2 text-[10px] font-mono text-neutral-400">{field.labelKey}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-orange-200 bg-orange-50 text-orange-600">
                                {field.type}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleEditField(field)}
                                className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50 transition"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleDeleteField(field.id)}
                                className="p-1.5 rounded-lg border border-rose-200 text-rose-400 hover:bg-rose-50 hover:border-rose-400 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="px-5 py-4 pointer-events-none">
                            <FormFieldInput
                              field={field}
                              value={field.type === "checkbox" ? [] : ""}
                              onChange={() => {}}
                              disabled
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── SETTINGS TAB ── */}
              {activeTab === "settings" && (
                <section className="rounded-2xl border border-orange-100 bg-white shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-orange-50 flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-orange-500" />
                    <h2 className="text-sm font-bold text-neutral-900">Form Settings</h2>
                  </div>
                  <form onSubmit={handleUpdateFormSettings} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-500">Title *</label>
                      <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className={inputClass} required />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-500">Description</label>
                      <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className={`${inputClass} resize-none`} rows={3} placeholder="Optional description..." />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
                        <CalendarRange className="w-3.5 h-3.5 text-orange-400" /> Start date
                      </label>
                      <input type="datetime-local" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
                        <CalendarRange className="w-3.5 h-3.5 text-orange-400" /> End date
                      </label>
                      <input type="datetime-local" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} className={inputClass} />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={updateForm.status === "pending"}
                        className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-orange-50 border border-orange-200 text-orange-600 font-bold px-5 py-2.5 text-sm transition shadow-sm disabled:opacity-50"
                      >
                        {updateForm.status === "pending" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save settings
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteForm}
                        disabled={deleteForm.status === "pending"}
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold px-5 py-2.5 text-sm transition shadow-sm disabled:opacity-50"
                      >
                        {deleteForm.status === "pending" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Delete Form
                      </button>
                    </div>
                  </form>
                </section>
              )}

              {/* ── PREVIEW TAB ── */}
              {activeTab === "preview" && (
                <section className="rounded-2xl border border-orange-100 bg-white shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-orange-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-orange-500" />
                      <h2 className="text-sm font-bold text-neutral-900">Form Preview</h2>
                    </div>
                    <span className="text-xs font-semibold text-neutral-500 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                      {sortedFields.length} field{sortedFields.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="p-6">
                    {fieldsLoading ? (
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                        Loading fields...
                      </div>
                    ) : sortedFields.length === 0 ? (
                      <div className="text-center py-10">
                        <Eye className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
                        <p className="text-sm text-neutral-500">Add fields to see a live preview here.</p>
                      </div>
                    ) : (
                      <div className="space-y-5 max-w-xl">
                        {selectedForm?.title && (
                          <div className="mb-6">
                            <h3 className="text-xl font-bold text-neutral-900">{selectedForm.title}</h3>
                            {selectedForm.description && (
                              <p className="text-sm text-neutral-500 mt-1">{selectedForm.description}</p>
                            )}
                          </div>
                        )}
                        {sortedFields.map((field) => (
                          <div key={field.id} className="space-y-1.5">
                            <label className="text-sm font-semibold text-neutral-800 block">
                              {field.label}
                              {field.required && <span className="text-rose-500 ml-1">*</span>}
                            </label>
                            <FormFieldInput
                              field={field}
                              value={field.type === "checkbox" ? [] : ""}
                              onChange={() => {}}
                              disabled
                            />
                          </div>
                        ))}
                        <div className="pt-2">
                          <button
                            type="button"
                            disabled
                            className="px-6 py-2.5 rounded-xl chai-gradient-bg text-white font-bold text-sm opacity-60 cursor-not-allowed"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
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
        <div className="flex items-center gap-3 text-neutral-500 p-8">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          <span className="text-neutral-600 font-medium">Loading builder...</span>
        </div>
      }
    >
      <FormsPageContent />
    </Suspense>
  );
}
