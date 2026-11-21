import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Plan } from "@/db/schema";
import { callerFor, type Caller } from "./support/caller";
import { createUser } from "./support/factories";
import { backdate } from "./support/db";
import { element, insertShare, publish, publishInput, publishMany, stepClock, useSteppedClock } from "./support/content";

beforeEach(() => {
  useSteppedClock();
});

afterEach(() => {
  vi.useRealTimers();
});

async function setup(plan: Plan) {
  const user = await createUser(plan);
  return { user, caller: await callerFor(user) };
}

async function rejectsQuota(promise: Promise<unknown>) {
  await expect(promise).rejects.toMatchObject({ code: expect.stringMatching(/^(TOO_MANY_REQUESTS|FORBIDDEN)$/) });
}

async function privateSnippet(caller: Caller) {
  const elementId = "el_private";
  const presentation = await caller.presentation.create({ name: "Draft", elements: { [elementId]: element() } });
  return caller.snippet.create({ presentationId: presentation.id, elementId, isPublic: false });
}

describe("daily publish limits", () => {
  it.each([
    [Plan.FREE, 3],
    [Plan.PRO, 30],
    [Plan.PREMIUM, 100],
  ])("%s can publish %i snippets per day and no more", async (plan, dailyLimit) => {
    const { caller } = await setup(plan);
    await publishMany(caller, dailyLimit);
    stepClock();
    await expect(caller.publish.publish(publishInput())).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
  });

  it("re-publishing an existing snippet does not use a slot", async () => {
    const { caller } = await setup(Plan.FREE);
    const [first] = await publishMany(caller, 3);
    stepClock();
    const existing = await caller.snippet.get({ id: first.snippetId! });
    await expect(caller.publish.publish(publishInput({ elementId: existing.elementId, title: "Edited" }))).resolves.toMatchObject({
      updated: true,
    });
  });

  it("uses a rolling 24 hour window", async () => {
    const { user, caller } = await setup(Plan.FREE);
    await publishMany(caller, 3);
    await backdate(user.id, 23);
    stepClock();
    await expect(caller.publish.publish(publishInput())).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
    await backdate(user.id, 25);
    stepClock();
    await expect(caller.publish.publish(publishInput())).resolves.toMatchObject({ updated: false });
  });

  it("parallel publishes cannot exceed the limit", async () => {
    const { caller } = await setup(Plan.FREE);
    const results = await Promise.allSettled(Array.from({ length: 8 }, () => caller.publish.publish(publishInput())));
    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(3);
    for (const result of results) {
      if (result.status === "rejected") expect(result.reason).toMatchObject({ code: "TOO_MANY_REQUESTS" });
    }
  });

  it("parallel publishes across endpoints cannot exceed the limit", async () => {
    const author = await createUser(Plan.FREE);
    const source = await insertShare(author.id);
    const { caller } = await setup(Plan.FREE);
    const drafts = await Promise.all([privateSnippet(caller), privateSnippet(caller)]);
    const results = await Promise.allSettled([
      caller.publish.publish(publishInput()),
      caller.publish.publish(publishInput()),
      caller.snippet.remix({ slug: source.link.slug }),
      caller.snippet.remix({ slug: source.link.slug }),
      caller.snippet.update({ id: drafts[0].id, data: { isPublic: true } }),
      caller.snippet.update({ id: drafts[1].id, data: { isPublic: true } }),
    ]);
    expect(results.filter((result) => result.status === "fulfilled").length).toBeLessThanOrEqual(3);
  });

  it("snippet.update making a snippet public counts toward the limit", async () => {
    const { caller } = await setup(Plan.FREE);
    await publishMany(caller, 2);
    const draft = await privateSnippet(caller);
    await caller.snippet.update({ id: draft.id, data: { isPublic: true } });
    stepClock();
    await expect(caller.publish.publish(publishInput())).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
  });

  it("snippet.update cannot make a snippet public once the limit is reached", async () => {
    const { caller } = await setup(Plan.FREE);
    const draft = await privateSnippet(caller);
    await publishMany(caller, 3);
    await rejectsQuota(caller.snippet.update({ id: draft.id, data: { isPublic: true } }));
  });

  it("snippet.create, share.create and remix are blocked at the limit", async () => {
    const author = await createUser(Plan.FREE);
    const source = await insertShare(author.id);
    const { caller } = await setup(Plan.FREE);
    const draft = await privateSnippet(caller);
    await publishMany(caller, 3);
    const presentation = await caller.presentation.create({ name: "Another", elements: { el_x: element() } });
    await rejectsQuota(caller.snippet.create({ presentationId: presentation.id, elementId: "el_x", isPublic: true }));
    await rejectsQuota(caller.share.create({ snippetId: draft.id }));
    await rejectsQuota(caller.snippet.remix({ slug: source.link.slug }));
  });

  it("private drafts do not use a slot", async () => {
    const { caller } = await setup(Plan.FREE);
    await privateSnippet(caller);
    await privateSnippet(caller);
    await expect(publishMany(caller, 3)).resolves.toHaveLength(3);
  });
});

describe("live snippet limit", () => {
  async function fillLiveSlots(userId: string, caller: Caller, count: number) {
    const published = [];
    for (let index = 0; index < count; index++) {
      if (index > 0 && index % 3 === 0) await backdate(userId, 48);
      published.push(await publish(caller));
    }
    await backdate(userId, 48);
    return published;
  }

  it("Free can keep 25 live snippets and no more", async () => {
    const { user, caller } = await setup(Plan.FREE);
    await fillLiveSlots(user.id, caller, 25);
    stepClock();
    await rejectsQuota(caller.publish.publish(publishInput()));
  });

  it("deleting a snippet frees a live slot", async () => {
    const { user, caller } = await setup(Plan.FREE);
    const published = await fillLiveSlots(user.id, caller, 25);
    await caller.snippet.delete({ id: published[0].snippetId! });
    stepClock();
    await expect(caller.publish.publish(publishInput())).resolves.toMatchObject({ updated: false });
  });

  it("making a snippet public over the live limit is rejected", async () => {
    const { user, caller } = await setup(Plan.FREE);
    const draft = await privateSnippet(caller);
    await fillLiveSlots(user.id, caller, 25);
    await rejectsQuota(caller.snippet.update({ id: draft.id, data: { isPublic: true } }));
  });

  it("Pro has no live limit", async () => {
    const { user, caller } = await setup(Plan.PRO);
    await publishMany(caller, 26);
    await backdate(user.id, 48);
    stepClock();
    await expect(caller.publish.publish(publishInput())).resolves.toMatchObject({ updated: false });
  });
});
