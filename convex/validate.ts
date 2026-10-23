import { QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const MAX_TITLE_LENGTH = 500;
export const MAX_URL_LENGTH = 2048;
export const MAX_TEXT_LENGTH = 20000;

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
