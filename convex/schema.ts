import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
export default defineSchema({
  ...authTables,
  messages: defineTable({
    userId: v.id("users"),
    body: v.string(),
  }),
  documents: defineTable({
    title: v.string(),
    prompt: v.string(),
    active_version: v.number(),
    total_versions: v.number(),
    active_html: v.string(),
    active_variables: v.optional(v.any()),
    user_id: v.id("users"),
    is_processing: v.boolean(),
    doc_type: v.string(), 
    status: v.optional(v.string()),
  }),
  apiKey: defineTable({
    name: v.string(),
    key: v.string(),
    userId: v.id("users"),
  }),
  versions: defineTable({
    html: v.string(),
    variables: v.optional(v.any()),
    document_id: v.id("documents"),
    version: v.number(),
  })
});


