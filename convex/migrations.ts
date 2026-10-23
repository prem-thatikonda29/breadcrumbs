import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// One-off: move a user's collections, entries and learnings to another user,
// e.g. when a former password account signs in again with Google.
// Run from the Convex dashboard or `npx convex run migrations:reassignUser`.
export const reassignUser = internalMutation({
  args: { fromUserId: v.id("users"), toUserId: v.id("users"), dryRun: v.boolean() },
  handler: async (ctx, args) => {
    if (args.fromUserId === args.toUserId) throw new Error("fromUserId and toUserId are the same");
    if (!(await ctx.db.get(args.fromUserId))) throw new Error("fromUserId not found");
    if (!(await ctx.db.get(args.toUserId))) throw new Error("toUserId not found");

    const collections = await ctx.db
      .query("collections")
      .withIndex("by_userId", (q) => q.eq("userId", args.fromUserId))
      .collect();
    const entries = await ctx.db
      .query("entries")
      .withIndex("by_userId", (q) => q.eq("userId", args.fromUserId))
      .collect();
    const learnings = await ctx.db
      .query("learnings")
      .withIndex("by_userId", (q) => q.eq("userId", args.fromUserId))
      .collect();

    if (!args.dryRun) {
      for (const doc of [...collections, ...entries, ...learnings]) {
        await ctx.db.patch(doc._id, { userId: args.toUserId });
      }
    }
    return {
      dryRun: args.dryRun,
      collections: collections.length,
      entries: entries.length,
      learnings: learnings.length,
    };
  },
});
