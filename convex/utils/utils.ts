import { Option } from "result_option";
import type { QueryCtx, MutationCtx } from "../_generated/server";

export async function getUserId(ctx: QueryCtx | MutationCtx) {
  const id = await ctx.auth.getUserIdentity();
  
  return id === null ? null : id.subject;
}
