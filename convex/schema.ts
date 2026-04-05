import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  customers: defineTable({
    user_id: v.string(),
    name: v.string(),
    phone_number: v.number(),
    observations: v.optional(v.string()),
  }).index("by_user", ["user_id"]),

  customer_tags: defineTable({
    customer_id: v.id("customers"),
    tag_id: v.id("tags")
  })
    .index("by_customer", ["customer_id"])
    .index("by_tag", ["tag_id"]),

  customer_event_dates: defineTable({
    customer_id: v.id("customers"),
    event_date_id: v.id("event_dates"),
  })
    .index("by_customer", ["customer_id"])
    .index("by_event_date", ["event_date_id"]),

  tags: defineTable({
    user_id: v.string(),
    name: v.string(),
  })
    .index("by_user", ["user_id"])
    .index("by_user_and_name", ["user_id", "name"]),

  event_dates: defineTable({
    user_id: v.string(),
    name: v.string(),
    date: v.number(),
  })
    .index("by_user", ["user_id"])
    .index("by_user_and_name", ["user_id", "name"]),
});
