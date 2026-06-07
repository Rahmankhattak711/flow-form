import z from "zod";
import { emptyInputModel } from "../../schema";

export const createUserWithEmailAndPasswordInputModel = z.object({
  fullName: z.string().describe("User full name"),
  email: z.email().describe("User email"),
  password: z.string().describe("User password"),
});

export const createUserWithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("User id"),
});

export const signInUserWithEmailAndPasswordInputModel = z.object({
  email: z.email().describe("User email"),
  password: z.string().describe("User password"),
});

export const signInUserWithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("User id"),
});

export const getLoggedInUserInfoInputModel = emptyInputModel;
export const getLoggedInUserInfoOutputModel = z.object({
  id: z.string().describe("User id"),
  fullName: z.string().describe("User full name"),
  email: z.email().describe("User email"),
  profileImageUrl: z.string().describe("User profile image url").optional().nullable(),
});
