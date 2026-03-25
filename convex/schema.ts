import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	test: defineTable({
		value: v.number(),
	}).index("by_value", ["value"]),
});
