import { v } from "convex/values";
import { query } from "../_generated/server";

export const get = query({
	args: { id: v.id("test") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

export const get_by_value = query({
	args: { value: v.number() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("test")
			.withIndex("by_value", (q) => q.eq("value", args.value))
			.collect();
	},
});

export const list = query({
	handler: async (ctx) => {
		return await ctx.db.query("test").collect();
	},
});
