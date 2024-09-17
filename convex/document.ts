import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query, internalQuery, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new Error("Not signed in");
        }
        const documents = ctx.db.query("documents")
            .filter(doc => doc.eq(doc.field("user_id"), userId))
            .order("desc").take(100)

        return documents
    },
});

export const create = mutation({
    args: {
        prompt: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new Error("Not signed in");
        }
        const document = await ctx.db.insert("documents", {
            prompt: args.prompt,
            user_id: userId,
            is_processing: true,
            title: "",
            active_html: "",
            active_variables: {},
            active_version: 0,
            total_versions: 0,
            doc_type: "pdf",
            status: "in_queue"
        });
        await ctx.scheduler.runAfter(0, internal.process.processDocumentAction, {
            id: document,
            prompt: args.prompt,
        })
        return document;
    },
});


export const getDocInfoUser = query({
    args: {
        id: v.id("documents"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new Error("Not signed in");
        }
        const document = await ctx.db.get(args.id);

        if (!document) {
            throw new Error("Document not found");
        }

        if (document.user_id !== userId) {
            throw new Error("Not authorized");
        }

        return document;
    },
});
export const getDocInfo = query({
    args: {
        id: v.id("documents"),
    },
    handler: async (ctx, args) => {
        const document = await ctx.db.get(args.id);
        return document;
    },
});

export const getDocByIDInternal = internalQuery({
    args: {
        id: v.id("documents"),
    },
    handler: async (ctx, args) => {
        const document = await ctx.db.get(args.id);
        return document;
    },
});

export const updateDocTitleInternal = internalMutation({
    args: {
        id: v.id("documents"),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const document = await ctx.db.get(args.id);
        await ctx.db.patch(args.id, {
            title: args.title,
        });

        return document;
    },
});

export const createDocVersion = internalMutation({
    args: {
        id: v.id("documents"),
        html: v.string(),
        variables: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const document = await ctx.db.get(args.id);

        if (!document) {
            throw new Error("Document not found");
        }
        const version = await ctx.db.insert("versions", {
            html: args.html,
            variables: args.variables,
            document_id: args.id,
            version: document.total_versions + 1,
        });
        await ctx.db.patch(args.id, {
            active_html: args.html,
            active_variables: args.variables,
            total_versions: document.total_versions + 1,
            active_version: document.total_versions + 1,
            is_processing: false,
        });
        return version;
    },
})

export const updateStatusInternal = internalMutation({
    args: {
        id: v.id("documents"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const document = await ctx.db.get(args.id);
        await ctx.db.patch(args.id, {
            status: args.status,
        });
        return document;
    },
})