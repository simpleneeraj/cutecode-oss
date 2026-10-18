import { describe, it, expect } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { Plan, presentations, shareLinks, snippets, ShareVisibility } from "@/db/schema";
import { callerFor, type Caller } from "./support/caller";
import { createSubscription, createUser } from "./support/factories";
import { insertShare, publishInput } from "./support/content";

type Procedure = (input?: unknown) => Promise<unknown>;

function procedure(caller: Caller, path: string): Procedure {
  return path.split(".").reduce<unknown>((node, key) => (node as Record<string, unknown>)[key], caller) as Procedure;
}

const PROTECTED: [string, unknown][] = [
  ["snippet.list", {}],
  ["snippet.get", { id: "x" }],
  ["snippet.create", { presentationId: "x", elementId: "x" }],
  ["snippet.update", { id: "x", data: {} }],
  ["snippet.delete", { id: "x" }],
  ["snippet.togglePin", { id: "x" }],
  ["snippet.toggleUpvote", { snippetId: "x" }],
  ["snippet.toggleBookmark", { snippetId: "x" }],
  ["snippet.addComment", { snippetId: "x", content: "hi" }],
  ["snippet.remix", { slug: "x" }],
  ["presentation.list", {}],
  ["presentation.get", { id: "x" }],
  ["presentation.create", {}],
  ["presentation.sync", { id: "x", data: {} }],
  ["presentation.delete", { id: "x" }],
  ["share.list", {}],
  ["share.create", { snippetId: "x" }],
  ["share.update", { id: "x", data: {} }],
  ["share.delete", { id: "x" }],
  ["share.analytics", { id: "x" }],
  ["user.toggleFollow", { targetUserId: "x" }],
  ["publish.publish", publishInput()],
  ["billing.status", undefined],
  ["dashboard.summary", undefined],
  ["dashboard.viewsByDay", undefined],
];

describe("unauthenticated access", () => {
  it.each(PROTECTED)("%s rejects anonymous callers", async (path, input) => {
    const caller = await callerFor(null);
    await expect(procedure(caller, path)(input)).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("snippet.explore stays public", async () => {
    const caller = await callerFor(null);
    await expect(caller.snippet.explore({})).resolves.toMatchObject({ snippets: [] });
  });
});

async function twoUsers() {
  const owner = await createUser(Plan.PREMIUM);
  const intruder = await createUser(Plan.PREMIUM);
  const seeded = await insertShare(owner.id, { title: "Owner title" });
  return { owner, intruder, ...seeded, asIntruder: await callerFor(intruder), asOwner: await callerFor(owner) };
}

describe("ownership", () => {
  it("snippet.get hides another user's snippet", async () => {
    const { snippet, asIntruder } = await twoUsers();
    await expect(asIntruder.snippet.get({ id: snippet.id })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("snippet.update cannot modify another user's snippet", async () => {
    const { snippet, asIntruder } = await twoUsers();
    await expect(asIntruder.snippet.update({ id: snippet.id, data: { title: "pwned", isPublic: false } })).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
    const row = await db.query.snippets.findFirst({ where: eq(snippets.id, snippet.id) });
    expect(row?.title).toBe("Owner title");
    expect(row?.isPublic).toBe(true);
  });

  it("snippet.delete cannot remove another user's snippet", async () => {
    const { snippet, asIntruder } = await twoUsers();
    await expect(asIntruder.snippet.delete({ id: snippet.id })).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(await db.$count(snippets, eq(snippets.id, snippet.id))).toBe(1);
  });

  it("snippet.create cannot attach to another user's presentation", async () => {
    const { presentation, snippet, asIntruder } = await twoUsers();
    await expect(
      asIntruder.snippet.create({ presentationId: presentation.id, elementId: snippet.elementId }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("snippet.list only returns the caller's snippets", async () => {
    const { asIntruder } = await twoUsers();
    await expect(asIntruder.snippet.list({})).resolves.toMatchObject({ snippets: [], total: 0 });
  });

  it("presentation.get, sync and delete reject another user's presentation", async () => {
    const { presentation, asIntruder } = await twoUsers();
    await expect(asIntruder.presentation.get({ id: presentation.id })).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(asIntruder.presentation.sync({ id: presentation.id, data: { name: "pwned" } })).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
    await expect(asIntruder.presentation.delete({ id: presentation.id })).rejects.toMatchObject({ code: "NOT_FOUND" });
    const row = await db.query.presentations.findFirst({ where: eq(presentations.id, presentation.id) });
    expect(row?.name).toBe("Seeded");
  });

  it("presentation.list only returns the caller's presentations", async () => {
    const { asIntruder } = await twoUsers();
    await expect(asIntruder.presentation.list({})).resolves.toMatchObject({ presentations: [], total: 0 });
  });

  it("share.update and share.delete reject another user's link", async () => {
    const { link, asIntruder } = await twoUsers();
    await expect(asIntruder.share.update({ id: link.id, data: { visibility: ShareVisibility.PRIVATE } })).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
    await expect(asIntruder.share.delete({ id: link.id })).rejects.toMatchObject({ code: "NOT_FOUND" });
    const row = await db.query.shareLinks.findFirst({ where: eq(shareLinks.id, link.id) });
    expect(row?.visibility).toBe(ShareVisibility.PUBLIC);
  });

  it("share.analytics rejects another user's link", async () => {
    const { link, asIntruder } = await twoUsers();
    await expect(asIntruder.share.analytics({ id: link.id })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("share.create cannot share another user's snippet", async () => {
    const { snippet, asIntruder } = await twoUsers();
    await expect(asIntruder.share.create({ snippetId: snippet.id })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(await db.$count(shareLinks, eq(shareLinks.snippetId, snippet.id))).toBe(1);
  });

  it("share.list does not leak another user's links when filtering by their snippet", async () => {
    const { snippet, asIntruder } = await twoUsers();
    await expect(asIntruder.share.list({ snippetId: snippet.id })).resolves.toEqual([]);
  });

  it("dashboard.summary only covers the caller's snippets", async () => {
    const { asIntruder } = await twoUsers();
    const summary = await asIntruder.dashboard.summary();
    expect(summary.rows).toEqual([]);
    expect(summary.totalSnippets).toBe(0);
  });

  it("billing.status reports the caller's own subscription", async () => {
    const { owner, asIntruder } = await twoUsers();
    await createSubscription({ userId: owner.id, cancelAtPeriodEnd: true });
    await expect(asIntruder.billing.status()).resolves.toMatchObject({ cancelAtPeriodEnd: false, renewsAt: null });
  });

  it("publish.publish with another user's elementId creates a new snippet instead of editing theirs", async () => {
    const { snippet, intruder, asIntruder } = await twoUsers();
    await asIntruder.publish.publish(publishInput({ elementId: snippet.elementId, title: "pwned" }));
    const row = await db.query.snippets.findFirst({ where: eq(snippets.id, snippet.id) });
    expect(row?.title).toBe("Owner title");
    expect(await db.$count(snippets, eq(snippets.userId, intruder.id))).toBe(1);
  });

  it("user.profile does not expose another user's email", async () => {
    const { owner, asIntruder } = await twoUsers();
    const profile = await asIntruder.user.profile({ userId: owner.id });
    expect(JSON.stringify(profile)).not.toContain(owner.email);
  });

  it("snippet.togglePin cannot pin another user's snippet", async () => {
    const { snippet, asIntruder } = await twoUsers();
    await expect(asIntruder.snippet.togglePin({ id: snippet.id })).rejects.toMatchObject({ code: "NOT_FOUND" });
    const row = await db.query.snippets.findFirst({ where: eq(snippets.id, snippet.id) });
    expect(row?.pinnedAt).toBeNull();
  });

  it("snippet.togglePin toggles the owner's pin and caps pins at three", async () => {
    const { owner, snippet, asOwner } = await twoUsers();
    await expect(asOwner.snippet.togglePin({ id: snippet.id })).resolves.toEqual({ pinned: true });
    await expect(asOwner.snippet.togglePin({ id: snippet.id })).resolves.toEqual({ pinned: false });
    const seeded = await Promise.all([1, 2, 3, 4].map(() => insertShare(owner.id)));
    for (const { snippet: pinned } of seeded.slice(0, 3)) await asOwner.snippet.togglePin({ id: pinned.id });
    await expect(asOwner.snippet.togglePin({ id: seeded[3].snippet.id })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("user.toggleFollow refuses to follow yourself", async () => {
    const { owner, asOwner } = await twoUsers();
    await expect(asOwner.user.toggleFollow({ targetUserId: owner.id })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
