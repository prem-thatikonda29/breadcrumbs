import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    entryId: v.id("entries"),
    content: v.string(),
    rating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const now = Date.now();
    return await ctx.db.insert("learnings", {
      entryId: args.entryId,
      userId,
      content: args.content,
      rating: args.rating,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getByEntry = query({
  args: { entryId: v.id("entries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const learnings = await ctx.db
      .query("learnings")
      .withIndex("by_entryId", (q) => q.eq("entryId", args.entryId))
      .order("desc")
      .collect();
    return learnings.filter((l) => l.userId === userId);
  },
});

export const getUserLearnings = query({
  args: { collectionId: v.optional(v.id("collections")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let entries;
    if (args.collectionId) {
      entries = await ctx.db
        .query("entries")
        .withIndex("by_collectionId", (q) => q.eq("collectionId", args.collectionId!))
        .collect();
      entries = entries.filter((e) => e.userId === userId);
    } else {
      entries = await ctx.db
        .query("entries")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .collect();
    }

    const result = [];
    for (const entry of entries) {
      const learnings = await ctx.db
        .query("learnings")
        .withIndex("by_entryId", (q) => q.eq("entryId", entry._id))
        .order("asc")
        .collect();
      if (learnings.length > 0) {
        result.push({ entry, learnings });
      }
    }
    return result;
  },
});

export const update = mutation({
  args: {
    learningId: v.id("learnings"),
    content: v.string(),
    rating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const learning = await ctx.db.get(args.learningId);
    if (!learning || learning.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.learningId, {
      content: args.content,
      rating: args.rating,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { learningId: v.id("learnings") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const learning = await ctx.db.get(args.learningId);
    if (!learning || learning.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.learningId);
  },
});

export const searchEntryIds = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    if (!args.query.trim()) return [];
    const learnings = await ctx.db
      .query("learnings")
      .withSearchIndex("search_learnings", (q) =>
        q.search("content", args.query).eq("userId", userId)
      )
      .take(20);
    // Return unique entry IDs
    return [...new Set(learnings.map((l) => l.entryId))];
  },
});
