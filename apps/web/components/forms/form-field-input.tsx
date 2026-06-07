"use client";

export type FormFieldType =
  | "text"
  | "textarea"
  | "email"
  | "number"
  | "phone"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

export interface FormFieldDefinition {
  id: string;
  label: string;
  labelKey: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  order: number;
  options?: string[];
}

interface FormFieldInputProps {
  field: FormFieldDefinition;
  value: string | string[];
  onChange: (labelKey: string, value: string | string[]) => void;
  disabled?: boolean;
}

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 outline-none transition chai-input-focus";

export function FormFieldInput({ field, value, onChange, disabled }: FormFieldInputProps) {
  const type = field.type as FormFieldType;

  if (type === "textarea") {
    return (
      <textarea
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(field.labelKey, e.target.value)}
        placeholder={field.placeholder || ""}
        className={`${inputClass} resize-none`}
        rows={4}
        disabled={disabled}
        required={field.required}
      />
    );
  }

  if (type === "select") {
    return (
      <select
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(field.labelKey, e.target.value)}
        className={inputClass}
        disabled={disabled}
        required={field.required}
      >
        <option value="">Select an option</option>
        {field.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (type === "radio") {
    const selected = typeof value === "string" ? value : "";
    return (
      <div className="space-y-2">
        {field.options?.map((option) => (
          <label key={option} className="flex items-center gap-3 text-neutral-700">
            <input
              type="radio"
              name={field.labelKey}
              value={option}
              checked={selected === option}
              onChange={() => onChange(field.labelKey, option)}
              disabled={disabled}
              required={field.required}
              className="accent-orange-500"
            />
            {option}
          </label>
        ))}
      </div>
    );
  }

  if (type === "checkbox") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-2">
        {field.options?.map((option) => (
          <label key={option} className="flex items-center gap-3 text-neutral-700">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={(e) => {
                const next = e.target.checked
                  ? [...selected, option]
                  : selected.filter((item) => item !== option);
                onChange(field.labelKey, next);
              }}
              disabled={disabled}
              className="accent-orange-500"
            />
            {option}
          </label>
        ))}
      </div>
    );
  }

  const htmlType =
    type === "email"
      ? "email"
      : type === "number"
        ? "number"
        : type === "phone"
          ? "tel"
          : type === "date"
            ? "date"
            : "text";

  return (
    <input
      type={htmlType}
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(field.labelKey, e.target.value)}
      placeholder={field.placeholder || ""}
      className={inputClass}
      disabled={disabled}
      required={field.required}
    />
  );
}
