import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const collections = await ctx.db
      .query("collections")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return await Promise.all(
      collections.map(async (col) => ({
        ...col,
        iconUrl: col.iconStorageId ? await ctx.storage.getUrl(col.iconStorageId) : null,
      }))
    );
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    color: v.optional(v.string()),
    description: v.optional(v.string()),
    iconStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("collections", {
      userId,
      name: args.name,
      color: args.color,
      description: args.description,
      iconStorageId: args.iconStorageId,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    collectionId: v.id("collections"),
    name: v.string(),
    color: v.optional(v.string()),
    description: v.optional(v.string()),
    iconStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const collection = await ctx.db.get(args.collectionId);
    if (!collection || collection.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.collectionId, {
      name: args.name,
      color: args.color,
      description: args.description,
      iconStorageId: args.iconStorageId,
    });
  },
});

export const remove = mutation({
  args: { collectionId: v.id("collections") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const collection = await ctx.db.get(args.collectionId);
    if (!collection || collection.userId !== userId) throw new Error("Not found");

    const entries = await ctx.db
      .query("entries")
      .withIndex("by_collectionId", (q) => q.eq("collectionId", args.collectionId))
      .collect();

    for (const entry of entries) {
      const learnings = await ctx.db
        .query("learnings")
        .withIndex("by_entryId", (q) => q.eq("entryId", entry._id))
        .collect();
      for (const learning of learnings) {
        await ctx.db.delete(learning._id);
      }
      await ctx.db.delete(entry._id);
    }

    await ctx.db.delete(args.collectionId);
  },
});
