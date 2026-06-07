import z, { email } from "zod";

export const createUserWithEmailAndPasswordInput = z.object({
  fullName: z.string().describe("User full name"),
  email: email().describe("User email"),
  password: z.string().describe("User password"),
});

export type CreateUserWithEmailAndPasswordInput = z.infer<
  typeof createUserWithEmailAndPasswordInput
>;

export const generateUserTokenPayload = z.object({
  id: z.string().describe("User id"),
});

export type GenerateUserTokenType = z.infer<typeof generateUserTokenPayload>;

export const signInUserWithEmailAndPasswordInput = z.object({
  email: email().describe("User email"),
  password: z.string().describe("User password"),
});

export type SignInUserWithEmailAndPasswordInputType = z.infer<
  typeof signInUserWithEmailAndPasswordInput
>;
