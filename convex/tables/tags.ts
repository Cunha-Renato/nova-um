import { getUserId } from "../api/api";
import {
  query,
  mutation,
  type QueryCtx,
  type MutationCtx,
} from "../_generated/server";
import { v } from "convex/values";

// Helper.
async function getTagUserAndName(
  ctx: QueryCtx | MutationCtx,
  user_id: string,
  name: string,
) {
  return await ctx.db
    .query("tags")
    .withIndex("by_user_and_name", (q) =>
      q.eq("user_id", user_id).eq("name", name),
    )
    .unique();
}

export const listTags = query({
  handler: async (ctx) => {
    const user_id = await getUserId(ctx.auth);

    return await ctx.db
      .query("tags")
      .withIndex("by_user", (q) => q.eq("user_id", user_id))
      .collect();
  },
});

export const getTagByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx.auth);

    await getTagUserAndName(ctx, user_id, args.name);
  },
});

export const addTag = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx.auth);
    const existing = await getTagUserAndName(ctx, user_id, args.name);

    if (existing) {
      throw new Error("Tag with this name already exists");
    }

    ctx.db.insert("tags", {
      user_id,
      name: args.name,
    });
  },
});

export const removeTag = mutation({
  args: {
    tag_id: v.id("tags"),
  },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx.auth);

    const tag = await ctx.db.get(args.tag_id);
    if (!tag || tag.user_id !== user_id) {
      throw new Error("Tag not found");
    }

    await ctx.db.delete(args.tag_id);
  },
});

export const updateTag = mutation({
  args: {
    tag_id: v.id("tags"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx.auth);

    const tag = await ctx.db.get(args.tag_id);

    if (!tag || tag.user_id !== user_id) {
      throw new Error("Tag not found");
    }

    await ctx.db.patch(args.tag_id, {
      name: args.name,
    });
  },
});
