/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

async function setup() {
  const t = convexTest(schema, modules);
  const [alice, bob] = await t.run(async (ctx) => [
    await ctx.db.insert("users", { email: "alice@example.com" }),
    await ctx.db.insert("users", { email: "bob@example.com" }),
  ]);
  const asAlice = t.withIdentity({ subject: `${alice}|session` });
  const asBob = t.withIdentity({ subject: `${bob}|session` });
  const collectionId = await asAlice.mutation(api.collections.create, { name: "Alice's" });
  const { id: entryId } = await asAlice.mutation(api.entries.create, {
    title: "Alice's entry",
    url: "https://example.com/a",
    collectionId,
  });
  return { asAlice, asBob, collectionId, entryId };
}

describe("cross-user ownership", () => {
  test("cannot add a learning to another user's entry", async () => {
    const { asAlice, asBob, entryId } = await setup();
    await expect(
      asBob.mutation(api.learnings.create, { entryId, content: "injected" })
    ).rejects.toThrow("Not found");
    expect(await asAlice.query(api.learnings.getUserLearnings, {})).toEqual([]);
  });

  test("cannot create an entry in another user's collection", async () => {
    const { asBob, collectionId } = await setup();
    await expect(
      asBob.mutation(api.entries.create, {
        title: "x",
        url: "https://example.com/b",
        collectionId,
      })
    ).rejects.toThrow("Collection not found");
  });

  test("cannot move entries into another user's collection", async () => {
    const { asBob, collectionId } = await setup();
    const { id } = await asBob.mutation(api.entries.create, {
      title: "Bob's",
      url: "https://example.com/b",
    });
    await expect(
      asBob.mutation(api.entries.moveToCollection, { entryId: id, collectionId })
    ).rejects.toThrow("Collection not found");
    await expect(
      asBob.mutation(api.entries.bulkMove, { entryIds: [id], collectionId })
    ).rejects.toThrow("Collection not found");
  });

  test("owner can still use their own collection and entry", async () => {
    const { asAlice, collectionId, entryId } = await setup();
    await asAlice.mutation(api.learnings.create, { entryId, content: "mine", rating: 5 });
    expect(await asAlice.query(api.entries.getByCollection, { collectionId })).toHaveLength(1);
    expect(await asAlice.query(api.learnings.getUserLearnings, {})).toHaveLength(1);
  });
});

describe("input validation", () => {
  test("rejects non-http URLs", async () => {
    const { asAlice, entryId } = await setup();
    await expect(
      asAlice.mutation(api.entries.create, { title: "x", url: "javascript:alert(1)" })
    ).rejects.toThrow("Only http and https URLs are allowed");
    await expect(
      asAlice.mutation(api.entries.update, { entryId, title: "x", url: "not a url" })
    ).rejects.toThrow("Invalid URL");
  });

  test("rejects out-of-range ratings", async () => {
    const { asAlice, entryId } = await setup();
    for (const rating of [0, 6, 2.5]) {
      await expect(
        asAlice.mutation(api.learnings.create, { entryId, content: "x", rating })
      ).rejects.toThrow("Rating must be");
    }
  });

  test("rejects oversized text", async () => {
    const { asAlice, entryId } = await setup();
    await expect(
      asAlice.mutation(api.learnings.create, { entryId, content: "a".repeat(20001) })
    ).rejects.toThrow("Content must be at most");
  });
});
