import { v } from "convex/values";

export const REMINDER_VALIDATOR = v.object({
  type: v.union(
    v.object({
      type: v.literal("once"),
      date: v.number(),
    }),
    v.object({
      type: v.literal("periodic"),
      interval: v.number(),
      unit: v.union(
        v.literal("h"),
        v.literal("d"),
        v.literal("w"),
        v.literal("m"),
      ),
    }),
  ),
  message: v.optional(v.string()),
});
