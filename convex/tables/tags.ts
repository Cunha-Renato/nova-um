import { DEFAULT_COLOR, getUserId, sanitizeColor } from "../utils/utils";
import {
  query,
  mutation,
  type QueryCtx,
  type MutationCtx,
} from "../_generated/server";
import { v } from "convex/values";
import { removeTagAllCustomersFn } from "./customer";

// Helper.
async function getTagUserAndName(ctx: QueryCtx | MutationCtx, name: string) {
  const user_id = await getUserId(ctx);

  return user_id !== null
    ? await ctx.db
        .query("tags")
        .withIndex("by_user_and_name", (q) =>
          q.eq("user_id", user_id).eq("name", name),
        )
        .unique()
    : null;
}

export const listTags = query({
  handler: async (ctx) => {
    const user_id = await getUserId(ctx);

    return user_id !== null
      ? await ctx.db
          .query("tags")
          .withIndex("by_user", (q) => q.eq("user_id", user_id))
          .collect()
      : null;
  },
});

export const getTagByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await getTagUserAndName(ctx, args.name);
  },
});

export const addTag = mutation({
  args: {
    name: v.string(),
    color: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    const existing = await getTagUserAndName(ctx, args.name);
    if (existing !== null) return null; // already exists

    const color =
      args.color !== undefined ? sanitizeColor(args.color) : DEFAULT_COLOR;

    return await ctx.db.insert("tags", {
      user_id,
      name: args.name,
      color,
    });
  },
});

export const removeTag = mutation({
  args: {
    tag_id: v.id("tags"),
  },
  handler: async (ctx, args) => {
    const tag = await ctx.db.get(args.tag_id);
    if (tag == null) return null;

    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    if (tag.user_id === user_id) {
      // Remove the Tag from all the customers.
      await removeTagAllCustomersFn(ctx, args.tag_id);

      return await ctx.db.delete(args.tag_id);
    }

    return null;
  },
});

export const updateTag = mutation({
  args: {
    tag_id: v.id("tags"),
    name: v.string(),
    return_after: v.optional(v.number()),
    color: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const tag = await ctx.db.get(args.tag_id);
    if (tag == null) return null;

    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    if (tag.user_id !== user_id) {
      return null;
    }

    const existing = await ctx.db
      .query("tags")
      .withIndex("by_user_and_name", (q) =>
        q.eq("user_id", user_id).eq("name", args.name),
      )
      .unique();

    if (existing !== null) return null;

    const color =
      args.color !== undefined ? sanitizeColor(args.color) : tag.color;

    return await ctx.db.patch(args.tag_id, {
      name: args.name,
      color,
    });
  },
});
