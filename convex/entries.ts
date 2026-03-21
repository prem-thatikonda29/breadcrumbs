import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    title: v.string(),
    url: v.string(),
    collectionId: v.id("collections"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("entries", {
      userId,
      collectionId: args.collectionId,
      title: args.title,
      url: args.url,
      status: "not_explored",
      dateAdded: Date.now(),
      notes: args.notes,
    });
  },
});

export const get = query({
  args: { entryId: v.id("entries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const entry = await ctx.db.get(args.entryId);
    if (!entry || entry.userId !== userId) return null;
    return entry;
  },
});

export const getUnexplored = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("entries")
      .withIndex("by_userId_status", (q) =>
        q.eq("userId", userId).eq("status", "not_explored")
      )
      .order("desc")
      .collect();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("entries")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getByCollection = query({
  args: { collectionId: v.id("collections") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const entries = await ctx.db
      .query("entries")
      .withIndex("by_collectionId", (q) => q.eq("collectionId", args.collectionId))
      .collect();
    const filtered = entries.filter((e) => e.userId === userId);
    return filtered.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return b.dateAdded - a.dateAdded;
    });
  },
});

export const markExplored = mutation({
  args: { entryId: v.id("entries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const entry = await ctx.db.get(args.entryId);
    if (!entry || entry.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.entryId, {
      status: "explored",
      dateExplored: Date.now(),
    });
  },
});

export const markUnexplored = mutation({
  args: { entryId: v.id("entries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const entry = await ctx.db.get(args.entryId);
    if (!entry || entry.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.entryId, {
      status: "not_explored",
      dateExplored: undefined,
    });
  },
});

export const remove = mutation({
  args: { entryId: v.id("entries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const entry = await ctx.db.get(args.entryId);
    if (!entry || entry.userId !== userId) throw new Error("Not found");

    // Delete all learnings for this entry
    const learnings = await ctx.db
      .query("learnings")
      .withIndex("by_entryId", (q) => q.eq("entryId", args.entryId))
      .collect();
    for (const learning of learnings) {
      await ctx.db.delete(learning._id);
    }

    await ctx.db.delete(args.entryId);
  },
});

export const update = mutation({
  args: {
    entryId: v.id("entries"),
    title: v.string(),
    url: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const entry = await ctx.db.get(args.entryId);
    if (!entry || entry.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.entryId, { title: args.title, url: args.url, notes: args.notes });
  },
});

export const moveToCollection = mutation({
  args: {
    entryId: v.id("entries"),
    collectionId: v.id("collections"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const entry = await ctx.db.get(args.entryId);
    if (!entry || entry.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.entryId, { collectionId: args.collectionId });
  },
});

export const reorder = mutation({
  args: { orderedIds: v.array(v.id("entries")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    for (let i = 0; i < args.orderedIds.length; i++) {
      const entry = await ctx.db.get(args.orderedIds[i]);
      if (!entry || entry.userId !== userId) continue;
      await ctx.db.patch(args.orderedIds[i], { order: i });
    }
  },
});

export const bulkMarkExplored = mutation({
  args: { entryIds: v.array(v.id("entries")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const now = Date.now();
    for (const entryId of args.entryIds) {
      const entry = await ctx.db.get(entryId);
      if (!entry || entry.userId !== userId) continue;
      await ctx.db.patch(entryId, { status: "explored", dateExplored: now });
    }
  },
});

export const bulkRemove = mutation({
  args: { entryIds: v.array(v.id("entries")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    for (const entryId of args.entryIds) {
      const entry = await ctx.db.get(entryId);
      if (!entry || entry.userId !== userId) continue;
      const learnings = await ctx.db
        .query("learnings")
        .withIndex("by_entryId", (q) => q.eq("entryId", entryId))
        .collect();
      for (const l of learnings) await ctx.db.delete(l._id);
      await ctx.db.delete(entryId);
    }
  },
});

export const bulkMove = mutation({
  args: {
    entryIds: v.array(v.id("entries")),
    collectionId: v.id("collections"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    for (const entryId of args.entryIds) {
      const entry = await ctx.db.get(entryId);
      if (!entry || entry.userId !== userId) continue;
      await ctx.db.patch(entryId, { collectionId: args.collectionId });
    }
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    if (!args.query.trim()) return [];
    return await ctx.db
      .query("entries")
      .withSearchIndex("search_entries", (q) =>
        q.search("title", args.query).eq("userId", userId)
      )
      .take(20);
  },
});
