import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getUserId } from "../api/api";

export const addCustomer = mutation({
  args: {
    name: v.string(),
    phone_number: v.string(),
    observations: v.string(),
  },
  handler: async (ctx, args) => {
    const user_id = getUserId(ctx.auth);
  },
});

// TODO: removeCustomer, updateCustomer, listCustomers
