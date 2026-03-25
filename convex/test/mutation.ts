import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const create = mutation({
	args: { value: v.number() },
	handler: async (ctx, args) => {
		return await ctx.db.insert("test", {
			value: args.value,
		});
	},
});

export const update = mutation({
	args: {
		id: v.id("test"),
		value: v.number(),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.id, {
			value: args.value,
		});
	},
});

export const remove = mutation({
	args: { id: v.id("test") },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
	},
});
