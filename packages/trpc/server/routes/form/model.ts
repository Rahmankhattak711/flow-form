import z from "zod";

// Plain objects only — trpc-to-openapi calls .omit() on input schemas, which Zod 4
// disallows when refinements are present. Date range validation runs in formService.
export const createFormInputModel = z.object({
  title: z.string().min(1).describe("Form title"),
  description: z.string().optional().describe("Form description"),
  startDate: z.string().optional().nullable().describe("ISO start date"),
  endDate: z.string().optional().nullable().describe("ISO end date"),
});

export const updateFormInputModel = z.object({
  formId: z.string().uuid(),
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export const updateFormOutputModel = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
});

export const createFormOutputModel = z.object({
  id: z.string().uuid().describe("Form id"),
});

export const listFormsOutputModel = z.array(
  z.object({
    id: z.string().uuid().describe("Form id"),
    title: z.string().describe("Form title"),
    description: z.string().optional().describe("Form description"),
    published: z.boolean().describe("Whether the form is publicly shareable"),
    createdAt: z.string().nullable().describe("Form created at"),
    startDate: z.string().nullable().describe("Form start date"),
    endDate: z.string().nullable().describe("Form end date"),
  }),
);

export const getPublicFormInputModel = z.object({
  formId: z.string().uuid().describe("Form id"),
});

export const submitFormInputModel = z.object({
  formId: z.string().uuid().describe("Form id"),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});

export const submitFormOutputModel = z.object({
  id: z.string().uuid().describe("Submission id"),
});

export const publishFormInputModel = z.object({
  formId: z.string().uuid().describe("Form id"),
  published: z.boolean().describe("Published flag"),
});

export const publishFormOutputModel = z.object({
  id: z.string().uuid(),
  published: z.boolean(),
});

export const getSubmissionStatsOutputModel = z.object({
  total: z.number().int(),
  byFormId: z.record(z.string(), z.number().int()),
});

export const getFormSubmissionsInputModel = z.object({
  formId: z.string().uuid().describe("Form id"),
});

export const getFormSubmissionOutputModel = z.object({
  id: z.string().uuid().describe("Submission id"),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
  submittedAt: z.string().describe("ISO timestamp"),
});

export const getFormSubmissionsOutputModel = z.array(getFormSubmissionOutputModel);

export const createFormFieldInputModel = z.object({
  formId: z.string().uuid().describe("Form id"),
  labelKey: z.string().max(100).describe("Label key"),
  label: z.string().max(100).describe("Field label"),
  type: z.string().max(55).describe("Field type"),
  placeholder: z.string().max(255).optional().describe("Placeholder"),
  required: z.boolean().optional().describe("Required flag"),
  order: z.number().int().describe("Order index"),
  options: z.array(z.string()).optional().describe("Options for select/radio/checkbox"),
});

export const createFormFieldOutputModel = z.object({
  id: z.string().uuid().describe("Form field id"),
});

export const getFormFieldsOutputModel = z.array(
  z.object({
    id: z.string().uuid().describe("Form field id"),
    labelKey: z.string().max(100).describe("Label key"),
    label: z.string().max(100).describe("Field label"),
    type: z.string().max(55).describe("Field type"),
    placeholder: z.string().max(255).optional().describe("Placeholder"),
    required: z.boolean().optional().describe("Required flag"),
    order: z.number().int().describe("Order index"),
    options: z.array(z.string()).optional().describe("Options for select/radio/checkbox"),
  }),
);

export const getPublicFormOutputModel = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  fields: getFormFieldsOutputModel,
});

export const getFormFieldsInputModel = z.object({
  formId: z.string().uuid().describe("Form id"),
});
export const getFormFieldInputModel = z.object({
  id: z.string().uuid().describe("Form field id"),
});

export const getFormFieldOutputModel = z.object({
  id: z.string().uuid().describe("Form field id"),
  labelKey: z.string().max(100).describe("Label key"),
  label: z.string().max(100).describe("Field label"),
  type: z.string().max(55).describe("Field type"),
  placeholder: z.string().max(255).optional().describe("Placeholder"),
  required: z.boolean().optional().describe("Required flag"),
  order: z.number().int().describe("Order index"),
  options: z.array(z.string()).optional().describe("Options for select/radio/checkbox"),
});

export const updateFormFieldInputModel = z.object({
  id: z.string().uuid().describe("Form field id"),
  labelKey: z.string().max(100).optional().describe("Label key"),
  label: z.string().max(100).optional().describe("Field label"),
  type: z.string().max(55).optional().describe("Field type"),
  placeholder: z.string().max(255).optional().describe("Placeholder"),
  required: z.boolean().optional().describe("Required flag"),
  order: z.number().int().optional().describe("Order index"),
  options: z.array(z.string()).optional().describe("Options for select/radio/checkbox"),
});

export const deleteFormFieldInputModel = z.object({
  id: z.string().uuid().describe("Form field id"),
});
export const getAllFormsInputModel = z.object({
  userId: z.string().uuid().describe("User id"),
});

export const deleteFormInputModel = z.object({
  formId: z.string().uuid().describe("Form id"),
});

export const deleteFormOutputModel = z.object({
  id: z.string().uuid().describe("Deleted Form id"),
});

export const deleteFormSubmissionInputModel = z.object({
  submissionId: z.string().uuid().describe("Submission id"),
  formId: z.string().uuid().describe("Form id"),
});

export const deleteFormSubmissionOutputModel = z.object({
  id: z.string().uuid().describe("Deleted Submission id"),
});
