import { internalMutation, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

const ORPHAN_GRACE_MS = 24 * 60 * 60 * 1000;
const MAX_DELETES_PER_RUN = 200;

// Collection icons are the only stored files, so any file older than a day that no
// collection references is an abandoned or rejected upload.
export const cleanupOrphanedFiles = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - ORPHAN_GRACE_MS;
    const files = ctx.db.system
      .query("_storage")
      .withIndex("by_creation_time", (q) => q.lt("_creationTime", cutoff));
    let deleted = 0;
    for await (const file of files) {
      if (deleted >= MAX_DELETES_PER_RUN) break;
      const inUse = await ctx.db
        .query("collections")
        .withIndex("by_iconStorageId", (q) => q.eq("iconStorageId", file._id))
        .first();
      if (!inUse) {
        await ctx.storage.delete(file._id);
        deleted++;
      }
    }
    return { deleted };
  },
});
