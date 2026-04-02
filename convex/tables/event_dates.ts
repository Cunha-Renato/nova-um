import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "../_generated/server";
import { getUserId } from "../api/api";

async function getEventDateUserAndName(
  ctx: QueryCtx | MutationCtx,
  user_id: string,
  name: string,
) {
  return await ctx.db
    .query("event_dates")
    .withIndex("by_user_and_name", (q) =>
      q.eq("user_id", user_id).eq("name", name),
    )
    .unique();
}

export const listEventDate = query({
  handler: async (ctx) => {
    const user_id = await getUserId(ctx.auth);

    return await ctx.db
      .query("event_dates")
      .withIndex("by_user", (q) => q.eq("user_id", user_id))
      .collect();
  },
});

export const getTagByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx.auth);

    await getEventDateUserAndName(ctx, user_id, args.name);
  },
});

export const addEventDate = mutation({
  args: {
    name: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx.auth);
    const existing = await getEventDateUserAndName(ctx, user_id, args.name);

    if (existing) {
      throw new Error("EventDate with this name already exists");
    }

    ctx.db.insert("event_dates", {
      user_id,
      name: args.name,
      date: args.date,
    });
  },
});

// TODO: removeEventDate, updateEventDate, listEventDates
