import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  test: defineTable({
    user_id: v.string(),
    value: v.number(),
  })
  .index("by_user", ["user_id"])
  .index("by_value", ["value"]),
});
