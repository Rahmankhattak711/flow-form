import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";
import { getAuthCookie } from "./utils/cookie";
import { userService } from "./services";

export const tRPCContext = initTRPC.meta<OpenApiMeta>().context<typeof createContext>().create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const authProcedure = tRPCContext.procedure.use(async (options) => {
  const { ctx } = options;

  const userToken = getAuthCookie(ctx);
  if (!userToken) throw new TRPCError({ code: "UNAUTHORIZED" });

  const { id } = await userService.verifyAndDecodeUserToken(userToken);

  return options.next({
    ctx: {
      user: { id },
    },
  });
});
