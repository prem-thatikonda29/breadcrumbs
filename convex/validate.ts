import { MutationCtx, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const MAX_TITLE_LENGTH = 500;
export const MAX_URL_LENGTH = 2048;
export const MAX_TEXT_LENGTH = 20000;
export const MAX_ICON_BYTES = 1024 * 1024;

export function assertMaxLength(value: string | undefined, max: number, field: string) {
  if (value !== undefined && value.length > max) {
    throw new Error(`${field} must be at most ${max} characters`);
  }
}

export function assertHttpUrl(url: string) {
  assertMaxLength(url, MAX_URL_LENGTH, "URL");
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid URL");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http and https URLs are allowed");
  }
}

export function assertRating(rating: number | undefined) {
  if (rating !== undefined && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    throw new Error("Rating must be a whole number from 1 to 5");
  }
}

export async function assertOwnCollection(
  ctx: QueryCtx,
  collectionId: Id<"collections"> | undefined,
  userId: Id<"users">
) {
  if (collectionId === undefined) return;
  const collection = await ctx.db.get(collectionId);
  if (!collection || collection.userId !== userId) throw new Error("Collection not found");
}

// A new collection icon must be a fresh upload: an image under the size cap that no
// collection references yet. Rejected uploads are removed by storage.cleanupOrphanedFiles.
export async function assertNewIcon(ctx: MutationCtx, storageId: Id<"_storage">) {
  const file = await ctx.db.system.get(storageId);
  const inUse = await ctx.db
    .query("collections")
    .withIndex("by_iconStorageId", (q) => q.eq("iconStorageId", storageId))
    .first();
  if (!file || inUse) throw new Error("Icon upload not found");
  if (!file.contentType?.startsWith("image/") || file.size > MAX_ICON_BYTES) {
    throw new Error("Icon must be an image under 1 MB");
  }
}
