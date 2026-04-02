// convex/posts.ts
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getUserId } from "../api/api";

export const createTest = mutation({
  args: { value: v.number() },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx.auth);

    return await ctx.db.insert("test", {
      user_id,
      value: args.value,
    });
  },
});

export const listTests = query({
  handler: async (ctx) => {
    const user_id = await getUserId(ctx.auth);

    return await ctx.db
      .query("test")
      .withIndex("by_user", (q) => q.eq("user_id", user_id))
      .collect();
  },
});
