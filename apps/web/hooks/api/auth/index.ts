import { trpc } from "~/trpc/client";

export const useUser = () => {
  const { data, isError, isSuccess, isLoading, isPending } =
    trpc.auth.getLoggedInUserInfoInput.useQuery({});
  return { data, isError, isSuccess, isLoading, isPending };
};

export const useSignIn = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: signInUserWithEmailAndPasswordInputAsync,
    mutate: signInUserWithEmailAndPasswordInput,
    error,
    isError,
    isSuccess,
    isPending,
    reset,
    failureCount,
  } = trpc.auth.signInUserWithEmailAndPasswordInput.useMutation({
    onSuccess: () => {
      utils.auth.getLoggedInUserInfoInput.invalidate();
    },
  });
  return {
    mutateAsync: signInUserWithEmailAndPasswordInputAsync,
    mutate: signInUserWithEmailAndPasswordInput,
    error,
    isError,
    isSuccess,
    isPending,
  };
};

export const useSignUp = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createUserWithEmailAndPasswordInputAsync,
    mutate: createUserWithEmailAndPasswordInput,
    error,
    isError,
    isSuccess,
    isPending,
    reset,
    failureCount,
  } = trpc.auth.createUserWithEmailAndPasswordInput.useMutation({
    onSuccess: () => {
      utils.auth.getLoggedInUserInfoInput.invalidate();
    },
  });
  return {
    mutateAsync: createUserWithEmailAndPasswordInputAsync,
    mutate: createUserWithEmailAndPasswordInput,
    error,
    isError,
    isSuccess,
    isPending,
  };
};

export const useSignOut = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync,
    mutate,
    error,
    isError,
    isSuccess,
    isPending,
  } = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.getLoggedInUserInfoInput.invalidate();
    },
  });
  return {
    mutateAsync,
    mutate,
    error,
    isError,
    isSuccess,
    isPending,
  };
};
