import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  collections: defineTable({
    userId: v.id("users"),
    name: v.string(),
    color: v.optional(v.string()),
    description: v.optional(v.string()),
    iconStorageId: v.optional(v.id("_storage")),
    archived: v.optional(v.boolean()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  entries: defineTable({
    userId: v.id("users"),
    collectionId: v.optional(v.id("collections")),
    title: v.string(),
    url: v.string(),
    status: v.union(v.literal("not_explored"), v.literal("explored")),
    dateAdded: v.number(),
    dateExplored: v.optional(v.number()),
    notes: v.optional(v.string()),
    order: v.optional(v.number()),
  })
    .index("by_userId_status", ["userId", "status"])
    .index("by_collectionId", ["collectionId"])
    .index("by_userId", ["userId"])
    .searchIndex("search_entries", {
      searchField: "title",
      filterFields: ["userId"],
    }),

  learnings: defineTable({
    entryId: v.id("entries"),
    userId: v.id("users"),
    content: v.string(),
    rating: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_entryId", ["entryId"])
    .index("by_userId", ["userId"])
    .searchIndex("search_learnings", {
      searchField: "content",
      filterFields: ["userId"],
    }),
});
