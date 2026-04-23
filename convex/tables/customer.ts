import { v } from "convex/values";
import { mutation, type MutationCtx, query } from "../_generated/server";
import { getUserId, sanitizeDate } from "../utils/utils";
import type { Id } from "../_generated/dataModel";
import { REMINDER_VALIDATOR } from "../validator";

export const listCustomers = query({
  handler: async (ctx) => {
    const user_id = await getUserId(ctx);

    return user_id !== null
      ? await ctx.db
          .query("customers")
          .withIndex("by_user", (q) => q.eq("user_id", user_id))
          .collect()
      : null;
  },
});

export const addCustomer = mutation({
  args: {
    name: v.string(),
    phone_number: v.number(),
    observations: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx);

    return user_id !== null
      ? await ctx.db.insert("customers", {
          user_id,
          name: args.name,
          phone_number: args.phone_number,
          observations: args.observations,
        })
      : null;
  },
});

export const removeCustomer = mutation({
  args: { customer_id: v.id("customers") },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    const customer = await ctx.db.get(args.customer_id);
    if (customer === null) return null;

    if (customer.user_id === user_id) {
      // Remove this customer from customer_tags.
      await removeAllTagsCustomerFn(ctx, args.customer_id);

      return await ctx.db.delete(args.customer_id);
    }

    return null;
  },
});

export const updateCustomer = mutation({
  args: {
    customer_id: v.id("customers"),
    name: v.string(),
    phone_number: v.number(),
    observations: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    const customer = await ctx.db.get(args.customer_id);
    if (customer === null) return null;

    return customer.user_id === user_id
      ? await ctx.db.patch(args.customer_id, {
          name: args.name,
          phone_number: args.phone_number,
          observations: args.observations,
        })
      : null;
  },
});

// TAGS
export const listAllTagsCustomer = query({
  args: { customer_id: v.id("customers") },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    const customer = await ctx.db.get(args.customer_id);
    if (customer === null) return null;

    return customer.user_id === user_id
      ? ctx.db
          .query("customer_tags")
          .withIndex("by_customer", (q) =>
            q.eq("customer_id", args.customer_id),
          )
          .collect()
      : null;
  },
});

export const addTagCustomer = mutation({
  args: {
    customer_id: v.id("customers"),
    tag_id: v.id("tags"),
    date: v.optional(v.number()),
    reminder: v.optional(REMINDER_VALIDATOR),
  },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    const tag = await ctx.db.get(args.tag_id);
    if (tag === null) return null;

    const customer = await ctx.db.get(args.customer_id);
    if (customer === null) return null;

    if (tag.user_id !== user_id && customer.user_id !== user_id) {
      return null;
    }

    const duplicate = ctx.db
      .query("customer_tags")
      .withIndex("by_tag", (q) => q.eq("tag_id", tag._id))
      .unique();

    if (duplicate !== null) return null;

    const date =
      args.date !== undefined && sanitizeDate(args.date)
        ? args.date
        : undefined;

    if (
      args.reminder !== undefined &&
      args.reminder.type.type === "once" &&
      !sanitizeDate(args.reminder.type.date)
    ) {
      return null;
    }

    return await ctx.db.insert("customer_tags", {
      user_id,
      tag_id: args.tag_id,
      customer_id: args.customer_id,
      date,
      reminder: args.reminder,
    });
  },
});

export const removeTagCustomer = mutation({
  args: { id: v.id("customer_tags") },
  handler: async (ctx, args) => {
    const customer_tag = await ctx.db
      .query("customer_tags")
      .withIndex("by_id", (q) => q.eq("_id", args.id))
      .unique();
    if (customer_tag === null) return null;

    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    if (user_id !== customer_tag.user_id) return null;

    return await ctx.db.delete(customer_tag._id);
  },
});

async function removeAllTagsCustomerFn(
  ctx: MutationCtx,
  customer_id: Id<"customers">,
) {
  const user_id = await getUserId(ctx);
  if (user_id === null) return null;

  const customer = await ctx.db.get(customer_id);
  if (customer === null) return null;

  const links = await ctx.db
    .query("customer_tags")
    .withIndex("by_customer", (q) => q.eq("customer_id", customer_id))
    .collect();

  return customer.user_id === user_id
    ? await Promise.all(links.map((l) => ctx.db.delete(l._id)))
    : null;
}

export const removeAllTagsCustomer = mutation({
  args: { customer_id: v.id("customers") },
  handler: async (ctx, args) => {
    return await removeAllTagsCustomerFn(ctx, args.customer_id);
  },
});

export async function removeTagAllCustomersFn(
  ctx: MutationCtx,
  tag_id: Id<"tags">,
) {
  const user_id = await getUserId(ctx);
  if (user_id === null) return null;

  const tag = await ctx.db.get(tag_id);
  if (tag === null) return null;

  const links = await ctx.db
    .query("customer_tags")
    .withIndex("by_tag", (q) => q.eq("tag_id", tag_id))
    .collect();

  return tag.user_id === user_id
    ? await Promise.all(links.map((l) => ctx.db.delete(l._id)))
    : null;
}

export const removeTagAllCustomers = mutation({
  args: { tag_id: v.id("tags") },
  handler: async (ctx, args) => {
    return await removeTagAllCustomersFn(ctx, args.tag_id);
  },
});

export const updateTagCustomer = mutation({
  args: {
    id: v.id("customer_tags"),
    date: v.optional(v.number()),
    reminder: v.optional(REMINDER_VALIDATOR),
  },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    const customer_tag = await ctx.db.get(args.id);
    if (customer_tag === null) return null;
    if (customer_tag.user_id !== user_id) return null;

    const date =
      args.date !== undefined && sanitizeDate(args.date)
        ? args.date
        : undefined;

    if (
      args.reminder !== undefined &&
      args.reminder.type.type === "once" &&
      !sanitizeDate(args.reminder.type.date)
    ) {
      return null;
    }

    return await ctx.db.patch(args.id, {
      date,
      reminder: args.reminder,
    });
  },
});
