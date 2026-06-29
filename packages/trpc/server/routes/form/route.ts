import { TRPCError } from "@trpc/server";
import { emptyInputModel } from "../../schema";
import { formService } from "../../services";
import { authProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
    createFormFieldInputModel,
    createFormFieldOutputModel,
    createFormInputModel,
    createFormOutputModel,
    deleteFormFieldInputModel,
    deleteFormInputModel,
    deleteFormOutputModel,
    deleteFormSubmissionInputModel,
    deleteFormSubmissionOutputModel,
    getFormFieldInputModel,
    getFormFieldOutputModel,
    getFormFieldsInputModel,
    getFormFieldsOutputModel,
    getFormSubmissionsInputModel,
    getFormSubmissionsOutputModel,
    getPublicFormInputModel,
    getPublicFormOutputModel,
    getSubmissionStatsOutputModel,
    listFormsOutputModel,
    publishFormInputModel,
    publishFormOutputModel,
    submitFormInputModel,
    submitFormOutputModel,
    updateFormFieldInputModel,
    updateFormInputModel,
    updateFormOutputModel,
} from "./model";

function toTrpcError(error: unknown): TRPCError {
  const message = error instanceof Error ? error.message : "Something went wrong";
  if (message.includes("not found") || message.includes("not published")) {
    return new TRPCError({ code: "NOT_FOUND", message });
  }
  if (message.includes("required") || message.includes("not open") || message.includes("closed")) {
    return new TRPCError({ code: "BAD_REQUEST", message });
  }
  return new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
}

const TAGS = ["form"];
const getPath = generatePath("/form");

export const formRouter = router({
  createForm: authProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      try {
        const { title, description, startDate, endDate } = input;

        const { id } = await formService.createForm({
          title,
          description,
          createdBy: ctx.user.id,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
        });

        return { id };
      } catch (error) {
        throw toTrpcError(error);
      }
    }),

  updateForm: authProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/updateForm"),
        tags: TAGS,
      },
    })
    .input(updateFormInputModel)
    .output(updateFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      try {
        const form = await formService.updateForm({
          formId: input.formId,
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          startDate:
            input.startDate === undefined
              ? undefined
              : input.startDate
                ? new Date(input.startDate)
                : null,
          endDate:
            input.endDate === undefined
              ? undefined
              : input.endDate
                ? new Date(input.endDate)
                : null,
        });

        return {
          id: form.id,
          title: form.title,
          description: form.description ?? undefined,
          startDate: form.startDate?.toISOString() ?? null,
          endDate: form.endDate?.toISOString() ?? null,
        };
      } catch (error) {
        throw toTrpcError(error);
      }
    }),

  listFormsByUserId: authProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/listFormsByUserId"),
        tags: TAGS,
      },
    })
    .input(emptyInputModel)
    .output(listFormsOutputModel)
    .query(async ({ ctx }) => {
      const forms = await formService.listFormsByUserId({ userId: ctx.user.id });
      return forms.map((form) => ({
        id: form.id,
        title: form.title,
        description: form.description ?? undefined,
        published: form.published,
        createdAt: form.createdAt.toISOString(),
        startDate: form.startDate?.toISOString() ?? null,
        endDate: form.endDate?.toISOString() ?? null,
      }));
    }),

  publishForm: authProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/publishForm"),
        tags: TAGS,
      },
    })
    .input(publishFormInputModel)
    .output(publishFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await formService.publishForm({
          formId: input.formId,
          published: input.published,
          userId: ctx.user.id,
        });
        return { id: result.id, published: result.published };
      } catch (error) {
        throw toTrpcError(error);
      }
    }),

  getSubmissionStats: authProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getSubmissionStats"),
        tags: TAGS,
      },
    })
    .input(emptyInputModel)
    .output(getSubmissionStatsOutputModel)
    .query(async ({ ctx }) => {
      return formService.getSubmissionCountForUser({ userId: ctx.user.id });
    }),

  getFormSubmissions: authProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getFormSubmissions"),
        tags: TAGS,
      },
    })
    .input(getFormSubmissionsInputModel)
    .output(getFormSubmissionsOutputModel)
    .query(async ({ input, ctx }) => {
      try {
        const submissions = await formService.getFormSubmissions({ formId: input.formId, userId: ctx.user.id });
        return submissions.map((s) => ({ id: s.id, answers: s.answers, submittedAt: s.submittedAt.toISOString() }));
      } catch (error) {
        throw toTrpcError(error);
      }
    }),

  getPublicForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getPublicForm"),
        tags: TAGS,
      },
    })
    .input(getPublicFormInputModel)
    .output(getPublicFormOutputModel)
    .query(async ({ input }) => {
      try {
        const form = await formService.getPublicForm({ formId: input.formId });
        return {
          id: form.id,
          title: form.title,
          description: form.description ?? undefined,
          startDate: form.startDate?.toISOString() ?? null,
          endDate: form.endDate?.toISOString() ?? null,
          fields: form.fields.map((field) => ({
            id: field.id,
            label: field.label,
            labelKey: field.labelKey,
            type: field.type,
            placeholder: field.placeholder ?? undefined,
            required: field.required,
            order: field.order,
            options: field.options ?? undefined,
          })),
        };
      } catch (error) {
        throw toTrpcError(error);
      }
    }),

  submitForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/submitForm"),
        tags: TAGS,
      },
    })
    .input(submitFormInputModel)
    .output(submitFormOutputModel)
    .mutation(async ({ input }) => {
      try {
        const { id } = await formService.submitForm({
          formId: input.formId,
          answers: input.answers,
        });
        return { id };
      } catch (error) {
        throw toTrpcError(error);
      }
    }),

  createFormField: authProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createFormField"),
        tags: TAGS,
      },
    })
    .input(createFormFieldInputModel)
    .output(createFormFieldOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { formId, label, labelKey, type, placeholder, required, order, options } = input;

      const { id } = await formService.createFormField({
        formId,
        label,
        labelKey,
        type,
        placeholder,
        required,
        order,
        options,
      });

      if (!id) throw new Error("Failed to create form field");

      return { id };
    }),

  getFormFields: authProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getFormFields"),
        tags: TAGS,
      },
    })
    .input(getFormFieldsInputModel)
    .output(getFormFieldsOutputModel)
    .query(async ({ input }) => {
      const { formId } = input;

      const fields = await formService.getFormFields({ formId });
      return fields.map((field) => ({
        id: field.id,
        label: field.label,
        labelKey: field.labelKey,
        type: field.type,
        placeholder: field.placeholder ?? undefined,
        required: field.required,
        order: field.order,
        options: field.options ?? undefined,
      }));
    }),

  getFormField: authProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getFormField"),
        tags: TAGS,
      },
    })
    .input(getFormFieldInputModel)
    .output(getFormFieldOutputModel)
    .query(async ({ input }) => {
      const { id } = input;
      const field = await formService.getFormFieldById({ id });
      return {
        id: field.id,
        label: field.label,
        labelKey: field.labelKey,
        type: field.type,
        placeholder: field.placeholder ?? undefined,
        required: field.required,
        order: field.order,
        options: field.options ?? undefined,
      };
    }),

  updateFormField: authProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/updateFormField"),
        tags: TAGS,
      },
    })
    .input(updateFormFieldInputModel)
    .output(createFormFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formService.updateFormField(input);
      return { id };
    }),

  deleteFormField: authProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/deleteFormField"),
        tags: TAGS,
      },
    })
    .input(deleteFormFieldInputModel)
    .output(createFormFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formService.deleteFormField(input);
      return { id };
    }),

  deleteForm: authProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/deleteForm"),
        tags: TAGS,
      },
    })
    .input(deleteFormInputModel)
    .output(deleteFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id } = await formService.deleteForm({
          formId: input.formId,
          userId: ctx.user.id,
        });
        return { id };
      } catch (error) {
        throw toTrpcError(error);
      }
    }),

  deleteFormSubmission: authProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/deleteFormSubmission"),
        tags: TAGS,
      },
    })
    .input(deleteFormSubmissionInputModel)
    .output(deleteFormSubmissionOutputModel)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id } = await formService.deleteFormSubmission({
          submissionId: input.submissionId,
          formId: input.formId,
          userId: ctx.user.id,
        });
        return { id };
      } catch (error) {
        throw toTrpcError(error);
      }
    }),
});

