/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api, internal } from "./_generated/api";
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
  const store = (blob: Blob) => t.run((ctx) => ctx.storage.store(blob));
  const image = () => store(new Blob(["png"], { type: "image/png" }));
  return { t, alice, bob, asAlice, asBob, store, image };
}

describe("collection icons", () => {
  test("rejects non-images and oversized files", async () => {
    const { asAlice, store } = await setup();
    const text = await store(new Blob(["hi"], { type: "text/plain" }));
    await expect(
      asAlice.mutation(api.collections.create, { name: "c", iconStorageId: text })
    ).rejects.toThrow("Icon must be an image");
    const big = await store(new Blob([new Uint8Array(1024 * 1024 + 1)], { type: "image/png" }));
    await expect(
      asAlice.mutation(api.collections.create, { name: "c", iconStorageId: big })
    ).rejects.toThrow("Icon must be an image");
  });

  test("cannot reuse another collection's icon", async () => {
    const { asAlice, asBob, image } = await setup();
    const icon = await image();
    await asAlice.mutation(api.collections.create, { name: "a", iconStorageId: icon });
    await expect(
      asBob.mutation(api.collections.create, { name: "b", iconStorageId: icon })
    ).rejects.toThrow("Icon upload not found");
  });

  test("replacing or removing a collection deletes its old icon", async () => {
    const { t, asAlice, image } = await setup();
    const first = await image();
    const collectionId = await asAlice.mutation(api.collections.create, {
      name: "c",
      iconStorageId: first,
    });
    const second = await image();
    await asAlice.mutation(api.collections.update, {
      collectionId,
      name: "c",
      iconStorageId: second,
    });
    expect(await t.run((ctx) => ctx.db.system.get(first))).toBeNull();
    await asAlice.mutation(api.collections.remove, { collectionId });
    expect(await t.run((ctx) => ctx.db.system.get(second))).toBeNull();
  });

  test("cleanup deletes only old unreferenced files", async () => {
    const { t, asAlice, image } = await setup();
    const used = await image();
    await asAlice.mutation(api.collections.create, { name: "c", iconStorageId: used });
    const orphan = await image();
    const fresh = Date.now();
    // Files younger than a day are left alone.
    expect(await t.mutation(internal.storage.cleanupOrphanedFiles, {})).toEqual({ deleted: 0 });
    const realNow = Date.now;
    Date.now = () => fresh + 25 * 60 * 60 * 1000;
    try {
      expect(await t.mutation(internal.storage.cleanupOrphanedFiles, {})).toEqual({ deleted: 1 });
    } finally {
      Date.now = realNow;
    }
    expect(await t.run((ctx) => ctx.db.system.get(orphan))).toBeNull();
    expect(await t.run((ctx) => ctx.db.system.get(used))).not.toBeNull();
  });
});

describe("deleteAccount", () => {
  test("removes the user's data and auth records, and nobody else's", async () => {
    const { t, alice, bob, asAlice, asBob, image } = await setup();
    for (const [as, userId] of [[asAlice, alice], [asBob, bob]] as const) {
      const collectionId = await as.mutation(api.collections.create, {
        name: "c",
        iconStorageId: await image(),
      });
      const { id: entryId } = await as.mutation(api.entries.create, {
        title: "e",
        url: "https://example.com",
        collectionId,
      });
      await as.mutation(api.learnings.create, { entryId, content: "note" });
      await t.run(async (ctx) => {
        const accountId = await ctx.db.insert("authAccounts", {
          userId,
          provider: "google",
          providerAccountId: `${userId}`,
        });
        await ctx.db.insert("authVerificationCodes", {
          accountId,
          provider: "google",
          code: `${userId}`,
          expirationTime: 0,
        });
        const sessionId = await ctx.db.insert("authSessions", { userId, expirationTime: 0 });
        await ctx.db.insert("authRefreshTokens", { sessionId, expirationTime: 0 });
      });
    }

    await asAlice.mutation(api.users.deleteAccount, {});

    const remaining = await t.run(async (ctx) => {
      const tables = [
        "users",
        "collections",
        "entries",
        "learnings",
        "authAccounts",
        "authSessions",
        "authRefreshTokens",
        "authVerificationCodes",
      ] as const;
      const counts: Record<string, number> = {};
      for (const table of tables) counts[table] = (await ctx.db.query(table).collect()).length;
      counts.files = (await ctx.db.system.query("_storage").collect()).length;
      return counts;
    });
    // Only Bob's one row per table (and his one icon) is left.
    for (const count of Object.values(remaining)) expect(count).toBe(1);
    expect(await t.run((ctx) => ctx.db.get(bob))).not.toBeNull();
    expect(await asBob.query(api.entries.getAll, {})).toHaveLength(1);
  });
});
