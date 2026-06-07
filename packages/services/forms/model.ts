import z from "zod";

const dateRefine = (data: { startDate?: Date | null; endDate?: Date | null }, ctx: z.RefinementCtx) => {
  if (data.startDate && data.endDate && data.endDate <= data.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date must be after start date",
      path: ["endDate"],
    });
  }
};

export const createForm = z
  .object({
    title: z.string().max(55).describe("Form title"),
    description: z.string().optional().describe("Form description"),
    createdBy: z.string().uuid().describe("Form created by user id"),
    startDate: z.coerce.date().optional().nullable(),
    endDate: z.coerce.date().optional().nullable(),
  })
  .superRefine(dateRefine);

export type CreatrFormInputType = z.infer<typeof createForm>;

export const updateForm = z
  .object({
    formId: z.string().uuid(),
    userId: z.string().uuid(),
    title: z.string().max(55).optional(),
    description: z.string().optional().nullable(),
    startDate: z.coerce.date().optional().nullable(),
    endDate: z.coerce.date().optional().nullable(),
  })
  .superRefine(dateRefine);

export type UpdateFormInputType = z.infer<typeof updateForm>;

export const getAllFormsInput = z.object({
  userId: z.string().uuid().describe("User id"),
});

export type GetAllFormsInputType = z.infer<typeof getAllFormsInput>;

export const createFormInputField = z.object({
  formId: z.string().uuid().describe("Form id"),
  labelKey: z.string().max(100).describe("Label key"),
  label: z.string().max(100).describe("Field label"),
  type: z.string().max(55).describe("Field type"),
  placeholder: z.string().max(255).optional().describe("Placeholder"),
  required: z.boolean().optional().describe("Required flag"),
  order: z.number().int().describe("Order index"),
  options: z.array(z.string()).optional().describe("Options for select/radio/checkbox"),
});

export type CreateFormInputFieldType = z.infer<typeof createFormInputField>;

export const getFormFieldsInput = z.object({
  formId: z.string().uuid().describe("Form id"),
});

export type GetFormFieldsInputType = z.infer<typeof getFormFieldsInput>;

export const getFormFieldInput = z.object({
  id: z.string().uuid().describe("Form field id"),
});

export type GetFormFieldInputType = z.infer<typeof getFormFieldInput>;

export const updateFormFieldInput = z.object({
  id: z.string().uuid().describe("Form field id"),
  labelKey: z.string().max(100).optional().describe("Label key"),
  label: z.string().max(100).optional().describe("Field label"),
  type: z.string().max(55).optional().describe("Field type"),
  placeholder: z.string().max(255).optional().describe("Placeholder"),
  required: z.boolean().optional().describe("Required flag"),
  order: z.number().int().optional().describe("Order index"),
  options: z.array(z.string()).optional().describe("Options for select/radio/checkbox"),
});

export type UpdateFormFieldInputType = z.infer<typeof updateFormFieldInput>;

export const deleteFormFieldInput = z.object({
  id: z.string().uuid().describe("Form field id"),
});

export type DeleteFormFieldInputType = z.infer<typeof deleteFormFieldInput>;

export const getFormByIdInput = z.object({
  formId: z.string().uuid().describe("Form id"),
});

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>;

export const publishFormInput = z.object({
  formId: z.string().uuid().describe("Form id"),
  published: z.boolean().describe("Published flag"),
  userId: z.string().uuid().describe("Owner user id"),
});

export type PublishFormInputType = z.infer<typeof publishFormInput>;

export const submitFormInput = z.object({
  formId: z.string().uuid().describe("Form id"),
  answers: z
    .record(z.string(), z.union([z.string(), z.array(z.string())]))
    .describe("Answers keyed by field labelKey"),
});

export type SubmitFormInputType = z.infer<typeof submitFormInput>;

export const getSubmissionCountInput = z.object({
  userId: z.string().uuid().describe("User id"),
});

export type GetSubmissionCountInputType = z.infer<typeof getSubmissionCountInput>;
