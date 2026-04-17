import { v } from "convex/values";
import { mutation, type MutationCtx, query } from "../_generated/server";
import { getUserId } from "../utils/utils";
import type { Id } from "../_generated/dataModel";

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
      await removeAllEventDatesCustomerFn(ctx, args.customer_id);

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
    tag_id: v.id("tags"),
    customer_id: v.id("customers"),
  },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    const tag = await ctx.db.get(args.tag_id);
    if (tag === null) return null;

    const customer = await ctx.db.get(args.customer_id);
    if (customer === null) return null;

    return tag.user_id === user_id && customer.user_id === user_id
      ? await ctx.db.insert("customer_tags", {
          user_id,
          tag_id: args.tag_id,
          customer_id: args.customer_id,
        })
      : null;
  },
});

export const removeTagCustomer = mutation({
  args: {
    tag_id: v.id("tags"),
    customer_id: v.id("customers"),
  },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    const tag = await ctx.db.get(args.tag_id);
    if (tag === null) return null;

    const customer = await ctx.db.get(args.customer_id);
    if (customer === null) return null;

    const link = await ctx.db
      .query("customer_tags")
      .withIndex("by_customer", (q) => q.eq("customer_id", args.customer_id))
      .filter((q) => q.eq(q.field("tag_id"), args.tag_id))
      .unique();

    return tag.user_id === user_id &&
      customer.user_id === user_id &&
      link !== null
      ? await ctx.db.delete(link._id)
      : null;
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

// EVENTS
export const listAllEventDatesCustomer = query({
  args: { customer_id: v.id("customers") },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    const customer = await ctx.db.get(args.customer_id);
    if (customer === null) return null;

    return customer.user_id === user_id
      ? ctx.db
          .query("customer_event_dates")
          .withIndex("by_customer", (q) =>
            q.eq("customer_id", args.customer_id),
          )
          .collect()
      : null;
  },
});

export const addEventDateCustomer = mutation({
  args: {
    event_date_id: v.id("event_dates"),
    customer_id: v.id("customers"),
  },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    const event_date = await ctx.db.get(args.event_date_id);
    if (event_date === null) return null;

    const customer = await ctx.db.get(args.customer_id);
    if (customer === null) return null;

    return event_date.user_id === user_id && customer.user_id === user_id
      ? await ctx.db.insert("customer_event_dates", {
          user_id,
          event_date_id: args.event_date_id,
          customer_id: args.customer_id,
        })
      : null;
  },
});

export const removeEventDateCustomer = mutation({
  args: {
    event_date_id: v.id("event_dates"),
    customer_id: v.id("customers"),
  },
  handler: async (ctx, args) => {
    const user_id = await getUserId(ctx);
    if (user_id === null) return null;

    const event_date = await ctx.db.get(args.event_date_id);
    if (event_date === null) return null;

    const customer = await ctx.db.get(args.customer_id);
    if (customer === null) return null;

    const link = await ctx.db
      .query("customer_event_dates")
      .withIndex("by_customer", (q) => q.eq("customer_id", args.customer_id))
      .filter((q) => q.eq(q.field("event_date_id"), args.event_date_id))
      .unique();

    return event_date.user_id === user_id &&
      customer.user_id === user_id &&
      link !== null
      ? await ctx.db.delete(link._id)
      : null;
  },
});

async function removeAllEventDatesCustomerFn(
  ctx: MutationCtx,
  customer_id: Id<"customers">,
) {
  const user_id = await getUserId(ctx);
  if (user_id === null) return null;

  const customer = await ctx.db.get(customer_id);
  if (customer === null) return null;

  const links = await ctx.db
    .query("customer_event_dates")
    .withIndex("by_customer", (q) => q.eq("customer_id", customer_id))
    .collect();

  return customer.user_id === user_id
    ? await Promise.all(links.map((l) => ctx.db.delete(l._id)))
    : null;
}

export const removeAllEventDatesCustomer = mutation({
  args: { customer_id: v.id("customers") },
  handler: async (ctx, args) => {
    return await removeAllEventDatesCustomerFn(ctx, args.customer_id);
  },
});

export async function removeEventDateAllCustomersFn(
  ctx: MutationCtx,
  event_date_id: Id<"event_dates">,
) {
  const user_id = await getUserId(ctx);
  if (user_id === null) return null;

  const event_date = await ctx.db.get(event_date_id);
  if (event_date === null) return null;

  const links = await ctx.db
    .query("customer_event_dates")
    .withIndex("by_event_date", (q) => q.eq("event_date_id", event_date_id))
    .collect();

  return event_date.user_id === user_id
    ? await Promise.all(links.map((l) => ctx.db.delete(l._id)))
    : null;
}

export const removeEventDateAllCustomers = mutation({
  args: { event_date_id: v.id("event_dates") },
  handler: async (ctx, args) => {
    return await removeEventDateAllCustomersFn(ctx, args.event_date_id);
  },
});
