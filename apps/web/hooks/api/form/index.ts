import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
  const trpcContext = trpc.useUtils();

  const { mutateAsync, mutate, error, failureCount, isError, isSuccess, status } =
    trpc.form.createForm.useMutation({
      onSuccess: async () => {
        await trpcContext.form.invalidate();
      },
    });

  return { mutateAsync, mutate, error, failureCount, isError, isSuccess, status };
};

export const useGetAllForms = () => {
  const { data, error, isLoading, isError, isSuccess, status } =
    trpc.form.listFormsByUserId.useQuery({});

  return { data, error, isLoading, isError, isSuccess, status };
};

export const useCreateFormField = () => {
  const trpcContext = trpc.useUtils();

  const { mutateAsync, mutate, error, failureCount, isError, isSuccess, status } =
    trpc.form.createFormField.useMutation({
      onSuccess: async () => {
        await trpcContext.form.invalidate();
      },
    });

  return { mutateAsync, mutate, error, failureCount, isError, isSuccess, status };
};

export const useGetFormFields = (formId: string | null) => {
  const { data, error, isLoading, isError, isSuccess, status, refetch } =
    trpc.form.getFormFields.useQuery(
      { formId: formId ?? "" },
      {
        enabled: !!formId,
      },
    );

  return { data, error, isLoading, isError, isSuccess, status, refetch };
};

export const useGetFormField = (fieldId: string | null) => {
  const { data, error, isLoading, isError, isSuccess, status, refetch } =
    trpc.form.getFormField.useQuery(
      { id: fieldId ?? "" },
      {
        enabled: !!fieldId,
      },
    );

  return { data, error, isLoading, isError, isSuccess, status, refetch };
};

export const useUpdateFormField = () => {
  const trpcContext = trpc.useUtils();

  const { mutateAsync, mutate, error, failureCount, isError, isSuccess, status } =
    trpc.form.updateFormField.useMutation({
      onSuccess: async () => {
        await trpcContext.form.invalidate();
      },
    });

  return { mutateAsync, mutate, error, failureCount, isError, isSuccess, status };
};

export const useDeleteFormField = () => {
  const trpcContext = trpc.useUtils();

  const { mutateAsync, mutate, error, failureCount, isError, isSuccess, status } =
    trpc.form.deleteFormField.useMutation({
      onSuccess: async () => {
        await trpcContext.form.invalidate();
      },
    });

  return { mutateAsync, mutate, error, failureCount, isError, isSuccess, status };
};

export const useUpdateForm = () => {
  const trpcContext = trpc.useUtils();

  const { mutateAsync, mutate, error, failureCount, isError, isSuccess, status } =
    trpc.form.updateForm.useMutation({
      onSuccess: async () => {
        await trpcContext.form.invalidate();
      },
    });

  return { mutateAsync, mutate, error, failureCount, isError, isSuccess, status };
};

export const usePublishForm = () => {
  const trpcContext = trpc.useUtils();

  const { mutateAsync, mutate, error, failureCount, isError, isSuccess, status } =
    trpc.form.publishForm.useMutation({
      onSuccess: async () => {
        await trpcContext.form.invalidate();
      },
    });

  return { mutateAsync, mutate, error, failureCount, isError, isSuccess, status };
};

export const useGetSubmissionStats = () => {
  const { data, error, isLoading, isError, isSuccess, status } =
    trpc.form.getSubmissionStats.useQuery({});

  return { data, error, isLoading, isError, isSuccess, status };
};

export const useGetFormSubmissions = (formId: string | null) => {
  const { data, error, isLoading, isError, isSuccess, status, refetch } =
    trpc.form.getFormSubmissions.useQuery(
      { formId: formId ?? "" },
      {
        enabled: !!formId,
      },
    );

  return { data, error, isLoading, isError, isSuccess, status, refetch };
};

export const useGetPublicForm = (formId: string | null) => {
  const { data, error, isLoading, isError, isSuccess, status, refetch } =
    trpc.form.getPublicForm.useQuery(
      { formId: formId ?? "" },
      {
        enabled: !!formId,
        retry: false,
      },
    );

  return { data, error, isLoading, isError, isSuccess, status, refetch };
};

export const useSubmitForm = () => {
  const { mutateAsync, mutate, error, failureCount, isError, isSuccess, status } =
    trpc.form.submitForm.useMutation();

  return { mutateAsync, mutate, error, failureCount, isError, isSuccess, status };
};

export const useDeleteForm = () => {
  const trpcContext = trpc.useUtils();

  const { mutateAsync, mutate, error, failureCount, isError, isSuccess, status } =
    trpc.form.deleteForm.useMutation({
      onSuccess: async () => {
        await trpcContext.form.invalidate();
      },
    });

  return { mutateAsync, mutate, error, failureCount, isError, isSuccess, status };
};

export const useDeleteFormSubmission = () => {
  const trpcContext = trpc.useUtils();

  const { mutateAsync, mutate, error, failureCount, isError, isSuccess, status } =
    trpc.form.deleteFormSubmission.useMutation({
      onSuccess: async () => {
        await trpcContext.form.invalidate();
      },
    });

  return { mutateAsync, mutate, error, failureCount, isError, isSuccess, status };
};

