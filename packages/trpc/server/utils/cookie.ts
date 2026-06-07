import type { CookieOptions, Request, Response } from "express";
import { TRPCContext } from "../context";

const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

const defaultCookieOptions: CookieOptions = {
  path: "/",
  httpOnly: true,
  sameSite: "strict",
  secure: false,
  maxAge: ONE_YEAR,
};

export function createCookieFactory(res: Response) {
  return function createCookie(
    name: string,
    value: string,
    opts: CookieOptions = defaultCookieOptions,
  ) {
    res.cookie(name, value, opts);
  };
}

export function getCookieFactory(req: Request) {
  return function getCookie(name: string) {
    return req.cookies?.[name];
  };
}

export function clearCookieFactory(res: Response) {
  return function clearCookie(name: string) {
    res.clearCookie(name);
  };
}

const authHeader = "auth-token";

export function setAuthCookie(ctx: TRPCContext, accessToken: string) {
  ctx.createCookie(authHeader, accessToken);
}

export function getAuthCookie(ctx: TRPCContext) {
  return ctx.getCookie(authHeader);
}

export function clearAuthCookie(ctx: TRPCContext) {
  ctx.clearCookie(authHeader);
}
