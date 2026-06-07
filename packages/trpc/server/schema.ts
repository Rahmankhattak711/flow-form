import { z } from "zod";

/** tRPC HTTP clients send `{}` for no-input procedures; Zod rejects that on z.undefined(). */
export const emptyInputModel = z.object({}).describe("No input");
/** @deprecated Use emptyInputModel for procedure inputs */
export const zodUndefinedModel = emptyInputModel;
export { z };
