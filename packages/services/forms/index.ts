import db, { and, eq, inArray, sql } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-field";
import { formSubmissionsTable } from "@repo/database/models/form-submission";
import {
  CreateFormInputFieldType,
  CreatrFormInputType,
  DeleteFormFieldInputType,
  GetAllFormsInputType,
  GetFormByIdInputType,
  GetFormFieldInputType,
  GetFormFieldsInputType,
  GetSubmissionCountInputType,
  PublishFormInputType,
  SubmitFormInputType,
  UpdateFormFieldInputType,
  UpdateFormInputType,
  createForm,
  createFormInputField,
  deleteFormFieldInput,
  getAllFormsInput,
  getFormByIdInput,
  getFormFieldInput,
  getFormFieldsInput,
  getSubmissionCountInput,
  publishFormInput,
  submitFormInput,
  updateFormFieldInput,
  updateForm as updateFormSchema,
} from "./model";

class FormService {
  public async createForm(payload: CreatrFormInputType) {
    const { title, description, createdBy, startDate, endDate } = await createForm.parseAsync(payload);

    const result = await db
      .insert(formsTable)
      .values({
        title,
        description,
        createdBy,
        startDate: startDate ?? null,
        endDate: endDate ?? null,
      })
      .returning({
        id: formsTable.id,
      });

    if (!result || result.length === 0 || !result[0]?.id) throw new Error("Failed to create form");

    return { id: result[0].id };
  }

  public async listFormsByUserId(payload: GetAllFormsInputType) {
    const { userId } = await getAllFormsInput.parseAsync(payload);
    const forms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        published: formsTable.published,
        createdAt: formsTable.createdAt,
        startDate: formsTable.startDate,
        endDate: formsTable.endDate,
        createdBy: formsTable.createdBy,
      })
      .from(formsTable)
      .where(eq(formsTable.createdBy, userId));
    return forms;
  }

  public async getFormById(payload: GetFormByIdInputType) {
    const { formId } = await getFormByIdInput.parseAsync(payload);

    const [form] = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        published: formsTable.published,
        startDate: formsTable.startDate,
        endDate: formsTable.endDate,
        createdBy: formsTable.createdBy,
      })
      .from(formsTable)
      .where(eq(formsTable.id, formId));

    if (!form) {
      throw new Error("Form not found");
    }

    return form;
  }

  public async updateForm(payload: UpdateFormInputType) {
    const { formId, userId, title, description, startDate, endDate } =
      await updateFormSchema.parseAsync(payload);

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (startDate !== undefined) updates.startDate = startDate;
    if (endDate !== undefined) updates.endDate = endDate;

    const [form] = await db
      .update(formsTable)
      .set(updates)
      .where(and(eq(formsTable.id, formId), eq(formsTable.createdBy, userId)))
      .returning({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        startDate: formsTable.startDate,
        endDate: formsTable.endDate,
      });

    if (!form) {
      throw new Error("Form not found or you do not have permission");
    }

    return form;
  }

  public async publishForm(payload: PublishFormInputType) {
    const { formId, published, userId } = await publishFormInput.parseAsync(payload);

    const [form] = await db
      .update(formsTable)
      .set({ published })
      .where(and(eq(formsTable.id, formId), eq(formsTable.createdBy, userId)))
      .returning({ id: formsTable.id, published: formsTable.published });

    if (!form) {
      throw new Error("Form not found or you do not have permission");
    }

    return form;
  }

  public async getPublicForm(payload: GetFormByIdInputType) {
    const form = await this.getFormById(payload);

    if (!form.published) {
      throw new Error("This form is not published yet");
    }

    const now = new Date();
    if (form.startDate && now < form.startDate) {
      throw new Error("This form is not open yet");
    }
    if (form.endDate && now > form.endDate) {
      throw new Error("This form has closed");
    }

    const fields = await this.getFormFields({ formId: form.id });

    return {
      id: form.id,
      title: form.title,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      fields,
    };
  }

  public async submitForm(payload: SubmitFormInputType) {
    const { formId, answers } = await submitFormInput.parseAsync(payload);
    const publicForm = await this.getPublicForm({ formId });
    const fields = publicForm.fields;

    for (const field of fields) {
      const value = answers[field.labelKey];
      const isEmpty =
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);

      if (field.required && isEmpty) {
        throw new Error(`${field.label} is required`);
      }
    }

    const [submission] = await db
      .insert(formSubmissionsTable)
      .values({
        formId,
        answers,
      })
      .returning({ id: formSubmissionsTable.id });

    if (!submission?.id) {
      throw new Error("Failed to submit form");
    }

    return { id: submission.id };
  }

  public async getSubmissionCountForUser(payload: GetSubmissionCountInputType) {
    const { userId } = await getSubmissionCountInput.parseAsync(payload);

    const userForms = await db
      .select({ id: formsTable.id })
      .from(formsTable)
      .where(eq(formsTable.createdBy, userId));

    const formIds = userForms.map((f) => f.id);
    if (formIds.length === 0) {
      return { total: 0, byFormId: {} as Record<string, number> };
    }

    const counts = await db
      .select({
        formId: formSubmissionsTable.formId,
        count: sql<number>`count(*)::int`,
      })
      .from(formSubmissionsTable)
      .where(inArray(formSubmissionsTable.formId, formIds))
      .groupBy(formSubmissionsTable.formId);

    const byFormId: Record<string, number> = {};
    let total = 0;
    for (const row of counts) {
      byFormId[row.formId] = row.count;
      total += row.count;
    }

    return { total, byFormId };
  }

  public async createFormField(payload: CreateFormInputFieldType) {
    const { formId, label, labelKey, type, placeholder, required, order, options } =
      await createFormInputField.parseAsync(payload);

    const result = await db
      .insert(formFieldsTable)
      .values({
        formId,
        labelKey,
        label,
        type,
        placeholder: placeholder ?? null,
        required: required ?? false,
        order,
        options: options ?? null,
      })
      .returning({ id: formFieldsTable.id });

    if (!result || result.length === 0 || !result[0]?.id)
      throw new Error("Failed to create form field");

    return { id: result[0].id };
  }

  public async getFormFields(payload: GetFormFieldsInputType) {
    const { formId } = await getFormFieldsInput.parseAsync(payload);
    const fields = await db
      .select({
        id: formFieldsTable.id,
        label: formFieldsTable.label,
        labelKey: formFieldsTable.labelKey,
        type: formFieldsTable.type,
        placeholder: formFieldsTable.placeholder,
        required: formFieldsTable.required,
        order: formFieldsTable.order,
        options: formFieldsTable.options,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId));
    return fields;
  }

  public async getFormFieldById(payload: GetFormFieldInputType) {
    const { id } = await getFormFieldInput.parseAsync(payload);
    const [field] = await db
      .select({
        id: formFieldsTable.id,
        formId: formFieldsTable.formId,
        label: formFieldsTable.label,
        labelKey: formFieldsTable.labelKey,
        type: formFieldsTable.type,
        placeholder: formFieldsTable.placeholder,
        required: formFieldsTable.required,
        order: formFieldsTable.order,
        options: formFieldsTable.options,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.id, id));

    if (!field) {
      throw new Error("Form field not found");
    }

    return field;
  }

  public async updateFormField(payload: UpdateFormFieldInputType) {
    const { id, label, labelKey, type, placeholder, required, order, options } =
      await updateFormFieldInput.parseAsync(payload);

    const updates: Record<string, unknown> = {};
    if (label !== undefined) updates.label = label;
    if (labelKey !== undefined) updates.labelKey = labelKey;
    if (type !== undefined) updates.type = type;
    if (placeholder !== undefined) updates.placeholder = placeholder;
    if (required !== undefined) updates.required = required;
    if (order !== undefined) updates.order = order;
    if (options !== undefined) updates.options = options;

    const result = await db
      .update(formFieldsTable)
      .set(updates)
      .where(eq(formFieldsTable.id, id))
      .returning({ id: formFieldsTable.id });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error("Failed to update form field");
    }

    return { id: result[0].id };
  }

  public async deleteFormField(payload: DeleteFormFieldInputType) {
    const { id } = await deleteFormFieldInput.parseAsync(payload);
    const result = await db
      .delete(formFieldsTable)
      .where(eq(formFieldsTable.id, id))
      .returning({ id: formFieldsTable.id });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error("Failed to delete form field");
    }

    return { id: result[0].id };
  }
}

export default FormService;
