/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

test("reassignUser moves all of a user's data", async () => {
  const t = convexTest(schema, modules);
  const [oldUser, newUser] = await t.run(async (ctx) => [
    await ctx.db.insert("users", { email: "old@example.com" }),
    await ctx.db.insert("users", { email: "new@example.com" }),
  ]);
  const asOld = t.withIdentity({ subject: `${oldUser}|session` });
  const asNew = t.withIdentity({ subject: `${newUser}|session` });
  const collectionId = await asOld.mutation(api.collections.create, { name: "c" });
  const { id: entryId } = await asOld.mutation(api.entries.create, {
    title: "e",
    url: "https://example.com",
    collectionId,
  });
  await asOld.mutation(api.learnings.create, { entryId, content: "note" });

  const dry = await t.mutation(internal.migrations.reassignUser, {
    fromUserId: oldUser,
    toUserId: newUser,
    dryRun: true,
  });
  expect(dry).toEqual({ dryRun: true, collections: 1, entries: 1, learnings: 1 });
  expect(await asNew.query(api.entries.getAll, {})).toHaveLength(0);

  await t.mutation(internal.migrations.reassignUser, {
    fromUserId: oldUser,
    toUserId: newUser,
    dryRun: false,
  });
  expect(await asNew.query(api.collections.list, {})).toHaveLength(1);
  expect(await asNew.query(api.entries.getByCollection, { collectionId })).toHaveLength(1);
  expect(await asNew.query(api.learnings.getUserLearnings, {})).toHaveLength(1);
  expect(await asOld.query(api.entries.getAll, {})).toHaveLength(0);
});
