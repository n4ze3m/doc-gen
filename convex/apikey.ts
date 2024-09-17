import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function generateApiKey() {
    const prefix = "sk_pdf_";
    const randomPart = Array(16)
        .fill(0)
        .map(() => {
            return Math.floor(Math.random() * 36).toString(36);
        })
        .join("");

    const uniqueKey = `${prefix}${randomPart}_${Date.now()}`;
    return uniqueKey;
}

export const list = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            throw new Error("Not authenticated");
        }

        const apiKeys = await ctx.db
            .query("apiKey")
            .filter((q) => q.eq(q.field("userId"), userId))
            .collect();
        return apiKeys;
    },
});


export const create = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            throw new Error("Not authenticated");
        }


        const apiKey = generateApiKey();

        await ctx.db.insert("apiKey", {
            userId,
            name: args.name,
            key: apiKey,
        });


        return apiKey;
    }
})

export const deleteApiKey = mutation({
    args: {
        id: v.id("apiKey"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            throw new Error("Not authenticated");
        }

        const isExist = await ctx.db.query("apiKey").filter((q) => q.eq(q.field("userId"), userId)).first();

        if (!isExist) {
            throw new Error("Api key not found");
        }


        await ctx.db.delete(args.id);


        return true

    }
})

export const getApiKey = query({
    args: {
        apiKey: v.string(),
    },
    handler: async (ctx, args) => {
        const apiKey = await ctx.db.query("apiKey").filter((q) => q.eq(q.field("key"), args.apiKey)).first();
        return apiKey;
    }
})