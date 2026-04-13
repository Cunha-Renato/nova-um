import type { MutationCtx, QueryCtx } from "../_generated/server";

export const DEFAULT_COLOR = 0xffffffff;

export async function getUserId(ctx: QueryCtx | MutationCtx) {
  const id = await ctx.auth.getUserIdentity();

  return id === null ? null : id.subject;
}

export function sanitizeColor(color: number): number {
  if (color < 0) {
    return 0;
  } else if (color > DEFAULT_COLOR) {
    return DEFAULT_COLOR;
  }

  return color;
}

export function sanitizeDate(date: number): boolean {
  const minute = date % 100;
  const hour = Math.floor(date / 100) % 100;
  const month = Math.floor(date / 100000000) % 100;
  const day = Math.floor(date / 10000000000);

  if (
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  )
    return false;

  return true;
}
