import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "../_generated/server";
import { getUserId } from "../utils/utils";
import { removeEventDateAllCustomersFn } from "./customer";

// Helper.
async function getEventDateUserAndName(
  ctx: QueryCtx | MutationCtx,
  name: string,
) {
  const user_id = await getUserId(ctx);

  return user_id !== null ? await ctx.db
    .query("event_dates")
    .withIndex("by_user_and_name", (q) => q.eq("user_id", user_id).eq("name", name))
    .unique()
    : null;
}

export const listEventDate = query({
  handler: async (ctx) => {
    const user_id = await getUserId(ctx);

    return user_id !== null ? await ctx.db
      .query("event_dates")
      .withIndex("by_user", (q) => q.eq("user_id", user_id))
      .collect()
      : null;
  },
});

export const getEventDateByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await getEventDateUserAndName(ctx, args.name);
  },
});

export const addEventDate = mutation({
  args: {
    name: v.string(),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    const existing = await getEventDateUserAndName(ctx, args.name);
    if (existing !== null) return null; // already exists

    return await ctx.db.insert("event_dates", { user_id, name: args.name, date: args.date });
  },
});

export const removeEventDate = mutation({
  args: {
    event_id: v.id("event_dates"),
  },
  handler: async (ctx, args) => {
    const event_date = await ctx.db.get(args.event_id);
    if (event_date == null) return null;

    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    if (event_date.user_id === user_id) {
      await removeEventDateAllCustomersFn(ctx, args.event_id);

      return await ctx.db.delete(args.event_id);
    }
    
    return null;
  },
});

export const updateEventDate = mutation({
  args: {
    event_id: v.id("event_dates"),
    name: v.string(),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    const event_date = await ctx.db.get(args.event_id);
    if (event_date == null) return null;

    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    if (event_date.user_id !== user_id) {
      return null;
    }

    const existing = await ctx.db
        .query("event_dates")
        .withIndex("by_user_and_name", (q) =>
          q.eq("user_id", user_id).eq("name", args.name),
        )
        .unique();

    if (existing !== null) return null;

    return await ctx.db.patch(args.event_id, { name: args.name, date: args.date });
  },
});