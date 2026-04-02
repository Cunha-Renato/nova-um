import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  customers: defineTable({
    user_id: v.string(),
    name: v.string(),
    phone_number: v.string(),
    observations: v.string(),
    tags: v.id("tags"),
    event_dates: v.id("event_dates"),
  }).index("by_user", ["user_id"]),

  tags: defineTable({
    user_id: v.string(),
    name: v.string(),
  })
    .index("by_user", ["user_id"])
    .index("by_user_and_name", ["user_id", "name"]),

  event_dates: defineTable({
    user_id: v.string(),
    name: v.string(),
    date: v.string(),
  })
    .index("by_user", ["user_id"])
    .index("by_user_and_name", ["user_id", "name"]),
});
